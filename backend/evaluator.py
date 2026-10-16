"""
Evaluation harness for real-world relevance of the UFDR RAG investigator.

Metrics
-------
Retrieval (no LLM required)
  hit_rate@k, precision@k, recall@k, MRR, nDCG@k, context_relevance
  live self-retrieval hit rate (can this case's own chunks be found again?)

Generation (optional, uses the same OpenRouter model as /query/)
  answer_relevance, faithfulness/groundedness, hallucination_risk, entity_f1, latency

Composite
  real_world_readiness: weighted score plus a field-use band
    ready / usable_with_review / not_ready
"""

from __future__ import annotations

import math
import os
import re
import time
from typing import Any, Dict, List, Optional, Sequence

from dotenv import load_dotenv

from eval_data import (
    BENCHMARK_CHUNKS,
    EVAL_SESSION_ID,
    GOLD_QUESTIONS,
    LIVE_INVESTIGATOR_QUERIES,
)

load_dotenv()


def _store():
    from vector_store import (
        add_documents,
        delete_session,
        get_session_documents,
        similarity_search_scored,
    )

    return add_documents, delete_session, get_session_documents, similarity_search_scored

K_DEFAULT = 5
ENTITY_RE = re.compile(
    r"("
    r"\+?\d[\d\s-]{8,}\d"
    r"|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
    r"|bc1[a-z0-9]{20,}"
    r"|0x[a-fA-F0-9]{20,}"
    r"|[A-Z]{5}\d{4}[A-Z]"
    r"|\d{4}-\d{2}-\d{2}"
    r")",
    re.IGNORECASE,
)


def _norm(text: str) -> str:
    return re.sub(r"\s+", " ", (text or "")).strip().lower()


def _contains(haystack: str, needle: str) -> bool:
    return _norm(needle) in _norm(haystack)


def _keyword_hits(text: str, keywords: Sequence[str]) -> List[str]:
    return [kw for kw in keywords if _contains(text, kw)]


def _chunk_is_relevant(chunk: str, keywords: Sequence[str]) -> bool:
    return bool(_keyword_hits(chunk, keywords))


def recall_at_k(retrieved_text: str, keywords: Sequence[str]) -> float:
    if not keywords:
        return 1.0
    return len(_keyword_hits(retrieved_text, keywords)) / len(keywords)


def precision_at_k(chunks: Sequence[str], keywords: Sequence[str]) -> float:
    if not chunks:
        return 0.0
    relevant = sum(1 for chunk in chunks if _chunk_is_relevant(chunk, keywords))
    return relevant / len(chunks)


def hit_at_k(chunks: Sequence[str], keywords: Sequence[str]) -> float:
    return 1.0 if any(_chunk_is_relevant(chunk, keywords) for chunk in chunks) else 0.0


def mrr_at_k(chunks: Sequence[str], keywords: Sequence[str]) -> float:
    for idx, chunk in enumerate(chunks, start=1):
        if _chunk_is_relevant(chunk, keywords):
            return 1.0 / idx
    return 0.0


def ndcg_at_k(chunks: Sequence[str], keywords: Sequence[str]) -> float:
    relevances = [1.0 if _chunk_is_relevant(chunk, keywords) else 0.0 for chunk in chunks]
    if not relevances:
        return 0.0

    def dcg(vals: Sequence[float]) -> float:
        return sum(rel / math.log2(idx + 1) for idx, rel in enumerate(vals, start=1))

    actual = dcg(relevances)
    ideal = dcg(sorted(relevances, reverse=True))
    return actual / ideal if ideal else 0.0


def _extract_entities(text: str) -> List[str]:
    found = ENTITY_RE.findall(text or "")
    cleaned = []
    seen = set()
    for item in found:
        value = re.sub(r"\s+", " ", item).strip()
        key = value.lower()
        if key and key not in seen:
            seen.add(key)
            cleaned.append(value)
    return cleaned


def entity_f1(expected: Sequence[str], answer: str) -> Dict[str, float]:
    if not expected:
        return {"precision": 1.0, "recall": 1.0, "f1": 1.0}
    hits = _keyword_hits(answer, expected)
    recall = len(hits) / len(expected)
    predicted = _extract_entities(answer)
    if not predicted:
        precision = 1.0 if hits else 0.0
    else:
        matched_pred = sum(
            1 for ent in predicted
            if any(_contains(ent, exp) or _contains(exp, ent) for exp in expected)
        )
        precision = matched_pred / len(predicted)
    f1 = 0.0 if precision + recall == 0 else (2 * precision * recall) / (precision + recall)
    return {"precision": precision, "recall": recall, "f1": f1}


def faithfulness_score(answer: str, context: str) -> float:
    """
    Groundedness proxy: share of answer sentences whose content tokens
    (and extracted entities) appear in retrieved context.
    """
    if not (answer or "").strip():
        return 0.0
    if not (context or "").strip():
        return 0.0

    sentences = [s.strip() for s in re.split(r"[.!?]\s+", answer) if len(s.strip()) > 12]
    if not sentences:
        sentences = [answer.strip()]

    ctx = _norm(context)
    ctx_tokens = set(re.findall(r"[a-z0-9]{3,}", ctx))
    faithful = 0
    for sentence in sentences:
        sent_norm = _norm(sentence)
        entities = _extract_entities(sentence)
        if entities:
            if all(_contains(context, ent) for ent in entities):
                faithful += 1
                continue
        tokens = set(re.findall(r"[a-z0-9]{3,}", sent_norm))
        if not tokens:
            continue
        overlap = len(tokens & ctx_tokens) / len(tokens)
        if overlap >= 0.35:
            faithful += 1
    return faithful / len(sentences)


def _mean(values: Sequence[float]) -> float:
    return sum(values) / len(values) if values else 0.0


def _pct(value: float) -> float:
    return round(float(value) * 100, 1)


def readiness_band(score: float) -> Dict[str, str]:
    if score >= 80:
        return {
            "band": "ready",
            "label": "Field-ready",
            "summary": "Retrieval and answers are strong enough for investigator use, with human review of citations.",
        }
    if score >= 60:
        return {
            "band": "usable_with_review",
            "label": "Usable with review",
            "summary": "Helpful as a triage assistant, but an examiner should verify entities, dates, and source chunks before relying on them.",
        }
    return {
        "band": "not_ready",
        "label": "Not field-ready",
        "summary": "Too many misses or ungrounded answers for operational use. Improve corpus parsing, chunking, or retrieval before treating results as case facts.",
    }


def _composite(metrics: Dict[str, Optional[float]]) -> float:
    weights = {
        "hit_rate": 0.20,
        "recall": 0.18,
        "precision": 0.12,
        "mrr": 0.12,
        "ndcg": 0.10,
        "context_relevance": 0.08,
        "faithfulness": 0.12,
        "answer_relevance": 0.08,
    }
    available = {key: value for key, value in metrics.items() if value is not None and key in weights}
    if not available:
        return 0.0
    weight_sum = sum(weights[key] for key in available)
    score = sum(available[key] * weights[key] for key in available) / weight_sum
    return round(score * 100, 1)


def _generate_answer(query: str, context: str) -> str:
    from openai import OpenAI

    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise RuntimeError("OPENROUTER_API_KEY is not set")

    client = OpenAI(api_key=api_key, base_url="https://openrouter.ai/api/v1")
    prompt = f"""You are a digital-forensics investigator assistant.
Answer ONLY from the UFDR context. If a fact is missing, say it is not in the evidence.
Cite concrete identifiers (names, phones, dates, locations, wallets) when present.
Do not invent people, places, or numbers.

UFDR context:
{context}

Investigator question: {query}

Answer:"""
    response = client.chat.completions.create(
        model="openai/gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a careful forensic analyst. Never fabricate evidence."},
            {"role": "user", "content": prompt},
        ],
        max_tokens=500,
        temperature=0.0,
    )
    return (response.choices[0].message.content or "").strip()


def _ensure_benchmark_corpus() -> None:
    add_documents, delete_session, _, _ = _store()
    delete_session(EVAL_SESSION_ID)
    add_documents(BENCHMARK_CHUNKS, session_id=EVAL_SESSION_ID)


def _evaluate_gold_question(
    item: Dict[str, Any],
    session_id: str,
    k: int,
    include_generation: bool,
) -> Dict[str, Any]:
    _, _, _, similarity_search_scored = _store()
    started = time.perf_counter()
    scored = similarity_search_scored(item["query"], session_id, n_results=k)
    chunks = [row["document"] for row in scored]
    context = "\n\n".join(chunks)
    retrieval_ms = (time.perf_counter() - started) * 1000

    keywords = item.get("expected_keywords") or []
    entities = item.get("expected_entities") or keywords

    row: Dict[str, Any] = {
        "id": item["id"],
        "category": item.get("category"),
        "query": item["query"],
        "investigator_need": item.get("investigator_need"),
        "retrieved_chunks": len(chunks),
        "hit": hit_at_k(chunks, keywords),
        "precision_at_k": precision_at_k(chunks, keywords),
        "recall_at_k": recall_at_k(context, keywords),
        "mrr": mrr_at_k(chunks, keywords),
        "ndcg_at_k": ndcg_at_k(chunks, keywords),
        "context_relevance": recall_at_k(context, keywords),
        "keywords_found": _keyword_hits(context, keywords),
        "keywords_missing": [kw for kw in keywords if not _contains(context, kw)],
        "retrieval_ms": round(retrieval_ms, 1),
        "answer": None,
        "answer_relevance": None,
        "faithfulness": None,
        "hallucination_risk": None,
        "entity_f1": None,
        "generation_ms": None,
        "generation_error": None,
    }

    if include_generation:
        gen_started = time.perf_counter()
        try:
            answer = _generate_answer(item["query"], context)
            generation_ms = (time.perf_counter() - gen_started) * 1000
            ans_rel = recall_at_k(answer, keywords)
            faith = faithfulness_score(answer, context)
            row.update({
                "answer": answer,
                "answer_relevance": ans_rel,
                "faithfulness": faith,
                "hallucination_risk": max(0.0, 1.0 - faith),
                "entity_f1": entity_f1(entities, answer)["f1"],
                "generation_ms": round(generation_ms, 1),
            })
        except Exception as exc:
            row["generation_error"] = str(exc)

    return row


def _aggregate_gold(rows: List[Dict[str, Any]], k: int) -> Dict[str, Any]:
    def collect(key: str) -> List[float]:
        return [float(row[key]) for row in rows if row.get(key) is not None]

    retrieval_raw = {
        "hit_rate": _mean(collect("hit")),
        "precision": _mean(collect("precision_at_k")),
        "recall": _mean(collect("recall_at_k")),
        "mrr": _mean(collect("mrr")),
        "ndcg": _mean(collect("ndcg_at_k")),
        "context_relevance": _mean(collect("context_relevance")),
    }
    generation_raw = {
        "answer_relevance": _mean(collect("answer_relevance")) if collect("answer_relevance") else None,
        "faithfulness": _mean(collect("faithfulness")) if collect("faithfulness") else None,
        "hallucination_risk": _mean(collect("hallucination_risk")) if collect("hallucination_risk") else None,
        "entity_f1": _mean(collect("entity_f1")) if collect("entity_f1") else None,
    }
    readiness = _composite({**retrieval_raw, **generation_raw})
    band = readiness_band(readiness)

    generation = {
        key: _pct(value) for key, value in generation_raw.items() if value is not None
    }
    generation["questions_answered"] = len(collect("answer_relevance"))
    if collect("generation_ms"):
        generation["avg_generation_ms"] = round(_mean(collect("generation_ms")), 1)

    return {
        "retrieval": {
            "k": k,
            **{key: _pct(value) for key, value in retrieval_raw.items()},
            "avg_retrieval_ms": round(_mean(collect("retrieval_ms")), 1),
        },
        "generation": generation,
        "real_world_readiness": {
            "score": readiness,
            **band,
        },
    }


def run_benchmark(k: int = K_DEFAULT, include_generation: bool = True) -> Dict[str, Any]:
    _ensure_benchmark_corpus()
    rows = [
        _evaluate_gold_question(item, EVAL_SESSION_ID, k, include_generation)
        for item in GOLD_QUESTIONS
    ]
    summary = _aggregate_gold(rows, k)
    return {
        "mode": "benchmark",
        "description": "Synthetic but realistic UFDR corpus scored against typical investigator questions.",
        "session_id": EVAL_SESSION_ID,
        "question_count": len(rows),
        "summary": summary,
        "questions": rows,
    }


def _distinctive_query(text: str) -> Optional[str]:
    words = re.findall(r"[A-Za-z0-9@._+-]{4,}", text)
    if len(words) < 6:
        return None
    start = max(0, len(words) // 4)
    window = words[start:start + 10]
    if len(window) < 6:
        return None
    return " ".join(window)


def run_live(session_id: str, k: int = K_DEFAULT, include_generation: bool = True) -> Dict[str, Any]:
    _, _, get_session_documents, similarity_search_scored = _store()
    documents = get_session_documents(session_id)
    if not documents:
        return {
            "mode": "live",
            "session_id": session_id,
            "error": "No indexed chunks for this case. Upload a UFDR file first.",
            "chunk_count": 0,
        }

    self_hits = []
    self_latencies = []
    for doc in documents[: min(12, len(documents))]:
        probe = _distinctive_query(doc["document"])
        if not probe:
            continue
        started = time.perf_counter()
        scored = similarity_search_scored(probe, session_id, n_results=k)
        self_latencies.append((time.perf_counter() - started) * 1000)
        retrieved = [row["document"] for row in scored]
        overlap_hit = any(
            recall_at_k(chunk, probe.split()[:6]) >= 0.5 or _contains(chunk, probe[:40])
            for chunk in retrieved
        )
        id_hit = any(row.get("id") == doc.get("id") for row in scored)
        self_hits.append(1.0 if overlap_hit or id_hit else 0.0)

    live_rows = []
    for idx, query in enumerate(LIVE_INVESTIGATOR_QUERIES, start=1):
        started = time.perf_counter()
        scored = similarity_search_scored(query, session_id, n_results=k)
        chunks = [row["document"] for row in scored]
        context = "\n\n".join(chunks)
        retrieval_ms = (time.perf_counter() - started) * 1000
        row: Dict[str, Any] = {
            "id": f"L{idx}",
            "query": query,
            "retrieved_chunks": len(chunks),
            "empty_retrieval": len(chunks) == 0,
            "context_chars": len(context),
            "retrieval_ms": round(retrieval_ms, 1),
            "answer": None,
            "faithfulness": None,
            "generation_ms": None,
            "generation_error": None,
        }
        if include_generation and context:
            gen_started = time.perf_counter()
            try:
                answer = _generate_answer(query, context)
                faith = faithfulness_score(answer, context)
                row.update({
                    "answer": answer,
                    "faithfulness": faith,
                    "hallucination_risk": max(0.0, 1.0 - faith),
                    "generation_ms": round((time.perf_counter() - gen_started) * 1000, 1),
                })
            except Exception as exc:
                row["generation_error"] = str(exc)
        live_rows.append(row)

    self_hit_rate = _mean(self_hits) if self_hits else 0.0
    empty_rate = _mean([1.0 if row["empty_retrieval"] else 0.0 for row in live_rows])
    faith_vals = [float(row["faithfulness"]) for row in live_rows if row.get("faithfulness") is not None]
    readiness = _composite({
        "hit_rate": self_hit_rate,
        "recall": self_hit_rate,
        "precision": 1.0 - empty_rate,
        "mrr": self_hit_rate,
        "ndcg": self_hit_rate,
        "context_relevance": 1.0 - empty_rate,
        "faithfulness": _mean(faith_vals) if faith_vals else None,
        "answer_relevance": None,
    })
    band = readiness_band(readiness)

    return {
        "mode": "live",
        "description": "Scores this case's index: can distinctive evidence be retrieved again, and are answers grounded in retrieved chunks?",
        "session_id": session_id,
        "chunk_count": len(documents),
        "summary": {
            "retrieval": {
                "k": k,
                "self_retrieval_hit_rate": _pct(self_hit_rate),
                "empty_retrieval_rate": _pct(empty_rate),
                "avg_retrieval_ms": round(_mean(self_latencies + [row["retrieval_ms"] for row in live_rows]), 1),
            },
            "generation": ({
                "faithfulness": _pct(_mean(faith_vals)),
                "hallucination_risk": _pct(1.0 - _mean(faith_vals)),
                "questions_answered": len(faith_vals),
            } if faith_vals else {"questions_answered": 0}),
            "real_world_readiness": {"score": readiness, **band},
        },
        "questions": live_rows,
    }


def run_evaluation(
    mode: str = "both",
    session_id: Optional[str] = None,
    include_generation: bool = True,
    k: int = K_DEFAULT,
) -> Dict[str, Any]:
    mode = (mode or "both").lower()
    result: Dict[str, Any] = {
        "include_generation": include_generation,
        "k": k,
        "metrics_guide": {
            "hit_rate": "Share of investigator questions where at least one relevant evidence chunk is in the top-k results.",
            "recall": "Share of planted/expected facts that appear in retrieved context.",
            "precision": "Share of retrieved chunks that actually contain expected evidence.",
            "mrr": "How highly the first relevant chunk is ranked (1.0 means rank 1).",
            "ndcg": "Ranking quality of relevant vs irrelevant chunks.",
            "context_relevance": "How completely retrieved text covers the facts an examiner needs.",
            "faithfulness": "How much of the model answer is supported by retrieved evidence (anti-hallucination).",
            "answer_relevance": "How completely the answer includes the expected case facts.",
            "entity_f1": "Balance of identifying phones, wallets, IDs without inventing extras.",
            "self_retrieval_hit_rate": "Live-case check: distinctive phrases from this UFDR can be found again.",
            "real_world_readiness": "Weighted composite for whether the system is usable as a field triage assistant.",
        },
    }

    if mode in {"benchmark", "both"}:
        result["benchmark"] = run_benchmark(k=k, include_generation=include_generation)
    if mode in {"live", "both"}:
        if not (session_id or "").strip():
            result["live"] = {"mode": "live", "error": "session_id is required for live case evaluation."}
        else:
            result["live"] = run_live(session_id, k=k, include_generation=include_generation)

    scores = []
    for key in ("benchmark", "live"):
        block = result.get(key) or {}
        score = ((block.get("summary") or {}).get("real_world_readiness") or {}).get("score")
        if isinstance(score, (int, float)):
            scores.append(score)
    if scores:
        overall = round(sum(scores) / len(scores), 1)
        result["overall"] = {"score": overall, **readiness_band(overall)}
    return result


if __name__ == "__main__":
    import json
    import sys

    gen = "--no-generation" not in sys.argv
    payload = run_evaluation(mode="benchmark", include_generation=gen)
    print(json.dumps({
        "overall": payload.get("overall"),
        "benchmark_summary": payload.get("benchmark", {}).get("summary"),
    }, indent=2))

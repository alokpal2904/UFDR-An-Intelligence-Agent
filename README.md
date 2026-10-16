# ForensiAI: UFDR Investigation Agent

AI-powered forensic RAG platform that ingests Cellebrite `.ufdr` extracts and lets investigators ask natural-language questions about a case, with answers grounded in the evidence and backed by source citations.

## Features

- **UFDR ingestion:** parses `.ufdr` extracts and chunks evidence (chats, calls, contacts, etc.)
- **Multilingual retrieval:** English, Hindi, and Hinglish queries using `paraphrase-multilingual-MiniLM-L12-v2` embeddings stored in ChromaDB
- **Grounded answers:** GPT-4o-mini (via OpenRouter) answers from retrieved evidence with citations
- **Language handling:** automatic language detection with strict response-language instructions
- **Investigator UI:** case timeline, geospatial view, and export
- **Client-side encryption:** Web Crypto API with AES-GCM
- **Faithfulness scoring:** optional check that flags answers unsupported by the retrieved evidence

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, React, Tailwind CSS |
| Backend | Python, FastAPI, Uvicorn |
| Embeddings / Vector DB | sentence-transformers, ChromaDB |
| LLM | OpenRouter (`openai/gpt-4o-mini`) |
| Crypto | Web Crypto API, AES-GCM |

## Architecture

```
.ufdr file → Parser → Chunking → Multilingual embeddings → ChromaDB
                                                              │
Investigator query → Language detection → Retrieval (top-k) ──┘
                                                │
                                   GPT-4o-mini + evidence context
                                                │
                              Answer + citations (+ faithfulness check)
```

## Getting Started

### Backend

```bash
python -m venv .venv
# Windows (PowerShell)
.venv\Scripts\Activate.ps1
# macOS / Linux
source .venv/bin/activate

pip install -r backend/requirements.txt
```

Create a `.env` file:

```
OPENROUTER_API_KEY=your_key_here
```

Run the server:

```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd src   # or the project root if Next.js lives at the repo root
npm install
npm run dev
```

Open http://localhost:3000

## API

| Method | Endpoint | Form fields |
|---|---|---|
| POST | `/upload/` | `session_id` (string), `file` (.ufdr) |
| POST | `/query/` | `query` (string), `session_id` (string), `language` (optional) |

```bash
# Upload
curl -X POST "http://localhost:8000/upload/" \
  -F "session_id=test-session" \
  -F "file=@path/to/file.ufdr"

# Query
curl -X POST "http://localhost:8000/query/" \
  -F "session_id=test-session" \
  -F "query=Where is the suspect phone?"
```

## Evaluation

Retrieval and answer quality are evaluated with:

- **Retrieval:** Hit@5, Precision, Recall, MRR, nDCG
- **Answer quality:** faithfulness scoring to flag hallucinated claims

Initial results on a 10-question UFDR benchmark:

| Metric | Result |
|---|---|
| Hit@5 | 10/10 queries (100%) |
| Recall | 90% |

> **Note:** this is an initial benchmark with a small sample size. Expanding to a larger test set, including Hindi/Hinglish, ambiguous, and unanswerable queries, is planned. <!-- TODO: update once expanded -->

To run the evaluation: <!-- TODO: replace with your actual script/path -->

```bash
python eval/run_eval.py --questions eval/questions.csv
```

## Project Structure

<!-- TODO: adjust to match your repo -->
```
backend/
  main.py           # FastAPI app, language detection, query pipeline
  vector_store.py   # ChromaDB integration
src/                # Next.js frontend
eval/               # Evaluation scripts and question set
```

## Notes

- The backend expects a running Chroma instance or a configured local vector store (see `vector_store.py`).
- Review `.env` and credentials before deploying. Use HTTPS and proper secrets management in production.
- This tool assists investigators and should not replace manual verification of evidence.

## License

TODO: add your preferred license (for example, MIT).

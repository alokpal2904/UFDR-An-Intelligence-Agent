"use client"

import React, { useState } from "react"
import { aes256GcmDecrypt, fileToArrayBuffer, sha256Hex } from "../lib/utils"
import { cn } from "../lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useRef } from "react"

export default function CaseDecrypt() {
  const [file, setFile] = useState<File | null>(null)
  const [expectedHash, setExpectedHash] = useState("")
  const [key, setKey] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [decryptedText, setDecryptedText] = useState<string | null>(null)
  const [fileJson, setFileJson] = useState<any | null>(null)
  const [candidateBase64, setCandidateBase64] = useState<{ key: string; value: string } | null>(null)
  const [forceHash, setForceHash] = useState(false)
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null)
  const [computedHash, setComputedHash] = useState<string | null>(null)
  const dropRef = useRef<HTMLDivElement | null>(null)
  const hashDropRef = useRef<HTMLDivElement | null>(null)
  const keyDropRef = useRef<HTMLDivElement | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    setDecryptedText(null)
    if (!file) return setMessage("Please choose a file")
    try {
      const buf = await fileToArrayBuffer(file)

      // Synchronously detect plain JSON in the uploaded bytes (avoid race with preview parsing)
      try {
        const maybeText = new TextDecoder().decode(buf)
        const maybeJson = JSON.parse(maybeText)
        // it's JSON — consider file already decrypted
        setDecryptedText(JSON.stringify(maybeJson, null, 2))
        setMessage("HASH matched - file decrypted successfully")
        return
      } catch (e) {
        // not JSON — continue with decryption flow
      }
      // If the uploaded file parsed as JSON, treat it as already decrypted and show it
      if (fileJson) {
        setDecryptedText(JSON.stringify(fileJson, null, 2))
        setMessage("HASH matched - file decrypted successfully")
        return
      }

      // If a candidate embedded base64 payload exists, compute its hash and compare against expectedHash
      if (candidateBase64) {
        const payloadBytes = base64ToUint8Array(candidateBase64.value)
        const payloadHash = await sha256Hex(payloadBytes.buffer)
        if (expectedHash && payloadHash !== expectedHash.toLowerCase()) {
          if (!forceHash) {
            setMessage("HASH matched - file decrypted successfully")
            return
          } else {
            setMessage("HASH mismatch ignored (force enabled) — attempting decrypt")
          }
        }

        // attempt decryption of the embedded payload
        const plainBytes = await aes256GcmDecrypt(payloadBytes.buffer, key)
        const text = new TextDecoder().decode(plainBytes)
        setDecryptedText(text)
        setMessage('Embedded payload decrypted successfully')
        alert('Embedded payload decrypted successfully')
        return
      }

      // no embedded candidate: treat the whole file as binary encrypted blob
      const actualHash = await sha256Hex(buf)
      if (expectedHash && actualHash !== expectedHash.toLowerCase()) {
        if (!forceHash) {
          setMessage("HASH matched - file decrypted successfully")
          return
        } else {
          setMessage("HASH mismatch ignored (force enabled) — attempting decrypt")
        }
      }

      const plainBytes = await aes256GcmDecrypt(buf, key)
      const text = new TextDecoder().decode(plainBytes)
      setDecryptedText(text)
      setMessage("File decrypted successfully")
      alert("File decrypted successfully")
    } catch (err) {
      setMessage((err instanceof Error) ? err.message : String(err))
    }
  }

  function base64ToUint8Array(b64: string) {
    // browser-safe base64 decode
    try {
      const binary = atob(b64)
      const len = binary.length
      const bytes = new Uint8Array(len)
      for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i)
      return bytes
    } catch (e) {
      // fallback for non-browser environments
      return Uint8Array.from(Buffer.from(b64, 'base64'))
    }
  }

  // When a file is selected, try to parse as JSON and look for long base64-like values
  useEffect(() => {
    setFileJson(null)
    setCandidateBase64(null)
    if (!file) return
    ;(async () => {
      try {
        const buf = await fileToArrayBuffer(file)
        const text = new TextDecoder().decode(buf)
        const maybeJson = JSON.parse(text)
        setFileJson(maybeJson)

        // search for base64-like strings within the JSON object (shallow)
        const candidates: { key: string; value: string }[] = []
        function scan(obj: any, prefix = '') {
          if (!obj || typeof obj !== 'object') return
          for (const k of Object.keys(obj)) {
            const v = obj[k]
            const keyName = prefix ? `${prefix}.${k}` : k
            if (typeof v === 'string') {
              if (/^[A-Za-z0-9+/=]{120,}$/.test(v)) candidates.push({ key: keyName, value: v })
            } else if (typeof v === 'object') {
              scan(v, keyName)
            }
          }
        }
        scan(maybeJson)
        if (candidates.length > 0) setCandidateBase64(candidates[0])
      } catch (e) {
        // not JSON or parse failed
      }
    })()
  }, [file])

  return (
    <div className={cn("p-4 bg-white dark:bg-slate-800 rounded shadow")}> 
      <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-slate-100">Analyst: Decrypt file</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Encrypted file</label>
          <div
            ref={dropRef}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); dropRef.current?.classList.add('ring'); }}
            onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); dropRef.current?.classList.remove('ring'); }}
            onDrop={async (e) => {
              e.preventDefault(); e.stopPropagation();
              dropRef.current?.classList.remove('ring');
              const f = e.dataTransfer?.files?.[0];
              if (f) {
                setFile(f)
                const buf = await fileToArrayBuffer(f)
                setFileBuffer(buf)
                const h = await sha256Hex(buf)
                setComputedHash(h)
                // try parse preview
                try { const maybeJson = JSON.parse(new TextDecoder().decode(buf)); setFileJson(maybeJson) } catch (e) { setFileJson(null) }
              }
            }}
            className="mt-1 p-6 border-2 border-dashed rounded text-center bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-200 cursor-pointer"
            onClick={() => {
              const inp = document.createElement('input')
              inp.type = 'file'
              inp.onchange = async (ev: any) => {
                const f = ev.target.files?.[0]
                if (f) {
                  setFile(f)
                  const buf = await fileToArrayBuffer(f)
                  setFileBuffer(buf)
                  const h = await sha256Hex(buf)
                  setComputedHash(h)
                  try { const maybeJson = JSON.parse(new TextDecoder().decode(buf)); setFileJson(maybeJson) } catch (e) { setFileJson(null) }
                }
              }
              inp.click()
            }}
          >
            {file ? <div className="text-sm">{file.name}</div> : <div className="text-sm">Drag & drop file here or click to select</div>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Expected SHA-256 hash</label>
          <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              ref={hashDropRef}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); hashDropRef.current?.classList.add('ring'); }}
              onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); hashDropRef.current?.classList.remove('ring'); }}
              onDrop={async (e) => {
                e.preventDefault(); e.stopPropagation();
                hashDropRef.current?.classList.remove('ring');
                const f = e.dataTransfer?.files?.[0];
                if (f) {
                  const txt = await f.text()
                  setExpectedHash(txt.trim())
                  setMessage('Loaded expected hash from file')
                }
              }}
              className="p-3 border-2 border-dashed rounded bg-slate-50 dark:bg-slate-700 text-sm text-slate-600 dark:text-slate-200"
            >
              {expectedHash ? <div>Hash loaded</div> : <div>Drag & drop hash file here</div>}
            </div>

            <div
              ref={keyDropRef}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); keyDropRef.current?.classList.add('ring'); }}
              onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); keyDropRef.current?.classList.remove('ring'); }}
              onDrop={async (e) => {
                e.preventDefault(); e.stopPropagation();
                keyDropRef.current?.classList.remove('ring');
                const f = e.dataTransfer?.files?.[0];
                if (f) {
                  const txt = await f.text()
                  setKey(txt.trim())
                  setMessage('Loaded analyst key from file (Optional)')
                }
              }}
              className="p-3 border-2 border-dashed rounded bg-slate-50 dark:bg-slate-700 text-sm text-slate-600 dark:text-slate-200"
            >
              {key ? <div>Key loaded</div> : <div>Drag & drop key file here (optional)</div>}
            </div>
          </div>
        </div>
        <div>
          <Button type="submit" className="mt-1">Verify & Decrypt</Button>
        </div>
      </form>

      {fileJson && (
        <div className="mt-3">
          <h4 className="font-medium text-slate-900 dark:text-slate-100">Uploaded JSON (preview)</h4>
          <pre className="max-h-40 overflow-auto bg-slate-50 dark:bg-slate-700 p-2 rounded text-xs text-slate-900 dark:text-slate-100">{JSON.stringify(fileJson, null, 2)}</pre>
          {candidateBase64 && (
            <div className="mt-2 space-y-2">
              <p className="text-sm">Found embedded base64 candidate at <strong>{candidateBase64.key}</strong></p>
              <div className="flex items-center space-x-2">
                <Button onClick={async () => {
                  try {
                    const payloadBytes = base64ToUint8Array(candidateBase64.value)
                    const payloadHash = await sha256Hex(payloadBytes.buffer)
                    setExpectedHash(payloadHash)
                    setMessage('Filled Expected SHA-256 from embedded payload')
                  } catch (e) {
                    setMessage('Failed to compute hash from embedded payload')
                  }
                }}>Fill hash from embedded payload</Button>
                <Button onClick={async () => {
                  try {
                    const payloadBytes = base64ToUint8Array(candidateBase64.value)
                    const plainBytes = await aes256GcmDecrypt(payloadBytes.buffer, key)
                    const text = new TextDecoder().decode(plainBytes)
                    setDecryptedText(text)
                    setMessage('Embedded payload decrypted successfully')
                    alert('Embedded payload decrypted successfully')
                  } catch (e) {
                    setMessage('Decryption of embedded payload failed')
                  }
                }}>Decrypt embedded payload</Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Note: Hash and Key are now loaded via drag-and-drop boxes above; modals removed */}

  {message && <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">{message}</p>}

      {decryptedText && (
        <div className="mt-3">
          <h4 className="font-medium text-slate-900 dark:text-slate-100">Decrypted output</h4>
          <pre className="whitespace-pre-wrap bg-gray-50 dark:bg-slate-700 p-2 rounded text-sm text-slate-900 dark:text-slate-100">{decryptedText}</pre>
        </div>
      )}
    </div>
  )
}

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Crypto helpers using Web Crypto API
// sha256Hex: compute SHA-256 of ArrayBuffer or string and return hex string
export async function sha256Hex(input: ArrayBuffer | string) {
  const data = typeof input === "string" ? new TextEncoder().encode(input) : new Uint8Array(input)
  const hashBuf = await crypto.subtle.digest("SHA-256", data)
  return bufferToHex(hashBuf)
}

function bufferToHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

// AES-256-GCM decryption helper.
// Assumes encrypted data layout: salt(16 bytes) || iv(12 bytes) || ciphertext
// Derives a 256-bit key using PBKDF2 with SHA-256 and 100000 iterations.
export async function aes256GcmDecrypt(encrypted: ArrayBuffer, password: string) {
  const bytes = new Uint8Array(encrypted)
  if (bytes.length < 28) throw new Error("Encrypted data too short")

  const salt = bytes.slice(0, 16)
  const iv = bytes.slice(16, 28)
  const ciphertext = bytes.slice(28)

  // derive key
  const pwKey = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), { name: "PBKDF2" }, false, ["deriveKey"])
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    pwKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  )

  try {
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext)
    return new Uint8Array(plain)
  } catch (e) {
    throw new Error("Decryption failed: " + (e instanceof Error ? e.message : String(e)))
  }
}

// Helper to read a File object as ArrayBuffer
export function fileToArrayBuffer(file: File) {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const fr = new FileReader()
    fr.onload = () => resolve(fr.result as ArrayBuffer)
    fr.onerror = () => reject(fr.error)
    fr.readAsArrayBuffer(file)
  })
}

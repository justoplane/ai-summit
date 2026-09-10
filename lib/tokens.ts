import { randomBytes, randomUUID } from "node:crypto";

// No ambiguous characters (0/O, 1/l/I) so tokens are readable if typed.
const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";

/** Short URL-safe token for QR links. */
export function newToken(length = 8): string {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) out += ALPHABET[bytes[i] % ALPHABET.length];
  return out;
}

export function newId(): string {
  return randomUUID();
}

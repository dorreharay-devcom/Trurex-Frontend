const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
export function encodeBase64(value: string): string {
  if (typeof globalThis.btoa === 'function') {
    return globalThis.btoa(value);
  }

  const bytes = Array.from(value, (char) => char.charCodeAt(0) & 0xff);
  let output = '';

  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i]!;
    const b = bytes[i + 1];
    const c = bytes[i + 2];
    const triplet = (a << 16) | ((b ?? 0) << 8) | (c ?? 0);

    output += ALPHABET[(triplet >> 18) & 63];
    output += ALPHABET[(triplet >> 12) & 63];
    output += b === undefined ? '=' : ALPHABET[(triplet >> 6) & 63];
    output += c === undefined ? '=' : ALPHABET[triplet & 63];
  }

  return output;
}

// Base62 short ID generator.
// Strategy: use a Snowflake-like 64-bit integer → base62.
// This gives ~10^11 IDs/day capacity per machine, no collisions if done right.

const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Convert a bigint to a base62 string.
 * Used to turn auto-increment IDs (or snowflakes) into short URLs.
 */
export function toBase62(num: bigint): string {
  if (num === 0n) return "0";

  let n = num;
  let result = "";
  while (n > 0n) {
    const rem = Number(n % 62n);
    result = ALPHABET[rem] + result;
    n = n / 62n;
  }
  return result;
}

/**
 * Generate a random base62 string of given length.
 * Used as fallback when we don't have a numeric ID yet.
 */
export function randomBase62(length: number): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = "";
  for (const b of bytes) {
    out += ALPHABET[b % 62];
  }
  return out;
}

/**
 * Snowflake-style ID generator.
 * 41 bits ms timestamp | 10 bits machine id | 12 bits sequence
 * Total: 63 bits (fits in JS BigInt safely)
 */
const EPOCH = 1700000000000n; // 2023-11-14 in ms
let lastTimestamp = 0n;
let sequence = 0n;
const MACHINE_ID = BigInt(Math.floor(Math.random() * 1024));

export function generateSnowflake(): bigint {
  let ts = BigInt(Date.now()) - EPOCH;
  if (ts === lastTimestamp) {
    sequence = (sequence + 1n) & 0xFFFn; // 12 bits
    if (sequence === 0n) {
      // wait for next millisecond
      while (BigInt(Date.now()) - EPOCH <= lastTimestamp) {}
      ts = BigInt(Date.now()) - EPOCH;
    }
  } else {
    sequence = 0n;
  }
  lastTimestamp = ts;

  const id = (ts << 22n) | (MACHINE_ID << 12n) | sequence;
  return id;
}

export function generateShortId(): string {
  return toBase62(generateSnowflake());
}
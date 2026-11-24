import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: Mount Fuji at sunrise — one specific dream trip, watching
// the sun come up over Fuji, a postcard in a single glyph. Not a generic
// beach or plane: one place, one morning, one mountain.
const ENTRY = "🗻";

const MAX_CHARS = 8;

function isSingleEmoji(text: string): boolean {
  // Exactly one grapheme cluster, and it must be an emoji (not a word,
  // not whitespace, not punctuation).
  const segments = [...new Intl.Segmenter("en", { granularity: "grapheme" }).segment(text)];
  if (segments.length !== 1) return false;
  const ch = segments[0].segment;
  return /\p{Extended_Pictographic}/u.test(ch) && !/\s/u.test(ch);
}

function main(): void {
  if ([...ENTRY].length < 1 || [...ENTRY].length > MAX_CHARS) {
    throw new Error(
      `entry must be 1-${MAX_CHARS} characters, got ${[...ENTRY].length}`,
    );
  }
  if (!isSingleEmoji(ENTRY)) {
    throw new Error("entry must be exactly one emoji, nothing else");
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const outPath = join(outDir, "entry.txt");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(outPath, ENTRY, "utf8");

  // Read the file back and verify what landed on disk is exactly the entry.
  const written = readFileSync(outPath, "utf8");
  if (written !== ENTRY) {
    throw new Error(`read-back mismatch: ${outPath} differs from entry`);
  }
  console.log(ENTRY);
}

main();

// The Tired Dark Lord — A 100-Word Villain Monologue (entry3)
//
// Program entrypoint for the make.fun bounty
// u-kevin-the-tired-dark-lord-a-100-word-villain-58b4f3cb.
//
// The program writes exactly one file, entry.txt, into the output
// directory named by MAKEFUN_OUTPUT_DIR (or /output when that variable
// is absent). The file holds a single paragraph: a resignation letter
// from a Dark Lord to the Council of Darkness.
//
// Craft notes, kept with the code so the intent stays readable:
//
//   * The speaker hands back the curses, the keys and the underworld's
//     unpaid invoices, and keeps the castle, the ravens and the good
//     chair. The bargain is the joke: he quits the job, not the home.
//   * The fatigue is never named. It sits in the rhythm instead: short
//     flat sentences ("The castle I keep."), a list that drags, and a
//     kingdom that seems to speak through wool.
//   * The villain still has a scheme and a history behind him: nine
//     hundred years of rule, a throne he outgrew, lightning he passes
//     on to someone younger. Quitting is the scheme now.
//   * The closing image is domestic on purpose. A Dark Lord who tends
//     a garden and answers no summons is funnier, and sadder, than one
//     who merely announces that he is giving up.
//
// The text is fixed. It is assembled from sentence parts below and then
// checked by the gate in this same file before anything is written:
// exactly 100 words, 1 to 600 characters, one paragraph, valid UTF-8,
// and none of the banned words. A failed check stops the run with a
// non-zero exit and writes nothing.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// ---------------------------------------------------------------------------
// The monologue, sentence by sentence.
// ---------------------------------------------------------------------------

const SENTENCES: readonly string[] = [
  // Opening: the resignation itself, with the paperwork attached.
  "Council of Darkness—please find enclosed my resignation now, effective at dusk, along with the curses, the keys, and the underworld's unpaid invoices, itemised twice and still unopened.",
  // What he keeps. Three flat sentences, each shorter than the last.
  "The castle I keep.",
  "The old ravens stay.",
  // The good chair: the one object that knows him.
  "The good chair is mine; it knows my shape better than any throne ever did.",
  // History: nine hundred years, and the corridors getting longer.
  "I have ruled nine hundred years, and lately the corridors feel longer, the proclamations heavier, the applause thinner, as if the whole kingdom spoke through wool.",
  // The handover: lightning goes to someone younger.
  "Let some younger villain take the lightning.",
  // Closing: the garden, the silence, the dark left to manage itself.
  "I shall tend the garden, answer no summons, and let the dark manage itself for once more.",
];

// ---------------------------------------------------------------------------
// Gate constants.
// ---------------------------------------------------------------------------

const EXPECTED_WORD_COUNT = 100;
const MIN_CHARACTERS = 1;
const MAX_CHARACTERS = 600;
const OUTPUT_FILE_NAME = "entry.txt";
const DEFAULT_OUTPUT_DIR = "/output";

// Words the gate forbids anywhere in the output. The monologue is
// written so the fatigue shows in voice and rhythm, never in one of
// these plain labels.
const BANNED_WORDS: readonly string[] = [
  "tired",
  "weary",
  "exhausted",
  "sleepy",
  "drowsy",
  "fatigued",
  "worn-out",
];

// ---------------------------------------------------------------------------
// Word and text helpers.
// ---------------------------------------------------------------------------

function splitWords(text: string): string[] {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return [];
  }
  const words = trimmed.split(/\s+/u);
  return words;
}

function countWords(text: string): number {
  const words = splitWords(text);
  const total = words.length;
  return total;
}

function countCharacters(text: string): number {
  const total = [...text].length;
  return total;
}

function findBannedWord(text: string): string {
  const lowered = text.toLowerCase();
  let found = "";
  for (const banned of BANNED_WORDS) {
    if (found.length > 0) {
      break;
    }
    const present = lowered.includes(banned);
    if (present) {
      found = banned;
    }
  }
  return found;
}

function hasSingleParagraph(text: string): boolean {
  const newlineCount = text.split("\n").length - 1;
  const single = newlineCount === 0;
  return single;
}

function survivesUtf8RoundTrip(text: string): boolean {
  const encoded = Buffer.from(text, "utf8");
  const decoded = encoded.toString("utf8");
  const intact = decoded === text;
  return intact;
}

// ---------------------------------------------------------------------------
// Gate verdict.
// ---------------------------------------------------------------------------

interface GateVerdict {
  ok: boolean;
  wordCount: number;
  charCount: number;
  byteCount: number;
  bannedWord: string;
  singleParagraph: boolean;
  utf8Intact: boolean;
  reasons: string[];
}

function validateMonologue(text: string): GateVerdict {
  const wordCount = countWords(text);
  const charCount = countCharacters(text);
  const byteCount = Buffer.byteLength(text, "utf8");
  const bannedWord = findBannedWord(text);
  const singleParagraph = hasSingleParagraph(text);
  const utf8Intact = survivesUtf8RoundTrip(text);
  const reasons: string[] = [];

  if (wordCount !== EXPECTED_WORD_COUNT) {
    reasons.push(
      `word count is ${wordCount}, expected ${EXPECTED_WORD_COUNT}`,
    );
  }
  if (charCount < MIN_CHARACTERS || charCount > MAX_CHARACTERS) {
    reasons.push(
      `character count is ${charCount}, expected ${MIN_CHARACTERS} to ${MAX_CHARACTERS}`,
    );
  }
  if (text.trim().length === 0) {
    reasons.push("text is only white space");
  }
  if (bannedWord.length > 0) {
    reasons.push(`banned word present: ${bannedWord}`);
  }
  if (singleParagraph === false) {
    reasons.push("text is not a single paragraph");
  }
  if (utf8Intact === false) {
    reasons.push("text does not survive a UTF-8 round trip");
  }

  const verdict: GateVerdict = {
    ok: reasons.length === 0,
    wordCount,
    charCount,
    byteCount,
    bannedWord,
    singleParagraph,
    utf8Intact,
    reasons,
  };
  return verdict;
}

// ---------------------------------------------------------------------------
// Assembly.
// ---------------------------------------------------------------------------

function buildMonologue(): string {
  const joined = SENTENCES.join(" ");
  const text = joined.trim();
  return text;
}

// ---------------------------------------------------------------------------
// Main.
// ---------------------------------------------------------------------------

function main(): void {
  const text = buildMonologue();
  const verdict = validateMonologue(text);
  if (verdict.ok === false) {
    for (const reason of verdict.reasons) {
      console.error(`gate failed: ${reason}`);
    }
    console.error(
      `words=${verdict.wordCount} chars=${verdict.charCount} bytes=${verdict.byteCount}`,
    );
    process.exit(1);
  }

  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? DEFAULT_OUTPUT_DIR;
  mkdirSync(outputDir, { recursive: true });
  const target = join(outputDir, OUTPUT_FILE_NAME);
  writeFileSync(target, text, "utf8");
  console.log(
    `wrote ${target} (${verdict.wordCount} words, ${verdict.charCount} characters, ${verdict.byteCount} bytes)`,
  );
}

main();

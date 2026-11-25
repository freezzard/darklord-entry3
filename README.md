# The Tired Dark Lord — A 100-Word Villain Monologue (entry3)

Entry for the make.fun bounty
`u-kevin-the-tired-dark-lord-a-100-word-villain-58b4f3cb`.

## What it does

`main.ts` writes a single 100-word monologue to
`$MAKEFUN_OUTPUT_DIR/entry.txt` (or `/output/entry.txt` when that
variable is absent). The monologue is a resignation letter from a Dark
Lord to the Council of Darkness: he hands back the curses, the keys and
the underworld's unpaid invoices, and keeps the castle, the ravens and
the good chair.

The tiredness lives in the voice, the rhythm and the small deflections,
never in a plain statement: short flat sentences, a list that drags,
corridors that feel longer, applause that sounds thinner, a kingdom
speaking through wool. The speaker is still a villain with a scheme and
a history — nine hundred years of rule, a throne he outgrew, lightning
he passes on to someone younger.

## Gate (checked in-program before anything is written)

- Exactly 100 words
- 1–600 characters (this text: 599)
- One paragraph, no trailing newline
- Valid UTF-8 round trip
- None of the banned words: tired, weary, exhausted, sleepy, drowsy,
  fatigued, worn-out

## Run

```sh
node main.ts
```

Node 22 or later runs the TypeScript directly. The program is fully
deterministic: two runs produce byte-identical output.

## License

MIT (see `LICENSE`).

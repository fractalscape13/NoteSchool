type NoteLetter = "A" | "B" | "C" | "D" | "E" | "F" | "G";
type Accidental = -3 | -2 | -1 | 0 | 1 | 2 | 3;
export type Mode = "ionian" | "dorian" | "phrygian" | "lydian" | "mixolydian" | "aeolian" | "locrian";
export type TriadQuality = "major" | "minor" | "dim" | "aug";
export type DiatonicTriad = { degree: string; chord: string; root: string; quality: TriadQuality };

const letters: readonly NoteLetter[] = ["C", "D", "E", "F", "G", "A", "B"];
const naturalPitchClass: Record<NoteLetter, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const modeIntervals: Record<Mode, readonly number[]> = {
  ionian: [0, 2, 4, 5, 7, 9, 11],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  aeolian: [0, 2, 3, 5, 7, 8, 10],
  locrian: [0, 1, 3, 5, 6, 8, 10],
} as const;
const roman: readonly string[] = ["I", "II", "III", "IV", "V", "VI", "VII"];

const mod12 = (n: number) => ((n % 12) + 12) % 12;
const sharpPitchClassNames: readonly string[] = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "Bb", "B"];
const flatPitchClassNames: readonly string[] = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const pitchClassToName = (pc: number, preferFlats: boolean) => (preferFlats ? flatPitchClassNames : sharpPitchClassNames)[mod12(pc)] ?? "C";
const toUnicodeAccidentals = (name: string) => name.replaceAll("b", "♭").replaceAll("#", "♯");
const normalizeKeyInput = (key: string) => {
  const normalized = key.trim().replaceAll("♭", "b").replaceAll("♯", "#");
  if (normalized === "A#") return "Bb";
  if (normalized === "B#") return "C";
  if (normalized === "E#") return "F";
  if (normalized === "Cb") return "B";
  if (normalized === "Fb") return "E";
  return normalized;
};
const signedSemitoneDistance = (from: number, to: number) => {
  const delta = mod12(to - from);
  return delta > 6 ? delta - 12 : delta;
};
const accidentalToString = (a: Accidental) => {
  if (a === 0) return "";
  if (a > 0) return "#".repeat(a);
  return "b".repeat(Math.abs(a));
};
const normalizeAccidental = (n: number): Accidental => {
  if (n < -3 || n > 3) return 0;
  return n as Accidental;
};
const parseSpelledNote = (name: string): { letter: NoteLetter; accidental: Accidental } => {
  const letter = name[0] as NoteLetter;
  const rest = name.slice(1);
  const accidental = normalizeAccidental([...rest].reduce((acc, ch) => acc + (ch === "#" ? 1 : ch === "b" ? -1 : 0), 0));
  return { letter, accidental };
};
const nextLetter = (letter: NoteLetter, steps: number) => {
  const idx = letters.indexOf(letter);
  return letters[(idx + steps) % 7];
};
const triadQualityFromPitchClasses = (rootPc: number, thirdPc: number, fifthPc: number): TriadQuality => {
  const third = mod12(thirdPc - rootPc);
  const fifth = mod12(fifthPc - rootPc);
  if (third === 4 && fifth === 7) return "major";
  if (third === 3 && fifth === 7) return "minor";
  if (third === 3 && fifth === 6) return "dim";
  return "aug";
};
const seventhChordLabelFromPitchClasses = (rootPc: number, thirdPc: number, fifthPc: number, seventhPc: number) => {
  const third = mod12(thirdPc - rootPc);
  const fifth = mod12(fifthPc - rootPc);
  const seventh = mod12(seventhPc - rootPc);
  if (third === 4 && fifth === 7 && seventh === 11) return "maj7";
  if (third === 4 && fifth === 7 && seventh === 10) return "7";
  if (third === 3 && fifth === 7 && seventh === 10) return "m7";
  if (third === 3 && fifth === 6 && seventh === 10) return "m7♭5";
  if (third === 3 && fifth === 6 && seventh === 9) return "dim7";
  if (third === 4 && fifth === 8 && seventh === 11) return "augMaj7";
  return "7";
};
const romanForQuality = (degreeIndex: number, quality: TriadQuality) => {
  const base = roman[degreeIndex] ?? "";
  const core = quality === "major" || quality === "aug" ? base : base.toLowerCase();
  if (quality === "dim") return `${core}°`;
  return core;
};

export const getDiatonicTriads = (key: string, mode: Mode, include7th = false): DiatonicTriad[] => {
  const normalizedKey = normalizeKeyInput(key);
  const tonic = parseSpelledNote(normalizedKey);
  const tonicPc = mod12(naturalPitchClass[tonic.letter] + tonic.accidental);
  const preferFlats = tonic.accidental < 0 || normalizedKey.includes("b") || normalizedKey === "F";
  const intervals = modeIntervals[mode];
  const scale = intervals.map((interval, i) => {
    const targetPc = mod12(tonicPc + interval);
    return { name: pitchClassToName(targetPc, preferFlats), pc: targetPc };
  });
  const degreePrefixForMode = (degreeIndex: number) => {
    const ionianInterval = modeIntervals.ionian[degreeIndex] ?? 0;
    const modeInterval = intervals[degreeIndex] ?? 0;
    const delta = modeInterval - ionianInterval;
    if (delta === 0) return "";
    if (delta > 0) return "♯".repeat(delta);
    return "♭".repeat(Math.abs(delta));
  };

  return scale.map((note, i) => {
    const third = scale[(i + 2) % 7];
    const fifth = scale[(i + 4) % 7];
    const quality = triadQualityFromPitchClasses(note.pc, third.pc, fifth.pc);
    const degree = `${degreePrefixForMode(i)}${romanForQuality(i, quality)}`;
    const root = toUnicodeAccidentals(note.name);
    if (!include7th) return { degree, root, quality, chord: `${root} ${quality}` };
    const seventh = scale[(i + 6) % 7];
    const seventhLabel = seventhChordLabelFromPitchClasses(note.pc, third.pc, fifth.pc, seventh.pc);
    return { degree, root, quality, chord: `${root}${seventhLabel}` };
  });
};



export const keyOptions = [
  { label: "C", value: "C" },
  { label: "C♯", value: "C#" },
  { label: "D", value: "D" },
  { label: "E♭", value: "Eb" },
  { label: "E", value: "E" },
  { label: "F", value: "F" },
  { label: "F♯", value: "F#" },
  { label: "G", value: "G" },
  { label: "A♭", value: "Ab" },
  { label: "A", value: "A" },
  { label: "B♭", value: "Bb" },
  { label: "B", value: "B" },
  { label: "D♭", value: "Db" },
  { label: "G♭", value: "Gb" },
] as const satisfies ReadonlyArray<{ label: string; value: string }>;

export type KeyValue = (typeof keyOptions)[number]["value"];

export const keyTypeOptions = [
  { label: "Ionian", value: "ionian" },
  { label: "Dorian", value: "dorian" },
  { label: "Phrygian", value: "phrygian" },
  { label: "Lydian", value: "lydian" },
  { label: "Mixolydian", value: "mixolydian" },
  { label: "Aeolian", value: "aeolian" },
  { label: "Locrian", value: "locrian" },
] as const satisfies ReadonlyArray<{ label: string; value: string }>;

export type KeyTypeValue = (typeof keyTypeOptions)[number]["value"];


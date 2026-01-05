import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export const STORAGE_KEYS = {
  CHORDS_INCLUDE_7TH: 'chords_include_7th',
  CHORDS_KEY: 'chords_key',
  CHORDS_TYPE: 'chords_type',
  INCLUDE_ACCIDENTALS: 'include_accidentals',
  INTERVAL_TIME: 'interval_time',
} as const; 
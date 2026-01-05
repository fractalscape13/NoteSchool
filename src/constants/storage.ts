import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export const STORAGE_KEYS = {
  CHORDS_INCLUDE_7TH: 'chords_include_7th',
  CHORDS_KEY: 'chords_key',
  CHORDS_TYPE: 'chords_type',
  INCLUDE_ACCIDENTALS: 'include_accidentals',
  INTERVAL_TIME: 'interval_time',
  MIXED_INCLUDE_7TH: 'mixed_include_7th',
  MIXED_KEY: 'mixed_key',
  MIXED_TYPE: 'mixed_type',
  SCALES_KEY: 'scales_key',
  SCALES_TYPE: 'scales_type',
} as const; 
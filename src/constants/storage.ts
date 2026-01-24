import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export const STORAGE_KEYS = {
  INCLUDE_ACCIDENTALS: 'include_accidentals',
  INTERVAL_TIME: 'interval_time',
  MIXED_INCLUDE_7TH: 'mixed_include_7th',
  MIXED_KEY: 'mixed_key',
  MIXED_TYPE: 'mixed_type',
} as const; 
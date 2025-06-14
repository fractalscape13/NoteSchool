import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export const STORAGE_KEYS = {
  INTERVAL_TIME: 'interval_time',
} as const; 
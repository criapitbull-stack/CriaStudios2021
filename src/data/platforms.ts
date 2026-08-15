import { Radio, Video, Camera, Sparkles, Star } from 'lucide-react';
import { PlatformKey } from '@/types';

export interface PlatformInfo {
  key: PlatformKey;
  name: string;
  color: string;
  icon: typeof Radio;
}

export const PLATFORMS: PlatformInfo[] = [
  { key: 'platform1', name: 'Webcam', color: '#f59e0b', icon: Radio },
  { key: 'platform2', name: 'Live', color: '#ef4444', icon: Video },
  { key: 'platform3', name: 'Stream', color: '#e11d48', icon: Camera },
  { key: 'platform4', name: 'Broadcast', color: '#f97316', icon: Sparkles },
  { key: 'platform5', name: 'Interactive', color: '#0ea5e9', icon: Star },
];

export function getPlatform(key: PlatformKey): PlatformInfo {
  return PLATFORMS.find((p) => p.key === key)!;
}

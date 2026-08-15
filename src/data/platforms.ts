import { Radio, Video, Camera, Sparkles, Star } from 'lucide-react';
import { PlatformKey } from '@/types';

export interface PlatformInfo {
  key: PlatformKey;
  name: string;
  color: string;
  icon: typeof Radio;
}

export const PLATFORMS: PlatformInfo[] = [
  { key: 'stripchat', name: 'Stripchat', color: '#f59e0b', icon: Radio },
  { key: 'cam4', name: 'Cam4', color: '#ef4444', icon: Video },
  { key: 'cameraprive', name: 'CameraPrive', color: '#e11d48', icon: Camera },
  { key: 'chaturbate', name: 'Chaturbate', color: '#f97316', icon: Sparkles },
  { key: 'skyprivate', name: 'SkyPrivate', color: '#0ea5e9', icon: Star },
];

export function getPlatform(key: PlatformKey): PlatformInfo {
  return PLATFORMS.find((p) => p.key === key)!;
}

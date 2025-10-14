import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import soundFiles from '../utils/soundFiles';

let currentSound: Audio.Sound | null = null;

export async function playAlarm(volumeOverride?: number, soundNameOverride?: string) {
  await stopAlarm();
  const stored = soundNameOverride || (await AsyncStorage.getItem('selectedSound')) || '';
  const available = Object.keys(soundFiles as any);
  const fallback = available[0];
  const selectedSound = available.includes(stored) ? stored : fallback;
  const soundModule = (soundFiles as any)[selectedSound] || (soundFiles as any)[fallback];
  const { sound } = await Audio.Sound.createAsync(soundModule, {
    isLooping: true,
    volume: volumeOverride != null ? volumeOverride : 1.0,
    shouldPlay: true,
  });
  currentSound = sound;
  await sound.playAsync();
}

export async function stopAlarm() {
  try {
    if (currentSound) {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
      currentSound = null;
    }
  } catch {}
}



import React, { useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { playAlarm, stopAlarm } from '../utils/alarmPlayer';

type AlarmItem = {
  id: string;
  hour: string;
  minute: string;
  period: string; // AM/PM
  action: string; // Steps | QR | Math
  repeat?: string[]; // days of week
  sound?: string;
  volume?: number;
  enabled?: boolean;
};

function getTodayName(): string {
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  return days[new Date().getDay()];
}

export default function AlarmWatcher() {
  const router = useRouter();
  const lastMinuteKeyRef = useRef<string | null>(null);
  const activeAlarmIdRef = useRef<string | null>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const stored = await AsyncStorage.getItem('alarms');
        const alarms: AlarmItem[] = stored ? JSON.parse(stored) : [];
        const now = new Date();
        const nowHour12 = ((now.getHours() + 11) % 12 + 1).toString();
        const nowMinute = `${now.getMinutes()}`.padStart(2, '0');
        const nowPeriod = now.getHours() >= 12 ? 'PM' : 'AM';
        const minuteKey = `${nowHour12}:${nowMinute} ${nowPeriod}`;

        // Stop sound if active alarm got disabled
        if (activeAlarmIdRef.current) {
          const active = alarms.find(a => a.id === activeAlarmIdRef.current);
          if (!active || active.enabled === false) {
            await stopAlarm();
            activeAlarmIdRef.current = null;
          }
        }

        if (lastMinuteKeyRef.current === minuteKey) {
          return; // already handled this minute
        }

        const today = getTodayName();
        for (const alarm of alarms) {
          if (alarm.enabled === false) continue;
          if (alarm.hour === nowHour12 && alarm.minute === nowMinute && alarm.period === nowPeriod) {
            // Repeat days check (default daily if missing)
            const days = Array.isArray(alarm.repeat) && alarm.repeat.length > 0 ? alarm.repeat : ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
            if (!days.includes(today)) continue;

            lastMinuteKeyRef.current = minuteKey;
            activeAlarmIdRef.current = alarm.id;
            await playAlarm(alarm.volume ?? 1.0, alarm.sound);
            if (alarm.action === 'Steps') {
              router.push('/StepsScreen');
            } else if (alarm.action === 'QR') {
              router.push('/QRScreen');
            } else if (alarm.action === 'Math') {
              router.push('/MathScreen');
            }
            break;
          }
        }
      } catch {
        // ignore
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [router]);

  return null;
}



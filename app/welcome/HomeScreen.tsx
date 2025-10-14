import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useFocusEffect, useNavigation, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { playAlarm, stopAlarm } from '../utils/alarmPlayer';

type AlarmItem = {
  id: string;
  hour: string;
  minute: string;
  period: string;
  action: string;
  repeat?: string;
  sound?: string;
  volume?: number;
  enabled?: boolean;
};


export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [alarmTime, setAlarmTime] = useState('');
  const [alarms, setAlarms] = useState<AlarmItem[]>([]);


  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    const getPreviousTime = () => {
      const now = new Date();
      now.setMinutes(now.getMinutes() - (Math.random() < 0.5 ? 1 : 2));
      setAlarmTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      );
    };
    getPreviousTime();
  }, []);

  // Alarm firing moved to global AlarmWatcher

  useFocusEffect(
    React.useCallback(() => {
      const fetchAlarms = async () => {
        // migrate legacy single alarm if present
        const legacy = await AsyncStorage.getItem('alarmData');
        if (legacy) {
          try {
            const parsedLegacy = JSON.parse(legacy);
            const legacyItem: AlarmItem = {
              id: `${Date.now()}`,
              enabled: true,
              ...parsedLegacy,
            };
            const existingArrRaw = await AsyncStorage.getItem('alarms');
            const existingArr = existingArrRaw ? JSON.parse(existingArrRaw) : [];
            let updated;
            if (Array.isArray(existingArr)) {
              const exists = existingArr.some((a: any) => a.hour === legacyItem.hour && a.minute === legacyItem.minute && a.period === legacyItem.period);
              updated = exists ? existingArr : [legacyItem, ...existingArr];
            } else {
              updated = [legacyItem];
            }
            await AsyncStorage.setItem('alarms', JSON.stringify(updated));
            await AsyncStorage.removeItem('alarmData');
          } catch {}
        }

        const stored = await AsyncStorage.getItem('alarms');
        const parsed: AlarmItem[] = stored ? JSON.parse(stored) : [];
        setAlarms(Array.isArray(parsed) ? parsed : []);
      };
      fetchAlarms();
    }, [])
  );

  const toggleAlarm = async (id: string, value: boolean) => {
    const updated = alarms.map(a => (a.id === id ? { ...a, enabled: value } : a));
    setAlarms(updated);
    await AsyncStorage.setItem('alarms', JSON.stringify(updated));
    if (!value) {
      await stopAlarm();
    }
  };

  const deleteAlarm = async (id: string) => {
    const updated = alarms.filter(a => a.id !== id);
    setAlarms(updated);
    await AsyncStorage.setItem('alarms', JSON.stringify(updated));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Alarms</Text>
        <TouchableOpacity onPress={() => router.push('../SetAlarm')}>
          <Ionicons name="add" size={34} color="#64B5F6" style={{ marginTop: 40 }}/>
        </TouchableOpacity>
      </View>

      {/* Alarm Card static 1st*/}
      <View style={styles.alarmCard}>
        <View style={styles.daysContainer}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <Text key={index} style={styles.dayText}>
              {day}
            </Text>
          ))}
        </View>
        <View style={styles.alarmContent}>
          <Text style={styles.alarmTime}>{alarmTime}</Text>
          <Switch value={true} />
        </View>
        <Text style={styles.alarmLabel}>Action Steps</Text>
      </View>

      {/* DYNAMIC ALARM CARDS */}
      {alarms.map((alarm) => (
        <View key={alarm.id} style={styles.alarmCard}>
          <View style={styles.daysContainer}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <Text key={index} style={styles.dayText}>{day}</Text>
            ))}
          </View>
          <View style={styles.alarmContent}>
            <Text style={styles.alarmTime}>
              {`${alarm.hour}:${alarm.minute} ${alarm.period}`}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Switch value={alarm.enabled !== false} onValueChange={(v) => toggleAlarm(alarm.id, v)} />
              <TouchableOpacity onPress={() => deleteAlarm(alarm.id)} style={{ marginLeft: 12 }}>
                <Ionicons name="trash" size={22} color="#ff6b6b" />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.alarmLabel}>Action {alarm.action}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 40
  },
  alarmCard: {
    backgroundColor: '#111',
    padding: 16,
    borderRadius: 10,
    borderColor: '#444',
    borderWidth: 1,
    marginTop: 20
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dayText: {
    color: '#64B5F6',
    fontSize: 14,
    fontWeight: 'bold',
  },
  alarmContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alarmTime: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  alarmLabel: {
    color: '#aaa',
    fontSize: 16,
    marginTop: 4,
  },
});

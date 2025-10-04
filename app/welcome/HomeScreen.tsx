import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useFocusEffect, useNavigation, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AlarmData = {
  hour: string;
  minute: string;
  period: string;
  action: string;
};


export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [alarmTime, setAlarmTime] = useState('');
  // const [savedAlarm, setSavedAlarm] = useState(null);
  const [savedAlarm, setSavedAlarm] = useState<AlarmData | null>(null);


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

  useFocusEffect(
    React.useCallback(() => {
      const fetchAlarm = async () => {
        const data = await AsyncStorage.getItem('alarmData');
        if (data) {
          const parsed = JSON.parse(data);
          setSavedAlarm(parsed);
        }
      };
      fetchAlarm();
    }, [])
  );

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

      {/* DYNAMIC ALARM CARDS  */}
      {savedAlarm && (
        <View style={styles.alarmCard}>
          <View style={styles.daysContainer}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <Text key={index} style={styles.dayText}>{day}</Text>
            ))}
          </View>
          <View style={styles.alarmContent}>
            <Text style={styles.alarmTime}>
              {`${savedAlarm.hour}:${savedAlarm.minute} ${savedAlarm.period}`}
            </Text>
            <Switch value={true} />
          </View>
          <Text style={styles.alarmLabel}>Action {savedAlarm.action}</Text>
        </View>
      )}
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

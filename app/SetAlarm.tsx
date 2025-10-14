import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation, useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';




export default function SetAlarm() {

  const actions = [
    { id: "steps", label: "Steps" },
    { id: "qr", label: "QR" },
    { id: "math", label: "Math" },
  ];

  const router = useRouter();
  const navigation = useNavigation();

  React.useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  
  // Get current time using moment.js
  const getCurrentTime = () => {
    const now = moment();
    return {
      hour: now.format('h'), // 12-hour format
      minute: now.format('mm'), // Always two digits
      period: now.format('A'), // AM or PM
    };
  };

  // Set initial state with current time
  const [selectedHour, setSelectedHour] = useState(getCurrentTime().hour);
  const [selectedMinute, setSelectedMinute] = useState(getCurrentTime().minute);
  const [selectedPeriod, setSelectedPeriod] = useState(getCurrentTime().period);
  const [volume, setVolume] = useState(0.5);
  const [selectedAction, setSelectedAction] = useState('Steps');
  const [selectedRepeatDays, setSelectedRepeatDays] = useState<string[]>(['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']);
  const [selectedSoundName, setSelectedSoundName] = useState<string>('Wakex');

  useFocusEffect(
    React.useCallback(() => {
      const fetchSelections = async () => {
        // Action
        const storedActionId = await AsyncStorage.getItem('selectedAction');
        const actionLabel = actions.find(a => a.id === storedActionId)?.label || actions[0].label;
        setSelectedAction(actionLabel);
        // Repeat
        const storedRepeat = await AsyncStorage.getItem('selectedRepeat');
        setSelectedRepeatDays(storedRepeat ? JSON.parse(storedRepeat) : ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']);
        // Sound
        const storedSound = await AsyncStorage.getItem('selectedSound');
        setSelectedSoundName(storedSound || 'Wakex');
      };
      fetchSelections();
    }, [])
  );


  

  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.headerText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            const newAlarm = {
              id: `${Date.now()}`,
              hour: selectedHour,
              minute: selectedMinute,
              period: selectedPeriod,
              action: selectedAction,
              repeat: selectedRepeatDays,
              sound: selectedSoundName,
              volume,
              enabled: true,
            };
            try {
              const existing = await AsyncStorage.getItem('alarms');
              const parsed = existing ? JSON.parse(existing) : [];
              let updated;
              if (Array.isArray(parsed)) {
                const idx = parsed.findIndex((a: any) => a.hour === newAlarm.hour && a.minute === newAlarm.minute && a.period === newAlarm.period);
                if (idx >= 0) {
                  // Update existing alarm at same time
                  const copy = [...parsed];
                  copy[idx] = { ...copy[idx], ...newAlarm };
                  updated = copy;
                } else {
                  updated = [...parsed, newAlarm];
                }
              } else {
                updated = [newAlarm];
              }
              await AsyncStorage.setItem('alarms', JSON.stringify(updated));
              // Ensure legacy key is cleared to prevent migration duplication
              await AsyncStorage.removeItem('alarmData');
            } catch (e) {
              // intentionally swallow; UI stays consistent by navigating back
            }
            router.back();
          }}>
          <Text style={styles.headerText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Time Picker */}
      <View style={styles.timePickerContainer}>
        <Picker
          selectedValue={selectedHour}
          onValueChange={(itemValue) => setSelectedHour(itemValue)}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          {Array.from({ length: 12 }, (_, i) => `${i + 1}`).map((hour) => (
            <Picker.Item key={hour} label={hour} value={hour} />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedMinute}
          onValueChange={(itemValue) => setSelectedMinute(itemValue)}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          {Array.from({ length: 60 }, (_, i) => (i < 10 ? `0${i}` : `${i}`)).map((minute) => (
            <Picker.Item key={minute} label={minute} value={minute} />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedPeriod}
          onValueChange={(itemValue) => setSelectedPeriod(itemValue)}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          <Picker.Item label="AM" value="AM" />
          <Picker.Item label="PM" value="PM" />
        </Picker>
      </View>

      {/* Options */}
      <TouchableOpacity style={styles.option} onPress={() => router.push('/ActionSelector')}>
        <Text style={styles.optionText}>Action</Text>
        <Text style={styles.optionRightText}>{selectedAction} {'>'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => router.push('/RepeatSelector')}>
        <Text style={styles.optionText}>Repeat</Text>
        <Text style={styles.optionRightText}>{selectedRepeatDays.length === 7 ? 'Daily' : `${selectedRepeatDays.length} days`} {'>'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => router.push('/SoundPicker')}>
        <Text style={styles.optionText}>Sound</Text>
        <Text style={styles.optionRightText}>{selectedSoundName} {'>'}</Text>
      </TouchableOpacity>

      {/* Volume Slider */}
      <View style={styles.volumeContainer}>
        <Ionicons name="volume-low" size={20} color="white" />
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          value={volume}
          onValueChange={(value) => setVolume(value)}
          minimumTrackTintColor="#64B5F6"
          thumbTintColor="#64B5F6"
        />
      </View>
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
    marginBottom: 20,
    marginTop: 50
  },
  headerText: {
    fontSize: 18,
    color: '#64B5F6',
    fontWeight: 'bold',
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  picker: {
    width: 100,
  },
  pickerItem: {
    fontSize: 24,
    color: 'white',
  },
  option: {
    backgroundColor: '#111',
    padding: 16,
    borderRadius: 10,
    borderColor: '#444',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  optionText: {
    fontSize: 18,
    color: '#fff',
  },
  optionRightText: {
    fontSize: 18,
    color: '#fff',
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    padding: 16,
    borderRadius: 10,
    borderColor: '#444',
    borderWidth: 1,
  },
  slider: {
    flex: 1,
    marginLeft: 10,
  },
});

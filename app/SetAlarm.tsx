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

  useFocusEffect(
    React.useCallback(() => {
      const fetchAction = async () => {
        const storedAction = await AsyncStorage.getItem('selectedAction');
        if (storedAction) {
          // Find the corresponding label; if not found, default to "Steps"
          const label = actions.find(a => a.id === storedAction)?.label || 'Steps';
          setSelectedAction(label);
        }
      };
      fetchAction();
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
          onPress={async () => { const alarmData = {
              hour: selectedHour,
              minute: selectedMinute,
              period: selectedPeriod,
              action: selectedAction,
              repeat: 'Daily', // Replace with actual selected repeat option if dynamic
              sound: 'Sunrise', // Replace with selected sound if dynamic
              volume,
            };
            await AsyncStorage.setItem('alarmData', JSON.stringify(alarmData));
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
        <Text style={styles.optionRightText}>Steps {'>'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => router.push('/RepeatSelector')}>
        <Text style={styles.optionText}>Repeat</Text>
        <Text style={styles.optionRightText}>Daily {'>'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => router.push('/SoundPicker')}>
        <Text style={styles.optionText}>Sound</Text>
        <Text style={styles.optionRightText}>Sunrise {'>'}</Text>
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

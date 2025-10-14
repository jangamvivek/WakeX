import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const RepeatSelector = () => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: "Repeat",
      headerStyle: { backgroundColor: "#000" },
      headerTintColor: "#64B5F6", // Back button color
      headerTitleStyle: { color: "#FFFFFF" }, // Title color
      headerBackTitle: "Back", // "< Back"
    });
  }, [navigation]);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('selectedRepeat');
      if (stored) setSelectedDays(JSON.parse(stored));
      else setSelectedDays(['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']);
    })();
  }, []);

  const toggleDay = async (day: string) => {
    setSelectedDays((prev) => {
      const next = prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day];
      AsyncStorage.setItem('selectedRepeat', JSON.stringify(next));
      return next;
    });
  };

  return (
    <View style={styles.container}>
      {days.map((day) => (
        <TouchableOpacity
          key={day}
          style={styles.dayItem}
          onPress={() => { toggleDay(day); (navigation as any).goBack(); }}
        >
          <Text style={styles.dayText}>{day}</Text>
          {selectedDays.includes(day) && (
            <Ionicons name="checkmark" size={24} color="#64B5F6" />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RepeatSelector;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Black background
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  dayItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    padding: 15,
    borderRadius: 10,
    marginVertical: 15,
    justifyContent: "space-between",
  },
  dayText: {
    color: "#FFFFFF",
    fontSize: 18,
  },
});

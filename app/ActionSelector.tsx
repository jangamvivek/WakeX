import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const actions = [
  { id: "steps", label: "Steps", icon: "walk" as const },
  { id: "qr", label: "QR", icon: "qrcode" as const },
  { id: "math", label: "Math", icon: "calculator" as const },
];

const ActionSelector = () => {
  const [selectedAction, setSelectedAction] = useState("steps"); // Default selected action
  const navigation = useNavigation();

  // Set header options
  useEffect(() => {
    navigation.setOptions({
      title: "Actions", // Change header title
      headerStyle: { backgroundColor: "#000" }, // Set header background color to black
      headerTintColor: "#64B5F6", // Change ONLY the back button text color to light blue
      headerTitleStyle: { color: "#FFFFFF" }, // Set "Actions" title color to white
      headerBackTitle: "Back", // Change "< SetAlarm" to "< Back"
    });
  }, [navigation]);

  const handleSelect = async (actionId: string) => {
    setSelectedAction(actionId);
    await AsyncStorage.setItem("selectedAction", actionId);
    navigation.goBack();
  };  

  return (
    <View style={styles.container}>
      {/* Action List */}
      {actions.map((action) => (
        <TouchableOpacity
          key={action.id}
          style={[styles.actionItem, selectedAction === action.id && styles.selectedAction]}
          onPress={() => setSelectedAction(action.id)}
        >
          <MaterialCommunityIcons name={action.icon} size={24} color="white" />
          <Text style={styles.actionText}>{action.label}</Text>
          {selectedAction === action.id && <Ionicons name="checkmark" size={24} color="dodgerblue" />}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ActionSelector;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Black background
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1c1c1e",
    padding: 15,
    borderRadius: 10,
    marginVertical: 15,
    justifyContent: "space-between",
  },
  actionText: {
    color: "#fff",
    fontSize: 18,
    flex: 1,
    marginLeft: 10,
  },
  selectedAction: {
    borderColor: "dodgerblue",
    borderWidth: 1,
  },
});

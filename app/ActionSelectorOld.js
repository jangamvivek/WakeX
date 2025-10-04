import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ActionSelector() {
  const navigation = useNavigation();
  const [selectedAction, setSelectedAction] = useState("");

  const actions = [
    { type: "Steps", icon: "🚶‍♂️" },
    { type: "QR", icon: "📷" },
    { type: "Math", icon: "🧮" },
  ];

  useEffect(() => {
    const loadSelectedAction = async () => {
      const stored = await AsyncStorage.getItem("selectedAction");
      if (stored) setSelectedAction(stored);
    };
    loadSelectedAction();
  }, []);

  const selectAction = async (type) => {
    setSelectedAction(type);
    await AsyncStorage.setItem("selectedAction", type);
    navigation.navigate("AlarmScreen", { actionType: type });
  };  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Actions</Text>
      {actions.map((item) => (
        <TouchableOpacity
          key={item.type}
          style={[
            styles.button,
            selectedAction === item.type && styles.activeButton,
          ]}
          onPress={() => selectAction(item.type)}
        >
          <Text style={styles.text}>
            {item.icon} {item.type}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  title: { color: "#fff", fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  button: {
    backgroundColor: "#222",
    padding: 15,
    width: "80%",
    marginBottom: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#64B5F6", // Highlight selected
  },
  text: { color: "#fff", fontSize: 18 },
});

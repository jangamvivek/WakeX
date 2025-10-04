import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function AlarmScreen() {
  const { actionType } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Selected Action: {actionType}</Text>

      {actionType === "Steps" && <Text style={styles.text}>Walk 15 steps to dismiss alarm</Text>}
      {actionType === "QR" && <Text style={styles.text}>Scan QR Code to dismiss alarm</Text>}
      {actionType === "Math" && <Text style={styles.text}>Solve 3 math problems</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  text: { color: "#fff", fontSize: 18, marginBottom: 10 },
});

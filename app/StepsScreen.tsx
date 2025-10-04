import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Pedometer } from "expo-sensors";

export default function StepsScreen() {
  const [steps, setSteps] = useState(0);

  useEffect(() => {
    const subscription = Pedometer.watchStepCount(result => {
      setSteps(result.steps);
    });

    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Steps taken: {steps}</Text>
      {steps >= 15 && <Text style={styles.success}>✅ Alarm dismissed!</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  text: { color: "#fff", fontSize: 18 },
  success: { color: "lightgreen", fontSize: 22, marginTop: 20 },
});

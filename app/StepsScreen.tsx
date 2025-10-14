import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Pedometer } from "expo-sensors";
import { stopAlarm } from './utils/alarmPlayer';
import { useRouter } from 'expo-router';

export default function StepsScreen() {
  const router = useRouter();
  const [steps, setSteps] = useState(0);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let subscription: any;
    (async () => {
      const available = await Pedometer.isAvailableAsync();
      setIsAvailable(available);
      if (available) {
        subscription = Pedometer.watchStepCount(result => {
          setSteps(result.steps);
        });
      }
    })();
    return () => { if (subscription) subscription.remove(); };
  }, []);

  useEffect(() => {
    if (steps >= 15) {
      stopAlarm();
      router.replace('/welcome/HomeScreen');
    }
  }, [steps]);

  return (
    <View style={styles.container}>
      {isAvailable === false && <Text style={styles.text}>Pedometer not available on this device.</Text>}
      {isAvailable === null && <Text style={styles.text}>Checking pedometer availability…</Text>}
      {isAvailable && <Text style={styles.text}>Steps taken: {steps}</Text>}
      {steps >= 15 && <Text style={styles.success}>✅ Alarm dismissed!</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  text: { color: "#fff", fontSize: 18 },
  success: { color: "lightgreen", fontSize: 22, marginTop: 20 },
});

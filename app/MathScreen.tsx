import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { stopAlarm } from './utils/alarmPlayer';
import { useRouter } from 'expo-router';

const generateProblem = () => {
  const a = Math.floor(Math.random() * 10);
  const b = Math.floor(Math.random() * 10);
  const ops = ["+", "-", "*"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  const expression = `${a} ${op} ${b}`;
  const answer = eval(expression);
  return { expression, answer };
};

export default function MathScreen() {
  const router = useRouter();
  const [problem, setProblem] = useState(generateProblem());
  const [input, setInput] = useState("");
  const [solvedCount, setSolvedCount] = useState(0);

  const handleSubmit = () => {
    if (parseInt(input) === problem.answer) {
      const newCount = solvedCount + 1;
      setSolvedCount(newCount);
      setInput("");
      if (newCount >= 3) {
        stopAlarm();
        router.replace('/welcome/HomeScreen');
        return;
      }
    }
    setProblem(generateProblem());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Math Challenge</Text>
      <View style={styles.card}>
        <Text style={styles.expression}>{problem.expression}</Text>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          keyboardType="numeric"
          placeholder="Answer"
          placeholderTextColor="#888"
        />
        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        <Text style={styles.progress}>Solved {solvedCount} / 3</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000", paddingHorizontal: 24 },
  title: { color: "#64B5F6", fontSize: 24, fontWeight: '700', marginBottom: 16 },
  card: { backgroundColor: '#111', width: '100%', borderRadius: 12, padding: 20, borderWidth: 1, borderColor: '#333' },
  expression: { color: '#fff', fontSize: 32, fontWeight: '800', textAlign: 'center', marginVertical: 12 },
  input: { backgroundColor: "#1c1c1e", color: '#fff', width: "100%", padding: 14, borderRadius: 8, borderWidth: 1, borderColor: '#333', marginBottom: 12, textAlign: 'center', fontSize: 18 },
  button: { backgroundColor: '#64B5F6', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#000', fontWeight: '700', fontSize: 16 },
  progress: { color: '#aaa', fontSize: 14, textAlign: 'center', marginTop: 12 },
});

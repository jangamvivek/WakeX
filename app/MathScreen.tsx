import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

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
  const [problem, setProblem] = useState(generateProblem());
  const [input, setInput] = useState("");
  const [solvedCount, setSolvedCount] = useState(0);

  const handleSubmit = () => {
    if (parseInt(input) === problem.answer) {
      const newCount = solvedCount + 1;
      setSolvedCount(newCount);
      setInput("");
      if (newCount >= 3) {
        alert("✅ Alarm dismissed!");
        return;
      }
    }
    setProblem(generateProblem());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Solve: {problem.expression}</Text>
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        keyboardType="numeric"
      />
      <Button title="Submit" onPress={handleSubmit} />
      <Text style={styles.text}>Solved: {solvedCount} / 3</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  text: { color: "#fff", fontSize: 18, margin: 10 },
  input: { backgroundColor: "#fff", width: "60%", padding: 10, borderRadius: 5, marginBottom: 10 },
});

import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

const sounds = ["Wakex", "Sunrise", "Applause", "Ring", "Birds"];

const SoundPicker: React.FC = () => {
  const [selectedSound, setSelectedSound] = useState("Wakex");
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

  return (
    <View style={{ flex: 1, backgroundColor: "#000", paddingTop: 20 }}>
      {/* Sound List */}
      <FlatList
        data={sounds}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedSound(item)}
            style={{
              backgroundColor: "#1C1C1C",
              padding: 20,
              marginHorizontal: 20,
              marginBottom: 10,
              borderRadius: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginVertical: 15,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16 }}>{item}</Text>
            {selectedSound === item && (
              <Ionicons name="checkmark" size={24} color="#64B5F6" />
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default SoundPicker;

import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    setUsername("");
    setEmail("");
    setPassword("");
  }, []);

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert("Error", "Por favor, complete todos los campos.");
      return;
    }

    const user = { username, email, password };

    try {
      await AsyncStorage.setItem("user", JSON.stringify(user));
      Alert.alert("✅ Registro exitoso");
      router.replace("/"); // Navegar al Home después de registrar
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar el usuario.");
      console.error(error);
    }
  };

  return (
    <LinearGradient colors={["#43cea2", "#78dfa3ff"]} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Register</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#ccc"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#ccc"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    backgroundColor: "rgba(255,255,255,0.15)",
    margin: 20,
    padding: 20,
    borderRadius: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#fff",
  },
  input: {
    height: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    paddingHorizontal: 15,
    color: "#fff",
    marginBottom: 15,
  },
  registerButton: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  registerText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
});
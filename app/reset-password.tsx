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
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const router = useRouter();

  useEffect(() => {
    setCedula("");
    setNombre("");
    setEmail("");
    setPassword("");
    setTelefono("");
  }, []);

  const handleRegister = async () => {
    if (!cedula || !nombre || !email || !password || !telefono) {
      Alert.alert("Error", "Por favor, complete todos los campos.");
      return;
    }

    const user = { cedula, nombre, email, password, telefono };

    try {
      // ✅ Guardar en almacenamiento local
      await AsyncStorage.setItem("user", JSON.stringify(user));

      // ✅ Enviar a API
      const response = await fetch("https://tuapi.com/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("✅ Registro exitoso", data.message || "Usuario creado");
        router.replace("/"); // Ir al Home después de registrar
      } else {
        Alert.alert("❌ Error", data.message || "No se pudo registrar");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar/enviar el usuario.");
      console.error(error);
    }
  };

  return (
    <LinearGradient colors={["#43cea2", "#78dfa3ff"]} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Registro</Text>

        <TextInput
          style={styles.input}
          placeholder="Cédula"
          placeholderTextColor="#ccc"
          value={cedula}
          onChangeText={setCedula}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Nombre y Apellido"
          placeholderTextColor="#ccc"
          value={nombre}
          onChangeText={setNombre}
        />

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#ccc"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          placeholderTextColor="#ccc"
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
        />

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerText}>Registrar</Text>
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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

  const handleRegister = async () => {
    if (!cedula || !nombre || !email || !password || !telefono) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }

    try {
      // Obtener usuarios existentes
      const usersJSON = await AsyncStorage.getItem("users");
      const users = usersJSON ? JSON.parse(usersJSON) : [];

      // Verificar si ya existe el email
      const exists = users.some((u: any) => u.email === email);
      if (exists) {
        Alert.alert("Error", "El usuario ya existe");
        return;
      }

      const newUser = { cedula, nombre, email, password, telefono };
      users.push(newUser);
      await AsyncStorage.setItem("users", JSON.stringify(users));

      // Guardar sesión automáticamente
      await AsyncStorage.setItem("rememberedUser", email);

      Alert.alert("✅ Registro exitoso", "Usuario creado correctamente");
      router.replace("/"); // redirige al Home
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo registrar el usuario.");
    }
  };

  return (
    <LinearGradient colors={["#43cea2", "#78e782ff"]} style={styles.background}>
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

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: "center" },
  container: {
    backgroundColor: "rgba(255,255,255,0.15)",
    margin: 20,
    padding: 20,
    borderRadius: 15,
  },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#fff" },
  input: {
    height: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    paddingHorizontal: 15,
    color: "#fff",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: { color: "#000", fontWeight: "bold", fontSize: 16 },
});

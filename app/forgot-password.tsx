import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// Importa Firebase auth y función para resetear contraseña
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./config/firebaseConfig"; // Ajusta la ruta a tu configuración Firebase

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleReset = async () => {
    if (!email) {
      Alert.alert("Error", "Por favor, ingresa tu correo.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Correo enviado",
        `Se ha enviado un enlace a ${email} para recuperar la contraseña.`
      );
      router.replace("/login"); // Vuelve al login después de enviar el correo
    } catch (error) {
      Alert.alert("Error", "No se pudo enviar el correo de recuperación.");
      console.error(error);
    }
  };

  return (
    <LinearGradient colors={["#43cea2", "#78e782ff"]} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Recuperar contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa tu correo"
          placeholderTextColor="#000000ff"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TouchableOpacity style={styles.button} onPress={handleReset}>
          <Text style={styles.buttonText}>Enviar enlace</Text>
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#000000ff",
  },
  input: {
    height: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    paddingHorizontal: 15,
    color: "#000000ff",
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

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = async () => {
    if (!email) {
      Alert.alert("Error", "Por favor, ingresa tu correo.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("https://adamix.net/medioambiente/docx/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: email }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("✅ Código enviado", data.mensaje || "Revisa tu correo.");

        router.push({
          pathname: './',
          params: { email }
        });
      } else {
        Alert.alert("❌ Error", data.mensaje || "No se pudo enviar el código.");
      }
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al conectar con el servidor.");
      console.error(error);
    } finally {
      setLoading(false);
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
        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleReset}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Enviando..." : "Enviar código"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Text style={styles.backText}>← Volver al login</Text>
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
  backText: { color: "#000", marginTop: 15, textAlign: "center" },
});

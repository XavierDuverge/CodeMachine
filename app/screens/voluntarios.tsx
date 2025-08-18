import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const API_BASE = "https://adamix.net/medioambiente";

export default function VoluntariadoScreen() {
  const router = useRouter();

  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const validar = () => {
    if (!cedula || !nombre || !apellido || !correo || !password || !telefono) {
      Alert.alert("Campos requeridos", "Todos los campos son obligatorios.");
      return false;
    }
    // valida email básico
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
    if (!emailOk) {
      Alert.alert("Correo inválido", "Ingresa un correo electrónico válido.");
      return false;
    }
    // cédula y teléfono (sencillo)
    if (!/^[0-9\-]+$/.test(cedula)) {
      Alert.alert("Cédula inválida", "La cédula debe contener solo números y guiones.");
      return false;
    }
    if (!/^[0-9\+\-\s]+$/.test(telefono)) {
      Alert.alert("Teléfono inválido", "El teléfono debe contener solo números, + o guiones.");
      return false;
    }
    return true;
    };

  const enviarSolicitud = async () => {
    if (!validar()) return;

    setLoading(true);
    setEnviado(false);

    try {
      const res = await fetch(`${API_BASE}/voluntarios`, {
        method: "POST",
        headers: {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cedula: cedula.trim(),
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          correo: correo.trim(),
          password,
          telefono: telefono.trim(),
        }),
      });

      // La API a veces devuelve 200 ó 201 y puede no ser JSON siempre
      let payload: any = null;
      try {
        payload = await res.json();
      } catch {
        // si no es JSON, tratamos de leer texto
        const txt = await res.text();
        payload = { mensaje: txt };
      }

      if (res.ok) {
        // Confirmación visual y alert
        setEnviado(true);
        Alert.alert("Solicitud enviada", payload?.mensaje ?? "Tu solicitud fue enviada correctamente.");

        // Limpia formulario
        setCedula("");
        setNombre("");
        setApellido("");
        setCorreo("");
        setPassword("");
        setTelefono("");
      } else {
        const msg = payload?.error || payload?.mensaje || `Error HTTP ${res.status}`;
        Alert.alert("Error", msg);
      }
    } catch (err: any) {
      Alert.alert("Error de red", "No se pudo enviar la solicitud. Verifica tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Botón volver al Explore */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.push("/(tabs)/explore")}>
          <Text style={styles.backButtonText}>← Explorer</Text>
        </TouchableOpacity>

        <Text style={styles.title}>🤝 Voluntariado</Text>

        {/* Panel de confirmación después de enviar */}
        {enviado && (
          <View style={styles.successBox}>
            <Text style={styles.successEmoji}>✅</Text>
            <Text style={styles.successText}>
              ¡Gracias! Tu solicitud fue enviada correctamente.
            </Text>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.info}>
            Completa el formulario para ser voluntario del Ministerio de Medio Ambiente.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Cédula"
            value={cedula}
            onChangeText={setCedula}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={nombre}
            onChangeText={setNombre}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="Apellido"
            value={apellido}
            onChangeText={setApellido}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
          />

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={enviarSolicitud}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? "Enviando..." : "Enviar Solicitud"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F1F8E9", paddingTop: 22 },
  container: { padding: 20 },
  backButton: { marginBottom: 10 },
  backButtonText: { fontSize: 16, color: "#1B5E20", fontWeight: "bold" },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#388e3c",
    textAlign: "center",
  },

  successBox: {
    backgroundColor: "#c5f8caff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#A5E6B0",
  },
  successEmoji: { fontSize: 28, marginBottom: 6 },
  successText: { color: "#1B5E20", fontWeight: "600", textAlign: "center" },

  card: {
    backgroundColor: "#c5f8caff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
  },
  info: { color: "#1B5E20", fontSize: 14, marginBottom: 12 },

  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },

  button: {
    backgroundColor: "#4caf50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

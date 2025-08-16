import React, { useState } from "react";
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const API_BASE = "https://adamix.net/medioambiente";

export default function VoluntariadoScreen() {
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [loading, setLoading] = useState(false);

  const enviarSolicitud = async () => {
    if (!cedula || !nombre || !apellido || !correo || !password || !telefono) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/voluntarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "*/*" },
        body: JSON.stringify({ cedula, nombre, apellido, correo, password, telefono }),
      });

      const data = await response.json();

      if (response.status === 201) {
        Alert.alert("Éxito", data.mensaje);
        // Limpiar formulario
        setCedula(""); setNombre(""); setApellido(""); setCorreo(""); setPassword(""); setTelefono("");
      } else {
        Alert.alert("Error", data.error || "Ocurrió un problema");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "No se pudo enviar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>🤝 Voluntariado</Text>
        <View style={styles.card}>
          <Text style={styles.info}>Completa el formulario para ser voluntario del Ministerio de Medio Ambiente.</Text>

          <TextInput style={styles.input} placeholder="Cédula" value={cedula} onChangeText={setCedula} keyboardType="numeric"/>
          <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre}/>
          <TextInput style={styles.input} placeholder="Apellido" value={apellido} onChangeText={setApellido}/>
          <TextInput style={styles.input} placeholder="Correo electrónico" value={correo} onChangeText={setCorreo} keyboardType="email-address"/>
          <TextInput style={styles.input} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry/>
          <TextInput style={styles.input} placeholder="Teléfono" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad"/>

          <TouchableOpacity style={styles.button} onPress={enviarSolicitud} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? "Enviando..." : "Enviar Solicitud"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#E8F5E9", paddingTop: 22 },
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#1B5E20", textAlign: "center" },
  card: { backgroundColor: "#4CAF50", padding: 16, borderRadius: 12, marginBottom: 16, elevation: 3 },
  info: { color: "#fff", fontSize: 14, marginBottom: 12 },
  input: { backgroundColor: "#fff", borderRadius: 8, padding: 10, marginBottom: 10 },
  button: { backgroundColor: "#1B5E20", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

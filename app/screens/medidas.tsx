import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView, ScrollView, StyleSheet, Text,
  TextInput, TouchableOpacity,
  View
} from "react-native";

const API_BASE = "https://adamix.net/medioambiente";

interface Medida {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  icono: string;
}

export default function MedidasScreen() {
  const router = useRouter();
  const [categoria, setCategoria] = useState("ambiental");
  const [medidas, setMedidas] = useState<Medida[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMedidas = async () => {
    if (!categoria) return;
    setLoading(true);
    try {
      const url = `${API_BASE}/medidas?categoria=${encodeURIComponent(categoria)}`;
      const response = await fetch(url, { headers: { Accept: "application/json" } });
      const data = await response.json();
      if (response.ok) setMedidas(data);
      else setMedidas([]);
    } catch (error) {
      console.error("Error fetch:", error);
      setMedidas([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Botón regresar */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/(tabs)/explore')}>
        <Text style={styles.backButtonText}>← Explorer</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>🌍 Medidas Ambientales</Text>

        {/* Input categoría */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Escribe la categoría (ej: ambiental)"
            value={categoria}
            onChangeText={setCategoria}
          />
          <TouchableOpacity style={styles.searchButton} onPress={fetchMedidas}>
            <Text style={styles.searchButtonText}>Buscar</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#1B5E20" style={{ marginTop: 20 }} />
        ) : medidas.length === 0 ? (
          <Text style={{ textAlign: "center", color: "#555", marginTop: 20 }}>
            No hay medidas disponibles.
          </Text>
        ) : (
          medidas.map((m) => (
            <View key={m.id} style={styles.card}>
              <Text style={styles.cardTitle}>{m.icono ? m.icono + " " : ""}{m.titulo}</Text>
              <Text style={styles.cardText}>{m.descripcion}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#E8F5E9", paddingTop: 22 },
  backButton: { marginLeft: 20, marginBottom: 10 },
  backButtonText: { fontSize: 16, color: "#1B5E20", fontWeight: "bold" },

  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#1b5e20", textAlign: "center" },

  inputContainer: { flexDirection: "row", marginBottom: 20 },
  input: { flex: 1, borderWidth: 1, borderColor: "#1B5E20", borderRadius: 8, padding: 10, marginRight: 10 },
  searchButton: { backgroundColor: "#1B5E20", paddingHorizontal: 16, borderRadius: 8, justifyContent: "center" },
  searchButtonText: { color: "#fff", fontWeight: "bold" },

  card: { backgroundColor: "#4CAF50", padding: 16, borderRadius: 12, marginBottom: 16, elevation: 3 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  cardText: { fontSize: 16, color: "#fff", marginTop: 6 },
});

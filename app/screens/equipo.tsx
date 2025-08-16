import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text,
  TextInput, TouchableOpacity,
  View
} from "react-native";

type Miembro = {
  id: string;
  nombre: string;
  cargo: string;
  departamento: string;
  foto: string;
  biografia: string;
  orden: number;
};

const API_BASE = "https://adamix.net/medioambiente";

export default function EquipoScreen() {
  const router = useRouter();
  const [departamento, setDepartamento] = useState("");
  const [miembros, setMiembros] = useState<Miembro[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMiembros = async () => {
    if (!departamento) return;
    setLoading(true);
    setError(null);
    try {
      const url = `${API_BASE}/equipo?departamento=${encodeURIComponent(departamento)}`;
      const response = await fetch(url, { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("La respuesta no es un array");
      setMiembros(data.sort((a, b) => a.orden - b.orden));
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar el equipo. Intente más tarde.");
      setMiembros([]);
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
        <Text style={styles.title}>👥 Equipo del Ministerio</Text>

        {/* Input de departamento */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Escribe el departamento"
            value={departamento}
            onChangeText={setDepartamento}
          />
          <TouchableOpacity style={styles.searchButton} onPress={fetchMiembros}>
            <Text style={styles.searchButtonText}>Buscar</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#1B5E20" style={{ marginTop: 20 }} />
        ) : error ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>{error}</Text>
        ) : miembros.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>No hay miembros disponibles.</Text>
        ) : (
          miembros.map((miembro) => (
            <View key={miembro.id} style={styles.card}>
              <Image
                source={{ uri: miembro.foto || "https://randomuser.me/api/portraits/lego/1.jpg" }}
                style={styles.avatar}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{miembro.nombre}</Text>
                <Text style={styles.role}>{miembro.cargo}</Text>
                <Text style={styles.department}>{miembro.departamento}</Text>
                <Text style={styles.bio}>{miembro.biografia}</Text>
              </View>
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

  card: { flexDirection: "row", alignItems: "flex-start", backgroundColor: "#4CAF50", padding: 16, borderRadius: 12, marginBottom: 16, elevation: 3 },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 12 },
  name: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  role: { fontSize: 14, color: "#fff" },
  department: { fontSize: 12, color: "#fff", marginBottom: 4 },
  bio: { fontSize: 12, color: "#fff" },
});

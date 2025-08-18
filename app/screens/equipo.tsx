import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
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
const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=60";

export default function EquipoScreen() {
  const router = useRouter();
  const [departamento, setDepartamento] = useState("");
  const [miembros, setMiembros] = useState<Miembro[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMiembros = async () => {
    setLoading(true);
    setError(null);

    try {
      const dep = departamento.trim();
      const url =
        dep.length > 0
          ? `${API_BASE}/equipo?departamento=${encodeURIComponent(dep)}`
          : `${API_BASE}/equipo`;

      

      const response = await fetch(url, { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("La respuesta no es un array");

      const lista: Miembro[] = data
        .map((it: any) => ({
          id: String(it.id ?? ""),
          nombre: String(it.nombre ?? ""),
          cargo: String(it.cargo ?? ""),
          departamento: String(it.departamento ?? ""),
          foto: String(it.foto ?? ""),
          biografia: String(it.biografia ?? ""),
          orden: Number(it.orden ?? 0),
        }))
        .sort((a, b) => a.orden - b.orden);

      setMiembros(lista);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar el equipo. Intente más tarde.");
      setMiembros([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setDepartamento("");
    // Recargar lista completa
    setTimeout(fetchMiembros, 0);
  };

  useEffect(() => {
    // Carga inicial sin filtro
    fetchMiembros();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Botón regresar */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push("/(tabs)/explore")}>
        <Text style={styles.backButtonText}>← Explorer</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>👥 Equipo del Ministerio</Text>

        {/* Input de departamento */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Escribe el departamento (o deja vacío para ver todo)"
            value={departamento}
            onChangeText={setDepartamento}
            returnKeyType="search"
            onSubmitEditing={fetchMiembros}
          />
          <TouchableOpacity style={styles.searchButton} onPress={fetchMiembros}>
            <Text style={styles.searchButtonText}>Buscar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearButtonText}>Limpiar</Text>
          </TouchableOpacity>
        </View>

        {departamento.trim().length > 0 && (
          <Text style={styles.filterHint}>Filtrando por: <Text style={{ fontWeight: "bold" }}>{departamento}</Text></Text>
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#1B5E20" style={{ marginTop: 20 }} />
        ) : error ? (
          <Text style={styles.centerText}>{error}</Text>
        ) : miembros.length === 0 ? (
          <Text style={styles.centerText}>No hay miembros disponibles.</Text>
        ) : (
          miembros.map((miembro) => (
            <View key={miembro.id} style={styles.card}>
              <Image
                source={{ uri: miembro.foto?.trim() ? miembro.foto : FALLBACK_AVATAR }}
                onError={(e) => {
                  // Si falla, asigna el fallback
                  (e.currentTarget as any).src = FALLBACK_AVATAR;
                }}
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

  inputContainer: { flexDirection: "row", marginBottom: 10, alignItems: "center" },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#1B5E20",
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    backgroundColor: "#fff",
  },
  searchButton: {
    backgroundColor: "#1B5E20",
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 8,
    justifyContent: "center",
    marginRight: 8,
  },
  searchButtonText: { color: "#fff", fontWeight: "bold" },
  clearButton: {
    backgroundColor: "#A5D6A7",
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 8,
    justifyContent: "center",
  },
  clearButtonText: { color: "#1B5E20", fontWeight: "bold" },

  filterHint: { marginBottom: 12, color: "#2E7D32" },

  centerText: { textAlign: "center", marginTop: 20 },

  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
  },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 12, backgroundColor: "#C8E6C9" },
  name: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  role: { fontSize: 14, color: "#fff" },
  department: { fontSize: 12, color: "#fff", marginBottom: 4 },
  bio: { fontSize: 12, color: "#fff" },
});

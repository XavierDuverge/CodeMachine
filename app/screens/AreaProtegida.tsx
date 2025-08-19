import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const API_BASE = "https://adamix.net/medioambiente";

interface AreaProtegida {
  id: string;
  nombre: string;
  tipo: string;
  descripcion: string;
  ubicacion: string;
  superficie: string;
  imagen: string;
  latitud: number;
  longitud: number;
}

const TIPOS = [
  { label: "Parque Nacional", value: "parque_nacional" },
  { label: "Reserva Científica", value: "reserva_cientifica" },
  { label: "Monumento Natural", value: "monumento_natural" },
  { label: "Refugio de Vida Silvestre", value: "refugio_vida_silvestre" },
];

export default function AreasProtegidasScreen() {
  const router = useRouter();
  const [areas, setAreas] = useState<AreaProtegida[]>([]);
  const [search, setSearch] = useState("");
  const [tipo, setTipo] = useState("parque_nacional");
  const [loading, setLoading] = useState(false);

  const fetchAreas = async () => {
    setLoading(true);
    try {
      const url = `${API_BASE}/areas_protegidas?tipo=${tipo}&busqueda=${encodeURIComponent(
        search
      )}`;
      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      const data = await response.json();
      if (response.ok) setAreas(data);
      else setAreas([]);
    } catch (error) {
      console.error("Error fetch:", error);
      setAreas([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 cargar la primera vez y cada vez que cambie el tipo
  useEffect(() => {
    fetchAreas();
  }, [tipo]);

  const handleSearch = () => fetchAreas();

  const goToDetail = (item: AreaProtegida) => {
    router.push({
      pathname: "/screens/area/[id]",
      params: {
        id: String(item.id),
        // enviamos el item para evitar otro fetch si está disponible
        item: JSON.stringify(item),
      },
    });
  };

  const renderItem = ({ item }: { item: AreaProtegida }) => (
    <TouchableOpacity style={styles.card} onPress={() => goToDetail(item)} activeOpacity={0.8}>
      {!!item.imagen && <Image source={{ uri: item.imagen }} style={styles.image} />}
      <Text style={styles.name}>{item.nombre}</Text>
      <Text style={styles.type}>{item.tipo}</Text>
      <Text numberOfLines={3} style={styles.description}>
        {item.descripcion}
      </Text>
      <Text style={styles.location}>Ubicación: {item.ubicacion}</Text>
      <Text style={styles.surface}>Superficie: {item.superficie}</Text>

      <View style={styles.cardFooter}>
        <Text style={styles.linkText}>Ver detalles →</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Botón de regresar */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push("/(tabs)/explore")}>
        <Text style={styles.backButtonText}>← Explorer</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Áreas Protegidas</Text>

      {/* Selector de tipo */}
      <View style={styles.tipoContainer}>
        {TIPOS.map((t) => (
          <TouchableOpacity
            key={t.value}
            style={[styles.tipoButton, tipo === t.value && styles.tipoButtonActive]}
            onPress={() => setTipo(t.value)}
          >
            <Text style={[styles.tipoText, tipo === t.value && styles.tipoTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Buscar por nombre..."
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1B5E20" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={areas}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", color: "#6B7280", marginTop: 24 }}>
              No se encontraron resultados.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8F9FA" },
  backButton: { marginBottom: 10, marginTop: 22 },
  backButtonText: { fontSize: 16, color: "#1B5E20", fontWeight: "bold" },

  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },

  tipoContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 },
  tipoButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#E5E7EB",
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  tipoButtonActive: { backgroundColor: "#1B5E20" },
  tipoText: { color: "#374151", fontSize: 12 },
  tipoTextActive: { color: "white", fontWeight: "bold" },

  searchContainer: { flexDirection: "row", marginBottom: 20 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: "#1B5E20",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonText: { color: "white", fontWeight: "bold" },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  image: { width: "100%", height: 150, borderRadius: 8, marginBottom: 8, backgroundColor: "#eee" },
  name: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  type: { fontSize: 14, color: "#6B7280", marginBottom: 8 },
  description: { fontSize: 14, color: "#374151", marginBottom: 4 },
  location: { fontSize: 12, color: "#4B5563" },
  surface: { fontSize: 12, color: "#4B5563" },

  cardFooter: { marginTop: 12, alignItems: "flex-end" },
  linkText: { color: "#1B5E20", fontWeight: "700" },
});

import { useEffect, useState } from "react";
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

type Miembro = {
  id: string;
  nombre: string;
  cargo: string;
  departamento: string;
  foto: string;
  biografia: string;
  orden: number;
  fecha_creacion?: string;
};

export default function EquipoScreen() {
  const [miembros, setMiembros] = useState<Miembro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMiembros = async () => {
      try {
        const response = await fetch("https://adamix.net/medioambiente/equipo", {
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("La respuesta no es un array");
        }

        const miembrosOrdenados = data.sort((a, b) => a.orden - b.orden);
        setMiembros(miembrosOrdenados);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el equipo. Intente más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchMiembros();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#4caf50" />
          <Text>Cargando miembros...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>👥 Equipo del Ministerio</Text>

        {miembros.length === 0 ? (
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
  container: { padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1b5e20",
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
  },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 12 },
  name: { fontSize: 18, fontWeight: "bold", color: "#2E7D32" },
  role: { fontSize: 14, color: "#555" },
  department: { fontSize: 12, color: "#777", marginBottom: 4 },
  bio: { fontSize: 12, color: "#444" },
});

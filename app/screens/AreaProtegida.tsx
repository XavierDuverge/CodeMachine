import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function Punto3Screen() {
  const router = useRouter();
  const [open, setOpen] = useState(false); // Estado para mostrar/ocultar opciones

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ando con juan fumando una Z</Text>

      {/* Opciones desplegables */}
      {open && (
        <View style={styles.menu}>
          <TouchableOpacity style={styles.option} onPress={() => (router.push('/(tabs)/sobre-nosotros'))}>
            <Text style={styles.optionText}>Sobre nosotros</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={() => router.push('/(tabs)/explore')}>
            <Text style={styles.optionText}>Explore</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={() => router.back()}>
            <Text style={styles.optionText}>Home</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Botón flotante redondo */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setOpen(!open)}
      >
        <Text style={styles.fabText}>{open ? "×" : "+"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, marginBottom: 20 },

  // Menú desplegable
  menu: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    elevation: 5,
  },
  option: {
    padding: 10,
    backgroundColor: "#4caf50",
    marginVertical: 5,
    borderRadius: 8,
  },
  optionText: {
    color: "white",
    fontWeight: "bold",
  },

  // Botón flotante
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#4caf50",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  fabText: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
});

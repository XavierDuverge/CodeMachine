import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function NormativasScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Botón Volver */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.push("/(tabs)/explore")}>
          <Text style={styles.backButtonText}>← Explorer</Text>
        </TouchableOpacity>
        <Text style={styles.title}>📜 Normativas Ambientales</Text>
        <View style={styles.card}>
          <Text style={styles.text}>Ley 64-00: Ley General de Medio Ambiente y Recursos Naturales.</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.text}>Decreto 123-04: Reglamento de Áreas Protegidas.</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.text}>Resolución 45-19: Manejo de Residuos Sólidos.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#E8F5E9", paddingTop: 22 },
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#1b5e20", textAlign: "center" },
  card: { backgroundColor: "#fff", padding: 16, borderRadius: 12, marginBottom: 16, elevation: 3 },
  text: { fontSize: 16, color: "#444" },
   backButton: { marginBottom: 10 },
  backButtonText: { fontSize: 16, color: '#1B5E20', fontWeight: 'bold' },
});

import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function MedidasScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>🌍 Medidas Ambientales</Text>
        <View style={styles.card}>
          <Text style={styles.text}>♻️ Reduce, reutiliza y recicla tus desechos.</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.text}>🚲 Usa transporte sostenible como bicicletas o transporte público.</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.text}>💡 Ahorra energía apagando luces y aparatos innecesarios.</Text>
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
});

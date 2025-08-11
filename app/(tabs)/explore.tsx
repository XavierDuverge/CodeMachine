// app/(tabs)/explore.tsx
import { useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ExploreScreen() {
  const router = useRouter();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🌱 Bienvenido a la Exploración</Text>

      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' }}
        
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Servicios</Text>
        <Text style={styles.cardText}>
          Consulta los servicios que ofrece el Ministerio para proteger el medio ambiente.
        </Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Ir a Servicios</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Noticias Ambientales</Text>
        <Text style={styles.cardText}>
          Mantente informado sobre el medio ambiente en República Dominicana.
        </Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Ver Noticias</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Voluntariado</Text>
        <Text style={styles.cardText}>
          ¿Quieres ayudar? Regístrate y sé parte de nuestras brigadas verdes.
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
  <Text style={styles.buttonText}>Unirme</Text>
</TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#e8f5e9',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1b5e20',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#388e3c',
  },
  cardText: {
    fontSize: 16,
    marginBottom: 12,
    color: '#444',
  },
  button: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

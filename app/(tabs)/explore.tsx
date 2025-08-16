// app/(tabs)/explore.tsx

import { useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from 'react-native';

export default function ExploreScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>🌱 Bienvenido a la Exploración</Text>

        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
          }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Servicios */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Servicios</Text>
          <Text style={styles.cardText}>
            Consulta los servicios que ofrece el Ministerio para proteger el medio ambiente.
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/screens/servicios')}>
            <Text style={styles.buttonText}>Ir a Servicios</Text>
          </TouchableOpacity>
        </View>

        {/* Noticias */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Noticias Ambientales</Text>
          <Text style={styles.cardText}>
            Mantente informado sobre el medio ambiente en República Dominicana.
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/screens/noticias')}>
            <Text style={styles.buttonText}>Ver Noticias</Text>
          </TouchableOpacity>
        </View>

        {/* Voluntariado */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Voluntariado</Text>
          <Text style={styles.cardText}>
            ¿Quieres ayudar? Regístrate y sé parte de nuestras brigadas verdes.
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push('../login')}>
            <Text style={styles.buttonText}>Unirme</Text>
          </TouchableOpacity>
        </View>

        {/* Áreas Protegidas */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Áreas Protegidas</Text>
          <Text style={styles.cardText}>
            Conoce y respeta los espacios naturales que conservan nuestra biodiversidad.
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/screens/AreaProtegida')}>
            <Text style={styles.buttonText}>Explorar</Text>
          </TouchableOpacity>
        </View>

        {/* Reportar Daño */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Reportar Daño</Text>
          <Text style={styles.cardText}>
            Reporta fácilmente daños ambientales con fotos y ubicación. Revisa tus reportes y visualízalos en el mapa.
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push('../screens/formulario')}>
            <Text style={styles.buttonText}>Reportar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    paddingTop: 22,
  },

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

// app/(tabs)/explore.tsx
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView } from 'react-native';
const router = require("expo-router").useRouter();
export default function ExploreScreen() {
  return (

        <SafeAreaView style={styles.safeArea}>
          <View style={styles.appBar}>
            <Text style={styles.appBarText}>Vag - OS</Text>
          </View> 
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title} testID="Textprincipal">🌱 Bienvenido a la Exploración</Text>

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
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Unirme</Text>
        </TouchableOpacity>
      </View>

       <View style={styles.card}>
        <Text style={styles.cardTitle}>Areas Protegidas</Text>
        <Text style={styles.cardText}>
           "Conoce y respeta los espacios naturales que conservan nuestra biodiversidad."
        </Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}  onPress={() => router.push("/screens/AreaProtegida")} >Unirme</Text>
        </TouchableOpacity>
      </View>

       <View style={styles.card}>
        <Text style={styles.cardTitle}>Reportar Daño</Text>
        <Text style={styles.cardText}>
           "Reporta fácilmente daños ambientales con fotos y ubicación.
            Revisa tus reportes y visualízalos en el mapa."
        </Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}  onPress={() => router.push('/screens/Formulario')} >Unirme</Text>
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
  },
  appBar: {
    height: 60,
    backgroundColor: '#c5f8caff',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  appBarText: {
    color: '#2E7D32',
    fontSize: 20,
    fontWeight: 'bold',
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

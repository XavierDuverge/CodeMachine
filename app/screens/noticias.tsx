import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

type Noticia = {
  id: string;
  titulo: string;
  resumen: string;
  contenido: string;
  imagen: string;
  fecha: string;
};

export default function NoticiasScreen() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const API_URL =
    'https://api.allorigins.win/raw?url=https://adamix.net/medioambiente/noticias';

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

        const data: Noticia[] = await res.json();

        const noticiasConImagenes = data.map((item) => ({
          ...item,
          imagen:
            item.imagen && item.imagen.startsWith('http')
              ? item.imagen
              : 'https://via.placeholder.com/640x360.png?text=Noticia',
        }));

        setNoticias(noticiasConImagenes);
      } catch (err: any) {
        setError(`Error cargando la API: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchNoticias();
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  if (error)
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* AppBar con botón volver y título */}
      <View style={styles.appBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/(tabs)/explore')}
        >
          <Text style={styles.backButtonText}>← Explorer</Text>
        </TouchableOpacity>
        <Text style={styles.appBarText}>Noticias Ambientales</Text>
      </View>

      <FlatList
        data={noticias}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={require('../../assets/images/reforastion.jpeg')} style={styles.image} />

            <Text style={styles.title}>{item.titulo}</Text>
            <Text style={styles.resumen}>{item.resumen}</Text>
            <Text style={styles.fecha}>{item.fecha}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>No hay noticias disponibles.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F1F8E9',
    paddingTop: 22,
  },
  appBar: {
    height: 60,
    backgroundColor: '#c5f8caff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    padding: 6,
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#1B5E20',
    fontWeight: 'bold',
  },
  appBarText: {
    color: '#388e3c',
    fontSize: 20,
    fontWeight: 'bold',
  },

  card: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#c5f8caff',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  image: { width: '100%', height: 200, borderRadius: 10, backgroundColor: '#ccc', },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 10,
    color: '#1b5e20',
  },
  resumen: {
    marginTop: 5,
    fontSize: 14,
    color: '#2E7D32',
  },
  fecha: {
    marginTop: 6,
    fontSize: 12,
    color: 'gray',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

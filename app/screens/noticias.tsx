import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, Platform } from 'react-native';

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

  const API_URL =
    Platform.OS === 'web'
      ? 'https://api.allorigins.win/raw?url=https://adamix.net/medioambiente/noticias' // Proxy CORS gratuito para web
      : 'https://adamix.net/medioambiente/noticias'; // Fetch directo para móvil

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        const data: Noticia[] = await res.json();

        // Reemplazamos URLs inválidas por un placeholder
        const noticiasConImagenes = data.map((item) => ({
          ...item,
          imagen:
            item.imagen && item.imagen.startsWith('http')
              ? item.imagen
              : 'https://via.placeholder.com/300x200.png?text=Noticia',
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
    <FlatList
      data={noticias}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image
            source={{ uri: item.imagen }}
            style={styles.image}
            resizeMode="cover"
          />
          <Text style={styles.title}>{item.titulo}</Text>
          <Text style={styles.resumen}>{item.resumen}</Text>
          <Text style={styles.fecha}>{item.fecha}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: '#ccc', // color de fondo si falla la carga
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 10,
  },
  resumen: {
    marginTop: 5,
    fontSize: 14,
  },
  fecha: {
    marginTop: 5,
    fontSize: 12,
    color: 'gray',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

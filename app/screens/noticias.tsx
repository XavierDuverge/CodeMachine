import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; 

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
  const router = useRouter(); // ✅ Hook de navegación

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
    <SafeAreaView style={styles.safeArea}>
      {/* Barra de navegación personalizada */}
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
         <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.appBarText}>Vag - OS</Text>
      </View>

      <FlatList
        data={noticias}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
          
         <Image
              source={require('../../assets/images/reforastion.jpeg')}
             style={styles.image}
              resizeMode="cover"
            />
             
         
          
            <Text style={styles.title}>{item.titulo}</Text>
            <Text style={styles.resumen}>{item.resumen}</Text>
            <Text style={styles.fecha}>{item.fecha}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    paddingTop:22, 
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
    padding: 5,
  },
  backText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  appBarText: {
    color: '#2E7D32',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  card: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#c5f8caff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: '#ccc',
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

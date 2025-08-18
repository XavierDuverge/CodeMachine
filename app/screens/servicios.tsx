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

type Servicio = {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  fecha_creacion: string;
};

export default function Servicios() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const API_URL =
    'https://api.allorigins.win/raw?url=https://adamix.net/medioambiente/servicios';

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

        const data: Servicio[] = await res.json();
        setServicios(data);
      } catch (err: any) {
        setError(`Error cargando la API: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchServicios();
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
      {/* AppBar con título y botón volver */}
      <View style={styles.appBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/(tabs)/explore')}
        >
          <Text style={styles.backButtonText}>← Explorer</Text>
        </TouchableOpacity>
        <Text style={styles.appBarText}>Servicios Ambientales</Text>
      </View>

      <FlatList
        data={servicios}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.icono ? (
              <Image source={{ uri: item.icono }} style={styles.icono} />
            ) : null}
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text style={styles.descripcion}>{item.descripcion}</Text>
          </View>
        )}
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
  appBarText: {
    color: '#388e3c',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
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

  card: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  icono: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  nombre: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
  },
  descripcion: {
    marginTop: 4,
    fontSize: 14,
    color: '#f1f8e9',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView, Button } from 'react-native';
import { useRouter } from 'expo-router';
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

    const API_URL = 'https://api.allorigins.win/raw?url=https://adamix.net/medioambiente/servicios';

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
            <View style={styles.appBar}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.appBarText}>Vag - OS</Text>
            </View>

            <FlatList
                data={servicios}
                keyExtractor={(item) => item.id}
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
    appBarText: {
        color: '#2E7D32',
        fontSize: 20,
        fontWeight: 'bold',
    },
    backButton: {
        padding: 5,
    },
    backText: {
        fontSize: 24,
        fontWeight: 'bold',
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
    icono: {
        width: 50,
        height: 50,
        marginBottom: 5,
    },
    nombre: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    descripcion: {
        marginTop: 3,
        fontSize: 14,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

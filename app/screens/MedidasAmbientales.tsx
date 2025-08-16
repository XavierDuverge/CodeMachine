import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Medida {
    id: string;
    titulo: string;
    descripcion: string;
    categoria: string;
    icono: string;
}

const MedidasAmbientales: React.FC = () => {
    const [medidas, setMedidas] = useState<Medida[]>([]);
    const [detalle, setDetalle] = useState<Medida | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('https://adamix.net/medioambiente/medidas')
            .then(res => {
                setMedidas(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Medidas Ambientales</Text>
            <FlatList
                data={medidas}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.item} onPress={() => setDetalle(item)}>
                        <Text style={styles.itemTitle}>{item.titulo}</Text>
                    </TouchableOpacity>
                )}
            />
            {detalle && (
                <View style={styles.detail}>
                    <Text style={styles.detailTitle}>{detalle.titulo}</Text>
                    <Text style={styles.detailDesc}>{detalle.descripcion}</Text>
                    <Text style={styles.detailCat}>Categoría: {detalle.categoria}</Text>
                    {detalle.icono ? (
                        <Text style={styles.emoji}>{detalle.icono}</Text>
                    ) : null}
                    <TouchableOpacity onPress={() => setDetalle(null)} style={styles.closeBtn}>
                        <Text style={styles.closeText}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
    item: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
    itemTitle: { fontSize: 18 },
    detail: { marginTop: 24, padding: 16, backgroundColor: '#f0f8ff', borderRadius: 8 },
    detailTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
    detailDesc: { fontSize: 16, marginBottom: 8 },
    detailCat: { fontSize: 14, color: '#555', marginBottom: 8 },
    icon: { width: 60, height: 60, marginBottom: 8 },
    emoji: { fontSize: 48, marginBottom: 8, textAlign: 'center' },
    closeBtn: { marginTop: 8, alignSelf: 'flex-end', backgroundColor: '#2196f3', padding: 8, borderRadius: 4 },
    closeText: { color: '#fff', fontWeight: 'bold' },
});

export default MedidasAmbientales;

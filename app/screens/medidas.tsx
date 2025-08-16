import axios from 'axios';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Medida {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  icono: string;
}

export default function MedidasScreen() {
  const [categoria, setCategoria] = useState('');
  const [medidas, setMedidas] = useState<Medida[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMedidas = async () => {
    if (!categoria) return;
    setLoading(true);
    try {
      const res = await axios.get(`https://adamix.net/medioambiente/medidas?categoria=${encodeURIComponent(categoria)}`);
      setMedidas(res.data);
    } catch (error) {
      console.error('Error fetch:', error);
      setMedidas([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌍 Medidas Ambientales</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Categoría (ej: consumo_responsable)"
          value={categoria}
          onChangeText={setCategoria}
        />
        <TouchableOpacity style={styles.button} onPress={fetchMedidas}>
          <Text style={styles.buttonText}>Buscar</Text>
        </TouchableOpacity>
      </View>
      {loading ? <ActivityIndicator size="large" /> : null}
      <FlatList
        data={medidas}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.icono ? item.icono + ' ' : ''}{item.titulo}</Text>
            <Text style={styles.itemDesc}>{item.descripcion}</Text>
            <Text style={styles.itemCat}>Categoría: {item.categoria}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#E8F5E9' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#1B5E20' },
  inputContainer: { flexDirection: 'row', marginBottom: 16 },
  input: { flex: 1, borderWidth: 1, borderColor: '#1B5E20', borderRadius: 8, padding: 10, marginRight: 10 },
  button: { backgroundColor: '#1B5E20', padding: 10, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  item: { padding: 12, backgroundColor: '#4CAF50', borderRadius: 8, marginBottom: 12 },
  itemTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  itemDesc: { fontSize: 14, color: '#fff', marginTop: 4 },
  itemCat: { fontSize: 12, color: '#E0F2F1', marginTop: 2 },
});

import { View, Text, ScrollView, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const slides = [
  {
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=60',
    mensaje: 'Protege la naturaleza, es nuestro hogar.',
  },
  {
    img: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=60',
    mensaje: 'Reciclar hoy es vivir mañana.',
  },
  {
    img: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=60',
    mensaje: 'Cada acción cuenta. Cuida el planeta.',
  },
];

export default function Inicio() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {slides.map((slide, i) => (
        <View key={i} style={styles.slide}>
          <Image source={{ uri: slide.img }} style={styles.image} />
          <Text style={styles.text}>{slide.mensaje}</Text>
        </View>
      ))}
      <Text style={styles.description}>
        Nuestro compromiso es proteger los recursos naturales y promover prácticas sostenibles para un futuro mejor.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
  },
  slide: {
    width,
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: width * 0.9,
    height: 180,
    borderRadius: 12,
  },
  text: {
    marginTop: 10,
    fontSize: 18,
    color: '#2E7D32',
    fontWeight: '600',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#2E7D32',
    textAlign: 'center',
    marginTop: 20,
  },
});

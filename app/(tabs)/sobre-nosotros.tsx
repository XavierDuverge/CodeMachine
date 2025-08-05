import { View, Text, StyleSheet } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

export default function SobreNosotros() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Historia</Text>
      <Text style={styles.text}>
        El ministerio fue creado para proteger los recursos naturales y fomentar la educación ambiental.
      </Text>

      <Text style={styles.header}>Misión</Text>
      <Text style={styles.text}>
        Promover el desarrollo sostenible y la conservación ambiental en todo el territorio nacional.
      </Text>

      <Text style={styles.header}>Visión</Text>
      <Text style={styles.text}>
        Ser un referente en gestión ambiental y desarrollo sostenible en Latinoamérica.
      </Text>

      <Text style={styles.header}>Video Institucional</Text>
      <Video
        source={{ uri: 'https://www.w3schools.com/html/mov_bbb.mp4' }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        style={styles.video}
      />

      <Text style={styles.header}>Texto Explicativo</Text>
      <Text style={styles.text}>
        El Ministerio coordina acciones a favor del medio ambiente y fomenta la educación ecológica para toda la comunidad.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F1F8E9',
  },
  header: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#33691E',
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    color: '#558B2F',
    marginTop: 5,
  },
  video: {
    width: '100%',
    height: 200,
    marginTop: 15,
    borderRadius: 10,
  },
});

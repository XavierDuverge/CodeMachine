import { ResizeMode, Video } from 'expo-av';
import { ScrollView, StyleSheet, Text, SafeAreaView, View } from 'react-native';


export default function SobreNosotros() {
  return (
   
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.appBar}>
            <Text style={styles.appBarText}>Vag - OS</Text>
          </View> 

    <ScrollView style={styles.container}>
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
    marginTop: 10,
    paddingBottom: 20
  },
  video: {
    width: '100%',
    height: 200,
    marginTop: 15,
    borderRadius: 10,
  },
});

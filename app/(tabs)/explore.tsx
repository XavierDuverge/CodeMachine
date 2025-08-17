import { useRouter } from "expo-router";
import { Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function ExploreScreen() {
  const router = useRouter();

  const cards = [
    {
      title: "Servicios",
      description: "Consulta los servicios del Ministerio para proteger el medio ambiente",
      icon: "🏢",
      route: "/screens/servicios",
      buttonText: "Explorar",
      color: "#ffffff",
      accent: "#E8F5E9"
    },
    {
      title: "Noticias",
      description: "Mantente informado sobre el medio ambiente en RD",
      icon: "📰",
      route: "/screens/noticias",
      buttonText: "Ver Más",
      color: "#ffffff",
      accent: "#c5f8caff"
    },
    {
      title: "Videos Educativos",
      description: "Reciclaje, conservación, cambio climático y biodiversidad",
      icon: "🎬",
      route: "/screens/videos",        // 👈 esta es la ruta del screen
      buttonText: "Ver",
      color: "#ffffff",
      accent: "#E8F5E9"
    },

    {
      title: "Voluntariado",
      description: "Únete a nuestras brigadas verdes y marca la diferencia",
      icon: "🤝",
      route: "/login",
      buttonText: "Unirse",
      color: "#ffffff",
      accent: "#E8F5E9"
    },
    {
      title: "Áreas Protegidas",
      description: "Descubre espacios naturales que conservan nuestra biodiversidad",
      icon: "🏞️",
      route: "/screens/AreaProtegida",
      buttonText: "Explorar",
      color: "#ffffff",
      accent: "#c5f8caff"
    },
    {
      title: "Reportar Daño",
      description: "Reporta daños ambientales con fotos y ubicación GPS",
      icon: "⚠️",
      route: "/screens/Formulario",
      buttonText: "Reportar",
      color: "#ffffff",
      accent: "#E8F5E9"
    },
    {
      title: "Medidas Ambientales",
      description: "Acciones para reducir tu impacto ambiental",
      icon: "♻️",
      route: "/screens/medidas",
      buttonText: "Aprender",
      color: "#ffffff",
      accent: "#c5f8caff"
    },
    {
      title: "Normativas",
      description: "Leyes y reglamentos ambientales vigentes",
      icon: "📋",
      route: "/screens/normativas",
      buttonText: "Consultar",
      color: "#ffffff",
      accent: "#E8F5E9"
    },
    {
      title: "Nuestro Equipo",
      description: "Conoce a los especialistas que cuidan el medio ambiente",
      icon: "👥",
      route: "/screens/equipo",
      buttonText: "Conocer",
      color: "#ffffff",
      accent: "#c5f8caff"
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoEmoji}>🏛️</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>Vag-OS</Text>
              <Text style={styles.headerSubtitle}>Sistema de Gestión Ambiental</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuIcon}>⋯</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome section mejorada */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle} testID="Textprincipal">
            Explora y Cuida
          </Text>
          <Text style={styles.welcomeSubtitle}>
            Tu plataforma para proteger el medio ambiente
          </Text>
        </View>

        {/* Imagen hero optimizada */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroText}>🌍 Juntos por un futuro verde</Text>
          </View>
        </View>

        {/* Cards en una sola columna para móvil */}
        <View style={styles.cardsContainer}>
          {cards.map((card, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, { backgroundColor: card.color }]}
              onPress={() => router.push(card.route as any)}
              activeOpacity={0.7}
            >
              <View style={[styles.cardBorder, { backgroundColor: card.accent }]} />
              <View style={styles.cardContent}>
                <View style={styles.cardLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: card.accent }]}>
                    <Text style={styles.cardIcon}>{card.icon}</Text>
                  </View>
                </View>

                <View style={styles.cardCenter}>
                  <Text style={styles.cardTitle}>{card.title}</Text>
                  <Text style={styles.cardDescription}>{card.description}</Text>
                </View>

                <View style={styles.cardRight}>
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>{card.buttonText}</Text>
                  </View>
                  <Text style={styles.arrow}>→</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F1F8E9',
  },
  header: {
    backgroundColor: '#166534',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoEmoji: {
    fontSize: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    color: 'white',
    fontSize: 20,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    color: '#1b5e20',
    marginBottom: 8,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  welcomeSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#2E7D32',
    opacity: 0.9,
    fontWeight: '500',
    letterSpacing: 0.3,
    lineHeight: 22,
  },
  heroContainer: {
    position: 'relative',
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  heroImage: {
    width: '100%',
    height: 160,
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
  heroText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardsContainer: {
    marginBottom: 24,
  },
  card: {
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  cardBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  cardLeft: {
    marginRight: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardIcon: {
    fontSize: 24,
  },
  cardCenter: {
    flex: 1,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1b5e20',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  cardDescription: {
    fontSize: 14,
    color: '#2E7D32',
    lineHeight: 20,
    opacity: 0.8,
    fontWeight: '400',
  },
  cardRight: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.2,
  },
  arrow: {
    color: '#1b5e20',
    fontSize: 16,
    fontWeight: '800',
  },
});
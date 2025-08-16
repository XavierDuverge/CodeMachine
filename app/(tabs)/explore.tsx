import { useRouter } from "expo-router";
import { Dimensions, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

interface Card {
  title: string;
  description: string;
  icon: string;
  route: string;
  buttonText: string;
  color: string;
}

export default function ExploreScreen() {
  const router = useRouter();

  const cards: Card[] = [
    {
      title: "Servicios",
      description: "Consulta los servicios del Ministerio para proteger el medio ambiente",
      icon: "🏢",
      route: "/screens/servicios",
      buttonText: "Explorar",
      color: "#4CAF50"
    },
    {
      title: "Noticias",
      description: "Mantente informado sobre el medio ambiente en RD",
      icon: "📰",
      route: "/screens/noticias",
      buttonText: "Ver Más",
      color: "#2196F3"
    },
    {
      title: "Voluntariado",
      description: "Únete a nuestras brigadas verdes y marca la diferencia",
      icon: "🤝",
      route: "/login",
      buttonText: "Unirse",
      color: "#FF9800"
    },
    {
      title: "Áreas Protegidas",
      description: "Descubre espacios naturales que conservan nuestra biodiversidad",
      icon: "🏞️",
      route: "/screens/AreaProtegida",
      buttonText: "Explorar",
      color: "#9C27B0"
    },
    {
      title: "Reportar Daño",
      description: "Reporta daños ambientales con fotos y ubicación GPS",
      icon: "⚠️",
      route: "/screens/Formulario",
      buttonText: "Reportar",
      color: "#F44336"
    },
    {
      title: "Medidas Ambientales",
      description: "Acciones para reducir tu impacto ambiental",
      icon: "♻️",
      route: "/screens/medidas",
      buttonText: "Aprender",
      color: "#009688"
    },
    {
      title: "Normativas",
      description: "Leyes y reglamentos ambientales vigentes",
      icon: "📋",
      route: "/screens/normativas",
      buttonText: "Consultar",
      color: "#795548"
    },
    {
      title: "Nuestro Equipo",
      description: "Conoce a los especialistas que cuidan el medio ambiente",
      icon: "👥",
      route: "/screens/equipo",
      buttonText: "Conocer",
      color: "#607D8B"
    }
  ];

  const CardItem: React.FC<{ card: Card; index: number }> = ({ card, index }) => (
    <TouchableOpacity 
      style={[styles.card, { borderLeftColor: card.color }]}
      activeOpacity={0.8}
      onPress={() => router.push(card.route as any)}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: card.color + '20' }]}>
          <Text style={styles.cardIcon}>{card.icon}</Text>
        </View>
        <View style={styles.cardTitleContainer}>
          <Text style={styles.cardTitle}>{card.title}</Text>
          <View style={[styles.indicator, { backgroundColor: card.color }]} />
        </View>
      </View>
      <Text style={styles.cardDescription} numberOfLines={2}>
        {card.description}
      </Text>
      <TouchableOpacity style={styles.actionButton}>
        <Text style={[styles.buttonText, { color: card.color }]}>
          {card.buttonText} →
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1B5E20" />
      
      {/* Header profesional */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoIcon}>🏛️</Text>
            </View>
            <View style={styles.headerTextContainer}>
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
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.mainTitle} testID="Textprincipal">Explora y Cuida</Text>
          <Text style={styles.mainSubtitle}>
            Tu plataforma para proteger el medio ambiente y construir un futuro sostenible
          </Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>🌍</Text>
              <Text style={styles.statLabel}>Alcance Nacional</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>🤝</Text>
              <Text style={styles.statLabel}>Participativo</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>📱</Text>
              <Text style={styles.statLabel}>Digital</Text>
            </View>
          </View>
        </View>

        {/* Imagen hero optimizada */}
        <View style={styles.heroImageContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroOverlayText}>🌱 Juntos por un futuro verde</Text>
          </View>
        </View>

        {/* Sección de servicios */}
        <View style={styles.servicesContainer}>
          <Text style={styles.containerTitle}>🚀 Servicios Disponibles</Text>
          <Text style={styles.servicesDescription}>
            Accede a todas las herramientas y recursos para el cuidado del medio ambiente
          </Text>
          {cards.map((card, index) => (
            <CardItem key={index} card={card} index={index} />
          ))}
        </View>

        {/* Call to Action */}
        <View style={styles.ctaSection}>
          <View style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>🌍 Únete al Cambio</Text>
            <Text style={styles.ctaText}>
              Cada acción cuenta. Sé parte de la comunidad que está transformando 
              el futuro de nuestro medio ambiente.
            </Text>
            <TouchableOpacity style={styles.ctaButton}>
              <Text style={styles.ctaButtonText}>Comenzar Ahora</Text>
              <Text style={styles.ctaButtonIcon}>→</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#1B5E20',
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
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
  logo: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoIcon: {
    fontSize: 20,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B5E20',
    textAlign: 'center',
    marginBottom: 8,
  },
  mainSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  heroImageContainer: {
    marginHorizontal: 20,
    marginVertical: 20,
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
  heroOverlayText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  servicesContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  containerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 8,
  },
  servicesDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardIcon: {
    fontSize: 20,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  indicator: {
    width: 40,
    height: 2,
    borderRadius: 1,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  actionButton: {
    alignSelf: 'flex-start',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  ctaSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  ctaCard: {
    backgroundColor: '#1B5E20',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  ctaText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctaButtonText: {
    color: '#1B5E20',
    fontWeight: '600',
    marginRight: 8,
  },
  ctaButtonIcon: {
    color: '#1B5E20',
    fontWeight: 'bold',
  },
});
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=60',
    mensaje: 'Protege la naturaleza, es nuestro hogar.',
    icon: '🌲',
    category: 'Conservación'
  },
  {
    img: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=60',
    mensaje: 'Reciclar hoy es vivir mañana.',
    icon: '♻️',
    category: 'Reciclaje'
  },
  {
    img: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=60',
    mensaje: 'Cada acción cuenta. Cuida el planeta.',
    icon: '🌍',
    category: 'Sostenibilidad'
  },
];

export default function Inicio() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSlidePress = (index: number) => {
    setActiveSlide(index);
    // Aquí podrías agregar navegación a detalle
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1B5E20" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header Profesional */}
        <View style={styles.header}>
          <Animated.View 
            style={[styles.headerContent, { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }]}
          >
            <View style={styles.headerTop}>
              <View style={styles.logoContainer}>
                <View style={styles.logo}>
                  <Text style={styles.logoIcon}>🏛️</Text>
                </View>
                <View>
                  <Text style={styles.headerTitle}>Vag-OS</Text>
                  <Text style={styles.headerSubtitle}>Sistema de Gestión Ambiental</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.notificationButton}>
                <Text style={styles.notificationIcon}>🔔</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>

        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Hero Section */}
          <Animated.View 
            style={[styles.heroSection, { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }]}
          >
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>🌱 Bienvenido</Text>
              <Text style={styles.heroSubtitle}>
                Juntos construimos un futuro sostenible para las próximas generaciones
              </Text>
              
              {/* Botones de acción rápida */}
              <View style={styles.quickActions}>
                <TouchableOpacity style={[styles.actionButton, styles.primaryAction]}>
                  <Text style={styles.actionIcon}>🚀</Text>
                  <Text style={styles.actionText}>Explorar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.actionButton, styles.secondaryAction]}>
                  <Text style={styles.actionIcon}>📱</Text>
                  <Text style={styles.actionText}>Reportar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>

          {/* Slides de iniciativas */}
          <View style={styles.slidesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🎯 Iniciativas Principales</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>Ver todas →</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.slidesContainer}
              snapToInterval={width * 0.85}
              decelerationRate="fast"
            >
              {slides.map((slide, i) => (
                <TouchableOpacity 
                  key={i} 
                  style={styles.slideCard}
                  onPress={() => handleSlidePress(i)}
                  activeOpacity={0.9}
                >
                  <View style={styles.slideContent}>
                    {/* Indicador de categoría */}
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{slide.category}</Text>
                    </View>
                    
                    {/* Imagen con overlay */}
                    <View style={styles.imageContainer}>
                      <Image source={{ uri: slide.img }} style={styles.slideImage} />
                      <View style={styles.imageOverlay}>
                        <Text style={styles.slideIcon}>{slide.icon}</Text>
                      </View>
                      <View style={styles.imageGradient} />
                    </View>

                    {/* Contenido del slide */}
                    <View style={styles.slideTextContainer}>
                      <Text style={styles.slideText}>{slide.mensaje}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Misión */}
          <View style={styles.missionSection}>
            <Text style={styles.sectionTitle}>🏆 Nuestra Misión</Text>
            
            <View style={styles.missionCard}>
              <Text style={styles.missionText}>
                Protegemos los recursos naturales y promovemos prácticas sostenibles 
                para un futuro próspero y equitativo.
              </Text>
              
              {/* Valores */}
              <View style={styles.valuesContainer}>
                {[
                  { icon: '🛡️', text: 'Proteger', color: '#4CAF50' },
                  { icon: '🌱', text: 'Conservar', color: '#2196F3' },
                  { icon: '🤝', text: 'Colaborar', color: '#FF9800' }
                ].map((value, index) => (
                  <TouchableOpacity key={index} style={styles.valueItem}>
                    <View style={[styles.valueIconContainer, { backgroundColor: value.color + '20' }]}>
                      <Text style={styles.valueIcon}>{value.icon}</Text>
                    </View>
                    <Text style={styles.valueText}>{value.text}</Text>
                    <View style={[styles.valueDot, { backgroundColor: value.color }]} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Call to Action */}
          <View style={styles.ctaSection}>
            <View style={styles.ctaCard}>
              <Text style={styles.ctaTitle}>🌍 Únete al Cambio</Text>
              <Text style={styles.ctaText}>
                Cada acción cuenta. Sé parte de la solución para un futuro sostenible.
              </Text>
              
              <TouchableOpacity style={styles.ctaButton}>
                <Text style={styles.ctaButtonText}>Comenzar Ahora</Text>
                <Text style={styles.ctaButtonIcon}>→</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer inspiracional */}
          <View style={styles.footerSection}>
            <Text style={styles.footerQuote}>
              &ldquo;El futuro depende de lo que hagamos hoy&rdquo;
            </Text>
            <Text style={styles.footerAuthor}>— Mahatma Gandhi</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
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
    flex: 1,
  },
  headerTop: {
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
  notificationButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  heroSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  primaryAction: {
    backgroundColor: '#1B5E20',
  },
  secondaryAction: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1B5E20',
  },
  actionIcon: {
    fontSize: 16,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  slidesSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  seeAllText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
  },
  slidesContainer: {
    paddingRight: 20,
  },
  slideCard: {
    width: width * 0.8,
    marginRight: 15,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  slideContent: {
    flex: 1,
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    zIndex: 2,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1B5E20',
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  slideIcon: {
    fontSize: 20,
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  slideTextContainer: {
    padding: 16,
  },
  slideText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
  },
  missionSection: {
    marginBottom: 24,
  },
  missionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  missionText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  valuesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  valueItem: {
    alignItems: 'center',
    flex: 1,
  },
  valueIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  valueIcon: {
    fontSize: 24,
  },
  valueText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
    marginBottom: 4,
  },
  valueDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  ctaSection: {
    marginBottom: 24,
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
    marginBottom: 8,
    textAlign: 'center',
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
    gap: 8,
  },
  ctaButtonText: {
    color: '#1B5E20',
    fontSize: 16,
    fontWeight: '600',
  },
  ctaButtonIcon: {
    color: '#1B5E20',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerQuote: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 8,
    lineHeight: 22,
  },
  footerAuthor: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});

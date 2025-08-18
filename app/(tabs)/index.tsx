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

const { width } = Dimensions.get('window');

const slides = [
  {
    img: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=60',
    mensaje: 'República Dominicana 30x30: Conservando el 30% de nuestro territorio para 2030',
    icon: '🏞️',
    category: 'Conservación'
  },
  {
    img: 'https://images.unsplash.com/photo-1614588623348-3e3bca4d84a7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    mensaje: 'Programa BIOFIN: Cerrando la brecha financiera para la biodiversidad',
    icon: '🌱',
    category: 'Biodiversidad',
  },
  {
    img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=60',
    mensaje: 'Fortaleciendo la resiliencia climática en zonas áridas del país',
    icon: '🌵',
    category: 'Resiliencia Climática'
  },
  {
    img: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=800&q=60',
    mensaje: '131 áreas protegidas conservan el 25.32% de nuestro territorio',
    icon: '🦎',
    category: 'Áreas Protegidas'
  },
  {
    img: 'https://images.unsplash.com/photo-1581578017306-7334b15283df?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    mensaje: 'Campamento Ecohéroes: Educando a más de 1,800 estudiantes',
    icon: '🎒',
    category: 'Educación Ambiental'
  },
];

// Colores por categoría (para el chip y el icono)
const CATEGORY_COLORS: Record<string, string> = {
  'Conservación': '#2E7D32',
  'Biodiversidad': '#1565C0',
  'Resiliencia Climática': '#EF6C00',
  'Áreas Protegidas': '#6A1B9A',
  'Educación Ambiental': '#00897B',
};

// Fallback si una imagen falla
const FALLBACK_IMG = 'https://via.placeholder.com/800x450.png?text=Medio+Ambiente';

function SlideCard({
  slide,
  onPress,
}: {
  slide: { img: string; mensaje: string; icon: string; category: string };
  onPress: () => void;
}) {
  const [broken, setBroken] = useState(false);
  const color = CATEGORY_COLORS[slide.category] ?? '#1B5E20';

  return (
    <TouchableOpacity style={styles.slideCard} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.slideContent}>
        {/* Chip de categoría */}
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: 'rgba(255,255,255,0.98)', borderColor: color, borderWidth: 1 },
          ]}
        >
          <Text style={[styles.categoryText, { color }]}>{slide.category}</Text>
        </View>

        {/* Imagen con overlay + fallback */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: broken ? FALLBACK_IMG : slide.img }}
            style={styles.slideImage}
            onError={() => setBroken(true)}
          />
          <View
            style={[
              styles.imageOverlay,
              { backgroundColor: 'rgba(255,255,255,0.98)', borderColor: color, borderWidth: 1 },
            ]}
          >
            <Text style={[styles.slideIcon, { color }]}>{slide.icon}</Text>
          </View>
          <View style={styles.imageGradient} />
        </View>

        {/* Texto del slide */}
        <View style={styles.slideTextContainer}>
          <Text style={styles.slideText}>{slide.mensaje}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function Inicio() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView | null>(null);

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
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1B5E20" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header Profesional */}
        <View style={styles.header}>
          <Animated.View
            style={[
              styles.headerContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
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
            </View>
          </Animated.View>
        </View>

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          bounces
        >
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
                <SlideCard
                  key={`${slide.category}-${i}`}
                  slide={slide}
                  onPress={() => handleSlidePress(i)}
                />
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
                  { icon: '🤝', text: 'Colaborar', color: '#FF9800' },
                ].map((value, index) => (
                  <TouchableOpacity key={index} style={styles.valueItem}>
                    <View
                      style={[
                        styles.valueIconContainer,
                        { backgroundColor: value.color + '20' },
                      ]}
                    >
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
  headerContent: { flex: 1 },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logo: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoIcon: { fontSize: 20 },
  headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold' },
  headerSubtitle: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 12, marginTop: 2 },

  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  slidesSection: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1B5E20' },
  seeAllText: { fontSize: 14, color: '#2196F3', fontWeight: '600' },

  slidesContainer: { paddingRight: 20 },
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
  slideContent: { flex: 1 },

  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    zIndex: 2,
  },
  categoryText: { fontSize: 12, fontWeight: '700' },

  imageContainer: { position: 'relative', height: 180 },
  slideImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e5e7eb',
  },
  imageOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  slideIcon: { fontSize: 20 },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },

  slideTextContainer: { padding: 16 },
  slideText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
  },

  missionSection: { marginBottom: 24 },
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
  valuesContainer: { flexDirection: 'row', justifyContent: 'space-around' },
  valueItem: { alignItems: 'center', flex: 1 },
  valueIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  valueIcon: { fontSize: 24 },
  valueText: { fontSize: 14, color: '#111827', fontWeight: '600', marginBottom: 4 },
  valueDot: { width: 4, height: 4, borderRadius: 2 },

  ctaSection: { marginBottom: 24 },
  ctaCard: { backgroundColor: '#1B5E20', borderRadius: 16, padding: 24, alignItems: 'center' },
  ctaTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8, textAlign: 'center' },
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
  ctaButtonText: { color: '#1B5E20', fontSize: 16, fontWeight: '600' },
  ctaButtonIcon: { color: '#1B5E20', fontSize: 16, fontWeight: 'bold' },

  footerSection: { alignItems: 'center', paddingVertical: 20 },
  footerQuote: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 8,
    lineHeight: 22,
  },
  footerAuthor: { fontSize: 14, color: '#9CA3AF', fontWeight: '500' },
});

import { ResizeMode, Video } from 'expo-av';
import React, { useState } from 'react';
import {
  Dimensions,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

interface Section {
  id: string;
  icon: string;
  title: string;
  content: string;
  color: string;
}

const sections: Section[] = [
  {
    id: 'mission',
    icon: '🎯',
    title: 'Nuestra Misión',
    content: 'Promover el desarrollo sostenible y la conservación de los recursos naturales, garantizando un equilibrio entre el crecimiento económico y la protección ambiental.',
    color: '#4CAF50'
  },
  {
    id: 'vision',
    icon: '🌟',
    title: 'Nuestra Visión',
    content: 'Ser una institución líder en gestión ambiental, reconocida por su excelencia técnica y compromiso con la sostenibilidad del territorio nacional.',
    color: '#2196F3'
  },
  {
    id: 'objectives',
    icon: '📋',
    title: 'Objetivos Institucionales',
    content: 'Implementar políticas ambientales efectivas, promover la educación ecológica, coordinar acciones de conservación y fomentar la participación ciudadana.',
    color: '#FF9800'
  },
  {
    id: 'commitment',
    icon: '💡',
    title: 'Nuestro Compromiso',
    content: 'Trabajar de manera transparente y colaborativa con todos los sectores de la sociedad para construir un futuro más sostenible y resiliente.',
    color: '#9C27B0'
  }
];

const coreValues = [
  { icon: '🛡️', text: 'Protección', description: 'Del medio ambiente' },
  { icon: '🌿', text: 'Sostenibilidad', description: 'En todas nuestras acciones' },
  { icon: '🤝', text: 'Colaboración', description: 'Con la comunidad' },
  { icon: '📚', text: 'Educación', description: 'Ambiental continua' },
  { icon: '⚖️', text: 'Transparencia', description: 'En la gestión' },
  { icon: '🔬', text: 'Innovación', description: 'Tecnológica y científica' }
];

export default function SobreNosotros() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [videoModalVisible, setVideoModalVisible] = useState(false);

  const SectionCard: React.FC<{ section: Section; index: number }> = ({ section, index }) => (
    <TouchableOpacity 
      style={[styles.sectionCard, { borderLeftColor: section.color }]}
      activeOpacity={0.8}
      onPress={() => setSelectedSection(section.id)}
    >
      <View style={styles.sectionHeader}>
        <View style={[styles.iconContainer, { backgroundColor: section.color + '20' }]}>
          <Text style={styles.sectionIcon}>{section.icon}</Text>
        </View>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={[styles.indicator, { backgroundColor: section.color }]} />
        </View>
      </View>
      <Text style={styles.sectionPreview} numberOfLines={2}>
        {section.content}
      </Text>
      <TouchableOpacity style={styles.readMoreButton}>
        <Text style={[styles.readMoreText, { color: section.color }]}>
          Leer más →
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const ValueItem: React.FC<{ value: typeof coreValues[0]; index: number }> = ({ value, index }) => (
    <TouchableOpacity style={styles.valueItem} activeOpacity={0.8}>
      <View style={styles.valueIconContainer}>
        <Text style={styles.valueIcon}>{value.icon}</Text>
      </View>
      <Text style={styles.valueText}>{value.text}</Text>
      <Text style={styles.valueDescription}>{value.description}</Text>
    </TouchableOpacity>
  );

  const selectedSectionData = sections.find(s => s.id === selectedSection);

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
          <Text style={styles.mainTitle}>Sobre Nosotros</Text>
          <Text style={styles.mainSubtitle}>
            Conoce nuestra institución, valores y compromiso con el medio ambiente
          </Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>🌍</Text>
              <Text style={styles.statLabel}>Alcance Nacional</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>🤝</Text>
              <Text style={styles.statLabel}>Colaborativo</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>🔬</Text>
              <Text style={styles.statLabel}>Basado en Ciencia</Text>
            </View>
          </View>
        </View>

        {/* Secciones principales */}
        <View style={styles.sectionsContainer}>
          <Text style={styles.containerTitle}>📖 Información Institucional</Text>
          {sections.map((section, index) => (
            <SectionCard key={section.id} section={section} index={index} />
          ))}
        </View>

        {/* Video institucional */}
        <View style={styles.videoSection}>
          <Text style={styles.containerTitle}>🎥 Contenido Audiovisual</Text>
          <TouchableOpacity 
            style={styles.videoPlaceholder}
            onPress={() => setVideoModalVisible(true)}
          >
            <View style={styles.videoIcon}>
              <Text style={styles.playIcon}>▶️</Text>
            </View>
            <Text style={styles.videoTitle}>Video Institucional</Text>
            <Text style={styles.videoSubtitle}>Conoce más sobre nuestra labor</Text>
          </TouchableOpacity>
        </View>

        {/* Valores institucionales */}
        <View style={styles.valuesSection}>
          <Text style={styles.containerTitle}>🌱 Nuestros Valores</Text>
          <Text style={styles.valuesDescription}>
            Los principios que guían nuestro trabajo diario
          </Text>
          <View style={styles.valuesGrid}>
            {coreValues.map((value, index) => (
              <ValueItem key={index} value={value} index={index} />
            ))}
          </View>
        </View>

        {/* Call to Action */}
        <View style={styles.ctaSection}>
          <View style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>🌍 Únete a Nuestros Esfuerzos</Text>
            <Text style={styles.ctaText}>
              La protección del medio ambiente es responsabilidad de todos. 
              Descubre cómo puedes contribuir a un futuro más sostenible.
            </Text>
            <TouchableOpacity style={styles.ctaButton}>
              <Text style={styles.ctaButtonText}>Participar</Text>
              <Text style={styles.ctaButtonIcon}>→</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modal de sección detallada */}
      <Modal
        visible={selectedSection !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedSection(null)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => setSelectedSection(null)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseIcon}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Información Detallada</Text>
            <View style={styles.modalSpacer} />
          </View>
          {selectedSectionData && (
            <ScrollView style={styles.modalContent}>
              <View style={[styles.modalIconContainer, { backgroundColor: selectedSectionData.color + '20' }]}>
                <Text style={styles.modalIcon}>{selectedSectionData.icon}</Text>
              </View>
              <Text style={styles.modalSectionTitle}>{selectedSectionData.title}</Text>
              <Text style={styles.modalSectionContent}>{selectedSectionData.content}</Text>
              
              <View style={styles.modalAdditionalInfo}>
                <Text style={styles.modalSubheading}>Áreas de Enfoque</Text>
                <Text style={styles.modalBulletPoint}>• Políticas públicas ambientales</Text>
                <Text style={styles.modalBulletPoint}>• Educación y sensibilización</Text>
                <Text style={styles.modalBulletPoint}>• Investigación y desarrollo</Text>
                <Text style={styles.modalBulletPoint}>• Cooperación interinstitucional</Text>
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>

      {/* Modal de video */}
      <Modal
        visible={videoModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setVideoModalVisible(false)}
      >
        <View style={styles.videoModalContainer}>
          <View style={styles.videoModalContent}>
            <TouchableOpacity 
              style={styles.videoCloseButton}
              onPress={() => setVideoModalVisible(false)}
            >
              <Text style={styles.videoCloseIcon}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.videoModalTitle}>Video Institucional</Text>
            <View style={styles.videoContainer}>
              <Video
                source={{ uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                style={styles.video}
                shouldPlay={videoModalVisible}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  sectionsContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  containerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 16,
  },
  sectionCard: {
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
  sectionHeader: {
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
  sectionIcon: {
    fontSize: 20,
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionTitle: {
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
  sectionPreview: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  readMoreButton: {
    alignSelf: 'flex-start',
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: '600',
  },
  videoSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  videoPlaceholder: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  videoIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#1B5E20',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  playIcon: {
    fontSize: 24,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  videoSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  valuesSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  valuesDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  valuesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  valueItem: {
    width: (width - 52) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  valueIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#F0FDF4',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  valueIcon: {
    fontSize: 24,
  },
  valueText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  valueDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
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
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalCloseIcon: {
    fontSize: 18,
    color: '#6B7280',
  },
  modalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  modalSpacer: {
    width: 26,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalIcon: {
    fontSize: 36,
  },
  modalSectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalSectionContent: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 24,
  },
  modalAdditionalInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  modalSubheading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  modalBulletPoint: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 4,
  },
  videoModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoModalContent: {
    width: width - 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
  },
  videoCloseButton: {
    alignSelf: 'flex-end',
    padding: 4,
    marginBottom: 12,
  },
  videoCloseIcon: {
    fontSize: 18,
    color: '#6B7280',
  },
  videoModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  videoContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: 200,
  },
});
import React, { useState } from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const sections = [
  {
    id: 'mission',
    icon: '🎯',
    title: 'Nuestra Misión',
    content: 'Regir la gestión del medio ambiente, los ecosistemas y los recursos naturales, para que cumpla con las atribuciones que, de conformidad con la legislación ambiental en general, corresponden al Estado, con el fin de alcanzar el desarrollo sostenible.',
    color: '#4CAF50'
  },
  {
    id: 'vision',
    icon: '🌟',
    title: 'Nuestra Visión',
    content: 'Ser una institución eficaz, eficiente y transparente que articula e incorpora, en forma transversal, la dimensión ambiental en las políticas públicas y que promueve el desarrollo sostenible, a fin de contribuir al mejoramiento de la calidad de vida de los dominicanos.',
    color: '#2196F3'
  },
  {
    id: 'functions',
    icon: '📋',
    title: 'Nuestras Funciones',
    content: 'Elaborar, ejecutar y fiscalizar las políticas nacionales sobre medio ambiente y recursos naturales, promoviendo y estimulando las actividades de preservación, protección, restauración y uso sostenible de los mismos.',
    color: '#FF9800'
  },
  {
    id: 'commitment',
    icon: '🌿',
    title: 'Nuestro Compromiso',
    content: 'Garantizar la conservación del medio ambiente y los recursos naturales de la República Dominicana, mediante la rectoría y regulación de la política medioambiental, protegiendo todas las especies de nuestra flora y fauna.',
    color: '#9C27B0'
  }
];

const coreValues = [
  { icon: '🛡️', text: 'Protección', description: 'Del patrimonio natural' },
  { icon: '🌿', text: 'Sostenibilidad', description: 'En el desarrollo nacional' },
  { icon: '🤝', text: 'Transparencia', description: 'En la gestión pública' },
  { icon: '📚', text: 'Regulación', description: 'De políticas ambientales' },
  { icon: '⚖️', text: 'Fiscalización', description: 'Del cumplimiento legal' },
  { icon: '🔬', text: 'Innovación', description: 'En gestión ambiental' }
];

const historicalMilestones = [
  { year: '1844', event: 'Se promulga el decreto 2295 sobre conservación de bosques y selvas de la República' },
  { year: '1928', event: 'Se crea la Ley 944 sobre conservación de montes y aguas' },
  { year: '1931', event: 'Se promulga la Ley 85 sobre Biodiversidad, Vida Silvestre y Caza' },
  { year: '1933', event: 'Se delimita el primer Parque Nacional del país: Las Matas (hoy Vedado de Constanza)' },
  { year: '1962', event: 'Se crea la Dirección General de Foresta, adscrita a Agricultura' },
  { year: '1974', event: 'Se crea la Dirección Nacional de Parques para administrar áreas protegidas' },
  { year: '1996', event: 'El Estado dominicano suscribe el Acuerdo de Diversidad Biológica en la ONU' },
  { year: '2000', event: 'Creación del Ministerio de Medio Ambiente y Recursos Naturales mediante Ley 64-00' }
];

export default function SobreNosotros() {
  const [selectedSection, setSelectedSection] = useState(null);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);

  const SectionCard = ({ section, index }) => (
    <TouchableOpacity 
      style={[styles.sectionCard, { borderLeftColor: section.color }]}
      onPress={() => setSelectedSection(section.id)}
    >
      <View style={styles.sectionHeader}>
        <View style={[styles.iconContainer, { backgroundColor: section.color + '20' }]}>
          <Text style={styles.sectionIcon}>{section.icon}</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={[styles.underline, { backgroundColor: section.color }]} />
        </View>
      </View>
      <Text style={styles.sectionContent}>
        {section.content.substring(0, 100)}...
      </Text>
      <Text style={[styles.readMoreButton, { color: section.color }]}>
        Leer más →
      </Text>
    </TouchableOpacity>
  );

  const ValueItem = ({ value, index }) => (
    <View style={styles.valueCard}>
      <View style={styles.valueIconContainer}>
        <Text style={styles.valueIcon}>{value.icon}</Text>
      </View>
      <Text style={styles.valueText}>{value.text}</Text>
      <Text style={styles.valueDescription}>{value.description}</Text>
    </View>
  );

  const selectedSectionData = sections.find(s => s.id === selectedSection);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
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

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Sobre Nosotros</Text>
          <Text style={styles.heroSubtitle}>
            Ministerio de Medio Ambiente y Recursos Naturales de República Dominicana
          </Text>
          <View style={styles.heroStats}>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>🇩🇴</Text>
              <Text style={styles.statText}>República Dominicana</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>🌳</Text>
              <Text style={styles.statText}>Desde 2000</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>⚖️</Text>
              <Text style={styles.statText}>Ley 64-00</Text>
            </View>
          </View>
        </View>

        {/* Historia */}
        <View style={styles.section}>
          <Text style={styles.sectionHeaderText}>📖 Nuestra Historia</Text>
          <TouchableOpacity 
            style={styles.historyCard}
            onPress={() => setHistoryModalVisible(true)}
          >
            <Text style={styles.historyTitle}>180 Años de Conservación</Text>
            <Text style={styles.historySubtitle}>
              Desde 1844, protegiendo los recursos naturales de la República Dominicana
            </Text>
            <View style={styles.historyItem}>
              <Text style={styles.historyYear}>1844</Text>
              <Text style={styles.historyEvent}>Decreto 2295 - Conservación de bosques</Text>
            </View>
            <Text style={styles.seeMoreButton}>Ver cronología completa →</Text>
          </TouchableOpacity>
        </View>

        {/* Secciones principales */}
        <View style={styles.section}>
          <Text style={styles.sectionHeaderText}>🎯 Información Institucional</Text>
          {sections.map((section, index) => (
            <SectionCard key={section.id} section={section} index={index} />
          ))}
        </View>

        {/* Video institucional */}
        <View style={styles.section}>
          <Text style={styles.sectionHeaderText}>🎥 Contenido Audiovisual</Text>
          <TouchableOpacity 
            style={styles.videoCard}
            onPress={() => setVideoModalVisible(true)}
          >
            <View style={styles.playButton}>
              <Text style={styles.playIcon}>▶️</Text>
            </View>
            <Text style={styles.videoTitle}>Video Institucional MMARN</Text>
            <Text style={styles.videoSubtitle}>Conoce nuestro compromiso con el medio ambiente</Text>
          </TouchableOpacity>
        </View>

        {/* Valores institucionales */}
        <View style={styles.section}>
          <Text style={styles.sectionHeaderText}>🌱 Nuestros Principios</Text>
          <Text style={styles.valuesSubtitle}>
            Los pilares que sustentan nuestra gestión ambiental
          </Text>
          <View style={styles.valuesGrid}>
            {coreValues.map((value, index) => (
              <ValueItem key={index} value={value} index={index} />
            ))}
          </View>
        </View>

        {/* Call to Action */}
        <View style={styles.section}>
          <View style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>🌍 Protegemos Nuestro Patrimonio</Text>
            <Text style={styles.ctaText}>
              El Ministerio de Medio Ambiente trabaja incansablemente para garantizar 
              la conservación de nuestros recursos naturales para las futuras generaciones.
            </Text>
            <TouchableOpacity style={styles.ctaButton}>
              <Text style={styles.ctaButtonText}>Conoce Más →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modal de historia */}
      <Modal
        visible={historyModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Historia del MMARN</Text>
              <TouchableOpacity onPress={() => setHistoryModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              {historicalMilestones.map((milestone, index) => (
                <View key={index} style={styles.milestoneItem}>
                  <View style={styles.milestoneYear}>
                    <Text style={styles.milestoneYearText}>{milestone.year}</Text>
                  </View>
                  <View style={styles.milestoneContent}>
                    <Text style={styles.milestoneText}>{milestone.event}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de sección detallada */}
      <Modal
        visible={selectedSection !== null}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Información Detallada</Text>
              <TouchableOpacity onPress={() => setSelectedSection(null)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              {selectedSectionData && (
                <View style={styles.detailContent}>
                  <View style={[styles.detailIcon, { backgroundColor: selectedSectionData.color + '20' }]}>
                    <Text style={styles.detailIconText}>{selectedSectionData.icon}</Text>
                  </View>
                  <Text style={styles.detailTitle}>{selectedSectionData.title}</Text>
                  <Text style={styles.detailText}>{selectedSectionData.content}</Text>
                  <View style={styles.legalFrame}>
                    <Text style={styles.legalTitle}>Marco Legal y Normativo</Text>
                    <Text style={styles.legalItem}>• Ley 64-00 de Medio Ambiente y Recursos Naturales</Text>
                    <Text style={styles.legalItem}>• Políticas nacionales de conservación</Text>
                    <Text style={styles.legalItem}>• Convenios internacionales ambientales</Text>
                    <Text style={styles.legalItem}>• Regulaciones para el desarrollo sostenible</Text>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de video */}
      <Modal
        visible={videoModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.videoModalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Video Institucional MMARN</Text>
              <TouchableOpacity onPress={() => setVideoModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.videoPlaceholder}>
              <View style={styles.videoIcon}>
                <Text style={styles.videoIconText}>▶️</Text>
              </View>
              <Text style={styles.videoPlaceholderText}>Video Institucional</Text>
              <Text style={styles.videoPlaceholderSubtext}>Próximamente disponible</Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
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
  heroSection: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 8,
  },
  heroSubtitle: {
    color: '#6b7280',
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 20,
  },
  heroStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  statText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 16,
  },
  historyCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#22c55e',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 8,
  },
  historySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyYear: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#22c55e',
    marginRight: 12,
  },
  historyEvent: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
  seeMoreButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22c55e',
  },
  sectionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionIcon: {
    fontSize: 24,
  },
  titleContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  underline: {
    width: 40,
    height: 2,
    borderRadius: 1,
  },
  sectionContent: {
    color: '#6b7280',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  readMoreButton: {
    fontSize: 14,
    fontWeight: '600',
  },
  videoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  playButton: {
    width: 60,
    height: 60,
    backgroundColor: '#166534',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  playIcon: {
    fontSize: 24,
    color: 'white',
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  videoSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  valuesSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  valuesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  valueCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  valueIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#f0fdf4',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  valueIcon: {
    fontSize: 24,
  },
  valueText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  valueDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  ctaCard: {
    backgroundColor: '#166534',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
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
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  ctaButtonText: {
    color: '#166534',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  videoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    maxWidth: 400,
    width: '100%',
    maxHeight: 600,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    fontSize: 20,
    color: '#6b7280',
  },
  modalScroll: {
    padding: 16,
    maxHeight: 400,
  },
  milestoneItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  milestoneYear: {
    width: 64,
    alignItems: 'center',
    marginRight: 16,
  },
  milestoneYearText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#22c55e',
  },
  milestoneContent: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
  },
  milestoneText: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
  },
  detailContent: {
    alignItems: 'center',
  },
  detailIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  detailIconText: {
    fontSize: 40,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  detailText: {
    color: '#6b7280',
    lineHeight: 22,
    marginBottom: 24,
    textAlign: 'center',
  },
  legalFrame: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    width: '100%',
  },
  legalTitle: {
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  legalItem: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  videoPlaceholder: {
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
  },
  videoIcon: {
    width: 64,
    height: 64,
    backgroundColor: '#166534',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  videoIconText: {
    fontSize: 24,
    color: 'white',
  },
  videoPlaceholderText: {
    fontSize: 14,
    color: '#6b7280',
  },
  videoPlaceholderSubtext: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
});
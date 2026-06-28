import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, ActivityIndicator, 
  RefreshControl, Dimensions, StatusBar 
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const API_URL = 'https://dirhemmarket.click/api/announcements';

interface Announcement {
  id: number;
  title: string;
  message: string;
  imageUrl: string;
  createdAt: string;
}

export default function AktuelnoScreen() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data);
      }
    } catch (error) {
      console.error("Greška pri osvežavanju obaveštenja:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAnnouncements();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sr-RS', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderCard = ({ item }: { item: Announcement }) => (
    <View style={styles.card}>
      {item.imageUrl && (
        <Image 
          source={{ uri: item.imageUrl }} 
          style={styles.cardImage}
          contentFit="cover"
          transition={250} // Elegantan fade-in efekat pri učitavanju slike
        />
      )}
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDate}>{formatDate(item.createdAt)}</Text>
        <Text style={styles.cardMessage}>{item.message}</Text>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#D32F2F', '#8B0000']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AKTUELNO</Text>
          <Text style={styles.headerSubtitle}>Obaveštenja i ekskluzivne ponude</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#FFF" style={{ flex: 1 }} />
        ) : (
          <FlatList
            data={announcements}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCard}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFF" />
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Trenutno nema novih obaveštenja.</Text>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: { color: '#FFF', fontSize: 24, fontWeight: '900', letterSpacing: 1.5 },
  headerSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 },
  listContent: { padding: 16, paddingBottom: 30 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardImage: {
    width: '100%',
    height: width * 0.5, // Zadržava razmeru 2:1 bez obzira na veličinu ekrana
    backgroundColor: '#EEE',
  },
  cardBody: { padding: 16 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A', marginBottom: 4 },
  cardDate: { fontSize: 11, color: '#888', fontWeight: '600', marginBottom: 10, textTransform: 'uppercase' },
  cardMessage: { fontSize: 14, color: '#444', lineHeight: 20 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { color: 'rgba(255,255,255,0.6)', fontSize: 15, textAlign: 'center' }
});
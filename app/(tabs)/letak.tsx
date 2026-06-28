import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, StatusBar, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { API_URL } from '../../config';

export default function LetakScreen() {
  const router = useRouter();
  const [letci, setLetci] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://dirhemmarket.click/api/letak`)
      .then(async res => {
      const text = await res.text(); // Prvo uzmi sirov tekst
      if (!res.ok) {
        console.log("Server Error Text:", text); // Ovo će ti ispisati grešku iz .NET-a
        throw new Error(`Server returned ${res.status}`);
      }
      return JSON.parse(text); // Tek onda parsiraj
    })
    .then(data => {
      setLetci(data);
      setLoading(false);
    })
    .catch(err => {
      console.error("Fetch error:", err);
      setLoading(false);
    });
}, []);
  if (loading) return <View style={styles.centered}><ActivityIndicator color="#D32F2F" /></View>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#D32F2F', '#8B0000']} style={styles.header}>
        <Text style={styles.headerTitle}>DIRHEM <Text style={{fontWeight: '300'}}>Letak</Text></Text>
        <Text style={styles.headerSubtitle}>Odaberi kategoriju kataloga</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {letci.map((letak) => (
          <TouchableOpacity 
            key={letak.id} 
            style={styles.card}
            onPress={() => router.push({
              pathname: '/letak-detalji',
              params: { id: letak.id, title: letak.title, date: letak.dateRange }
            })}
          >
            <Image source={{ uri: letak.imageUrl }} style={styles.cardImage} />
            <View style={styles.cardOverlay}>
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.9)']} style={styles.gradient}>
                <View style={styles.badge}><Text style={styles.badgeText}>{letak.type}</Text></View>
                <Text style={styles.cardTitle}>{letak.title}</Text>
                <Text style={styles.cardDate}>{letak.dateRange}</Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F4' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingTop: 60, paddingBottom: 30, paddingHorizontal: 25, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTitle: { color: '#FFF', fontSize: 24, fontWeight: '900' },
  headerSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
  scrollContent: { padding: 20 },
  card: { width: '100%', height: 200, borderRadius: 20, marginBottom: 20, overflow: 'hidden', elevation: 8 },
  cardImage: { width: '100%', height: '100%' },
  cardOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end' },
  gradient: { padding: 20 },
  badge: { backgroundColor: '#D32F2F', alignSelf: 'flex-start', paddingHorizontal: 10, borderRadius: 8, marginBottom: 5 },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  cardTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  cardDate: { color: 'rgba(255,255,255,0.7)', fontSize: 12 }
});
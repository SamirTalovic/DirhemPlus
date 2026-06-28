import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { API_URL } from '../config';
export default function LetakDetalji() {
  const { id, title, date } = useLocalSearchParams();
  const router = useRouter();
  const [artikli, setArtikli] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Povlačenje artikala samo za ID ovog letka
    fetch(`https://dirhemmarket.click/api/letak/${id}/artikli`)
      .then(res => res.json())
      .then(data => {
        setArtikli(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <View style={styles.centered}><ActivityIndicator color="#D32F2F" /></View>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios" size={22} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerDate}>{date}</Text>
        </View>
      </View>

      <FlatList
        data={artikli}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <View style={styles.discountBadge}>
               <Text style={styles.discountText}>
                 -{Math.round((1 - item.price / item.oldPrice) * 100)}%
               </Text>
            </View>
            <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
            <View style={styles.infoWrapper}>
              <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.itemOldPrice}>{item.oldPrice} RSD</Text>
                <Text style={styles.itemPrice}>{item.price} RSD</Text>
              </View>
       
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: '#D32F2F', paddingTop: 60, paddingBottom: 25, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', borderBottomLeftRadius: 25, borderBottomRightRadius: 25 },
  backButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTextContainer: { marginLeft: 15 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#FFF' },
  headerDate: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  list: { padding: 12 },
  itemCard: { flex: 0.5, backgroundColor: '#FFF', margin: 8, borderRadius: 20, overflow: 'hidden', elevation: 3 },
  discountBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: '#D32F2F', paddingHorizontal: 7, borderRadius: 6, zIndex: 1 },
  discountText: { color: '#FFF', fontSize: 10, fontWeight: '900' },
  itemImage: { width: '100%', height: 120 },
  infoWrapper: { padding: 12 },
  itemName: { fontSize: 13, fontWeight: '600', height: 36 },
  priceContainer: { marginVertical: 8 },
  itemOldPrice: { fontSize: 11, color: '#999', textDecorationLine: 'line-through' },
  itemPrice: { fontSize: 17, color: '#D32F2F', fontWeight: '900' },
  addButton: { backgroundColor: '#1A1A1A', flexDirection: 'row', justifyContent: 'center', paddingVertical: 7, borderRadius: 8 },
  addButtonText: { color: '#FFF', fontSize: 10, fontWeight: '800', marginLeft: 5 }
});
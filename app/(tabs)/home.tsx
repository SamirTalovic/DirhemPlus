import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from "jwt-decode";
import { API_URL } from '../../config';

const { width } = Dimensions.get('window');

// Računamo širinu kartice tako da dve stanu u red, oduzimamo margine/padinge
const CARD_WIDTH = (width / 2) - 20;

export default function RecommendationsScreen() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (!token) {
          setError("Token nije pronađen. Prijavite se ponovo.");
          return;
        }

        const decoded: any = jwtDecode(token);
        
        let userId = null;
        for (const key in decoded) {
          if (key.toLowerCase().endsWith('nameidentifier') || key.toLowerCase() === 'id' || key.toLowerCase() === 'nameid') {
            userId = decoded[key];
            break;
          }
        }

        if (!userId) {
          userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || decoded.nameid || decoded.id;
        }

        if (!userId) {
          setError("Korisnički ID nije pronađen.");
          return;
        }

        const response = await fetch(`https://dirhemmarket.click/api/recommendations/user/${userId}`);
        if (!response.ok) {
          throw new Error(`Greška na serveru: ${response.status}`);
        }

        const data = await response.json();
        setOffers(data);
      } catch (err: any) {
        setError(err.message || "Greška pri učitavanju.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <LinearGradient colors={['#D32F2F', '#8B0000']} style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#FFF" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#D32F2F', '#8B0000']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brandName}>DIRHEM <Text style={{ fontWeight: '300' }}>Preporuke</Text></Text>
        <Text style={styles.subtitle}>Samo za Vas iz omiljenih kategorija</Text>
      </View>

      {error ? (
        <View style={[styles.errorCard, { marginTop: 160 }]}>
          <Text style={styles.emptyText}>{error}</Text>
        </View>
      ) : offers.length === 0 ? (
        <View style={[styles.errorCard, { marginTop: 160 }]}>
          <Text style={styles.emptyText}>Trenutno nema specijalnih preporuka za vaš nalog.</Text>
        </View>
      ) : (
        <FlatList
          data={offers}
          keyExtractor={(item, index) => (item.id || item.Id || index).toString()}
          numColumns={2} // <--- Dodato za 2 kolone
          columnWrapperStyle={styles.rowWrapper} // <--- Razmak između kolona
          contentContainerStyle={{ paddingBottom: 120, paddingTop: 160, paddingHorizontal: 12 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const name = item.name || item.Name || "Artikal";
            const price = item.price ?? item.Price ?? 0;
            const oldPrice = item.oldPrice ?? item.OldPrice ?? 0;
            const imageUrl = item.imageUrl || item.ImageUrl;
            const letakType = item.letak?.type || item.Letak?.Type || 'AKCIJA';

            const discountPercent = oldPrice > 0 
              ? Math.round(((oldPrice - price) / oldPrice) * 100) 
              : 0;

            return (
              <View style={styles.card}>
                <View style={styles.badgeRow}>
                  <View style={styles.categoryBadge}>
                    {/* Skraćujemo tekst ako je predugačak zbog prostora */}
                    <Text style={styles.categoryText} numberOfLines={1}>
                      {letakType.substring(0, 8)}
                    </Text>
                  </View>
                  {discountPercent > 0 && (
                    <View style={styles.saveBadge}>
                      <Text style={styles.saveText}>-{discountPercent}%</Text>
                    </View>
                  )}
                </View>

                {/* SLIKA: Contain mod omogućava da se cela slika vidi bez sečenja */}
                {imageUrl ? (
                  <Image 
                    source={{ uri: imageUrl }} 
                    style={styles.productImage} 
                    resizeMode="contain" 
                  />
                ) : (
                  <View style={[styles.productImage, { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={{color: '#999', fontSize: 10}}>Nema slike</Text>
                  </View>
                )}

                <Text style={styles.productName} numberOfLines={2}>{name}</Text>

                <View style={styles.priceContainer}>
                  {oldPrice > 0 ? (
                    <Text style={styles.oldPriceLine}>{Number(oldPrice).toFixed(2)} RSD</Text>
                  ) : (
                    <Text style={styles.oldPriceLine}> </Text> // Prazan prostor da se visina ne remeti
                  )}
                  <Text style={styles.newPrice}>{Number(price).toFixed(2)} RSD</Text>
                </View>
              </View>
            );
          }}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { position: 'absolute', top: 60, left: 20, right: 20, zIndex: 10 },
  brandName: { color: '#FFF', fontSize: 26, fontWeight: '900', letterSpacing: 2, textTransform: 'uppercase' },
  subtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 5 },
  
  errorCard: {
    backgroundColor: '#FFF',
    width: width * 0.9,
    padding: 20,
    borderRadius: 25,
    alignSelf: 'center',
  },
  emptyText: { textAlign: 'center', color: '#666', fontSize: 15, paddingVertical: 20 },

  // Stilovi za Grid (2 kolone)
  rowWrapper: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#FFF',
    width: CARD_WIDTH, // Širina izračunata za 2 kolone
    padding: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  
  badgeRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 10 
  },
  categoryBadge: { 
    backgroundColor: '#ECEFF1', 
    paddingHorizontal: 6, 
    paddingVertical: 3, 
    borderRadius: 6,
    flexShrink: 1 
  },
  categoryText: { color: '#37474F', fontWeight: '700', fontSize: 9, textTransform: 'uppercase' },
  saveBadge: { backgroundColor: '#D32F2F', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6, marginLeft: 4 },
  saveText: { color: '#FFF', fontWeight: '900', fontSize: 10 },
  
  // Prilagođena slika da bude lepša u manjem kontejneru
  productImage: { 
    width: '100%', 
    height: 110, 
    marginBottom: 10, 
    borderRadius: 10,
    alignSelf: 'center'
  },
  
  productName: { 
    fontSize: 14, // Manji font jer je kartica uža
    fontWeight: '700', 
    color: '#222', 
    marginBottom: 8,
    minHeight: 40 // Da bi tekstovi uvek bili u ravni čak i ako je jedan u dva reda
  },
  
  // Cene su sada naslagane vertikalno umesto jedna pored druge
  priceContainer: { 
    backgroundColor: '#FAFAFA', 
    padding: 10, 
    borderRadius: 12,
    alignItems: 'flex-start'
  },
  oldPriceLine: { 
    fontSize: 11, 
    color: '#888', 
    textDecorationLine: 'line-through', 
    fontWeight: '600',
    marginBottom: 2
  },
  newPrice: { 
    fontSize: 16, 
    color: '#D32F2F', 
    fontWeight: '900' 
  }
});
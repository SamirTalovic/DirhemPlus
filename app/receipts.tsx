import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity, 
  StatusBar,
  RefreshControl,
  Modal,
  ScrollView,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import {API_URL} from '../config';
const API_BASE_URL = API_URL; 

export default function ReceiptsScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Stanja za modal detalja
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Glavna funkcija za povlačenje podataka
  const loadData = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) {
        setLoading(false);
        setRefreshing(false);
        return;
      }
      await fetchMyOrders(token);
    } catch (error) {
      console.error("[CLIENT] Greška u setup-u:", error);
    } finally {
      setLoading(false);
      setRefreshing(false); // Garantovano gasi vrtešku na swipe-down
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Aktivira se isključivo kada korisnik povuče ekran naniže
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData(false); // Pokreće mrežni zahtev bez blokiranja celog ekrana belim spinnerom
  };

  const fetchMyOrders = async (token: string) => {
    try {
      const response = await fetch(`https://dirhemmarket.click/api/orders/my-orders`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error("[CLIENT] Greška pri dohvatanju računa, status:", response.status);
      }
    } catch (error) {
      console.error("[CLIENT] Mrežna greška:", error);
    }
  };

  const openOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: any }) => {
    const date = new Date(item.orderDate).toLocaleDateString('sr-RS', {
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
    });

    return (
      <TouchableOpacity 
        style={styles.card} 
        activeOpacity={0.8}
        onPress={() => openOrderDetails(item)}
      >
        <View style={styles.cardLeft}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="text-box-check-outline" size={22} color="#D32F2F" />
          </View>
          <View>
            <Text style={styles.orderId}>Račun #{item.id}</Text>
            <Text style={styles.date}>{date}</Text>
          </View>
        </View>
        
        <View style={styles.cardRight}>
          <Text style={styles.total}>{item.finalTotalAmount.toFixed(2)} RSD</Text>
          <MaterialIcons name="chevron-right" size={20} color="#CCC" />
        </View>
      </TouchableOpacity>
    );
  };

  // Spinner koji blokira ekran samo pri prvom otvaranju rute
  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#D32F2F" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient colors={['#D32F2F', '#8B0000']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={26} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Moji Računi</Text>
          <View style={styles.emptyView} />
        </View>
        <Text style={styles.headerSubtitle}>Istorija vaših kupovina i transakcija</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* FlatList sada direktno kontroliše ceo ekran, omogućavajući swipe-to-refresh u svakom trenutku */}
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContainer,
            orders.length === 0 && { flex: 1 } // Ekstenzija kontejnera da bi swipe radio na praznom ekranu
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              colors={['#D32F2F']} 
              tintColor="#D32F2F" // Za iOS indicator podršku
            />
          }
          // Premešten prazan prikaz unutar liste
          ListEmptyComponent={
            <View style={styles.centerEmpty}>
              <MaterialCommunityIcons name="receipt" size={64} color="#CCC" />
              <Text style={styles.emptyText}>Nemate zabeleženih računa.</Text>
            </View>
          }
        />
      </View>

      {/* MODAL ZA DETALJE RAČUNA */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            {/* Header Modala */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Detalji računa #{selectedOrder?.id}</Text>
                <Text style={styles.modalDate}>
                  {selectedOrder ? new Date(selectedOrder.orderDate).toLocaleDateString('sr-RS', {
                    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
                  }) : ''}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Lista artikala */}
            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
              <Text style={styles.sectionTitle}>Kupljeni artikli</Text>
              
              {selectedOrder?.orderItems?.map((item: any, index: number) => (
                <View key={index} style={styles.itemRow}>
                  {item.artikal?.imageUrl ? (
                    <Image source={{ uri: item.artikal.imageUrl }} style={styles.artikalImage} />
                  ) : (
                    <View style={[styles.artikalImage, styles.placeholderImage]}>
                      <MaterialCommunityIcons name="food-fork-drink" size={20} color="#888" />
                    </View>
                  )}
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemNameTemplate}>{item.artikal?.name || 'Nepoznat artikal'}</Text>
                    <Text style={styles.itemMeta}>
                      {item.quantity} kom x {item.priceAtPurchase.toFixed(2)} RSD
                    </Text>
                  </View>
                  <Text style={styles.itemSubtotal}>
                    {(item.quantity * item.priceAtPurchase).toFixed(2)} RSD
                  </Text>
                </View>
              ))}

              <View style={styles.modalDivider} />

              {/* Rekapitulacija cena */}
              <Text style={styles.sectionTitle}>Specifikacija</Text>
              
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Iznos pre popusta:</Text>
                <Text style={styles.specValue}>{selectedOrder?.totalAmountBeforeDiscount?.toFixed(2)} RSD</Text>
              </View>

              {selectedOrder?.appliedDiscountPercentage > 0 && (
                <View style={styles.specRow}>
                  <Text style={[styles.specLabel, { color: '#D32F2F' }]}>
                    Ostvareni popust ({selectedOrder.appliedDiscountPercentage}%):
                  </Text>
                  <Text style={[styles.specValue, { color: '#D32F2F', fontWeight: 'bold' }]}>
                    -{(selectedOrder.totalAmountBeforeDiscount - selectedOrder.finalTotalAmount).toFixed(2)} RSD
                  </Text>
                </View>
              )}

              <View style={[styles.specRow, styles.finalRow]}>
                <Text style={styles.finalLabel}>Ukupno za uplatu:</Text>
                <Text style={styles.finalValue}>{selectedOrder?.finalTotalAmount?.toFixed(2)} RSD</Text>
              </View>
              
              {/* Korisnik info */}
              <View style={styles.userInfoBox}>
                <MaterialCommunityIcons name="account-circle-outline" size={18} color="#666" />
                <Text style={styles.userInfoText}>
                  Kupac: {selectedOrder?.user?.name} {selectedOrder?.user?.surname} ({selectedOrder?.user?.barcodeCardNumber})
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F4F4F4' 
  },
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#F4F4F4'
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: { 
    color: '#FFF', 
    fontSize: 22, 
    fontWeight: 'bold',
  },
  emptyView: { 
    width: 40 
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginTop: 10,
    marginLeft: 5,
  },
  content: { 
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  listContainer: {
    paddingVertical: 10,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#D32F2F10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginTop: 3,
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  total: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A1A1A',
    marginRight: 8,
  },
  centerEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  emptyText: {
    fontSize: 15,
    color: '#888',
    marginTop: 15,
    fontWeight: '500',
  },
  
  // MODAL STILOVI
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 25,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  modalDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  closeButton: {
    backgroundColor: '#F0F0F0',
    padding: 8,
    borderRadius: 20,
  },
  modalScroll: {
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 12,
    marginTop: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#F9F9F9',
    padding: 10,
    borderRadius: 15,
  },
  artikalImage: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#FFF',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemNameTemplate: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  itemMeta: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
  },
  itemSubtotal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#EAEAEA',
    marginVertical: 15,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  specLabel: {
    fontSize: 14,
    color: '#555',
  },
  specValue: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  finalRow: {
    marginTop: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
  },
  finalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  finalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#D32F2F',
  },
  userInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 12,
    marginTop: 25,
  },
  userInfoText: {
    fontSize: 11,
    color: '#666',
    marginLeft: 8,
  },
});
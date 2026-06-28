import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar, 
  ActivityIndicator, 
  RefreshControl 
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import{API_URL} from '../../config';
// Definišemo interfejs za MenuOption props
interface MenuOptionProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  subtitle?: string;
  color?: string;
  onPress: () => void;
}

export default function AccountScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Funkcija za dovlačenje podataka sa API-ja
  const fetchUserData = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const response = await fetch(`https://dirhemmarket.click/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        console.log("Greška pri dohvatanju podataka");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Automatsko osvežavanje čim se korisnik vrati na ovaj ekran
  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserData();
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    router.replace('/');
  };

  const getInitials = () => {
    if (!user?.name || !user?.surname) return "DP";
    return `${user.name.charAt(0)}${user.surname.charAt(0)}`.toUpperCase();
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#D32F2F" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#D32F2F']} />
        }
      >
        
        <LinearGradient colors={['#D32F2F', '#8B0000']} style={styles.header}>
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials()}</Text>
            </View>
            <View style={styles.nameContainer}>
              <Text style={styles.userName}>{user?.name} {user?.surname}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
            </View>
          </View>
          
          <View style={styles.memberBadge}>
            <MaterialCommunityIcons name="star-outline" size={16} color="#FFF" />
            <Text style={styles.memberText}>Članski broj: #{user?.barcodeCardNumber || 'N/A'}</Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Moj profil</Text>
          <View style={styles.card}>
            <MenuOption 
              icon="account-outline" 
              title="Lični podaci" 
              subtitle={`${user?.phone || 'Nema telefona'}`} 
              color="#D32F2F" 
              onPress={() => router.push('/profile-details')}
            />
            <View style={styles.divider} />
            <MenuOption 
              icon="shield-check-outline" 
              title="Sigurnost" 
              subtitle="Promena lozinke" 
              color="#D32F2F" 
              onPress={() => router.push('/security')}
            />
          </View>
          
          <View style={[styles.card, { marginTop: 15 }]}>
            <MenuOption 
              icon="text-box-outline" 
              title="Moji računi" 
              subtitle="Pregled svih kupovina" 
              color="#D32F2F"
              onPress={() => router.push('/receipts')} 
            />
          </View>

          <Text style={styles.sectionTitle}>Podešavanja</Text>
          <View style={styles.card}>
            <MenuOption
              icon="help-circle-outline"
              title="Pomoć i kontakt"
              color="#333"
              onPress={() => router.push('/help')}
            />
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={20} color="#FF3B30" />
            <Text style={styles.logoutText}>Odjavi se</Text>
          </TouchableOpacity>
          
          <Text style={styles.versionText}>Dirhem Plus v2.4.0 (2026)</Text>
        </View>
      </ScrollView>
    </View>
  );
}

// Pomoćna komponenta za stavke u meniju
const MenuOption = ({ icon, title, subtitle, color = '#333', onPress }: MenuOptionProps) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.menuItemLeft}>
      <View style={[styles.iconContainer, { backgroundColor: color + '10' }]}>
        <MaterialCommunityIcons name={icon} size={24} color={color} />
      </View>
      <View>
        <Text style={styles.menuItemTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    <MaterialIcons name="chevron-right" size={24} color="#CCC" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F4' },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  profileInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 2, 
    borderColor: '#FFF'
  },
  avatarText: { color: '#FFF', fontSize: 24, fontWeight: '900' },
  nameContainer: { marginLeft: 20 },
  userName: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  userEmail: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  memberBadge: {
    flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12, 
    paddingVertical: 6,
    borderRadius: 20, 
    marginTop: 20
  },
  memberText: { color: '#FFF', fontSize: 12, marginLeft: 5, fontWeight: '600' },
  content: { padding: 20 },
  sectionTitle: { 
    fontSize: 13, 
    fontWeight: '900', 
    color: '#999', 
    textTransform: 'uppercase', 
    marginBottom: 10, 
    marginLeft: 5, 
    marginTop: 15
  },
  card: { backgroundColor: '#FFF', borderRadius: 25, overflow: 'hidden', elevation: 2, shadowOpacity: 0.05 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18 },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { 
    width: 40, 
    height: 40, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 15 
  },
  menuItemTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  menuItemSubtitle: { fontSize: 12, color: '#888', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginHorizontal: 18 },
  logoutBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    marginTop: 40, 
    padding: 15, 
    borderRadius: 15, 
    backgroundColor: '#FFF',
    borderWidth: 1, 
    borderColor: '#FFEBEB'
  },
  logoutText: { color: '#FF3B30', fontWeight: 'bold', marginLeft: 10, fontSize: 16 },
  versionText: { textAlign: 'center', color: '#CCC', fontSize: 12, marginTop: 20, marginBottom: 40 }
});
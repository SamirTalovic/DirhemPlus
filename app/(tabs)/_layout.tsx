import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        // Potpuno sklanjamo sistemski header
        headerShown: false, 
        
        // Sakriva tab bar kada se otvori tastatura (sprečava rušenje layout-a)
        tabBarHideOnKeyboard: true, 

        // Dirhem Plus Crvena tema
        tabBarActiveTintColor: '#D32F2F',
        tabBarInactiveTintColor: '#888',
        
        // STRIKTAN FIXED/STICKY LAYOUT NA DNU EKRENA
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0', 
          
          // Senke i elevacija
          elevation: 20, 
          shadowColor: '#000', 
          shadowOpacity: 0.08,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: -4 }, 

          // Prilagođavanje visine zavisno od platforme
          height: Platform.OS === 'ios' ? 88 : 70, 
          paddingBottom: Platform.OS === 'ios' ? 28 : 12, 
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: -4,
        }
      }}
    >
      
      {/* 1. PONUDE (Glavna strana) */}
      <Tabs.Screen 
        name="home" 
        options={{ 
          title: 'Ponude',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="tag-heart-outline" size={26} color={color} />
        }} 
      />

      {/* 2. LETAK (Digitalni katalog) */}
      <Tabs.Screen 
        name="letak" 
        options={{ 
          title: 'Letak',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="book-open-page-variant-outline" size={26} color={color} />
        }} 
      />

      {/* 3. AKTUELNO (Obaveštenja i Feed sa notifikacijama) */}
      <Tabs.Screen 
        name="aktuelno" 
        options={{ 
          title: 'Aktuelno',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="bell-outline" size={26} color={color} />
        }} 
      />

      {/* 4. BARCODE (Centralni deo aplikacije) */}
      <Tabs.Screen 
        name="barcode" 
        options={{ 
          title: 'Kod',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="barcode-scan" size={26} color={color} />
        }} 
      />

      {/* 5. ACCOUNT (Moj Profil) */}
      <Tabs.Screen 
        name="account" 
        options={{ 
          title: 'Nalog',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account-outline" size={28} color={color} />
        }} 
      />

    </Tabs>
  );
}
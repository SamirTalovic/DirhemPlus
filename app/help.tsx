import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

export default function HelpScreen() {
  const router = useRouter();

  const ContactCard = ({ icon, title, value, onPress }: any) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <MaterialCommunityIcons name={icon} size={30} color="#D32F2F" />
      <View style={styles.cardText}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardValue}>{value}</Text>
      </View>
      <MaterialIcons name="open-in-new" size={20} color="#CCC" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><MaterialIcons name="arrow-back" size={28} color="#FFF" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Pomoć i kontakt</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.intro}>Imate pitanje ili vam je potrebna pomoć? Naš tim je tu za vas.</Text>
        
        <ContactCard 
          icon="phone-outline" 
          title="Pozovite nas" 
          value="+381 62 146 5111" 
          onPress={() => Linking.openURL('tel:+381621465111')} 
        />
        
        <ContactCard 
          icon="email-outline" 
          title="Email podrška" 
          value="dirhem.trgovina@gmail.com" 
          onPress={() => Linking.openURL('mailto:dirhem.trgovina@gmail.com')} 
        />

        <ContactCard 
          icon="instagram" 
          title="Instagram" 
          value="dirhem_market" 
          onPress={() => Linking.openURL('https://www.instagram.com/dirhem_market/')} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F4' },
  header: { backgroundColor: '#D32F2F', paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginLeft: 15 },
  content: { padding: 20 },
  intro: { color: '#666', marginBottom: 25, lineHeight: 20 },
  card: { backgroundColor: '#FFF', padding: 20, borderRadius: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  cardText: { flex: 1, marginLeft: 15 },
  cardTitle: { color: '#888', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  cardValue: { color: '#1A1A1A', fontSize: 16, fontWeight: 'bold', marginTop: 2 }
});
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  ScrollView 
} from 'react-native';
import { useRouter } from 'expo-router';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'; // <-- Dodato za tab bar visinu
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // <-- Dodato za sistemske ivice (safe area)
import { MaterialIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';
import { jwtDecode } from 'jwt-decode';
import { API_URL } from '../config';
export default function SecurityScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets(); // Hvata sistemske insets (gornja i donja ivica ekrana)
  
  // Ako je ekran deo Tab navigacije, dinamički računamo visinu donjeg navbara. 
  // Ako nije, koristićemo sistemski donji inset kao rezervu.
  let bottomPadding = insets.bottom > 0 ? insets.bottom + 20 : 30;
  try {
    const tabBarHeight = useBottomTabBarHeight();
    bottomPadding = tabBarHeight + 20; // Dodajemo 20px lufta iznad samog navbara
  } catch (error) {
    // Ako ekran nije unutar tab navigatora, preći će na safe area insets
  }

  // Stanja za promenu lozinke
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. FUNKCIJA ZA PROMENU LOZINKE
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Toast.show({ 
        type: 'error', 
        text1: 'Greška! ❌', 
        text2: 'Sva polja su obavezna.',
        position: 'top' 
      });
      return;
    }

    if (newPassword.length < 8) {
      Toast.show({
        type: 'error',
        text1: 'Greška! ❌',
        text2: 'Nova lozinka mora imati bar 8 karaktera.',
        position: 'top',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({ 
        type: 'error', 
        text1: 'Greška! ❌', 
        text2: 'Lozinke se ne poklapaju.',
        position: 'top' 
      });
      return;
    }

    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const response = await fetch(`https://dirhemmarket.click/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
      });

      const responseText = await response.text();

      if (response.ok) {
        Toast.show({ 
          type: 'success', 
          text1: 'Uspeh! 🎉', 
          text2: 'Lozinka uspešno promenjena.',
          position: 'top' 
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        let errorMessage = 'Neuspešna izmena lozinke.';
        try {
          const data = JSON.parse(responseText);
          errorMessage = data.message || errorMessage;
        } catch (e) {
          errorMessage = responseText || errorMessage;
        }
        Toast.show({ type: 'error', text1: 'Greška! ❌', text2: errorMessage, position: 'top' });
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Greška! ❌', text2: 'Server nije dostupan.', position: 'top' });
    } finally {
      setLoading(false);
    }
  };

  // 2. LOGIKA ZA POTVRDU BRISANJA NALOGA
  const handleDeleteAccount = () => {
    Alert.alert(
      "Brisanje naloga",
      "Da li ste sigurni da želite trajno da obrišete nalog? Ova akcija se ne može poništiti i svi vaši podaci biće obrisani.",
      [
        { text: "Odustani", style: "cancel" },
        { text: "Trajno obriši", style: "destructive", onPress: performDelete }
      ]
    );
  };

  // 3. IZVRŠAVANJE BRISANJA NA BACKENDU
  const performDelete = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) {
        Toast.show({ type: 'error', text1: 'Greška', text2: 'Token nije pronađen.', position: 'top' });
        return;
      }

      const decoded: any = jwtDecode(token);
      const userId = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || decoded['nameid'];

      if (!userId) {
        Toast.show({ type: 'error', text1: 'Greška', text2: 'Nije moguće pročitati ID korisnika.', position: 'top' });
        return;
      }

      const response = await fetch(`https://dirhemmarket.click/api/auth/delete-user/${userId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userName');
        
        Toast.show({ type: 'success', text1: 'Nalog obrisan! 📋', text2: 'Vaš nalog je trajno uklonjen.', position: 'top' });
        router.replace('/register');
      } else {
        const errorText = await response.text();
        console.log("Greška pri brisanju:", errorText);
        Toast.show({ 
          type: 'error', 
          text1: 'Greška!', 
          text2: 'Nalog nije mogao biti obrisan. Proverite serverske restrikcije.',
          position: 'top' 
        });
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Greška', text2: 'Server nije dostupan.', position: 'top' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER prilagođen gornjem Safe Area inset-u */}
      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 15 : 40 }]}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <MaterialIcons name="arrow-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sigurnost i nalog</Text>
      </View>

      {/* SADRŽAJ sa dinamičkim donjim paddingom */}
      <ScrollView 
        contentContainerStyle={[styles.content, { paddingBottom: bottomPadding }]} 
        showsVerticalScrollIndicator={false}
      >
        
        {/* SEKCIJA ZA PROMENU LOZINKE */}
        <Text style={styles.sectionTitle}>Promena lozinke</Text>
        <Text style={styles.infoText}>Lozinka mora sadržati najmanje 8 karaktera.</Text>
        
        <TextInput 
          style={styles.input} 
          placeholder="Trenutna lozinka" 
          placeholderTextColor="#999" // Osigurava vidljiv placeholder
          secureTextEntry 
          value={currentPassword} 
          onChangeText={setCurrentPassword} 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Nova lozinka" 
          placeholderTextColor="#999"
          secureTextEntry 
          value={newPassword} 
          onChangeText={setNewPassword} 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Potvrdi novu lozinku" 
          placeholderTextColor="#999"
          secureTextEntry 
          value={confirmPassword} 
          onChangeText={setConfirmPassword} 
        />

        <TouchableOpacity 
          style={[styles.saveBtn, { backgroundColor: loading ? '#666' : '#1A1A1A' }]} 
          onPress={handleChangePassword} 
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>AŽURIRAJ LOZINKU</Text>}
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* SEKCIJA ZA OPASNU ZONU / BRISANJE NALOGA */}
        <Text style={styles.sectionTitle}>Opasna zona</Text>
        <Text style={styles.infoTextDanger}>Brisanjem naloga trajno uklanjate sve vaše podatke bez mogućnosti povraćaja.</Text>
        
        <TouchableOpacity 
          style={[styles.deleteBtn, { backgroundColor: loading ? '#666' : '#D32F2F' }]} 
          onPress={handleDeleteAccount} 
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>TRAJNO OBRIŠI NALOG</Text>}
        </TouchableOpacity>
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F4F4F4' 
  },
  header: { 
    backgroundColor: '#D32F2F', 
    paddingBottom: 20, 
    paddingHorizontal: 20, 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  headerTitle: { 
    color: '#FFF', 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginLeft: 15 
  },
  content: { 
    padding: 20 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 8, 
    color: '#1A1A1A' 
  },
  infoText: { 
    color: '#666', 
    marginBottom: 15, 
    fontSize: 13 
  },
  infoTextDanger: { 
    color: '#C62828', 
    marginBottom: 15, 
    fontSize: 13,
    fontWeight: '500'
  },
  input: { 
    backgroundColor: '#FFF', 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 12, 
    borderWidth: 1, 
    borderColor: '#DDD',
    color: '#333'
  },
  saveBtn: { 
    padding: 18, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  deleteBtn: { 
    padding: 18, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  btnText: { 
    color: '#FFF', 
    fontWeight: 'bold',
    letterSpacing: 0.5
  },
  divider: { 
    height: 1, 
    backgroundColor: '#E0E0E0', 
    marginVertical: 35 
  }
});
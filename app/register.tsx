import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, StatusBar, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import { API_URL } from '../config';
export default function RegisterScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ 
    name: '', 
    surname: '', 
    email: '', 
    phone: '', 
    password: '',
    confirmPassword: '' // Novo stanje za potvrdu lozinke
  });

  const handleRegister = async () => {
    // 1. Osnovna validacija praznih polja
    if (!form.name || !form.surname || !form.email || !form.phone || !form.password || !form.confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Greška! ❌',
        text2: 'Molimo popunite sva polja.',
        position: 'top',
      });
      return;
    }

    // 2. Validacija poklapanja lozinki
    if (form.password !== form.confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Greška! ❌',
        text2: 'Lozinke se ne poklapaju.',
        position: 'top',
      });
      return;
    }

    // 3. Opciono: Provera minimalne dužine lozinke
    if (form.password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Greška! ❌',
        text2: 'Lozinka mora imati najmanje 6 karaktera.',
        position: 'top',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`https://dirhemmarket.click/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          surname: form.surname,
          email: form.email,
          phone: form.phone,
          password: form.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: 'Uspeh! 🎉',
          text2: 'Nalog je kreiran! Prijavite se.',
          position: 'top',
        });
        router.replace('/'); // Vodi na Login ekran
      } else {
        Toast.show({
          type: 'error',
          text1: 'Greška! ❌',
          text2: data.message || 'Došlo je do greške prilikom registracije.',
          position: 'top',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Greška! ❌',
        text2: 'Server nije dostupan. Proverite internet konekciju.',
        position: 'top',
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#D32F2F', '#8B0000']} style={{flex: 1}}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{flex: 1}}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Novi Nalog</Text>
            <Text style={styles.subHeader}>Postanite deo Dirhem Plus zajednice</Text>
          </View>
          
          <View style={styles.formCard}>
            <TextInput 
              style={styles.input} 
              placeholder="Ime" 
              placeholderTextColor="#999" 
              onChangeText={(t) => setForm({...form, name: t})} 
            />
            
            <TextInput 
              style={styles.input} 
              placeholder="Prezime" 
              placeholderTextColor="#999" 
              onChangeText={(t) => setForm({...form, surname: t})} 
            />
            
            {/* Input za Email sa jasnim primerom unosa */}
            <TextInput 
              style={styles.input} 
              placeholder="Email (npr. samir@gmail.com)" 
              placeholderTextColor="#999" 
              keyboardType="email-address" 
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(t) => setForm({...form, email: t})} 
            />
            
            {/* Input za Telefon sa jasnim primerom unosa */}
            <TextInput 
              style={styles.input} 
              placeholder="Broj telefona (npr. +38160123456)" 
              placeholderTextColor="#999" 
              keyboardType="phone-pad" 
              onChangeText={(t) => setForm({...form, phone: t})} 
            />
            
            <TextInput 
              style={styles.input} 
              placeholder="Lozinka" 
              placeholderTextColor="#999" 
              secureTextEntry 
              onChangeText={(t) => setForm({...form, password: t})} 
            />

            {/* Novo polje za potvrdu lozinke */}
            <TextInput 
              style={styles.input} 
              placeholder="Potvrdite lozinku" 
              placeholderTextColor="#999" 
              secureTextEntry 
              onChangeText={(t) => setForm({...form, confirmPassword: t})} 
            />

            <TouchableOpacity 
              style={[styles.button, loading && { opacity: 0.7 }]} 
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#8B0000" />
              ) : (
                <Text style={styles.buttonText}>KREIRAJ NALOG</Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => router.back()} style={styles.link}>
            <Text style={styles.linkText}>Već imate nalog? <Text style={styles.linkBold}>Prijavite se</Text></Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { padding: 24, flexGrow: 1, justifyContent: 'center' },
  headerContainer: { marginBottom: 30, alignItems: 'center' },
  header: { fontSize: 32, fontWeight: '900', color: '#FFF', letterSpacing: 1 },
  subHeader: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 5 },
  formCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)'
  },
  input: { 
    backgroundColor: '#FFF', padding: 15, borderRadius: 12, 
    marginBottom: 12, fontSize: 15, color: '#1A1A1A',
  },
  button: { 
    backgroundColor: '#FFF', padding: 18, borderRadius: 12, 
    alignItems: 'center', marginTop: 10
  },
  buttonText: { color: '#8B0000', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
  link: { marginTop: 30, alignItems: 'center' },
  linkText: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  linkBold: { fontWeight: 'bold', color: '#FFF' }
});
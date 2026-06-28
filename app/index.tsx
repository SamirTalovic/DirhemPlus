import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  KeyboardAvoidingView, Platform, StatusBar, ActivityIndicator,
  Image 
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';
import { registerForPushNotificationsAsync } from '../services/notifications'; // Povezana pomoćna funkcija

const API_URL = 'https://dirhemmarket.click/api/auth/login'; 

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const savedToken = await SecureStore.getItemAsync('userToken');
        
        if (savedToken) {
          router.replace('/(tabs)/account');
          return;
        }
      } catch (error) {
        console.log("Greška pri čitanju tokena:", error);
      } finally {
        setIsReady(true);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({ type: 'error', text1: 'Greška! ❌', text2: 'Popunite sva polja.' });
      return;
    }

    setLoading(true);

    // 1. Dobijamo Expo Push Token sa uređaja pre slanja request-a
    const pushToken = await registerForPushNotificationsAsync();

    try {
      // 2. Šaljemo podatke uključujući i generisani pushToken
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email.trim(), 
          password: password,
          expoPushToken: pushToken // <--- Prosleđivanje tokena serveru
        })
      });

      const data = await response.json();

      if (response.ok) {
        await SecureStore.setItemAsync('userToken', data.token);
        if (data.user?.name) {
          await SecureStore.setItemAsync('userName', data.user.name);
        }

        Toast.show({ type: 'success', text1: 'Uspešna prijava 🎉', text2: `Dobrodošli nazad!` });
        router.replace('/(tabs)/account');
      } else {
        Toast.show({ type: 'error', text1: 'Greška! ❌', text2: data.message || 'Neispravni podaci.' });
      }
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Greška! ❌', text2: 'Server nije dostupan.' });
    } finally {
      setLoading(false);
    }
  };

  if (!isReady) {
    return (
      <LinearGradient colors={['#D32F2F', '#8B0000']} style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FFF" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#D32F2F', '#8B0000']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.inner}>
        
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/images/android-icon-foreground.png')} 
            style={[styles.logoImage, { tintColor: '#FFFFFF' }]} 
            resizeMode="contain"
          />
          <Text style={styles.appName}>DIRHEM <Text style={{fontWeight: '300'}}>Plus</Text></Text>
          <Text style={styles.tagline}>Digitalna kartica lojalnosti</Text>
        </View>

        <View style={styles.form}>
          <TextInput 
            style={styles.input} 
            placeholder="Email adresa" 
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={setEmail} 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Lozinka" 
            placeholderTextColor="#999"
            secureTextEntry 
            onChangeText={setPassword} 
          />
          
          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={[styles.button, loading && {backgroundColor: '#444'}, { flex: 1 }]} 
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>PRIJAVI SE</Text>}
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => router.push('/register')} style={styles.link}>
            <Text style={styles.linkText}>Nemate nalog? <Text style={styles.linkBold}>Registrujte se</Text></Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/privacy-policy')} style={styles.privacyLink}>
            <Text style={styles.privacyText}>Korišćenjem aplikacije prihvatate našu{"\n"}Politiku privatnosti</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, justifyContent: 'center', padding: 30 },
  logoContainer: { alignItems: 'center', marginBottom: 35 },
  logoImage: { width: 90, height: 90, marginBottom: 5 },
  appName: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginTop: 10, letterSpacing: 2 },
  tagline: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 5 },
  form: { width: '100%' },
  input: { backgroundColor: '#FFF', padding: 18, borderRadius: 15, marginBottom: 15, fontSize: 16, color: '#1A1A1A' },
  actionRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  button: { backgroundColor: '#1A1A1A', padding: 18, borderRadius: 15, alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
  link: { marginTop: 25, alignItems: 'center' },
  linkText: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  linkBold: { fontWeight: 'bold', color: '#FFF', textDecorationLine: 'underline' },
  privacyLink: { marginTop: 40, alignItems: 'center' },
  privacyText: { color: 'rgba(255,255,255,0.6)', fontSize: 12, textAlign: 'center', textDecorationLine: 'underline', lineHeight: 18 }
});
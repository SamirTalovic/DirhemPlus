import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';
import { API_URL } from '../config';
export default function ProfileDetails() {
  const router = useRouter();
  
  // Stanja za inpute
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(''); // Email držimo samo za prikaz
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Učitaj trenutne podatke pri otvaranju
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const response = await fetch(`https://dirhemmarket.click/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      setName(data.name);
      setSurname(data.surname);
      setPhone(data.phone);
      setEmail(data.email);
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Greška! ❌',
        text2: 'Nije moguće učitati podatke.',
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const response = await fetch(`${API_URL}auth/update-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, surname, phone })
      });

      if (response.ok) {
       Toast.show({
    type: 'success',
    text1: 'Uspeh! 🎉',
    text2: 'Podaci su uspešno ažurirani.',
    position: 'top',
  });
  
  // Sačekaj malo da korisnik vidi poruku pa ga vrati nazad
  setTimeout(() => router.back(), 2000);
        router.back(); // Vrati korisnika nazad na Account tab
      } else {
        Toast.show({
          type: 'error',
          text1: 'Greška! ❌',
          text2: 'Došlo je do problema pri čuvanju.',
          position: 'top',
        });
      }
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Greška! ❌',
        text2: 'Proverite internet konekciju.',
        position: 'top',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ActivityIndicator style={{flex:1}} size="large" color="#D32F2F" />;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lični podaci</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ime</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Prezime</Text>
          <TextInput style={styles.input} value={surname} onChangeText={setSurname} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email adresa (nije moguće menjati)</Text>
          <TextInput style={[styles.input, {backgroundColor: '#EEE'}]} value={email} editable={false} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Broj telefona</Text>
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        </View>

        <TouchableOpacity 
          style={[styles.saveBtn, saving && {opacity: 0.7}]} 
          onPress={handleUpdate}
          disabled={saving}
        >
          {saving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveBtnText}>SAČUVAJ IZMENE</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F4' },
  header: { backgroundColor: '#D32F2F', paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center' },
  backBtn: { marginRight: 15 },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  form: { padding: 20 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 12, color: '#888', fontWeight: '900', marginBottom: 8, textTransform: 'uppercase' },
  input: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, fontSize: 16, borderWidth: 1, borderColor: '#EEE' },
  saveBtn: { backgroundColor: '#1A1A1A', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  saveBtnText: { color: '#FFF', fontWeight: '900', letterSpacing: 1 }
});
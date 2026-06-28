import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar, ActivityIndicator } from 'react-native';
import { Barcode } from 'expo-barcode-generator';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode, JwtPayload } from "jwt-decode";
import { API_URL } from '../../config';

const { width } = Dimensions.get('window');

interface MyTokenPayload extends JwtPayload {
  barcode?: string;
}

export default function BarcodeScreen() {
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBarcodeFromToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
          const decoded = jwtDecode<MyTokenPayload>(token);
          if (decoded.barcode) {
            setCode(decoded.barcode);
          }
        }
      } catch (error) {
        console.error("Greška pri čitanju barkoda:", error);
      } finally {
        setLoading(false);
      }
    };

    getBarcodeFromToken();
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
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.brandName}>DIRHEM <Text style={{fontWeight: '300'}}>Plus</Text></Text>
      </View>

      <View style={styles.card}>
        <View style={styles.topRow}>
          <Text style={styles.title}>Digitalna kartica</Text>
        </View>

        <View style={styles.barcodeWrapper}>
          {code ? (
            <Barcode
              value={code}
              options={{ 
                format: 'EAN13', 
                width: 1.8, 
                height: 100,
                background: '#FFFFFF' 
              }}
            />
          ) : (
            <Text style={{ color: '#666' }}>Barkod nije pronađen</Text>
          )}
        </View>

        <Text style={styles.codeText}>
          {code ? code.match(/.{1,4}/g)?.join(' ') : '---- ---- ----'}
        </Text>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Vaš trajni ID lojalnosti</Text>
        </View>
      </View>

      <Text style={styles.footerNote}>Pokažite bar kod na kasi za realizaciju transakcije</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    position: 'absolute',
    top: 60,
    alignItems: 'center',
  },
  brandName: {
    color: '#FFF',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: '#FFF',
    width: width * 0.85,
    padding: 25,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 25,
  },
  title: {
    fontSize: 14,
    color: '#666',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  barcodeWrapper: {
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    overflow: 'hidden',
  },
  codeText: {
    marginTop: 15,
    fontSize: 20,
    letterSpacing: 4,
    fontWeight: '500',
    color: '#222',
  },
  infoContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  infoText: {
    color: '#888',
    fontSize: 13,
  },
  footerNote: {
    position: 'absolute',
    bottom: 50,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    fontSize: 12,
    paddingHorizontal: 40,
  }
});
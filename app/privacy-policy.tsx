import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={['#D32F2F', '#8B0000']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>&lt; Nazad</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Politika privatnosti</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.card}>
            <Text style={styles.lastUpdated}>Poslednje ažuriranje: Jun 2026.</Text>
            
            <Text style={styles.paragraph}>
              Ova Politika privatnosti objašnjava kako prikupljamo, koristimo, održavamo i otkrivamo podatke prikupljene od korisnika aplikacije Dirhem Plus. Vaša privatnost nam je veoma važna i obavezujemo se da ćemo vaše podatke čuvati na siguran način, u skladu sa važećim propisima.
            </Text>

            <Text style={styles.sectionTitle}>1. Podaci koje prikupljamo</Text>
            <Text style={styles.paragraph}>Kada kreirate nalog i koristite našu aplikaciju, prikupljamo sledeće lične podatke:</Text>
            
            <View style={styles.bulletContainer}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.bold}>Osnovne podatke za nalog:</Text>
                {' '}Ime, prezime, broj telefona i email adresa.
              </Text>
            </View>
            <View style={styles.bulletContainer}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.bold}>Podaci o push notifikacijama:</Text>
                {' '}Kada pristanete na primanje obaveštenja, aplikacija generiše jedinstveni identifikator vašeg uređaja (tzv. <Text style={styles.bold}>Expo Push Token</Text>). Ovaj token nam služi isključivo kao tehnička adresa kako bismo znali na koji uređaj da isporučimo obaveštenje i vezuje se za vaš korisnički nalog.
              </Text>
            </View>
            <View style={styles.bulletContainer}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.bold}>Podaci o kupovini:</Text>
                {' '}Informacije o ostvarenim popustima i artiklima u svrhu kreiranja personalizovanih preporuka.
              </Text>
            </View>
            <View style={styles.bulletContainer}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.bold}>Tehnički podaci:</Text>
                {' '}Autentifikacioni tokeni koji se bezbedno čuvaju lokalno na vašem uređaju.
              </Text>
            </View>
            <Text style={styles.paragraph}>
              Aplikacija{' '}
              <Text style={styles.bold}>ne prikuplja</Text>
              {' '}podatke o vašoj tačnoj lokaciji niti zahteva pristup vašim kontaktima, kameri i galeriji.
            </Text>

            <Text style={styles.sectionTitle}>2. Kako koristimo podatke</Text>
            <Text style={styles.paragraph}>Vaše podatke koristimo isključivo u sledeće svrhe:</Text>
            <View style={styles.bulletContainer}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Omogućavanje sigurne prijave i upravljanje korisničkim nalogom.</Text>
            </View>
            <View style={styles.bulletContainer}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Prikazivanje digitalne kartice lojalnosti i praćenje popusta.</Text>
            </View>
            <View style={styles.bulletContainer}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.bold}>Slanje obaveštenja i ponuda:</Text>
                {' '}Vaš push token koristimo isključivo za slanje aktuelnih obaveštenja, digitalnih letaka i važnih informacija o popustima unutar aplikacije.
              </Text>
            </View>
            <View style={styles.bulletContainer}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.bold}>Generisanje personalizovanih preporuka (artikala na akciji).</Text>
              </Text>
            </View>

            <Text style={styles.sectionTitle}>3. Bezbednost vaših podataka</Text>
            <Text style={styles.paragraph}>
              Osetljivi podaci, kao što su tokeni za prijavu i push identifikatori, čuvaju se pomoću najviših sigurnosnih standarda u šifrovanom formatu (Secure Store) na vašem uređaju. Komunikacija između aplikacije i naših servera odvija se uvek preko sigurne HTTPS enkripcije.
            </Text>

            <Text style={styles.sectionTitle}>4. Deljenje podataka sa trećim licima</Text>
            <Text style={styles.paragraph}>
              Mi nikada ne prodajemo, ne trgujemo i ne ustupamo vaše lične podatke u komercijalne svrhe. Za pružanje stabilnih i funkcionalnih usluga, sarađujemo sa proverenim eksternim servisima kojima se prosleđuju isključivo minimalni neophodni podaci:
            </Text>
            <View style={styles.bulletContainer}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.bold}>Expo (650 Industries, Inc.):</Text> Preko čijeg sistema se vrši sigurno rutiranje i isporuka push notifikacija na vaš uređaj (koristi se vaš Push Token).
              </Text>
            </View>
            <View style={styles.bulletContainer}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.bold}>Cloudinary Ltd.:</Text> Pouzdani cloud servis koji se koristi isključivo za skladištenje i brzu isporuku optimizovanih slika unutar obaveštenja i kataloga akcija.
              </Text>
            </View>

            <Text style={styles.sectionTitle}>5. Upravljanje notifikacijama</Text>
            <Text style={styles.paragraph}>
              Vi imate potpunu kontrolu nad push obaveštenjima. U svakom trenutku ih možete privremeno ili trajno isključiti direktno kroz sistemska podešavanja vašeg mobilnog telefona (<Text style={styles.italic}>Podešavanja - Aplikacije - Dirhem Plus - Obaveštenja</Text>). Isključivanjem notifikacija i dalje možete nesmetano koristiti sve ostale funkcije aplikacije, uključujući i ručni pregled sekcije sa aktuelnim vestima.
            </Text>

            <Text style={styles.sectionTitle}>6. Pravo na brisanje naloga</Text>
            <Text style={styles.paragraph}>
              U svakom trenutku imate pravo da zatražite trajno brisanje vašeg korisničkog naloga i svih povezanih podataka sa naših servera:
            </Text>
            <View style={styles.bulletContainer}>
              <Text style={styles.bullet}>1.</Text>
              <Text style={styles.bulletText}>Direktno u aplikaciji na ekranu vašeg naloga.</Text>
            </View>
            <View style={styles.bulletContainer}>
              <Text style={styles.bullet}>2.</Text>
              <Text style={styles.bulletText}>Slanjem zahteva na naš kontakt email.</Text>
            </View>

            <Text style={styles.sectionTitle}>7. Kontakt</Text>
            <Text style={styles.paragraph}>
              Ako imate bilo kakvih pitanja u vezi sa ovom Politikom privatnosti, kontaktirajte nas putem emaila:
            </Text>
            <Text style={styles.contactEmail}>dirhem.trgovina@gmail.com</Text>
            
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'ios' ? 10 : 20,
  },
  backButton: {
    minWidth: 60,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 10,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  lastUpdated: {
    fontSize: 13,
    color: '#888',
    marginBottom: 20,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
    marginTop: 24,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  italic: {
    fontStyle: 'italic',
    color: '#555',
  },
  bulletContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingRight: 10,
  },
  bullet: {
    fontSize: 14,
    color: '#D32F2F',
    fontWeight: 'bold',
    marginRight: 8,
    marginTop: 2,
  },
  bulletText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
    flex: 1,
  },
  contactEmail: {
    fontSize: 16,
    color: '#D32F2F',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginTop: 5,
  }
});
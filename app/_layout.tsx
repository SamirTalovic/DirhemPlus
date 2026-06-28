import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message'; 
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import * as NavigationBar from 'expo-navigation-bar'; 
import * as Notifications from 'expo-notifications'; // Uvozimo expo-notifications

// Uvoziš tvoju funkciju sa nove, ispravne putanje (van app foldera!)
import { registerForPushNotificationsAsync } from '../services/notifications';

// Isključujemo dosadna upozorenja
configureReanimatedLogger({
  level: ReanimatedLogLevel.error, 
  strict: false, 
});

// Podešavanje kako se notifikacija ponaša ako je aplikacija UPALJENA (foreground)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    // Dodaj ova dva polja da bi utišao TypeScript grešku u SDK 54:
    shouldShowBanner: true, // Kontroliše iskakanje banera na vrhu ekrana
    shouldShowList: true,   // Kontroliše da li se prikazuje u centru za obaveštenja
  }),
});

export default function RootLayout() {
  const router = useRouter();
  
  useEffect(() => {
    // 1. Sakrivanje sistemske navigacije (Tvoj kod)
    if (Platform.OS === 'android') {
      const hideSystemNav = async () => {
        try {
          await NavigationBar.setVisibilityAsync('hidden');
          await NavigationBar.setBehaviorAsync('overlay-swipe');
        } catch (error) {
          console.log("Greška pri sakrivanju navigacione trake:", error);
        }
      };
      hideSystemNav();
    }

    // 2. Pokretanje registracije i ispis tokena u konzoli
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        console.log("KORISNIKOV PUSH TOKEN ZA BAZU:", token);
        // OVDE: fetch-om pošalji token na svoj .NET backend da se upiše za tog korisnika
      }
    });

    // 3. Slušalac za KLIK na notifikaciju (vodi na ekran Aktuelno)
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      const screenData = response.notification.request.content.data?.screen;

      if (screenData === 'aktuelno') {
        // Preusmeravanje pomoću Expo Router-a na tvoj tab/ekran za aktuelno
        // Ako je unutar tabova, putanja je obično '/(tabs)/aktuelno' ili samo '/aktuelno'
        router.push('/aktuelno'); 
      }
    });

    return () => {
      responseSubscription.remove();
    };
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="register" />
        <Stack.Screen name="(tabs)" />
      </Stack>

      <Toast />
    </>
  );
}
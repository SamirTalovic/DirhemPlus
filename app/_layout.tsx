import { useEffect, useRef } from 'react';
import { Stack, useRouter } from 'expo-router';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message'; 
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import * as NavigationBar from 'expo-navigation-bar'; 
import * as Notifications from 'expo-notifications'; // Uvozimo expo-notifications
import * as SecureStore from 'expo-secure-store';
import Constants, { ExecutionEnvironment } from 'expo-constants';

// Uvoziš tvoju funkciju sa nove, ispravne putanje (van app foldera!)
import { registerForPushNotificationsAsync } from '../services/notifications';
import { API_URL } from '../config';

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
  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  const handledResponseRef = useRef<typeof lastNotificationResponse>(null);

  useEffect(() => {
    // Hvata klik koji je pokrenuo app iz ugašenog stanja (cold start) —
    // addNotificationResponseReceivedListener ne vidi taj klik jer se registruje prekasno.
    if (lastNotificationResponse && lastNotificationResponse !== handledResponseRef.current) {
      handledResponseRef.current = lastNotificationResponse;
      const screenData = lastNotificationResponse.notification.request.content.data?.screen;
      if (screenData === 'aktuelno') {
        router.push('/(tabs)/aktuelno');
      }
      Notifications.setBadgeCountAsync(0);
    }
  }, [lastNotificationResponse]);

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
    registerForPushNotificationsAsync().then(async pushToken => {
      if (!pushToken) return;

      // Ne šaljemo token na backend ako app radi unutar Expo Go — spriječava prepisivanje
      // ispravnog tokena instaliranog builda pri testiranju kroz Expo Go.
      if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
        console.log("Pokrenuto kroz Expo Go — push token nije poslan na backend.");
        return;
      }

      console.log("KORISNIKOV PUSH TOKEN ZA BAZU:", pushToken);

      try {
        const authToken = await SecureStore.getItemAsync('userToken');
        if (!authToken) return;

        const response = await fetch(`${API_URL.trim()}notifications/register-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify({ pushToken }),
        });

        if (!response.ok) {
          const errorBody = await response.text();
          console.log(`Registracija push tokena nije uspela (status ${response.status}):`, errorBody);
        } else {
          console.log("Push token uspešno registrovan na backendu.");
        }
      } catch (error) {
        console.log("Greška pri slanju push tokena na backend:", error);
      }
    });

    // 3. Slušalac za KLIK na notifikaciju (vodi na ekran Aktuelno) dok je app već pokrenuta
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      const screenData = response.notification.request.content.data?.screen;
      if (screenData === 'aktuelno') {
        router.push('/(tabs)/aktuelno');
      }
      Notifications.setBadgeCountAsync(0);
    });

    // 4. Slušalac za PRIMLJENU notifikaciju (app u foreground-u) — povećaj broj na ikonici
    const receivedSubscription = Notifications.addNotificationReceivedListener(async () => {
      const current = await Notifications.getBadgeCountAsync();
      await Notifications.setBadgeCountAsync(current + 1);
    });

    return () => {
      responseSubscription.remove();
      receivedSubscription.remove();
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
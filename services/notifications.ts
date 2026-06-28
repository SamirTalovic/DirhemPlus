import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export async function registerForPushNotificationsAsync() {
  let token = '';

  // Notifikacije rade isključivo na stvarnim uređajima
  if (!Device.isDevice) {
    console.log('Morate koristiti stvarni uređaj za push notifikacije');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Ako nemamo dozvolu, tražimo je od korisnika kroz sistemski pop-up
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Korisnik je odbio dozvolu za notifikacije!');
    return null;
  }

  try {
    const expoTokenData = await Notifications.getExpoPushTokenAsync({
      projectId: 'cddd9a9e-fc8b-481f-8b67-055fd9814faf', // Tvoj EAS Project ID
    });
    token = expoTokenData.data;
  } catch (error) {
    console.log('Greška pri generisanju Expo tokena:', error);
    return null;
  }

  // Podešavanje kanala za Android uređaje (Zvuk, vibracija, svetlo)
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#8B0000',
    });
  }

  return token;
}
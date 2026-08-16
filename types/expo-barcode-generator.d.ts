// Paket ne isporučuje sopstvene tipove, pa `tsc --noEmit` puca na TS7016.
declare module 'expo-barcode-generator' {
  import type { ComponentType } from 'react';
  import type { StyleProp, ViewStyle } from 'react-native';

  export interface BarcodeProps {
    value: string;
    options?: {
      format?: string;
      width?: number;
      height?: number;
      background?: string;
      lineColor?: string;
      displayValue?: boolean;
      text?: string;
      fontSize?: number;
      margin?: number;
    };
    rotation?: number;
    style?: StyleProp<ViewStyle>;
  }

  export const Barcode: ComponentType<BarcodeProps>;
}

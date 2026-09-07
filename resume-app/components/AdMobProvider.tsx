import React, { createContext, useContext, ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AdMobContextType {
  isInitialized: boolean;
  nativeAdsReady: boolean;
  showInterstitial: () => Promise<void>;
  BannerAdComponent: React.FC<{ style?: any }>;
}

const AdMobContext = createContext<AdMobContextType>({
  isInitialized: false,
  nativeAdsReady: false,
  showInterstitial: async () => {},
  BannerAdComponent: () => null,
});

export const useAds = () => useContext(AdMobContext);

const FallbackBanner: React.FC<{ style?: any }> = ({ style }) => (
  <View
    style={[
      {
        height: 50,
        backgroundColor: '#e0e7ff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
      },
      style,
    ]}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: '#4f46e5' }} />
      <View style={{ alignItems: 'center' }}>
        <View style={{ width: 80, height: 8, borderRadius: 4, backgroundColor: '#a5b4fc', marginBottom: 3 }} />
        <View style={{ width: 60, height: 6, borderRadius: 3, backgroundColor: '#c7d2fe' }} />
      </View>
    </View>
  </View>
);

export function AdMobProvider({ children }: { children: ReactNode }) {
  const showInterstitial = async () => {};

  const BannerAdComponent = ({ style }: { style?: any }) => (
    <FallbackBanner style={style} />
  );

  return (
    <AdMobContext.Provider
      value={{
        isInitialized: true,
        nativeAdsReady: false,
        showInterstitial,
        BannerAdComponent,
      }}
    >
      {children}
    </AdMobContext.Provider>
  );
}

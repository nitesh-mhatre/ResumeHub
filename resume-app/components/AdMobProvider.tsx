import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Platform, View } from 'react-native';

// Lazy-load the native module — fails gracefully in Expo Go or when plugin is not configured
let MobileAds: any = null;
let InterstitialAd: any = null;
let AdEventType: any = null;
let TestIds: any = null;
let BannerAdSize: any = null;
let BannerAd: any = null;
let RewardedAd: any = null;
let RewardedAdEventType: any = null;

let nativeAdsAvailable = false;

try {
  const adsModule = require('react-native-google-mobile-ads');
  MobileAds = adsModule.MobileAds;
  InterstitialAd = adsModule.InterstitialAd;
  AdEventType = adsModule.AdEventType;
  TestIds = adsModule.TestIds;
  BannerAdSize = adsModule.BannerAdSize;
  BannerAd = adsModule.BannerAd;
  RewardedAd = adsModule.RewardedAd;
  RewardedAdEventType = adsModule.RewardedAdEventType;
  nativeAdsAvailable = !!(MobileAds && InterstitialAd && BannerAd);
} catch (e) {
  // Native ads not available — using fallback placeholder banners
}

const BANNER_AD_UNIT_ID = __DEV__
  ? TestIds?.BANNER || 'ca-app-pub-2889632845666311/5648358555'
  : Platform.select({
      ios: 'ca-app-pub-2889632845666311/5648358555',
      android: 'ca-app-pub-2889632845666311/5648358555',
    }) || 'ca-app-pub-2889632845666311/5648358555';

const INTERSTITIAL_AD_UNIT_ID = __DEV__
  ? TestIds?.INTERSTITIAL || 'ca-app-pub-3940256099942544/1033173712'
  : Platform.select({
      ios: 'ca-app-pub-2889632845666311/TODO_INTERSTITIAL_IOS',
      android: 'ca-app-pub-2889632845666311/TODO_INTERSTITIAL_ANDROID',
    }) || 'ca-app-pub-2889632845666311/TODO_INTERSTITIAL_ANDROID';

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

// Fallback banner that just shows a gradient placeholder
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

export function AdMobProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [nativeAdsReady, setNativeAdsReady] = useState(false);

  useEffect(() => {
    if (!nativeAdsAvailable || !MobileAds) {
      setIsInitialized(true);
      return;
    }

    MobileAds()
      .initialize()
      .then(() => {
        setIsInitialized(true);
        setNativeAdsReady(true);
        console.log('AdMob initialized successfully');
      })
      .catch((error: any) => {
        console.warn('AdMob initialization failed:', error);
        setIsInitialized(true);
      });
  }, []);

  const showInterstitial = useCallback(async () => {
    if (!nativeAdsAvailable || !InterstitialAd || !AdEventType) {
      // No native ads — do nothing, the AdModal handles the fallback
      return;
    }

    try {
      const interstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID, {
        requestNonPersonalizedAdsOnly: true,
      });

      await new Promise<void>((resolve) => {
        const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
          interstitial.show();
        });

        const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
          unsubscribeLoaded();
          unsubscribeClosed();
          resolve();
        });

        const unsubscribeError = interstitial.addAdEventListener(AdEventType.ERROR, () => {
          unsubscribeLoaded();
          unsubscribeClosed();
          unsubscribeError();
          resolve();
        });

        interstitial.load();
      });
    } catch (error) {
      console.warn('Interstitial ad error:', error);
    }
  }, []);

  const BannerAdComponent = useCallback(
    ({ style }: { style?: any }) => {
      if (!nativeAdsAvailable || !BannerAd || !BannerAdSize) {
        return <FallbackBanner style={style} />;
      }

      return (
        <View style={style}>
          <BannerAd
            unitId={BANNER_AD_UNIT_ID}
            size={BannerAdSize.FULL_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
            onAdLoaded={() => {
              console.log('Banner ad loaded');
            }}
            onAdFailedToLoad={(error: any) => {
              console.warn('Banner ad failed to load:', error);
            }}
          />
        </View>
      );
    },
    []
  );

  return (
    <AdMobContext.Provider
      value={{
        isInitialized,
        nativeAdsReady,
        showInterstitial,
        BannerAdComponent,
      }}
    >
      {children}
    </AdMobContext.Provider>
  );
}

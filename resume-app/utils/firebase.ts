import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Firebase project config from google-services.json
const firebaseConfig = {
  apiKey: 'AIzaSyCeZnKmL-ZHSynvysgCZaYfdlAfz8Mn--Q',
  authDomain: 'nitesh-mhatre-resume.firebaseapp.com',
  projectId: 'nitesh-mhatre-resume',
  storageBucket: 'nitesh-mhatre-resume.firebasestorage.app',
  messagingSenderId: '559842224512',
  appId: '1:559842224512:android:2c2d39370157fa03c6f965',
};

const app = initializeApp(firebaseConfig);

// Try to initialize auth with AsyncStorage persistence; fall back to getAuth if it fails
let auth: Auth;
try {
  // Dynamically require to avoid crash when module path doesn't export the symbol
  const rnAuth = require('@firebase/auth');
  const getRNPersistence = rnAuth.getReactNativePersistence;
  if (typeof getRNPersistence === 'function') {
    auth = initializeAuth(app, {
      persistence: getRNPersistence(ReactNativeAsyncStorage),
    });
  } else {
    throw new Error('getReactNativePersistence not available');
  }
} catch {
  // Fallback: getAuth reuses an already-initialized instance (safe for hot-reload too)
  try {
    auth = getAuth(app);
  } catch {
    // Last resort: bare initializeAuth without custom persistence
    try {
      auth = initializeAuth(app);
    } catch {
      auth = getAuth(app);
    }
  }
}

export { auth };
export const googleProvider = new GoogleAuthProvider();

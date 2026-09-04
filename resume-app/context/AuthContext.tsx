import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithCredential,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  User,
} from 'firebase/auth';
import { auth } from '../utils/firebase';

// Lazy-load GoogleSignin to prevent crash in Expo Go or when native module is unavailable
let GoogleSignin: any = null;
let statusCodes: any = null;
let googleSigninAvailable = false;

try {
  const gs = require('@react-native-google-signin/google-signin');
  GoogleSignin = gs.GoogleSignin;
  statusCodes = gs.statusCodes;
  googleSigninAvailable = !!(GoogleSignin && statusCodes);
} catch (e) {
  // Native module not available (e.g. Expo Go) — Google Sign-In will be disabled
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Configure Google Sign-In with web client ID (for Firebase)
  useEffect(() => {
    if (googleSigninAvailable && GoogleSignin) {
      GoogleSignin.configure({
        webClientId: '559842224512-r3ub8nu65oq46dgjq80m0kosplfdf8pl.apps.googleusercontent.com',
        offlineAccess: true,
      });
    }
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    if (!googleSigninAvailable || !GoogleSignin) {
      console.warn('Google Sign-In is not available in this environment (Expo Go).');
      return;
    }

    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      // Handle both old and new API shapes
      const idToken = (userInfo as any)?.idToken ?? (userInfo as any)?.user?.idToken;
      const credential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, credential);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // User cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // Sign-in is already in progress
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // Play services not available or outdated
      } else {
        console.error('Google sign-in error:', error);
      }
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

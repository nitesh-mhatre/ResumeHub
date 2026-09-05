import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// Firebase and Google integration removed.


interface AuthContextType {
  user: null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>; // Removed implementation
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  signInWithGoogle: async () => {}, // Removed implementation
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
    // Google Sign-In removed
      GoogleSignin.configure({
        // webClientId removed
        offlineAccess: true,
      });
    }
  }, []);

  // Listen for auth state changes (removed)
  useEffect(() => {
    // onAuthStateChanged removed
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // signInWithGoogle removed
    // Google Sign-In removed
      console.warn('Google Sign-In is not available in this environment (Expo Go).');
      return;
    }

    try {
      await GoogleSignin.hasPlayServices();
      // Google Sign-In removed
      // Handle both old and new API shapes
      const idToken = (userInfo as any)?.idToken ?? (userInfo as any)?.user?.idToken;
      const credential = GoogleAuthProvider.credential(idToken);
      // signInWithCredential removed
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
      // firebaseSignOut removed
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle: async () => {}, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

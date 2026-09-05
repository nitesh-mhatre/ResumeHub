import React, { createContext, useContext, useState, ReactNode } from 'react';

// Shape of a signed-in user. Firebase/Google Sign-In is currently stubbed out,
// so `user` stays null at runtime and the app runs in local-only mode.
interface AuthUser {
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
  metadata?: { creationTime?: string };
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading] = useState(false);

  const signInWithGoogle = async () => {
    console.warn('Google Sign-In is not available in this environment (Expo Go).');
  };

  const signOut = async () => {
    console.warn('Sign-out is not available in this environment.');
  };

  return (
    <AuthContext.Provider value={{ user: null, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

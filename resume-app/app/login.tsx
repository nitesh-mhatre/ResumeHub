import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants';

export default function LoginScreen() {
  const { loading } = useAuth();
  const [signingIn, setSigningIn] = React.useState(false);

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    // Google sign-in removed
    setSigningIn(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <LinearGradient colors={['#ffffff', '#eef2ff']} style={styles.gradient}>
      <View style={[styles.blob, styles.blobTop]} />
      <View style={[styles.blob, styles.blobBottom]} />
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoArea}>
          <LinearGradient
            colors={['#6366f1', COLORS.primary, '#7c3aed']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoCircle}
          >
            <Ionicons name="document-text" size={44} color={COLORS.white} />
          </LinearGradient>
          <Text style={styles.appName}>Resume Hub</Text>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>Sign in to continue building your resume</Text>
        </View>

        {/* Google Sign-In Button */}
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleSignIn}
          disabled={signingIn}
          activeOpacity={0.8}
        >
          {signingIn ? (
            <ActivityIndicator color={COLORS.gray700} size="small" />
          ) : (
            <>
              <Ionicons name="logo-google" size={22} color="#4285F4" />
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Terms */}
        <Text style={styles.terms}>
          By continuing, you agree to our{'\n'}
          <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  gradient: { flex: 1 },
  blob: { position: 'absolute', borderRadius: 999 },
  blobTop: {
    width: 260,
    height: 260,
    top: -90,
    right: -110,
    backgroundColor: 'rgba(79,70,229,0.06)',
  },
  blobBottom: {
    width: 220,
    height: 220,
    bottom: -80,
    left: -100,
    backgroundColor: 'rgba(16,185,129,0.06)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 6,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.gray900,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.gray500,
    textAlign: 'center',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 56,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.gray200,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray700,
  },
  terms: {
    fontSize: 12,
    color: COLORS.gray400,
    textAlign: 'center',
    marginTop: 32,
    lineHeight: 18,
  },
  termsLink: {
    fontWeight: '600',
    color: COLORS.gray500,
  },
});

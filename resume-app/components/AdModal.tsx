import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';

interface AdModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
}

export default function AdModal({ visible, onClose, title }: AdModalProps) {
  const [countdown, setCountdown] = useState(5);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (!visible) {
      setCountdown(5);
      setCanClose(false);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanClose(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [visible]);

  const handleClose = () => {
    if (canClose) {
      setCountdown(5);
      setCanClose(false);
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={handleClose}
      >
        <View style={styles.adCard} onStartShouldSetResponder={() => true}>
          {/* Ad Header */}
          <View style={styles.adHeader}>
            <View style={styles.adBadge}>
              <Ionicons name="megaphone-outline" size={14} color={COLORS.white} />
              <Text style={styles.adBadgeText}>ADVERTISEMENT</Text>
            </View>
            <TouchableOpacity
              style={[styles.closeButton, !canClose && styles.closeButtonDisabled]}
              onPress={handleClose}
              disabled={!canClose}
            >
              <Ionicons name="close" size={20} color={canClose ? COLORS.gray600 : COLORS.gray300} />
            </TouchableOpacity>
          </View>

          {/* Ad Content */}
          <View style={styles.adContent}>
            <View style={styles.adIconContainer}>
              <Ionicons name="rocket" size={48} color={COLORS.primary} />
            </View>
            <Text style={styles.adTitle}>Upgrade to Resume Hub Pro</Text>
            <Text style={styles.adSubtitle}>{title || 'Get premium features for your career'}</Text>

            <View style={styles.featureList}>
              <View style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                <Text style={styles.featureText}>Unlimited custom templates</Text>
              </View>
              <View style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                <Text style={styles.featureText}>AI-powered content suggestions</Text>
              </View>
              <View style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                <Text style={styles.featureText}>Priority PDF export quality</Text>
              </View>
              <View style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                <Text style={styles.featureText}>Remove watermark from exports</Text>
              </View>
            </View>

            {/* Banner Ad */}
            <View style={styles.bannerAd}>
              <View style={styles.bannerLeft}>
                <Text style={styles.bannerTitle}>🌟 Limited Time Offer</Text>
                <Text style={styles.bannerText}>50% OFF Pro Annual Plan</Text>
              </View>
              <TouchableOpacity style={styles.bannerButton} onPress={handleClose}>
                <Text style={styles.bannerButtonText}>Claim Now</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Ad Footer */}
          <View style={styles.adFooter}>
            {!canClose ? (
              <View style={styles.countdownContainer}>
                <Ionicons name="time-outline" size={14} color={COLORS.gray400} />
                <Text style={styles.countdownText}>Continue in {countdown}s</Text>
              </View>
            ) : (
              <TouchableOpacity style={styles.continueButton} onPress={handleClose}>
                <Text style={styles.continueButtonText}>Continue to {title || 'Export'}</Text>
                <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.adDisclaimer}>Sponsored content • Resume Hub</Text>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  adCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    width: '100%',
    maxWidth: 380,
    overflow: 'hidden',
    elevation: 12,
  },
  adHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.gray50,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  adBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  adBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 1,
  },
  closeButton: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: COLORS.gray100,
  },
  closeButtonDisabled: {
    opacity: 0.4,
  },
  adContent: {
    padding: 20,
    alignItems: 'center',
  },
  adIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  adTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.secondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  adSubtitle: {
    fontSize: 14,
    color: COLORS.gray500,
    textAlign: 'center',
    marginBottom: 20,
  },
  featureList: {
    width: '100%',
    gap: 10,
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 8,
  },
  featureText: {
    fontSize: 13,
    color: COLORS.gray700,
    fontWeight: '500',
  },
  bannerAd: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 14,
    width: '100%',
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  bannerLeft: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 2,
  },
  bannerText: {
    fontSize: 12,
    color: '#b45309',
    fontWeight: '600',
  },
  bannerButton: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bannerButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 12,
  },
  adFooter: {
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray100,
    alignItems: 'center',
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  countdownText: {
    fontSize: 13,
    color: COLORS.gray400,
    fontWeight: '500',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    gap: 8,
  },
  continueButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 15,
  },
  adDisclaimer: {
    fontSize: 10,
    color: COLORS.gray400,
    textAlign: 'center',
    paddingBottom: 10,
  },
});

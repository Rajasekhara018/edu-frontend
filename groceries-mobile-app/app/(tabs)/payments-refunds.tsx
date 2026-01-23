import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { ThemePalette } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

type PaymentMethod = {
  id: string;
  type: 'card' | 'upi' | 'wallet';
  label: string;
  detail: string;
  primary?: boolean;
};

type RefundItem = {
  id: string;
  orderId: string;
  amount: number;
  status: 'processing' | 'completed';
  eta: string;
};

const paymentMethods: PaymentMethod[] = [
  {
    id: 'pm-1',
    type: 'card',
    label: 'HDFC Credit Card',
    detail: '**** 1189',
    primary: true,
  },
  {
    id: 'pm-2',
    type: 'upi',
    label: 'UPI',
    detail: 'saired...@okaxis',
  },
  {
    id: 'pm-3',
    type: 'wallet',
    label: 'Wallet balance',
    detail: 'Rs 580',
  },
];

const refunds: RefundItem[] = [
  {
    id: 'rf-1',
    orderId: '406-7749123-1098871',
    amount: 319,
    status: 'processing',
    eta: 'Expected by 26 January 2026',
  },
  {
    id: 'rf-2',
    orderId: '406-4604689-1865921',
    amount: 442,
    status: 'completed',
    eta: 'Credited on 11 January 2026',
  },
];

const formatPrice = (value: number) => `Rs ${value.toFixed(0)}`;

export default function PaymentsRefundsScreen() {
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const router = useRouter();
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState<string>(
    paymentMethods.find((method) => method.primary)?.id ?? paymentMethods[0].id
  );
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [showChangeRefund, setShowChangeRefund] = useState(false);
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [showRefundDetails, setShowRefundDetails] = useState<RefundItem | null>(null);
  const [showSupport, setShowSupport] = useState(false);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={20} color={palette.text} />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.title}>{t('payments_title')}</Text>
            <Text style={styles.subtitle}>{t('payments_subtitle')}</Text>
          </View>
        </View>

        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceTitle}>{t('wallet_balance')}</Text>
            <Pressable style={styles.balanceButton} onPress={() => setShowAddMoney(true)}>
              <Text style={styles.balanceButtonText}>{t('add_money')}</Text>
            </Pressable>
          </View>
          <Text style={styles.balanceAmount}>Rs 580</Text>
          <Text style={styles.balanceHint}>Auto-applied to eligible orders.</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{t('saved_methods')}</Text>
            <Pressable style={styles.inlineButton} onPress={() => setShowAddMethod(true)}>
              <Text style={styles.inlineButtonText}>{t('add_new')}</Text>
            </Pressable>
          </View>
          {paymentMethods.map((method) => {
            const active = method.id === selectedMethod;
            return (
              <Pressable
                key={method.id}
                style={[styles.methodRow, active && styles.methodRowActive]}
                onPress={() => setSelectedMethod(method.id)}>
                <View style={styles.methodIcon}>
                  <MaterialIcons
                    name={method.type === 'card' ? 'credit-card' : method.type === 'upi' ? 'qr-code' : 'account-balance-wallet'}
                    size={18}
                    color={palette.primary}
                  />
                </View>
                <View style={styles.methodInfo}>
                  <Text style={styles.methodLabel}>{method.label}</Text>
                  <Text style={styles.methodDetail}>{method.detail}</Text>
                </View>
                {method.primary ? (
                  <Text style={styles.primaryBadge}>Primary</Text>
                ) : null}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('refund_status')}</Text>
          {refunds.map((refund) => (
            <Pressable
              key={refund.id}
              style={styles.refundRow}
              onPress={() => setShowRefundDetails(refund)}>
              <View style={styles.refundIcon}>
                <MaterialIcons
                  name={refund.status === 'completed' ? 'check-circle' : 'hourglass-top'}
                  size={18}
                  color={refund.status === 'completed' ? palette.primary : palette.warning}
                />
              </View>
              <View style={styles.refundInfo}>
                <Text style={styles.refundTitle}>
                  {formatPrice(refund.amount)} refund
                </Text>
                <Text style={styles.refundMeta}>Order #{refund.orderId}</Text>
                <Text style={styles.refundMeta}>{refund.eta}</Text>
              </View>
              <Text style={styles.refundStatus}>
                {refund.status === 'completed' ? 'Credited' : 'Processing'}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('payout_preferences')}</Text>
          <Text style={styles.cardSubtitle}>
            Choose where refunds are credited and view settlement schedule.
          </Text>
          <View style={styles.preferenceRow}>
            <View>
              <Text style={styles.preferenceLabel}>Default refund method</Text>
              <Text style={styles.preferenceValue}>UPI (saired...@okaxis)</Text>
            </View>
            <Pressable style={styles.inlineButton} onPress={() => setShowChangeRefund(true)}>
              <Text style={styles.inlineButtonText}>Change</Text>
            </Pressable>
          </View>
          <View style={styles.preferenceRow}>
            <View>
              <Text style={styles.preferenceLabel}>Settlement timeline</Text>
              <Text style={styles.preferenceValue}>2-4 business days</Text>
            </View>
            <Pressable style={styles.inlineButton} onPress={() => setShowLearnMore(true)}>
              <Text style={styles.inlineButtonText}>Learn more</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.supportCard}>
          <Text style={styles.cardTitle}>{t('contact_payments_support')}</Text>
          <Text style={styles.cardSubtitle}>
            Chat with support to resolve charges or refund delays.
          </Text>
          <Pressable style={styles.supportButton} onPress={() => setShowSupport(true)}>
            <Text style={styles.supportButtonText}>{t('contact_payments_support')}</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Modal visible={showAddMoney} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add money to wallet</Text>
              <Pressable onPress={() => setShowAddMoney(false)}>
                <MaterialIcons name="close" size={22} color={palette.text} />
              </Pressable>
            </View>
            <View style={styles.modalContent}>
              <View style={styles.amountRow}>
                {[200, 500, 1000, 2000].map((amt) => (
                  <Pressable key={amt} style={styles.amountChip}>
                    <Text style={styles.amountChipText}>Rs {amt}</Text>
                  </Pressable>
                ))}
              </View>
              <Text style={styles.modalSubtitle}>
                Funds will be available instantly after payment.
              </Text>
            </View>
            <View style={styles.modalFooter}>
              <Pressable style={styles.modalPrimary} onPress={() => setShowAddMoney(false)}>
                <Text style={styles.modalPrimaryText}>Proceed to pay</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showAddMethod} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add a payment method</Text>
              <Pressable onPress={() => setShowAddMethod(false)}>
                <MaterialIcons name="close" size={22} color={palette.text} />
              </Pressable>
            </View>
            <View style={styles.modalContent}>
              {[
                { icon: 'credit-card', label: 'Debit/Credit card' },
                { icon: 'qr-code', label: 'Add UPI ID' },
                { icon: 'account-balance', label: 'Net banking' },
              ].map((item) => (
                <Pressable key={item.label} style={styles.optionRow}>
                  <View style={styles.optionIcon}>
                    <MaterialIcons
                      name={item.icon as keyof typeof MaterialIcons.glyphMap}
                      size={18}
                      color={palette.primary}
                    />
                  </View>
                  <Text style={styles.optionText}>{item.label}</Text>
                  <MaterialIcons name="chevron-right" size={18} color={palette.mutedAlt} />
                </Pressable>
              ))}
            </View>
            <View style={styles.modalFooter}>
              <Pressable style={styles.modalPrimary} onPress={() => setShowAddMethod(false)}>
                <Text style={styles.modalPrimaryText}>Done</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showChangeRefund} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change refund method</Text>
              <Pressable onPress={() => setShowChangeRefund(false)}>
                <MaterialIcons name="close" size={22} color={palette.text} />
              </Pressable>
            </View>
            <View style={styles.modalContent}>
              {paymentMethods.map((method) => (
                <Pressable key={method.id} style={styles.optionRow}>
                  <Text style={styles.optionText}>
                    {method.label} · {method.detail}
                  </Text>
                  <MaterialIcons name="chevron-right" size={18} color={palette.mutedAlt} />
                </Pressable>
              ))}
            </View>
            <View style={styles.modalFooter}>
              <Pressable style={styles.modalPrimary} onPress={() => setShowChangeRefund(false)}>
                <Text style={styles.modalPrimaryText}>Save preference</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showLearnMore} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Settlement timeline</Text>
              <Pressable onPress={() => setShowLearnMore(false)}>
                <MaterialIcons name="close" size={22} color={palette.text} />
              </Pressable>
            </View>
            <View style={styles.modalContent}>
              <Text style={styles.modalSubtitle}>
                Refunds usually settle in 2-4 business days depending on your bank or UPI
                provider.
              </Text>
              <View style={styles.timelineRow}>
                <View style={styles.timelineDot} />
                <Text style={styles.timelineText}>Day 0: Refund initiated</Text>
              </View>
              <View style={styles.timelineRow}>
                <View style={styles.timelineDot} />
                <Text style={styles.timelineText}>Day 1-2: Bank processing</Text>
              </View>
              <View style={styles.timelineRow}>
                <View style={styles.timelineDot} />
                <Text style={styles.timelineText}>Day 3-4: Amount credited</Text>
              </View>
            </View>
            <View style={styles.modalFooter}>
              <Pressable style={styles.modalPrimary} onPress={() => setShowLearnMore(false)}>
                <Text style={styles.modalPrimaryText}>Got it</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={!!showRefundDetails} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Refund details</Text>
              <Pressable onPress={() => setShowRefundDetails(null)}>
                <MaterialIcons name="close" size={22} color={palette.text} />
              </Pressable>
            </View>
            <View style={styles.modalContent}>
              <Text style={styles.refundTitle}>
                {showRefundDetails ? formatPrice(showRefundDetails.amount) : ''}
              </Text>
              <Text style={styles.refundMeta}>
                Order #{showRefundDetails?.orderId}
              </Text>
              <Text style={styles.refundMeta}>{showRefundDetails?.eta}</Text>
              <View style={styles.refundStatusPill}>
                <Text style={styles.refundStatusText}>
                  {showRefundDetails?.status === 'completed' ? 'Credited' : 'Processing'}
                </Text>
              </View>
            </View>
            <View style={styles.modalFooter}>
              <Pressable style={styles.modalPrimary} onPress={() => setShowRefundDetails(null)}>
                <Text style={styles.modalPrimaryText}>Done</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showSupport} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Payments support</Text>
              <Pressable onPress={() => setShowSupport(false)}>
                <MaterialIcons name="close" size={22} color={palette.text} />
              </Pressable>
            </View>
            <View style={styles.modalContent}>
              <View style={styles.optionList}>
                <Pressable style={styles.optionRow}>
                  <Text style={styles.optionText}>Chat with a specialist</Text>
                  <MaterialIcons name="chevron-right" size={18} color={palette.mutedAlt} />
                </Pressable>
                <Pressable style={styles.optionRow}>
                  <Text style={styles.optionText}>Request a callback</Text>
                  <MaterialIcons name="chevron-right" size={18} color={palette.mutedAlt} />
                </Pressable>
                <Pressable style={styles.optionRow}>
                  <Text style={styles.optionText}>Email payments team</Text>
                  <MaterialIcons name="chevron-right" size={18} color={palette.mutedAlt} />
                </Pressable>
              </View>
            </View>
            <View style={styles.modalFooter}>
              <Pressable style={styles.modalPrimary} onPress={() => setShowSupport(false)}>
                <Text style={styles.modalPrimaryText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (palette: ThemePalette) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: palette.background,
    },
    page: {
      padding: 18,
      gap: 16,
      paddingBottom: 120,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    backButton: {
      width: 38,
      height: 38,
      borderRadius: 14,
      backgroundColor: palette.cardAlt,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerText: {
      flex: 1,
      gap: 2,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: palette.text,
    },
    subtitle: {
      fontSize: 12,
      color: palette.muted,
    },
    balanceCard: {
      backgroundColor: palette.primary,
      borderRadius: 20,
      padding: 18,
      gap: 8,
    },
    balanceHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    balanceTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: '#fff',
    },
    balanceButton: {
      backgroundColor: 'rgba(255,255,255,0.18)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 14,
    },
    balanceButtonText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '600',
    },
    balanceAmount: {
      fontSize: 28,
      fontWeight: '700',
      color: '#fff',
    },
    balanceHint: {
      fontSize: 12,
      color: 'rgba(255,255,255,0.75)',
    },
    card: {
      backgroundColor: palette.card,
      borderRadius: 20,
      padding: 16,
      borderWidth: 1,
      borderColor: palette.border,
      gap: 12,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cardTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: palette.text,
    },
    cardSubtitle: {
      fontSize: 12,
      color: palette.muted,
    },
    inlineButton: {
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    inlineButtonText: {
      fontSize: 12,
      fontWeight: '600',
      color: palette.primary,
    },
    methodRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: palette.border,
      backgroundColor: palette.cardAlt,
    },
    methodRowActive: {
      borderColor: palette.primary,
      backgroundColor: palette.primarySoft,
    },
    methodIcon: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: palette.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    methodInfo: {
      flex: 1,
      gap: 2,
    },
    methodLabel: {
      fontSize: 13,
      fontWeight: '700',
      color: palette.text,
    },
    methodDetail: {
      fontSize: 11,
      color: palette.muted,
    },
    primaryBadge: {
      fontSize: 10,
      fontWeight: '700',
      color: palette.primary,
      backgroundColor: palette.primarySoft,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    refundRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: palette.border,
      backgroundColor: palette.cardAlt,
    },
    refundIcon: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: palette.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    refundInfo: {
      flex: 1,
      gap: 2,
    },
    refundTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: palette.text,
    },
    refundMeta: {
      fontSize: 11,
      color: palette.muted,
    },
    refundStatus: {
      fontSize: 11,
      fontWeight: '600',
      color: palette.text,
    },
    preferenceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    preferenceLabel: {
      fontSize: 12,
      color: palette.muted,
    },
    preferenceValue: {
      fontSize: 12,
      fontWeight: '600',
      color: palette.text,
      marginTop: 2,
    },
    supportCard: {
      backgroundColor: palette.card,
      borderRadius: 20,
      padding: 16,
      borderWidth: 1,
      borderColor: palette.border,
      gap: 10,
    },
    supportButton: {
      backgroundColor: palette.primarySoft,
      borderRadius: 16,
      paddingVertical: 10,
      alignItems: 'center',
    },
    supportButtonText: {
      color: palette.primary,
      fontWeight: '600',
      fontSize: 12,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(15, 18, 16, 0.45)',
      justifyContent: 'center',
      padding: 16,
    },
    modalCard: {
      backgroundColor: palette.background,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: palette.border,
      overflow: 'hidden',
      maxHeight: '85%',
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: palette.cardAlt,
    },
    modalTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: palette.text,
    },
    modalContent: {
      padding: 16,
      gap: 12,
    },
    modalSubtitle: {
      fontSize: 12,
      color: palette.muted,
    },
    modalFooter: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: palette.border,
      backgroundColor: palette.cardAlt,
    },
    modalPrimary: {
      backgroundColor: palette.primary,
      borderRadius: 18,
      paddingVertical: 12,
      alignItems: 'center',
    },
    modalPrimaryText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 13,
    },
    amountRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    amountChip: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: palette.border,
      backgroundColor: palette.card,
    },
    amountChipText: {
      fontSize: 12,
      fontWeight: '600',
      color: palette.text,
    },
    optionList: {
      gap: 10,
    },
    optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: palette.border,
      backgroundColor: palette.cardAlt,
      justifyContent: 'space-between',
    },
    optionIcon: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: palette.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    optionText: {
      flex: 1,
      fontSize: 12,
      fontWeight: '600',
      color: palette.text,
    },
    timelineRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    timelineDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: palette.primary,
    },
    timelineText: {
      fontSize: 12,
      color: palette.text,
    },
    refundStatusPill: {
      alignSelf: 'flex-start',
      backgroundColor: palette.primarySoft,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    refundStatusText: {
      fontSize: 11,
      fontWeight: '600',
      color: palette.primary,
    },
  });

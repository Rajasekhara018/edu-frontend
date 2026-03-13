import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { ThemePalette } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';

type OrderItem = {
  id: string;
  productId: number;
  title: string;
  subtitle: string;
  image: string;
  qty: number;
  price: number;
};

type OrderDetails = {
  id: string;
  placedOn: string;
  status: 'delivered' | 'not_shipped';
  total: number;
  paymentMethod: string;
  deliveryEta: string;
  address: {
    name: string;
    phone: string;
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: OrderItem[];
};

const orders: OrderDetails[] = [
  {
    id: '406-5005711-8667540',
    placedOn: '14 January 2026',
    status: 'delivered',
    total: 49,
    paymentMethod: 'UPI •••• 3321',
    deliveryEta: 'Delivered on 15 January 2026',
    address: {
      name: 'Sai Durga Reddy',
      phone: '+91 98765 43210',
      line1: 'Flat 301, Lotus Residency',
      line2: 'Banjara Hills, Road No. 12',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500034',
    },
    items: [
      {
        id: 'itm-1',
        productId: 2,
        title: 'Mobile prepaid recharge',
        subtitle: '6302218163 - Jio, Andhra Pradesh & Telangana',
        image: 'https://i.imgur.com/0y8Ftya.png',
        qty: 1,
        price: 49,
      },
    ],
  },
  {
    id: '406-4604689-1865921',
    placedOn: '9 January 2026',
    status: 'delivered',
    total: 442,
    paymentMethod: 'Credit Card •••• 1189',
    deliveryEta: 'Delivered on 10 January 2026',
    address: {
      name: 'Sai Durga Reddy',
      phone: '+91 98765 43210',
      line1: 'Flat 301, Lotus Residency',
      line2: 'Banjara Hills, Road No. 12',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500034',
    },
    items: [
      {
        id: 'itm-2',
        productId: 11,
        title: 'Electricity bill payment',
        subtitle: 'APCPDCL, Andhra Pradesh',
        image: 'https://i.imgur.com/6o5G1mF.png',
        qty: 1,
        price: 442,
      },
    ],
  },
  {
    id: '406-7749123-1098871',
    placedOn: '3 January 2026',
    status: 'not_shipped',
    total: 319,
    paymentMethod: 'Wallet balance',
    deliveryEta: 'Estimated delivery by 7 January 2026',
    address: {
      name: 'Sai Durga Reddy',
      phone: '+91 98765 43210',
      line1: 'Flat 301, Lotus Residency',
      line2: 'Banjara Hills, Road No. 12',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500034',
    },
    items: [
      {
        id: 'itm-3',
        productId: 1,
        title: 'Premium grocery bundle',
        subtitle: 'Essentials pack, 8 items',
        image: 'https://i.imgur.com/0y8Ftya.png',
        qty: 1,
        price: 319,
      },
    ],
  },
];

const formatPrice = (value: number) => `Rs ${value.toFixed(0)}`;

export default function OrderDetailsScreen() {
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const router = useRouter();
  const { t } = useTranslation();
  const { addItem } = useCart();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const order = orders.find((item) => item.id === id) ?? orders[0];
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);
  const [returnReason, setReturnReason] = useState('Damaged item');
  const [returnNote, setReturnNote] = useState('');
  const [actionNote, setActionNote] = useState('');

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={20} color={palette.text} />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.title}>{t('order_details_title')}</Text>
            <Text style={styles.subtitle}>Order # {order.id}</Text>
          </View>
          <Pressable style={styles.helpButton}>
            <Text style={styles.helpButtonText}>Help</Text>
          </Pressable>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>
              {order.status === 'delivered'
                ? t('order_status_delivered')
                : t('order_status_not_shipped')}
            </Text>
            <Text style={styles.statusMeta}>{order.deliveryEta}</Text>
          </View>
          <View style={styles.timeline}>
            {[
              { label: 'Order placed', active: true },
              { label: 'Packed', active: order.status === 'delivered' },
              { label: 'Out for delivery', active: order.status === 'delivered' },
              { label: 'Delivered', active: order.status === 'delivered' },
            ].map((step, index, array) => (
              <View key={step.label} style={styles.timelineItem}>
                <View
                  style={[styles.timelineDot, step.active && styles.timelineDotActive]}
                />
                <Text style={styles.timelineLabel}>{step.label}</Text>
                {index < array.length - 1 ? (
                  <View style={styles.timelineDivider} />
                ) : null}
              </View>
            ))}
          </View>
          <View style={styles.statusActions}>
            <Pressable style={styles.primaryAction}>
              <Text style={styles.primaryActionText}>{t('order_track')}</Text>
            </Pressable>
            <Pressable style={styles.secondaryAction} onPress={() => setInvoiceOpen(true)}>
              <Text style={styles.secondaryActionText}>{t('order_invoice')}</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.grid}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t('order_summary')}</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Order placed</Text>
              <Text style={styles.summaryValue}>{order.placedOn}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={styles.summaryValue}>{formatPrice(order.total)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('order_payment')}</Text>
              <Text style={styles.summaryValue}>{order.paymentMethod}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t('order_address')}</Text>
            <Text style={styles.addressName}>{order.address.name}</Text>
            <Text style={styles.addressText}>{order.address.phone}</Text>
            <Text style={styles.addressText}>{order.address.line1}</Text>
            <Text style={styles.addressText}>{order.address.line2}</Text>
            <Text style={styles.addressText}>
              {order.address.city}, {order.address.state} {order.address.pincode}
            </Text>
            <Pressable
              style={styles.inlineButton}
              onPress={() => router.push('/(tabs)/add-address')}>
              <Text style={styles.inlineButtonText}>{t('order_change_address')}</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.itemsCard}>
          <View style={styles.itemsHeader}>
            <Text style={styles.cardTitle}>{t('order_items')}</Text>
            <Text style={styles.itemsCount}>{order.items.length} item(s)</Text>
          </View>
          {order.items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                <Text style={styles.itemMeta}>{t('cart_qty')} {item.qty}</Text>
              </View>
              <View style={styles.itemPriceBlock}>
                <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
                <Pressable
                  style={styles.itemAction}
                  onPress={() => {
                    const product = products.find((p) => p.id === item.productId);
                    if (product) {
                      addItem(product, item.qty);
                      setActionNote('Added to cart. Open cart to review.');
                    } else {
                      setActionNote('Item not found in catalog.');
                    }
                  }}>
                  <Text style={styles.itemActionText}>{t('order_buy_again')}</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.supportCard}>
          <Text style={styles.cardTitle}>{t('order_help_title')}</Text>
          <Text style={styles.supportText}>{t('order_help_subtitle')}</Text>
          <View style={styles.supportActions}>
            <Pressable style={styles.supportButton} onPress={() => setReturnOpen(true)}>
              <Text style={styles.supportButtonText}>{t('order_return_item')}</Text>
            </Pressable>
            <Pressable style={styles.supportButtonSecondary}>
              <Text style={styles.supportButtonSecondaryText}>{t('order_contact_support')}</Text>
            </Pressable>
          </View>
          {actionNote ? <Text style={styles.actionNote}>{actionNote}</Text> : null}
        </View>
      </ScrollView>

      <Modal visible={invoiceOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Invoice</Text>
              <Pressable onPress={() => setInvoiceOpen(false)}>
                <MaterialIcons name="close" size={22} color={palette.text} />
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <View style={styles.invoiceCard}>
                <Text style={styles.invoiceTitle}>GrocerEase Tax Invoice</Text>
                <Text style={styles.invoiceMeta}>Invoice #: INV-{order.id}</Text>
                <Text style={styles.invoiceMeta}>Order date: {order.placedOn}</Text>
              </View>

              <View style={styles.invoiceSection}>
                <Text style={styles.cardTitle}>Billed to</Text>
                <Text style={styles.addressName}>{order.address.name}</Text>
                <Text style={styles.addressText}>{order.address.phone}</Text>
                <Text style={styles.addressText}>{order.address.line1}</Text>
                <Text style={styles.addressText}>{order.address.line2}</Text>
                <Text style={styles.addressText}>
                  {order.address.city}, {order.address.state} {order.address.pincode}
                </Text>
              </View>

              <View style={styles.invoiceSection}>
                <Text style={styles.cardTitle}>Charges</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Items total</Text>
                  <Text style={styles.summaryValue}>{formatPrice(order.total - 12)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Delivery</Text>
                  <Text style={styles.summaryValue}>Rs 0</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Taxes & fees</Text>
                  <Text style={styles.summaryValue}>Rs 12</Text>
                </View>
                <View style={styles.invoiceDivider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryTotal}>Grand total</Text>
                  <Text style={styles.summaryTotal}>{formatPrice(order.total)}</Text>
                </View>
              </View>
            </ScrollView>
            <View style={styles.modalFooter}>
              <Pressable style={styles.modalPrimary}>
                <Text style={styles.modalPrimaryText}>Download invoice</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={returnOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Return item</Text>
              <Pressable onPress={() => setReturnOpen(false)}>
                <MaterialIcons name="close" size={22} color={palette.text} />
              </Pressable>
            </View>
            <View style={styles.modalContent}>
              <Text style={styles.modalSubtitle}>Select a reason</Text>
              {['Damaged item', 'Wrong item delivered', 'Quality issue', 'Other'].map((reason) => {
                const active = returnReason === reason;
                return (
                  <Pressable
                    key={reason}
                    style={[styles.reasonRow, active && styles.reasonRowActive]}
                    onPress={() => setReturnReason(reason)}>
                    <View style={[styles.radio, active && styles.radioActive]}>
                      {active ? <View style={styles.radioDot} /> : null}
                    </View>
                    <Text style={styles.reasonText}>{reason}</Text>
                  </Pressable>
                );
              })}
              <Text style={styles.modalSubtitle}>Add note (optional)</Text>
              <TextInput
                value={returnNote}
                onChangeText={setReturnNote}
                placeholder="Share more details"
                placeholderTextColor={palette.mutedAlt}
                style={styles.noteInput}
                multiline
              />
            </View>
            <View style={styles.modalFooter}>
              <Pressable
                style={styles.modalPrimary}
                onPress={() => {
                  setReturnOpen(false);
                  setActionNote('Return request submitted. Support will reach out.');
                }}>
                <Text style={styles.modalPrimaryText}>Submit return request</Text>
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
    helpButton: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: palette.border,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    helpButtonText: {
      fontSize: 12,
      fontWeight: '600',
      color: palette.text,
    },
    statusCard: {
      backgroundColor: palette.card,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: palette.border,
      padding: 16,
      gap: 14,
    },
    statusHeader: {
      gap: 4,
    },
    statusTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: palette.text,
    },
    statusMeta: {
      fontSize: 12,
      color: palette.muted,
    },
    timeline: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
    },
    timelineItem: {
      flex: 1,
      alignItems: 'center',
      gap: 6,
    },
    timelineDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: palette.border,
    },
    timelineDotActive: {
      backgroundColor: palette.primary,
    },
    timelineLabel: {
      fontSize: 10,
      color: palette.muted,
      textAlign: 'center',
    },
    timelineDivider: {
      height: 2,
      width: '100%',
      backgroundColor: palette.border,
    },
    statusActions: {
      flexDirection: 'row',
      gap: 10,
    },
    primaryAction: {
      flex: 1,
      backgroundColor: palette.primary,
      borderRadius: 16,
      paddingVertical: 10,
      alignItems: 'center',
    },
    primaryActionText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 12,
    },
    secondaryAction: {
      flex: 1,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: palette.border,
      paddingVertical: 10,
      alignItems: 'center',
    },
    secondaryActionText: {
      color: palette.text,
      fontWeight: '600',
      fontSize: 12,
    },
    grid: {
      gap: 16,
    },
    card: {
      backgroundColor: palette.card,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: palette.border,
      padding: 16,
      gap: 8,
    },
    cardTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: palette.text,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    summaryLabel: {
      fontSize: 12,
      color: palette.muted,
    },
    summaryValue: {
      fontSize: 12,
      fontWeight: '600',
      color: palette.text,
    },
    addressName: {
      fontSize: 13,
      fontWeight: '700',
      color: palette.text,
    },
    addressText: {
      fontSize: 12,
      color: palette.muted,
    },
    inlineButton: {
      marginTop: 6,
      alignSelf: 'flex-start',
    },
    inlineButtonText: {
      fontSize: 12,
      color: palette.primary,
      fontWeight: '600',
    },
    itemsCard: {
      backgroundColor: palette.card,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: palette.border,
      padding: 16,
      gap: 12,
    },
    itemsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    itemsCount: {
      fontSize: 12,
      color: palette.muted,
    },
    itemRow: {
      flexDirection: 'row',
      gap: 12,
      paddingVertical: 10,
      borderTopWidth: 1,
      borderTopColor: palette.border,
    },
    itemImage: {
      width: 64,
      height: 64,
      borderRadius: 16,
      backgroundColor: palette.cardAlt,
    },
    itemInfo: {
      flex: 1,
      gap: 4,
    },
    itemTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: palette.text,
    },
    itemSubtitle: {
      fontSize: 11,
      color: palette.muted,
    },
    itemMeta: {
      fontSize: 11,
      color: palette.mutedAlt,
    },
    itemPriceBlock: {
      alignItems: 'flex-end',
      gap: 8,
    },
    itemPrice: {
      fontSize: 13,
      fontWeight: '700',
      color: palette.text,
    },
    itemAction: {
      borderRadius: 14,
      borderWidth: 1,
      borderColor: palette.border,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    itemActionText: {
      fontSize: 11,
      fontWeight: '600',
      color: palette.text,
    },
    supportCard: {
      backgroundColor: palette.card,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: palette.border,
      padding: 16,
      gap: 10,
    },
    supportText: {
      fontSize: 12,
      color: palette.muted,
    },
    supportActions: {
      flexDirection: 'row',
      gap: 10,
    },
    supportButton: {
      flex: 1,
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
    supportButtonSecondary: {
      flex: 1,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: palette.border,
      paddingVertical: 10,
      alignItems: 'center',
    },
    supportButtonSecondaryText: {
      color: palette.text,
      fontWeight: '600',
      fontSize: 12,
    },
    actionNote: {
      fontSize: 11,
      color: palette.muted,
      marginTop: 8,
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
      fontWeight: '600',
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
    invoiceCard: {
      backgroundColor: palette.card,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: palette.border,
      padding: 16,
      gap: 6,
    },
    invoiceTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: palette.text,
    },
    invoiceMeta: {
      fontSize: 12,
      color: palette.muted,
    },
    invoiceSection: {
      backgroundColor: palette.card,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: palette.border,
      padding: 16,
      gap: 8,
    },
    invoiceDivider: {
      height: 1,
      backgroundColor: palette.border,
      marginVertical: 8,
    },
    summaryTotal: {
      fontSize: 13,
      fontWeight: '700',
      color: palette.text,
    },
    reasonRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: palette.border,
      backgroundColor: palette.card,
    },
    reasonRowActive: {
      borderColor: palette.primary,
      backgroundColor: palette.primarySoft,
    },
    radio: {
      width: 18,
      height: 18,
      borderRadius: 9,
      borderWidth: 1,
      borderColor: palette.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioActive: {
      borderColor: palette.primary,
    },
    radioDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: palette.primary,
    },
    reasonText: {
      fontSize: 13,
      fontWeight: '600',
      color: palette.text,
    },
    noteInput: {
      minHeight: 80,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: palette.border,
      padding: 12,
      fontSize: 13,
      color: palette.text,
      backgroundColor: palette.card,
      textAlignVertical: 'top',
    },
  });

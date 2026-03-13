import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { ThemePalette } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

type OrderStatus = 'delivered' | 'not_shipped';

type OrderItem = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  actionLabel: string;
};

type Order = {
  id: string;
  placedOn: string;
  total: number;
  item: OrderItem;
  status: OrderStatus;
};

type BuyAgainItem = {
  id: string;
  title: string;
  price: number;
  mrp: number;
  savings: number;
  image: string;
  deliveryNote: string;
  purchasedOn: string;
};

const orders: Order[] = [
  {
    id: '406-5005711-8667540',
    placedOn: '14 January 2026',
    total: 49,
    status: 'delivered',
    item: {
      id: 'ord-1',
      title: 'Mobile prepaid recharge',
      subtitle: '6302218163 - Jio, Andhra Pradesh & Telangana',
      image: 'https://i.imgur.com/0y8Ftya.png',
      actionLabel: 'Recharge again',
    },
  },
  {
    id: '406-4604689-1865921',
    placedOn: '9 January 2026',
    total: 442,
    status: 'delivered',
    item: {
      id: 'ord-2',
      title: 'Electricity bill payment',
      subtitle: 'APCPDCL, Andhra Pradesh',
      image: 'https://i.imgur.com/6o5G1mF.png',
      actionLabel: 'Pay bill again',
    },
  },
  {
    id: '406-7749123-1098871',
    placedOn: '3 January 2026',
    total: 319,
    status: 'not_shipped',
    item: {
      id: 'ord-3',
      title: 'Premium grocery bundle',
      subtitle: 'Essentials pack, 8 items',
      image: 'https://i.imgur.com/0y8Ftya.png',
      actionLabel: 'Track shipment',
    },
  },
];

const buyAgainItems: BuyAgainItem[] = [
  {
    id: 'buy-1',
    title: 'Bajaj iLED 8.5W',
    price: 199,
    mrp: 685,
    savings: 71,
    image: 'https://i.imgur.com/8D3h6bB.png',
    deliveryNote: 'Get it by Saturday, January 31',
    purchasedOn: 'Purchased Oct 2025',
  },
  {
    id: 'buy-2',
    title: 'Temperia Leg & Foot',
    price: 159,
    mrp: 199,
    savings: 20,
    image: 'https://i.imgur.com/gvQZbPp.png',
    deliveryNote: 'Get it by Tuesday, February 3',
    purchasedOn: 'Purchased Jun 2025',
  },
];

const formatPrice = (value: number) => `Rs ${value.toFixed(0)}`;

export default function OrdersScreen() {
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const router = useRouter();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const isWide = width >= 900;
  const [activeTab, setActiveTab] = useState<'orders' | 'buy_again' | 'not_shipped'>(
    'orders'
  );
  const [query, setQuery] = useState('');

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'not_shipped' && order.status !== 'not_shipped') {
      return false;
    }
    if (activeTab === 'buy_again') {
      return false;
    }
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      order.item.title.toLowerCase().includes(q) ||
      order.item.subtitle.toLowerCase().includes(q) ||
      order.id.toLowerCase().includes(q)
    );
  });

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.breadcrumbRow}>
          <Pressable onPress={() => router.push('/(tabs)/account')}>
            <Text style={styles.breadcrumbMuted}>Your Account</Text>
          </Pressable>
          <Text style={styles.breadcrumbArrow}>{'>'}</Text>
          <Text style={styles.breadcrumbActive}>{t('orders_title')}</Text>
        </View>

        <View style={styles.headerRow}>
          <Text style={styles.pageTitle}>{t('orders_title')}</Text>
          <View style={styles.searchRow}>
            <View style={styles.searchInputWrapper}>
              <MaterialIcons name="search" size={18} color={palette.mutedAlt} />
              <TextInput
                placeholder={t('orders_search')}
                placeholderTextColor={palette.mutedAlt}
                value={query}
                onChangeText={setQuery}
                style={styles.searchInput}
              />
            </View>
            <Pressable style={styles.searchButton}>
              <Text style={styles.searchButtonText}>{t('orders_search')}</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.tabRow}>
          {[
            { key: 'orders', label: t('orders_tab_orders') },
            { key: 'buy_again', label: t('orders_tab_buy_again') },
            { key: 'not_shipped', label: t('orders_tab_not_shipped') },
          ].map((tab) => {
            const active = activeTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                style={[styles.tabButton, active && styles.tabButtonActive]}
                onPress={() => setActiveTab(tab.key as typeof activeTab)}>
                <Text style={[styles.tabText, active && styles.tabTextActive]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>{t('orders_filter_prefix')}</Text>
          <Pressable style={styles.filterSelect}>
            <Text style={styles.filterSelectText}>{t('orders_filter_range')}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={18} color={palette.text} />
          </Pressable>
        </View>

        <View style={styles.contentRow}>
          <View style={[styles.orderColumn, isWide && styles.orderColumnWide]}>
            {activeTab === 'buy_again' ? (
              <BuyAgainInline
                items={buyAgainItems}
                palette={palette}
                isWide={isWide}
              />
            ) : (
              <FlatList
                data={filteredOrders}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                contentContainerStyle={styles.orderList}
                renderItem={({ item }) => (
                  <View style={styles.orderCard}>
                    <View style={styles.orderMetaRow}>
                      <View style={styles.orderMetaBlock}>
                        <Text style={styles.metaLabel}>ORDER PLACED</Text>
                        <Text style={styles.metaValue}>{item.placedOn}</Text>
                      </View>
                      <View style={styles.orderMetaBlock}>
                        <Text style={styles.metaLabel}>TOTAL</Text>
                        <Text style={styles.metaValue}>{formatPrice(item.total)}</Text>
                      </View>
                      <View style={styles.orderMetaRight}>
                        <Text style={styles.metaLabel}>ORDER # {item.id}</Text>
                        <Pressable onPress={() => router.push(`/(tabs)/order-details?id=${item.id}`)}>
                          <Text style={styles.metaLink}>{t('orders_view_details')}</Text>
                        </Pressable>
                      </View>
                    </View>

                    <View style={styles.orderBody}>
                      <Image source={{ uri: item.item.image }} style={styles.orderLogo} />
                      <View style={styles.orderInfo}>
                        <Text style={styles.orderTitle}>{item.item.title}</Text>
                        <Text style={styles.orderSubtitle}>{item.item.subtitle}</Text>
                      </View>
                      <Pressable style={styles.orderAction}>
                        <Text style={styles.orderActionText}>{item.item.actionLabel}</Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              />
            )}
          </View>

          {isWide ? (
            <View style={styles.buyAgainColumn}>
              <Text style={styles.buyAgainTitle}>Buy it again</Text>
              {buyAgainItems.map((item) => (
                <View key={item.id} style={styles.buyAgainCard}>
                  <Image source={{ uri: item.image }} style={styles.buyAgainImage} />
                  <View style={styles.buyAgainInfo}>
                    <Text style={styles.buyAgainName}>{item.title}</Text>
                    <View style={styles.buyAgainPriceRow}>
                      <Text style={styles.buyAgainPrice}>{formatPrice(item.price)}</Text>
                      <Text style={styles.buyAgainSavings}>-{item.savings}%</Text>
                    </View>
                    <Text style={styles.buyAgainMrp}>M.R.P.: {formatPrice(item.mrp)}</Text>
                    <Text style={styles.buyAgainDelivery}>{item.deliveryNote}</Text>
                    <Text style={styles.buyAgainPurchased}>{item.purchasedOn}</Text>
                    <Pressable style={styles.buyAgainButton}>
                      <Text style={styles.buyAgainButtonText}>Add to cart</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function BuyAgainInline({
  items,
  palette,
  isWide,
}: {
  items: BuyAgainItem[];
  palette: ThemePalette;
  isWide: boolean;
}) {
  const styles = useMemo(() => createStyles(palette), [palette]);

  if (isWide) return null;

  return (
    <View style={styles.buyAgainInline}>
      <Text style={styles.buyAgainTitle}>Buy it again</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {items.map((item) => (
          <View key={item.id} style={styles.buyAgainInlineCard}>
            <Image source={{ uri: item.image }} style={styles.buyAgainInlineImage} />
            <Text style={styles.buyAgainName}>{item.title}</Text>
            <View style={styles.buyAgainPriceRow}>
              <Text style={styles.buyAgainPrice}>{formatPrice(item.price)}</Text>
              <Text style={styles.buyAgainSavings}>-{item.savings}%</Text>
            </View>
            <Text style={styles.buyAgainMrp}>M.R.P.: {formatPrice(item.mrp)}</Text>
            <Pressable style={styles.buyAgainButton}>
              <Text style={styles.buyAgainButtonText}>Add to cart</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
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
    breadcrumbRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    breadcrumbMuted: {
      color: palette.muted,
      fontSize: 12,
    },
    breadcrumbArrow: {
      color: palette.mutedAlt,
      fontSize: 12,
    },
    breadcrumbActive: {
      color: palette.primary,
      fontSize: 12,
      fontWeight: '600',
    },
    headerRow: {
      gap: 12,
    },
    pageTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: palette.text,
    },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    searchInputWrapper: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.card,
      borderRadius: 18,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: palette.border,
      gap: 8,
    },
    searchInput: {
      flex: 1,
      color: palette.text,
      fontSize: 14,
    },
    searchButton: {
      backgroundColor: palette.text,
      borderRadius: 18,
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    searchButtonText: {
      color: palette.background,
      fontWeight: '600',
      fontSize: 13,
    },
    tabRow: {
      flexDirection: 'row',
      gap: 10,
    },
    tabButton: {
      paddingBottom: 6,
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    tabButtonActive: {
      borderBottomColor: palette.primary,
    },
    tabText: {
      color: palette.muted,
      fontWeight: '600',
      fontSize: 13,
    },
    tabTextActive: {
      color: palette.text,
    },
    filterRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    filterLabel: {
      color: palette.text,
      fontSize: 13,
      fontWeight: '600',
    },
    filterSelect: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: palette.border,
      paddingHorizontal: 10,
      paddingVertical: 6,
      gap: 4,
      backgroundColor: palette.card,
    },
    filterSelectText: {
      color: palette.text,
      fontSize: 12,
      fontWeight: '600',
    },
    contentRow: {
      gap: 16,
    },
    orderColumn: {
      flex: 1,
      gap: 12,
    },
    orderColumnWide: {
      flex: 3,
    },
    orderList: {
      gap: 16,
    },
    orderCard: {
      backgroundColor: palette.card,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: palette.border,
      overflow: 'hidden',
    },
    orderMetaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: palette.cardAlt,
      paddingVertical: 10,
      paddingHorizontal: 12,
      flexWrap: 'wrap',
      gap: 12,
    },
    orderMetaBlock: {
      minWidth: 120,
      gap: 2,
    },
    orderMetaRight: {
      marginLeft: 'auto',
      alignItems: 'flex-end',
      gap: 2,
    },
    metaLabel: {
      fontSize: 10,
      color: palette.muted,
      fontWeight: '700',
      letterSpacing: 0.6,
    },
    metaValue: {
      fontSize: 12,
      color: palette.text,
      fontWeight: '600',
    },
    metaLink: {
      color: palette.primary,
      fontSize: 12,
      fontWeight: '600',
    },
    orderBody: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
      gap: 12,
    },
    orderLogo: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: palette.cardAlt,
    },
    orderInfo: {
      flex: 1,
      gap: 2,
    },
    orderTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: palette.text,
    },
    orderSubtitle: {
      fontSize: 12,
      color: palette.muted,
    },
    orderAction: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: palette.border,
      paddingHorizontal: 14,
      paddingVertical: 8,
      backgroundColor: palette.background,
    },
    orderActionText: {
      color: palette.text,
      fontWeight: '600',
      fontSize: 12,
    },
    buyAgainColumn: {
      flex: 1,
      backgroundColor: palette.card,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: palette.border,
      padding: 14,
      gap: 12,
    },
    buyAgainTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: palette.text,
    },
    buyAgainCard: {
      flexDirection: 'row',
      gap: 12,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: palette.border,
    },
    buyAgainImage: {
      width: 72,
      height: 72,
      borderRadius: 14,
      backgroundColor: palette.cardAlt,
    },
    buyAgainInfo: {
      flex: 1,
      gap: 4,
    },
    buyAgainName: {
      fontSize: 13,
      fontWeight: '700',
      color: palette.text,
    },
    buyAgainPriceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    buyAgainPrice: {
      fontSize: 14,
      fontWeight: '700',
      color: palette.text,
    },
    buyAgainSavings: {
      fontSize: 12,
      color: palette.danger,
      fontWeight: '700',
    },
    buyAgainMrp: {
      fontSize: 11,
      color: palette.muted,
      textDecorationLine: 'line-through',
    },
    buyAgainDelivery: {
      fontSize: 11,
      color: palette.text,
      fontWeight: '600',
    },
    buyAgainPurchased: {
      fontSize: 11,
      color: palette.muted,
    },
    buyAgainButton: {
      marginTop: 6,
      backgroundColor: palette.primary,
      borderRadius: 16,
      paddingVertical: 8,
      alignItems: 'center',
    },
    buyAgainButtonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 12,
    },
    buyAgainInline: {
      gap: 12,
    },
    buyAgainInlineCard: {
      width: 190,
      marginRight: 12,
      backgroundColor: palette.card,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: palette.border,
      padding: 12,
      gap: 6,
    },
    buyAgainInlineImage: {
      width: '100%',
      height: 100,
      borderRadius: 12,
      backgroundColor: palette.cardAlt,
    },
  });

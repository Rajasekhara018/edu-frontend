import React, { useMemo } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { ThemePalette } from '@/constants/theme';

const formatPrice = (value: number) => `₹${value.toFixed(0)}`;

export default function CartScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { items, totalItems, totalPrice, updateQuantity, removeItem } = useCart();
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('cart_title')}</Text>
        <Text style={styles.subtitle}>{t('cart_items', { count: totalItems })}</Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="shopping-cart" size={40} color={palette.mutedAlt} />
          <Text style={styles.emptyTitle}>{t('cart_empty_title')}</Text>
          <Text style={styles.emptyText}>
            {t('cart_empty_subtitle')}
          </Text>
          <Pressable
            style={styles.primaryButton}
            onPress={() => router.push('/(tabs)')}>
            <Text style={styles.primaryButtonText}>{t('cart_start_shopping')}</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => `${item.product.id}`}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <Image
                source={{ uri: item.product.image }}
                style={styles.itemImage}
                contentFit="cover"
              />
              <View style={styles.itemInfo}>
                <Text numberOfLines={2} style={styles.itemName}>
                  {item.product.name}
                </Text>
                <Text style={styles.itemPrice}>
                  {formatPrice(item.product.price)}
                </Text>
                <View style={styles.qtyRow}>
                  <Pressable
                    style={styles.qtyButton}
                    onPress={() =>
                      updateQuantity(item.product.id, item.quantity - 1)
                    }>
                    <MaterialIcons name="remove" size={18} color={palette.primary} />
                  </Pressable>
                  <Text style={styles.qtyValue}>{item.quantity}</Text>
                  <Pressable
                    style={styles.qtyButton}
                    onPress={() =>
                      updateQuantity(item.product.id, item.quantity + 1)
                    }>
                    <MaterialIcons name="add" size={18} color={palette.primary} />
                  </Pressable>
                  <Pressable
                    style={styles.removeButton}
                    onPress={() => removeItem(item.product.id)}>
                    <MaterialIcons name="delete" size={16} color={palette.danger} />
                    <Text style={styles.removeText}>{t('cart_remove')}</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
          ListFooterComponent={
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t('cart_subtotal')}</Text>
                <Text style={styles.summaryValue}>
                  {formatPrice(totalPrice)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t('cart_delivery')}</Text>
                <Text style={styles.summaryValue}>Free</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryTotal}>{t('cart_total')}</Text>
                <Text style={styles.summaryTotal}>
                  {formatPrice(totalPrice)}
                </Text>
              </View>
              <Pressable style={styles.checkoutButton}>
                <Text style={styles.checkoutText}>{t('cart_checkout')}</Text>
              </Pressable>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const createStyles = (palette: ThemePalette) =>
  StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background,
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: palette.text,
  },
  subtitle: {
    fontSize: 12,
    color: palette.muted,
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: 18,
    paddingBottom: 120,
    gap: 16,
  },
  cartItem: {
    backgroundColor: palette.card,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: 'row',
    gap: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: palette.primary,
    marginTop: 6,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  qtyButton: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: palette.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
  },
  removeText: {
    color: palette.danger,
    fontWeight: '600',
    fontSize: 12,
  },
  summaryCard: {
    backgroundColor: palette.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.border,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: palette.muted,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.text,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: palette.border,
    marginVertical: 10,
  },
  summaryTotal: {
    fontSize: 15,
    fontWeight: '700',
    color: palette.text,
  },
  checkoutButton: {
    marginTop: 14,
    backgroundColor: palette.primary,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: palette.text,
  },
  emptyText: {
    fontSize: 13,
    color: palette.muted,
    textAlign: 'center',
  },
  primaryButton: {
    marginTop: 12,
    backgroundColor: palette.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 18,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

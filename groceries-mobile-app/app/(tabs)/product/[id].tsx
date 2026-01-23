import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { products } from '@/data/products';
import { ThemePalette } from '@/constants/theme';

const formatPrice = (value: number) => `â‚¹${value.toFixed(0)}`;

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { addItem, totalItems } = useCart();
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  const product = products.find((item) => item.id === Number(id));
  const suggestedProducts = products
    .filter((item) => item.id !== Number(id) && item.category === product?.category)
    .slice(0, 6);
  const fallbackSuggestions =
    suggestedProducts.length > 0
      ? suggestedProducts
      : products.filter((item) => item.id !== Number(id)).slice(0, 6);

  if (!product) {
    return (
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <View style={styles.missingState}>
          <Text style={styles.missingTitle}>Product not found</Text>
          <Pressable style={styles.primaryButton} onPress={() => router.back()}>
            <Text style={styles.primaryButtonText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable style={styles.iconButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={22} color={palette.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{t('product_details')}</Text>
        <Pressable
          style={styles.iconButton}
          onPress={() => router.push('/(tabs)/cart')}>
          <MaterialIcons name="shopping-cart" size={22} color={palette.primary} />
          {totalItems > 0 ? (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>
                {totalItems > 9 ? '9+' : totalItems}
              </Text>
            </View>
          ) : null}
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: product.image }} style={styles.productImage} contentFit="cover" />
        <View style={styles.infoCard}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productDesc}>{product.description}</Text>
          <View style={styles.ratingRow}>
            <MaterialIcons name="star" size={16} color={palette.warning} />
            <Text style={styles.ratingText}>{(product.rating ?? 0).toFixed(1)}</Text>
            <Text style={styles.reviewText}>({product.reviews ?? 0} reviews)</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceText}>{formatPrice(product.price)}</Text>
            {product.originalPrice ? (
              <Text style={styles.priceOld}>{formatPrice(product.originalPrice)}</Text>
            ) : null}
          </View>
          <Pressable style={styles.primaryButton} onPress={() => addItem(product, 1)}>
            <Text style={styles.primaryButtonText}>{t('product_add_to_cart')}</Text>
          </Pressable>
        </View>

        {product.specifications ? (
          <View style={styles.specCard}>
            <Text style={styles.specTitle}>Product details</Text>
            {Object.entries(product.specifications).map(([key, value]) => (
              <View key={key} style={styles.specRow}>
                <Text style={styles.specKey}>{key}</Text>
                <Text style={styles.specValue}>{value}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <View style={styles.suggestedSection}>
          <View style={styles.suggestedHeader}>
            <Text style={styles.suggestedTitle}>{t('product_suggested')}</Text>
            <Text style={styles.suggestedMeta}>{fallbackSuggestions.length} items</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestedRow}>
            {fallbackSuggestions.map((item) => (
              <Pressable
                key={item.id}
                style={styles.suggestedCard}
                onPress={() => router.push(`/(tabs)/product/${item.id}`)}>
                <Image source={{ uri: item.image }} style={styles.suggestedImage} contentFit="cover" />
                <View style={styles.suggestedInfo}>
                  <Text numberOfLines={2} style={styles.suggestedName}>
                    {item.name}
                  </Text>
                  <View style={styles.suggestedPriceRow}>
                    <Text style={styles.suggestedPrice}>{formatPrice(item.price)}</Text>
                    {item.originalPrice ? (
                      <Text style={styles.suggestedPriceOld}>
                        {formatPrice(item.originalPrice)}
                      </Text>
                    ) : null}
                  </View>
                  <View style={styles.suggestedRatingRow}>
                    <MaterialIcons name="star" size={12} color={palette.warning} />
                    <Text style={styles.suggestedRatingText}>
                      {(item.rating ?? 0).toFixed(1)}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
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
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: palette.text,
    },
    iconButton: {
      width: 38,
      height: 38,
      borderRadius: 14,
      backgroundColor: palette.cardAlt,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cartBadge: {
      position: 'absolute',
      top: -6,
      right: -6,
      backgroundColor: palette.badge,
      borderRadius: 12,
      paddingHorizontal: 5,
      paddingVertical: 2,
    },
    cartBadgeText: {
      color: palette.badgeText,
      fontSize: 10,
      fontWeight: '700',
    },
    content: {
      padding: 18,
      paddingBottom: 120,
      gap: 16,
    },
    productImage: {
      width: '100%',
      height: 240,
      borderRadius: 24,
    },
    infoCard: {
      backgroundColor: palette.card,
      borderRadius: 20,
      padding: 16,
      borderWidth: 1,
      borderColor: palette.border,
      gap: 10,
    },
    productName: {
      fontSize: 18,
      fontWeight: '700',
      color: palette.text,
    },
    productDesc: {
      fontSize: 13,
      color: palette.muted,
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    ratingText: {
      fontSize: 13,
      fontWeight: '600',
      color: palette.text,
    },
    reviewText: {
      fontSize: 12,
      color: palette.muted,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    priceText: {
      fontSize: 20,
      fontWeight: '700',
      color: palette.primary,
    },
    priceOld: {
      fontSize: 13,
      color: palette.mutedAlt,
      textDecorationLine: 'line-through',
    },
    primaryButton: {
      marginTop: 4,
      backgroundColor: palette.primary,
      paddingVertical: 12,
      borderRadius: 16,
      alignItems: 'center',
    },
    primaryButtonText: {
      color: '#fff',
      fontWeight: '600',
    },
    specCard: {
      backgroundColor: palette.card,
      borderRadius: 20,
      padding: 16,
      borderWidth: 1,
      borderColor: palette.border,
      gap: 10,
    },
    specTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: palette.text,
    },
    specRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    specKey: {
      fontSize: 12,
      color: palette.muted,
    },
    specValue: {
      fontSize: 12,
      color: palette.text,
      fontWeight: '600',
    },
    suggestedSection: {
      gap: 12,
    },
    suggestedHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    suggestedTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: palette.text,
    },
    suggestedMeta: {
      fontSize: 12,
      color: palette.muted,
    },
    suggestedRow: {
      paddingRight: 12,
      gap: 12,
    },
    suggestedCard: {
      width: 160,
      backgroundColor: palette.card,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: palette.border,
      overflow: 'hidden',
    },
    suggestedImage: {
      width: '100%',
      height: 110,
    },
    suggestedInfo: {
      padding: 10,
      gap: 6,
    },
    suggestedName: {
      fontSize: 13,
      fontWeight: '600',
      color: palette.text,
    },
    suggestedPriceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    suggestedPrice: {
      fontSize: 14,
      fontWeight: '700',
      color: palette.primary,
    },
    suggestedPriceOld: {
      fontSize: 11,
      color: palette.mutedAlt,
      textDecorationLine: 'line-through',
    },
    suggestedRatingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    suggestedRatingText: {
      fontSize: 11,
      fontWeight: '600',
      color: palette.chipText,
    },
    missingState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
    },
    missingTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: palette.text,
    },
  });

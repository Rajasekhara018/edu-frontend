import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { categories, products } from '@/data/products';
import { ThemePalette } from '@/constants/theme';

const ratingOptions = [4.5, 4.0, 3.5];

const formatPrice = (value: number) => `₹${value.toFixed(0)}`;

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { addItem, totalItems } = useCart();
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minPriceInput, setMinPriceInput] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');
  const [minRating, setMinRating] = useState<number | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const columns = useMemo(() => {
    if (width >= 1200) return 4;
    if (width >= 900) return 3;
    if (width >= 560) return 2;
    return 1;
  }, [width]);

  const filteredProducts = useMemo(() => {
    const minPrice = Number(minPriceInput);
    const maxPrice = Number(maxPriceInput);
    const hasMin = Number.isFinite(minPrice) && minPriceInput.trim() !== '';
    const hasMax = Number.isFinite(maxPrice) && maxPriceInput.trim() !== '';
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch =
        query.length === 0 ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);
      const matchesMin = !hasMin || product.price >= minPrice;
      const matchesMax = !hasMax || product.price <= maxPrice;
      const matchesRating =
        minRating === null || (product.rating ?? 0) >= minRating;

      return (
        matchesCategory &&
        matchesSearch &&
        matchesMin &&
        matchesMax &&
        matchesRating
      );
    });
  }, [maxPriceInput, minPriceInput, minRating, search, selectedCategory]);

  const handleApplyFilters = () => {
    if (width < 1280) {
      setFiltersOpen(false);
    }
  };

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setMinPriceInput('');
    setMaxPriceInput('');
    setMinRating(null);
    setSearch('');
    if (width < 1280) {
      setFiltersOpen(false);
    }
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>GrocerEase</Text>
          <Text style={styles.brandSubtitle}>Fresh groceries. Local picks.</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            accessibilityLabel="Open account"
            style={styles.accountButton}
            onPress={() => router.push('/login')}>
            <MaterialIcons name="person" size={22} color={palette.primary} />
          </Pressable>
          <Pressable
            accessibilityLabel="Open cart"
            style={styles.cartButton}
            onPress={() => router.push('/(tabs)/cart')}>
            <MaterialIcons name="shopping-cart" size={24} color={palette.primary} />
            {totalItems > 0 ? (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {totalItems > 9 ? '9+' : totalItems}
                </Text>
              </View>
            ) : null}
          </Pressable>
        </View>
      </View>

      <FlatList
        key={`grid-${columns}`}
        data={filteredProducts}
        numColumns={columns}
        keyExtractor={(item) => `${item.id}`}
        columnWrapperStyle={columns > 1 ? styles.columnRow : undefined}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <View style={styles.heroCard}>
              <View style={styles.heroBadgeRow}>
                <View style={styles.heroBadge}>
                  <MaterialIcons name="bolt" size={16} color="#fff" />
                  <Text style={styles.heroBadgeText}>30 min delivery</Text>
                </View>
                <View style={styles.heroBadgeAlt}>
                  <MaterialIcons name="verified" size={16} color={palette.primary} />
                  <Text style={styles.heroBadgeAltText}>Freshness guaranteed</Text>
                </View>
              </View>
              <Text style={styles.heroTitle}>
                Build your weekly basket with farm-fresh produce and pantry
                staples.
              </Text>
              <Text style={styles.heroSubtitle}>
                Daily offers on dairy, snacks, and household essentials with
                secure payments.
              </Text>
            </View>

            <View style={styles.infoSection}>
              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>About us</Text>
                <Text style={styles.infoText}>
                  Zepto is a Hyderabad-first grocery app focused on fast,
                  reliable daily essentials delivered from nearby partner
                  stores.
                </Text>
              </View>
              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Contact us</Text>
                <Text style={styles.infoText}>
                  City: Hyderabad{'\n'}
                  Support hours: 6:00 AM - 12:00 PM, daily{'\n'}
                  Reach us via in-app support
                </Text>
              </View>
            </View>

            <View style={styles.searchRow}>
              <View style={styles.searchInputWrapper}>
                <MaterialIcons name="search" size={20} color={palette.icon} />
                <TextInput
                  placeholder="Search vegetables, snacks, staples..."
                  placeholderTextColor={palette.mutedAlt}
                  value={search}
                  onChangeText={setSearch}
                  style={styles.searchInput}
                />
              </View>
              <Pressable
                style={styles.filterButton}
                onPress={() => setFiltersOpen(true)}>
                <MaterialIcons name="tune" size={20} color={palette.primary} />
                <Text style={styles.filterButtonText}>Filters</Text>
              </Pressable>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryRow}>
              {['All', ...categories].map((category) => {
                const active = selectedCategory === category;
                return (
                  <Pressable
                    key={category}
                    style={[
                      styles.categoryChip,
                      active && styles.categoryChipActive,
                    ]}
                    onPress={() => setSelectedCategory(category)}>
                    <Text
                      style={[
                        styles.categoryChipText,
                        active && styles.categoryChipTextActive,
                      ]}>
                      {category}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Top picks for you</Text>
              <Text style={styles.sectionMeta}>
                {filteredProducts.length} items
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons name="search-off" size={36} color={palette.mutedAlt} />
            <Text style={styles.emptyTitle}>No items found</Text>
            <Text style={styles.emptyText}>
              Try clearing filters or searching for something else.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.productCard}
            onPress={() => router.push(`/(tabs)/product/${item.id}`)}>
            <Image
              source={{ uri: item.image }}
              style={styles.productImage}
              contentFit="cover"
            />
            <View style={styles.productInfo}>
              <Text numberOfLines={2} style={styles.productName}>
                {item.name}
              </Text>
              <Text style={styles.productDesc} numberOfLines={2}>
                {item.description}
              </Text>
              <View style={styles.priceRow}>
                <Text style={styles.priceText}>{formatPrice(item.price)}</Text>
                {item.originalPrice ? (
                  <Text style={styles.priceOld}>
                    {formatPrice(item.originalPrice)}
                  </Text>
                ) : null}
              </View>
              <View style={styles.cardFooter}>
                <View style={styles.ratingPill}>
                  <MaterialIcons name="star" size={14} color={palette.warning} />
                  <Text style={styles.ratingText}>
                    {(item.rating ?? 0).toFixed(1)}
                  </Text>
                </View>
                <View style={styles.cardActions}>
                  <Pressable
                    style={styles.detailsButton}
                    onPress={() => router.push(`/(tabs)/product/${item.id}`)}>
                    <Text style={styles.detailsButtonText}>Details</Text>
                  </Pressable>
                  <Pressable
                    style={styles.addButton}
                    onPress={() => addItem(item, 1)}>
                    <Text style={styles.addButtonText}>Add</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Pressable>
        )}
      />

      <Modal
        visible={filtersOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setFiltersOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <Pressable onPress={() => setFiltersOpen(false)}>
                <MaterialIcons name="close" size={22} color={palette.text} />
              </Pressable>
            </View>

            <Text style={styles.modalLabel}>Price range</Text>
            <View style={styles.priceRowInputs}>
              <View style={styles.priceInput}>
                <Text style={styles.priceLabel}>Min</Text>
                <TextInput
                  value={minPriceInput}
                  onChangeText={setMinPriceInput}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={palette.mutedAlt}
                  style={styles.priceField}
                />
              </View>
              <View style={styles.priceInput}>
                <Text style={styles.priceLabel}>Max</Text>
                <TextInput
                  value={maxPriceInput}
                  onChangeText={setMaxPriceInput}
                  keyboardType="numeric"
                  placeholder="999"
                  placeholderTextColor={palette.mutedAlt}
                  style={styles.priceField}
                />
              </View>
            </View>

            <Text style={styles.modalLabel}>Minimum rating</Text>
            <View style={styles.ratingRow}>
              {ratingOptions.map((value) => {
                const active = minRating === value;
                return (
                  <Pressable
                    key={value}
                    style={[
                      styles.ratingChip,
                      active && styles.ratingChipActive,
                    ]}
                    onPress={() => setMinRating(active ? null : value)}>
                    <MaterialIcons
                      name="star"
                      size={14}
                      color={active ? '#fff' : palette.warning}
                    />
                    <Text
                      style={[
                        styles.ratingChipText,
                        active && styles.ratingChipTextActive,
                      ]}>
                      {value.toFixed(1)}+
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.modalActions}>
              <Pressable style={styles.clearButton} onPress={handleClearFilters}>
                <Text style={styles.clearButtonText}>Clear all</Text>
              </Pressable>
              <Pressable
                style={styles.applyButton}
                onPress={handleApplyFilters}>
                <Text style={styles.applyButtonText}>Apply filters</Text>
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
  header: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: palette.background,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: palette.text,
  },
  brandSubtitle: {
    fontSize: 12,
    color: palette.muted,
    marginTop: 2,
  },
  cartButton: {
    backgroundColor: palette.cardAlt,
    borderRadius: 18,
    padding: 8,
    position: 'relative',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  accountButton: {
    backgroundColor: palette.cardAlt,
    borderRadius: 18,
    padding: 8,
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
  listContent: {
    paddingHorizontal: 18,
    paddingBottom: 120,
  },
  heroCard: {
    backgroundColor: palette.primary,
    borderRadius: 20,
    padding: 18,
    marginTop: 8,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  heroBadge: {
    backgroundColor: palette.primaryDark,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  heroBadgeAlt: {
    backgroundColor: palette.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroBadgeAltText: {
    color: palette.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  heroTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    marginBottom: 8,
  },
  heroSubtitle: {
    color: '#e6f0ea',
    fontSize: 13,
    lineHeight: 18,
  },
  infoSection: {
    marginTop: 16,
    gap: 12,
  },
  infoCard: {
    backgroundColor: palette.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 14,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.text,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 12,
    color: palette.muted,
    lineHeight: 17,
  },
  searchRow: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 10,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.card,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: palette.border,
  },
  searchInput: {
    marginLeft: 6,
    flex: 1,
    color: palette.text,
    fontSize: 14,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: palette.primarySoft,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 6,
  },
  filterButtonText: {
    color: palette.primary,
    fontWeight: '600',
  },
  categoryRow: {
    paddingVertical: 16,
    gap: 10,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: palette.cardAlt,
  },
  categoryChipActive: {
    backgroundColor: palette.primary,
  },
  categoryChipText: {
    color: palette.muted,
    fontSize: 13,
  },
  categoryChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.text,
  },
  sectionMeta: {
    fontSize: 12,
    color: palette.muted,
  },
  columnRow: {
    gap: 16,
    marginBottom: 16,
  },
  productCard: {
    flex: 1,
    backgroundColor: palette.card,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: 16,
    minHeight: 280,
  },
  productImage: {
    height: 130,
    width: '100%',
  },
  productInfo: {
    padding: 12,
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text,
  },
  productDesc: {
    fontSize: 12,
    color: palette.muted,
    marginTop: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '700',
    color: palette.primary,
  },
  priceOld: {
    fontSize: 12,
    color: palette.mutedAlt,
    textDecorationLine: 'line-through',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: palette.chip,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    color: palette.chipText,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: palette.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  detailsButton: {
    backgroundColor: palette.cardAlt,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
  },
  detailsButtonText: {
    color: palette.text,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.text,
  },
  emptyText: {
    fontSize: 13,
    color: palette.muted,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 18, 16, 0.35)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: palette.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 18,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.text,
  },
  modalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.muted,
    marginBottom: 8,
  },
  priceRowInputs: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  priceInput: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 10,
    backgroundColor: palette.cardAlt,
  },
  priceLabel: {
    fontSize: 11,
    color: palette.mutedAlt,
    marginBottom: 4,
  },
  priceField: {
    fontSize: 14,
    color: palette.text,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: palette.chip,
  },
  ratingChipActive: {
    backgroundColor: palette.primary,
  },
  ratingChipText: {
    fontSize: 12,
    color: palette.chipText,
    fontWeight: '600',
  },
  ratingChipTextActive: {
    color: '#fff',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  clearButton: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    paddingVertical: 12,
    alignItems: 'center',
  },
  clearButtonText: {
    color: palette.muted,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: palette.primary,
    paddingVertical: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

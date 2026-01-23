import React from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

import { useCart } from '@/context/CartContext';

const formatPrice = (value: number) => `₹${value.toFixed(0)}`;

export default function CartScreen() {
  const router = useRouter();
  const { items, totalItems, totalPrice, updateQuantity, removeItem } = useCart();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Cart</Text>
        <Text style={styles.subtitle}>{totalItems} items</Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="shopping-cart" size={40} color="#c3c8c4" />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>
            Browse fresh groceries and add them to your basket.
          </Text>
          <Pressable
            style={styles.primaryButton}
            onPress={() => router.push('/(tabs)')}>
            <Text style={styles.primaryButtonText}>Start shopping</Text>
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
                    <MaterialIcons name="remove" size={18} color="#1f8b4c" />
                  </Pressable>
                  <Text style={styles.qtyValue}>{item.quantity}</Text>
                  <Pressable
                    style={styles.qtyButton}
                    onPress={() =>
                      updateQuantity(item.product.id, item.quantity + 1)
                    }>
                    <MaterialIcons name="add" size={18} color="#1f8b4c" />
                  </Pressable>
                  <Pressable
                    style={styles.removeButton}
                    onPress={() => removeItem(item.product.id)}>
                    <MaterialIcons name="delete" size={16} color="#cc4b33" />
                    <Text style={styles.removeText}>Remove</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
          ListFooterComponent={
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>
                  {formatPrice(totalPrice)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery</Text>
                <Text style={styles.summaryValue}>Free</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryTotal}>Total</Text>
                <Text style={styles.summaryTotal}>
                  {formatPrice(totalPrice)}
                </Text>
              </View>
              <Pressable style={styles.checkoutButton}>
                <Text style={styles.checkoutText}>Proceed to checkout</Text>
              </Pressable>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fbf6f1',
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 12,
    color: '#6c756f',
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: 18,
    paddingBottom: 120,
    gap: 16,
  },
  cartItem: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e7e3',
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
    color: '#1b1f1d',
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f8b4c',
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
    backgroundColor: '#eef6f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1b1f1d',
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
    color: '#cc4b33',
    fontWeight: '600',
    fontSize: 12,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e7e3',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#6c756f',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1b1f1d',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#e2e7e3',
    marginVertical: 10,
  },
  summaryTotal: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1b1f1d',
  },
  checkoutButton: {
    marginTop: 14,
    backgroundColor: '#1f8b4c',
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
    color: '#1b1f1d',
  },
  emptyText: {
    fontSize: 13,
    color: '#7a827b',
    textAlign: 'center',
  },
  primaryButton: {
    marginTop: 12,
    backgroundColor: '#1f8b4c',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 18,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

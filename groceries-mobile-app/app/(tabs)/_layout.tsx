import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
  const { palette } = useTheme();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: palette.tint,
        tabBarInactiveTintColor: palette.tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: palette.background,
          borderTopColor: palette.border,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tab_shop'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: t('tab_cart'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="cart.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="product/[id]"
        options={{
          href: null,
          title: 'Product',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tab_settings'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          href: null,
          title: 'Orders',
        }}
      />
      <Tabs.Screen
        name="add-address"
        options={{
          href: null,
          title: 'Add Address',
        }}
      />
      <Tabs.Screen
        name="order-details"
        options={{
          href: null,
          title: 'Order Details',
        }}
      />
      <Tabs.Screen
        name="payments-refunds"
        options={{
          href: null,
          title: 'Payments & Refunds',
        }}
      />
      <Tabs.Screen
        name="help-support"
        options={{
          href: null,
          title: 'Help & Support',
        }}
      />
      <Tabs.Screen
        name="addresses"
        options={{
          href: null,
          title: 'Your Addresses',
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          href: null,
          title: 'Your Account',
        }}
      />
    </Tabs>
  );
}

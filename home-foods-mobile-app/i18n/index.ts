import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { languageOptions } from './languages';

const supportedCodes = new Set(languageOptions.map((lang) => lang.code));
const defaultLocale = Localization.getLocales()[0]?.languageTag ?? 'en';
const baseLocale = defaultLocale.split('-')[0];

const resources = {
  en: {
    common: {
      settings_title: 'Settings',
      settings_subtitle: 'Theme: {{theme}} ({{resolved}})',
      appearance_title: 'Appearance',
      appearance_subtitle: 'Switch themes instantly.',
      preferences_title: 'Preferences',
      notifications_title: 'Push notifications',
      notifications_subtitle: 'Order updates and delivery alerts.',
      offers_title: 'Offers & deals',
      offers_subtitle: 'Weekly savings and personalized offers.',
      account_title: 'Account',
      your_account: 'Your account',
      orders: 'Orders',
      your_addresses: 'Your addresses',
      payments_refunds: 'Payments & refunds',
      help_support: 'Help & support',
      language_region_title: 'Language & region',
      language_subtitle: 'Choose your preferred language.',
      language_button: 'Language',
      language_select: 'Select language',
      language_done: 'Done',
      tab_shop: 'Shop',
      tab_cart: 'Cart',
      tab_settings: 'Settings',
      home_title: 'GrocerEase',
      home_subtitle: 'Fresh groceries. Local picks.',
      home_search_placeholder: 'Search vegetables, snacks, staples...',
      home_filters: 'Filters',
      home_top_picks: 'Top picks for you',
      home_items: '{{count}} items',
      cart_title: 'Your Cart',
      cart_items: '{{count}} items',
      cart_empty_title: 'Your cart is empty',
      cart_empty_subtitle: 'Browse fresh groceries and add them to your basket.',
      cart_start_shopping: 'Start shopping',
      cart_subtotal: 'Subtotal',
      cart_delivery: 'Delivery',
      cart_total: 'Total',
      cart_checkout: 'Proceed to checkout',
      cart_remove: 'Remove',
      cart_qty: 'Qty',
      login_title: 'Log in',
      login_welcome: 'Welcome back',
      login_subtitle: 'Sign in to manage orders, track delivery, and save favorites.',
      login_email: 'Email or phone',
      login_password: 'Password',
      login_button: 'Sign in',
      login_create_account: 'New here? Create an account',
      register_title: 'Register',
      register_heading: 'Create your account',
      register_subtitle: 'Join GrocerEase to save lists, track delivery, and earn rewards.',
      register_fullname: 'Full name',
      register_email: 'Email',
      register_phone: 'Phone number',
      register_password: 'Password',
      register_confirm: 'Confirm password',
      register_button: 'Create account',
      register_login: 'Already have an account? Log in',
      product_details: 'Details',
      product_add_to_cart: 'Add to cart',
      product_suggested: 'Suggested for you',
      orders_title: 'Your Orders',
      orders_search: 'Search all orders',
      orders_tab_orders: 'Orders',
      orders_tab_buy_again: 'Buy Again',
      orders_tab_not_shipped: 'Not Yet Shipped',
      orders_filter_prefix: '10 orders placed in',
      orders_filter_range: 'past 3 months',
      orders_view_details: 'View order details',
      order_details_title: 'Order details',
      order_status_delivered: 'Delivered',
      order_status_not_shipped: 'Not yet shipped',
      order_track: 'Track package',
      order_invoice: 'Invoice',
      order_summary: 'Order summary',
      order_payment: 'Payment',
      order_address: 'Delivery address',
      order_change_address: 'Change address',
      order_items: 'Items in this order',
      order_buy_again: 'Buy again',
      order_help_title: 'Need help with this order?',
      order_help_subtitle:
        'Get invoice, request return, or contact support about this order.',
      order_return_item: 'Return item',
      order_contact_support: 'Contact support',
      payments_title: 'Payments & refunds',
      payments_subtitle: 'Manage payout methods and track refunds.',
      wallet_balance: 'Wallet balance',
      add_money: 'Add money',
      saved_methods: 'Saved payment methods',
      add_new: 'Add new',
      refund_status: 'Refund status',
      payout_preferences: 'Payout preferences',
      contact_payments_support: 'Contact payments support',
      help_title: 'Help & support',
      help_subtitle: 'Find answers or contact our team.',
      help_search: 'Search help articles, orders, or issues',
      quick_help: 'Quick help',
      recent_tickets: 'Recent tickets',
      view_all: 'View all',
      contact_us: 'Contact us',
      chat_now: 'Chat now',
      call_support: 'Call support',
      your_account_title: 'Your Account',
      your_account_subtitle: 'Profile, addresses, and preferences',
      edit: 'Edit',
      quick_actions: 'Quick actions',
      preferences: 'Preferences',
      open_settings: 'Open settings',
      addresses_title: 'Your addresses',
      addresses_subtitle: 'Manage delivery locations',
      add_new_address: 'Add new',
      add_address_title: 'Add a new address',
      select_pickup_location: 'Select pickup location',
      add_address_button: 'Add address',
      account_language: 'Language',
    },
  },
  hi: { common: {} },
  bn: { common: {} },
  te: { common: {} },
  mr: { common: {} },
  ta: { common: {} },
  ur: { common: {} },
  gu: { common: {} },
  kn: { common: {} },
  ml: { common: {} },
  or: { common: {} },
  pa: { common: {} },
  as: { common: {} },
  ks: { common: {} },
  sa: { common: {} },
  sd: { common: {} },
  kok: { common: {} },
  mai: { common: {} },
  doi: { common: {} },
  ne: { common: {} },
  mni: { common: {} },
  es: { common: {} },
  fr: { common: {} },
  de: { common: {} },
};

const initialLanguage = supportedCodes.has(baseLocale) ? baseLocale : 'en';

i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: 'en',
  ns: ['common'],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
});

const STORAGE_KEY = 'app.language';

export async function loadSavedLanguage() {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved && supportedCodes.has(saved)) {
      await i18n.changeLanguage(saved);
    }
  } catch (error) {
    // Ignore and keep default language.
  }
}

export async function setLanguage(code: string) {
  if (!supportedCodes.has(code)) return;
  await i18n.changeLanguage(code);
  await AsyncStorage.setItem(STORAGE_KEY, code);
}

export function getLanguageLabel(code: string) {
  return languageOptions.find((lang) => lang.code === code)?.nativeLabel ?? 'English';
}

export default i18n;

import Constants from 'expo-constants';
import React, { createContext, useContext, useMemo } from 'react';

import { buildCategories, buildProducts, MobileProfileConfig, Product } from '@/data/products';

import zipgrocerMobile from '@/data/profiles/zipgrocer-mobile.json';
import greenbasketMobile from '@/data/profiles/greenbasket-mobile.json';
import urbancartMobile from '@/data/profiles/urbancart-mobile.json';
import harvestlaneMobile from '@/data/profiles/harvestlane-mobile.json';
import crateberryMobile from '@/data/profiles/crateberry-mobile.json';
import marketmintMobile from '@/data/profiles/marketmint-mobile.json';
import farmrushMobile from '@/data/profiles/farmrush-mobile.json';
import pantrypalMobile from '@/data/profiles/pantrypal-mobile.json';
import dailynestMobile from '@/data/profiles/dailynest-mobile.json';
import freshfleetMobile from '@/data/profiles/freshfleet-mobile.json';
import rootedcartMobile from '@/data/profiles/rootedcart-mobile.json';
import sunbasketMobile from '@/data/profiles/sunbasket-mobile.json';
import quickcrateMobile from '@/data/profiles/quickcrate-mobile.json';
import mintmartMobile from '@/data/profiles/mintmart-mobile.json';
import neighborhoodMobile from '@/data/profiles/neighborhood-mobile.json';

type ProfileContextValue = {
  profile: MobileProfileConfig;
  products: Product[];
  categories: string[];
  profileKey: string;
};

const profileMap: Record<string, MobileProfileConfig> = {
  'zipgrocer-mobile': zipgrocerMobile as MobileProfileConfig,
  'greenbasket-mobile': greenbasketMobile as MobileProfileConfig,
  'urbancart-mobile': urbancartMobile as MobileProfileConfig,
  'harvestlane-mobile': harvestlaneMobile as MobileProfileConfig,
  'crateberry-mobile': crateberryMobile as MobileProfileConfig,
  'marketmint-mobile': marketmintMobile as MobileProfileConfig,
  'farmrush-mobile': farmrushMobile as MobileProfileConfig,
  'pantrypal-mobile': pantrypalMobile as MobileProfileConfig,
  'dailynest-mobile': dailynestMobile as MobileProfileConfig,
  'freshfleet-mobile': freshfleetMobile as MobileProfileConfig,
  'rootedcart-mobile': rootedcartMobile as MobileProfileConfig,
  'sunbasket-mobile': sunbasketMobile as MobileProfileConfig,
  'quickcrate-mobile': quickcrateMobile as MobileProfileConfig,
  'mintmart-mobile': mintmartMobile as MobileProfileConfig,
  'neighborhood-mobile': neighborhoodMobile as MobileProfileConfig,
};

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

function resolveProfileKey() {
  const envProfile = process.env.EXPO_PUBLIC_APP_PROFILE;
  const configProfile = Constants.expoConfig?.extra?.appProfile as string | undefined;
  return envProfile || configProfile || 'zipgrocer-mobile';
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const profileKey = resolveProfileKey();
  const profile = profileMap[profileKey] ?? profileMap['zipgrocer-mobile'];
  const products = useMemo(() => buildProducts(profile), [profile]);
  const categories = useMemo(() => buildCategories(products), [products]);
  const value = useMemo(() => ({ profile, products, categories, profileKey }), [profile, products, categories, profileKey]);
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return context;
}

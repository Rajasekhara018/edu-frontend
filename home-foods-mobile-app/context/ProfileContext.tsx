import Constants from 'expo-constants';
import React, { createContext, useContext, useMemo } from 'react';

import { buildCategories, buildProducts, MobileProfileConfig, Product } from '@/data/products';

import homefoodsMobile from '@/data/profiles/homefoods-mobile.json';
import spicehearthMobile from '@/data/profiles/spicehearth-mobile.json';
import picklepantryMobile from '@/data/profiles/picklepantry-mobile.json';
import sweetkadaiMobile from '@/data/profiles/sweetkadai-mobile.json';
import milletmamaMobile from '@/data/profiles/milletmama-mobile.json';
import tiffintraditionMobile from '@/data/profiles/tiffintradition-mobile.json';
import spicepetalMobile from '@/data/profiles/spicepetal-mobile.json';
import harvestladleMobile from '@/data/profiles/harvestladle-mobile.json';
import nativetableMobile from '@/data/profiles/nativetable-mobile.json';
import brassbowlMobile from '@/data/profiles/brassbowl-mobile.json';
import gingergroveMobile from '@/data/profiles/gingergrove-mobile.json';
import stonepotMobile from '@/data/profiles/stonepot-mobile.json';
import ammakitchenMobile from '@/data/profiles/ammakitchen-mobile.json';
import festiverootsMobile from '@/data/profiles/festiveroots-mobile.json';
import ladleleafMobile from '@/data/profiles/ladleleaf-mobile.json';

type ProfileContextValue = {
  profile: MobileProfileConfig;
  products: Product[];
  categories: string[];
  profileKey: string;
};

const profileMap: Record<string, MobileProfileConfig> = {
  'homefoods-mobile': homefoodsMobile as MobileProfileConfig,
  'spicehearth-mobile': spicehearthMobile as MobileProfileConfig,
  'picklepantry-mobile': picklepantryMobile as MobileProfileConfig,
  'sweetkadai-mobile': sweetkadaiMobile as MobileProfileConfig,
  'milletmama-mobile': milletmamaMobile as MobileProfileConfig,
  'tiffintradition-mobile': tiffintraditionMobile as MobileProfileConfig,
  'spicepetal-mobile': spicepetalMobile as MobileProfileConfig,
  'harvestladle-mobile': harvestladleMobile as MobileProfileConfig,
  'nativetable-mobile': nativetableMobile as MobileProfileConfig,
  'brassbowl-mobile': brassbowlMobile as MobileProfileConfig,
  'gingergrove-mobile': gingergroveMobile as MobileProfileConfig,
  'stonepot-mobile': stonepotMobile as MobileProfileConfig,
  'ammakitchen-mobile': ammakitchenMobile as MobileProfileConfig,
  'festiveroots-mobile': festiverootsMobile as MobileProfileConfig,
  'ladleleaf-mobile': ladleleafMobile as MobileProfileConfig,
};

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

function resolveProfileKey() {
  const envProfile = process.env.EXPO_PUBLIC_APP_PROFILE;
  const configProfile = Constants.expoConfig?.extra?.appProfile as string | undefined;
  return envProfile || configProfile || 'homefoods-mobile';
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const profileKey = resolveProfileKey();
  const profile = profileMap[profileKey] ?? profileMap['homefoods-mobile'];
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

import Constants from 'expo-constants';
import React, { createContext, useContext, useMemo } from 'react';

import { buildCategories, buildProducts, MobileProfileConfig, Product } from '@/data/products';

import threadlineMobile from '@/data/profiles/threadline-mobile.json';
import velvetVaultMobile from '@/data/profiles/velvet-vault-mobile.json';
import urbanloomMobile from '@/data/profiles/urbanloom-mobile.json';
import auroraAttireMobile from '@/data/profiles/aurora-attire-mobile.json';
import houseOfNovaMobile from '@/data/profiles/house-of-nova-mobile.json';
import mapleThreadMobile from '@/data/profiles/maple-thread-mobile.json';
import cobaltClosetMobile from '@/data/profiles/cobalt-closet-mobile.json';
import driftLabelMobile from '@/data/profiles/drift-label-mobile.json';
import solsticeWearMobile from '@/data/profiles/solstice-wear-mobile.json';
import prismWardrobeMobile from '@/data/profiles/prism-wardrobe-mobile.json';
import emberLaneMobile from '@/data/profiles/ember-lane-mobile.json';
import futureforgeMobile from '@/data/profiles/futureforge-mobile.json';
import nextorbitMobile from '@/data/profiles/nextorbit-mobile.json';
import catalystAcademyMobile from '@/data/profiles/catalyst-academy-mobile.json';
import vertexStyleMobile from '@/data/profiles/vertex-style-mobile.json';

type ProfileContextValue = {
  profile: MobileProfileConfig;
  products: Product[];
  categories: string[];
  profileKey: string;
};

const profileMap: Record<string, MobileProfileConfig> = {
  'threadline-mobile': threadlineMobile as MobileProfileConfig,
  'velvet-vault-mobile': velvetVaultMobile as MobileProfileConfig,
  'urbanloom-mobile': urbanloomMobile as MobileProfileConfig,
  'aurora-attire-mobile': auroraAttireMobile as MobileProfileConfig,
  'house-of-nova-mobile': houseOfNovaMobile as MobileProfileConfig,
  'maple-thread-mobile': mapleThreadMobile as MobileProfileConfig,
  'cobalt-closet-mobile': cobaltClosetMobile as MobileProfileConfig,
  'drift-label-mobile': driftLabelMobile as MobileProfileConfig,
  'solstice-wear-mobile': solsticeWearMobile as MobileProfileConfig,
  'prism-wardrobe-mobile': prismWardrobeMobile as MobileProfileConfig,
  'ember-lane-mobile': emberLaneMobile as MobileProfileConfig,
  'futureforge-mobile': futureforgeMobile as MobileProfileConfig,
  'nextorbit-mobile': nextorbitMobile as MobileProfileConfig,
  'catalyst-academy-mobile': catalystAcademyMobile as MobileProfileConfig,
  'vertex-style-mobile': vertexStyleMobile as MobileProfileConfig,
};

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

function resolveProfileKey() {
  const envProfile = process.env.EXPO_PUBLIC_APP_PROFILE;
  const configProfile = Constants.expoConfig?.extra?.appProfile as string | undefined;
  return envProfile || configProfile || 'threadline-mobile';
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const profileKey = resolveProfileKey();
  const profile = profileMap[profileKey] ?? profileMap['threadline-mobile'];
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

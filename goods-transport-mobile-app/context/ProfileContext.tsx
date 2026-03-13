import Constants from 'expo-constants';
import React, { createContext, useContext, useMemo } from 'react';

import { buildCategories, buildProducts, MobileProfileConfig, Product } from '@/data/products';

import goodsgoMobile from '@/data/profiles/goodsgo-mobile.json';
import cargobridgeMobile from '@/data/profiles/cargobridge-mobile.json';
import fleetforgeMobile from '@/data/profiles/fleetforge-mobile.json';
import haulsprintMobile from '@/data/profiles/haulsprint-mobile.json';
import movegridMobile from '@/data/profiles/movegrid-mobile.json';
import roadpulseMobile from '@/data/profiles/roadpulse-mobile.json';
import swiftaxisMobile from '@/data/profiles/swiftaxis-mobile.json';
import transitcoreMobile from '@/data/profiles/transitcore-mobile.json';
import urbanfreightMobile from '@/data/profiles/urbanfreight-mobile.json';
import loadlatticeMobile from '@/data/profiles/loadlattice-mobile.json';
import nexahaulMobile from '@/data/profiles/nexahaul-mobile.json';
import ironrouteMobile from '@/data/profiles/ironroute-mobile.json';
import movebridgeMobile from '@/data/profiles/movebridge-mobile.json';
import haulnestMobile from '@/data/profiles/haulnest-mobile.json';
import routevaultMobile from '@/data/profiles/routevault-mobile.json';

type ProfileContextValue = {
  profile: MobileProfileConfig;
  products: Product[];
  categories: string[];
  profileKey: string;
};

const profileMap: Record<string, MobileProfileConfig> = {
  'goodsgo-mobile': goodsgoMobile as MobileProfileConfig,
  'cargobridge-mobile': cargobridgeMobile as MobileProfileConfig,
  'fleetforge-mobile': fleetforgeMobile as MobileProfileConfig,
  'haulsprint-mobile': haulsprintMobile as MobileProfileConfig,
  'movegrid-mobile': movegridMobile as MobileProfileConfig,
  'roadpulse-mobile': roadpulseMobile as MobileProfileConfig,
  'swiftaxis-mobile': swiftaxisMobile as MobileProfileConfig,
  'transitcore-mobile': transitcoreMobile as MobileProfileConfig,
  'urbanfreight-mobile': urbanfreightMobile as MobileProfileConfig,
  'loadlattice-mobile': loadlatticeMobile as MobileProfileConfig,
  'nexahaul-mobile': nexahaulMobile as MobileProfileConfig,
  'ironroute-mobile': ironrouteMobile as MobileProfileConfig,
  'movebridge-mobile': movebridgeMobile as MobileProfileConfig,
  'haulnest-mobile': haulnestMobile as MobileProfileConfig,
  'routevault-mobile': routevaultMobile as MobileProfileConfig,
};

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

function resolveProfileKey() {
  const envProfile = process.env.EXPO_PUBLIC_APP_PROFILE;
  const configProfile = Constants.expoConfig?.extra?.appProfile as string | undefined;
  return envProfile || configProfile || 'goodsgo-mobile';
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const profileKey = resolveProfileKey();
  const profile = profileMap[profileKey] ?? profileMap['goodsgo-mobile'];
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

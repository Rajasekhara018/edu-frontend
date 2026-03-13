import Constants from 'expo-constants';
import React, { createContext, useContext, useMemo } from 'react';

import { buildCategories, buildProducts, MobileProfileConfig, Product } from '@/data/products';

import electramartMobile from '@/data/profiles/electramart-mobile.json';
import voltgridMobile from '@/data/profiles/voltgrid-mobile.json';
import lumenhubMobile from '@/data/profiles/lumenhub-mobile.json';
import circuitcityMobile from '@/data/profiles/circuitcity-mobile.json';
import ampereDepotMobile from '@/data/profiles/ampere-depot-mobile.json';
import sparklineMobile from '@/data/profiles/sparkline-mobile.json';
import nexaPowerhouseMobile from '@/data/profiles/nexa-powerhouse-mobile.json';
import relayNationMobile from '@/data/profiles/relay-nation-mobile.json';
import brightforgeMobile from '@/data/profiles/brightforge-mobile.json';
import terraVoltMobile from '@/data/profiles/terra-volt-mobile.json';
import gridnestMobile from '@/data/profiles/gridnest-mobile.json';
import ohmBazaarMobile from '@/data/profiles/ohm-bazaar-mobile.json';
import currentCraftersMobile from '@/data/profiles/current-crafters-mobile.json';
import switchyardMobile from '@/data/profiles/switchyard-mobile.json';
import wireworksMobile from '@/data/profiles/wireworks-mobile.json';

type ProfileContextValue = {
  profile: MobileProfileConfig;
  products: Product[];
  categories: string[];
  profileKey: string;
};

const profileMap: Record<string, MobileProfileConfig> = {
  'electramart-mobile': electramartMobile as MobileProfileConfig,
  'voltgrid-mobile': voltgridMobile as MobileProfileConfig,
  'lumenhub-mobile': lumenhubMobile as MobileProfileConfig,
  'circuitcity-mobile': circuitcityMobile as MobileProfileConfig,
  'ampere-depot-mobile': ampereDepotMobile as MobileProfileConfig,
  'sparkline-mobile': sparklineMobile as MobileProfileConfig,
  'nexa-powerhouse-mobile': nexaPowerhouseMobile as MobileProfileConfig,
  'relay-nation-mobile': relayNationMobile as MobileProfileConfig,
  'brightforge-mobile': brightforgeMobile as MobileProfileConfig,
  'terra-volt-mobile': terraVoltMobile as MobileProfileConfig,
  'gridnest-mobile': gridnestMobile as MobileProfileConfig,
  'ohm-bazaar-mobile': ohmBazaarMobile as MobileProfileConfig,
  'current-crafters-mobile': currentCraftersMobile as MobileProfileConfig,
  'switchyard-mobile': switchyardMobile as MobileProfileConfig,
  'wireworks-mobile': wireworksMobile as MobileProfileConfig,
};

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

function resolveProfileKey() {
  const envProfile = process.env.EXPO_PUBLIC_APP_PROFILE;
  const configProfile = Constants.expoConfig?.extra?.appProfile as string | undefined;
  return envProfile || configProfile || 'electramart-mobile';
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const profileKey = resolveProfileKey();
  const profile = profileMap[profileKey] ?? profileMap['electramart-mobile'];
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

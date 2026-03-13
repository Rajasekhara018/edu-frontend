import Constants from 'expo-constants';
import React, { createContext, useContext, useMemo } from 'react';

import { buildCategories, buildProducts, MobileProfileConfig, Product } from '@/data/products';

import edusoftMobile from '@/data/profiles/edusoft-mobile.json';
import auroraTechMobile from '@/data/profiles/aurora-tech-mobile.json';
import bluecrestLearningMobile from '@/data/profiles/bluecrest-learning-mobile.json';
import catalystAcademyMobile from '@/data/profiles/catalyst-academy-mobile.json';
import codeharborMobile from '@/data/profiles/codeharbor-mobile.json';
import datanovaMobile from '@/data/profiles/datanova-mobile.json';
import elevateLabsMobile from '@/data/profiles/elevate-labs-mobile.json';
import futureforgeMobile from '@/data/profiles/futureforge-mobile.json';
import growthgridMobile from '@/data/profiles/growthgrid-mobile.json';
import igniteverseMobile from '@/data/profiles/igniteverse-mobile.json';
import nextorbitMobile from '@/data/profiles/nextorbit-mobile.json';
import quantumSkillhouseMobile from '@/data/profiles/quantum-skillhouse-mobile.json';
import vertexAcademyMobile from '@/data/profiles/vertex-academy-mobile.json';
import brightpathMobile from '@/data/profiles/brightpath-mobile.json';
import skillcraftMobile from '@/data/profiles/skillcraft-mobile.json';

type ProfileContextValue = {
  profile: MobileProfileConfig;
  products: Product[];
  categories: string[];
  profileKey: string;
};

const profileMap: Record<string, MobileProfileConfig> = {
  'edusoft-mobile': edusoftMobile as MobileProfileConfig,
  'aurora-tech-mobile': auroraTechMobile as MobileProfileConfig,
  'bluecrest-learning-mobile': bluecrestLearningMobile as MobileProfileConfig,
  'catalyst-academy-mobile': catalystAcademyMobile as MobileProfileConfig,
  'codeharbor-mobile': codeharborMobile as MobileProfileConfig,
  'datanova-mobile': datanovaMobile as MobileProfileConfig,
  'elevate-labs-mobile': elevateLabsMobile as MobileProfileConfig,
  'futureforge-mobile': futureforgeMobile as MobileProfileConfig,
  'growthgrid-mobile': growthgridMobile as MobileProfileConfig,
  'igniteverse-mobile': igniteverseMobile as MobileProfileConfig,
  'nextorbit-mobile': nextorbitMobile as MobileProfileConfig,
  'quantum-skillhouse-mobile': quantumSkillhouseMobile as MobileProfileConfig,
  'vertex-academy-mobile': vertexAcademyMobile as MobileProfileConfig,
  'brightpath-mobile': brightpathMobile as MobileProfileConfig,
  'skillcraft-mobile': skillcraftMobile as MobileProfileConfig,
};

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

function resolveProfileKey() {
  const envProfile = process.env.EXPO_PUBLIC_APP_PROFILE;
  const configProfile = Constants.expoConfig?.extra?.appProfile as string | undefined;
  return envProfile || configProfile || 'edusoft-mobile';
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const profileKey = resolveProfileKey();
  const profile = profileMap[profileKey] ?? profileMap['edusoft-mobile'];
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

import type { Href } from 'expo-router';
import { Routes } from '~/shared/config/routes';
import {
  getBusinessNameValidationError,
  getFullNameValidationError,
} from '~/features/auth/lib/credentials';

export const SIGNUP_ACCOUNT_TYPE = {
  personal: 'personal',
  business: 'business',
} as const;

export type SignupAccountType = (typeof SIGNUP_ACCOUNT_TYPE)[keyof typeof SIGNUP_ACCOUNT_TYPE];

const SIGNUP_ACCOUNT_TYPE_VALUES = new Set<string>(Object.values(SIGNUP_ACCOUNT_TYPE));

export function isSignupAccountType(value: unknown): value is SignupAccountType {
  return typeof value === 'string' && SIGNUP_ACCOUNT_TYPE_VALUES.has(value);
}

export function parseSignupAccountType(value: string | undefined): SignupAccountType {
  return isSignupAccountType(value) ? value : SIGNUP_ACCOUNT_TYPE.personal;
}

type SignupAccountTypeConfig = {
  nameLabel: string;
  namePlaceholder: string;
  tabLabel: string;
  validateName: (name: string) => string | undefined;
};

export const SIGNUP_ACCOUNT_TYPE_CONFIG = {
  [SIGNUP_ACCOUNT_TYPE.personal]: {
    nameLabel: 'Full name',
    namePlaceholder: 'Jane Doe',
    tabLabel: 'Personal',
    validateName: getFullNameValidationError,
  },
  [SIGNUP_ACCOUNT_TYPE.business]: {
    nameLabel: 'Business Name',
    namePlaceholder: 'Acme Coffee Co.',
    tabLabel: 'Business',
    validateName: getBusinessNameValidationError,
  },
} as const satisfies Record<SignupAccountType, SignupAccountTypeConfig>;

export const SIGNUP_ACCOUNT_TYPES = Object.values(SIGNUP_ACCOUNT_TYPE);

export function signupHref(type: SignupAccountType): Href {
  return { pathname: Routes.Signup, params: { account: type } };
}

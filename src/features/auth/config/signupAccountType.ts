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
  switchLabel: string;
  switchTo: SignupAccountType;
  validateName: (name: string) => string | undefined;
};

export const SIGNUP_ACCOUNT_TYPE_CONFIG = {
  [SIGNUP_ACCOUNT_TYPE.personal]: {
    nameLabel: 'Full name',
    namePlaceholder: 'Jane Doe',
    switchLabel: 'Go as a business.',
    switchTo: SIGNUP_ACCOUNT_TYPE.business,
    validateName: getFullNameValidationError,
  },
  [SIGNUP_ACCOUNT_TYPE.business]: {
    nameLabel: 'Business name',
    namePlaceholder: 'Acme Coffee Co.',
    switchLabel: 'Go as a personal user.',
    switchTo: SIGNUP_ACCOUNT_TYPE.personal,
    validateName: getBusinessNameValidationError,
  },
} as const satisfies Record<SignupAccountType, SignupAccountTypeConfig>;

export function signupHref(type: SignupAccountType): Href {
  return { pathname: Routes.Signup, params: { account: type } };
}

import {
  ACCOUNT_KIND,
  parseAccountKind,
  type AccountKind,
} from '~/features/business-account/config/accountKind';
import { ACCOUNT_MODE, type AccountMode } from '~/features/business-account/config/accountMode';

type AccountKindInput = {
  accountType: unknown;
  isBusinessAccount: boolean;
};

export function resolveAccountKind({
  accountType,
  isBusinessAccount,
}: AccountKindInput): AccountKind {
  return (
    parseAccountKind(accountType) ??
    (isBusinessAccount ? ACCOUNT_KIND.businessOnly : ACCOUNT_KIND.regular)
  );
}

export function resolveEffectiveAccountMode(
  kind: AccountKind,
  stored: AccountMode | null | undefined,
): AccountMode {
  if (kind === ACCOUNT_KIND.regular) return ACCOUNT_MODE.personal;
  if (kind === ACCOUNT_KIND.businessOnly) return ACCOUNT_MODE.business;
  return stored ?? ACCOUNT_MODE.business;
}

export function canSwitchAccountMode(kind: AccountKind): boolean {
  return kind === ACCOUNT_KIND.converted;
}

export function isPostingAsBusiness(mode: AccountMode): boolean {
  return mode === ACCOUNT_MODE.business;
}

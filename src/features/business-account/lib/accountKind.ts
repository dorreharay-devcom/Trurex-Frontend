import { ACCOUNT_KIND, type AccountKind } from '~/features/business-account/config/accountKind';
import { ACCOUNT_MODE, type AccountMode } from '~/features/business-account/config/accountMode';
import type { MyProfile } from '~/features/business-account/types/myProfile';

export function findProfile(
  profiles: readonly MyProfile[],
  kind: AccountMode,
): MyProfile | undefined {
  return profiles.find((profile) => profile.kind === kind);
}

export function resolveAccountKind(profiles: readonly MyProfile[]): AccountKind {
  if (!findProfile(profiles, ACCOUNT_MODE.business)) return ACCOUNT_KIND.regular;
  return findProfile(profiles, ACCOUNT_MODE.personal)
    ? ACCOUNT_KIND.converted
    : ACCOUNT_KIND.businessOnly;
}

export function resolveEffectiveAccountMode(
  kind: AccountKind,
  stored: AccountMode | null | undefined,
): AccountMode {
  if (kind === ACCOUNT_KIND.regular) return ACCOUNT_MODE.personal;
  if (kind === ACCOUNT_KIND.businessOnly) return ACCOUNT_MODE.business;
  return stored ?? ACCOUNT_MODE.personal;
}

export function canSwitchAccountMode(kind: AccountKind): boolean {
  return kind === ACCOUNT_KIND.converted;
}

export function sendsActingHeader(kind: AccountKind, mode: AccountMode): boolean {
  return kind === ACCOUNT_KIND.converted && mode === ACCOUNT_MODE.business;
}

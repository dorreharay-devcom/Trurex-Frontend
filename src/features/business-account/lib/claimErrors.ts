import { BUSINESS_CLAIM_ERROR_CODE } from '~/features/business-account/config/claim';
import { isPlainObject, unknownErrorMessage } from '~/shared/lib/data/guards';

const CLAIM_ERROR_MESSAGES: Record<string, string> = {
  [BUSINESS_CLAIM_ERROR_CODE.alreadyPending]: 'You already have a business claim under review.',
  [BUSINESS_CLAIM_ERROR_CODE.missingTarget]: 'Choose a business to claim.',
  [BUSINESS_CLAIM_ERROR_CODE.notAllowed]: 'Sign in to claim a business.',
  [BUSINESS_CLAIM_ERROR_CODE.placeAlreadyClaimed]: 'This business has already been claimed.',
};

function rpcErrorCode(error: unknown): string | null {
  return isPlainObject(error) && typeof error.code === 'string' ? error.code : null;
}

export function isBusinessClaimAlreadyPending(error: unknown): boolean {
  return rpcErrorCode(error) === BUSINESS_CLAIM_ERROR_CODE.alreadyPending;
}

export function businessClaimErrorMessage(error: unknown): string {
  const known = CLAIM_ERROR_MESSAGES[rpcErrorCode(error) ?? ''];
  return known ?? unknownErrorMessage(error, 'Could not submit your claim. Please try again.');
}

const PROFILE_UPDATE_ERROR_MESSAGES: Record<string, string> = {
  [BUSINESS_CLAIM_ERROR_CODE.notAllowed]: 'Only business accounts can edit a business profile.',
  [BUSINESS_CLAIM_ERROR_CODE.notApproved]:
    'You can edit your business profile once your claim is verified.',
};

export function businessProfileUpdateErrorMessage(error: unknown): string {
  const known = PROFILE_UPDATE_ERROR_MESSAGES[rpcErrorCode(error) ?? ''];
  return (
    known ?? unknownErrorMessage(error, 'Could not save your business profile. Please try again.')
  );
}

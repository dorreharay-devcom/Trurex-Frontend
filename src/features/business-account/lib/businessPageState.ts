import { ACCOUNT_KIND, type AccountKind } from '~/features/business-account/config/accountKind';
import {
  BUSINESS_CLAIM_STATUS,
  type BusinessClaimStatus,
} from '~/features/business-account/config/claimStatus';
import {
  EDIT_BUSINESS_STATUS,
  MY_BUSINESS_PAGE_STATE,
  type EditBusinessStatus,
  type MyBusinessPageState,
} from '~/features/business-account/config/myBusinessPage';

type MyBusinessPageInput = {
  claimStatus: BusinessClaimStatus | null;
  placeId: string | null;
  summary: {
    isPending: boolean;
    isError: boolean;
    isVisible: boolean;
  };
};

type EditBusinessStatusInput = {
  accountLoading: boolean;
  claimStatus: BusinessClaimStatus | null;
  profilePending: boolean;
  profileError: boolean;
};

type BusinessDisplayNameInput = {
  businessName: string | null;
  kind: AccountKind;
  displayName: string | null;
};

export function resolveMyBusinessPageState({
  claimStatus,
  placeId,
  summary,
}: MyBusinessPageInput): MyBusinessPageState {
  if (claimStatus === BUSINESS_CLAIM_STATUS.pending) return MY_BUSINESS_PAGE_STATE.pending;
  if (claimStatus !== BUSINESS_CLAIM_STATUS.approved) return MY_BUSINESS_PAGE_STATE.notClaimed;
  if (!placeId) return MY_BUSINESS_PAGE_STATE.noRexes;
  if (summary.isError) return MY_BUSINESS_PAGE_STATE.error;
  if (summary.isPending) return MY_BUSINESS_PAGE_STATE.loading;
  return summary.isVisible ? MY_BUSINESS_PAGE_STATE.visible : MY_BUSINESS_PAGE_STATE.noRexes;
}

export function resolveEditBusinessStatus({
  accountLoading,
  claimStatus,
  profilePending,
  profileError,
}: EditBusinessStatusInput): EditBusinessStatus {
  if (accountLoading) return EDIT_BUSINESS_STATUS.loading;
  if (claimStatus !== BUSINESS_CLAIM_STATUS.approved) return EDIT_BUSINESS_STATUS.locked;
  if (profileError) return EDIT_BUSINESS_STATUS.error;
  if (profilePending) return EDIT_BUSINESS_STATUS.loading;
  return EDIT_BUSINESS_STATUS.ready;
}

export function resolveBusinessDisplayName({
  businessName,
  kind,
  displayName,
}: BusinessDisplayNameInput): string | null {
  if (businessName) return businessName;
  return kind === ACCOUNT_KIND.businessOnly ? displayName : null;
}

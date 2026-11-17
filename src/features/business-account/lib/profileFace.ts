import { ACCOUNT_KIND, type AccountKind } from '~/features/business-account/config/accountKind';

type ProfileFaceInput = {
  kind: AccountKind | null;
  businessRequested: boolean;
};

export type ProfileFace = {
  businessFace: boolean;
  postedAsBusinessFilter: boolean | null;
};

export function resolveProfileFace({ kind, businessRequested }: ProfileFaceInput): ProfileFace {
  const businessFace =
    kind === ACCOUNT_KIND.businessOnly || (kind === ACCOUNT_KIND.converted && businessRequested);
  return {
    businessFace,
    postedAsBusinessFilter: kind === ACCOUNT_KIND.converted ? businessFace : null,
  };
}

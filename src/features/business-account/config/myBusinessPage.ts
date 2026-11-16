export const MY_BUSINESS_PAGE_STATE = {
  notClaimed: 'notClaimed',
  pending: 'pending',
  loading: 'loading',
  error: 'error',
  noRexes: 'noRexes',
  visible: 'visible',
} as const;

export type MyBusinessPageState =
  (typeof MY_BUSINESS_PAGE_STATE)[keyof typeof MY_BUSINESS_PAGE_STATE];

export const EDIT_BUSINESS_STATUS = {
  loading: 'loading',
  locked: 'locked',
  error: 'error',
  ready: 'ready',
} as const;

export type EditBusinessStatus = (typeof EDIT_BUSINESS_STATUS)[keyof typeof EDIT_BUSINESS_STATUS];

export const CLAIM_FLOW_STEP = {
  find: 'find',
  prompt: 'prompt',
  instructions: 'instructions',
  submitted: 'submitted',
} as const;

export type ClaimFlowStep = (typeof CLAIM_FLOW_STEP)[keyof typeof CLAIM_FLOW_STEP];

export const CLAIM_FLOW_ENTRY = {
  find: 'find',
  subject: 'subject',
} as const;

export type ClaimFlowEntry = (typeof CLAIM_FLOW_ENTRY)[keyof typeof CLAIM_FLOW_ENTRY];

export const CLAIM_SEARCH_MIN_LENGTH = 2;
export const CLAIM_SEARCH_PAGE_SIZE = 20;

export const BUSINESS_CLAIM_ERROR_CODE = {
  alreadyPending: '23505',
  missingTarget: '22023',
  notAllowed: '42501',
  placeAlreadyClaimed: 'BIZ02',
} as const;

export const CLAIM_VERIFICATION_STEPS = [
  'We’ll email you instructions on where and how to submit your verification documents.',
  'Send us documents that prove you own or manage this business.',
  'Our team reviews them and lets you know once your business is verified.',
] as const;

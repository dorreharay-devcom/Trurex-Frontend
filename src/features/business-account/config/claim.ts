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
  {
    title: 'Check your email',
    description:
      'We’ll send you instructions on how and where to submit your verification documents.',
  },
  {
    title: 'Submit your documents',
    description:
      'Send us documents confirming that you own or are authorized to manage this business.',
  },
  {
    title: 'Wait for verification',
    description:
      'Our team will review your documents and notify you once the verification process is complete.',
  },
] as const;

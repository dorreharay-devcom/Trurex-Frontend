/** Official legal site — matches trurex.com. */
export const TRUREX_LEGAL_ORIGIN = 'https://www.trurex.com';

/** Real contact published on trurex.com/privacy. */
export const LEGAL_CONTACT_EMAIL = 'privacy@trurex.com';

/** Bump when terms or community guidelines change to require re-acceptance. */
export const LEGAL_TERMS_VERSION = '2026-07-13';

export const LEGAL_TERMS_STORAGE_KEY = 'trurex.legal.termsAccepted';

export const LEGAL_PATHS = {
  privacy: '/privacy',
} as const;

export const LEGAL_URLS = {
  privacy: `${TRUREX_LEGAL_ORIGIN}${LEGAL_PATHS.privacy}`,
} as const;

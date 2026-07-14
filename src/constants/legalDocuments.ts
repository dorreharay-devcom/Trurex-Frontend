import { LEGAL_CONTACT_EMAIL } from '~/constants/legal';

export type LegalSection = {
  title: string;
  body: string;
};

export type LegalDocumentContent = {
  title: string;
  lastUpdated: string;
  preamble: string[];
  sections: LegalSection[];
};

export const TERMS_OF_USE: LegalDocumentContent = {
  title: 'Terms of Use',
  lastUpdated: 'July 13, 2026',
  preamble: [
    'By creating an account or using TruRex, you agree to these Terms of Use and our Community Guidelines.',
  ],
  sections: [
    {
      title: 'Zero tolerance',
      body: 'TruRex has zero tolerance for objectionable content or abusive users. You may not post, share, or promote content that is unlawful, harassing, hateful, sexually explicit, violent, fraudulent, spam, or otherwise objectionable.',
    },
    {
      title: 'User-generated content',
      body: 'You are responsible for content you submit. We may remove content that violates these terms.',
    },
    {
      title: 'Reporting and enforcement',
      body: 'Users can report objectionable content and block other users. We review reports and aim to act on valid reports within 24 hours, including removing content and restricting or terminating accounts when appropriate.',
    },
    {
      title: 'Account termination',
      body: 'You may delete your account at any time in Edit Profile. We may suspend or terminate accounts that violate these terms.',
    },
    {
      title: 'Contact',
      body: LEGAL_CONTACT_EMAIL,
    },
  ],
};

export const COMMUNITY_GUIDELINES: LegalDocumentContent = {
  title: 'Community Guidelines',
  lastUpdated: 'July 13, 2026',
  preamble: [
    'TruRex is a community for sharing recommendations. Follow these rules to keep it safe and useful.',
  ],
  sections: [
    {
      title: 'Be respectful',
      body: 'Do not harass, bully, threaten, or target other people.',
    },
    {
      title: 'No objectionable content',
      body: 'Do not post content that is hateful, sexually explicit, violent, illegal, misleading, or otherwise objectionable.',
    },
    {
      title: 'No abuse or spam',
      body: 'Do not impersonate others, manipulate ratings, or flood the service with spam.',
    },
    {
      title: 'Report and block',
      body: 'Use in-app tools to report objectionable content and block abusive users. Our team reviews reports.',
    },
    {
      title: 'Enforcement',
      body: 'We may remove content or terminate accounts that break these guidelines. There is zero tolerance for severe or repeated violations.',
    },
    {
      title: 'Contact',
      body: LEGAL_CONTACT_EMAIL,
    },
  ],
};

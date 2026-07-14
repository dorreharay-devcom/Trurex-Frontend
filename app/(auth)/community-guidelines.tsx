import React from 'react';
import { LegalDocumentScreen } from '~/components/auth/LegalDocumentScreen';
import { COMMUNITY_GUIDELINES } from '~/constants/legalDocuments';

export default function CommunityGuidelinesScreen() {
  return <LegalDocumentScreen document={COMMUNITY_GUIDELINES} />;
}

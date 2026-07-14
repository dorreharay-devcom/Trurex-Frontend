import React from 'react';
import { LegalDocumentScreen } from '~/components/auth/LegalDocumentScreen';
import {
  COMMUNITY_GUIDELINES_BODY,
  COMMUNITY_GUIDELINES_TITLE,
} from '~/constants/legalDocuments';

export default function CommunityGuidelinesScreen() {
  return (
    <LegalDocumentScreen title={COMMUNITY_GUIDELINES_TITLE} body={COMMUNITY_GUIDELINES_BODY} />
  );
}

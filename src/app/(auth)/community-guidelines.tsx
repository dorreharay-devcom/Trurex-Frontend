import LegalDocumentScreen from '~/features/auth/ui/legal/LegalDocumentScreen';
import { COMMUNITY_GUIDELINES } from '~/features/auth/config/legalDocuments';

export default function CommunityGuidelinesRoute() {
  return <LegalDocumentScreen document={COMMUNITY_GUIDELINES} />;
}

import LegalDocumentScreen from '~/features/auth/ui/legal/LegalDocumentScreen';
import { PRIVACY_POLICY } from '~/features/auth/config/legalDocuments';

export default function PrivacyRoute() {
  return <LegalDocumentScreen document={PRIVACY_POLICY} />;
}

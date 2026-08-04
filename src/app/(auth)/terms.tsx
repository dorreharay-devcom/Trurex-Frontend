import LegalDocumentScreen from '~/features/auth/ui/legal/LegalDocumentScreen';
import { TERMS_OF_USE } from '~/features/auth/config/legalDocuments';

export default function TermsRoute() {
  return <LegalDocumentScreen document={TERMS_OF_USE} />;
}

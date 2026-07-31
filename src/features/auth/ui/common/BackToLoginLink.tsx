import React from 'react';
import { ArrowLeft } from 'lucide-react-native';
import AuthLinkButton, {
  authLinkIconColorByTone,
  type AuthLinkTone,
} from '~/features/auth/ui/common/AuthLinkButton';

type Props = {
  onPress: () => void;
  tone?: AuthLinkTone;
  centered?: boolean;
};

const BackToLoginLink = ({ onPress, tone = 'muted', centered = false }: Props) => (
  <AuthLinkButton
    title="Back to sign in"
    onPress={onPress}
    tone={tone}
    centered={centered}
    icon={<ArrowLeft size={16} color={authLinkIconColorByTone[tone]} />}
  />
);

export default BackToLoginLink;

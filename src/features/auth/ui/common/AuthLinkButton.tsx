import React from 'react';
import { Button, ButtonVariant } from '~/shared/ui/primitives/Button';
import { Theme } from '~/shared/theme/Theme';
import { cn } from '~/shared/lib/ui/styles';

export type AuthLinkTone = 'muted' | 'accent';

export const authLinkIconColorByTone: Record<AuthLinkTone, string> = {
  muted: Theme.colors.muted,
  accent: Theme.colors.accentForeground,
};

const textClassByTone: Record<AuthLinkTone, string> = {
  muted: 'text-sm text-muted-foreground font-normal',
  accent: 'text-sm text-accent-foreground font-normal',
};

type Props = {
  title: string;
  onPress: () => void;
  tone?: AuthLinkTone;
  icon?: React.ReactNode;
  centered?: boolean;
  disabled?: boolean;
};

const AuthLinkButton = ({ title, onPress, tone = 'muted', icon, centered, disabled }: Props) => (
  <Button
    variant={ButtonVariant.Link}
    onPress={onPress}
    icon={icon}
    title={title}
    disabled={disabled}
    textClassName={textClassByTone[tone]}
    className={cn('hover:no-underline active:no-underline', centered && 'self-center')}
  />
);

export default AuthLinkButton;

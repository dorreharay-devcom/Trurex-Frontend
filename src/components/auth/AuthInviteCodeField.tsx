import React from 'react';
import { InviteCodeInput } from '~/components/auth/InviteCodeInput';
import type { AuthInviteCodeFieldState } from '~/hooks/auth/useAuthInviteCode';

type Props = {
  invite: AuthInviteCodeFieldState;
};

export function AuthInviteCodeField({ invite }: Props) {
  if (!invite.enabled) return null;

  return (
    <InviteCodeInput
      ref={invite.inputRef}
      value={invite.value}
      onChange={invite.onChange}
      error={invite.error}
    />
  );
}

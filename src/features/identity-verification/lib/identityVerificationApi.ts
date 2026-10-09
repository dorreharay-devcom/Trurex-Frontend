import { Backend, unwrap } from '~/shared/api/client';

type CreateVerificationSessionResult = {
  url: string;
};

export async function createIdentityVerificationSession(): Promise<string> {
  const result = unwrap<CreateVerificationSessionResult>(
    await Backend.functions.invoke<CreateVerificationSessionResult>(
      'create-identity-verification-session',
      { method: 'POST' },
    ),
  );
  return result.url;
}

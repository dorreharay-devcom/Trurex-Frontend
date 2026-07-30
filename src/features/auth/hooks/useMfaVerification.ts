import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Routes } from '~/shared/config/routes';
import { useAuth } from '~/features/auth/providers/AuthProvider';
import {
  MfaErrorCode,
  MfaMessage,
  MFA_RESTART_NOTICES,
  getMfaErrorCode,
  initiateMfa,
  verifyMfaCode,
  getDeviceFingerprint,
} from '~/features/auth/lib/mfa';
import { unknownErrorMessage } from '~/utils';

const MIN_CODE_LENGTH = 6;

type Pending = 'idle' | 'verify' | 'resend';
type Feedback = { tone: 'error' | 'notice'; text: string };

export function useMfaVerification() {
  const router = useRouter();
  const { session, mfaPending, setMfaPending, signOut } = useAuth();

  const [code, setCode] = useState('');
  const [trustDevice, setTrustDevice] = useState(true);
  const [pending, setPending] = useState<Pending>('idle');
  const [feedback, setFeedback] = useState<Feedback>();

  const busy = pending !== 'idle';
  const trimmedCode = code.trim();
  const canSubmit = !busy && trimmedCode.length >= MIN_CODE_LENGTH;
  const redirectTo = !session ? Routes.Login : !mfaPending ? Routes.Main : null;

  async function restartMfa(message: string) {
    const deviceFingerprint = await getDeviceFingerprint();
    const result = await initiateMfa(deviceFingerprint);

    if (!result.required) {
      await setMfaPending(false);
      router.replace(Routes.Main);
      return;
    }

    setCode('');
    setFeedback({ tone: 'notice', text: message });
  }

  function onCodeChange(value: string) {
    setCode(value.replace(/\D/g, '').slice(0, MIN_CODE_LENGTH));
    setFeedback(undefined);
  }

  async function handleVerifyFailure(err: unknown) {
    const mfaCode = getMfaErrorCode(err);

    if (mfaCode === MfaErrorCode.InvalidCode) {
      setFeedback({ tone: 'error', text: MfaMessage.invalidCode });
      return;
    }

    const restartNotice = mfaCode ? MFA_RESTART_NOTICES[mfaCode] : undefined;
    if (restartNotice) {
      try {
        await restartMfa(restartNotice);
      } catch (restartError) {
        setFeedback({
          tone: 'error',
          text: unknownErrorMessage(restartError, MfaMessage.resendFailed),
        });
      }
      return;
    }

    setFeedback({
      tone: 'error',
      text: unknownErrorMessage(err, MfaMessage.verifyFailed),
    });
  }

  async function handleVerify() {
    if (trimmedCode.length < MIN_CODE_LENGTH) {
      setFeedback({ tone: 'error', text: MfaMessage.enterCode });
      return;
    }

    setPending('verify');
    setFeedback(undefined);

    try {
      const deviceFingerprint = await getDeviceFingerprint();
      const result = await verifyMfaCode({
        code: trimmedCode,
        deviceFingerprint,
        trustDevice,
      });

      if (!result.success) {
        throw new Error(MfaMessage.verifyFailed);
      }

      await setMfaPending(false);
      router.replace(Routes.Main);
    } catch (err) {
      await handleVerifyFailure(err);
    } finally {
      setPending('idle');
    }
  }

  async function handleResend() {
    setPending('resend');
    setFeedback(undefined);
    try {
      await restartMfa(MfaMessage.resendSuccess);
    } catch (err) {
      setFeedback({
        tone: 'error',
        text: unknownErrorMessage(err, MfaMessage.resendFailed),
      });
    } finally {
      setPending('idle');
    }
  }

  async function handleBackToLogin() {
    await signOut().catch(() => {});
    router.replace(Routes.Login);
  }

  return {
    redirectTo,
    code,
    trustDevice,
    busy,
    verifying: pending === 'verify',
    resending: pending === 'resend',
    error: feedback?.tone === 'error' ? feedback.text : undefined,
    notice: feedback?.tone === 'notice' ? feedback.text : undefined,
    canSubmit,
    onCodeChange,
    toggleTrustDevice: () => setTrustDevice((value) => !value),
    handleVerify,
    handleResend,
    handleBackToLogin,
  };
}

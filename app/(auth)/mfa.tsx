import React, { useCallback, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { Redirect, useRouter } from 'expo-router';
import AuthLayout from '~/components/common/AuthLayout';
import { Button, ButtonVariant } from '~/components/common/Button';
import Input from '~/components/common/Input';
import { Routes } from '~/constants/routes';
import { Theme } from '~/theme/Theme';
import { getDeviceFingerprint, getMfaErrorCode, initiateMfa, verifyMfaCode } from '~/auth/mfa';
import { useAuth } from '~/services/AuthContext';
import { cn } from '~/utils/general';
import { unknownErrorMessage } from '~/utils';

const MIN_CODE_LENGTH = 6;

const restartMessages: Record<string, string> = {
  MFA01: 'We sent a new verification code. Please try again.',
  MFA02: 'That code expired. We sent a new verification code.',
  MFA03: 'Too many attempts. We sent a new verification code.',
};

export default function MfaScreen() {
  const router = useRouter();
  const { session, mfaPending, setMfaPending, signOut } = useAuth();
  const [code, setCode] = useState('');
  const [trustDevice, setTrustDevice] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string>();
  const [notice, setNotice] = useState<string>();

  const trimmedCode = code.trim();
  const verifyDisabled = submitting || resending || trimmedCode.length < MIN_CODE_LENGTH;

  const restartMfa = useCallback(
    async (message: string) => {
      const deviceFingerprint = await getDeviceFingerprint();
      const result = await initiateMfa(deviceFingerprint);

      if (!result.required) {
        await setMfaPending(false);
        router.replace(Routes.Main);
        return;
      }

      setCode('');
      setError(undefined);
      setNotice(message);
    },
    [router, setMfaPending],
  );

  const handleVerify = async () => {
    if (trimmedCode.length < MIN_CODE_LENGTH) {
      setError('Enter the 6-digit verification code.');
      return;
    }

    setSubmitting(true);
    setError(undefined);
    setNotice(undefined);

    try {
      const deviceFingerprint = await getDeviceFingerprint();
      const result = await verifyMfaCode({
        code: trimmedCode,
        deviceFingerprint,
        trustDevice,
      });

      if (!result.success) {
        throw new Error('Verification failed. Please try again.');
      }

      await setMfaPending(false);
      router.replace(Routes.Main);
    } catch (err) {
      const mfaCode = getMfaErrorCode(err);
      if (mfaCode === 'MFA04') {
        setError('Invalid code. Please check the email and try again.');
      } else if (mfaCode && restartMessages[mfaCode]) {
        try {
          await restartMfa(restartMessages[mfaCode]);
        } catch (restartError) {
          setError(
            unknownErrorMessage(
              restartError,
              'Could not send a new verification code. Please try again.',
            ),
          );
        }
      } else {
        setError(unknownErrorMessage(err, 'Verification failed. Please try again.'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError(undefined);
    setNotice(undefined);
    try {
      await restartMfa('We sent a new verification code.');
    } catch (err) {
      setError(
        unknownErrorMessage(err, 'Could not send a new verification code. Please try again.'),
      );
    } finally {
      setResending(false);
    }
  };

  const handleBackToLogin = async () => {
    await signOut().catch(() => {});
    router.replace(Routes.Login);
  };

  if (!session) {
    return <Redirect href={Routes.Login} />;
  }

  if (!mfaPending) {
    return <Redirect href={Routes.Main} />;
  }

  return (
    <AuthLayout>
      <View className="items-center gap-4">
        <Image
          source={require('../../assets/truRexLogo.png')}
          style={{ height: 40, resizeMode: 'contain' }}
        />
        <View className="items-center gap-1">
          <Text className="text-lg font-semibold text-foreground">Verify your sign in</Text>
          <Text className="text-center text-sm text-muted-foreground">
            We sent a one-time code to your email for this new device.
          </Text>
        </View>
      </View>

      <View className="gap-5">
        <Input
          label="Verification code"
          value={code}
          onChangeText={(value) => {
            setCode(value.replace(/\D/g, '').slice(0, 6));
            setError(undefined);
            setNotice(undefined);
          }}
          placeholder="123456"
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="one-time-code"
          error={error}
        />

        {notice ? (
          <Text className="text-center text-xs text-muted-foreground">{notice}</Text>
        ) : null}

        <Pressable
          onPress={() => setTrustDevice((value) => !value)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: trustDevice }}
          className="flex-row items-center gap-2 self-start active:opacity-90"
        >
          <View
            className={cn(
              'h-5 w-5 items-center justify-center rounded border',
              trustDevice ? 'border-primary bg-primary' : 'border-muted-foreground bg-transparent',
            )}
          >
            {trustDevice ? <Check size={13} color={Theme.colors.primaryForeground} /> : null}
          </View>
          <Text className="text-sm text-foreground">Trust this device for 30 days</Text>
        </Pressable>

        <Button
          title="Verify"
          onPress={handleVerify}
          loading={submitting}
          disabled={verifyDisabled}
          className="w-full"
        />

        <View className="items-center gap-3">
          <Button
            title={resending ? 'Sending...' : 'Send a new code'}
            onPress={handleResend}
            variant={ButtonVariant.Link}
            disabled={submitting || resending}
            textClassName="text-sm text-muted-foreground font-normal"
            className="self-center hover:no-underline active:no-underline"
          />
          <Button
            title="Back to sign in"
            onPress={handleBackToLogin}
            variant={ButtonVariant.Link}
            disabled={submitting || resending}
            textClassName="text-sm text-muted-foreground font-normal"
            className="self-center hover:no-underline active:no-underline"
          />
        </View>
      </View>
    </AuthLayout>
  );
}

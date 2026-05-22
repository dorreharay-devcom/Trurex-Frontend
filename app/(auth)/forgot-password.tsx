import React, { useState } from 'react';
import { View, Text, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthApi } from '~/api/AuthApi';
import { Routes } from '~/constants/routes';
import { Button, ButtonVariant } from '~/components/common/Button';
import AuthLayout from '~/components/common/AuthLayout';
import Input from '~/components/common/Input';
import { ArrowLeft } from 'lucide-react-native';
import { Theme } from '~/theme/Theme';
import { getRedirectUrl } from '~/utils';
import { mapAuthError } from '~/utils/errors';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const isWeb = Platform.OS === 'web';
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string>();
  const resetDisabled = loading || !email;

  const handleReset = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Enter a valid email address');
      return;
    }

    setLoading(true);
    setError(undefined);
    const redirectTo = `${getRedirectUrl()}/reset-password`;

    try {
      await AuthApi.resetPassword(email, redirectTo);
      setSent(true);
    } catch (err: unknown) {
      mapAuthError(err, (e) => setError(e.email || e.general));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <View className="items-center">
        <Image
          source={require('../../assets/truRexLogo.png')}
          style={{ height: 40, resizeMode: 'contain' }}
        />
      </View>

      {sent ? (
        <View className={isWeb ? 'items-center space-y-4' : 'items-center gap-4'}>
          <Text className="text-lg font-semibold text-foreground">Check your email</Text>
          <Text className="text-sm text-muted-foreground text-center">
            We sent a password reset link to{' '}
            <Text className="font-medium text-foreground">{email}</Text>
          </Text>
          <Button
            variant={ButtonVariant.Link}
            onPress={() => router.replace(Routes.Login)}
            icon={<ArrowLeft size={16} color={Theme.colors.accentForeground} />}
            title="Back to sign in"
            textClassName="text-sm text-accent-foreground font-normal"
          />
        </View>
      ) : (
        <View className={isWeb ? 'space-y-8' : 'gap-8'}>
          <View className="items-center">
            <Text className="text-lg font-semibold text-foreground">Reset your password</Text>
            <Text className="text-sm text-muted-foreground mt-1 text-center">
              Enter your email and we'll send you a reset link
            </Text>
          </View>

          <View className={isWeb ? 'space-y-4' : 'gap-4'}>
            <Input
              label="Email"
              value={email}
              onChangeText={(v) => {
                setEmail(v);
                setError(undefined);
              }}
              placeholder="you@example.com"
              keyboardType="email-address"
              error={error}
            />

            <View className={resetDisabled && isWeb ? 'w-full cursor-not-allowed' : 'w-full'}>
              <Button
                title="Send reset link"
                onPress={handleReset}
                loading={loading}
                disabled={resetDisabled}
                className="w-full"
              />
            </View>
          </View>

          <Button
            variant={ButtonVariant.Link}
            onPress={() => router.replace(Routes.Login)}
            icon={<ArrowLeft size={16} color={Theme.colors.muted} />}
            title="Back to sign in"
            textClassName="text-sm text-muted-foreground font-normal"
            className="self-center"
          />
        </View>
      )}
    </AuthLayout>
  );
}

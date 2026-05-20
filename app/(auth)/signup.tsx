import React, { useState } from 'react';
import { View, Text, Image, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthApi } from '~/api/AuthApi';
import { Routes } from '~/constants/routes';
import { Button } from '~/components/common/Button';
import AuthLayout from '~/components/common/AuthLayout';
import Input from '~/components/common/Input';
import { OAuthSocialButtons } from '~/components/auth/OAuthSocialButtons';
import { useOAuthSignIn } from '~/hooks/auth/useOAuthSignIn';
import { getRedirectUrl } from '~/utils';
import { mapAuthError } from '~/utils/errors';

export default function SignupScreen() {
  const router = useRouter();
  const { signInWithOAuth, oauthPending } = useOAuthSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next: typeof errors = {};
    if (!fullName.trim()) next.fullName = 'Full name is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) next.email = 'Enter a valid email address';
    if (password.length < 6) next.password = 'Password must be at least 6 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      await AuthApi.signUp({
        email,
        password,
        redirectTo: getRedirectUrl(),
        displayName: fullName,
      });
      Alert.alert('Check your email', 'We sent you a confirmation link to verify your account.');
      router.replace(Routes.Login);
    } catch (error: unknown) {
      mapAuthError(error, setErrors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <View className="items-center gap-4">
        <Image
          source={require('../../assets/truRexLogo.png')}
          style={{ height: 40, resizeMode: 'contain' }}
        />
        <Text className="text-sm text-muted-foreground">Create your TruRex account</Text>
      </View>

      <OAuthSocialButtons
        disabled={oauthPending || loading}
        onGooglePress={() => signInWithOAuth('google')}
        onApplePress={() => signInWithOAuth('apple')}
      />

      <View className="flex-row items-center gap-3">
        <View className="flex-1 h-px bg-border" />
        <Text className="text-xs text-muted-foreground">or</Text>
        <View className="flex-1 h-px bg-border" />
      </View>

      <View className="gap-6">
        <Input
          label="Full name"
          value={fullName}
          onChangeText={(v) => {
            setFullName(v);
            setErrors((e) => ({ ...e, fullName: undefined, general: undefined }));
          }}
          placeholder="Jane Doe"
          autoCapitalize="words"
          error={errors.fullName}
        />

        <Input
          label="Email"
          value={email}
          onChangeText={(v) => {
            setEmail(v);
            setErrors((e) => ({ ...e, email: undefined, general: undefined }));
          }}
          placeholder="you@example.com"
          keyboardType="email-address"
          error={errors.email}
        />

        <Input
          label="Password"
          value={password}
          onChangeText={(v) => {
            setPassword(v);
            setErrors((e) => ({ ...e, password: undefined, general: undefined }));
          }}
          placeholder="At least 6 characters"
          secure
          error={errors.password}
        />

        <Button
          title="Create account"
          onPress={handleSignup}
          loading={loading}
          disabled={loading}
          className="w-full"
        />
        {errors.general && (
          <Text className="mt-1 text-xs text-center text-destructive">{errors.general}</Text>
        )}
      </View>

      <View className="flex-row items-center justify-center">
        <Text className="text-sm text-center text-muted-foreground">Already have an account? </Text>
        <TouchableOpacity
          onPress={() => router.replace(Routes.Login)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Sign in"
        >
          <Text className="text-sm font-medium text-foreground">Sign in</Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}

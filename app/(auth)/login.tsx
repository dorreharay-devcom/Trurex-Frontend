import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthApi } from '~/api/AuthApi';
import { Routes } from '~/constants/routes';
import { Button } from '~/components/common/Button';
import AuthLayout from '~/components/common/AuthLayout';
import Input from '~/components/common/Input';
import { OAuthSocialButtons } from '~/components/auth/OAuthSocialButtons';
import { useOAuthSignIn } from '~/hooks/auth/useOAuthSignIn';
import { mapAuthError } from '~/utils/errors';

export default function LoginScreen() {
  const router = useRouter();
  const isWeb = Platform.OS === 'web';
  const { signInWithOAuth, oauthPending } = useOAuthSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next: typeof errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) next.email = 'Enter a valid email address';
    if (password.length < 6) next.password = 'Password must be at least 6 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      await AuthApi.signIn({ email, password });
      router.replace(Routes.Main);
    } catch (error: unknown) {
      mapAuthError(error, setErrors);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordPress = () => {
    router.push(Routes.ForgotPassword);
  };

  return (
    <AuthLayout>
      <View className="items-center gap-4">
        <Image
          source={require('../../assets/truRexLogo.png')}
          style={{ height: 40, resizeMode: 'contain' }}
        />
        <Text className="text-muted-foreground text-sm">Sign in to your account</Text>
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
          labelRight={
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleForgotPasswordPress}
              hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
              style={
                isWeb ? undefined : { minHeight: 32, paddingLeft: 12, justifyContent: 'center' }
              }
              accessibilityRole="button"
              accessibilityLabel="Forgot password"
            >
              <Text
                pointerEvents="none"
                className={
                  isWeb
                    ? 'text-xs font-medium text-muted-foreground hover:underline'
                    : 'text-xs font-medium text-muted-foreground'
                }
              >
                Forgot password?
              </Text>
            </TouchableOpacity>
          }
          value={password}
          onChangeText={(v) => {
            setPassword(v);
            setErrors((e) => ({ ...e, password: undefined, general: undefined }));
          }}
          placeholder="••••••••"
          secure
          error={errors.password}
        />

        <Button
          title="Sign in"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          className="w-full"
        />
        {errors.general && (
          <Text className="mt-1 text-xs text-destructive text-center">{errors.general}</Text>
        )}
      </View>

      <View className="flex-row items-center justify-center">
        <Text className="text-sm text-muted-foreground mr-1">Don't have an account?</Text>
        <TouchableOpacity
          onPress={() => router.push(Routes.Signup)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Sign up"
        >
          <Text className="text-sm text-foreground font-medium">Sign up</Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}

import React, { useState } from 'react';
import { View, Text, Image, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { AuthApi } from '~/api/AuthApi';
import { Routes } from '~/constants/routes';
import { Button, ButtonVariant } from '~/components/common/Button';
import AuthLayout from '~/components/common/AuthLayout';
import Input from '~/components/common/Input';
import { Globe as GoogleIcon, Apple as AppleIcon } from 'lucide-react-native';
import { Theme } from '~/theme/Theme';
import { isWeb, getRedirectUrl } from '~/utils';
import { mapAuthError } from '~/utils/errors';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
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

  const handleOAuth = async (provider: 'google' | 'apple') => {
    try {
      const data = await AuthApi.signInWithOAuth(provider);
      if (!isWeb && data?.url) {
        await WebBrowser.openAuthSessionAsync(data.url, getRedirectUrl());
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      Alert.alert(`${provider === 'google' ? 'Google' : 'Apple'} sign-in failed`, message);
    }
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

      <View className="space-y-3">
        <Button
          variant={ButtonVariant.Outline}
          title="Continue with Google"
          onPress={() => handleOAuth('google')}
          icon={<GoogleIcon size={16} color={Theme.colors.foreground} />}
          className="w-full bg-card"
        />
        <Button
          variant={ButtonVariant.Outline}
          title="Continue with Apple"
          onPress={() => handleOAuth('apple')}
          icon={<AppleIcon size={16} color={Theme.colors.foreground} />}
          className="w-full bg-card"
        />
      </View>

      <View className="flex-row items-center gap-3">
        <View className="flex-1 h-px bg-border" />
        <Text className="text-xs text-muted-foreground">or</Text>
        <View className="flex-1 h-px bg-border" />
      </View>

      <View className="space-y-4">
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
            <Button
              variant={ButtonVariant.Link}
              onPress={() => router.push(Routes.ForgotPassword)}
              title="Forgot password?"
              textClassName="text-xs text-accent font-medium hover:underline"
            />
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
        <TouchableOpacity onPress={() => router.push(Routes.Signup)}>
          <Text className="text-sm text-foreground font-medium hover:underline">Sign up</Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}

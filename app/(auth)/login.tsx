import React, { useState } from 'react';
import { View, Text, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { Auth } from '~/services/AuthService';
import { useAuth } from '~/services/AuthContext';
import { Routes } from '~/constants/routes';
import { Button, ButtonVariant } from '~/components/common/Button';
import AuthLayout from '~/components/common/AuthLayout';
import Input from '~/components/common/Input';
import { Globe as GoogleIcon, Apple as AppleIcon } from 'lucide-react-native';
import { Theme } from '~/theme/Theme';
import { isWeb } from '~/utils';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { loginAsGuest } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const getRedirectUrl = () => (isWeb ? window.location.origin : Linking.createURL('/'));

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await Auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      Alert.alert('Login failed', error.message);
    } else {
      router.replace(Routes.Main);
    }
  };

  const handleOAuth = async (provider: 'google' | 'apple') => {
    const redirectUrl = getRedirectUrl();
    const { data, error } = await Auth.signInWithOAuth({
      provider,
      options: { redirectTo: redirectUrl },
    });
    if (error) {
      Alert.alert(`${provider === 'google' ? 'Google' : 'Apple'} sign-in failed`, error.message);
      return;
    }
    if (!isWeb && data.url) {
      await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
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
          className="w-full"
        />
        <Button
          variant={ButtonVariant.Outline}
          title="Continue with Apple"
          onPress={() => handleOAuth('apple')}
          icon={<AppleIcon size={16} color={Theme.colors.foreground} />}
          className="w-full"
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
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
        />

        <Input
          label="Password"
          labelRight={
            <Button
              variant={ButtonVariant.Link}
              onPress={() => router.push(Routes.ForgotPassword)}
              title="Forgot password?"
              textClassName="text-xs text-accent-foreground font-normal"
            />
          }
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secure
        />

        <Button
          title="Sign in"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          className="w-full"
        />
      </View>

      <Button
        variant={ButtonVariant.Muted}
        title="Continue as Guest"
        onPress={() => {
          loginAsGuest();
          router.replace(Routes.Main);
        }}
        className="w-full"
      />

      <Text className="text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Text className="text-foreground font-medium" onPress={() => router.push(Routes.Signup)}>
          Sign up
        </Text>
      </Text>
    </AuthLayout>
  );
}

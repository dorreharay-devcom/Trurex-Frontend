import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { Auth } from '~/services/AuthService';
import { Routes } from '~/constants/routes';
import { Button } from '~/components/common/Button';
import AuthLayout from '~/components/common/AuthLayout';
import Input from '~/components/common/Input';
import { Globe as GoogleIcon, Apple as AppleIcon } from 'lucide-react-native';
import { Theme } from '~/theme/Theme';
import { isWeb } from '~/utils';

WebBrowser.maybeCompleteAuthSession();

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const getRedirectUrl = () => (isWeb ? window.location.origin : Linking.createURL('/'));

  const handleSignup = async () => {
    setLoading(true);
    const { error } = await Auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getRedirectUrl(),
        data: { full_name: fullName },
      },
    });
    setLoading(false);
    if (error) {
      Alert.alert('Signup failed', error.message);
    } else {
      Alert.alert('Check your email', 'We sent you a confirmation link to verify your account.');
      router.replace(Routes.Login);
    }
  };

  const handleOAuth = async (provider: 'google' | 'apple') => {
    const redirectUrl = getRedirectUrl();
    const { data, error } = await Auth.signInWithOAuth({
      provider,
      options: { redirectTo: redirectUrl },
    });
    if (error) {
      Alert.alert(`${provider} sign-up failed`, error.message);
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
        <Text className="text-muted-foreground text-sm">Create your TruRex account</Text>
      </View>

      <View className="space-y-3">
        <TouchableOpacity
          onPress={() => handleOAuth('google')}
          className="w-full flex-row items-center justify-center gap-2 py-2.5 rounded-lg bg-card border border-border"
        >
          <GoogleIcon size={16} color={Theme.colors.foreground} />
          <Text className="text-foreground font-medium text-sm">Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleOAuth('apple')}
          className="w-full flex-row items-center justify-center gap-2 py-2.5 rounded-lg bg-card border border-border"
        >
          <AppleIcon size={16} color={Theme.colors.foreground} />
          <Text className="text-foreground font-medium text-sm">Continue with Apple</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center gap-3">
        <View className="flex-1 h-px bg-border" />
        <Text className="text-xs text-muted-foreground">or</Text>
        <View className="flex-1 h-px bg-border" />
      </View>

      <View className="space-y-4">
        <Input
          label="Full name"
          value={fullName}
          onChangeText={setFullName}
          placeholder="Jane Doe"
          autoCapitalize="words"
        />

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
        />

        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="At least 6 characters"
          secure
        />

        <Button
          title="Create account"
          onPress={handleSignup}
          loading={loading}
          disabled={loading}
          className="w-full"
        />
      </View>

      <Text className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Text className="text-foreground font-medium" onPress={() => router.replace(Routes.Login)}>
          Sign in
        </Text>
      </Text>
    </AuthLayout>
  );
}

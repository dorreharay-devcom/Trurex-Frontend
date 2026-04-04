import React, { useState } from 'react';
import { View, Text, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { Auth } from '~/services/AuthService';
import { Routes } from '~/constants/routes';
import { Button, ButtonVariant } from '~/components/common/Button';
import AuthLayout from '~/components/common/AuthLayout';
import Input from '~/components/common/Input';
import { ArrowLeft } from 'lucide-react-native';
import { Theme } from '~/theme/Theme';
import { isWeb } from '~/utils';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    setLoading(true);
    const redirectTo = isWeb
      ? `${window.location.origin}/reset-password`
      : Linking.createURL('/reset-password');
    const { error } = await Auth.resetPasswordForEmail(email, { redirectTo });
    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setSent(true);
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
        <View className="items-center space-y-4">
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
        <View className="space-y-8">
          <View className="items-center">
            <Text className="text-lg font-semibold text-foreground">Reset your password</Text>
            <Text className="text-sm text-muted-foreground mt-1 text-center">
              Enter your email and we'll send you a reset link
            </Text>
          </View>

          <View className="space-y-4">
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
            />

            <Button
              title="Send reset link"
              onPress={handleReset}
              loading={loading}
              disabled={loading || !email}
              className="w-full"
            />
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

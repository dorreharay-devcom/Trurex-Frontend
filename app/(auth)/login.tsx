import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Routes } from '~/constants/routes';
import { Button } from '~/components/common/Button';
import { Container } from '~/components/common/Container';
import { Apple as AppleIcon, Mail, Lock, Globe as GoogleIcon } from 'lucide-react-native';
import { Theme } from '~/theme/Theme';

export default function AuthScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    router.replace(Routes.Main);
  };

  const handleSignUp = () => {
    console.log('Sign up pressed');
  };

  const handleGoogleLogin = () => {
    console.log('Google login pressed');
  };

  const handleAppleLogin = () => {
    console.log('Apple login pressed');
  };

  return (
    <Container>
      <View className="flex-1 justify-center px-8 py-12">
        <View className="items-center mb-12">
          <Text className="text-5xl font-extrabold text-black tracking-tighter">truRex</Text>
          <View className="h-1 w-12 bg-gold mt-2 rounded-full" />
          <Text className="text-gray-400 mt-4 text-center font-medium tracking-wide">
            REDEFINING LUXURY ASSETS
          </Text>
        </View>

        <View className="space-y-6">
          <View>
            <View className="flex-row items-center mb-2 ml-1">
              <Mail size={14} color={Theme.colors.secondaryText} />
              <Text className="text-xs text-gray-400 uppercase font-black tracking-[2px] ml-2">
                Email Address
              </Text>
            </View>
            <TextInput
              className="p-4 bg-gray-50 rounded-2xl text-base text-black border border-gray-100 shadow-sm"
              onChangeText={setEmail}
              value={email}
              placeholder="Enter your email"
              placeholderTextColor={Theme.colors.secondaryText}
              autoCapitalize={'none'}
            />
          </View>

          <View>
            <View className="flex-row items-center mb-2 ml-1">
              <Lock size={14} color={Theme.colors.secondaryText} />
              <Text className="text-xs text-gray-400 uppercase font-black tracking-[2px] ml-2">
                Password
              </Text>
            </View>
            <TextInput
              className="p-4 bg-gray-50 rounded-2xl text-base text-black border border-gray-100 shadow-sm"
              onChangeText={setPassword}
              value={password}
              secureTextEntry={true}
              placeholder="••••••••"
              placeholderTextColor={Theme.colors.secondaryText}
              autoCapitalize={'none'}
            />
          </View>

          <View className="mt-4 space-y-3">
            <Button
              title="Sign In"
              onPress={handleSignIn}
              className="w-full h-[56px] rounded-2xl bg-black"
            />
            <TouchableOpacity onPress={handleSignUp}>
              <Text className="text-center text-gray-500 font-medium">
                Don't have an account? <Text className="text-black font-bold">Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center my-10">
            <View className="flex-1 h-[0.5px] bg-gray-200" />
            <Text className="mx-4 text-xs text-gray-400 uppercase font-bold tracking-widest">
              OR CONTINUE WITH
            </Text>
            <View className="flex-1 h-[0.5px] bg-gray-200" />
          </View>

          <View className="flex-row space-x-4">
            <TouchableOpacity
              onPress={handleGoogleLogin}
              className="flex-1 flex-row items-center justify-center bg-white border border-gray-200 h-[56px] rounded-2xl shadow-sm"
            >
              <GoogleIcon size={20} color={Theme.colors.black} />
              <Text className="ml-3 font-bold text-black">Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleAppleLogin}
              className="flex-1 flex-row items-center justify-center bg-black h-[56px] rounded-2xl shadow-sm"
            >
              <AppleIcon size={20} color={Theme.colors.white} />
              <Text className="ml-3 font-bold text-white">Apple</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Container>
  );
}

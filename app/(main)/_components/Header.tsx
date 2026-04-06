import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { Search, PlusCircle, LogOut, UserCircle2 } from 'lucide-react-native';
import { Auth } from '~/services/AuthService';
import { Theme } from '~/theme/Theme';
import { isWeb } from '~/utils';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onProfilePress: () => void;
  onAddPress: () => void;
}

export const Header: React.FC<HeaderProps> = ({ searchQuery, onSearchChange, onProfilePress, onAddPress }) => {
  const { width } = useWindowDimensions();
  const isMobile = !isWeb || width < 640;

  return (
    <View className="bg-card border-b border-border">
      <View className={isWeb ? 'max-w-[1280px] w-full self-center pr-4' : 'pr-4'}>
        <View className="h-16 flex-row items-center">
          <Image
            source={require('../../../assets/truRexLogo.png')}
            style={{ width: 80, height: 28, resizeMode: 'contain' }}
          />

          <View
            className="absolute inset-x-0 items-center"
            pointerEvents="box-none"
          >
            <View className={`${isWeb && !isMobile ? 'w-[448px]' : 'w-[55%]'} relative justify-center`}>
              <View className="absolute left-3 z-10">
                <Search size={16} color={Theme.colors.foreground} />
              </View>
              <TextInput
                value={searchQuery}
                onChangeText={onSearchChange}
                placeholder="Search recommendations..."
                placeholderTextColor={Theme.colors.muted}
                className="pl-10 pr-4 py-2 rounded-lg bg-muted/20 border border-border text-sm text-foreground"
              />
            </View>
          </View>

          <View className="flex-row items-center gap-2 ml-auto">
            {isMobile ? (
              <TouchableOpacity onPress={onAddPress} className="p-1">
                <PlusCircle size={22} color={Theme.colors.primary} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={onAddPress}
                className="flex-row items-center gap-1.5 px-4 py-2 rounded-lg bg-primary"
              >
                <PlusCircle size={16} color={Theme.colors.primaryForeground} />
                <Text className="text-sm font-medium text-primary-foreground">Add Rex</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => Auth.signOut()} className="p-2">
              <LogOut size={20} color={Theme.colors.foreground} strokeWidth={2.5} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onProfilePress}
              className="w-9 h-9 rounded-full bg-border items-center justify-center"
            >
              <UserCircle2 size={20} color={Theme.colors.secondaryText} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

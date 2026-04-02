import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Container } from '~/components/common/Container';
import { Button, ButtonVariant } from '~/components/common/Button';
import { ServiceItem } from './_components/ServiceItem';
import { useAuth } from '~/services/AuthContext';
import { LogOut, Search } from 'lucide-react-native';
import { Auth } from '~/services/AuthService';
import { isWeb } from '~/utils';
import { Theme } from '~/theme/Theme';

const MOCK_DATA = [
  {
    id: '1',
    title: 'Premium Concierge',
    type: 'luxury',
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    title: 'Smart Search',
    type: 'utility',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    title: 'Asset Tracking',
    type: 'management',
    image:
      'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
];

export default function HomeScreen() {
  const { user } = useAuth();

  const logout = async () => {
    await Auth.signOut();
  };

  const renderItem = ({ item }: { item: (typeof MOCK_DATA)[0] }) => (
    <ServiceItem title={item.title} type={item.type} image={item.image} />
  );

  const renderHeader = () => (
    <>
      <View className="flex-row justify-between items-center mt-6 mb-6">
        <View>
          <Text className="text-gray-500 text-sm">Good Afternoon,</Text>
          <Text className="text-2xl font-black text-black">
            {user?.email?.split('@')[0] || 'Guest'}
          </Text>
        </View>
        <TouchableOpacity
          className="w-11 h-11 rounded-full bg-gray-100 items-center justify-center border border-gray-200"
          onPress={logout}
        >
          <LogOut size={20} color={Theme.colors.black} />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center bg-gray-100 p-4 rounded-2xl mb-8 border border-gray-200">
        <Search size={20} color={Theme.colors.secondaryText} className="mr-3" />
        <Text className="text-gray-400 font-medium">Search services or assets...</Text>
      </View>

      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold tracking-tight">Featured Services</Text>
        <Button
          title="See All"
          variant={ButtonVariant.Ghost}
          onPress={() => {}}
          className="h-auto px-0 py-0"
          textClassName="text-sm"
        />
      </View>
    </>
  );

  return (
    <Container scrollable={false}>
      <FlatList
        data={MOCK_DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={isWeb ? 3 : 1}
        columnWrapperClassName={isWeb ? 'justify-between gap-4' : undefined}
        contentContainerClassName="pb-[100px]"
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
}

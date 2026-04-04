import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { PlusCircle } from 'lucide-react-native';
import { Theme } from '~/theme/Theme';
import { ServiceItem } from './_components/ServiceItem';
import { Header } from './_components/Header';
import { TabBar, Tab } from './_components/TabBar';
import { isWeb } from '~/utils';

const MOCK_DATA = [
  { id: '1', title: 'Premium Concierge', type: 'luxury', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80' },
  { id: '2', title: 'Smart Search', type: 'utility', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80' },
  { id: '3', title: 'Asset Tracking', type: 'management', image: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&w=800&q=80' },
];

const PlaceholderView = ({ title }: { title: string }) => (
  <View className="flex-1 items-center justify-center">
    <Text className="text-2xl font-bold text-foreground">{title}</Text>
    <Text className="text-sm text-muted mt-2">Coming soon</Text>
  </View>
);

export default function HomeScreen() {
  const [currentTab, setCurrentTab] = useState<Tab>('feed');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View className="flex-1 bg-background">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onProfilePress={() => setCurrentTab('profile')}
        onAddPress={() => {}}
      />

      <TabBar currentTab={currentTab} onTabChange={setCurrentTab} />

      <View className={`flex-1 ${isWeb ? 'max-w-[1200px] w-full self-center' : ''}`}>
        {currentTab === 'feed' && (
          <FlatList
            data={MOCK_DATA}
            keyExtractor={(item) => item.id}
            numColumns={isWeb ? 3 : 1}
            columnWrapperClassName={isWeb ? 'justify-between gap-4' : undefined}
            contentContainerClassName="px-4 pt-4 pb-24"
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => (
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold text-foreground">Featured Services</Text>
              </View>
            )}
            renderItem={({ item }) => <ServiceItem title={item.title} type={item.type} image={item.image} />}
          />
        )}
        {currentTab === 'discover' && <PlaceholderView title="Discover" />}
        {currentTab === 'faves' && <PlaceholderView title="My Faves" />}
        {currentTab === 'network' && <PlaceholderView title="Network" />}
        {currentTab === 'map' && <PlaceholderView title="Map" />}
        {currentTab === 'profile' && <PlaceholderView title="Profile" />}
      </View>

      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-primary items-center justify-center"
        style={{ elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 }}
      >
        <PlusCircle size={28} color={Theme.colors.primaryForeground} />
      </TouchableOpacity>
    </View>
  );
}

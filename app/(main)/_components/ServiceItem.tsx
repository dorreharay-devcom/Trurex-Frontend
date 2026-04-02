import React from 'react';
import { View, Text, Image } from 'react-native';
import { Card } from '~/components/common/Card';

interface ServiceItemProps {
  title: string;
  type: string;
  image: string;
}

export const ServiceItem: React.FC<ServiceItemProps> = ({ title, type, image }) => (
  <Card className="flex-1 p-0 overflow-hidden mb-4 rounded-3xl">
    <Image source={{ uri: image }} className="w-full h-[150px] resize-cover" />
    <View className="p-4">
      <Text className="text-lg font-bold text-black">{title}</Text>
      <Text className="text-xs text-gray-500 mt-1 uppercase tracking-widest">{type}</Text>
    </View>
  </Card>
);

export default ServiceItem;

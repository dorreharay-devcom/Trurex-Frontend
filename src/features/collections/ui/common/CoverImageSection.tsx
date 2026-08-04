import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { Upload, X } from 'lucide-react-native';
import { Image, type ImageContentFit } from 'expo-image';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  coverUri: string | null;
  uploading: boolean;
  contentFit?: ImageContentFit;
  onPick: () => void;
  onRemove: () => void;
};

function CoverImageSection({ coverUri, uploading, contentFit = 'cover', onPick, onRemove }: Props) {
  return (
    <View>
      <Text className="text-xs font-semibold text-muted-foreground mb-1.5">
        Cover image (optional)
      </Text>
      {coverUri ? (
        <View className="rounded-xl overflow-hidden">
          <Image
            source={{ uri: coverUri }}
            style={{ width: '100%', height: 128 }}
            contentFit={contentFit}
          />
          {uploading ? (
            <View className="absolute inset-0 bg-background/60 items-center justify-center">
              <ActivityIndicator color={Theme.colors.primary} />
            </View>
          ) : null}
          <TouchableOpacity
            onPress={onRemove}
            className="absolute top-2 right-2 p-1 rounded-full bg-black/50"
          >
            <X size={14} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={onPick}
          className="w-full py-6 rounded-xl border-2 border-dashed border-border items-center gap-2"
        >
          <Upload size={20} color={Theme.colors.muted} />
          <Text className="text-xs text-muted-foreground font-medium">Add a cover image</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default CoverImageSection;

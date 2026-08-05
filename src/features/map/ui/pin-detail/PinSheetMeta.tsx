import React from 'react';
import { Text, View } from 'react-native';
import { MAP_PIN_TYPE_COPY } from '~/features/map/config/pinCopy';
import { MAP_PIN_TYPE } from '~/features/map/config/pins';
import { mapAuthorRecommendedLabel } from '~/features/map/lib/pinTypes';
import { SignedUserAvatar } from '~/shared/ui/media/SignedUserAvatar';
import type { MapPinType } from '~/features/map/types/mapPin';
import type { Recommendation } from '~/shared/types/recommendation';

type Props = {
  pin: Recommendation;
  pinType: MapPinType;
};

const PinSheetMeta = ({ pin, pinType }: Props) => {
  const showAuthor = pinType === MAP_PIN_TYPE.network || pinType === MAP_PIN_TYPE.rex;
  const authorLabel = showAuthor && pin.user ? mapAuthorRecommendedLabel(pin.user) : null;

  return (
    <>
      <View className="mb-3 flex-row items-center gap-2">
        {authorLabel && pin.user ? (
          <>
            <SignedUserAvatar
              name={pin.user.name}
              avatar={pin.user.avatar}
              className="h-6 w-6"
              sizePt={24}
            />
            <Text className="flex-1 text-xs text-muted-foreground">{authorLabel}</Text>
          </>
        ) : (
          <Text className="text-xs text-muted-foreground">{MAP_PIN_TYPE_COPY[pinType]}</Text>
        )}
      </View>

      <View className="mb-3 flex-row flex-wrap items-center gap-3">
        {pin.rating != null && pin.rating > 0 && (
          <Text className="text-xs font-semibold text-rating-star">★ {pin.rating}/5</Text>
        )}
        {pin.scoreValueForMoney != null && (
          <Text className="text-xs text-muted-foreground">💰 {pin.scoreValueForMoney}/5</Text>
        )}
      </View>

      {pin.description && (
        <Text className="mb-3 rounded-lg bg-muted/20 p-2 text-xs italic text-muted-foreground">
          &ldquo;{pin.description}&rdquo;
        </Text>
      )}
    </>
  );
};

export default PinSheetMeta;

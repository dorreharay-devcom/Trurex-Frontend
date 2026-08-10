import React from 'react';
import { ScrollView, View } from 'react-native';
import PinSheetActions from '~/features/map/ui/pin-detail/PinSheetActions';
import PinSheetHeader from '~/features/map/ui/pin-detail/PinSheetHeader';
import PinSheetMeta from '~/features/map/ui/pin-detail/PinSheetMeta';
import type { MapPinType } from '~/features/map/types/mapPin';
import type { Recommendation } from '~/shared/types/recommendation';

type Props = {
  recommendation: Recommendation;
  pinType: MapPinType;
  distanceLabel?: string;
  onClose: () => void;
  onViewFullRex: () => void;
  canSave: boolean;
  onSave: () => void;
};

const MapPinDetailSheet = ({
  recommendation: pin,
  pinType,
  distanceLabel,
  onClose,
  onViewFullRex,
  canSave,
  onSave,
}: Props) => {
  return (
    <View
      className="absolute bottom-0 left-0 right-0 max-h-[50vh] rounded-t-2xl border-t border-border bg-card shadow-lg"
      style={{ zIndex: 1200, elevation: 1200 }}
    >
      <View className="items-center pt-2 pb-1">
        <View className="h-1 w-10 rounded-full bg-muted opacity-50" />
      </View>

      <ScrollView
        className="px-4 pb-6"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <PinSheetHeader pin={pin} distanceLabel={distanceLabel} onClose={onClose} />
        <PinSheetMeta pin={pin} pinType={pinType} />
        <PinSheetActions
          pin={pin}
          onViewFullRex={onViewFullRex}
          canSave={canSave}
          onSave={onSave}
        />
      </ScrollView>
    </View>
  );
};

export default MapPinDetailSheet;

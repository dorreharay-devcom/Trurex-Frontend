import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { RexCoverThumbnail } from '~/shared/ui/RexCoverThumbnail';
import RexRowActions from '~/pages/gems/ui/uncollected-rex-row/RexRowActions';
import RexRowDetails from '~/pages/gems/ui/uncollected-rex-row/RexRowDetails';
import type { Recommendation } from '~/shared/types/recommendation';

type Props = {
  item: Recommendation;
  onPress?: () => void;
  onAdd: () => void;
  onRemove: () => void;
};

function UncollectedRexRow({ item, onPress, onAdd, onRemove }: Props) {
  return (
    <View className="px-4 mb-3">
      <TouchableOpacity
        activeOpacity={onPress ? 0.7 : 1}
        onPress={onPress}
        disabled={!onPress}
        className="min-w-0 flex-row items-center gap-3 p-3 rounded-xl bg-card border border-border"
      >
        <RexCoverThumbnail rec={item} className="h-12 w-12 rounded-lg flex-shrink-0" />
        <RexRowDetails item={item} />
        <RexRowActions savedAt={item.savedAt} onAdd={onAdd} onRemove={onRemove} />
      </TouchableOpacity>
    </View>
  );
}

export default UncollectedRexRow;

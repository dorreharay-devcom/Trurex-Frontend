import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { Recommendation, RecommendationOpenOptions } from '~/shared/types/recommendation';
import CardActions from './common/CardActions';
import CardHeader from './common/CardHeader';
import CardMedia from './common/CardMedia';
import CardTags from './common/CardTags';

type Props = {
  recommendation: Recommendation;
  onTap?: (rec: Recommendation, options?: RecommendationOpenOptions) => void;
  onSave?: (rec: Recommendation) => void;
  onRemove?: () => void;
};

const RecommendationCard = memo(function RecommendationCard({
  recommendation: rec,
  onTap,
  onSave,
  onRemove,
}: Props) {
  const Wrapper = onTap ? TouchableOpacity : View;

  return (
    <Wrapper
      {...(onTap ? { activeOpacity: 0.95, onPress: () => onTap(rec) } : {})}
      className="bg-card border border-border rounded-xl overflow-hidden mb-4"
    >
      <CardHeader rec={rec} onRemove={onRemove} />
      <CardMedia rec={rec} />
      <Text className="px-4 pt-3 text-sm text-foreground opacity-[0.85]" numberOfLines={3}>
        {rec.description ?? ''}
      </Text>
      <CardTags tags={rec.tags} />
      <CardActions key={rec.id} rec={rec} onTap={onTap} onSave={onSave} />
    </Wrapper>
  );
});

export default RecommendationCard;

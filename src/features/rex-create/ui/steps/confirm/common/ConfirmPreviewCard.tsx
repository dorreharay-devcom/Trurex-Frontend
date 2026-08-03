import React from 'react';
import { View, Text } from 'react-native';
import { ExternalLink, MapPin, Star } from 'lucide-react-native';
import { useCategoryIcon } from '~/shared/hooks/useActiveCategories';
import type {
  ConfirmAuthorPreview,
  ConfirmPreviewPlace,
} from '~/features/rex-create/lib/confirmPreview';
import { Theme } from '~/shared/theme/Theme';

const TAGS_PREVIEW_MAX = 5;

function isUrlLike(line: string): boolean {
  return /^(https?:\/\/|www\.|[a-z0-9-]+\.[a-z]{2,})(\S*)$/i.test(line.trim());
}

function CategoryBadge({
  selectedCategoryId,
  categoryDisplayName,
  subcategoryLabel,
}: {
  selectedCategoryId: string | null;
  categoryDisplayName: string | null;
  subcategoryLabel: string | null;
}) {
  const categoryEmoji = useCategoryIcon(selectedCategoryId);
  if (!selectedCategoryId) return null;
  const label = categoryDisplayName?.trim() || 'Category';
  const suffix = subcategoryLabel ? ` · ${subcategoryLabel}` : '';
  return (
    <View className="max-w-[52%] shrink-0 rounded-full border border-border bg-muted/50 px-2.5 py-1">
      <Text className="text-xs font-medium text-black" numberOfLines={2}>
        {categoryEmoji} {label}
        {suffix}
      </Text>
    </View>
  );
}

function AddressLine({ line }: { line: string }) {
  const Icon = isUrlLike(line) ? ExternalLink : MapPin;
  return (
    <View className="mt-0.5 flex-row items-center gap-1">
      <Icon size={12} color={Theme.colors.secondaryText} />
      <Text className="flex-1 text-xs text-muted-foreground">{line}</Text>
    </View>
  );
}

function TipCallout({ tip }: { tip: string }) {
  if (tip.length === 0) return null;
  return (
    <View className="mx-4 mb-3 rounded-lg border-l-4 border-primary bg-accent p-3">
      <Text className="text-sm italic text-foreground">&quot;{tip}&quot;</Text>
    </View>
  );
}

function RatingLine({ display }: { display: string | null }) {
  if (display == null) return null;
  return (
    <View className="flex-row items-center gap-1.5 px-4 pb-2">
      <Star size={14} color={Theme.colors.ratingStar} fill={Theme.colors.ratingStar} />
      <Text className="text-sm font-semibold text-foreground">{display}</Text>
    </View>
  );
}

function TagChip({ label }: { label: string }) {
  return (
    <View className="rounded-full border border-border bg-muted/50 px-2 py-0.5">
      <Text className="text-xs text-black">{label}</Text>
    </View>
  );
}

function TagChips({ labels }: { labels: string[] }) {
  if (labels.length === 0) return null;
  const shown = labels.slice(0, TAGS_PREVIEW_MAX);
  const overflow = labels.length - shown.length;
  return (
    <View className="flex-row flex-wrap gap-1.5 px-4 pb-2">
      {shown.map((label, i) => (
        <TagChip key={`${label}-${i}`} label={label} />
      ))}
      {overflow > 0 ? <TagChip label={`+${overflow} more`} /> : null}
    </View>
  );
}

function ReviewText({ review }: { review: string }) {
  if (review.length === 0) return null;
  return <Text className="px-4 pb-3 text-sm leading-5 text-foreground opacity-85">{review}</Text>;
}

function CardFooter({ photoCount, sharingLabel }: { photoCount: number; sharingLabel: string }) {
  return (
    <View className="border-t border-border bg-muted/30 px-4 py-3">
      {photoCount > 0 ? (
        <Text className="mb-1 text-xs leading-5 text-muted-foreground">
          Photos: <Text className="font-medium text-foreground">{photoCount}</Text>
        </Text>
      ) : null}
      <Text className="text-xs leading-5 text-muted-foreground">
        Sharing to: <Text className="font-medium text-foreground">{sharingLabel}</Text>
      </Text>
    </View>
  );
}

type Props = {
  author: ConfirmAuthorPreview;
  place: ConfirmPreviewPlace;
  selectedCategoryId: string | null;
  categoryDisplayName: string | null;
  subcategoryLabel: string | null;
  photoCount: number;
  ratingDisplay: string | null;
  tagLabels: string[];
  tip: string;
  review: string;
  sharingLabel: string;
};

function ConfirmPreviewCard({
  author,
  place,
  selectedCategoryId,
  categoryDisplayName,
  subcategoryLabel,
  photoCount,
  ratingDisplay,
  tagLabels,
  tip,
  review,
  sharingLabel,
}: Props) {
  return (
    <View className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <View className="flex-row items-center gap-3 p-4 pb-3">
        <View className="h-9 w-9 items-center justify-center rounded-full border-2 border-border bg-sand">
          <Text className="text-xs font-semibold text-sand-dark">{author.initials}</Text>
        </View>
        <View className="min-w-0 flex-1">
          <Text className="text-sm font-semibold text-foreground">{author.name}</Text>
          <Text className="mt-0.5 text-xs text-muted-foreground">
            {author.handle ? `${author.handle}\u00A0·\u00A0` : ''}just now
          </Text>
        </View>
        <CategoryBadge
          selectedCategoryId={selectedCategoryId}
          categoryDisplayName={categoryDisplayName}
          subcategoryLabel={subcategoryLabel}
        />
      </View>

      <View className="px-4 pb-2">
        <Text className="font-display text-lg font-bold text-foreground">{place.title}</Text>
        {place.addressLines.map((line) => (
          <AddressLine key={line} line={line} />
        ))}
      </View>

      <TipCallout tip={tip} />
      <RatingLine display={ratingDisplay} />
      <TagChips labels={tagLabels} />
      <ReviewText review={review} />
      <CardFooter photoCount={photoCount} sharingLabel={sharingLabel} />
    </View>
  );
}

export default ConfirmPreviewCard;

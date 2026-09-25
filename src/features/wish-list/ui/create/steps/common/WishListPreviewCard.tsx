import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles } from 'lucide-react-native';
import { wishListTagLabel } from '~/features/wish-list/config/tags';
import { useSignedStorageUrl } from '~/shared/hooks/useSignedStorageUrl';
import { RexPhotoPlaceholder } from '~/shared/ui/media/RexPhotoPlaceholder';
import { REX_IMAGES_BUCKET } from '~/shared/config/app';
import { Theme } from '~/shared/theme/Theme';

const HERO_ASPECT = 4 / 3;
const SCRIM_COLORS = ['transparent', 'rgba(0,0,0,0.10)', 'rgba(0,0,0,0.72)'] as const;
const SCRIM_LOCATIONS = [0, 0.45, 1] as const;
const PLACEHOLDER_COLORS = [Theme.colors.sand, Theme.colors.sandMuted];

function HeroMedia({ photoPath }: { photoPath: string | null }) {
  const { uri, loading } = useSignedStorageUrl(REX_IMAGES_BUCKET, photoPath ?? '');

  if (!photoPath) {
    return (
      <RexPhotoPlaceholder
        categoryIcon="🛍️"
        colors={PLACEHOLDER_COLORS}
        style={StyleSheet.absoluteFillObject}
        emojiSize={52}
        accessibilityLabel="Wish list item placeholder"
      />
    );
  }

  if (loading || !uri) {
    return (
      <View className="absolute inset-0 items-center justify-center bg-muted">
        <ActivityIndicator size="small" color={Theme.colors.primary} />
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={StyleSheet.absoluteFillObject}
      contentFit="cover"
      transition={160}
    />
  );
}

function Hero({
  photoPath,
  brandName,
  productName,
}: {
  photoPath: string | null;
  brandName: string;
  productName: string;
}) {
  return (
    <View style={{ aspectRatio: HERO_ASPECT }} className="w-full overflow-hidden bg-muted">
      <HeroMedia photoPath={photoPath} />
      <LinearGradient
        colors={SCRIM_COLORS}
        locations={SCRIM_LOCATIONS}
        style={StyleSheet.absoluteFillObject}
      />

      <View className="absolute left-4 top-4 flex-row items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1">
        <Sparkles size={12} color={Theme.colors.white} />
        <Text className="text-[11px] font-semibold text-white">Wish List</Text>
      </View>

      <View className="absolute inset-x-0 bottom-0 gap-0.5 p-4">
        <Text className="font-display text-2xl font-bold text-white" numberOfLines={2}>
          {brandName}
        </Text>
        {productName ? (
          <Text className="text-sm text-white/90" numberOfLines={2}>
            {productName}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

function SpecChip({ label, value }: { label: string; value: string }) {
  return (
    <View className="min-w-[96px] flex-1 rounded-xl border border-border bg-background px-3 py-2">
      <Text className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </Text>
      <Text className="mt-0.5 text-sm font-medium text-foreground" numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

function SpecRow({ size, colour }: { size: string; colour: string }) {
  if (!size && !colour) return null;
  return (
    <View className="flex-row flex-wrap gap-2">
      {size ? <SpecChip label="Size" value={size} /> : null}
      {colour ? <SpecChip label="Colour" value={colour} /> : null}
    </View>
  );
}

function NoteQuote({ note }: { note: string }) {
  if (!note) return null;
  return (
    <View className="rounded-xl border-l-4 border-primary bg-accent p-3">
      <Text className="text-sm italic leading-5 text-foreground">{note}</Text>
    </View>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <Text className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </Text>
  );
}

function TagChip({ label }: { label: string }) {
  return (
    <View className="rounded-full border border-border bg-background px-2.5 py-1">
      <Text className="text-xs text-foreground">{label}</Text>
    </View>
  );
}

function TagSection({ slugs }: { slugs: string[] }) {
  if (slugs.length === 0) return null;
  return (
    <View className="gap-2">
      <SectionLabel>Why it&apos;s on my list</SectionLabel>
      <View className="flex-row flex-wrap gap-1.5">
        {slugs.map((slug) => (
          <TagChip key={slug} label={wishListTagLabel(slug)} />
        ))}
      </View>
    </View>
  );
}

type Props = {
  brandName: string;
  productName: string;
  size: string;
  colour: string;
  note: string;
  photoPath: string | null;
  tagSlugs: string[];
};

function WishListPreviewCard({
  brandName,
  productName,
  size,
  colour,
  note,
  photoPath,
  tagSlugs,
}: Props) {
  const trimmedBrandName = brandName.trim() || 'Untitled item';
  const trimmedProductName = productName.trim();
  const trimmedSize = size.trim();
  const trimmedColour = colour.trim();
  const trimmedNote = note.trim();
  const hasBody = Boolean(trimmedSize || trimmedColour || trimmedNote || tagSlugs.length);

  return (
    <View className="overflow-hidden rounded-2xl border border-border bg-card">
      <Hero photoPath={photoPath} brandName={trimmedBrandName} productName={trimmedProductName} />
      {hasBody ? (
        <View className="gap-3 p-4">
          <SpecRow size={trimmedSize} colour={trimmedColour} />
          <NoteQuote note={trimmedNote} />
          <TagSection slugs={tagSlugs} />
        </View>
      ) : null}
    </View>
  );
}

export default WishListPreviewCard;

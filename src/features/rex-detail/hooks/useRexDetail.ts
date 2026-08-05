import { useCallback, useMemo } from 'react';
import { Linking } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchRexDetail } from '~/features/rex-detail/api/rexDetailApi';
import { normalizeWebsiteUrl } from '~/shared/lib/data/guards';
import type { Recommendation } from '~/shared/types/recommendation';
import { buildDetailRatingsFromRexDetail } from '~/features/rex-detail/lib/detailRatings';
import {
  rexCoverRemoteHttpUrl,
  rexCoverStoragePathFromRecommendation,
  rexPhotoStoragePathsFromRecommendation,
} from '~/shared/lib/media/rexImages';
import { toastError } from '~/shared/lib/appToast';

function normalizeGalleryPath(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed || trimmed === 'null' || trimmed === 'undefined') return null;
  return trimmed;
}

export function useRexDetail(recommendation: Recommendation | null, visible: boolean) {
  const { data: rexDetail, isLoading: detailLoading } = useQuery({
    queryKey: ['rexDetail', recommendation?.id] as const,
    queryFn: async ({ queryKey }) => {
      const id = queryKey[1];
      if (typeof id !== 'string') {
        throw new Error('Missing rex id');
      }
      return fetchRexDetail(id);
    },
    enabled: visible && typeof recommendation?.id === 'string',
    staleTime: 60_000,
    refetchOnMount: true,
  });

  const detailRatings = useMemo(() => {
    if (!rexDetail) return { overall: null, dimensions: [] };
    return buildDetailRatingsFromRexDetail(rexDetail);
  }, [rexDetail]);

  const galleryPaths = useMemo(() => {
    if (!recommendation) return [];
    const fromDetail =
      rexDetail?.photo_paths
        ?.map((p) => normalizeGalleryPath(String(p)))
        .filter((p): p is string => p != null) ?? [];
    if (fromDetail.length > 0) return fromDetail;
    return rexPhotoStoragePathsFromRecommendation(recommendation);
  }, [rexDetail, recommendation]);

  const placeLocationLine = useMemo(() => {
    if (!recommendation) return '';
    const fromDetail = (rexDetail?.place_location ?? '').trim();
    const fromRec = (recommendation.location ?? '').trim();
    return fromDetail || fromRec;
  }, [recommendation, rexDetail?.place_location]);

  const onlineLocationText = (
    rexDetail?.location_text ??
    recommendation?.locationText ??
    ''
  ).trim();

  const websiteText = (rexDetail?.place_website_url ?? '').trim();
  const websiteHref = useMemo(() => normalizeWebsiteUrl(websiteText), [websiteText]);
  const openWebsite = useCallback(() => {
    if (!websiteHref) return;
    void Linking.openURL(websiteHref).catch(() => {
      toastError('Could not open link', 'Check the site URL and try again.');
    });
  }, [websiteHref]);

  const coverPath = useMemo(
    () => (recommendation ? rexCoverStoragePathFromRecommendation(recommendation) : null),
    [recommendation],
  );
  const coverHttp = useMemo(
    () => (recommendation ? rexCoverRemoteHttpUrl(recommendation) : null),
    [recommendation],
  );
  const hasCoverImage = Boolean(coverPath || coverHttp);
  const showHeroLoading =
    Boolean(visible && recommendation) &&
    detailLoading &&
    galleryPaths.length === 0 &&
    !hasCoverImage &&
    !recommendation?.placeholderColors?.length &&
    !recommendation?.categoryIcon?.trim();

  return {
    rexDetail,
    detailRatings,
    galleryPaths,
    placeLocationLine,
    onlineLocationText,
    website: { text: websiteText, href: websiteHref, open: openWebsite },
    coverPath,
    coverHttp,
    hasCoverImage,
    showHeroLoading,
  };
}

export type RexDetailView = ReturnType<typeof useRexDetail>;

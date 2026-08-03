import { isAndroid, isIos, isWeb } from '~/shared/lib/ui/platform';

export function mapDirectionsUrl(query: string): string {
  const encoded = encodeURIComponent(query);
  const webUrl = `https://www.google.com/maps/search/?api=1&query=${encoded}`;
  if (isWeb) return webUrl;
  if (isIos) return `maps:0,0?q=${encoded}`;
  if (isAndroid) return `geo:0,0?q=${encoded}`;
  return webUrl;
}

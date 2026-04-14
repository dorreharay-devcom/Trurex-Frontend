export type MapMarkerItem = {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  subtitle?: string;
  /** Direct HTTPS image (optional) */
  imageUrl?: string;
  /** rex-images key when {@link imageUrl} is not set */
  imageStoragePath?: string;
};

export type MaybeHeicImage = {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
};

export type HeicConversionResult = MaybeHeicImage & {
  converted: boolean;
  dispose?: () => void;
};

export async function convertHeicIfNeeded(image: MaybeHeicImage): Promise<HeicConversionResult> {
  return {
    ...image,
    converted: false,
  };
}

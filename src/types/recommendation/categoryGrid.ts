export type CategoryGridConfig = {
  numColumns: number;
  gap: number;
  tileWidth: number;
  tile: {
    minHeight: number;
    paddingHorizontal: number;
    paddingVertical: number;
  };
  emoji: {
    fontSize: number;
    marginBottom: number;
  };
  label: {
    fontSize: number;
    lineHeight: number;
    numberOfLines: number;
  };
};

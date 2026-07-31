export const REX_VISIBILITY = {
  public: 'public',
  private: 'private',
  circles: 'circles',
} as const;

export type RexVisibility = (typeof REX_VISIBILITY)[keyof typeof REX_VISIBILITY];

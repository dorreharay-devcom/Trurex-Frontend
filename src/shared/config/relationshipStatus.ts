export const RELATIONSHIP_STATUS = {
  followsYou: 'follows_you',
  following: 'following',
  trusted: 'trusted',
  blocking: 'blocking',
} as const;

export type RelationshipStatus = (typeof RELATIONSHIP_STATUS)[keyof typeof RELATIONSHIP_STATUS];

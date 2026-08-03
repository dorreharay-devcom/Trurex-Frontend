export const RELATIONSHIP_STATUS = {
  followsYou: 'follows_you',
  following: 'following',
  trusted: 'trusted',
} as const;

export type RelationshipStatus = (typeof RELATIONSHIP_STATUS)[keyof typeof RELATIONSHIP_STATUS];

export type MentionCandidate = {
  userId: string;
  handle: string;
  displayName: string;
  avatarUrl: string | null;
  verified: boolean;
};

export type MentionRef = {
  userId: string;
  handle: string;
};

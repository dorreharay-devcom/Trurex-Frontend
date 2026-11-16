export type OAuthProvider = 'google' | 'apple';

export type OAuthSignInOptions = {
  businessSignup: boolean;
};

export type InviteCodeInputRef = {
  focus: () => void;
};

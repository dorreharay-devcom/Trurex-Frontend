export const DELETE_PROFILE_COPY = {
  account: {
    action: 'Delete account',
    hint: 'Permanently removes your account and all associated data.',
    title: 'Delete your account?',
    message:
      'This will permanently delete your account, rexes, collections, and all other data. This action cannot be undone.',
  },
  business: {
    action: 'Delete business profile',
    hint: 'Removes your business profile and its content. Your personal profile stays.',
    title: 'Delete your business profile?',
    message:
      'This will permanently delete your business profile with its rexes, collections, requests, comments and followers. Your personal profile is not affected. This action cannot be undone.',
  },
} as const;

export type DeleteProfileCopy = (typeof DELETE_PROFILE_COPY)[keyof typeof DELETE_PROFILE_COPY];

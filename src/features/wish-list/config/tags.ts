export const WISH_LIST_TAG_OPTIONS = [
  { slug: 'been-on-my-list-for-ages', label: 'Been on my list for ages' },
  { slug: 'this-is-a-splurge-but-im-worth-it', label: "This is a splurge but I'm worth it" },
  { slug: 'youd-make-me-the-happiest', label: "You'd make me the happiest person if you get this" },
  { slug: 'almost-pulled-the-trigger', label: 'Almost pulled the trigger a hundred times' },
  { slug: 'my-wallet-said-no', label: 'My wallet said no but my heart said yes' },
  { slug: 'treat-yourself-energy', label: 'Treat yourself energy' },
  { slug: 'seen-it-everywhere', label: 'Seen it everywhere and need it' },
  { slug: 'the-one-that-got-away', label: 'The one that got away' },
  { slug: 'need-this-for-a-trip', label: 'Need this for an upcoming trip' },
  { slug: 'perfect-gift-hint', label: 'Perfect gift hint — just saying' },
  { slug: 'research-mode', label: 'Research mode — not ready to commit' },
] as const satisfies { slug: string; label: string }[];

export type WishListTagSlug = (typeof WISH_LIST_TAG_OPTIONS)[number]['slug'];

export function wishListTagLabel(slug: string): string {
  return WISH_LIST_TAG_OPTIONS.find((t) => t.slug === slug)?.label ?? slug;
}

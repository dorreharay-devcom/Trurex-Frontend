import type { RexComment } from '~/types/recommendation/rexComment';

export function totalCommentCount(items: RexComment[]): number {
  let n = 0;
  const walk = (list: RexComment[]) => {
    for (const c of list) {
      n += 1;
      if (c.replies?.length) walk(c.replies);
    }
  };
  walk(items);
  return n;
}

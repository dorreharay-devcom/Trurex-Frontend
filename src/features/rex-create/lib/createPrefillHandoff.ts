import type { AddYourOwnRecSource } from '~/features/rex-create/lib/addYourOwn';

let pendingPrefill: AddYourOwnRecSource | null = null;

export function setCreatePrefill(source: AddYourOwnRecSource): void {
  pendingPrefill = source;
}

export function takeCreatePrefill(): AddYourOwnRecSource | null {
  const next = pendingPrefill;
  pendingPrefill = null;
  return next;
}

/** Response from the `discard_draft_rex_data` Edge Function. */
export type DiscardDraftRexDataResult = {
  userId: string;
  deletedObjectCount: number;
  deletedManualPlaceCount: number;
};

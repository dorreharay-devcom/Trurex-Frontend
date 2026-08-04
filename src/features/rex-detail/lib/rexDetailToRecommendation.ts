import type { Recommendation } from '~/shared/types/recommendation';
import { mapApiRowToRecommendation, recommendationStub } from '~/shared/lib/recommendation';
import type { RexDetailRow } from '~/features/rex-detail/types/rexDetail';
import { unknownErrorMessage } from '~/shared/lib/data/guards';

export function rexDetailRowToRecommendation(row: RexDetailRow): Recommendation {
  return mapApiRowToRecommendation(row) ?? recommendationStub(row.id);
}

export function recommendationStubFromId(rexId: string): Recommendation {
  return recommendationStub(rexId);
}

export function deleteRexToastMessage(err: unknown): string {
  const e = err as { code?: string; message?: string };
  if (e?.code === 'P0002') {
    return 'This recommendation was already removed or you don’t have permission to delete it.';
  }
  return unknownErrorMessage(err, 'Try again.');
}

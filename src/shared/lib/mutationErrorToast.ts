import { toastError } from '~/utils/appToast';
import { unknownErrorMessage } from '~/utils';
import { didAccountFrozenMutationToast } from '~/utils/mutationRestrictionError';

export function mutationErrorToast(title: string) {
  return (error: unknown) => {
    if (didAccountFrozenMutationToast(error)) return;
    toastError(title, unknownErrorMessage(error, 'Try again.'));
  };
}

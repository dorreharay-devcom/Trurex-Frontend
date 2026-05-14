import { toastError, toastInfo } from '~/utils/appToast';
import { unknownErrorMessage } from '~/utils';

const TITLE = 'Account restricted';
const MESSAGE =
  'Your account is frozen. You can browse and share links, but you cannot post Rexes, comment, edit your profile, or change collections and circles until the restriction is lifted.';

export function notifyReadOnlyRestriction(apiError?: unknown): void {
  if (apiError != null) {
    const msg = unknownErrorMessage(apiError, '');
    if (msg) {
      toastError(TITLE, msg);
      return;
    }
  }
  toastInfo(TITLE, MESSAGE);
}

import { toastError } from '~/utils/appToast';
import { unknownErrorMessage } from '~/utils';
import { isPlainObject } from '~/utils/guards';

export const ACCOUNT_FROZEN_RPC_CODE = 'CFRZ1';

const FROZEN_TOAST_MARK = '__rexAccountFrozenMutationToastShown';

function rpcErrorCode(error: unknown): string | undefined {
  if (isPlainObject(error)) {
    const c = (error as Record<string, unknown>).code;
    return typeof c === 'string' ? c : undefined;
  }
  if (error instanceof Error && 'code' in error) {
    const c = (error as Error & { code?: unknown }).code;
    return typeof c === 'string' ? c : undefined;
  }
  return undefined;
}

export function toastIfAccountFrozenMutationError(error: unknown): void {
  if (rpcErrorCode(error) !== ACCOUNT_FROZEN_RPC_CODE) return;
  const msg = unknownErrorMessage(error, '').trim() || 'Account is frozen';
  toastError(msg);
  if (typeof error === 'object' && error !== null) {
    Object.defineProperty(error, FROZEN_TOAST_MARK, {
      value: true,
      enumerable: false,
      configurable: true,
    });
  }
}

export function didAccountFrozenMutationToast(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false;
  return Boolean(Object.getOwnPropertyDescriptor(error, FROZEN_TOAST_MARK)?.value);
}

export function throwRpcIfFailed<T>(result: { data: T | null; error: unknown }): asserts result is {
  data: T;
  error: null;
} {
  if (result.error) {
    toastIfAccountFrozenMutationError(result.error);
    throw result.error;
  }
}

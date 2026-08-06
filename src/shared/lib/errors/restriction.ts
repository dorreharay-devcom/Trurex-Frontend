import { toastError, toastInfo } from '~/shared/lib/appToast';
import { isPlainObject, unknownErrorMessage } from '~/shared/lib/data/guards';
import { userFacingNetworkErrorMessage } from '~/shared/lib/errors/network';
import { isOfflineMutationBlocked } from '~/shared/lib/network/assertOnline';
import { onlineManager } from '@tanstack/react-query';

export const ACCOUNT_SUSPENDED_RPC_CODE = 'CSUS1';
export const ACCOUNT_SUSPENDED_STATUS = 'suspended';
export const AUTHENTICATION_REQUIRED_RPC_CODE = '42501';
export const ACCOUNT_FROZEN_RPC_CODE = 'CFRZ1';

const FROZEN_TOAST_MARK = '__rexAccountFrozenMutationToastShown';

const READ_ONLY_TITLE = 'Account restricted';
const READ_ONLY_MESSAGE =
  'Your account is frozen. You can browse and share links, but you cannot post Rexes, comment, edit your profile, or change collections and circles until the restriction is lifted.';

type SessionTerminationHandler = () => Promise<void> | void;

let sessionTerminationHandler: SessionTerminationHandler | null = null;
let suspensionLogoutInFlight = false;
let unauthorizedLogoutInFlight = false;

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

function rpcErrorMessage(error: unknown): string | undefined {
  if (isPlainObject(error)) {
    const message = (error as Record<string, unknown>).message;
    return typeof message === 'string' ? message : undefined;
  }
  return error instanceof Error ? error.message : undefined;
}

function httpStatus(error: unknown): number | undefined {
  if (isPlainObject(error)) {
    const status = (error as Record<string, unknown>).status;
    if (typeof status === 'number') return status;
    if (typeof status === 'string') return Number(status);
    const statusCode = (error as Record<string, unknown>).statusCode;
    if (typeof statusCode === 'number') return statusCode;
    if (typeof statusCode === 'string') return Number(statusCode);
  }
  if (error instanceof Error) {
    const withStatus = error as Error & { status?: unknown; statusCode?: unknown };
    if (typeof withStatus.status === 'number') return withStatus.status;
    if (typeof withStatus.status === 'string') return Number(withStatus.status);
    if (typeof withStatus.statusCode === 'number') return withStatus.statusCode;
    if (typeof withStatus.statusCode === 'string') return Number(withStatus.statusCode);
  }
  return undefined;
}

export function isAccountSuspendedStatus(status: unknown): boolean {
  return status === ACCOUNT_SUSPENDED_STATUS;
}

export function isAccountSuspendedRpcError(error: unknown): boolean {
  return rpcErrorCode(error) === ACCOUNT_SUSPENDED_RPC_CODE;
}

export function isUnauthorizedRequestError(error: unknown): boolean {
  if (httpStatus(error) === 401) return true;
  return (
    rpcErrorCode(error) === AUTHENTICATION_REQUIRED_RPC_CODE &&
    (rpcErrorMessage(error) ?? '').toLowerCase().includes('authentication required')
  );
}

export function registerAccountSuspendedHandler(handler: SessionTerminationHandler): () => void {
  sessionTerminationHandler = handler;
  return () => {
    if (sessionTerminationHandler === handler) sessionTerminationHandler = null;
  };
}

export function terminateSessionForSuspendedAccount(): void {
  if (suspensionLogoutInFlight) return;
  suspensionLogoutInFlight = true;
  toastError('Account is suspended');
  Promise.resolve(sessionTerminationHandler?.())
    .catch((error) => {
      console.warn('[Auth] suspended account sign out failed', error);
    })
    .finally(() => {
      suspensionLogoutInFlight = false;
    });
}

export function terminateSessionForUnauthorizedRequest(): void {
  if (unauthorizedLogoutInFlight) return;
  unauthorizedLogoutInFlight = true;
  Promise.resolve(sessionTerminationHandler?.())
    .catch((error) => {
      console.warn('[Auth] unauthorized request sign out failed', error);
    })
    .finally(() => {
      unauthorizedLogoutInFlight = false;
    });
}

export function terminateSessionIfAccountSuspended(error: unknown): boolean {
  if (!isAccountSuspendedRpcError(error)) return false;
  terminateSessionForSuspendedAccount();
  return true;
}

export function terminateSessionIfUnauthorizedRequest(error: unknown): boolean {
  if (!isUnauthorizedRequestError(error)) return false;
  terminateSessionForUnauthorizedRequest();
  return true;
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

export function terminateIfAccountSuspendedRpcError(error: unknown): void {
  if (rpcErrorCode(error) !== ACCOUNT_SUSPENDED_RPC_CODE) return;
  terminateSessionIfAccountSuspended(error);
}

export function terminateIfUnauthorizedRequestError(error: unknown): void {
  terminateSessionIfUnauthorizedRequest(error);
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
    terminateIfUnauthorizedRequestError(result.error);
    terminateIfAccountSuspendedRpcError(result.error);
    toastIfAccountFrozenMutationError(result.error);
    throw result.error;
  }
}

export function notifyReadOnlyRestriction(apiError?: unknown): void {
  if (apiError != null) {
    const msg = unknownErrorMessage(apiError, '');
    if (msg) {
      toastError(READ_ONLY_TITLE, msg);
      return;
    }
  }
  toastInfo(READ_ONLY_TITLE, READ_ONLY_MESSAGE);
}

export function mutationErrorToast(title: string) {
  return (error: unknown) => {
    if (isOfflineMutationBlocked(error)) return;
    if (didAccountFrozenMutationToast(error)) return;
    if (!onlineManager.isOnline()) {
      toastError('You are offline', 'Reconnect to complete this action.');
      return;
    }
    toastError(
      title,
      userFacingNetworkErrorMessage(error, unknownErrorMessage(error, 'Try again.')),
    );
  };
}

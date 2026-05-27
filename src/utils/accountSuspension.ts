import { toastError } from '~/utils/appToast';
import { isPlainObject } from '~/utils/guards';

export const ACCOUNT_SUSPENDED_RPC_CODE = 'CSUS1';
export const ACCOUNT_SUSPENDED_STATUS = 'suspended';
export const AUTHENTICATION_REQUIRED_RPC_CODE = '42501';

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

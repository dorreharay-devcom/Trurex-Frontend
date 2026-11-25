const ACTING_AS_HEADER = 'x-acting-as';
const ACTING_AS_BUSINESS = 'business';
const PROFILE_SCOPED_PATHS = ['/rest/v1/', '/functions/v1/'];

let actingAsBusiness = false;

export function isActingAsBusiness(): boolean {
  return actingAsBusiness;
}

export function setActingAsBusiness(next: boolean): void {
  actingAsBusiness = next;
}

export function withActingProfileHeader(
  url: string,
  init: RequestInit | undefined,
  business: boolean,
): RequestInit | undefined {
  if (!business || !PROFILE_SCOPED_PATHS.some((path) => url.includes(path))) return init;
  const headers = new Headers(init?.headers);
  headers.set(ACTING_AS_HEADER, ACTING_AS_BUSINESS);
  return { ...init, headers };
}

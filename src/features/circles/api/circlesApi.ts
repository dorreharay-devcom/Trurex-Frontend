import { Backend } from '~/shared/api/client';
import type {
  CircleApiRow,
  CircleMemberProfile,
  CreateCircleParams,
  UpdateCircleParams,
} from '~/features/circles/types/circle';
import {
  coerceNonEmptyId,
  isPlainObject,
  omitUndefined,
  optStr,
  unknownAsArray,
} from '~/shared/lib/data/guards';
import { throwRpcIfFailed } from '~/shared/lib/errors/restriction';

const CIRCLE_TABLE_COLUMNS =
  'id, owner_id, name, description, icon_url, color, system_kind, is_active, created_at, updated_at' as const;

function asCircleRow(data: unknown): CircleApiRow {
  if (!isPlainObject(data)) {
    throw new Error('Invalid circle response');
  }
  return data as CircleApiRow;
}

async function fetchMyCirclesViaPostgrest(): Promise<CircleApiRow[]> {
  const { data, error } = await Backend.from('circles')
    .select(CIRCLE_TABLE_COLUMNS)
    .order('created_at', { ascending: false });
  throwRpcIfFailed({ data, error });
  return unknownAsArray<CircleApiRow>(data).map((row) => ({
    ...row,
    invitation_code: row.invitation_code ?? null,
  }));
}

export async function fetchMyCircles(): Promise<CircleApiRow[]> {
  const { data, error } = await Backend.functions.invoke<{ circles: CircleApiRow[] }>('circles', {
    method: 'GET',
  });
  if (!error && Array.isArray(data?.circles)) {
    return data.circles;
  }
  return fetchMyCirclesViaPostgrest();
}

export async function addCircleMember(circleId: string, userId: string): Promise<void> {
  throwRpcIfFailed(
    await Backend.rpc('add_user_to_circle', {
      input_circle_id: circleId,
      input_user_id: userId,
    }),
  );
}

export async function removeCircleMember(circleId: string, userId: string): Promise<boolean> {
  const { data, error } = await Backend.rpc('remove_user_from_circle', {
    input_circle_id: circleId,
    input_user_id: userId,
  });
  throwRpcIfFailed({ data, error });
  return data === true;
}

export async function createCircle(params: CreateCircleParams): Promise<CircleApiRow> {
  const { data, error } = await Backend.rpc('create_circle', {
    input_name: params.input_name,
    input_description: params.input_description ?? null,
    input_icon_url: params.input_icon_url ?? null,
    input_color: params.input_color ?? null,
  });
  throwRpcIfFailed({ data, error });
  return asCircleRow(data);
}

export async function updateCircle(params: UpdateCircleParams): Promise<CircleApiRow> {
  const { input_circle_id, ...optionalFields } = params;
  const { data, error } = await Backend.rpc('update_circle', {
    input_circle_id,
    ...omitUndefined(optionalFields),
  });
  throwRpcIfFailed({ data, error });
  return asCircleRow(data);
}

export async function deleteCircle(input_circle_id: string): Promise<CircleApiRow> {
  const { data, error } = await Backend.rpc('delete_circle', {
    input_circle_id,
  });
  throwRpcIfFailed({ data, error });
  return asCircleRow(data);
}

function mapCircleMemberRow(raw: unknown): CircleMemberProfile | null {
  if (!isPlainObject(raw)) return null;
  const user_id = coerceNonEmptyId(raw.user_id);
  if (user_id == null) return null;
  return {
    user_id,
    display_name: optStr(raw.display_name),
    handle: optStr(raw.handle),
    avatar_url: optStr(raw.avatar_url),
  };
}

export async function fetchCircleMembers(circleId: string): Promise<CircleMemberProfile[]> {
  const { data, error } = await Backend.rpc('get_circle_members', {
    input_circle_id: circleId,
  });
  throwRpcIfFailed({ data, error });
  return unknownAsArray(data)
    .map(mapCircleMemberRow)
    .filter((m): m is CircleMemberProfile => m != null);
}

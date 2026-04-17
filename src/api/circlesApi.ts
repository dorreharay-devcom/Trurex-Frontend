import { Backend } from '~/services/AuthService';

export type CircleApiRow = {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  system_kind: string | null;
  invitation_code?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  color?: string | null;
};

type CircleRowFromDb = {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  system_kind: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

async function fetchMyCirclesViaPostgrest(): Promise<CircleApiRow[]> {
  const { data, error } = await Backend.from('circles')
    .select(
      'id, owner_id, name, description, icon_url, system_kind, is_active, created_at, updated_at',
    )
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row: CircleRowFromDb) => ({
    ...row,
    invitation_code: null,
  }));
}

type ListCirclesResponse = {
  circles: CircleApiRow[];
};

export type AddCircleMemberResponse = {
  membership: Record<string, unknown>;
};

export type RemoveCircleMemberResponse = {
  success: true;
};

export type CirclesEdgeMemberBody = {
  action: 'add_member' | 'remove_member';
  circleId: string;
  userId: string;
};

export async function fetchMyCircles(): Promise<CircleApiRow[]> {
  const { data, error } = await Backend.functions.invoke<ListCirclesResponse>('circles', {
    method: 'GET',
  });
  if (!error && data?.circles != null) {
    return data.circles;
  }
  try {
    return await fetchMyCirclesViaPostgrest();
  } catch {
    if (error) throw error;
    throw new Error('fetchMyCircles failed');
  }
}

export async function invokeCirclesMemberAction(
  body: CirclesEdgeMemberBody,
): Promise<AddCircleMemberResponse | RemoveCircleMemberResponse | unknown> {
  const { data, error } = await Backend.functions.invoke('circles', {
    body: {
      action: body.action,
      circleId: body.circleId,
      userId: body.userId,
    },
  });
  if (error) throw error;
  return data;
}

export function addCircleMember(circleId: string, userId: string) {
  return invokeCirclesMemberAction({ action: 'add_member', circleId, userId });
}

export function removeCircleMember(circleId: string, userId: string) {
  return invokeCirclesMemberAction({ action: 'remove_member', circleId, userId });
}

export type CreateCircleParams = {
  input_name: string;
  input_description?: string | null;
  input_icon_url?: string | null;
  input_color?: string | null;
};

export async function createCircle(params: CreateCircleParams): Promise<CircleApiRow> {
  const { data, error } = await Backend.rpc('create_circle', {
    input_name: params.input_name,
    input_description: params.input_description ?? null,
    input_icon_url: params.input_icon_url ?? params.input_color ?? null,
  });
  if (error) throw error;
  return data as CircleApiRow;
}

export type UpdateCircleParams = {
  input_circle_id: string;
  input_name?: string;
  input_description?: string | null;
  input_icon_url?: string | null;
  input_color?: string | null;
};

export async function updateCircle(params: UpdateCircleParams): Promise<CircleApiRow> {
  const icon =
    params.input_icon_url !== undefined ? params.input_icon_url : (params.input_color ?? undefined);

  const body: Record<string, unknown> = {
    input_circle_id: params.input_circle_id,
  };
  if (params.input_name !== undefined) body.input_name = params.input_name;
  if (params.input_description !== undefined) body.input_description = params.input_description;
  if (icon !== undefined) body.input_icon_url = icon;

  const { data, error } = await Backend.rpc('update_circle', body);
  if (error) throw error;
  return data as CircleApiRow;
}

export async function deleteCircle(input_circle_id: string): Promise<CircleApiRow> {
  const { data, error } = await Backend.rpc('delete_circle', {
    input_circle_id,
  });
  if (error) throw error;
  return data as CircleApiRow;
}

export async function joinCircle(input_invitation_code: string): Promise<Record<string, unknown>> {
  const { data, error } = await Backend.rpc('join_circle', {
    input_invitation_code,
  });
  if (error) throw error;
  return (data ?? {}) as Record<string, unknown>;
}

export type CircleDiscoverFeedParams = {
  result_limit?: number;
  result_offset?: number;
};

export async function fetchCircleDiscoverFeed(
  params: CircleDiscoverFeedParams = {},
): Promise<unknown> {
  const { data, error } = await Backend.rpc('circle_discover_feed', {
    result_limit: params.result_limit ?? 20,
    result_offset: params.result_offset ?? 0,
  });
  if (error) throw error;
  return data;
}

export type CircleMemberProfile = {
  user_id: string;
  display_name: string | null;
  handle: string | null;
  avatar_url: string | null;
};

export async function fetchCircleMembers(_circleId: string): Promise<CircleMemberProfile[]> {
  return [];
}

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
  member_count?: number;
  sort_rank?: number;
};

type CircleRowFromDb = {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  color: string | null;
  system_kind: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

async function fetchMyCirclesViaPostgrest(): Promise<CircleApiRow[]> {
  const { data, error } = await Backend.from('circles')
    .select(
      'id, owner_id, name, description, icon_url, color, system_kind, is_active, created_at, updated_at',
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

export async function fetchMyCircles(): Promise<CircleApiRow[]> {
  const { data, error } = await Backend.functions.invoke<ListCirclesResponse>('circles', {
    method: 'GET',
  });
  if (!error && data?.circles != null) {
    return data.circles as CircleApiRow[];
  }
  try {
    return await fetchMyCirclesViaPostgrest();
  } catch {
    if (error) throw error;
    throw new Error('fetchMyCircles failed');
  }
}

export async function addCircleMember(circleId: string, userId: string): Promise<unknown> {
  const { data, error } = await Backend.rpc('add_user_to_circle', {
    input_circle_id: circleId,
    input_user_id: userId,
  });
  if (error) throw error;
  return data;
}

export async function removeCircleMember(circleId: string, userId: string): Promise<boolean> {
  const { data, error } = await Backend.rpc('remove_user_from_circle', {
    input_circle_id: circleId,
    input_user_id: userId,
  });
  if (error) throw error;
  return data === true;
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
    input_icon_url: params.input_icon_url ?? null,
    input_color: params.input_color ?? null,
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
  const body: Record<string, unknown> = {
    input_circle_id: params.input_circle_id,
  };
  if (params.input_name !== undefined) body.input_name = params.input_name;
  if (params.input_description !== undefined) body.input_description = params.input_description;
  if (params.input_icon_url !== undefined) body.input_icon_url = params.input_icon_url;
  if (params.input_color !== undefined) body.input_color = params.input_color;

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

export type CircleMemberAssignment = {
  circle_id: string;
  member_user_id: string;
};

export async function fetchMyCircleMemberAssignments(): Promise<CircleMemberAssignment[]> {
  const { data: circlesData, error: ce } = await Backend.from('circles').select('id');
  if (ce) throw ce;
  const circleIds = (circlesData ?? []).map((c: { id: string }) => c.id);
  if (circleIds.length === 0) return [];

  const { data, error } = await Backend.from('circle_members')
    .select('circle_id, user_id')
    .in('circle_id', circleIds);
  if (error) throw error;
  return (data ?? []).map((row: { circle_id: string; user_id: string }) => ({
    circle_id: row.circle_id,
    member_user_id: row.user_id,
  }));
}

export type CircleMemberProfile = {
  user_id: string;
  display_name: string | null;
  handle: string | null;
  avatar_url: string | null;
};

export async function fetchCircleMembers(circleId: string): Promise<CircleMemberProfile[]> {
  const { data: membershipRows, error: me } = await Backend.from('circle_members')
    .select('user_id')
    .eq('circle_id', circleId);
  if (me) throw me;

  const ids = (membershipRows ?? []).map((r: { user_id: string }) => r.user_id);
  if (ids.length === 0) return [];

  const { data: userRows, error: ue } = await Backend.from('users')
    .select('id, display_name, handle, avatar_url')
    .in('id', ids);
  if (ue) throw ue;

  const byId = new Map<string, CircleMemberProfile>(
    (userRows ?? []).map(
      (u: {
        id: string;
        display_name: string | null;
        handle: string | null;
        avatar_url: string | null;
      }) => [
        u.id,
        {
          user_id: u.id,
          display_name: u.display_name,
          handle: u.handle,
          avatar_url: u.avatar_url,
        },
      ],
    ),
  );

  return ids.map((id) => {
    const row = byId.get(id);
    if (row) return row;
    return {
      user_id: id,
      display_name: null,
      handle: null,
      avatar_url: null,
    };
  });
}

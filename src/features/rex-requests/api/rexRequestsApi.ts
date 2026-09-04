import { Backend, unwrap } from '~/shared/api/client';
import { firstRecord } from '~/shared/lib/data/guards';
import type {
  CreateRexRequestParams,
  EditRexRequestParams,
  GetRexRequestsFeedParams,
  RexRequestCommentRow,
  RexRequestResponseRow,
  RexRequestRow,
} from '~/features/rex-requests/api/types';

export async function createRexRequest(params: CreateRexRequestParams): Promise<string> {
  return unwrap(
    await Backend.rpc('create_rex_request', {
      p_category_ids: params.categoryIds,
      p_looking_for_text: params.lookingForText,
      p_need_by: params.needBy,
      p_circle_ids: params.circleIds,
      p_location_text: params.locationText ?? null,
      p_location_lat: params.locationLat ?? null,
      p_location_lng: params.locationLng ?? null,
      p_note: params.note ?? null,
      p_is_public: params.isPublic ?? false,
    }),
  );
}

export async function getRexRequestsFeed(
  params: GetRexRequestsFeedParams,
): Promise<RexRequestRow[]> {
  const raw = unwrap(
    await Backend.rpc('get_rex_requests_feed', {
      result_limit: params.resultLimit,
      result_offset: params.resultOffset,
      p_search: params.search ?? null,
      circle_filter: params.circleFilter?.length ? params.circleFilter : null,
      p_category_ids: params.categoryIds?.length ? params.categoryIds : null,
    }),
  );
  return Array.isArray(raw) ? (raw as RexRequestRow[]) : [];
}

export async function myRexRequests(params: GetRexRequestsFeedParams): Promise<RexRequestRow[]> {
  const raw = unwrap(
    await Backend.rpc('my_rex_requests', {
      result_limit: params.resultLimit,
      result_offset: params.resultOffset,
    }),
  );
  return Array.isArray(raw) ? (raw as RexRequestRow[]) : [];
}

export async function getUserRexRequests(
  userId: string,
  params: GetRexRequestsFeedParams,
): Promise<RexRequestRow[]> {
  const raw = unwrap(
    await Backend.rpc('get_user_rex_requests', {
      p_user_id: userId,
      result_limit: params.resultLimit,
      result_offset: params.resultOffset,
    }),
  );
  return Array.isArray(raw) ? (raw as RexRequestRow[]) : [];
}

export async function getRexRequestDetail(requestId: string): Promise<RexRequestRow | null> {
  const raw = unwrap(await Backend.rpc('get_rex_request_detail', { p_request_id: requestId }));
  return firstRecord(raw) as RexRequestRow | null;
}

export async function getRexRequestResponses(requestId: string): Promise<RexRequestResponseRow[]> {
  const raw = unwrap(
    await Backend.rpc('get_rex_request_responses', {
      p_request_id: requestId,
      result_limit: 50,
      result_offset: 0,
    }),
  );
  return Array.isArray(raw) ? (raw as RexRequestResponseRow[]) : [];
}

export async function getRexRequestComments(requestId: string): Promise<RexRequestCommentRow[]> {
  const raw = unwrap(
    await Backend.rpc('get_rex_request_comments', {
      p_request_id: requestId,
      result_limit: 50,
      result_offset: 0,
    }),
  );
  return Array.isArray(raw) ? (raw as RexRequestCommentRow[]) : [];
}

export async function respondToRexRequest(requestId: string, rexId: string): Promise<string> {
  return unwrap(
    await Backend.rpc('respond_to_rex_request', { p_request_id: requestId, p_rex_id: rexId }),
  );
}

export async function untagRexFromRequest(requestId: string, rexId: string): Promise<void> {
  unwrap(await Backend.rpc('untag_rex_from_request', { p_request_id: requestId, p_rex_id: rexId }));
}

export async function commentOnRexRequest(requestId: string, body: string): Promise<string> {
  return unwrap(
    await Backend.rpc('comment_on_rex_request', { p_request_id: requestId, p_body: body }),
  );
}

export async function deleteRexRequestComment(commentId: string): Promise<void> {
  unwrap(await Backend.rpc('delete_rex_request_comment', { p_comment_id: commentId }));
}

export async function resolveRexRequest(requestId: string): Promise<void> {
  unwrap(await Backend.rpc('resolve_rex_request', { p_request_id: requestId }));
}

export async function deleteRexRequest(requestId: string): Promise<void> {
  unwrap(await Backend.rpc('delete_rex_request', { p_request_id: requestId }));
}

export async function editRexRequest(params: EditRexRequestParams): Promise<void> {
  unwrap(
    await Backend.rpc('edit_rex_request', {
      p_request_id: params.requestId,
      ...(params.categoryIds !== undefined ? { p_category_ids: params.categoryIds } : {}),
      ...(params.lookingForText !== undefined ? { p_looking_for_text: params.lookingForText } : {}),
      ...(params.needBy !== undefined ? { p_need_by: params.needBy } : {}),
      ...(params.circleIds !== undefined ? { p_circle_ids: params.circleIds } : {}),
      ...(params.locationText !== undefined ? { p_location_text: params.locationText } : {}),
      ...(params.locationLat !== undefined ? { p_location_lat: params.locationLat } : {}),
      ...(params.locationLng !== undefined ? { p_location_lng: params.locationLng } : {}),
      ...(params.note !== undefined ? { p_note: params.note } : {}),
      ...(params.isPublic !== undefined ? { p_is_public: params.isPublic } : {}),
    }),
  );
}

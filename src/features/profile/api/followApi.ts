import { Backend } from '~/shared/api/client';
import { throwRpcIfFailed } from '~/shared/lib/errors/restriction';

export async function followUser(input_followed_user_id: string): Promise<void> {
  throwRpcIfFailed(await Backend.rpc('follow_user', { input_followed_user_id }));
}

export async function unfollowUser(input_followed_user_id: string): Promise<void> {
  throwRpcIfFailed(await Backend.rpc('unfollow_user', { input_followed_user_id }));
}

import { afterEach, describe, expect, it, vi } from 'vitest';
import { collectionMembershipDiff } from '~/features/collections/lib/mappers';
import { parseCreatedRexId } from '~/features/rex-create/lib/parseCreatedRexId';
import {
  buildCreateWizardDraft,
  createWizardDraftIsMeaningful,
  durablePhotoStoragePaths,
  isDurablePhotoStoragePath,
} from '~/features/rex-create/lib/createWizardDraft';
import { SEARCH_MODE } from '~/features/rex-create/types/create';
import {
  insertOptimisticComment,
  removeCommentFromTree,
  totalRexCommentCount,
} from '~/features/rex-detail/lib/rexCommentTree';
import type { RexComment } from '~/features/rex-detail/types/rexComment';
import {
  patchInfiniteRecommendations,
  patchRecommendationList,
} from '~/shared/lib/query/patchRecommendationList';
import type { Recommendation } from '~/shared/types/recommendation';
import {
  OfflineMutationBlockedError,
  assertOnlineForMutation,
  isOfflineMutationBlocked,
  requireOnlineForMutation,
  withOnlineMutation,
} from '~/shared/lib/network/assertOnline';

const toastError = vi.fn();
const track = vi.fn();
let online = true;

vi.mock('@tanstack/react-query', () => ({
  onlineManager: {
    isOnline: () => online,
  },
}));

vi.mock('~/shared/lib/appToast', () => ({
  toastError: (...args: unknown[]) => toastError(...args),
  toastSuccess: vi.fn(),
}));

vi.mock('~/shared/lib/analytics/track', () => ({
  AnalyticsEvent: { OfflineBlockedMutation: 'offline_blocked_mutation' },
  track: (...args: unknown[]) => track(...args),
}));

function blankDraft(overrides: Partial<ReturnType<typeof buildCreateWizardDraft>> = {}) {
  return buildCreateWizardDraft({
    searchMode: SEARCH_MODE.select,
    searchQuery: '',
    selectedSearchPlace: null,
    manual: { name: '', address: '', geotag: null },
    online: { name: '', websiteUrl: '', locationText: '', geotag: null },
    selectedCategoryId: null,
    selectedSubcategoryCode: null,
    scoreQuickTip: '',
    scoreReview: '',
    scoreValueForMoney: null,
    categoryRatings: {},
    questionAnswers: {},
    selectedTagSlugs: [],
    photoStoragePaths: [],
    selectedCircleIds: [],
    privateRex: false,
    ...overrides,
  });
}

function comment(id: string, parent: string | null = null, replies: RexComment[] = []): RexComment {
  return {
    id,
    rex_id: 'rex-1',
    parent_comment_id: parent,
    author_id: 'u1',
    body: id,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
    like_count: 0,
    liked_by_me: false,
    reply_count: replies.length,
    profile: {
      display_name: 'A',
      avatar_url: null,
      username: null,
      relationship_status: null,
    },
    replies,
  };
}

function rec(id: string, likes = 0, liked = false): Recommendation {
  return {
    id,
    title: id,
    categoryId: 'c',
    category: 'c',
    likes,
    comments: 0,
    saves: 0,
    isLiked: liked,
    isSaved: false,
  };
}

afterEach(() => {
  online = true;
  toastError.mockClear();
  track.mockClear();
});

describe('critical path coordination', () => {
  describe('offline mutation gate', () => {
    it('allows mutations when online and blocks with toast when offline', async () => {
      expect(assertOnlineForMutation('Likes')).toBe(true);
      expect(toastError).not.toHaveBeenCalled();

      online = false;
      expect(assertOnlineForMutation('Likes')).toBe(false);
      expect(toastError).toHaveBeenCalled();
      expect(track).toHaveBeenCalledWith('offline_blocked_mutation', { action: 'Likes' });
      expect(() => requireOnlineForMutation('Posting')).toThrow(OfflineMutationBlockedError);
      expect(isOfflineMutationBlocked(new OfflineMutationBlockedError())).toBe(true);
      expect(isOfflineMutationBlocked({ offlineBlocked: true })).toBe(true);
      expect(isOfflineMutationBlocked({ offlineBlocked: false })).toBe(false);

      online = true;
      const guarded = withOnlineMutation('Likes', async (id: string) => id);
      await expect(guarded('rex-1')).resolves.toBe('rex-1');
      online = false;
      await expect(guarded('rex-1')).rejects.toBeInstanceOf(OfflineMutationBlockedError);
    });
  });

  describe('create rex id handoff', () => {
    it('parses created ids so feed prepend can run on success', () => {
      const id = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
      expect(parseCreatedRexId(id)).toBe(id);
      expect(parseCreatedRexId({ rex_id: id })).toBe(id);
      expect(parseCreatedRexId([{ id }])).toBe(id);
      expect(parseCreatedRexId(null)).toBeNull();
    });

    it('only persists meaningful create drafts', () => {
      expect(createWizardDraftIsMeaningful(blankDraft())).toBe(false);
      expect(createWizardDraftIsMeaningful(blankDraft({ scoreQuickTip: ' Great spot ' }))).toBe(
        true,
      );
      expect(createWizardDraftIsMeaningful(blankDraft({ privateRex: true }))).toBe(true);
    });

    it('only keeps durable storage photo paths in drafts', () => {
      expect(isDurablePhotoStoragePath('user/abc.jpg')).toBe(true);
      expect(isDurablePhotoStoragePath('file:///tmp/x.jpg')).toBe(false);
      expect(isDurablePhotoStoragePath('https://cdn.example/x.jpg')).toBe(false);
      expect(durablePhotoStoragePaths(['user/a.jpg', 'file:///tmp/b.jpg', 'content://c'])).toEqual([
        'user/a.jpg',
      ]);
      expect(
        buildCreateWizardDraft({
          ...blankDraft(),
          photoStoragePaths: ['user/a.jpg', 'file:///tmp/b.jpg'],
        }).photoStoragePaths,
      ).toEqual(['user/a.jpg']);
    });
  });

  describe('like optimistic cache', () => {
    it('toggles like on list then rolls back on failure shape', () => {
      const list = [rec('a', 1, false), rec('b', 4, true)];
      const optimistic = patchRecommendationList(list, 'a', { isLiked: true, likes: 2 });
      expect(optimistic?.[0]).toMatchObject({ isLiked: true, likes: 2 });
      const rolled = patchRecommendationList(optimistic, 'a', { isLiked: false, likes: 1 });
      expect(rolled?.[0]).toMatchObject({ isLiked: false, likes: 1 });

      const infinite = { pages: [[rec('a'), rec('b')]], pageParams: [0] };
      const next = patchInfiniteRecommendations(infinite, 'b', { isLiked: false, likes: 3 });
      expect(next?.pages[0]?.[1]).toMatchObject({ likes: 3, isLiked: false });
    });
  });

  describe('save to collection', () => {
    it('computes add and remove membership diffs for apply', () => {
      const original = new Set(['c1', 'c2']);
      const selected = new Set(['c2', 'c3']);
      expect(collectionMembershipDiff(selected, original)).toEqual({
        toAdd: ['c3'],
        toRemove: ['c1'],
      });
      expect(collectionMembershipDiff(['c1'], ['c1'])).toEqual({ toAdd: [], toRemove: [] });
    });
  });

  describe('comments tree coordination', () => {
    it('inserts optimistic comment, updates counts, removes on delete', () => {
      const root = comment('root');
      const withReply = insertOptimisticComment([root], comment('r1', 'root'));
      expect(withReply[0]?.replies.map((r) => r.id)).toEqual(['r1']);
      expect(withReply[0]?.reply_count).toBe(1);
      expect(totalRexCommentCount(withReply)).toBe(2);

      const afterDelete = removeCommentFromTree(withReply, 'r1');
      expect(afterDelete[0]?.replies).toEqual([]);
      expect(totalRexCommentCount(afterDelete)).toBe(1);
    });
  });
});

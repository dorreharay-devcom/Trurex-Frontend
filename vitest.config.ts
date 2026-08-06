import { defineConfig } from 'vitest/config';
import path from 'node:path';

const pureInclude = [
  'src/shared/lib/data/guards.ts',
  'src/shared/lib/errors/network.ts',
  'src/shared/lib/navigation/routeIds.ts',
  'src/shared/lib/a11y.ts',
  'src/shared/lib/analytics/track.ts',
  'src/shared/lib/ui/color.ts',
  'src/shared/lib/recommendation/mapApiRow.ts',
  'src/shared/lib/query/patchRecommendationList.ts',
  'src/shared/lib/query/invalidateAfterRexWrite.ts',
  'src/shared/api/fetchWithTimeout.ts',
  'src/features/auth/lib/errors.ts',
  'src/features/auth/lib/oauthCallback.ts',
  'src/features/auth/lib/credentials.ts',
  'src/shared/lib/errors/authSession.ts',
  'src/features/circles/lib/connectionPhase.ts',
  'src/features/circles/lib/labels.ts',
  'src/features/circles/lib/networkUserRow.ts',
  'src/features/circles/lib/circlePolicy.ts',
  'src/features/circles/lib/display.ts',
  'src/features/map/lib/geo.ts',
  'src/features/map/lib/clusterMarkers.ts',
  'src/features/map/lib/pinTypes.ts',
  'src/features/discover/lib/searchParams.ts',
  'src/features/discover/lib/filterChips.ts',
  'src/features/profile/lib/handle.ts',
  'src/features/rex-create/lib/steps.ts',
  'src/features/rex-create/lib/sharing.ts',
  'src/features/rex-create/lib/parseCreatedRexId.ts',
  'src/features/rex-detail/lib/rexCommentTree.ts',
];

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary'],
      include: pureInclude,
      thresholds: {
        lines: 95,
        functions: 95,
        branches: 90,
        statements: 95,
      },
    },
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
  define: {
    __DEV__: false,
  },
});

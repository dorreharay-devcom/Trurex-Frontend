# TruRex frontend

Expo Router client (iOS / Android / web) for TruRex.

## Setup

```bash
pnpm install
```

Env files in `env/` are loaded by `scripts/with-env.js`.

Public vars:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (or `EXPO_PUBLIC_SUPABASE_ANON_KEY`)
- `EXPO_PUBLIC_APP_SCHEME`
- `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY`

Native rebuild is required after changing MMKV, SecureStore, or NetInfo native deps.

## Scripts

```bash
pnpm start / start:ios:dev / start:android:dev / web
pnpm type-check
pnpm test
pnpm lint
pnpm eas:build:ios:prod
```

## Platform notes

| Capability             | Where                                                                |
| ---------------------- | -------------------------------------------------------------------- |
| Secure session storage | `authStorage.native.ts` (SecureStore + chunking; migrates from MMKV) |
| Offline reads          | PersistQueryClient → MMKV/localStorage; `networkMode: offlineFirst`  |
| Offline writes         | Blocked with toast (`assertOnlineForMutation`)                       |
| Online signal          | NetInfo → RQ `onlineManager` + offline banner                        |
| Timeouts / 429         | `fetchWithTimeout` + `network.ts` mapping                            |
| Analytics shell        | `track()` / `setAnalyticsSink()` — plug Segment/PostHog later        |
| CI gates               | `.gitlab-ci.yml` quality stage: type-check, test, lint               |

## Structure

- `src/app` Router layouts
- `src/features` Domain features
- `src/shared` API, storage, query
- `src/pages` Screen composition

## Quality

```bash
pnpm type-check && pnpm test && pnpm lint
```

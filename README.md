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

Native rebuild is required after changing MMKV, SecureStore, NetInfo, expo-updates, or other native deps.

## EAS Update (OTA)

JS/asset-only fixes can ship over-the-air. Native changes still need a store/dev-client rebuild.

- `runtimeVersion` policy: `appVersion` (OTA targets the same marketing version as the installed binary, e.g. `1.0.7`)
- Channels: `development` / `preview` / `production` (wired on each EAS build profile)
- Publish: `pnpm eas:update:dev` | `eas:update:preview` | `eas:update:prod`  
  (pass a message: `pnpm eas:update:prod -- --message "fix map pins"`)

You need a **new native build once** after adding `expo-updates` so devices can receive OTAs. Existing binaries without the module cannot update over-the-air.

## Scripts

```bash
pnpm start / start:ios:dev / start:android:dev / web
pnpm type-check
pnpm test
pnpm lint
pnpm eas:build:ios:prod
pnpm eas:update:prod
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
| OTA updates            | `expo-updates` + EAS channels; `checkForOtaUpdate` on boot           |
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

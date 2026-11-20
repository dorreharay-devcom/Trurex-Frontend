# TruRex frontend — security audit summary

**Target:** `frontend` (Expo 54 / React Native 0.81, web + iOS + Android) at commit `fc6ce66`, branch `TRUR-20`
**Date:** 2026-11-19
**Method:** Cloudflare `security-audit` skill (standard profile), Phase 1 reconnaissance plus a manual re-read of every cited line
**Status:** **Preliminary.** The skill's hunter, critic and independent-verifier phases have not run.

**Who fixes or answers each item:**

| Tag | Meaning |
|---|---|
| **FE** | Fixed in this repo (client code or client config) |
| **BE** | Fixed or answered in the Supabase backend (RLS policies, RPC bodies, edge functions, Auth settings), which isn't in this repo |
| **FE + BE** | Needs a change on both sides; the backend side is what makes it actually secure |
| **Infra** | Fixed in an external console or pipeline (Google Cloud, Expo/EAS, Netlify, GitLab/GitHub) |

## Do we have security issues?

**Yes.**
- **Three are in the client and visible in the source now:** #1–#3, tagged FE.
- **Three more could be high severity (#4–#6):** MFA, identity verification and several "who am I acting as" values are enforced only in the app UI. Whether they're actually exploitable depends on the Supabase backend.

No critical issue was found in the client itself. No server secret (`service_role`, private keys, CI tokens) is in the source or the git history.

## Limits of this review

- **Source only.** No app code was run.
- **The backend is out of scope.** The app talks only to Supabase: about 106 RPCs, 2 direct table reads, 4 edge functions, 2 storage buckets and realtime. Every authorization decision on the server is outside this repo.
- **No live systems were contacted.** That includes deployed endpoints, Supabase, Google and EAS.

## Findings

| # | Side | Priority | Issue | Status |
|---|---|---|---|---|
| 1 | **FE** | Medium | Session injection (login CSRF) through the auth callback link | Confirmed in source |
| 2 | **FE** (+ BE validation) | Medium | Website links open any URL scheme | Confirmed in source; runtime effect needs a device or browser check |
| 3 | **FE** | Medium | Cached user data survives logout and account switch | Confirmed in source |
| 4 | **BE + FE** | High *if the backend doesn't enforce MFA* | MFA is enforced only in the client | Needs backend validation |
| 5 | **BE** | High *if the flag is turned on* | Identity "verified" badge with no server-side proof | Needs backend validation |
| 6 | **BE** | Depends on backend | Client-chosen trust values (business mode, sign-up metadata, storage paths, wish-list visibility) | Needs backend validation |
| 7 | **Infra** | Depends on key restrictions | Google Maps key used for paid web-service calls from the client | Needs owner check |

### 1. Session injection through the auth callback link — FE (Medium)

`completeOAuthSessionFromUrl` accepts a raw `access_token` + `refresh_token` from the URL and calls `Auth.setSession`. The only checks are that the scheme and host match and that the path ends in `/auth/callback`. No PKCE verifier, `state` or nonce ties the callback to a sign-in this device started.

- [src/features/auth/lib/oauth.ts:34-53](src/features/auth/lib/oauth.ts#L34-L53): the token branch calls `setSession`.
- [src/features/auth/hooks/useOAuthCallback.ts:60-73](src/features/auth/hooks/useOAuthCallback.ts#L60-L73): on native, whatever link launched the app (`Linking.getInitialURL()`) is fed in.
- [src/features/auth/lib/oauthCallback.ts:5-27](src/features/auth/lib/oauthCallback.ts#L5-L27): any path ending in `/auth/callback` is accepted.
- [src/shared/api/client.ts:39-45](src/shared/api/client.ts#L39-L45): no `flowType`, so the default implicit flow is used. On web, `detectSessionInUrl` accepts `#access_token=…` on any page.

**Who:** an attacker who can get the victim to open a link (a web page, a message, or another app firing a `trurex://` intent).
**Result:** the victim is silently signed into the attacker's account. Anything they then create, upload or save (photos, places, wish lists, a business claim) lands in an account the attacker controls. The custom scheme also has no universal or app links, so on Android another app can register `trurex://` and intercept real callbacks.
**Fix:**
- **FE:** set `flowType: 'pkce'` on the Supabase client.
- **FE:** in `completeOAuthSessionFromUrl`, accept only `code` (exchanged against the locally stored verifier), reject URL-supplied tokens on native, and require the exact callback path.
- **FE + Infra:** longer term, move the callbacks to universal or app links.
- **BE:** keep the Supabase Auth redirect allowlist exact.

### 2. Website links open any URL scheme — FE (+ BE validation) (Medium)

`normalizeWebsiteUrl` returns anything shaped like `scheme://…` unchanged, so `javascript://…`, `intent://…`, `file://…` and other apps' schemes all pass. The value is free text entered by the rex author (`p_place_website_url`). The "website" button then opens it on every viewer's device.

- [src/shared/lib/data/guards.ts:181-186](src/shared/lib/data/guards.ts#L181-L186)
- [src/features/rex-detail/hooks/useRexDetail.ts:74-81](src/features/rex-detail/hooks/useRexDetail.ts#L74-L81): `Linking.openURL(websiteHref)`.
- On web, react-native-web's `Linking.openURL` calls `window.open(url, '_blank', 'noopener')`.

**Who:** any user who can create or edit a rex.
**Result:** another user who taps "website" opens a URL the author chose under any scheme: other apps' deep links or Android intents on native, and a `javascript:`-style URL on web. Whether script actually runs in the app's origin depends on how the browser handles `window.open` with `noopener`, so that part needs a local browser check.
**Fix:**
- **FE:** allow only `http:` and `https:` (parse with `new URL` and check `protocol`), both on display and before saving.
- **BE:** reject other schemes in `create_rex` / `update_rex`.

### 3. Cached user data survives logout and account switch — FE (Medium)

The whole React Query cache is persisted under `trurex.rq.v1` for 24 hours, with `networkMode: 'offlineFirst'`. Most query keys don't include the user ID, and sign-out never calls `queryClient.clear()`. The signed-URL cache and the create-rex draft also use fixed, non-user-scoped keys and aren't cleared.

- [src/shared/lib/query/queryClient.ts:5-26](src/shared/lib/query/queryClient.ts#L5-L26)
- [src/features/auth/providers/AuthProvider.tsx:48-65](src/features/auth/providers/AuthProvider.tsx#L48-L65): neither `signOut` nor `forceLocalSignOut` clears the cache.
- [src/shared/lib/storage/signedUrlCache.ts:15](src/shared/lib/storage/signedUrlCache.ts#L15)
- [src/features/rex-create/lib/createWizardDraft.ts:5](src/features/rex-create/lib/createWizardDraft.ts#L5): the draft holds geotag, review and photo paths.

**Who:** the next person to use the same browser or device: a shared computer, a family tablet, or account switching.
**Result:** the previous user's notifications, circles, saved items, referral info and draft show up or stay readable for the next account until they're refetched, and indefinitely while offline. On Android, `allowBackup` is left at the default and MMKV isn't encrypted, so this data is also included in device backups.
**Fix:**
- **FE:** on every sign-out path, call `queryClient.clear()`, remove `trurex.rq.v1`, clear the signed-URL cache and remove the draft key.
- **FE (alternative):** include the user ID in the persister key or set a `buster` per user.

### 4. MFA is enforced only in the client — BE + FE (High *if* the backend doesn't enforce it)

After the password step, the Supabase session (JWT) is already fully valid. Only a local flag (`trurex.mfa.pending`) keeps the user on the code screen:

- [src/features/auth/ui/ProtectedRoute.tsx:6-15](src/features/auth/ui/ProtectedRoute.tsx#L6-L15) checks only `session` and ignores `mfaPending`. It guards the rex, business, profile, collection, referrals, wish-list, wish-list-item, rex-request and create pages. On web, these can be opened directly by URL while MFA is still pending.
- [src/features/auth/providers/AuthProvider.tsx:71-75](src/features/auth/providers/AuthProvider.tsx#L71-L75): a 10s timer clears `mfaChecking`, while the auth fetch timeout is 30s. On a slow network the guards stop waiting before the MFA decision arrives.
- [src/features/auth/hooks/useMfaVerification.ts:52-59](src/features/auth/hooks/useMfaVerification.ts#L52-L59): when "send a new code" finds MFA no longer required, it enters the app without the biometric step that the normal path (`:40-50`) requires.
- The "trust this device" fingerprint is base64 of model + timezone on native, or user agent + timezone on web, and it's on by default. It's easy to guess if the server relies on it.

**Who:** someone who has a user's password but not their email inbox.
**Result:** if RPCs and RLS don't check MFA completion on the server, the attacker skips MFA entirely by calling Supabase directly; the client gate doesn't matter. If the server does check it, the FE items are UI consistency bugs.
**Fix:**
- **BE (the real control):** require MFA completion in RLS and RPCs (an AAL claim or a server-side "MFA verified" flag tied to the session), and bind trusted devices to something the server issues.
- **FE:** make `ProtectedRoute` redirect to `/mfa` when `mfaPending`, the same way `(main)/_layout.tsx` does.
- **FE:** don't let the timeout fail open.
- **FE:** run the biometric step on the resend path too.

### 5. Identity verification has no server-side proof — BE (High *if* the flag is turned on)

`markIdentityVerified` calls `verify_my_identity` with `{}`. The only "proof" is a local Face ID / Touch ID prompt, which counts as passed on web and on devices without biometrics.

- [src/features/identity-verification/lib/identityVerificationApi.ts:3-5](src/features/identity-verification/lib/identityVerificationApi.ts#L3-L5)
- [src/shared/config/featureFlags.ts:1](src/shared/config/featureFlags.ts#L1): `TEMPORARY_ENABLE_IDENTITY_VERIFICATION = false` hides only the UI.

**Result:** if the RPC is deployed, any signed-in user can mark themselves "verified" with one call, whatever the flag says.
**Fix:**
- **BE:** disable or remove the RPC until real verification exists, or make it require server-verified evidence.

### 6. Trust values the client chooses — BE (depends on backend)

The client sends these, and only server-side checks can make them safe:

- `p_posted_as_business` / `input_posted_as_business` on create-rex, comments and rex requests. The mode comes from device storage.
- Sign-up `user_metadata`: `is_business_account`, `referral_code` (taken from `?ref=`). The user can change these later through `updateUser`.
- Storage paths sent back to RPCs: `photo_paths`, `cover_image_path`, `p_photo_path`, the avatar URL.
- `/wish-list/[userId]` skips the "trusted user" check that the profile screen applies.
- The `circles` table fallback query has no owner filter, and realtime filters are built on the client (`user_id=eq.${userId}`).

**Fix:**
- **BE:** verify each of these on the server. See the backend questions below.

### 7. Google Maps key used directly from the client — Infra (depends on key restrictions)

`EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` (`AIza…`) is bundled into the app. It's used for the Maps SDK and for the paid **Geolocation** and **Geocoding** web services, called straight from the client ([src/features/map/lib/location.ts:36-46](src/features/map/lib/location.ts#L36-L46), [:195-202](src/features/map/lib/location.ts#L195-L202)). The same key is used in every environment.

**Fix:**
- **Infra:** restrict the key by API and by app (bundle ID / SHA-1) or referrer, set quotas, and use separate dev and prod keys.
- **FE / BE (optional):** move Geolocation and Geocoding calls behind an edge function.

## Hardening notes (not vulnerabilities on their own)

| Side | Note |
|---|---|
| **FE** | Web build has no Content-Security-Policy or `frame-ancestors` (`src/app/+html.tsx`, `public/netlify.toml`). Any future XSS would expose sessions, and the app can be framed. |
| **FE** | On web, auth tokens are stored in `localStorage`. |
| **FE + Infra** | `expo-updates` has no `codeSigningCertificate`. OTA update integrity rests entirely on HTTPS and the security of the Expo account. |
| **Infra** | `.gitlab-ci.yml`: `GITHUB_PAT` is put into the push URL, `git push --force` runs on `develop`, and the image `bitnami/git:latest` is unpinned. There are no test, lint or audit stages. |
| **FE** | Android `allowBackup` is left at the default (true), and MMKV is unencrypted (`src/shared/lib/storage/kv.native.ts:10`). |
| **FE** | The AsyncStorage → MMKV migration copies values but never deletes the AsyncStorage originals (`src/shared/lib/storage/kv.native.ts:21-37`). |
| **FE** | `AUTH_INVITE_CODE` is hard-coded in `src/features/auth/config/authInvite.ts:2`. The gate is disabled, so this matters only if it gets re-enabled. |
| **Infra** | `google-services.json` (Firebase API key `AIza…`) is tracked in git. Firebase keys are meant to be public-ish, but check their restrictions. |
| **Infra** | `.env.*` files containing the Supabase publishable key and the Maps key were committed in `70d47d1`, deleted in `11e49f8`, and mirrored to GitHub. Both are client keys, but if the Maps key is unrestricted, rotate it. |

## Checked and clean (FE)

- No `dangerouslySetInnerHTML` of our own, no `react-native-webview`, no `postMessage` or message listeners, no markdown or HTML rendering of user content (everything goes through RN `<Text>`).
- No string-built PostgREST filters (`.or()`, `.filter()`, `.ilike()`); every `.rpc()` call uses object parameters.
- Route IDs are UUID-validated (`parseOptionalRouteId`). No `redirect`/`next`/`returnTo` parameters. Redirect targets are constants.
- Push-notification taps reach only fixed in-app routes.
- No `service_role`, secret keys, private keys, `glpat-`/`ghp_` tokens or `EXPO_TOKEN` in the source or git history.
- On native, auth tokens are kept in `expo-secure-store`.
- Uploads are re-encoded to JPEG (EXIF stripped), use `${userId}/…` paths and `upsert: false`.

## Questions for the backend (Supabase) owner — BE

1. Do data RPCs and RLS require MFA completion for the session (an AAL claim or a server-side "MFA verified" flag)? How does `initiate_mfa` match a "trusted device", and is it bound to more than a client-supplied fingerprint? *(#4)*
2. Is `verify_my_identity` deployed? What does it check besides `auth.uid()`? *(#5)*
3. Do `create_rex`, the comment RPCs and the rex-request RPCs check that the caller actually owns a business profile before honoring `posted_as_business`? *(#6)*
4. Do any triggers or policies trust `raw_user_meta_data.is_business_account` or `referral_code`? *(#6)*
5. Do `update_business_profile`, `update_my_avatar_url`, collection cover and `photo_paths` verify that the storage path starts with the caller's own `uid`? What are the storage policies on `rex-images` and `user-avatars`? *(#6)*
6. Does `get_user_wish_list` enforce the "trusted user" relationship? Does RLS on `circles`, `user_notifications` and `rex_comments` (including realtime) limit rows to the owner or member? *(#6)*
7. In Supabase Auth settings: is the redirect allowlist exact (no wildcards)? Are leaked-password protection and secure password change enabled? *(#1)*
8. Is `place_website_url` validated on the server (http/https only)? *(#2)*

## Recommended next steps

| Side | Step |
|---|---|
| **FE** | PKCE plus code-only callbacks (#1); http/https allowlist for website links (#2); clear caches and drafts on every sign-out path (#3); `ProtectedRoute` honors `mfaPending`, no fail-open timeout, biometric on the resend path (#4). |
| **BE** | Answer the questions above. They decide whether #4–#6 are real high-severity issues. |
| **Infra** | Restrict and split the Google Maps key (#7); OTA code signing; pin the CI image. |
| **FE** | A CSP and `frame-ancestors` via Netlify headers. |
| **All** | Optional: run the skill's full validated pipeline (hunters → critics → independent verifiers) for a schema-validated `findings.json` and full report. |

import { canUseDOM } from '~/shared/lib/ui/platform';

// iOS Safari auto-zooms the page when a focused input's font-size is under 16px, unless
// the viewport disables user scaling. Expo's web HTML shell (which we don't own directly —
// it's generated internally under `web.output: 'single'`) only sets a bare
// `width=device-width, initial-scale=1` viewport, so this patches it in at runtime instead
// of duplicating Expo's template or overriding global input styles.
const NO_ZOOM_VIEWPORT_CONTENT =
  'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no';

export function disableMobileSafariInputZoom(): void {
  if (!canUseDOM()) return;
  let meta = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'viewport';
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', NO_ZOOM_VIEWPORT_CONTENT);
}

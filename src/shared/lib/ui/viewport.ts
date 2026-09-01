import { canUseDOM } from '~/shared/lib/ui/platform';

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

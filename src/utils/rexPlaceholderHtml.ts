/**
 * BE placeholders use aspect-ratio for standalone cards; in the feed the RN parent
 * already enforces 4:3 — strip aspect-ratio and fill the slot to avoid a bg-muted gap.
 */
export function normalizeRexPlaceholderHtmlForFeed(html: string): string {
  const trimmed = html.trim();
  if (!/^<div\s/i.test(trimmed)) return trimmed;

  return trimmed.replace(/^(<div\s+style=")([^"]*)(")/i, (_match, open, styles, close) => {
    let s = styles
      .replace(/aspect-ratio\s*:\s*[^;]+;?/gi, '')
      .replace(/border-radius\s*:\s*[^;]+;?/gi, '')
      .replace(/border\s*:\s*[^;]+;?/gi, '');

    if (!/width\s*:\s*100%/i.test(s)) s += 'width:100%;';
    if (!/height\s*:\s*100%/i.test(s)) s += 'height:100%;';
    if (!/min-height\s*:\s*100%/i.test(s)) s += 'min-height:100%;';
    if (!/box-sizing\s*:/i.test(s)) s += 'box-sizing:border-box;';

    return `${open}${s}${close}`;
  });
}

export function wrapRexPlaceholderHtmlForFeed(html: string): string {
  const inner = normalizeRexPlaceholderHtmlForFeed(html);
  return `<div style="position:absolute;inset:0;margin:0;padding:0;overflow:hidden;">${inner}</div>`;
}

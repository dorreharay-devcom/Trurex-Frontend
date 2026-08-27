import { useEffect, type RefObject } from 'react';
import type { View } from 'react-native';
import { canUseDOM } from '~/shared/lib/ui/platform';

export function useDismissOnOutsideInteraction(
  refs: RefObject<View | null>[],
  enabled: boolean,
  onDismiss: () => void,
) {
  useEffect(() => {
    if (!enabled || !canUseDOM()) return;

    const isInsideRefs = (target: Node) =>
      refs.some((ref) => (ref.current as unknown as HTMLElement | null)?.contains(target));

    const dismissIfOutside = (event: MouseEvent | Event) => {
      if (!isInsideRefs(event.target as Node)) onDismiss();
    };

    document.addEventListener('mousedown', dismissIfOutside);
    document.addEventListener('scroll', dismissIfOutside, true);
    return () => {
      document.removeEventListener('mousedown', dismissIfOutside);
      document.removeEventListener('scroll', dismissIfOutside, true);
    };
  }, [refs, enabled, onDismiss]);
}

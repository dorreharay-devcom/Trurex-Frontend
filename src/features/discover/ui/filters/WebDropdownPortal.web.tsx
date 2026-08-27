import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { canUseDOM } from '~/shared/lib/ui/platform';

type Props = {
  active: boolean;
  children: ReactNode;
};

function WebDropdownPortal({ active, children }: Props) {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!active || !canUseDOM()) return;
    const node = document.createElement('div');
    document.body.appendChild(node);
    nodeRef.current = node;
    setReady(true);
    return () => {
      document.body.removeChild(node);
      nodeRef.current = null;
      setReady(false);
    };
  }, [active]);

  if (!active || !ready || !nodeRef.current) return null;
  return createPortal(children, nodeRef.current);
}

export default WebDropdownPortal;

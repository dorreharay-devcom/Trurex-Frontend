import React from 'react';
import RexRequestDetailModal from '~/features/rex-requests/ui/detail/RexRequestDetailModal';
import type { RexRequestRow } from '~/features/rex-requests/api/types';

type Props = {
  visible: boolean;
  embedded?: boolean;
  request: RexRequestRow | null;
  onClose: () => void;
  onUserPress?: (userId: string) => void;
  onEditRequest?: (requestId: string) => void;
  onOpenRex?: (rexId: string) => void;
};

function RexRequestDetailHost({ visible, embedded = false, request, onClose, ...rest }: Props) {
  if (!request) return null;

  return (
    <RexRequestDetailModal
      visible={visible}
      embedded={embedded}
      request={request}
      onClose={onClose}
      {...rest}
    />
  );
}

export default RexRequestDetailHost;

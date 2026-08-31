import React from 'react';
import DestructiveActionConfirmModal from '~/shared/ui/destructive-confirm/DestructiveActionConfirmModal';
import ReportContentDialog from '~/features/rex-detail/ui/report/ReportContentDialog';
import type { DeleteRexRequestState } from '~/features/rex-requests/hooks/detail/useDeleteRexRequest';
import type { RexRequestReportTargetState } from '~/features/rex-requests/hooks/detail/useRexRequestReportTarget';

const DELETE_REX_REQUEST_MESSAGE =
  "This permanently removes this request and its responses and comments. This can't be undone.";

type Props = {
  report: RexRequestReportTargetState;
  del: DeleteRexRequestState;
};

function RexRequestDetailOverlays({ report, del }: Props) {
  return (
    <>
      <ReportContentDialog
        open={report.reportTarget != null}
        onOpenChange={(o) => {
          if (!o) report.clearReportTarget();
        }}
        target={report.reportTarget}
      />
      <DestructiveActionConfirmModal
        visible={del.confirmOpen}
        title="Delete this request?"
        message={DELETE_REX_REQUEST_MESSAGE}
        confirmLabel="Delete"
        pending={del.pending}
        onCancel={del.closeConfirm}
        onConfirm={del.confirmDelete}
      />
    </>
  );
}

export default RexRequestDetailOverlays;

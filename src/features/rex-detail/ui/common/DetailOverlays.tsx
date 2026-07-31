import React from 'react';
import AddToCollectionSheet from '~/components/faves/AddToCollectionSheet';
import { DestructiveActionConfirmModal } from '~/components/common/DestructiveActionConfirmModal';
import ReportContentDialog from '~/features/rex-detail/ui/report/ReportContentDialog';
import type { DeleteRexState } from '~/features/rex-detail/hooks/useDeleteRex';
import type { ReportTargetState } from '~/features/rex-detail/hooks/report/useReportTarget';
import type { SaveRexState } from '~/features/rex-detail/hooks/useSaveRex';

const DELETE_REX_MESSAGE =
  "This permanently removes this rex and related likes, comments, photos, saves, and collection entries. This can't be undone.";

type Props = {
  report: ReportTargetState;
  del: DeleteRexState;
  save: SaveRexState;
};

function DetailOverlays({ report, del, save }: Props) {
  return (
    <>
      <ReportContentDialog
        inline
        open={report.reportTarget != null}
        onOpenChange={(o) => {
          if (!o) report.clearReportTarget();
        }}
        target={report.reportTarget}
      />
      <DestructiveActionConfirmModal
        inline
        visible={del.confirmOpen}
        title="Delete recommendation?"
        message={DELETE_REX_MESSAGE}
        confirmLabel="Delete"
        pending={del.pending}
        onCancel={del.closeConfirm}
        onConfirm={del.confirmDelete}
      />
      <AddToCollectionSheet
        open={save.saveOpen}
        rec={save.recSummary}
        onClose={save.closeSave}
        onSaved={save.markSaved}
        onUnsaved={save.markUnsaved}
        onUnsaveFailed={save.markSaved}
        onSaveRexFailed={save.markUnsaved}
      />
    </>
  );
}

export default DetailOverlays;

import React from 'react';
import { CreateModal } from '~/features/rex-create';
import RexDetailHost from '~/features/rex-detail/ui/RexDetailHost';
import type { AddYourOwnRecSource } from '~/features/rex-create';
import type { CreateRexModalState } from '~/pages/home/hooks/useCreateRexModal';
import type { RexPreviewState } from '~/features/rex-detail/hooks/useRexPreview';

type Props = {
  create: CreateRexModalState;
  preview: RexPreviewState;
  onAddYourOwn: (source: AddYourOwnRecSource) => void;
  onEditRex: (rexId: string) => void;
  onUserPress: (userId: string) => void;
};

function HomeOverlays({ create, preview, onAddYourOwn, onEditRex, onUserPress }: Props) {
  return (
    <>
      {create.visible ? (
        <CreateModal
          visible
          onClose={create.close}
          addYourOwnPrefill={create.addYourOwnPrefill}
          editRexId={create.editRexId}
        />
      ) : null}

      <RexDetailHost
        visible={preview.visible}
        recommendation={preview.recommendation}
        onClose={preview.close}
        onDismiss={preview.clear}
        onAddYourOwn={onAddYourOwn}
        onCommentCountChange={() => {}}
        scrollToComments={preview.options.scrollToComments}
        scrollToCommentId={preview.options.scrollToCommentId}
        onAuthorPress={onUserPress}
        onUserPress={onUserPress}
        onEditRex={onEditRex}
      />
    </>
  );
}

export default HomeOverlays;

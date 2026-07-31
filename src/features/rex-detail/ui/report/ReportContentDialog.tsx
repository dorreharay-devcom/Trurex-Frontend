import React from 'react';
import { View, Modal, ScrollView, useWindowDimensions, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isWeb } from '~/utils';
import type { ContentReportTarget } from '~/features/rex-detail/types/contentReport';
import { useContentReportFlow } from '~/features/rex-detail/hooks/report/useContentReportFlow';
import { useAuth } from '~/features/auth/providers';
import { toastInfo } from '~/utils/appToast';
import { ModalToastLayer } from '~/shared/ui/toast/ModalToastLayer';
import ReportDialogShell from './common/ReportDialogShell';
import ReportDialogHeader from './common/ReportDialogHeader';
import ReportFormBody from './common/ReportFormBody';
import ReportFooter from './common/ReportFooter';
import { OVERLAY_MODAL_PLATFORM_PROPS } from '~/shared/config/modalProps';

const FORM_FOOTER_EST = 100;
const HEADER_EST = 56;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target: ContentReportTarget | null;
  inline?: boolean;
};

const ReportContentDialog: React.FC<Props> = ({ open, onOpenChange, target, inline = false }) => {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const maxSheetHeight = Math.min(windowHeight * 0.92, 720);
  const formScrollMaxHeight = Math.max(
    200,
    maxSheetHeight - HEADER_EST - FORM_FOOTER_EST - insets.bottom,
  );
  const flow = useContentReportFlow({ open, target });
  const heading = target?.kind === 'comment' ? 'Report this comment' : 'Report this Rex';

  const onRequestClose = () => {
    onOpenChange(false);
  };

  const handleCancel = () => {
    flow.reset();
    onRequestClose();
  };

  const handleSubmit = async () => {
    if (!flow.canSubmit) return;
    const ok = await flow.submit();
    if (ok) onRequestClose();
  };

  if (!open || !target) return null;

  const content = (
    <ReportDialogShell maxSheetHeight={maxSheetHeight} onDismiss={onRequestClose}>
      <ReportDialogHeader heading={heading} onClose={onRequestClose} />
      <ScrollView
        className="px-5"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
        bounces
        style={{
          maxHeight: formScrollMaxHeight,
          ...(isWeb ? { minHeight: 0 } : null),
        }}
        contentContainerStyle={{ paddingBottom: 12 }}
      >
        <ReportFormBody
          flow={flow}
          signedIn={user != null}
          onSignedInPrompt={() => toastInfo('Sign in', 'Sign in to report content.')}
        />
      </ScrollView>
      {user ? (
        <ReportFooter
          canSubmit={flow.canSubmit}
          isSubmitting={flow.isSubmitting}
          onCancel={handleCancel}
          onSubmit={() => void handleSubmit()}
        />
      ) : null}
    </ReportDialogShell>
  );

  if (inline) {
    return (
      <View style={styles.inlineRoot} pointerEvents="box-none">
        {content}
      </View>
    );
  }

  return (
    <Modal
      visible={open}
      animationType="fade"
      transparent
      {...OVERLAY_MODAL_PLATFORM_PROPS}
      onRequestClose={onRequestClose}
    >
      {content}
      <ModalToastLayer />
    </Modal>
  );
};

const styles = StyleSheet.create({
  inlineRoot: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2000,
    elevation: 2000,
  },
});

export default ReportContentDialog;

import React from 'react';
import { View, Modal, ScrollView, useWindowDimensions, StyleSheet } from 'react-native';
import { isWeb } from '~/shared/lib/ui/platform';
import { useThankMessageFlow } from '~/features/rex-detail/hooks/useThankMessageFlow';
import { ModalToastLayer } from '~/shared/ui/toast/ModalToastLayer';
import { OVERLAY_MODAL_PLATFORM_PROPS } from '~/shared/config/overlaySheet';
import ReportDialogShell from '~/features/rex-detail/ui/report/common/ReportDialogShell';
import ThankMessageDialogHeader from '~/features/rex-detail/ui/common/thank/ThankMessageDialogHeader';
import ThankMessageFormBody from '~/features/rex-detail/ui/common/thank/ThankMessageFormBody';
import ThankMessageFooter from '~/features/rex-detail/ui/common/thank/ThankMessageFooter';

const FORM_FOOTER_EST = 100;
const HEADER_EST = 56;

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (message: string) => void;
};

function ThankMessageSheet({ open, onClose, onSelect }: Props) {
  const { height: windowHeight } = useWindowDimensions();
  const maxSheetHeight = Math.min(windowHeight * 0.92, 720);
  const formScrollMaxHeight = Math.max(200, maxSheetHeight - HEADER_EST - FORM_FOOTER_EST);
  const flow = useThankMessageFlow({ open });

  const handleCancel = () => {
    flow.reset();
    onClose();
  };

  const handleSubmit = () => {
    if (!flow.canSubmit || flow.finalMessage == null) return;
    onSelect(flow.finalMessage);
  };

  if (!open) return null;

  const content = (
    <ReportDialogShell maxSheetHeight={maxSheetHeight} onDismiss={onClose}>
      <ThankMessageDialogHeader onClose={onClose} />
      <ScrollView
        className="px-5"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator
        bounces
        style={{
          maxHeight: formScrollMaxHeight,
          ...(isWeb ? { minHeight: 0 } : null),
        }}
        contentContainerStyle={{ paddingBottom: 12 }}
      >
        <ThankMessageFormBody flow={flow} />
      </ScrollView>
      <ThankMessageFooter
        canSubmit={flow.canSubmit}
        isSubmitting={false}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </ReportDialogShell>
  );

  return (
    <Modal
      visible={open}
      animationType="fade"
      transparent
      {...OVERLAY_MODAL_PLATFORM_PROPS}
      onRequestClose={onClose}
    >
      <View style={styles.modalRoot}>{content}</View>
      <ModalToastLayer />
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
  },
});

export default ThankMessageSheet;

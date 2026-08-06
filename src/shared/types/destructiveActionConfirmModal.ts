import type { ReactNode } from 'react';

export type DestructiveActionConfirmModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  icon?: ReactNode;
  pending?: boolean;
  inline?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

import React, { type ReactNode } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  StyleSheet,
  Animated,
  type ViewStyle,
} from 'react-native';
import { CheckCheck } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import { isWeb } from '~/shared/lib/ui/platform';
import SheetHandle from '~/shared/ui/overlay/SheetHandle';
import { ModalToastLayer } from '~/shared/ui/toast/ModalToastLayer';

type Props = {
  open: boolean;
  compact: boolean;
  height: number;
  width: number;
  anchor: { top: number; right: number } | null;
  slide: Animated.Value;
  bottomInset: number;
  onClose: () => void;
  onMarkAllRead: () => void;
  children: ReactNode;
};

const PanelHeader = ({ onMarkAllRead }: { onMarkAllRead: () => void }) => (
  <View className="flex-row items-center justify-between border-b border-border px-4 py-3">
    <Text className="text-sm font-semibold text-foreground">Notifications</Text>
    <Pressable
      onPress={onMarkAllRead}
      className="flex-row items-center gap-1 active:opacity-70"
      accessibilityRole="button"
      accessibilityLabel="Mark all notifications as read"
    >
      <CheckCheck size={14} color={Theme.colors.secondaryText} />
      <Text className="text-xs text-muted-foreground">Mark all read</Text>
    </Pressable>
  </View>
);

const NotificationPanel = ({
  open,
  compact,
  height,
  width,
  anchor,
  slide,
  bottomInset,
  onClose,
  onMarkAllRead,
  children,
}: Props) => (
  <Modal
    visible={open}
    transparent
    animationType="fade"
    onRequestClose={onClose}
    statusBarTranslucent
  >
    <View className="flex-1" style={StyleSheet.absoluteFillObject}>
      <Pressable
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: compact ? 'rgba(0,0,0,0.4)' : 'transparent' },
          isWeb ? ({ cursor: 'default' } as unknown as ViewStyle) : null,
        ]}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close notifications"
      />

      {compact ? (
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            transform: [{ translateY: slide }],
          }}
        >
          <View className="overflow-hidden rounded-t-2xl border-t border-border bg-card">
            <SheetHandle hideOnWeb={false} className="py-3" />
            <PanelHeader onMarkAllRead={onMarkAllRead} />
            <ScrollView
              style={{ maxHeight: height * 0.65 }}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
            >
              {children}
              <View style={{ height: Math.max(bottomInset, 16) }} />
            </ScrollView>
          </View>
        </Animated.View>
      ) : null}

      {!compact && anchor ? (
        <View
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            top: anchor.top,
            right: anchor.right,
            width: Math.min(384, width - 16),
            maxHeight: height * 0.7,
            zIndex: 10,
          }}
        >
          <View className="overflow-hidden rounded-xl border border-border bg-card shadow-lg">
            <PanelHeader onMarkAllRead={onMarkAllRead} />
            <ScrollView
              className="max-h-[420px]"
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
            >
              {children}
            </ScrollView>
          </View>
        </View>
      ) : null}
    </View>
    <ModalToastLayer />
  </Modal>
);

export default NotificationPanel;

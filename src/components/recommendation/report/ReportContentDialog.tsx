import React from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  useWindowDimensions,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShieldAlert, X } from 'lucide-react-native';
import { Theme, textFieldCaretStyle, textFieldMultilineStyle } from '~/theme/Theme';
import { webNoOutline } from '~/components/recommendation/create/steps/search/common/webInputOutline';
import {
  type ContentReportTarget,
  CONTENT_REPORT_OTHER_CODE,
  MAX_CONTENT_REPORT_DETAILS,
} from '~/constants/recommendation/contentReport';
import { useContentReportFlow } from '~/hooks/recommendation/useContentReportFlow';
import { useAuth } from '~/services/AuthContext';
import { cn } from '~/utils/general';
import { toastInfo } from '~/utils/appToast';
import { CREATE_REC_MODAL_MAX_W } from '~/constants/recommendation/createLayout';
import { ModalToastLayer } from '~/components/toast/ModalToastLayer';

const isWeb = Platform.OS === 'web';

const webTextAreaOutline = Platform.OS === 'web' ? { outlineStyle: 'none' as const } : undefined;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target: ContentReportTarget | null;
  inline?: boolean;
};

const FORM_FOOTER_EST = 100;

export const ReportContentDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  target,
  inline = false,
}) => {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const maxSheetHeight = Math.min(windowHeight * 0.92, 720);
  const formScrollMaxHeight = Math.max(200, maxSheetHeight - 56 - FORM_FOOTER_EST - insets.bottom);
  const {
    reason,
    setReason,
    details,
    setDetails,
    reasonOptions,
    reasonsLoading,
    reasonsError,
    refetchReasons,
    canSubmit,
    isSubmitting,
    reset,
    submit,
  } = useContentReportFlow({
    open,
    target,
  });
  const heading = target?.kind === 'comment' ? 'Report this comment' : 'Report this Rex';
  const subtext = "Help us keep TruRex trustworthy. What's the issue?";

  const onRequestClose = () => {
    onOpenChange(false);
  };

  const openReportIfSignedIn = () => {
    if (!user) {
      toastInfo('Sign in', 'Sign in to report content.');
    }
  };

  if (!open || !target) return null;

  const shellLayoutStyle = {
    width: '100%' as const,
    maxWidth: isWeb ? CREATE_REC_MODAL_MAX_W : windowWidth,
    ...(isWeb ? { alignSelf: 'center' as const } : null),
  };

  const sheetShell = (children: React.ReactNode) =>
    Platform.OS === 'ios' ? (
      <KeyboardAvoidingView behavior="padding" style={shellLayoutStyle}>
        {children}
      </KeyboardAvoidingView>
    ) : (
      <View style={shellLayoutStyle}>{children}</View>
    );

  const content = (
    <View
      className="flex-1"
      style={{
        justifyContent: isWeb ? 'center' : 'flex-end',
        paddingHorizontal: isWeb ? 16 : 0,
      }}
      pointerEvents="box-none"
    >
      <Pressable
        className="absolute bottom-0 left-0 right-0 top-0"
        style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
        onPress={onRequestClose}
        accessibilityRole="button"
        accessibilityLabel="Dismiss"
      />
      <View className={isWeb ? 'w-full items-center' : 'w-full'} pointerEvents="box-none">
        {sheetShell(
          <View
            className={cn(
              'w-full bg-card',
              isWeb
                ? 'max-w-full rounded-2xl border border-border shadow-elevated'
                : 'rounded-t-2xl border-x border-t border-border',
            )}
            style={{
              maxHeight: maxSheetHeight,
              width: '100%',
              paddingBottom: isWeb ? 0 : undefined,
              ...(isWeb ? { overflow: 'hidden' as const } : null),
            }}
          >
            <>
              <View className="flex-row items-center justify-between px-4 pb-3 pt-3">
                <View className="min-w-0 flex-1 flex-row items-center gap-2 pr-2">
                  <ShieldAlert size={20} color={Theme.colors.secondaryText} />
                  <Text className="text-lg font-semibold text-foreground" numberOfLines={2}>
                    {heading}
                  </Text>
                </View>
                <Pressable
                  onPress={onRequestClose}
                  className="h-10 w-10 shrink-0 items-center justify-center rounded-lg active:opacity-70"
                  hitSlop={8}
                  accessibilityLabel="Close report dialog"
                >
                  <X size={20} color={Theme.colors.secondaryText} />
                </Pressable>
              </View>
              <ScrollView
                className="px-5"
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={true}
                bounces
                style={{
                  maxHeight: formScrollMaxHeight,
                  ...(Platform.OS === 'web' ? { minHeight: 0 } : null),
                }}
                contentContainerStyle={{ paddingBottom: 12 }}
              >
                {user == null ? (
                  <View className="items-center py-4">
                    <Text className="text-center text-sm text-muted-foreground">
                      Sign in to report content.
                    </Text>
                    <Pressable onPress={openReportIfSignedIn} className="mt-2 rounded-lg px-2 py-1">
                      <Text className="text-sm text-primary">OK</Text>
                    </Pressable>
                  </View>
                ) : reasonsLoading ? (
                  <View className="items-center py-8">
                    <ActivityIndicator color={Theme.colors.primary} />
                    <Text className="mt-2 text-sm text-muted-foreground">Loading reasons…</Text>
                  </View>
                ) : reasonsError ? (
                  <View className="items-center gap-2 py-6">
                    <Text className="text-center text-sm text-muted-foreground">
                      Could not load report reasons.
                    </Text>
                    <Pressable onPress={() => void refetchReasons()} className="rounded-lg py-2">
                      <Text className="text-sm font-medium text-primary">Retry</Text>
                    </Pressable>
                  </View>
                ) : reasonOptions.length === 0 ? (
                  <View className="items-center py-6">
                    <Text className="text-center text-sm text-muted-foreground">
                      No report reasons are available right now. Try again later.
                    </Text>
                  </View>
                ) : (
                  <>
                    <Text className="mb-3 text-sm text-muted-foreground">{subtext}</Text>

                    <View className="pb-2">
                      {reasonOptions.map((r) => {
                        const active = reason === r.value;
                        return (
                          <Pressable
                            key={r.value}
                            onPress={() => {
                              if (!user) {
                                openReportIfSignedIn();
                                return;
                              }
                              setReason(r.value);
                            }}
                            className="mb-2.5 flex-row items-start gap-3 rounded-lg py-1 active:opacity-90"
                            accessibilityRole="radio"
                            accessibilityState={{ checked: active }}
                          >
                            <View
                              className={cn(
                                'mt-0.5 h-4 w-4 items-center justify-center rounded-full border-2',
                                active ? 'border-primary bg-primary' : 'border-border',
                              )}
                            >
                              {active ? (
                                <View className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                              ) : null}
                            </View>
                            <Text className="min-w-0 flex-1 text-sm leading-5 text-foreground">
                              {r.label}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>

                    {reason != null &&
                    reason.toLowerCase() === CONTENT_REPORT_OTHER_CODE.toLowerCase() ? (
                      <View className="mb-3">
                        <TextInput
                          placeholder="Describe the issue (required)"
                          placeholderTextColor={Theme.colors.secondaryText}
                          value={details}
                          onChangeText={setDetails}
                          maxLength={MAX_CONTENT_REPORT_DETAILS}
                          multiline
                          numberOfLines={3}
                          className="min-h-[80px] rounded-[12px] border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground"
                          style={[
                            textFieldCaretStyle,
                            textFieldMultilineStyle,
                            webTextAreaOutline,
                            webNoOutline,
                          ]}
                        />
                        <Text className="text-right text-[10px] text-muted-foreground">
                          {details.length}/{MAX_CONTENT_REPORT_DETAILS}
                        </Text>
                      </View>
                    ) : null}
                  </>
                )}
              </ScrollView>

              {user ? (
                <View className="mt-1 flex-row justify-end gap-2 border-t border-border px-4 pb-3 pt-3">
                  <Pressable
                    onPress={() => {
                      reset();
                      onRequestClose();
                    }}
                    className="rounded-lg px-4 py-2.5 active:opacity-80"
                    accessibilityLabel="Cancel"
                  >
                    <Text className="text-sm font-medium text-muted-foreground">Cancel</Text>
                  </Pressable>
                  <View className={cn(!canSubmit && 'cursor-not-allowed')}>
                    <Pressable
                      onPress={async () => {
                        if (!canSubmit) return;
                        if (!user) {
                          openReportIfSignedIn();
                          return;
                        }
                        const ok = await submit();
                        if (ok) onRequestClose();
                      }}
                      disabled={!canSubmit}
                      className={cn(
                        'rounded-lg px-4 py-2.5',
                        canSubmit
                          ? 'cursor-pointer bg-primary active:opacity-90'
                          : 'cursor-not-allowed bg-primary/40 opacity-50',
                      )}
                      accessibilityLabel="Submit report"
                      accessibilityState={{ disabled: !canSubmit }}
                    >
                      {isSubmitting ? (
                        <ActivityIndicator color={Theme.colors.primaryForeground} />
                      ) : (
                        <Text
                          className={cn(
                            'text-sm font-semibold',
                            canSubmit ? 'text-primary-foreground' : 'text-primary-foreground/60',
                          )}
                        >
                          Submit report
                        </Text>
                      )}
                    </Pressable>
                  </View>
                </View>
              ) : null}
            </>
          </View>,
        )}
      </View>
    </View>
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
      presentationStyle={Platform.OS === 'ios' ? 'overFullScreen' : undefined}
      onRequestClose={onRequestClose}
      statusBarTranslucent
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

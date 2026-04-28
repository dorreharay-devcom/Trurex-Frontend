import React, { useMemo } from 'react';
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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShieldAlert, X } from 'lucide-react-native';
import { Theme, textFieldCaretStyle } from '~/theme/Theme';
import { webNoOutline } from '~/components/recommendation/create/steps/search/common/webInputOutline';
import {
  type ContentReportTarget,
  reasonOptionsForTarget,
  MAX_CONTENT_REPORT_DETAILS,
} from '~/constants/recommendation/contentReport';
import { useContentReportFlow } from '~/hooks/recommendation/useContentReportFlow';
import { useAuth } from '~/services/AuthContext';
import { cn } from '~/utils/general';
import { toastInfo } from '~/utils/appToast';
import { CREATE_REC_MODAL_MAX_W } from '~/constants/recommendation/createLayout';

const isWeb = Platform.OS === 'web';

const webTextAreaOutline = Platform.OS === 'web' ? { outlineStyle: 'none' as const } : undefined;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target: ContentReportTarget | null;
};

const FORM_FOOTER_EST = 100;

export const ReportContentDialog: React.FC<Props> = ({ open, onOpenChange, target }) => {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const maxSheetHeight = Math.min(windowHeight * 0.92, 720);
  const formScrollMaxHeight = Math.max(200, maxSheetHeight - 56 - FORM_FOOTER_EST - insets.bottom);
  const { reason, setReason, details, setDetails, canSubmit, reset, submit } = useContentReportFlow(
    {
      open,
      target,
    },
  );

  const options = useMemo(() => reasonOptionsForTarget(target), [target]);
  const heading = target?.kind === 'comment' ? 'Report this comment' : 'Report this Rex';
  const subtext =
    target?.kind === 'comment'
      ? "What's the issue with this comment?"
      : "Help us keep TruRex trustworthy. What's the issue?";

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

  return (
    <Modal
      visible={open}
      animationType="fade"
      transparent
      onRequestClose={onRequestClose}
      statusBarTranslucent
    >
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
                'w-full border border-border bg-card',
                isWeb ? 'shadow-elevated max-w-full rounded-2xl' : 'rounded-t-2xl',
              )}
              style={{
                maxHeight: maxSheetHeight,
                width: '100%',
                paddingTop: 12,
                paddingBottom: Math.max(12, insets.bottom + 4),
                ...(isWeb ? { overflow: 'hidden' as const } : null),
              }}
            >
              <>
                <View className="mb-1 flex-row items-center justify-end px-2">
                  <Pressable
                    onPress={onRequestClose}
                    className="h-10 w-10 items-center justify-center rounded-lg active:opacity-70"
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
                      <Pressable
                        onPress={openReportIfSignedIn}
                        className="mt-2 rounded-lg px-2 py-1"
                      >
                        <Text className="text-sm text-primary">OK</Text>
                      </Pressable>
                    </View>
                  ) : (
                    <>
                      <View className="mb-3 flex-row items-start gap-2">
                        <ShieldAlert
                          size={20}
                          color={Theme.colors.secondaryText}
                          style={{ marginTop: 2 }}
                        />
                        <View className="min-w-0 flex-1">
                          <Text className="text-lg font-semibold text-foreground">{heading}</Text>
                          <Text className="mt-1 text-sm text-muted-foreground">{subtext}</Text>
                        </View>
                      </View>

                      <View className="pb-2">
                        {options.map((r) => {
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

                      {reason === 'other' ? (
                        <View className="mb-3">
                          <TextInput
                            placeholder="Tell us a bit more (optional)"
                            placeholderTextColor={Theme.colors.secondaryText}
                            value={details}
                            onChangeText={setDetails}
                            maxLength={MAX_CONTENT_REPORT_DETAILS}
                            multiline
                            numberOfLines={3}
                            className="min-h-[80px] rounded-[12px] border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground"
                            style={[textFieldCaretStyle, webTextAreaOutline, webNoOutline]}
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
                  <View className="mt-1 flex-row justify-end gap-2 border-t border-border px-4 pt-3">
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
                    <Pressable
                      onPress={() => {
                        if (!user) {
                          openReportIfSignedIn();
                          return;
                        }
                        void submit();
                      }}
                      className="rounded-lg bg-primary px-4 py-2.5 active:opacity-50"
                      disabled={!canSubmit}
                      accessibilityLabel="Submit report (not available yet)"
                      accessibilityState={{ disabled: !canSubmit }}
                    >
                      <Text className="text-sm font-semibold text-primary-foreground">
                        Submit report
                      </Text>
                    </Pressable>
                  </View>
                ) : null}
              </>
            </View>,
          )}
        </View>
      </View>
    </Modal>
  );
};

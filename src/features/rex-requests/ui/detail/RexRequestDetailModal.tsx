import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Tag } from 'lucide-react-native';
import { OverlayModal } from '~/shared/ui/overlay/OverlayModal';
import { useOverlaySheetPresentation } from '~/shared/hooks/useOverlaySheetPresentation';
import { useAuth } from '~/features/auth/providers';
import DetailHeader from '~/features/rex-detail/ui/common/DetailHeader';
import { webContainerStyle } from '~/shared/lib/ui/styles';
import { Theme } from '~/shared/theme/Theme';
import type { RexRequestRow } from '~/features/rex-requests/api/types';
import { useDeleteRexRequest } from '~/features/rex-requests/hooks/detail/useDeleteRexRequest';
import { useResolveRexRequest } from '~/features/rex-requests/hooks/detail/useResolveRexRequest';
import { useUntagRexFromRequest } from '~/features/rex-requests/hooks/detail/useUntagRexFromRequest';
import { useRexRequestReportTarget } from '~/features/rex-requests/hooks/detail/useRexRequestReportTarget';
import { useRexRequestResponses } from '~/features/rex-requests/hooks/detail/useRexRequestResponses';
import { useShareRexRequest } from '~/features/rex-requests/hooks/detail/useShareRexRequest';
import RexRequestSummaryCard from '~/features/rex-requests/ui/detail/RexRequestSummaryCard';
import RexRequestResponseCard from '~/features/rex-requests/ui/detail/RexRequestResponseCard';
import RexRequestCommentsSection from '~/features/rex-requests/ui/detail/RexRequestCommentsSection';
import RexRequestDetailTabs, {
  type RexRequestDetailTab,
} from '~/features/rex-requests/ui/detail/RexRequestDetailTabs';
import MyRexPickerSheet from '~/features/rex-requests/ui/detail/MyRexPickerSheet';
import RexRequestDetailOverlays from '~/features/rex-requests/ui/detail/RexRequestDetailOverlays';

type Props = {
  visible: boolean;
  embedded?: boolean;
  request: RexRequestRow;
  onClose: () => void;
  onUserPress?: (userId: string) => void;
  onEditRequest?: (requestId: string) => void;
  onOpenRex?: (rexId: string) => void;
};

function RexRequestDetailModal({
  visible,
  embedded = false,
  request,
  onClose,
  onUserPress,
  onEditRequest,
  onOpenRex,
}: Props) {
  const { height: windowHeight } = useWindowDimensions();
  const { user: authUser } = useAuth();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<RexRequestDetailTab>('responses');

  const { sheetTranslateY, handleClose } = useOverlaySheetPresentation({
    visible,
    windowHeight,
    onClose,
  });

  const del = useDeleteRexRequest({ requestId: request.id, visible, onDeleted: handleClose });
  const resolve = useResolveRexRequest(request.id);
  const report = useRexRequestReportTarget(request.id, request.requester_id);
  const responses = useRexRequestResponses(request.id);
  const untagRex = useUntagRexFromRequest(request.id);
  const { shareRexRequest } = useShareRexRequest();
  const taggedRexIds = useMemo(
    () => new Set(responses.responses.map((r) => r.rex_id)),
    [responses.responses],
  );

  const isOwner = authUser != null && authUser.id === request.requester_id;
  const showReport = authUser != null && authUser.id !== request.requester_id;

  return (
    <OverlayModal
      embedded={embedded}
      visible={visible}
      onRequestClose={handleClose}
      contentTranslateY={sheetTranslateY}
    >
      <View className="flex-1 min-h-0 flex-col">
        <DetailHeader
          isOwner={isOwner}
          showReport={showReport}
          onBack={handleClose}
          onEdit={isOwner ? () => onEditRequest?.(request.id) : undefined}
          onDelete={del.openConfirm}
          onReport={report.openReport}
        />
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[webContainerStyle, { padding: 16, gap: 20 }]}
        >
          <RexRequestSummaryCard
            request={request}
            onSharePress={() =>
              void shareRexRequest({ id: request.id, lookingForText: request.looking_for_text })
            }
            onRequesterPress={onUserPress ? () => onUserPress(request.requester_id) : undefined}
            showResolve={isOwner && request.status === 'open'}
            resolving={resolve.pending}
            onResolvePress={() => resolve.resolve()}
          />

          <RexRequestDetailTabs
            active={activeTab}
            onChange={setActiveTab}
            responseCount={responses.responses.length}
            commentCount={request.comment_count}
          />

          {activeTab === 'responses' ? (
            <View className="gap-3">
              <TouchableOpacity
                onPress={() => setPickerOpen(true)}
                accessibilityRole="button"
                accessibilityLabel="Tag a Rex"
                className="flex-row items-center gap-1.5 self-end rounded-full bg-primary px-3 py-1.5"
              >
                <Tag size={13} color={Theme.colors.primaryForeground} />
                <Text className="text-xs font-semibold text-primary-foreground">Tag a Rex</Text>
              </TouchableOpacity>
              {responses.responses.length === 0 ? (
                <Text className="py-2 text-center text-sm text-muted-foreground">
                  No recommended Rex&apos;s yet.
                </Text>
              ) : (
                <View className="gap-2">
                  {responses.responses.map((r) => (
                    <RexRequestResponseCard
                      key={r.response_id}
                      response={r}
                      onPress={() => onOpenRex?.(r.rex_id)}
                      canUntag={authUser != null && authUser.id === r.responder_id}
                      untagging={untagRex.isPending(r.rex_id)}
                      onUntag={() => untagRex.untag(r.rex_id)}
                    />
                  ))}
                </View>
              )}
            </View>
          ) : (
            <RexRequestCommentsSection
              requestId={request.id}
              onUserPress={onUserPress}
              onReportComment={report.openCommentReport}
            />
          )}
        </ScrollView>

        <RexRequestDetailOverlays report={report} del={del} />
      </View>

      <MyRexPickerSheet
        open={pickerOpen}
        requestId={request.id}
        onClose={() => setPickerOpen(false)}
        excludeRexIds={taggedRexIds}
      />
    </OverlayModal>
  );
}

export default RexRequestDetailModal;

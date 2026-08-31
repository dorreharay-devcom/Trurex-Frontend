import React from 'react';
import { ScrollView, Text, useWindowDimensions } from 'react-native';
import BottomSheet from '~/shared/ui/overlay/BottomSheet';
import SheetHeader from '~/features/collections/ui/common/SheetHeader';
import SelectableSheetRow from '~/features/collections/ui/common/SelectableSheetRow';
import { RexCoverThumbnail } from '~/shared/ui/media/RexCoverThumbnail';
import { LoadMoreButton } from '~/shared/ui/primitives/LoadMoreButton';
import { withWebContainer } from '~/shared/lib/ui/styles';
import { useMyRexPicker } from '~/features/rex-requests/hooks/detail/useMyRexPicker';

const SHEET_MAX_HEIGHT = 500;
const SHEET_HEIGHT_RATIO = 0.55;

type Props = {
  open: boolean;
  requestId: string;
  onClose: () => void;
  excludeRexIds?: ReadonlySet<string>;
};

function MyRexPickerSheet({ open, requestId, onClose, excludeRexIds }: Props) {
  const { height } = useWindowDimensions();
  const { list, selectedRexId, toggle, submitting, submit } = useMyRexPicker({
    open,
    requestId,
    onClose,
    excludeRexIds,
  });

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      sheetStyle={{
        height: Math.min(SHEET_MAX_HEIGHT, height * SHEET_HEIGHT_RATIO),
        maxHeight: SHEET_MAX_HEIGHT,
      }}
    >
      <SheetHeader
        title="Tag a Rex"
        actionLabel={selectedRexId ? 'Tag' : 'Cancel'}
        busy={submitting}
        onAction={() => void submit()}
        className="pb-3"
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={withWebContainer({ padding: 12, gap: 2 })}
        style={{ flex: 1 }}
      >
        {!list.isLoading && list.data.length === 0 ? (
          <Text className="py-6 text-center text-sm text-muted-foreground">
            {excludeRexIds?.size
              ? "You've already tagged all your Rex's here"
              : "You haven't posted any Rex yet"}
          </Text>
        ) : (
          list.data.map((rec) => (
            <SelectableSheetRow
              key={rec.id}
              thumbnail={<RexCoverThumbnail rec={rec} className="h-10 w-10 rounded-lg" />}
              title={rec.title}
              subtitle={selectedRexId === rec.id ? 'Selected' : rec.category}
              selected={selectedRexId === rec.id}
              onPress={() => toggle(rec.id)}
            />
          ))
        )}
        <LoadMoreButton
          visible={list.hasNextPage}
          loading={list.isFetchingNextPage}
          onPress={list.fetchNextPage}
        />
      </ScrollView>
    </BottomSheet>
  );
}

export default MyRexPickerSheet;

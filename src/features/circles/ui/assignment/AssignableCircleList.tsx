import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import type { AssignmentSheetState } from '~/features/circles/hooks/assignment/useAssignmentSheet';
import AssignableCircleRow from '~/features/circles/ui/assignment/AssignableCircleRow';
import CreateAndAssignForm from '~/features/circles/ui/assignment/CreateAndAssignForm';
import CreateCircleTrigger from '~/features/circles/ui/assignment/CreateCircleTrigger';
import ScrollBottomFade from '~/features/circles/ui/assignment/ScrollBottomFade';
import { isWeb } from '~/utils';

const LIST_MAX_HEIGHT = isWeb ? 360 : 320;
const SCROLL_EVENT_THROTTLE_MS = 16;

type Props = { sheet: AssignmentSheetState };

const AssignableCircleList = ({ sheet }: Props) => {
  return (
    <View className="relative overflow-hidden">
      <ScrollView
        ref={sheet.autofocus.scrollRef}
        style={{ maxHeight: LIST_MAX_HEIGHT }}
        contentContainerStyle={{ paddingBottom: 12 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={SCROLL_EVENT_THROTTLE_MS}
        onLayout={sheet.scrollFade.onLayout}
        onScroll={sheet.scrollFade.onScroll}
        onContentSizeChange={sheet.scrollFade.onContentSizeChange}
      >
        <View className="gap-2">
          {sheet.assignableCircles.length === 0 && (
            <Text className="rounded-xl border border-border bg-background px-4 py-3 text-center text-sm text-foreground">
              This person is already in all of your circles.
            </Text>
          )}

          {sheet.assignableCircles.map((circle) => (
            <AssignableCircleRow
              key={circle.id}
              circle={circle}
              pending={sheet.pendingCircleId === circle.id}
              disabled={sheet.inFlight}
              onPress={() => sheet.assign(circle.id)}
            />
          ))}

          {sheet.showCreate ? (
            <CreateAndAssignForm sheet={sheet} />
          ) : (
            <CreateCircleTrigger disabled={sheet.inFlight} onPress={sheet.openCreateForm} />
          )}
        </View>
      </ScrollView>
      <ScrollBottomFade visible={sheet.scrollFade.showBottomFade} />
    </View>
  );
};

export default AssignableCircleList;

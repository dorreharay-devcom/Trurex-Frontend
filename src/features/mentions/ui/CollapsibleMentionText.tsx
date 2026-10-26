import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import MentionText from '~/features/mentions/ui/MentionText';

const COLLAPSED_LINES = 6;

type Props = Omit<React.ComponentProps<typeof MentionText>, 'numberOfLines' | 'onLayout'>;

function CollapsibleMentionText(props: Props) {
  const [expanded, setExpanded] = useState(false);
  const [fullHeight, setFullHeight] = useState(0);
  const [collapsedHeight, setCollapsedHeight] = useState(0);
  const overflows = fullHeight > collapsedHeight + 1;

  return (
    <View>
      <MentionText
        {...props}
        numberOfLines={expanded ? undefined : COLLAPSED_LINES}
        onLayout={expanded ? undefined : (e) => setCollapsedHeight(e.nativeEvent.layout.height)}
      />
      <View pointerEvents="none" aria-hidden className="absolute left-0 right-0 top-0 opacity-0">
        <MentionText {...props} onLayout={(e) => setFullHeight(e.nativeEvent.layout.height)} />
      </View>
      {overflows ? (
        <Pressable
          onPress={() => setExpanded((value) => !value)}
          accessibilityRole="button"
          hitSlop={8}
          className="mt-1 self-start active:opacity-70"
        >
          <Text className="text-xs font-medium text-muted-foreground">
            {expanded ? 'Show less' : 'Read more'}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export default CollapsibleMentionText;

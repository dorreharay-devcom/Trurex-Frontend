import React from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';
import { resolveUserByHandle } from '~/features/mentions/api/mentionsApi';
import { splitBodyByMentions, type MentionTextSegment } from '~/features/mentions/lib/mentionText';
import type { MentionRef } from '~/features/mentions/types/mention';

type Props = {
  body: string;
  mentions: MentionRef[] | undefined;
  onUserPress?: (userId: string) => void;
  className?: string;
  style?: StyleProp<TextStyle>;
};

function MentionSpan({
  segment,
  onUserPress,
}: {
  segment: Extract<MentionTextSegment, { kind: 'mention' }>;
  onUserPress?: (userId: string) => void;
}) {
  const { ref, text } = segment;

  const handlePress = () => {
    if (ref) {
      onUserPress?.(ref.userId);
      return;
    }
    resolveUserByHandle(text.replace(/^@/, ''))
      .then((candidate) => {
        if (candidate) onUserPress?.(candidate.userId);
      })
      .catch(() => {});
  };

  return (
    <Text className="font-semibold text-blue-600" onPress={handlePress} accessibilityRole="link">
      {text}
    </Text>
  );
}

function MentionText({ body, mentions, onUserPress, className, style }: Props) {
  const segments = splitBodyByMentions(body, mentions ?? []);

  return (
    <Text className={className} style={style}>
      {segments.map((segment, index) =>
        segment.kind === 'mention' ? (
          <MentionSpan
            key={`${segment.ref?.userId ?? segment.text}-${index}`}
            segment={segment}
            onUserPress={onUserPress}
          />
        ) : (
          <Text key={index}>{segment.text}</Text>
        ),
      )}
    </Text>
  );
}

export default MentionText;

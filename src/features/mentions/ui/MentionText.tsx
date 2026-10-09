import React from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';
import { splitBodyByMentions } from '~/features/mentions/lib/mentionText';
import type { MentionRef } from '~/features/mentions/types/mention';

type Props = {
  body: string;
  mentions: MentionRef[] | undefined;
  onUserPress?: (userId: string) => void;
  className?: string;
  style?: StyleProp<TextStyle>;
};

function MentionText({ body, mentions, onUserPress, className, style }: Props) {
  if (!mentions || mentions.length === 0) {
    return (
      <Text className={className} style={style}>
        {body}
      </Text>
    );
  }

  const segments = splitBodyByMentions(body, mentions);

  return (
    <Text className={className} style={style}>
      {segments.map((segment, index) =>
        segment.kind === 'mention' ? (
          <Text
            key={`${segment.ref.userId}-${index}`}
            className="font-semibold text-blue-600"
            onPress={() => onUserPress?.(segment.ref.userId)}
            accessibilityRole="link"
          >
            {segment.text}
          </Text>
        ) : (
          <Text key={index}>{segment.text}</Text>
        ),
      )}
    </Text>
  );
}

export default MentionText;

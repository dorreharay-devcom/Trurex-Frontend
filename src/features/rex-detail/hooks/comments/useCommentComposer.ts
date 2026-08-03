import { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, type TextInput } from 'react-native';
import { isWeb } from '~/shared/lib/ui/platform';
import { runCommentMutation } from './useCommentActions';

const AUTO_FOCUS_DELAY_MS = isWeb ? 780 : 600;

type Params = {
  rexId: string;
  addComment: (body: string, parentCommentId?: string | null) => Promise<void>;
  autoFocus: boolean;
};

export function useCommentComposer({ rexId, addComment, autoFocus }: Params) {
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const postingRef = useRef(false);
  const inputRef = useRef<TextInput | null>(null);

  useEffect(() => {
    if (!autoFocus) return;
    const t = setTimeout(() => inputRef.current?.focus(), AUTO_FOCUS_DELAY_MS);
    return () => clearTimeout(t);
  }, [autoFocus, rexId]);

  const post = useCallback(async () => {
    const body = text.trim();
    if (!body || postingRef.current) return;
    postingRef.current = true;
    setPosting(true);
    const posted = await runCommentMutation('Comment failed', () => addComment(body, replyTo));
    if (posted) {
      setText('');
      setReplyTo(null);
    }
    postingRef.current = false;
    setPosting(false);
  }, [addComment, replyTo, text]);

  const startReply = useCallback((commentId: string) => {
    setReplyTo(commentId);
    inputRef.current?.focus();
  }, []);

  const cancelReply = useCallback(() => {
    setText('');
    setReplyTo(null);
    if (isWeb) return;
    inputRef.current?.blur();
    Keyboard.dismiss();
  }, []);

  return { text, setText, replyTo, posting, inputRef, post, startReply, cancelReply };
}

export type CommentComposerState = ReturnType<typeof useCommentComposer>;

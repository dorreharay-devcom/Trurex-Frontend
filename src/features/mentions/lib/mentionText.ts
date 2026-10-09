import type { MentionRef } from '~/features/mentions/types/mention';

export type ActiveMentionQuery = { query: string; triggerIndex: number };

export function extractActiveMentionQuery(text: string): ActiveMentionQuery | null {
  const atIndex = text.lastIndexOf('@');
  if (atIndex === -1) return null;

  const precedingChar = atIndex === 0 ? null : text[atIndex - 1];
  if (precedingChar !== null && !/\s/.test(precedingChar)) return null;

  const query = text.slice(atIndex + 1);
  if (/\s/.test(query)) return null;

  return { query, triggerIndex: atIndex };
}

export function insertMentionIntoText(text: string, triggerIndex: number, handle: string): string {
  return `${text.slice(0, triggerIndex)}@${handle} `;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function mentionHandlePattern(handle: string): RegExp {
  return new RegExp(`(^|\\s)(@${escapeRegExp(handle)})(?=$|[\\s.,!?;:])`, 'gi');
}

function genericHandlePattern(): RegExp {
  return /(^|\s)(@[a-zA-Z0-9_]{1,30})(?=$|[\s.,!?;:])/g;
}

export function pruneStaleMentions(text: string, refs: readonly MentionRef[]): MentionRef[] {
  return refs.filter((ref) => {
    const pattern = mentionHandlePattern(ref.handle);
    return pattern.test(text);
  });
}

export function uniqueTaggedUserIds(refs: readonly MentionRef[]): string[] {
  return Array.from(new Set(refs.map((ref) => ref.userId)));
}

export type MentionTextSegment =
  | { kind: 'text'; text: string }
  | { kind: 'mention'; text: string; ref: MentionRef | null };

type MentionMatch = { start: number; end: number; ref: MentionRef | null };

function findMentionMatches(body: string, mentions: readonly MentionRef[]): MentionMatch[] {
  const byLengthDesc = [...mentions].sort((a, b) => b.handle.length - a.handle.length);
  const matches: MentionMatch[] = [];
  const claimed = new Array<boolean>(body.length).fill(false);

  for (const ref of byLengthDesc) {
    const pattern = mentionHandlePattern(ref.handle);
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(body)) !== null) {
      const start = match.index + match[1].length;
      const end = start + match[2].length;
      const overlapsClaimed = claimed.slice(start, end).some(Boolean);
      if (!overlapsClaimed) {
        matches.push({ start, end, ref });
        for (let i = start; i < end; i += 1) claimed[i] = true;
      }
    }
  }

  // Falls back to any remaining @handle-shaped text the backend didn't resolve
  // to a known mention, so it still renders as a link even without a userId.
  const genericPattern = genericHandlePattern();
  let genericMatch: RegExpExecArray | null;
  while ((genericMatch = genericPattern.exec(body)) !== null) {
    const start = genericMatch.index + genericMatch[1].length;
    const end = start + genericMatch[2].length;
    const overlapsClaimed = claimed.slice(start, end).some(Boolean);
    if (!overlapsClaimed) {
      matches.push({ start, end, ref: null });
      for (let i = start; i < end; i += 1) claimed[i] = true;
    }
  }

  return matches.sort((a, b) => a.start - b.start);
}

export function splitBodyByMentions(
  body: string,
  mentions: readonly MentionRef[],
): MentionTextSegment[] {
  const matches = findMentionMatches(body, mentions);
  if (matches.length === 0) return [{ kind: 'text', text: body }];

  const segments: MentionTextSegment[] = [];
  let cursor = 0;
  for (const match of matches) {
    if (match.start > cursor) {
      segments.push({ kind: 'text', text: body.slice(cursor, match.start) });
    }
    segments.push({ kind: 'mention', text: body.slice(match.start, match.end), ref: match.ref });
    cursor = match.end;
  }
  if (cursor < body.length) segments.push({ kind: 'text', text: body.slice(cursor) });

  return segments;
}

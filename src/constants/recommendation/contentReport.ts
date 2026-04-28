export const MAX_CONTENT_REPORT_DETAILS = 200;

export type ContentReportKind = 'recommendation' | 'comment';

export type ContentReportReasonCode =
  | 'fake_or_paid'
  | 'spam'
  | 'inappropriate'
  | 'conflict_of_interest'
  | 'harassment'
  | 'other';

export type ContentReportTarget =
  | { kind: 'recommendation'; rexId: string }
  | { kind: 'comment'; rexId: string; commentId: string };

export const REX_REPORT_REASONS: { value: ContentReportReasonCode; label: string }[] = [
  { value: 'fake_or_paid', label: 'Looks fake or paid for' },
  { value: 'spam', label: 'Spam or self-promotion' },
  { value: 'conflict_of_interest', label: 'Owner promoting their own business' },
  { value: 'inappropriate', label: 'Misleading or inaccurate information' },
  { value: 'harassment', label: 'Inappropriate or offensive content' },
  { value: 'other', label: 'Other' },
];

export const COMMENT_REPORT_REASONS: { value: ContentReportReasonCode; label: string }[] = [
  { value: 'inappropriate', label: 'Inappropriate or offensive' },
  { value: 'harassment', label: 'Harassment or personal attack' },
  { value: 'spam', label: 'Spam' },
  { value: 'other', label: 'Other' },
];

export function reasonOptionsForTarget(target: ContentReportTarget | null) {
  if (!target) return REX_REPORT_REASONS;
  return target.kind === 'recommendation' ? REX_REPORT_REASONS : COMMENT_REPORT_REASONS;
}

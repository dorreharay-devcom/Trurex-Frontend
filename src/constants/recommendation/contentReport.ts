export const MAX_CONTENT_REPORT_DETAILS = 200;

export type ContentReportKind = 'recommendation' | 'comment';

/** Must match `get_flag_reasons.code` for “Other”; requires free text as `input_details`. */
export const CONTENT_REPORT_OTHER_CODE = 'other' as const;

export type ContentReportTarget =
  | { kind: 'recommendation'; rexId: string }
  | { kind: 'comment'; rexId: string; commentId: string };

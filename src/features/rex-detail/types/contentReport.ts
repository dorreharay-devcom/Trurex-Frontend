export type ContentReportTarget =
  | { kind: 'recommendation'; rexId: string }
  | { kind: 'comment'; rexId: string; commentId: string }
  | { kind: 'rex_request'; rexRequestId: string }
  | { kind: 'rex_request_comment'; rexRequestId: string; commentId: string };

export type FlagReasonRow = {
  code: string;
  label: string;
  sort_order: number;
};

export type ContentReportTarget =
  | { kind: 'recommendation'; rexId: string }
  | { kind: 'comment'; rexId: string; commentId: string };

export type ExportKind =
  | "messages"
  | "expenses"
  | "schedule"
  | "change_requests";

export type ExportParams = {
  date_from?: string;
  date_to?: string;
  thread_ids?: string[];
  message_ids?: string[];
  message_hashes?: string[];
};

export type ExportMeta = {
  exportId: string;
  circleName: string;
  parties: string[];
  kind: ExportKind;
  dateFrom?: string;
  dateTo?: string;
  exportedAt: string;
  chainDigest: string;
  verifyUrl: string;
};

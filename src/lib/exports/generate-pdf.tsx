import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { ExportData } from "@/lib/exports/fetch-data";
import type { ExportKind, ExportMeta } from "@/lib/exports/types";
import { formatCents } from "@/lib/expenses";
import { BRAND } from "@/lib/brand";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica" },
  title: { fontSize: 18, marginBottom: 8, fontFamily: "Helvetica-Bold" },
  subtitle: { fontSize: 11, marginBottom: 4, color: "#444" },
  section: { marginTop: 16, marginBottom: 8 },
  sectionTitle: { fontSize: 12, fontFamily: "Helvetica-Bold", marginBottom: 6 },
  record: {
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  meta: { fontSize: 8, color: "#666", marginBottom: 2 },
  body: { fontSize: 10, lineHeight: 1.4 },
  digest: { fontSize: 8, fontFamily: "Courier", marginTop: 4 },
  disclaimer: { fontSize: 8, color: "#666", marginTop: 12, lineHeight: 1.4 },
});

const KIND_LABELS: Record<ExportKind, string> = {
  messages: "Message thread export",
  expenses: "Expense history export",
  schedule: "Schedule & check-in export",
  change_requests: "Change request export",
};

function CoverPage({ meta }: { meta: ExportMeta }) {
  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>{BRAND.name} | Tamper-evident record export</Text>
      <Text style={styles.subtitle}>{KIND_LABELS[meta.kind]}</Text>
      <View style={styles.section}>
        <Text style={styles.body}>Circle: {meta.circleName}</Text>
        <Text style={styles.body}>Parties: {meta.parties.join(", ")}</Text>
        {meta.dateFrom && (
          <Text style={styles.body}>Date range: {meta.dateFrom} to {meta.dateTo ?? "present"}</Text>
        )}
        <Text style={styles.body}>Export ID: {meta.exportId}</Text>
        <Text style={styles.body}>Generated: {meta.exportedAt}</Text>
      </View>
      <Text style={styles.disclaimer}>
        This document is a tamper-evident, timestamped record export suitable for review by legal
        professionals. It is not certified, notarized, or legal advice. Verify integrity at{" "}
        {meta.verifyUrl}
      </Text>
    </Page>
  );
}

function RecordsPage({ data }: { data: ExportData }) {
  return (
    <Page size="A4" style={styles.page} wrap>
      <Text style={styles.sectionTitle}>Records</Text>

      {data.kind === "messages" &&
        data.messages.map((m, i) => (
          <View key={m.id} style={styles.record} wrap={false}>
            <Text style={styles.meta}>
              #{i + 1} · {m.created_at} · {data.profiles[m.sender_id] ?? m.sender_id}
            </Text>
            <Text style={styles.body}>{m.body ?? "(attachment only)"}</Text>
            <Text style={styles.digest}>hash: {m.hash.slice(0, 16)}…</Text>
          </View>
        ))}

      {data.kind === "expenses" &&
        data.expenses.map((e) => (
          <View key={e.id} style={styles.record} wrap={false}>
            <Text style={styles.meta}>
              {e.created_at} · {data.profiles[e.created_by] ?? e.created_by}
            </Text>
            <Text style={styles.body}>
              {formatCents(e.amount_cents, e.currency)} · {e.category}
              {e.description ? ` · ${e.description}` : ""}
            </Text>
          </View>
        ))}

      {data.kind === "schedule" && (
        <>
          {data.events.map((e) => (
            <View key={e.id} style={styles.record} wrap={false}>
              <Text style={styles.meta}>{e.starts_at} · {e.type}</Text>
              <Text style={styles.body}>
                {e.title}
                {e.location ? ` @ ${e.location}` : ""}
              </Text>
            </View>
          ))}
          {data.checkins.map((c) => (
            <View key={c.id} style={styles.record} wrap={false}>
              <Text style={styles.meta}>
                Check-in {c.checked_at} · {data.profiles[c.user_id] ?? c.user_id}
              </Text>
              <Text style={styles.body}>
                GPS included: {c.location_verified ? "yes" : "no"}
              </Text>
            </View>
          ))}
        </>
      )}

      {data.kind === "change_requests" &&
        data.changeRequests.map((c) => (
          <View key={c.id} style={styles.record} wrap={false}>
            <Text style={styles.meta}>
              {c.created_at} · {c.type} · {c.status}
            </Text>
            <Text style={styles.body}>
              {JSON.stringify(c.details ?? {})}
            </Text>
          </View>
        ))}
    </Page>
  );
}

function DigestPage({ meta }: { meta: ExportMeta }) {
  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>Hash-chain verification digest</Text>
      <Text style={styles.body}>
        The digest below covers all records in this export. Any alteration to the underlying
        database records will cause verification to fail.
      </Text>
      <Text style={[styles.digest, { fontSize: 9, marginTop: 12 }]}>
        {meta.chainDigest}
      </Text>
      <View style={styles.section}>
        <Text style={styles.body}>Export ID: {meta.exportId}</Text>
        <Text style={styles.body}>Verify online: {meta.verifyUrl}</Text>
      </View>
      <Text style={styles.disclaimer}>
        Tamper-evident record export. Not certified or court-admitted. Original records remain
        in {BRAND.name} and can be independently verified at the URL above.
      </Text>
    </Page>
  );
}

export function ExportPdfDocument({
  meta,
  data,
}: {
  meta: ExportMeta;
  data: ExportData;
}) {
  return (
    <Document>
      <CoverPage meta={meta} />
      <RecordsPage data={data} />
      <DigestPage meta={meta} />
    </Document>
  );
}

import path from "path";
import fs from "fs";
import React from "react";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { ClientHandoutCopy } from "@/lib/pro/client-handout-copy";

const NAVY = "#111439";
const ACCENT = "#635BFF";
const MUTED = "#555566";
const CREAM = "#F8F8F9";

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    color: NAVY,
  },
  header: {
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5ea",
  },
  logo: { width: 120, height: 32, objectFit: "contain" as const },
  brandFallback: { fontSize: 16, fontFamily: "Helvetica-Bold", color: NAVY },
  title: { fontSize: 20, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  subtitle: { fontSize: 11, color: MUTED, marginBottom: 16 },
  section: { marginBottom: 12 },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
    color: ACCENT,
  },
  body: { fontSize: 10, lineHeight: 1.45, color: NAVY },
  linkBox: {
    marginTop: 6,
    marginBottom: 4,
    padding: 10,
    backgroundColor: CREAM,
    borderWidth: 1,
    borderColor: ACCENT,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  linkTextWrap: { flex: 1 },
  linkText: { fontSize: 8, fontFamily: "Courier", color: NAVY },
  qrImage: { width: 72, height: 72 },
  linkHint: { fontSize: 8, color: MUTED, marginTop: 4 },
  step: { flexDirection: "row", marginBottom: 4, paddingLeft: 2 },
  stepNum: { width: 16, fontSize: 9, fontFamily: "Helvetica-Bold", color: ACCENT },
  stepText: { flex: 1, fontSize: 9, lineHeight: 1.4 },
  bullet: { flexDirection: "row", marginBottom: 3, paddingLeft: 4 },
  bulletDot: { width: 10, fontSize: 10, color: ACCENT },
  bulletText: { flex: 1, fontSize: 9, lineHeight: 1.4 },
  footer: {
    position: "absolute",
    bottom: 36,
    left: 48,
    right: 48,
    borderTopWidth: 1,
    borderTopColor: "#e5e5ea",
    paddingTop: 8,
  },
  footerText: { fontSize: 8, color: MUTED, textAlign: "center" },
  disclaimer: { fontSize: 7, color: MUTED, textAlign: "center", marginTop: 4 },
});

function logoPath(): string | null {
  const candidate = path.join(process.cwd(), "public/brand/logo-dark-desktop.png");
  return fs.existsSync(candidate) ? candidate : null;
}

export function ClientHandoutDocument({
  copy,
  inviteUrl,
  qrDataUrl,
}: {
  copy: ClientHandoutCopy;
  inviteUrl: string;
  qrDataUrl: string;
}) {
  const logo = logoPath();

  return (
    <Document title={copy.title} author="Copara">
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          {logo ? (
            <Image src={logo} style={styles.logo} />
          ) : (
            <Text style={styles.brandFallback}>Copara</Text>
          )}
        </View>

        <Text style={styles.title}>{copy.title}</Text>
        <Text style={styles.subtitle}>{copy.subtitle}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{copy.whatTitle}</Text>
          <Text style={styles.body}>{copy.whatBody}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{copy.linkTitle}</Text>
          <View style={styles.linkBox}>
            <View style={styles.linkTextWrap}>
              <Text style={styles.linkText}>{inviteUrl}</Text>
            </View>
            <Image src={qrDataUrl} style={styles.qrImage} />
          </View>
          <Text style={styles.linkHint}>{copy.linkHint}</Text>
          <Text style={styles.linkHint}>{copy.qrScanHint}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{copy.stepsTitle}</Text>
          {copy.steps.map((step, index) => (
            <View key={step} style={styles.step}>
              <Text style={styles.stepNum}>{index + 1}.</Text>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{copy.subscriptionTitle}</Text>
          <Text style={styles.body}>{copy.subscriptionBody}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{copy.featuresTitle}</Text>
          {copy.features.map((feature) => (
            <View key={feature} style={styles.bullet}>
              <Text style={styles.bulletDot}>·</Text>
              <Text style={styles.bulletText}>{feature}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{copy.footer}</Text>
          <Text style={styles.disclaimer}>{copy.disclaimer}</Text>
        </View>
      </Page>
    </Document>
  );
}

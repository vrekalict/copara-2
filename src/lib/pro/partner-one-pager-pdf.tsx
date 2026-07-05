import path from "path";
import fs from "fs";
import React from "react";
import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { PartnerOnePagerCopy } from "@/lib/pro/partner-one-pager-copy";

const NAVY = "#111439";
const ACCENT = "#635BFF";
const MUTED = "#555566";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 9,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    color: NAVY,
  },
  header: {
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5ea",
  },
  logo: { width: 110, height: 28, objectFit: "contain" as const },
  brandFallback: { fontSize: 14, fontFamily: "Helvetica-Bold", color: NAVY },
  title: { fontSize: 18, fontFamily: "Helvetica-Bold", marginBottom: 3 },
  subtitle: { fontSize: 10, color: MUTED, marginBottom: 12 },
  section: { marginBottom: 9 },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginBottom: 3,
    color: ACCENT,
  },
  body: { fontSize: 9, lineHeight: 1.4, color: NAVY },
  subTitle: { fontSize: 9, fontFamily: "Helvetica-Bold", marginTop: 2, marginBottom: 2 },
  bullet: { flexDirection: "row", marginBottom: 2, paddingLeft: 2 },
  bulletDot: { width: 8, fontSize: 9, color: ACCENT },
  bulletText: { flex: 1, fontSize: 8.5, lineHeight: 1.35 },
  twoCol: { flexDirection: "row", gap: 16 },
  col: { flex: 1 },
  step: { flexDirection: "row", marginBottom: 2 },
  stepNum: { width: 14, fontSize: 8.5, fontFamily: "Helvetica-Bold", color: ACCENT },
  stepText: { flex: 1, fontSize: 8.5, lineHeight: 1.35 },
  footer: {
    position: "absolute",
    bottom: 32,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: "#e5e5ea",
    paddingTop: 6,
  },
  footerText: { fontSize: 7.5, color: MUTED, textAlign: "center" },
  disclaimer: { fontSize: 7, color: MUTED, textAlign: "center", marginTop: 3 },
});

function logoPath(): string | null {
  const candidate = path.join(process.cwd(), "public/brand/logo-dark-desktop.png");
  return fs.existsSync(candidate) ? candidate : null;
}

function Bullets({ items }: { items: string[] }) {
  return (
    <>
      {items.map((item) => (
        <View key={item} style={styles.bullet}>
          <Text style={styles.bulletDot}>·</Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </>
  );
}

export function PartnerOnePagerDocument({ copy }: { copy: PartnerOnePagerCopy }) {
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
          <Text style={styles.sectionTitle}>{copy.overviewTitle}</Text>
          <Text style={styles.body}>{copy.overviewBody}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{copy.benefitsTitle}</Text>
          <Bullets items={copy.benefits} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{copy.toolsTitle}</Text>
          <View style={styles.twoCol}>
            <View style={styles.col}>
              <Text style={styles.subTitle}>{copy.caseInviteTitle}</Text>
              <Bullets items={copy.caseInvitePoints} />
            </View>
            <View style={styles.col}>
              <Text style={styles.subTitle}>{copy.referralLinkTitle}</Text>
              <Bullets items={copy.referralLinkPoints} />
            </View>
          </View>
        </View>

        <View style={styles.twoCol}>
          <View style={[styles.section, styles.col]}>
            <Text style={styles.sectionTitle}>{copy.billingTitle}</Text>
            <Text style={styles.body}>{copy.billingBody}</Text>
          </View>
          <View style={[styles.section, styles.col]}>
            <Text style={styles.sectionTitle}>{copy.referralTitle}</Text>
            <Text style={styles.body}>{copy.referralBody}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{copy.gettingStartedTitle}</Text>
          {copy.gettingStartedSteps.map((step, index) => (
            <View key={step} style={styles.step}>
              <Text style={styles.stepNum}>{index + 1}.</Text>
              <Text style={styles.stepText}>{step}</Text>
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

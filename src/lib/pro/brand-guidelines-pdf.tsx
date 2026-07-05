import path from "path";
import fs from "fs";
import React from "react";
import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { BrandGuidelinesCopy } from "@/lib/pro/brand-guidelines-copy";

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
  logo: { width: 100, height: 26, objectFit: "contain" as const },
  brandFallback: { fontSize: 14, fontFamily: "Helvetica-Bold", color: NAVY },
  title: { fontSize: 18, fontFamily: "Helvetica-Bold", marginBottom: 3 },
  subtitle: { fontSize: 10, color: MUTED, marginBottom: 12 },
  section: { marginBottom: 10 },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
    color: ACCENT,
  },
  body: { fontSize: 9, lineHeight: 1.4, color: NAVY },
  logoRow: { flexDirection: "row", gap: 12, marginTop: 6 },
  logoCard: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e5e5ea",
    borderRadius: 4,
    alignItems: "center",
  },
  logoCardDark: { backgroundColor: "#F8F8F9" },
  logoCardLight: { backgroundColor: NAVY },
  logoCardLabel: { fontSize: 7.5, color: MUTED, marginBottom: 6, textAlign: "center" },
  logoCardLabelLight: { fontSize: 7.5, color: "#ccccdd", marginBottom: 6, textAlign: "center" },
  logoImage: { width: 90, height: 24, objectFit: "contain" as const },
  colorRow: { flexDirection: "row", alignItems: "center", marginBottom: 4, gap: 8 },
  swatch: { width: 28, height: 16, borderRadius: 2, borderWidth: 1, borderColor: "#e5e5ea" },
  colorName: { width: 48, fontSize: 8.5, fontFamily: "Helvetica-Bold" },
  colorHex: { width: 52, fontSize: 8, fontFamily: "Courier", color: MUTED },
  colorUsage: { flex: 1, fontSize: 8, lineHeight: 1.3 },
  twoCol: { flexDirection: "row", gap: 14 },
  col: { flex: 1 },
  bullet: { flexDirection: "row", marginBottom: 2, paddingLeft: 2 },
  bulletDot: { width: 8, fontSize: 9, color: ACCENT },
  bulletText: { flex: 1, fontSize: 8.5, lineHeight: 1.35 },
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
});

function brandAssetPath(filename: string): string | null {
  const candidate = path.join(process.cwd(), "public/brand", filename);
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

export function BrandGuidelinesDocument({ copy }: { copy: BrandGuidelinesCopy }) {
  const logoDark = brandAssetPath("logo-dark-desktop.png");
  const logoLight = brandAssetPath("logo-light-desktop.png");

  return (
    <Document title={copy.title} author="Copara">
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          {logoDark ? (
            <Image src={logoDark} style={styles.logo} />
          ) : (
            <Text style={styles.brandFallback}>Copara</Text>
          )}
        </View>

        <Text style={styles.title}>{copy.title}</Text>
        <Text style={styles.subtitle}>{copy.subtitle}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{copy.logoTitle}</Text>
          <Text style={styles.body}>{copy.logoBody}</Text>
          <View style={styles.logoRow}>
            <View style={[styles.logoCard, styles.logoCardDark]}>
              <Text style={styles.logoCardLabel}>{copy.logoDarkLabel}</Text>
              {logoDark ? (
                <Image src={logoDark} style={styles.logoImage} />
              ) : (
                <Text style={styles.brandFallback}>Copara</Text>
              )}
            </View>
            <View style={[styles.logoCard, styles.logoCardLight]}>
              <Text style={styles.logoCardLabelLight}>{copy.logoLightLabel}</Text>
              {logoLight ? (
                <Image src={logoLight} style={styles.logoImage} />
              ) : (
                <Text style={{ fontSize: 12, fontFamily: "Helvetica-Bold", color: "#ffffff" }}>
                  Copara
                </Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{copy.colorsTitle}</Text>
          {copy.colors.map((color) => (
            <View key={color.hex} style={styles.colorRow}>
              <View style={[styles.swatch, { backgroundColor: color.hex }]} />
              <Text style={styles.colorName}>{color.name}</Text>
              <Text style={styles.colorHex}>{color.hex}</Text>
              <Text style={styles.colorUsage}>{color.usage}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.twoCol}>
            <View style={styles.col}>
              <Text style={styles.sectionTitle}>{copy.usageDoTitle}</Text>
              <Bullets items={copy.usageDo} />
            </View>
            <View style={styles.col}>
              <Text style={styles.sectionTitle}>{copy.usageDontTitle}</Text>
              <Bullets items={copy.usageDont} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{copy.cobrandTitle}</Text>
          <Text style={styles.body}>{copy.cobrandBody}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{copy.assetsTitle}</Text>
          <Text style={styles.body}>{copy.assetsBody}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{copy.contactTitle}</Text>
          <Text style={styles.body}>{copy.contactBody}</Text>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{copy.footer}</Text>
        </View>
      </Page>
    </Document>
  );
}

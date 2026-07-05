import QRCode from "qrcode";

export async function referralQrDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    width: 180,
    margin: 1,
    color: { dark: "#111439", light: "#ffffff" },
  });
}

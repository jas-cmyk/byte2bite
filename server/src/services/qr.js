import QRCode from "qrcode";

export function toDataUrl(text) {
  return QRCode.toDataURL(text, { width: 256, margin: 1, errorCorrectionLevel: "M" });
}

export function toPng(text) {
  return QRCode.toBuffer(text, { width: 512, margin: 1, errorCorrectionLevel: "M" });
}
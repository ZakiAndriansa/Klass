import { FileText, Link2, NotebookPen, Presentation, Video } from "lucide-react";

import type { JenisMateri } from "./data-contoh";

export const labelJenisMateri: Record<JenisMateri, string> = {
  pdf: "PDF",
  video: "Video",
  tautan: "Tautan",
  slide: "Slide",
  catatan: "Catatan",
};

const ikonJenis = {
  pdf: FileText,
  video: Video,
  tautan: Link2,
  slide: Presentation,
  catatan: NotebookPen,
} as const;

export function IkonMateri({ jenis, size = 16 }: { jenis: JenisMateri; size?: number }) {
  const Ikon = ikonJenis[jenis];
  return <Ikon size={size} aria-hidden="true" />;
}

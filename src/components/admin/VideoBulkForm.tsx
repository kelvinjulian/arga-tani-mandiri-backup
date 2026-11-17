"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminPath } from "@/lib/admin-path";
import { CheckCircle2, ListPlus, Save } from "lucide-react";
import {
  MAX_BULK_URLS,
  parseVideoUrl,
  type TikTokPlayMode,
  type VideoPlatform,
} from "@/lib/videos/url-parser";
import { bulkInsertVideosAction } from "@/app/(admin)/admin/video/actions";

interface VideoBulkFormProps {
  existingKeys: string[];
}

interface PreviewRow {
  lineNumber: number;
  rawUrl: string;
  normalizedUrl: string;
  platform: VideoPlatform | null;
  videoId: string | null;
  playMode: TikTokPlayMode;
  title: string;
  status: "valid" | "duplicate" | "invalid";
  reason: string;
}

export function VideoBulkForm({ existingKeys }: VideoBulkFormProps) {
  const router = useRouter();
  const [rawText, setRawText] = useState("");
  const [previewRows, setPreviewRows] = useState<PreviewRow[] | null>(null);
  const [batchError, setBatchError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [resultSummary, setResultSummary] = useState<{
    insertedCount: number;
    skippedDuplicates: number;
    invalidCount: number;
  } | null>(null);

  const handleAnalyze = () => {
    setBatchError(null);
    setResultSummary(null);

    const normalizedInput = rawText.replace(
      /<iframe\b[\s\S]{0,2000}?<\/iframe>/gi,
      (match) => match.replace(/\r?\n+/g, " ")
    );

    const lines = normalizedInput
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      setBatchError("Masukkan minimal 1 URL video (satu URL per baris).");
      setPreviewRows(null);
      return;
    }

    if (lines.length > MAX_BULK_URLS) {
      setBatchError(
        `Maksimal ${MAX_BULK_URLS} URL per batch (saat ini ${lines.length} baris).`
      );
      setPreviewRows(null);
      return;
    }

    const seen = new Set(existingKeys);
    let ytCount = 0;
    let ttCount = 0;

    const analyzed: PreviewRow[] = lines.map((line, idx) => {
      const parsed = parseVideoUrl(line);
      if (!parsed.ok) {
        return {
          lineNumber: idx + 1,
          rawUrl: line,
          normalizedUrl: line,
          platform: null,
          videoId: null,
          playMode: "link",
          title: "",
          status: "invalid",
          reason: parsed.error,
        };
      }

      if (parsed.platform === "youtube") ytCount += 1;
      else ttCount += 1;

      const defaultTitle =
        parsed.platform === "youtube"
          ? `Video YouTube ${ytCount}`
          : `Video TikTok ${ttCount}`;

      if (parsed.videoId) {
        const key = `${parsed.platform}:${parsed.videoId}`;
        if (seen.has(key)) {
          return {
            lineNumber: idx + 1,
            rawUrl: line,
            normalizedUrl: parsed.normalizedUrl,
            platform: parsed.platform,
            videoId: parsed.videoId,
            playMode: parsed.suggestedMode,
            title: defaultTitle,
            status: "duplicate",
            reason: "Video ini sudah ada atau terduplikasi di daftar.",
          };
        }
        seen.add(key);
      }

      return {
        lineNumber: idx + 1,
        rawUrl: line,
        normalizedUrl: parsed.normalizedUrl,
        platform: parsed.platform,
        videoId: parsed.videoId,
        playMode: parsed.suggestedMode,
        title: defaultTitle,
        status: "valid",
        reason:
          parsed.platform === "tiktok"
            ? `Siap disimpan (${parsed.suggestedMode === "embed" ? "Embed" : "Buka di TikTok"})`
            : "Siap disimpan",
      };
    });

    setPreviewRows(analyzed);
  };

  const validRows = (previewRows ?? []).filter((r) => r.status === "valid");

  const handleConfirmInsert = async () => {
    if (validRows.length === 0) return;
    setIsSaving(true);
    setBatchError(null);

    const res = await bulkInsertVideosAction(
      validRows.map((r) => ({
        url: r.normalizedUrl,
        title: r.title,
        play_mode: r.playMode,
      }))
    );

    setIsSaving(false);

    if (!res.ok) {
      setBatchError(res.formError ?? "Gagal menyimpan batch video.");
      return;
    }

    setResultSummary({
      insertedCount: res.insertedCount,
      skippedDuplicates: res.skippedDuplicates,
      invalidCount:
        res.invalidCount +
        (previewRows ?? []).filter((r) => r.status === "invalid").length,
    });
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#0F1F17]">
          Tempel Banyak URL Video
        </h1>
        <p className="mt-1 text-sm text-[#33473D]">
          Tempel tautan video YouTube, atau kode embed dari YouTube (Bagikan
          &gt; Sematkan), serta tautan/embed TikTok, satu per baris (maksimal{" "}
          {MAX_BULK_URLS} item per batch).
        </p>
      </div>

      {batchError && (
        <div
          role="alert"
          className="rounded-2xl border border-[#E5B8B8] bg-[#FDF2F2] p-4 text-sm font-medium text-[#7F1D1D]"
        >
          {batchError}
        </div>
      )}

      {resultSummary && (
        <div
          role="status"
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#B4DEC6] bg-[#EAF3EE] p-4 text-sm text-[#143D29]"
        >
          <div className="flex items-center gap-2.5 font-semibold">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-[#15803D]" />
            <span>
              Berhasil menyimpan {resultSummary.insertedCount} video. Duplikat
              dilewati: {resultSummary.skippedDuplicates}. Tidak valid:{" "}
              {resultSummary.invalidCount}.
            </span>
          </div>
          <Link
            href={adminPath("/video")}
            className="inline-flex min-h-[38px] items-center rounded-xl bg-[#143D29] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#0E2B1D]"
          >
            Lihat Daftar Video
          </Link>
        </div>
      )}

      <div className="space-y-4 rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6">
        <label
          htmlFor="bulk-urls"
          className="block text-sm font-semibold text-[#143D29]"
        >
          Daftar URL (1 URL per baris, maks. {MAX_BULK_URLS})
        </label>
        <textarea
          id="bulk-urls"
          rows={8}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder={
            "https://www.youtube.com/watch?v=...\nhttps://www.tiktok.com/@akun/video/1234567890123456789"
          }
          className="w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2.5 font-mono text-xs sm:text-sm"
        />

        <div className="flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleAnalyze}
            className="inline-flex min-h-[42px] cursor-pointer items-center gap-2 rounded-xl border border-[#CBD8D0] bg-[#EAF3EE] px-4 py-2 text-xs font-bold text-[#143D29] hover:bg-[#D9F0E3]"
          >
            <ListPlus className="h-4 w-4" aria-hidden="true" />
            <span>Periksa URL &amp; Pratinjau</span>
          </button>
        </div>
      </div>

      {previewRows && (
        <div className="space-y-4 rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-base font-bold text-[#0F1F17]">
              Hasil Pemeriksaan ({validRows.length} siap disimpan)
            </h2>
            <button
              type="button"
              disabled={validRows.length === 0 || isSaving}
              onClick={handleConfirmInsert}
              className="inline-flex min-h-[42px] cursor-pointer items-center gap-2 rounded-xl bg-[#143D29] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0E2B1D] disabled:opacity-50"
            >
              <Save className="h-4 w-4" aria-hidden="true" />
              <span>
                {isSaving
                  ? "Menyimpan..."
                  : `Simpan ${validRows.length} Video Valid`}
              </span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-[#DCE8DF] text-[#43594D]">
                  <th className="py-2 pr-3 font-semibold">#</th>
                  <th className="py-2 pr-3 font-semibold">Status</th>
                  <th className="py-2 pr-3 font-semibold">Platform &amp; URL</th>
                  <th className="py-2 pr-3 font-semibold">Judul (dapat diubah)</th>
                  <th className="py-2 font-semibold">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF4F0]">
                {previewRows.map((row, idx) => (
                  <tr key={row.lineNumber}>
                    <td className="py-2.5 pr-3 font-mono text-[#43594D]">
                      {row.lineNumber}
                    </td>
                    <td className="py-2.5 pr-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 font-semibold ${
                          row.status === "valid"
                            ? "bg-[#D9F0E3] text-[#143D29]"
                            : row.status === "duplicate"
                              ? "bg-[#FEF3C7] text-[#92400E]"
                              : "bg-[#FEE2E2] text-[#991B1B]"
                        }`}
                      >
                        {row.status === "valid"
                          ? "Valid"
                          : row.status === "duplicate"
                            ? "Duplikat"
                            : "Tidak valid"}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3 max-w-[240px] truncate font-mono text-[#0F1F17]">
                      {row.platform ? `[${row.platform}] ` : ""}
                      {row.normalizedUrl}
                    </td>
                    <td className="py-2.5 pr-3">
                      {row.status === "valid" ? (
                        <input
                          type="text"
                          value={row.title}
                          maxLength={120}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPreviewRows((prev) =>
                              prev
                                ? prev.map((r, i) =>
                                    i === idx ? { ...r, title: val } : r
                                  )
                                : prev
                            );
                          }}
                          className="min-h-[36px] w-full rounded-lg border border-[#CBD8D0] px-2.5 py-1 text-xs"
                        />
                      ) : (
                        <span className="text-[#6B7280]">—</span>
                      )}
                    </td>
                    <td className="py-2.5 text-[#33473D]">{row.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

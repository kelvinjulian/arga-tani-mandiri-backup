"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";
import {
  deleteVideoAction,
  swapVideoOrderAction,
} from "@/app/(admin)/admin/video/actions";

interface VideoListActionsProps {
  id: string;
  title: string;
  isFirstGlobal: boolean;
  isLastGlobal: boolean;
}

export function VideoListActions({
  id,
  title,
  isFirstGlobal,
  isLastGlobal,
}: VideoListActionsProps) {
  const router = useRouter();
  const [isBusy, setIsBusy] = useState(false);

  const handleSwap = async (direction: "up" | "down") => {
    setIsBusy(true);
    const res = await swapVideoOrderAction(id, direction);
    setIsBusy(false);
    if (!res.ok) {
      window.alert(res.error ?? "Gagal mengubah urutan video.");
      return;
    }
    router.refresh();
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Hapus video "${title}"? Tindakan ini tidak dapat dibatalkan.`
    );
    if (!confirmed) return;

    setIsBusy(true);
    const res = await deleteVideoAction(id);
    setIsBusy(false);
    if (!res.ok) {
      window.alert(res.error ?? "Gagal menghapus video.");
      return;
    }
    router.refresh();
  };

  return (
    <div className="flex items-center justify-end gap-1.5">
      <button
        type="button"
        disabled={isBusy || isFirstGlobal}
        onClick={() => handleSwap("up")}
        aria-label={`Naikkan urutan ${title}`}
        className="inline-flex min-h-[34px] min-w-[34px] cursor-pointer items-center justify-center rounded-lg border border-[#CBD8D0] bg-white text-[#143D29] hover:bg-[#EAF3EE] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <button
        type="button"
        disabled={isBusy || isLastGlobal}
        onClick={() => handleSwap("down")}
        aria-label={`Turunkan urutan ${title}`}
        className="inline-flex min-h-[34px] min-w-[34px] cursor-pointer items-center justify-center rounded-lg border border-[#CBD8D0] bg-white text-[#143D29] hover:bg-[#EAF3EE] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <Link
        href={`/admin/video/${id}`}
        className="inline-flex min-h-[34px] items-center gap-1 rounded-lg border border-[#CBD8D0] bg-white px-2.5 py-1 text-xs font-semibold text-[#143D29] hover:bg-[#EAF3EE]"
      >
        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Ubah</span>
      </Link>
      <button
        type="button"
        disabled={isBusy}
        onClick={handleDelete}
        aria-label={`Hapus ${title}`}
        className="inline-flex min-h-[34px] cursor-pointer items-center gap-1 rounded-lg border border-[#E5B8B8] bg-white px-2.5 py-1 text-xs font-semibold text-[#991B1B] hover:bg-[#FDF2F2] disabled:opacity-50"
      >
        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Hapus</span>
      </button>
    </div>
  );
}

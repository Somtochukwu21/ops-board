"use client";

import { Button } from "@/components/ui/button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (action: "mark-sold" | "create-new") => void;
  productName?: string;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  productName,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="rounded-lg border border-border bg-card p-6 shadow-[0_10px_50px_rgba(0,0,0,0.1)] max-w-sm mx-4">
        <h2 className="mb-2 text-lg font-semibold">Product Already Exists</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          This product already exists as a returned or failed delivery. Do you
          want to mark it as sold or create a new entry?
        </p>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 bg-transparent"
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={() => onConfirm("mark-sold")}
            className="flex-1"
          >
            Mark as Sold
          </Button>
          <Button onClick={() => onConfirm("create-new")} className="flex-1">
            Create New
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CreateNewAddress from "./CreateNewAddress";

export default function AddressesModal() {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const t = useTranslations("ModelAddress");

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      router.back();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="z-[9999] lg:min-w-3xl max-h-[90vh] overflow-y-auto p-4">
        <DialogHeader className="flex text-[24px] flex-col items-center gap-1">
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-5 pb-5">
          <CreateNewAddress />
        </div>
      </DialogContent>
    </Dialog>
  );
}

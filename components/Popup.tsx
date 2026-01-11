"use client";

import React, { ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface PopupProps {
  isVisible?: boolean;
  status?: boolean;
  children: ReactNode;
  containerClass?: string;
  closeModal: (open: boolean) => void;
}

export default function Popup({
  children,
  closeModal,
  isVisible,
  containerClass,
  status,
}: PopupProps) {
  return (
    <Dialog open={isVisible || status} onOpenChange={closeModal}>
      <DialogContent
        className={`${containerClass || "lg:min-w-3xl md:min-w-5xl w-full"}`}
      >
        <DialogHeader className="hidden">
          <DialogTitle>Popup</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

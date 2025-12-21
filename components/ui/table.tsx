"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";

function Table({ className, ...props }: React.ComponentProps<"table">) {
  const locale = useLocale();
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto rounded-md"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <table
        data-slot="table"
        dir={locale === "ar" ? "rtl" : "ltr"}
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  const locale = useLocale();
  return (
    <thead
      data-slot="table-header"
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={cn("[&_tr]:border-b bg-neutral-100 rounded-md", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        " data-[state=selected]:bg-muted border-b transition-colors",
        className
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  const locale = useLocale();
  return (
    <th
      data-slot="table-head"
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={cn(
        "text-foreground h-10 px-2 text-start align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  const locale = useLocale();
  return (
    <td
      dir={locale === "ar" ? "rtl" : "ltr"}
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};

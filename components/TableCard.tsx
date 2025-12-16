"use client";

import type { PropsWithChildren, ReactElement } from "react";

export default function TableCard({
  children,
  className,
}: PropsWithChildren<{ className?: string }>): ReactElement {
  const baseClassName =
    "p-5 shadow-medium rounded-large overflow-visible static";

  return (
    <div
      className={className ? `${baseClassName} ${className}` : baseClassName}
    >
      {children}
    </div>
  );
}

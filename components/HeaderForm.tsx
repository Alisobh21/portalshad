"use client";

import { ComponentType, type ReactElement } from "react";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "@/i18n/navigation";

interface HeaderFormProps {
  Icon: ComponentType<{ size?: number; className?: string }>;
  title: string;
  desc?: string;
  link: string;
  linkDes: string;
}

export default function HeaderForm({
  Icon,
  title,
  desc,
  link,
  linkDes,
}: HeaderFormProps): ReactElement {
  return (
    <header className="mb-8">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex h-[40px] w-[40px] items-center justify-center rounded-lg bg-[#f6e1d5] text-[#a3480f]">
          <Icon size={18} />
        </div>

        {/* Content */}
        <div className="me-2">
          <h1 className="mb-0 text-2xl font-bold">{title}</h1>

          {desc && <p className="mb-2 text-sm text-muted-foreground">{desc}</p>}

          <Button asChild variant="normal" size="default">
            <Link href={link} className="flex items-center gap-2">
              <IoIosArrowBack size={17} className="rtl:rotate-180" />
              {linkDes}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

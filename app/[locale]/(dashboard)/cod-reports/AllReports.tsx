"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ReactElement } from "react";
import ReportTable from "./ReportTable";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const NProgress = require("nprogress") as {
  start: (options?: { disableSpinner?: boolean }) => void;
  done: () => void;
  configure: (options: unknown) => void;
};

const AllReports = (): ReactElement => {
  const t = useTranslations("Reports");

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <Button
          asChild
          variant="modal"
          onClick={() => NProgress.start({ disableSpinner: true })}
        >
          <Link href="/cod-reports/create">{t("createReport")}</Link>
        </Button>
      </div>
      <ReportTable />
    </div>
  );
};

export default AllReports;

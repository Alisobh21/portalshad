"use client";

import React from "react";
import ExcelJS from "exceljs";
import { RiFileExcel2Line } from "react-icons/ri";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { flattenData } from "../helpers/utils";

interface Column {
  name: string;
  identifier: string;
}

interface RegularTablesExportProps {
  data: unknown[];
  columns: Column[];
  filename: string;
}

const RegularTablesExport: React.FC<RegularTablesExportProps> = ({
  data,
  columns,
  filename,
}) => {
  const t = useTranslations("General");

  const exportToExcel = async (): Promise<void> => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    /* ---------------- Title Row ---------------- */
    const titleRow = worksheet.addRow(["Storage Station"]);
    titleRow.getCell(1).font = { bold: true, size: 14 };
    titleRow.getCell(1).alignment = { horizontal: "center" };

    worksheet.mergeCells(1, 1, 1, columns.length);

    /* ---------------- Header Row ---------------- */
    const headers = columns.map((col) => col.name);
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true };

    /* ---------------- Data Rows ---------------- */
    const flattenedData = flattenData(data) as Record<string, any>[];
    const identifiers = columns.map((col) => col.identifier);

    flattenedData.forEach((item) => {
      const row = identifiers.map((key) => item[key]);
      worksheet.addRow(row);
    });

    /* ---------------- Column Widths ---------------- */
    columns.forEach((column, index) => {
      const maxLength = Math.max(
        column.name.length,
        ...flattenedData.map(
          (item) => String(item[column.identifier] ?? "").length
        )
      );

      worksheet.getColumn(index + 1).width = maxLength + 2;
    });

    /* ---------------- Download ---------------- */
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Storage Station - ${filename}.xlsx`;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <Button
      variant="outline"
      onClick={exportToExcel}
      className="flex items-center gap-2"
    >
      <RiFileExcel2Line size={18} />
      {t("excel")}
    </Button>
  );
};

export default RegularTablesExport;

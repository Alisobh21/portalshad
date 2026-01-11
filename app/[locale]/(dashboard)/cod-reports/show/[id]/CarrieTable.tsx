"use client";

import { useState, type ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { MdDriveFolderUpload } from "react-icons/md";
import { FaCheckCircle, FaInfoCircle, FaTimesCircle } from "react-icons/fa";
import { IoReloadCircleSharp } from "react-icons/io5";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import axiosPrivate from "@/axios/axios";
import type { RootState } from "@/store/store";
import type { CarrierData } from "@/store/slices/reportSlice";

interface CarrierFile {
  validating_status?: string;
  validating_error?: string;
  is_processed?: boolean;
  file_name?: string;
  total_records_count?: number;
  cod_records_count?: number;
  processed_records_count?: number;
  label?: string;
  logo?: string;
  url?: string;
}

interface FileInput {
  file: File;
  fileName: string;
}

interface CarrierTableProps {
  params: { id: string };
  fetchReport: (refresh?: boolean) => Promise<void>;
  partialLoading: boolean;
}

const CarrierTable = ({
  params,
  fetchReport,
  partialLoading,
}: CarrierTableProps) => {
  const t = useTranslations("Reports");

  const OneReport = useSelector((state: RootState) => {
    const report = state.reports.OneReport;
    // Handle both array and object cases
    return Array.isArray(report) ? report[0] : report;
  });
  const [progress, setProgress] = useState<number>(0);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [fileInputs, setFileInputs] = useState<Record<string, FileInput>>({});
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const neededCarriers = OneReport?.neededCarriers || {};

  const carriersFiles: Record<string, CarrierFile> = Object.fromEntries(
    Object.entries(neededCarriers).map(
      ([key, carrier]: [string, CarrierData]) => [
        key,
        {
          ...carrier.upload_data,
          label: carrier.label,
          logo: carrier.logo,
          url: carrier.url,
        },
      ]
    )
  );

  const handleFileChange = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileInputs((prev) => ({
        ...prev,
        [key]: {
          file,
          fileName: file.name,
        },
      }));
    }
  };

  const handleFileUpload = async (key: string) => {
    const selectedFile = fileInputs[key]?.file;

    if (!selectedFile) {
      toast.error(t("nofile") || "No file selected");
      return;
    }

    setUploadingKey(key);
    setProgress(0);

    try {
      const chunkSize = 2 * 1024 * 1024; // 2MB
      const totalChunks = Math.ceil(selectedFile.size / chunkSize);
      const uploadId = `${Date.now()}_${selectedFile.name}`;
      let uploadedFilePath = "";

      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, selectedFile.size);
        const chunk = selectedFile.slice(start, end, selectedFile.type);
        const formData = new FormData();
        formData.append("chunk", chunk);
        formData.append("chunk_index", i.toString());
        formData.append("total_chunks", totalChunks.toString());
        formData.append("filename", selectedFile.name);
        formData.append("upload_id", uploadId);

        const response = await axiosPrivate.post(
          `/cod-reports/upload-sheet/${params.id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (i === totalChunks - 1 && response?.data?.data?.file) {
          uploadedFilePath = response.data.data.file;
        }

        setProgress(Math.round(((i + 1) / totalChunks) * 100));
      }

      const payload = {
        carrier: key,
        carrier_uploaded_file: uploadedFilePath,
      };

      const response = await axiosPrivate.post(
        `/cod-reports/process-carrier-sheet/${params.id}`,
        payload
      );

      if (response?.data?.success) {
        toast.success(t("reportSuccess") || "Report processed successfully");
        fetchReport();
      } else {
        toast.error(t("processingFailed") || "Processing failed");
      }
    } catch {
      toast.error(t("uploadFailed") || "Upload failed");
    } finally {
      setUploadingKey(null);
      setProgress(0);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchReport(true);
    setRefreshing(false);
  };

  return (
    <div className="relative">
      <div className="absolute top-[-15px] end-[5px] z-10">
        <IoReloadCircleSharp
          onClick={handleRefresh}
          size={28}
          className={`transition-transform cursor-pointer text-[#ea7831] focus:outline-none focus:ring-0 p-0 data-[hover=true]:bg-transparent ${
            refreshing ? "animate-spin" : ""
          }`}
        />
      </div>

      <div className="overflow-auto p-5">
        <Table className="text-sm text-center p-5 lg:p-7 z-0 min-w-[600px]">
          <TableHeader>
            <TableHead className="text-center">{t("carrier")}</TableHead>
            <TableHead className="text-center">{t("validation")}</TableHead>
            <TableHead className="text-center">{t("processed")}</TableHead>
            <TableHead className="text-center">{t("file")}</TableHead>
          </TableHeader>

          <TableBody>
            {partialLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <Spinner className="mx-auto" />
                </TableCell>
              </TableRow>
            ) : (
              Object.entries(carriersFiles)
                .sort(([, a], [, b]) => {
                  if (
                    a.validating_status === "Valid" &&
                    b.validating_status !== "Valid"
                  )
                    return -1;
                  if (
                    a.validating_status !== "Valid" &&
                    b.validating_status === "Valid"
                  )
                    return 1;
                  return 0;
                })
                .map(([key, file]) => {
                  const validationStatus =
                    file?.validating_status || "Not Uploaded";
                  const hasError =
                    ["Not Valid", "FailedOnQueue"].includes(validationStatus) ||
                    file?.validating_error;
                  const notUploaded =
                    ["Not Uploaded"].includes(validationStatus) &&
                    !file?.validating_error;

                  const isUploading = uploadingKey === key;
                  const showStats = file?.validating_status === "Valid";

                  return (
                    <>
                      <TableRow key={key}>
                        <TableCell>
                          <div className="flex flex-col items-center justify-center gap-1">
                            {file?.url && (
                              <Image
                                src={file.url}
                                alt={file?.label || key}
                                width={60}
                                height={20}
                                className="object-contain"
                              />
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="max-w-[200px] mx-auto">
                            <Badge
                              variant={
                                hasError
                                  ? "destructive"
                                  : notUploaded
                                  ? "outline"
                                  : "default"
                              }
                              className="px-3 py-2 max-w-full text-wrap h-auto"
                            >
                              {file?.validating_error || validationStatus}
                            </Badge>
                          </div>
                        </TableCell>

                        <TableCell>
                          {file?.is_processed ? (
                            <FaCheckCircle
                              className="text-green-500 mx-auto"
                              size={18}
                            />
                          ) : notUploaded ? (
                            <FaInfoCircle
                              className="text-muted-foreground mx-auto"
                              size={18}
                            />
                          ) : (
                            <FaTimesCircle
                              className="text-destructive mx-auto"
                              size={18}
                            />
                          )}
                        </TableCell>

                        <TableCell>
                          {hasError || notUploaded ? (
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <Input
                                  type="file"
                                  onChange={(e) => handleFileChange(key, e)}
                                  className="relative before:content-[''] before:absolute before:block before:w-[95px] before:rounded-lg before:h-[calc(100%-6px)] before:top-[3px] before:bottom-[3px] before:start-[3px] ps-[6px] before:bg-content3 before:z-[-1] file:me-6 file:pe-4"
                                />
                                {fileInputs[key]?.file && (
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => handleFileUpload(key)}
                                    disabled={isUploading}
                                    className="bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
                                  >
                                    <MdDriveFolderUpload size={18} />
                                  </Button>
                                )}
                              </div>
                              {isUploading && (
                                <div className="mt-2">
                                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                                    <div
                                      className="bg-primary h-2 rounded-full transition-all"
                                      style={{
                                        width: `${progress}%`,
                                      }}
                                      aria-label="Uploading..."
                                    />
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-2 text-center">
                                    {progress}%
                                  </p>
                                </div>
                              )}
                            </div>
                          ) : file?.file_name ? (
                            <div
                              style={{
                                backgroundColor: "rgba(40, 167, 69, 0.1)",
                                color: "#28a745",
                                padding: "6px 10px",
                                borderRadius: "0.4rem",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                fontSize: "0.85rem",
                              }}
                              className="mx-auto"
                            >
                              <FaCheckCircle size={14} />
                              <span>{file.file_name}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              {t("nofile")}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                      {showStats && (
                        <TableRow
                          key={`${key}-stats`}
                          className="border-b border-content3"
                        >
                          <TableCell colSpan={4} className="p-2!">
                            <div className="text-xs text-center py-1">
                              <span className="mx-2">
                                <b>{t("total")}:</b>{" "}
                                {file?.total_records_count || 0}
                              </span>
                              <span className="mx-2">
                                <b>{t("codRecs")}:</b>{" "}
                                {file?.cod_records_count || 0}
                              </span>
                              <span className="mx-2">
                                <b>{t("processed")}:</b>{" "}
                                {file?.processed_records_count || 0}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CarrierTable;

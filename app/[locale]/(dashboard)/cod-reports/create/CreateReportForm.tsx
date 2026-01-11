"use client";

import HeaderForm from "@/components/HeaderForm";
import InvalidFeedback from "@/components/InvalidFeedback";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ErrorToast, SuccessToast } from "@/components/Toasts";
import axiosPrivate from "@/axios/axios";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { TbReportSearch } from "react-icons/tb";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { BsFileEarmarkExcelFill } from "react-icons/bs";
import type { ReactElement, ChangeEvent } from "react";

interface FormData {
  rpt_month: string;
  rpt_year: string;
}

const CreateReportForm = (): ReactElement => {
  const t = useTranslations("Reports");
  const router = useRouter();
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const [file, setFile] = useState<File | null>(null);
  const [month, setMonth] = useState("January");
  const [year, setYear] = useState("2025");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState(t("nofile"));
  const [loading, setLoading] = useState(false);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = ["2024", "2025", "2026", "2027", "2028", "2029", "2030"];

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    } else {
      setFile(null);
      setFileName(t("nofile"));
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setProgress(0);

    try {
      if (!file) {
        toast.error(<ErrorToast msg={t("nofile")} />);
        setLoading(false);
        return;
      }

      const chunkSize = 2 * 1024 * 1024; // 2MB
      const totalChunks = Math.ceil(file.size / chunkSize);
      const cleanFileName = file.name.replace(/[\[\]]/g, "");
      const uploadId = `${Date.now()}_${cleanFileName}`;

      let uploadedFilePath = "";

      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end, file.type);
        const formData = new FormData();
        formData.append("chunk", chunk);
        formData.append("chunk_index", i.toString());
        formData.append("total_chunks", totalChunks.toString());
        formData.append("filename", file.name);
        formData.append("upload_id", uploadId);

        try {
          const response = await axiosPrivate.post(
            "/cod-reports/upload-chunk",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (i === totalChunks - 1 && response?.data?.data?.file) {
            uploadedFilePath = response.data.data.file;
          }
          setProgress(Math.round(((i + 1) / totalChunks) * 100));
        } catch (err) {
          toast.error(
            <ErrorToast msg={`${t("chunckfail")}, ${i}, ${String(err)}`} />
          );
          setLoading(false);
          return;
        }
      }

      try {
        const payload = {
          rpt_month: data.rpt_month,
          rpt_year: data.rpt_year,
          shiphero_file_path: uploadedFilePath,
        };
        const response = await axiosPrivate.post(
          "/cod-reports/process-new-m-req",
          payload
        );
        if (response?.data?.success) {
          toast.success(<SuccessToast msg={t("reportSuccess")} />);
          router.push("/cod-reports");
        }
      } catch (err) {
        console.error("Failed to send month and year", err);
        toast.error(
          <ErrorToast msg={t("reportError") || "Error processing report"} />
        );
      }
    } catch (e) {
      console.error("Error uploading report", e);
      toast.error(
        <ErrorToast msg={t("uploadError") || "Error uploading report"} />
      );
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="w-full">
      <div className="p-5 lg:p-7">
        <HeaderForm
          Icon={TbReportSearch}
          title={t("createReport")}
          desc={t("headerTitle")}
          link="/cod-reports"
          linkDes={t("createBack")}
        />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 xl:grid-cols-2 gap-4"
        >
          <div className="xl:col-span-2">
            <Label className="block mb-3">{t("shipheroReport")}</Label>
            <div className="flex items-center">
              <input
                id="file"
                aria-label="File"
                type="file"
                className="hidden"
                accept=".csv,.xlsx,.xls,.ods"
                onChange={handleFileChange}
              />

              <label
                htmlFor="file"
                className="cursor-pointer w-full border-2 p-10 flex items-center justify-center border-dashed border-content3 rounded-xl"
              >
                <div className="flex flex-col justify-center items-center gap-2">
                  {fileName && fileName !== "No file selected" ? (
                    <div className="text-18">{fileName}</div>
                  ) : (
                    <>
                      <BsFileEarmarkExcelFill
                        size={24}
                        className="text-muted-foreground"
                      />
                      <span className="text-muted-foreground text-center">
                        {t("chooseFile")}
                      </span>
                    </>
                  )}
                </div>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>{t("selectMonth")}</Label>
            <Select
              value={watch("rpt_month") || month}
              onValueChange={(value) => {
                setValue("rpt_month", value, { shouldValidate: true });
                setMonth(value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("selectMonth")} />
              </SelectTrigger>
              <SelectContent>
                {months.map((monthOption) => (
                  <SelectItem key={monthOption} value={monthOption}>
                    {monthOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.rpt_month && (
              <InvalidFeedback error={errors.rpt_month.message || ""} />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label>{t("selectYear")}</Label>
            <Select
              value={watch("rpt_year") || year}
              onValueChange={(value) => {
                setValue("rpt_year", value, { shouldValidate: true });
                setYear(value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("selectYear")} />
              </SelectTrigger>
              <SelectContent>
                {years.map((yearOption) => (
                  <SelectItem key={yearOption} value={yearOption}>
                    {yearOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.rpt_year && (
              <InvalidFeedback error={errors.rpt_year.message || ""} />
            )}
          </div>

          <div className="xl:col-span-2">
            <Button
              type="submit"
              variant="closeModal"
              size="md"
              className="w-full"
              disabled={loading}
            >
              {loading ? t("uploading") || "Uploading..." : t("upload")}
            </Button>
          </div>

          {loading && (
            <div className="mt-4 xl:col-span-2">
              <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{
                    width: `${progress}%`,
                  }}
                  aria-label="Loading..."
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                {progress}%
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateReportForm;

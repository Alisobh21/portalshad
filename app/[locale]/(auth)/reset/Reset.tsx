"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { MdOutlineEmail } from "react-icons/md";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import axiosPrivate from "@/axios/axios";
import InvalidFeedback from "@/components/InvalidFeedback";
import { toast } from "sonner";

/* ================= Types ================= */

const ResetSchema = z.object({
  email: z
    .string()
    .email({ message: "invalidEmail" })
    .nonempty({ message: "emailRequired" }),
});

type ResetFormData = z.infer<typeof ResetSchema>;

/* ================= Component ================= */

export default function Reset() {
  const t = useTranslations("Login");
  const tGeneral = useTranslations("General");
  const locale = useLocale();

  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState<boolean>(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(ResetSchema),
  });

  const submitLogin: SubmitHandler<ResetFormData> = async (data) => {
    setLoginLoading(true);
    try {
      const response = await axiosPrivate.post("/password/reset", {
        email: data.email,
      });
      if (response?.data?.success) {
        setEmailSent(true);
        toast.success(tGeneral("resetMsg"));
      }
    } catch (error) {
      console.error(error);
      toast.error(tGeneral("error") || "An error occurred");
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <section className="lg:py-5 w-full lg:p-5">
      <div className="max-w-[550px] mx-auto">
        <div className="w-full mb-[25px] space-y-3">
          {locale === "en" ? (
            <h1 className="font-normal lg:text-[50px]">{t("welcome")}</h1>
          ) : (
            <h1 className="font-normal lg:text-[50px] leading-[1.2]">
              {t("welcome")}
            </h1>
          )}
          <p className="text-muted-foreground text-[15px] opacity-80">
            {t("secureAccess")}
          </p>
        </div>

        <div className="pt-5 pb-3">
          <h4 className="text-xl">{t("resetPassword")}</h4>
        </div>

        {emailSent ? (
          <>
            <Alert className="text-center bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400">
              <AlertDescription className="flex items-center justify-center gap-2">
                <span>✅</span>
                {tGeneral("resetMsg")}
              </AlertDescription>
            </Alert>
            <div className="text-center flex gap-4 mt-4">
              <Link
                href="/login"
                className="text-sm text-[#ea7831] hover:underline text-center"
              >
                {t("login")}
              </Link>

              <Link
                href="/register"
                className="text-sm hover:underline text-center"
              >
                {t("register")}
              </Link>
            </div>
          </>
        ) : (
          <form
            className="flex flex-col gap-3 pb-3 mt-3"
            noValidate
            onSubmit={handleSubmit(submitLogin)}
          >
            <div className="flex flex-col space-y-2">
              <div className="relative" dir={locale === "ar" ? "rtl" : "ltr"}>
                <MdOutlineEmail
                  className={`absolute top-1/2 -translate-y-1/2 text-gray-500 ${
                    locale === "ar" ? "right-3" : "left-3"
                  } dark:text-white`}
                />

                <Input
                  {...register("email")}
                  dir={locale === "ar" ? "rtl" : "ltr"}
                  type="email"
                  className={`${
                    locale === "ar" ? "pr-10" : "pl-10"
                  } py-6 h-14 bg-neutral-50 dark:bg-neutral-600/50`}
                  placeholder={t("emailAddress")}
                />
              </div>
              {errors?.email && (
                <InvalidFeedback error={t(errors.email.message || "")} />
              )}
            </div>

            <div className="flex flex-col gap-2 justify-end">
              <Button
                disabled={loginLoading}
                type="submit"
                variant="primary"
                className="w-full btn-primary text-white py-5.5"
              >
                {loginLoading
                  ? tGeneral("loading") || "Loading..."
                  : t("resetPassword")}
              </Button>
              <div className="flex gap-4">
                <Link
                  href="/login"
                  className="text-sm text-[#ea7831] hover:underline text-center"
                >
                  {t("login")}
                </Link>

                <Link
                  href="/register"
                  className="text-sm hover:underline text-center"
                >
                  {t("register")}
                </Link>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

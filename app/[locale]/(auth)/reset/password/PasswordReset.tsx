"use client";

import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { AiOutlineLock } from "react-icons/ai";
import { PiEyeBold, PiEyeClosedBold } from "react-icons/pi";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import axiosPrivate from "@/axios/axios";
import InvalidFeedback from "@/components/InvalidFeedback";
import { toast } from "sonner";

/* ================= Types ================= */

const PasswordResetSchema = z
  .object({
    password: z
      .string()
      .nonempty({ message: "passwordRequired" })
      .min(6, { message: "passwordTooShort" }),
    password_confirmation: z
      .string()
      .nonempty({ message: "passwordConfirmationRequired" }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "passwordsDoNotMatch",
    path: ["password_confirmation"],
  });

type PasswordResetFormData = z.infer<typeof PasswordResetSchema>;

/* ================= Component ================= */

export default function PasswordReset() {
  const t = useTranslations("Login");
  const tGeneral = useTranslations("General");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [passVisible, setPassVisible] = useState<boolean>(false);
  const [confirmVisible, setConfirmVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<PasswordResetFormData>({
    resolver: zodResolver(PasswordResetSchema),
  });

  useEffect(() => {
    if (!token || !email) {
      router.replace("/login");
    }
  }, [token, email, router]);

  const submitReset: SubmitHandler<PasswordResetFormData> = async (data) => {
    setLoading(true);
    try {
      const response = await axiosPrivate.post("/password/reset/confirm", {
        email,
        token,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });

      if (response?.data?.success) {
        toast.success(t("resetMsg") || tGeneral("resetMsg"));
        setTimeout(() => {
          router.push("/login");
        }, 2500);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="lg:py-5 w-full lg:p-5">
      <div className="max-w-[500px] md:min-w-[500px] mx-auto">
        <div className="w-full mb-[25px] space-y-3">
          <h1 className="font-bold lg:text-[50px]">{t("resetPassword")}</h1>
          <p className="text-muted-foreground text-[15px] opacity-80">
            {t("setNewPassword")}
          </p>
        </div>

        <form
          className="flex flex-col gap-4 pb-3 mt-3"
          noValidate
          onSubmit={handleSubmit(submitReset)}
        >
          {/* PASSWORD */}
          <div className="flex flex-col space-y-2">
            <div className="relative" dir={locale === "ar" ? "rtl" : "ltr"}>
              <AiOutlineLock
                className={`absolute top-1/2 -translate-y-1/2 text-gray-500 ${
                  locale === "ar" ? "right-3" : "left-3"
                } dark:text-white`}
              />

              <Input
                {...register("password")}
                dir={locale === "ar" ? "rtl" : "ltr"}
                type={passVisible ? "text" : "password"}
                className={`${
                  locale === "ar" ? "pr-10 pl-3" : "pl-10 pr-3"
                } py-6 h-14 bg-neutral-50 dark:bg-neutral-600/50`}
                placeholder={t("enterPassword")}
              />

              <button
                type="button"
                onClick={() => setPassVisible(!passVisible)}
                className={`absolute top-1/2 -translate-y-1/2 text-xl text-gray-500 ${
                  locale === "ar" ? "left-3" : "right-3"
                } dark:text-white`}
                aria-label="toggle password visibility"
              >
                {passVisible ? <PiEyeBold /> : <PiEyeClosedBold />}
              </button>
            </div>
            {errors?.password && (
              <InvalidFeedback error={t(errors.password.message || "")} />
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="flex flex-col space-y-2">
            <div className="relative" dir={locale === "ar" ? "rtl" : "ltr"}>
              <AiOutlineLock
                className={`absolute top-1/2 -translate-y-1/2 text-gray-500 ${
                  locale === "ar" ? "right-3" : "left-3"
                } dark:text-white`}
              />

              <Input
                {...register("password_confirmation")}
                dir={locale === "ar" ? "rtl" : "ltr"}
                type={confirmVisible ? "text" : "password"}
                className={`${
                  locale === "ar" ? "pr-10 pl-3" : "pl-10 pr-3"
                } py-6 h-14 bg-neutral-50 dark:bg-neutral-600/50`}
                placeholder={t("enterPasswordAgain")}
              />

              <button
                type="button"
                onClick={() => setConfirmVisible(!confirmVisible)}
                className={`absolute top-1/2 -translate-y-1/2 text-xl text-gray-500 ${
                  locale === "ar" ? "left-3" : "right-3"
                } dark:text-white`}
                aria-label="toggle confirm password visibility"
              >
                {confirmVisible ? <PiEyeBold /> : <PiEyeClosedBold />}
              </button>
            </div>
            {errors?.password_confirmation && (
              <InvalidFeedback
                error={t(errors.password_confirmation.message || "")}
              />
            )}
          </div>

          {/* SUBMIT */}
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full btn-primary text-white py-5.5"
          >
            {loading
              ? tGeneral("loading") || "Loading..."
              : t("resetPasswordButton")}
          </Button>
        </form>
      </div>
    </section>
  );
}

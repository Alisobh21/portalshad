"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { MdOutlineEmail } from "react-icons/md";
import { AiOutlineLock } from "react-icons/ai";
import { PiEyeClosedBold, PiEyeBold } from "react-icons/pi";
import { RiDoorOpenFill, RiUserAddLine } from "react-icons/ri";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useDispatch } from "react-redux";

import axiosPrivate, { axiosInternal } from "@/axios/axios";
import lsSecure from "@/helpers/Secure";
import { _getAuthUser, _setToken } from "../../../../store/slices/authSlice";
import { AppDispatch } from "../../../../store/store";
// import InvalidFeedback from "@/components/InvalidFeedback";

// -------------------------
//       VALIDATION
// -------------------------
const LoginSchema = z.object({
  email: z
    .string()
    .email({ message: "invalidEmail" })
    .nonempty({ message: "emailRequired" }),
  password: z.string().nonempty({ message: "passwordRequired" }),
});

type LoginFormData = z.infer<typeof LoginSchema>;

export default function LoginForm() {
  const t = useTranslations("Login");
  const tGeneral = useTranslations("General");

  const locale = useLocale();
  const dispatch = useDispatch<AppDispatch>();

  const [passVisible, setPassVisible] = useState(false);
  const [loginLoading, setLoginLoading] = useState<
    null | "loading" | "redirect"
  >(null);

  // -------------------------
  //  react-hook-form
  // -------------------------
  const {
    register,
    handleSubmit,
    formState: {},
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  // -------------------------
  //      SUBMIT LOGIN
  // -------------------------
  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setLoginLoading("loading");

    try {
      const response = await axiosPrivate.post("/login", {
        email: data.email,
        password: data.password,
      });

      if (response?.data?.success) {
        const { token, user } = response.data.data;

        dispatch(_getAuthUser(user));
        if (lsSecure) {
          lsSecure.set("auth_token", token);
        }

        const loginRes = await axiosInternal.post("/api/set-auth", { user });

        if (loginRes?.data?.success) {
          dispatch(_setToken(token));
          window.location.href = "/";
        }
      }

      setLoginLoading("redirect");
    } catch (err) {
      console.error(err);
      setLoginLoading(null);
    }
  };

  return (
    <section className="lg:py-5 w-full lg:p-5">
      <div className="max-w-[550px] mx-auto">
        {/* ------------------------- */}
        {/*   HEADER TEXT */}
        {/* ------------------------- */}
        <div className="w-full mb-6 space-y-3 ">
          <h1
            className={
              locale === "en"
                ? "lg:text-[50px] max-w-[300px]"
                : "font-bold lg:text-[50px] leading-[1.2]"
            }
          >
            {t("welcome")}
          </h1>
          <p className="text-muted-foreground text-[15px] opacity-80">
            {t("secureAccess")}
          </p>
        </div>

        {/* ------------------------- */}
        {/*      TABS */}
        {/* ------------------------- */}
        <Tabs
          className="w-full"
          defaultValue="login"
          dir={locale === "ar" ? "rtl" : "ltr"}
        >
          <TabsList
            className="grid grid-cols-2 bg-neutral-200 dark:bg-neutral-800 h-12
               border border-neutral-300  dark:border-neutral-600/50 w-full"
          >
            <TabsTrigger
              value="login"
              asChild
              className="data-[state=active]:bg-neutral-50 dark:data-[state=active]:bg-neutral-700"
            >
              <Link
                href="/login"
                className="flex gap-2 items-center justify-center"
              >
                <RiDoorOpenFill size={18} />
                {tGeneral("login")}
              </Link>
            </TabsTrigger>

            <TabsTrigger
              value="register"
              asChild
              className="data-[state=active]:bg-neutral-50 dark:data-[state=active]:bg-neutral-700"
            >
              <Link
                href="/register"
                className="flex gap-2 items-center justify-center"
              >
                <RiUserAddLine size={18} />
                {tGeneral("register")}
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* ------------------------- */}
        {/*     FORM */}
        {/* ------------------------- */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3 pb-3 mt-3"
          noValidate
        >
          {/* EMAIL */}
          <div className="flex flex-col space-y-1">
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
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col space-y-1">
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
                } py-6 h-14  dark:bg-neutral-600/50 bg-neutral-50 `}
                placeholder={t("password")}
              />

              <button
                type="button"
                onClick={() => setPassVisible(!passVisible)}
                className={`absolute top-1/2 -translate-y-1/2 text-xl text-gray-500 ${
                  locale === "ar" ? "left-3" : "right-3"
                } dark:text-white`}
              >
                {passVisible ? <PiEyeBold /> : <PiEyeClosedBold />}
              </button>
            </div>

            {/* {errors.password && (
    <InvalidFeedback error={t(errors.password.message)} />
  )} */}

            <Link
              href="/reset"
              className="text-sm mt-3 text-primary hover:underline"
            >
              {t("resetPasswordButton")}
            </Link>
          </div>

          {/* SUBMIT */}
          <Button
            type="submit"
            variant="primary"
            disabled={!!loginLoading}
            className="w-full btn-primary text-white py-5.5"
          >
            {loginLoading === "redirect" ? t("redirecting") : t("login")}
          </Button>
        </form>
      </div>
    </section>
  );
}

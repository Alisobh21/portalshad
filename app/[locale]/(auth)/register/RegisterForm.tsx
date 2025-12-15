"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { MdOutlineEmail } from "react-icons/md";
import { AiOutlineLock } from "react-icons/ai";
import { PiEyeBold, PiEyeClosedBold } from "react-icons/pi";
import { RiDoorOpenFill, RiUser4Fill, RiUserAddLine } from "react-icons/ri";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const RegisterSchema = z.object({
  name: z.string().nonempty({ message: "requiredName" }),
  email: z
    .string()
    .email({ message: "invalidEmail" })
    .nonempty({ message: "emailRequired" }),
  password: z.string().nonempty({ message: "passwordRequired" }),
});

type RegisterFormData = z.infer<typeof RegisterSchema>;

export default function RegisterForm() {
  const tGeneral = useTranslations("General");
  const t = useTranslations("Login");
  const locale = useLocale();
  const [passVisible, setPassVisible] = useState(false);

  const {
    register,
    // handleSubmit,
    // formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
  });

  return (
    <section className="lg:py-5 w-full lg:p-5">
      <div className="max-w-[550px] mx-auto">
        <div className="w-full mb-6 space-y-3 ">
          <h1
            className={
              locale === "en"
                ? "lg:text-[50px] "
                : "font-bold lg:text-[50px] leading-[1.2]"
            }
          >
            {t("welcome")}
          </h1>
          <p className="text-muted-foreground text-[15px] opacity-80">
            {t("secureAccess")}
          </p>
        </div>

        <Tabs
          className="w-full"
          defaultValue="register"
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

        <form className="flex flex-col gap-3 pb-3 mt-3" noValidate>
          {/* NAME */}
          <div className="flex flex-col space-y-1">
            <div className="relative" dir={locale === "ar" ? "rtl" : "ltr"}>
              <RiUser4Fill
                className={`absolute top-1/2 -translate-y-1/2 text-gray-500 ${
                  locale === "ar" ? "right-3" : "left-3"
                } dark:text-white`}
              />

              <Input
                {...register("name")}
                dir={locale === "ar" ? "rtl" : "ltr"}
                type="text"
                className={`${
                  locale === "ar" ? "pr-10" : "pl-10"
                } py-6 h-14 bg-neutral-50 dark:bg-neutral-600/50`}
                placeholder={tGeneral("placeholdername")}
                aria-label={tGeneral("name")}
              />
            </div>
          </div>

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
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full btn-primary text-white py-5.5"
          >
            {tGeneral("register")}
          </Button>
        </form>
      </div>
    </section>
  );
}

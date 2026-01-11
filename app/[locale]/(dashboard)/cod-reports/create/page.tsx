import CurrentPageFetcher from "@/components/CurrentPageFetcher";
import { Card, CardContent } from "@/components/ui/card";
import CreateReportForm from "./CreateReportForm";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function CreateReport() {
  const t = await getTranslations("Reports");
  return (
    <>
      <CurrentPageFetcher page={{ title: t("createTitle") }} />
      <Card className="dark:bg-default-50/70 backdrop-blur-md">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            <div className="xl:col-span-7">
              <CreateReportForm />
            </div>
            <div className="xl:col-span-5 hidden xl:flex justify-center items-center">
              <Image
                src="/reports.png"
                alt="Reports illustration"
                width={250}
                height={250}
                className="max-w-[350px] object-contain h-full"
                priority
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

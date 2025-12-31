import { getTranslations } from "next-intl/server";
import MaintenanceMessage from "./MaintenanceMessage";

export default async function MaintainancePage() {
  const t = await getTranslations("inactive");
  const tLogin = await getTranslations("Login");

  const heading = t("heading");
  const message = t("message");
  const copyrights = tLogin("copyright");

  return (
    <section className="h-screen p-3">
      <div className="rounded-2xl relative flex w-full flex-col min-h-full items-center justify-between bg-content2 dark:bg-content2/40 p-5">
        <MaintenanceMessage
          heading={heading}
          message={message}
          copyrights={copyrights}
        />
      </div>
    </section>
  );
}

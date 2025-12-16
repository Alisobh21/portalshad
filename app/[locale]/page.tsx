import { getTranslations } from "next-intl/server";
import { Suspense, type ReactElement } from "react";

import WelcomeCard from "./WelcomeCard";

export default async function Home(): Promise<ReactElement> {
  await getTranslations("Homepage");

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <section className="flex flex-col gap-4 mt-2 pb-10 rtl:mr-1 ltr:ml-1">
        <WelcomeCard />
      </section>
    </Suspense>
  );
}

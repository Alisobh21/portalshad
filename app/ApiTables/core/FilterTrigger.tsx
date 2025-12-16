"use client";
import { Button } from "@/components/ui/button";
import { MdFilterListAlt } from "react-icons/md";

import { useTranslations } from "next-intl";

export default function FilterTrigger({ showFilters, setShowFilters }: { showFilters: boolean; setShowFilters: (showFilters: boolean) => void }) {
    const tApiTables = useTranslations("ApiTables");
    return (
        <>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                <MdFilterListAlt />
                {tApiTables("show_filters")}
            </Button>
        </>
    );
}

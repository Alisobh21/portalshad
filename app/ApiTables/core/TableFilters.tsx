"use client";

/* eslint-disable jsx-a11y/aria-proptypes */

import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  objectToArrayKeyVal,
  restructureSelectedFilters,
} from "../table-utils/utils";
import { CalendarIcon, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import AppliedFilters from "./AppliedFilters";
import { Input } from "@/components/ui/input";
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import {
  _setAppliedFilters,
  _setCurrentPage,
  _setRenderedFilters,
} from "../table-providers/slices/tableCoreSlice";
import { useTranslations, useLocale } from "next-intl";
import useUtilTranslator from "../table-utils/useUtilTranslator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar } from "@/components/calendar";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import FilterTrigger from "./FilterTrigger";

interface TableCoreState {
  tableName: string;
  structureFilters: Array<{
    type: string;
    filter_name: string;
    label: string;
    pair_with?: boolean;
    props?: {
      operators?: string[];
      options?: Record<string, string>;
      select_options?: Record<string, string>;
    };
  }>;
}

interface RootState {
  tableCore: TableCoreState;
}

interface DateObject {
  year: number;
  month: number;
  day: number;
}

interface DatesRange {
  start: DateObject;
  end: DateObject;
}

function TableFilters({
  showFilters,
  setShowFilters,
}: {
  showFilters: boolean;
  setShowFilters: (showFilters: boolean) => void;
}) {
  const { tableName, structureFilters } = useSelector(
    (state: RootState) => state.tableCore
  );
  const [expandedFilters, setExpandedFilters] = useState(true);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const dispatch = useDispatch();
  const t = useTranslations("General");
  const tApiTables = useTranslations("ApiTables");
  const locale = useLocale();
  const {
    handleSubmit,
    control,
    setValue,
    resetField,
    watch,
    formState: { dirtyFields },
  } = useForm();
  const watchFields = watch();
  const { getOperatorLabel } = useUtilTranslator();

  useEffect(() => {
    const isAnyFieldFilled = Object.values(watchFields).some(
      (field: any) =>
        field?.fieldValue &&
        (typeof field.fieldValue === "string" && field.fieldValue?.trim()) !==
          ""
    );
    setIsSubmitEnabled(isAnyFieldFilled);
  }, [watchFields]);

  const getOperators = (filter: any) => {
    return filter?.props?.operators;
  };

  const renderOperator = (filter: any) => {
    return filter?.props?.operators?.length > 1;
  };

  function submitFiltersHandler(data: Record<string, any>) {
    const updatedForTags = Object.fromEntries(
      Object.entries(data).map(([key, value]: [string, any]) => {
        if (typeof value.fieldValue === "string" && value.operator === "in") {
          return [
            key,
            {
              ...value,
              fieldValue: value.fieldValue
                .split(",")
                ?.filter((el: string) => el !== ""),
            },
          ];
        } else if (
          value.operator === "between" &&
          typeof value.fieldValue === "object"
        ) {
          return [
            key,
            { ...value, fieldValue: formatDatesRange(value.fieldValue)?.value },
          ];
        }
        return [key, value];
      })
    );
    const updatedForDate = Object.fromEntries(
      Object.entries(data).map(([key, value]: [string, any]) => {
        if (
          value.operator === "between" &&
          typeof value.fieldValue === "object"
        ) {
          return [
            key,
            { ...value, fieldValue: formatDatesRange(value.fieldValue)?.label },
          ];
        }
        return [key, value];
      })
    );

    dispatch(
      _setAppliedFilters(
        restructureSelectedFilters(
          updatedForTags,
          dirtyFields,
          structureFilters
        )
      )
    );
    dispatch(
      _setRenderedFilters(
        restructureSelectedFilters(
          updatedForDate,
          dirtyFields,
          structureFilters
        )
      )
    );
    dispatch(_setCurrentPage(1));
    setShowFilters(false);
  }

  function formatDatesRange(datesObj: DatesRange) {
    const formatDate = ({ year, month, day }: DateObject) => {
      const m = String(month).padStart(2, "0");
      const d = String(day).padStart(2, "0");
      return `${year}-${m}-${d}`;
    };

    const start = formatDate(datesObj.start);
    const end = formatDate(datesObj.end);

    return { label: `${start} - ${end}`, value: [start, end] };
  }

  console.log("🚀 structureFilters 👉", structureFilters, "✨");

  return (
    // <div className="z-[200]">
    //     <div className="flex mb-5 justify-start">
    //         <Button variant="outline" onClick={() => setExpandedFilters((prev) => !prev)}>
    //             {expandedFilters ? <GoChevronUp className="ms-auto" /> : <GoChevronDown className="ms-auto" />}
    //             {expandedFilters ? tApiTables("hide_filters") : tApiTables("show_filters")}
    //         </Button>
    //     </div>

    //     <div className={`${expandedFilters ? "block" : "hidden"}`}>
    // <form
    //     noValidate
    //     className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 items-end"
    //     onSubmit={handleSubmit(submitFiltersHandler)}
    // >
    //     {/* ... Date Type Filters */}
    //     {structureFilters
    //         ?.filter((filter) => filter?.type === "date")
    //         ?.map(
    //             (filter) =>
    //                 filter?.pair_with && (
    //                     <div className="m-0 w-full" key={filter.filter_name}>
    //                         <Controller
    //                             name={`${filter?.filter_name}.fieldValue`}
    //                             control={control}
    //                             defaultValue={undefined}
    //                             render={({ field }) => (
    //                                 <Popover>
    //                                     <PopoverTrigger asChild>
    //                                         <Button
    //                                             id="date"
    //                                             variant="outline"
    //                                             className={cn(
    //                                                 "w-[300px] justify-start text-left font-normal bg-background",
    //                                                 !field.value && "text-muted-foreground"
    //                                             )}
    //                                         >
    //                                             <CalendarIcon className="mr-2 h-4 w-4" />
    //                                             {field.value?.from ? (
    //                                                 field.value.to ? (
    //                                                     <>
    //                                                         {format(field.value.from, "LLL dd, y")} -{" "}
    //                                                         {format(field.value.to, "LLL dd, y")}
    //                                                     </>
    //                                                 ) : (
    //                                                     format(field.value.from, "LLL dd, y")
    //                                                 )
    //                                             ) : (
    //                                                 <span>Pick a date</span>
    //                                             )}
    //                                         </Button>
    //                                     </PopoverTrigger>
    //                                     <PopoverContent className="w-auto p-0" align="start">
    //                                         <Calendar
    //                                             autoFocus
    //                                             mode="range"
    //                                             defaultMonth={field.value?.from}
    //                                             selected={field.value}
    //                                             onSelect={(dates) => field.onChange(dates)}
    //                                             numberOfMonths={1}
    //                                         />
    //                                     </PopoverContent>
    //                                 </Popover>
    //                             )}
    //                         />
    //                     </div>
    //                 )
    //         )}

    //     {true &&
    //         structureFilters
    //             ?.filter((filter) => filter?.type !== "range" && filter?.type !== "date")
    //             ?.map((filter) => (
    //                 <div className="space-y-2" key={filter?.filter_name}>
    //                     <Label>{filter?.label}</Label>
    //                     <div className={`${renderOperator(filter) ? "relative" : ""}`}>
    //                         <div className={`flex items-stretch`}>
    //                             <div className="m-0 w-full">
    //                                 {filter?.type === "text" && (
    //                                     <Controller
    //                                         name={`${filter?.filter_name}.fieldValue`}
    //                                         control={control}
    //                                         defaultValue=""
    //                                         render={({ field }) => (
    //                                             <Input
    //                                                 className={`!focus-visible:ring-0 !focus-visible:shadow-none bg-background ${
    //                                                     renderOperator(filter) ? "border-ee-0 rounded-e-nonee" : ""
    //                                                 }`}
    //                                                 aria-label={`${filter?.filter_name}`}
    //                                                 {...field}
    //                                                 type={filter?.type}
    //                                                 placeholder={filter?.label}
    //                                             />
    //                                         )}
    //                                     />
    //                                 )}

    //                                 {(filter?.type === "select" || filter?.type === "boolean" || filter?.type === "null") && (
    //                                     <Controller
    //                                         name={`${filter?.filter_name}.fieldValue`}
    //                                         control={control}
    //                                         defaultValue={undefined}
    //                                         render={({ field }) => (
    //                                             <Select
    //                                                 {...field}
    //                                                 onValueChange={field.onChange}
    //                                                 defaultValue={field.value}
    //                                                 aria-label={`${filter?.filter_name}`}
    //                                             >
    //                                                 <SelectTrigger
    //                                                     className={`w-full cursor-pointer bg-background
    //                                                     ${renderOperator(filter) ? "border-ee-0 rounded-e-nonee" : ""}  `}
    //                                                 >
    //                                                     <SelectValue placeholder={filter?.label} />
    //                                                 </SelectTrigger>
    //                                                 <SelectContent>
    //                                                     {objectToArrayKeyVal(filter?.props?.select_options || {})
    //                                                         ?.sort((a, b) => (a.value === "" ? -1 : b.value === "" ? 1 : 0))
    //                                                         ?.map((opt) => (
    //                                                             <SelectItem value={opt?.value} key={opt?.value}>
    //                                                                 {opt?.key}
    //                                                             </SelectItem>
    //                                                         ))}
    //                                                 </SelectContent>
    //                                             </Select>
    //                                         )}
    //                                     />
    //                                 )}

    //                                 {filter?.type === "number" && (
    //                                     <Controller
    //                                         name={`${filter?.filter_name}.fieldValue`}
    //                                         control={control}
    //                                         defaultValue=""
    //                                         render={({ field }) => (
    //                                             <Input
    //                                                 className={`bg-background ${
    //                                                     renderOperator(filter) ? "border-ee-0 rounded-e-nonee" : ""
    //                                                 }`}
    //                                                 {...field}
    //                                                 aria-label={`${filter?.filter_name}`}
    //                                                 type="text"
    //                                                 onKeyDown={(e) => {
    //                                                     // Allow: backspace, delete, tab, escape, enter, decimal point
    //                                                     if (
    //                                                         [46, 8, 9, 27, 13, 190, 110].indexOf(e.keyCode) !== -1 ||
    //                                                         // Allow: Ctrl+A
    //                                                         (e.keyCode === 65 && e.ctrlKey === true) ||
    //                                                         // Allow: home, end, left, right
    //                                                         (e.keyCode >= 35 && e.keyCode <= 39)
    //                                                     ) {
    //                                                         return;
    //                                                     }
    //                                                     // Ensure that it is a number and stop the keypress if not
    //                                                     if (
    //                                                         (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
    //                                                         (e.keyCode < 96 || e.keyCode > 105)
    //                                                     ) {
    //                                                         e.preventDefault();
    //                                                     }
    //                                                 }}
    //                                                 onChange={(e) => {
    //                                                     // Only allow numbers and one decimal point
    //                                                     const value = e.target.value.replace(/[^\d.]/g, "");
    //                                                     // Prevent multiple decimal points
    //                                                     const parts = value.split(".");
    //                                                     if (parts.length > 2) {
    //                                                         return;
    //                                                     }
    //                                                     field.onChange(value);
    //                                                 }}
    //                                                 placeholder={filter?.label}
    //                                             />
    //                                         )}
    //                                     />
    //                                 )}

    //                                 {filter?.type === "multi_select" && !filter?.props?.options && <></>}

    //                                 {filter?.type === "multi_select" && filter?.props?.options && <></>}
    //                             </div>

    //                             <Controller
    //                                 name={`${filter.filter_name}.operator`}
    //                                 control={control}
    //                                 defaultValue={getOperators(filter)[0]}
    //                                 render={({ field }) => (
    //                                     <Select
    //                                         {...field}
    //                                         onValueChange={field.onChange}
    //                                         value={field.value || getOperators(filter)[0]}
    //                                         aria-label={`${filter?.filter_name}`}
    //                                     >
    //                                         <Tooltip>
    //                                             <TooltipTrigger asChild>
    //                                                 <SelectTrigger
    //                                                     className={`bg-muted-foreground/10 absolute top-[3px] end-[3px] min-w-[80px] max-w-[80px] border-none !h-[32px] !cursor-pointer shadow-none ${
    //                                                         renderOperator(filter) ? "" : "hidden"
    //                                                     }`}
    //                                                 >
    //                                                     <SelectValue />
    //                                                 </SelectTrigger>
    //                                             </TooltipTrigger>
    //                                             <TooltipContent className="dark:text-background">
    //                                                 {getOperatorLabel(watch(`${filter.filter_name}.operator`)) ||
    //                                                     getOperatorLabel(getOperators(filter)?.[0])}
    //                                             </TooltipContent>
    //                                         </Tooltip>
    //                                         <SelectContent align={"end"}>
    //                                             {getOperators(filter)?.map((operator: string) => (
    //                                                 <SelectItem key={operator} value={operator}>
    //                                                     {operator}
    //                                                 </SelectItem>
    //                                             ))}
    //                                         </SelectContent>
    //                                     </Select>
    //                                 )}
    //                             />
    //                         </div>
    //                     </div>
    //                 </div>
    //             ))}

    //     {/* Filters Submission */}
    //     <div className="col">
    //         <Button type="submit" variant="primary-opac" className="px-5" disabled={!isSubmitEnabled}>
    //             {t("apply")}
    //         </Button>
    //     </div>
    // </form>
    //     </div>

    //     <AppliedFilters setValue={setValue} resetField={resetField} />
    // </div>
    <>
      {structureFilters?.length > 0 && (
        <Sheet open={showFilters} onOpenChange={setShowFilters}>
          <SheetTrigger asChild>
            <Button variant="outline" className="hidden"></Button>
          </SheetTrigger>
          <SheetContent
            className="z-[999] rounded-xl overflow-hidden! pb-5"
            side={locale === "ar" ? "left" : "right"}
          >
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>

            <form
              noValidate
              id="tb_filters_form"
              className="flex flex-col h-full overflow-y-auto gap-4 px-4 pb-20 relative"
              onSubmit={handleSubmit(submitFiltersHandler)}
            >
              {/* ... Date Type Filters */}
              {structureFilters
                ?.filter((filter) => filter?.type === "date")
                ?.map(
                  (filter) =>
                    filter?.pair_with && (
                      <div className="m-0 w-full" key={filter.filter_name}>
                        <Controller
                          name={`${filter?.filter_name}.fieldValue`}
                          control={control}
                          defaultValue={undefined}
                          render={({ field }) => (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  id="date"
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal bg-background",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value?.from ? (
                                    field.value.to ? (
                                      <>
                                        {format(field.value.from, "LLL dd, y")}{" "}
                                        - {format(field.value.to, "LLL dd, y")}
                                      </>
                                    ) : (
                                      format(field.value.from, "LLL dd, y")
                                    )
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  autoFocus
                                  mode="range"
                                  defaultMonth={field.value?.from}
                                  selected={field.value}
                                  onSelect={(dates) => field.onChange(dates)}
                                  numberOfMonths={1}
                                />
                              </PopoverContent>
                            </Popover>
                          )}
                        />
                      </div>
                    )
                )}

              {true &&
                structureFilters
                  ?.filter(
                    (filter) =>
                      filter?.type !== "range" && filter?.type !== "date"
                  )
                  ?.map((filter) => (
                    <div className="space-y-2" key={filter?.filter_name}>
                      <Label>{filter?.label}</Label>
                      <div
                        className={`${
                          renderOperator(filter) ? "relative" : ""
                        }`}
                      >
                        <div className={`flex items-stretch`}>
                          <div className="m-0 w-full">
                            {filter?.type === "text" && (
                              <Controller
                                name={`${filter?.filter_name}.fieldValue`}
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                  <Input
                                    className={`!focus-visible:ring-0 !focus-visible:shadow-none bg-background ${
                                      renderOperator(filter)
                                        ? "border-ee-0 rounded-e-nonee"
                                        : ""
                                    }`}
                                    aria-label={`${filter?.filter_name}`}
                                    {...field}
                                    type={filter?.type}
                                    placeholder={filter?.label}
                                  />
                                )}
                              />
                            )}

                            {(filter?.type === "select" ||
                              filter?.type === "boolean" ||
                              filter?.type === "null") && (
                              <Controller
                                name={`${filter?.filter_name}.fieldValue`}
                                control={control}
                                defaultValue={undefined}
                                render={({ field }) => (
                                  <Select
                                    {...field}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    aria-label={`${filter?.filter_name}`}
                                  >
                                    <SelectTrigger
                                      className={`w-full cursor-pointer bg-background
                                                                    ${
                                                                      renderOperator(
                                                                        filter
                                                                      )
                                                                        ? "border-ee-0 rounded-e-nonee"
                                                                        : ""
                                                                    }  `}
                                    >
                                      <SelectValue
                                        placeholder={filter?.label}
                                      />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {objectToArrayKeyVal(
                                        filter?.props?.select_options || {}
                                      )
                                        ?.sort((a, b) =>
                                          a.value === ""
                                            ? -1
                                            : b.value === ""
                                            ? 1
                                            : 0
                                        )
                                        ?.map((opt) => (
                                          <SelectItem
                                            value={opt?.value}
                                            key={opt?.value}
                                          >
                                            {opt?.key}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                            )}

                            {filter?.type === "number" && (
                              <Controller
                                name={`${filter?.filter_name}.fieldValue`}
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                  <Input
                                    className={`bg-background ${
                                      renderOperator(filter)
                                        ? "border-ee-0 rounded-e-nonee"
                                        : ""
                                    }`}
                                    {...field}
                                    aria-label={`${filter?.filter_name}`}
                                    type="text"
                                    onKeyDown={(e) => {
                                      // Allow: backspace, delete, tab, escape, enter, decimal point
                                      if (
                                        [46, 8, 9, 27, 13, 190, 110].indexOf(
                                          e.keyCode
                                        ) !== -1 ||
                                        // Allow: Ctrl+A
                                        (e.keyCode === 65 &&
                                          e.ctrlKey === true) ||
                                        // Allow: home, end, left, right
                                        (e.keyCode >= 35 && e.keyCode <= 39)
                                      ) {
                                        return;
                                      }
                                      // Ensure that it is a number and stop the keypress if not
                                      if (
                                        (e.shiftKey ||
                                          e.keyCode < 48 ||
                                          e.keyCode > 57) &&
                                        (e.keyCode < 96 || e.keyCode > 105)
                                      ) {
                                        e.preventDefault();
                                      }
                                    }}
                                    onChange={(e) => {
                                      // Only allow numbers and one decimal point
                                      const value = e.target.value.replace(
                                        /[^\d.]/g,
                                        ""
                                      );
                                      // Prevent multiple decimal points
                                      const parts = value.split(".");
                                      if (parts.length > 2) {
                                        return;
                                      }
                                      field.onChange(value);
                                    }}
                                    placeholder={filter?.label}
                                  />
                                )}
                              />
                            )}

                            {filter?.type === "multi_select" &&
                              !filter?.props?.options && <></>}

                            {filter?.type === "multi_select" &&
                              filter?.props?.options && <></>}
                          </div>

                          <Controller
                            name={`${filter.filter_name}.operator`}
                            control={control}
                            defaultValue={getOperators(filter)[0]}
                            render={({ field }) => (
                              <Select
                                {...field}
                                onValueChange={field.onChange}
                                value={field.value || getOperators(filter)[0]}
                                aria-label={`${filter?.filter_name}`}
                              >
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <SelectTrigger
                                      className={`bg-muted-foreground/10 absolute top-[3px] end-[3px] min-w-[80px] max-w-[80px] border-none !h-[32px] !cursor-pointer shadow-none ${
                                        renderOperator(filter) ? "" : "hidden"
                                      }`}
                                    >
                                      <SelectValue />
                                    </SelectTrigger>
                                  </TooltipTrigger>
                                  <TooltipContent className="dark:text-background">
                                    {getOperatorLabel(
                                      watch(`${filter.filter_name}.operator`)
                                    ) ||
                                      getOperatorLabel(
                                        getOperators(filter)?.[0]
                                      )}
                                  </TooltipContent>
                                </Tooltip>
                                <SelectContent align={"end"}>
                                  {getOperators(filter)?.map(
                                    (operator: string) => (
                                      <SelectItem
                                        key={operator}
                                        value={operator}
                                      >
                                        {operator}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

              {/* Filters Submission */}
            </form>
            <div className="col absolute bottom-0 p-3 bg-background  left-0 right-0">
              <Button
                form="tb_filters_form"
                type="submit"
                variant="primary-opac"
                className="px-5 w-full"
                disabled={!isSubmitEnabled}
              >
                {t("apply")}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      )}

      <AppliedFilters setValue={setValue} resetField={resetField} />
    </>
  );
}

export default TableFilters;

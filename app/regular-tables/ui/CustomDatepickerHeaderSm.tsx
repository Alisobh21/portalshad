"use client";

import React from "react";
import { getMonth, getYear } from "date-fns";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Helper function to create a range of numbers
const range = (start: number, end: number, step: number = 1): number[] => {
  const result: number[] = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
};

type CustomDatepickerHeaderSmProps = {
  months: string[];
  date: Date;
  changeYear: (year: number) => void;
  changeMonth: (month: number) => void;
  decreaseMonth: () => void;
  increaseMonth: () => void;
  prevMonthButtonDisabled: boolean;
  nextMonthButtonDisabled: boolean;
  maxYear?: number;
};

const CustomDatepickerHeaderSm: React.FC<CustomDatepickerHeaderSmProps> = ({
  months,
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
  maxYear = 2022,
}) => {
  const years = range(maxYear, getYear(new Date()) + 1, 1);

  return (
    <>
      {/* Title */}
      <div className="text-center px-2 w-full mb-2">
        <div className="font-semibold text-sm rounded-md p-2 bg-muted">
          {months[getMonth(date)]}
          <span className="mx-2 inline-block w-1 h-1 rounded-full bg-muted-foreground align-middle" />
          {getYear(date)}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 px-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={decreaseMonth}
          disabled={prevMonthButtonDisabled}
          className="me-auto"
        >
          <TbChevronRight />
        </Button>

        {/* Year Select */}
        <Select
          value={String(getYear(date))}
          onValueChange={(value) => changeYear(Number(value))}
        >
          <SelectTrigger className="w-[90px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {years.map((year: number) => (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Month Select */}
        <Select
          value={months[getMonth(date)]}
          onValueChange={(value) => changeMonth(months.indexOf(value))}
        >
          <SelectTrigger className="w-[110px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={increaseMonth}
          disabled={nextMonthButtonDisabled}
          className="ms-auto"
        >
          <TbChevronLeft />
        </Button>
      </div>
    </>
  );
};

export default CustomDatepickerHeaderSm;

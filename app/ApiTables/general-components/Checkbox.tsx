"use client";
import { Checkbox as CheckboxItem } from "@/components/ui/checkbox";
import React from "react";

export const Checkbox = React.forwardRef(({ onClick, onChange, checked, ...rest }: any, ref: any) => {
    return <CheckboxItem ref={ref} onCheckedChange={onClick} checked={checked} {...rest} />;
});

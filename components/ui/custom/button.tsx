import { Button as ShadButton } from "@/components/ui/button";
import React, { MouseEventHandler } from "react";
import { ImSpinner6 } from "react-icons/im";

export default function Button({
  isLoading,
  children,
  variant = "default",
  size = "lg",
  icon,
  className = "",
  type = "button",
  isDisabled = false,
  form,
  asChild = false,
  onClick,
}: {
  variant: any;
  size?: any;
  children: React.ReactNode;
  isLoading?: boolean;
  icon?: React.ReactNode;
  className?: string;
  isDisabled?: boolean;
  type?: any;
  asChild?: boolean;
  form?: any;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <>
      <ShadButton
        type={type}
        className={`${className} cursor-pointer h-9 px-4 py-2 ${
          isDisabled ? "disabled:opacity-50 disabled:pointer-events-none" : ""
        }`}
        disabled={isLoading || isDisabled}
        size={size}
        variant={variant}
        onClick={onClick}
        {...(form && { form })}
      >
        {isLoading ? <ImSpinner6 className="animate-spin" /> : icon && icon}
        {children}
      </ShadButton>
    </>
  );
}

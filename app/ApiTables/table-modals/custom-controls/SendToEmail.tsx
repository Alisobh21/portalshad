// @ts-nocheck

"use client";

/* eslint-disable react-hooks/exhaustive-deps */
import { Controller, useForm } from "react-hook-form";
import { Autocomplete, AutocompleteItem, Button, Chip, Input, Select, SelectItem } from "@heroui/react";
import { useSelector } from "react-redux";
import { LuChevronsUpDown } from "react-icons/lu";
import { MdWarehouse } from "react-icons/md";
import { TbPencilCheck } from "react-icons/tb";
import { HiBackspace } from "react-icons/hi2";
import { requiredField } from "@/helpers/constants";
import { AiOutlineProduct } from "react-icons/ai";
import useUtilsProvider from "../../table-providers/useUtilsProvider";
import { useEffect, useState } from "react";
import axiosPrivate from "@/app/axios/axios";
import { FaBoxArchive, FaUser } from "react-icons/fa6";
import InvalidFeedback from "@/components/InvalidFeedback";
import { HiEnvelope } from "react-icons/hi2";

export default function SendToEmail() {
    const { selectedBulkAction } = useSelector((state) => state?.bulkActions);
    const { appliedFilters, bulkActionPostLoading } = useSelector((state) => state?.bulkActions);
    const { selectedIds } = useSelector((state) => state?.tableColumns);
    const { bulkActionsPostHandler } = useUtilsProvider();
    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
    } = useForm();

    // --------------------------------------------------------------------
    //    🎯  [ASYNC FUNCTION] HANDLE SUBMITTING
    // --------------------------------------------------------------------
    function submitCustomControlForm(data) {
        bulkActionsPostHandler(
            selectedBulkAction?.method,
            selectedBulkAction?.action.api?.replace("/api", ""),
            {
                filters: appliedFilters,
                selected_ids: selectedIds,
                emails: data?.emails?.split(","),
            },
            { msg: "جاري إرسال التقرير", icon: "mailing" },
            selectedBulkAction
        );
    }

    function validateEmailList(input) {
        if (!input || typeof input !== "string" || input.trim() === "") {
            return "Please enter at least one email address.";
        }

        const emails = input.split(",").map((email) => email.trim());
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const invalidEmails = emails.filter((email) => !emailRegex.test(email));

        if (invalidEmails.length > 0) {
            return `Invalid email(s): ${invalidEmails.join(", ")}`;
        }

        return true;
    }

    return (
        <>
            <header className="pb-5 text-center">
                <h5>Send To Email</h5>
            </header>
            <form onSubmit={handleSubmit(submitCustomControlForm)} noValidate className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <Input
                        type="text"
                        startContent={<HiEnvelope size={18} />}
                        label="Emails"
                        placeholder='Add emails and separate with ","'
                        variant="bordered"
                        size="md"
                        labelPlacement="outside"
                        {...requiredField}
                        {...register("emails", {
                            required: {
                                value: true,
                                message: "Please enter emails",
                            },
                            validate: validateEmailList,
                        })}
                    />
                    {errors?.emails && <InvalidFeedback error={errors?.emails?.message} />}
                </div>

                <Button variant="flat" color="primary" size="md" fullWidth type="submit" isDisabled={!isDirty} isLoading={bulkActionPostLoading}>
                    Send
                </Button>
            </form>
        </>
    );
}

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
import { FaBoxArchive, FaUser } from "react-icons/fa6";
import { useTranslations } from "next-intl";
import InvalidFeedback from "@/components/InvalidFeedback";

export default function EditLineItems({ action, closeModal }) {
    const { rowActionPostLoading } = useSelector((state) => state?.rowActions);
    const t = useTranslations("Orders");
    const { rowActionsPostHandler } = useUtilsProvider();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        setValue("name", action?.payload?.name || 1);
    }, [action?.payload?.name]);

    // --------------------------------------------------------------------
    //    🎯  [ASYNC FUNCTION] HANDLE SUBMITTING
    // --------------------------------------------------------------------
    function submitCustomControlForm(data) {
        rowActionsPostHandler(action?.method, action?.url?.replace("/api", ""), { ...action?.payload, ...data }, action);
    }

    return (
        <>
            <header className="pb-5 text-center">
                <h5>Edit Order's Products </h5>
            </header>
            <form onSubmit={handleSubmit(submitCustomControlForm)} noValidate className="flex flex-col gap-4">
                {/* <div className='flex flex-col gap-2'>
                    <Input
                        startContent={<FaUser size={18} />}
                        label='User Name'
                        type='text'
                        placeholder='Enter User Name'
                        variant='bordered'
                        size='md'
                        labelPlacement='outside'
                        defaultValue={action?.payload?.name}
                        min={1}
                        {...requiredField}
                        {...register('name', {
                            required: {
                                value: true,
                                message: 'Please enter user name',
                            },
                        })}
                    />
                    {errors?.name && (
                        <Chip
                            color='danger'
                            classNames={{
                                base: 'max-w-full w-full',
                            }}
                            variant='flat'
                            radius='sm'
                            size='sm'
                        >
                            {errors?.name?.message}
                        </Chip>
                    )}
                </div> */}

                <Button variant="flat" color="primary" size="md" fullWidth type="submit" isLoading={rowActionPostLoading}>
                    {t("editOrder")}
                </Button>
            </form>
        </>
    );
}

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
import { FaBoxArchive, FaBuilding, FaEnvelope, FaMobileButton, FaUser } from "react-icons/fa6";
import { useTranslations } from "next-intl";
import InvalidFeedback from "@/components/InvalidFeedback";
import { FaGlobeAsia, FaMapMarkerAlt } from "react-icons/fa";
import { RiUserFill } from "react-icons/ri";

export default function EditPendingOrder({ action, closeModal }) {
    const { rowActionPostLoading } = useSelector((state) => state?.rowActions);
    const t = useTranslations("Orders");
    const tPending = useTranslations("Pending");
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
        rowActionsPostHandler(
            action?.method,
            action?.url?.replace("/api", ""),
            { id: action?.payload?.id, shipping_address: { ...data } },
            // { ...action?.payload, ...data },
            action
        );
    }

    return (
        <>
            <header className="pb-5 text-center">
                <h5>{t("editOrder")}</h5>
            </header>
            <form onSubmit={handleSubmit(submitCustomControlForm)} noValidate className="pt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
                {action?.payload?.shipping_address?.address1 && (
                    <div className="flex flex-col gap-2">
                        <Input
                            startContent={<FaMapMarkerAlt size={15} className="text-muted-2x" />}
                            label={tPending("address1Label")}
                            type="text"
                            placeholder={`${tPending("enter")} ${tPending("address1Label")}`}
                            variant="bordered"
                            size="md"
                            labelPlacement="outside"
                            defaultValue={action?.payload?.shipping_address?.address1}
                            {...requiredField}
                            {...register("address1", {
                                required: {
                                    value: true,
                                    message: tPending("fieldRequired"),
                                },
                            })}
                        />
                        {errors?.address1 && <InvalidFeedback error={errors?.address1?.message} />}
                    </div>
                )}

                {action?.payload?.shipping_address?.address2 && (
                    <div className="flex flex-col gap-2">
                        <Input
                            startContent={<FaMapMarkerAlt size={15} className="text-muted-2x" />}
                            label={tPending("address2Label")}
                            type="text"
                            placeholder={`${tPending("enter")} ${tPending("address2Label")}`}
                            variant="bordered"
                            size="md"
                            labelPlacement="outside"
                            defaultValue={action?.payload?.shipping_address?.address2}
                            {...requiredField}
                            {...register("address2", {
                                required: {
                                    value: true,
                                    message: tPending("fieldRequired"),
                                },
                            })}
                        />
                        {errors?.address2 && <InvalidFeedback error={errors?.address2?.message} />}
                    </div>
                )}

                {action?.payload?.shipping_address?.company && (
                    <div className="flex flex-col gap-2">
                        <Input
                            startContent={<FaBuilding size={15} className="text-muted-2x" />}
                            label={tPending("companyLabel")}
                            type="text"
                            placeholder={`${tPending("enter")} ${tPending("companyLabel")}`}
                            variant="bordered"
                            size="md"
                            labelPlacement="outside"
                            defaultValue={action?.payload?.shipping_address?.company}
                            {...requiredField}
                            {...register("company", {
                                required: {
                                    value: true,
                                    message: tPending("fieldRequired"),
                                },
                            })}
                        />
                        {errors?.company && <InvalidFeedback error={errors?.company?.message} />}
                    </div>
                )}

                {action?.payload?.shipping_address?.country && (
                    <div className="flex flex-col gap-2">
                        <Input
                            startContent={<FaGlobeAsia size={15} className="text-muted-2x" />}
                            label={tPending("countryLabel")}
                            type="text"
                            placeholder={`${tPending("enter")} ${tPending("countryLabel")}`}
                            variant="bordered"
                            size="md"
                            labelPlacement="outside"
                            defaultValue={action?.payload?.shipping_address?.country}
                            {...requiredField}
                            {...register("country", {
                                required: {
                                    value: true,
                                    message: tPending("fieldRequired"),
                                },
                            })}
                        />
                        {errors?.country && <InvalidFeedback error={errors?.country?.message} />}
                    </div>
                )}
                {action?.payload?.shipping_address?.country_code && (
                    <div className="flex flex-col gap-2">
                        <Input
                            startContent={<FaGlobeAsia size={15} className="text-muted-2x" />}
                            label={tPending("countryCodeLabel")}
                            type="text"
                            placeholder={`${tPending("enter")} ${tPending("countryCodeLabel")}`}
                            variant="bordered"
                            size="md"
                            labelPlacement="outside"
                            defaultValue={action?.payload?.shipping_address?.country_code}
                            {...requiredField}
                            {...register("country_code", {
                                required: {
                                    value: true,
                                    message: tPending("fieldRequired"),
                                },
                            })}
                        />
                        {errors?.country_code && <InvalidFeedback error={errors?.country_code?.message} />}
                    </div>
                )}

                {action?.payload?.shipping_address?.state && (
                    <div className="flex flex-col gap-2">
                        <Input
                            startContent={<FaGlobeAsia size={15} className="text-muted-2x" />}
                            label={tPending("stateLabel")}
                            type="text"
                            placeholder={`${tPending("enter")} ${tPending("stateLabel")}`}
                            variant="bordered"
                            size="md"
                            labelPlacement="outside"
                            defaultValue={action?.payload?.shipping_address?.state}
                            {...requiredField}
                            {...register("state", {
                                required: {
                                    value: true,
                                    message: tPending("fieldRequired"),
                                },
                            })}
                        />
                        {errors?.state && <InvalidFeedback error={errors?.state?.message} />}
                    </div>
                )}

                {action?.payload?.shipping_address?.state_code && (
                    <div className="flex flex-col gap-2">
                        <Input
                            startContent={<FaGlobeAsia size={15} className="text-muted-2x" />}
                            label={tPending("stateCodeLabel")}
                            type="text"
                            placeholder={`${tPending("enter")} ${tPending("stateCodeLabel")}`}
                            variant="bordered"
                            size="md"
                            labelPlacement="outside"
                            defaultValue={action?.payload?.shipping_address?.state_code}
                            {...requiredField}
                            {...register("state_code", {
                                required: {
                                    value: true,
                                    message: tPending("fieldRequired"),
                                },
                            })}
                        />
                        {errors?.state_code && <InvalidFeedback error={errors?.state_code?.message} />}
                    </div>
                )}

                {action?.payload?.shipping_address?.city && (
                    <div className="flex flex-col gap-2">
                        <Input
                            startContent={<FaGlobeAsia size={15} className="text-muted-2x" />}
                            label={tPending("cityLabel")}
                            type="text"
                            placeholder={`${tPending("enter")} ${tPending("cityLabel")}`}
                            variant="bordered"
                            size="md"
                            labelPlacement="outside"
                            defaultValue={action?.payload?.shipping_address?.city}
                            {...requiredField}
                            {...register("city", {
                                required: {
                                    value: true,
                                    message: tPending("fieldRequired"),
                                },
                            })}
                        />
                        {errors?.city && <InvalidFeedback error={errors?.city?.message} />}
                    </div>
                )}

                {action?.payload?.shipping_address?.zip && (
                    <div className="flex flex-col gap-2">
                        <Input
                            startContent={<FaGlobeAsia size={15} className="text-muted-2x" />}
                            label={tPending("postalCodeLabel")}
                            type="text"
                            placeholder={`${tPending("enter")} ${tPending("postalCodeLabel")}`}
                            variant="bordered"
                            size="md"
                            labelPlacement="outside"
                            defaultValue={action?.payload?.shipping_address?.zip}
                            {...requiredField}
                            {...register("zip", {
                                required: {
                                    value: true,
                                    message: tPending("fieldRequired"),
                                },
                            })}
                        />
                        {errors?.zip && <InvalidFeedback error={errors?.zip?.message} />}
                    </div>
                )}

                {action?.payload?.shipping_address?.email && (
                    <div className="flex flex-col gap-2">
                        <Input
                            startContent={<FaEnvelope size={15} className="text-muted-2x" />}
                            label={tPending("emailAddressLabel")}
                            type="text"
                            placeholder={`${tPending("enter")} ${tPending("emailAddressLabel")}`}
                            variant="bordered"
                            size="md"
                            labelPlacement="outside"
                            defaultValue={action?.payload?.shipping_address?.email}
                            {...requiredField}
                            {...register("email", {
                                required: {
                                    value: true,
                                    message: tPending("fieldRequired"),
                                },
                            })}
                        />
                        {errors?.email && <InvalidFeedback error={errors?.email?.message} />}
                    </div>
                )}

                {action?.payload?.shipping_address?.first_name && (
                    <div className="flex flex-col gap-2">
                        <Input
                            startContent={<RiUserFill size={15} className="text-muted-2x" />}
                            label={tPending("firstNameLabel")}
                            type="text"
                            placeholder={`${tPending("enter")} ${tPending("firstNameLabel")}`}
                            variant="bordered"
                            size="md"
                            labelPlacement="outside"
                            defaultValue={action?.payload?.shipping_address?.first_name}
                            {...requiredField}
                            {...register("first_name", {
                                required: {
                                    value: true,
                                    message: tPending("fieldRequired"),
                                },
                            })}
                        />
                        {errors?.first_name && <InvalidFeedback error={errors?.first_name?.message} />}
                    </div>
                )}
                {action?.payload?.shipping_address?.first_name && (
                    <div className="flex flex-col gap-2">
                        <Input
                            startContent={<RiUserFill size={15} className="text-muted-2x" />}
                            label={tPending("lastNameLabel")}
                            type="text"
                            placeholder={`${tPending("enter")} ${tPending("lastNameLabel")}`}
                            variant="bordered"
                            size="md"
                            labelPlacement="outside"
                            defaultValue={action?.payload?.shipping_address?.last_name}
                            {...requiredField}
                            {...register("last_name", {
                                required: {
                                    value: true,
                                    message: tPending("fieldRequired"),
                                },
                            })}
                        />
                        {errors?.last_name && <InvalidFeedback error={errors?.last_name?.message} />}
                    </div>
                )}

                <div className="flex flex-col gap-2 lg:col-span-2">
                    <Input
                        startContent={<FaMobileButton size={15} className="text-muted-2x" />}
                        label={tPending("phoneLabel")}
                        type="text"
                        placeholder={`${tPending("enter")} ${tPending("phoneLabel")}`}
                        variant="bordered"
                        size="md"
                        labelPlacement="outside"
                        defaultValue={action?.payload?.shipping_address?.phone}
                        {...requiredField}
                        {...register("phone", {
                            required: {
                                value: true,
                                message: "This field is required",
                            },
                        })}
                    />
                    {errors?.phone && <InvalidFeedback error={errors?.phone?.message} />}
                </div>

                <div className="lg:col-span-2">
                    <Button variant="flat" color="primary" size="md" fullWidth type="submit" isLoading={rowActionPostLoading}>
                        {t("editOrder")}
                    </Button>
                </div>
            </form>
        </>
    );
}

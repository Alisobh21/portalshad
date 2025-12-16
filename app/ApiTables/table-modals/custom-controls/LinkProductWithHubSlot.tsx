"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSelector } from "react-redux";
import { LuChevronsUpDown } from "react-icons/lu";
import { MdOutlineFlipToBack, MdWarehouse } from "react-icons/md";
import { TbPencilCheck } from "react-icons/tb";
import { HiBackspace } from "react-icons/hi2";
import { AiOutlineProduct } from "react-icons/ai";
import useUtilsProvider from "../../table-providers/useUtilsProvider";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/ui/custom/button";

interface LinkProductWithHubSlotProps {
    action: {
        method: string;
        url: {
            api: string;
        };
        payload: {
            availableSlots: Array<{
                id: number;
                location: string;
            }>;
            totalProductQuantity: number | null;
        };
    };
    closeModal: () => void;
}

const formSchema = z.object({
    slotId: z.string().min(1, "Please choose slot"),
    product_quantity: z.string().nonempty("Please enter a valid quantity"),
});

export default function LinkProductWithHubSlot({ action, closeModal }: LinkProductWithHubSlotProps) {
    const { rowActionPostLoading } = useSelector((state: any) => state?.rowActions);
    const { rowActionsPostHandler } = useUtilsProvider();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            slotId: "",
            product_quantity: "",
        },
    });

    function onSubmit(data: z.infer<typeof formSchema>) {
        rowActionsPostHandler(
            action?.method,
            action?.url?.api?.replace("/api", ""),
            { ...action?.payload, ...data, slotId: Number(data?.slotId), product_quantity: Number(data?.product_quantity) },
            action as any
        );
    }

    return (
        <>
            <header className="pb-5 text-center">
                <h5 className="font-bold text-xl">Link product to available slot</h5>
            </header>

            <Form {...form}>
                <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <FormField
                        control={form.control}
                        name="slotId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Slot</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Choose slot" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {action?.payload?.availableSlots?.map((slot) => (
                                            <SelectItem key={slot?.id} value={String(slot.id)}>
                                                {slot?.location}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="product_quantity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Quantity</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder={`Choose Quantity. ${
                                            action?.payload?.totalProductQuantity ? `max ${action?.payload?.totalProductQuantity}` : ""
                                        }`}
                                        min={1}
                                        max={action?.payload?.totalProductQuantity || undefined}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <LoadingButton variant="gradient" type="submit" isLoading={rowActionPostLoading} className="w-full">
                            <TbPencilCheck className="mr-2 h-4 w-4" />
                            Save Changes
                        </LoadingButton>

                        <Button type="button" variant="outline" onClick={closeModal} className="w-full">
                            <MdOutlineFlipToBack className="mr-2 h-4 w-4" />
                            Dismiss
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
}

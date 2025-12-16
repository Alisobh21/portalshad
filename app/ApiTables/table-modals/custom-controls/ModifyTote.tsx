"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useSelector } from "react-redux";
import { HiBackspace } from "react-icons/hi2";
import { TbPencilCheck } from "react-icons/tb";
import { FaBoxArchive } from "react-icons/fa6";
import useUtilsProvider from "../../table-providers/useUtilsProvider";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MdOutlineFlipToBack } from "react-icons/md";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { store } from "@/store/store";

interface ModifyToteProps {
    action: {
        method: string;
        url: {
            api: string;
        };
        payload: {
            tote_number?: number;
            barcode_value?: string;
            hub_id?: number;
        };
    };
    closeModal: () => void;
}

const formSchema = z.object({
    tote_number: z.string().nonempty("Tote number must be greater than 0"),
    barcode_value: z.string().optional(),
    hub_id: z.string().nonempty("Hub is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ModifyTote({ action, closeModal }: ModifyToteProps) {
    const { rowActionPostLoading } = useSelector((state: any) => state?.rowActions);
    const { rowActionsPostHandler } = useUtilsProvider();
    const hubs = store.getState().hubs.hubs;
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tote_number: action?.payload?.tote_number?.toString() || "",
            barcode_value: action?.payload?.barcode_value || "",
            hub_id: action?.payload?.hub_id?.toString() || "",
        },
    });

    function onSubmit(data: FormValues) {
        rowActionsPostHandler(action?.method, action?.url?.api?.replace("/api", ""), { ...action?.payload, ...data }, action as any);
    }

    return (
        <>
            <header className="pb-5 text-center">
                <h5 className="font-bold text-xl">Update Tote</h5>
            </header>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <FormField
                        control={form.control}
                        name="tote_number"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tote Number</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Enter tote number"
                                        {...field}
                                        onChange={field.onChange}
                                        icon={<FaBoxArchive className="h-4 w-4" />}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="barcode_value"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Barcode Value</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Barcode Value" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="hub_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Hub</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Choose a hub" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {hubs?.map((hub: any) => (
                                                <SelectItem key={hub?.id} value={String(hub?.id)}>
                                                    {hub?.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <Button type="submit" variant="default" className="w-full" disabled={rowActionPostLoading}>
                            <TbPencilCheck className="mr-2 h-4 w-4" />
                            Save Changes
                        </Button>

                        <Button type="button" variant="outline" className="w-full" onClick={closeModal}>
                            <MdOutlineFlipToBack className="mr-2 h-4 w-4" />
                            Dismiss
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
}

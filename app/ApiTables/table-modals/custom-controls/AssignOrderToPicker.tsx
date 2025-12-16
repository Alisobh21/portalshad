"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useSelector } from "react-redux";
import { HiBackspace } from "react-icons/hi2";
import { TbPencilCheck } from "react-icons/tb";
import useUtilsProvider from "../../table-providers/useUtilsProvider";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Select, SelectItem, SelectContent, SelectValue, SelectTrigger } from "@/components/ui/select";
import { MdOutlineFlipToBack } from "react-icons/md";

interface ModifyToteProps {
    action: {
        method: string;
        url: {
            api: string;
        };
        payload: {
            picker_id?: string;
            pickers?: Array<{
                id: number;
                first_name: string;
                last_name: string;
            }>;
        };
    };
    closeModal: () => void;
}

const formSchema = z.object({
    picker_id: z.string().nonempty("Tote number must be greater than 0"),
});

type FormValues = z.infer<typeof formSchema>;

export default function AssignOrderToPicker({ action, closeModal }: ModifyToteProps) {
    const { rowActionPostLoading } = useSelector((state: any) => state?.rowActions);
    const { rowActionsPostHandler } = useUtilsProvider();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            picker_id: action?.payload?.picker_id || "",
        },
    });

    function onSubmit(data: FormValues) {
        rowActionsPostHandler(action?.method, action?.url?.api?.replace("/api", ""), { ...action?.payload, ...data }, action as any);
    }

    return (
        <>
            <header className="pb-5 text-center">
                <h5 className="font-bold text-xl">Assign Order to Picker</h5>
            </header>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <FormField
                        control={form.control}
                        name="picker_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Picker</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Choose picker" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {action?.payload?.pickers?.map((picker: any) => (
                                                <SelectItem key={picker?.id} value={picker?.uid}>
                                                    {picker?.name}
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
                            Assign Order
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

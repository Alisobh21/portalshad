import { useSelector } from "react-redux";
import { FaCircle } from "react-icons/fa";

interface TableColumn {
    type?: string;
    name: string;
    cell: (data: any) => React.ReactNode;
}

interface RootState {
    tableColumns: {
        tableColumns: TableColumn[];
    };
}

interface ExpandedRowProps {
    data: any;
}

function ExpandedRow({ data }: ExpandedRowProps) {
    const { tableColumns } = useSelector((state: RootState) => state.tableColumns);

    return (
        <div className="bg-neutral-100 dark:bg-neutral-800 dark:text-white">
            <div style={{ maxWidth: "500px" }} className="w-full">
                <div className="grid items-center grid-cols-1 lg:grid-cols-12 gap-3 text-end g-4 py-4">
                    {tableColumns?.map((col: TableColumn, index: number) => (
                        <div className={`${col?.type === "actions" ? "lg:col-span-9" : "lg:col-span-6"}`} key={index}>
                            <div className="h-full w-full flex px-3 gap-2 items-start">
                                <FaCircle size={4} className="mt-[5px] text-primary flex-shrink-0" />
                                <div className="w-full">
                                    <h6 className="text-[12px] text-start font-semibold mb-1">{col?.name}</h6>
                                    <div className="text-start">{col?.cell(data)}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ExpandedRow;

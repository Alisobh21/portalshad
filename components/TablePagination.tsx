import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationEllipsis, PaginationPrevious } from "@/components/ui/pagination";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const CustomPagination = ({
    currentPage,
    lastPage,
    onPageChange,
}: {
    currentPage: number;
    lastPage: number;
    totalRecords: number;
    onPageChange: Function;
}) => {

    const getPages = () => {
        const pages = [];

        if (lastPage <= 5) {
            for (let i = 1; i <= lastPage; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, "...", lastPage);
            } else if (currentPage >= lastPage - 2) {
                pages.push(1, "...", lastPage - 3, lastPage - 2, lastPage - 1, lastPage);
            } else {
                pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", lastPage);
            }
        }

        return pages;
    };

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationLink
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) onPageChange(currentPage - 1);
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    >
                        <MdKeyboardArrowLeft className="rtl:rotate-180" />
                    </PaginationLink>
                </PaginationItem>

                {getPages().map((page, idx) => (
                    <PaginationItem key={idx}>
                        {page === "..." ? (
                            <PaginationEllipsis />
                        ) : (
                            <PaginationLink
                                href="#"
                                isActive={page === currentPage}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onPageChange(page);
                                }}
                            >
                                {page}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationLink
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < lastPage) onPageChange(currentPage + 1);
                        }}
                        className={currentPage === lastPage ? "pointer-events-none opacity-50" : ""}
                    >
                        <MdKeyboardArrowRight className="rtl:rotate-180" />
                    </PaginationLink>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

export default CustomPagination;

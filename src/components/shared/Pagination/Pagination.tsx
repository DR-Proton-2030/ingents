import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { PaginationProps } from "@/types/interface/props/pagination.props";

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  className = "",
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const showThreshold = 5;

    if (totalPages <= showThreshold) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "ellipsis", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4 ${className}`}>
      <div className="text-sm text-gray-500 font-medium order-2 sm:order-1">
        Showing <span className="text-gray-900 font-semibold">{startItem}</span> to{" "}
        <span className="text-gray-900 font-semibold">{endItem}</span> of{" "}
        <span className="text-gray-900 font-semibold">{totalItems}</span> results
      </div>

      <div className="flex items-center gap-1.5 order-1 sm:order-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:text-orange-500 hover:border-orange-500/30 disabled:opacity-40 disabled:hover:text-gray-600 disabled:hover:border-gray-200 transition-all duration-200 shadow-sm active:scale-95"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5">
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === "ellipsis" ? (
                <div className="w-10 h-10 flex items-center justify-center text-gray-400">
                  <MoreHorizontal className="w-4 h-4" />
                </div>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 ${
                    currentPage === page
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-orange-500/30 hover:text-orange-500"
                  }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:text-orange-500 hover:border-orange-500/30 disabled:opacity-40 disabled:hover:text-gray-600 disabled:hover:border-gray-200 transition-all duration-200 shadow-sm active:scale-95"
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;

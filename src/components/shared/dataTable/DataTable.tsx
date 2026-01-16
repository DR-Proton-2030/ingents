"use client";

import React from "react";

interface Column<T> {
  title: string;
  render: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyText?: string;
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
}

function DataTable<T>({
  data,
  columns,
  emptyText = "No data found",
  title,
  subtitle,
  headerActions,
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-[0_16px_40px_rgba(0,0,0,0.06)] border border-gray-100">
      {/* Soft gradient cap like the reference */}
      <div className="h-[18px] bg-gradient-to-r from-[#dbe8ff] via-[#f8e3ff] to-[#ffe7d6]" />

      {/* Header bar with title + actions */}
      {(title || headerActions || subtitle) && (
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 pt-6 pb-5">
          <div className="flex flex-col gap-1">
            {title && <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>}
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
          {headerActions && <div className="flex items-center gap-3">{headerActions}</div>}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-800">
          <thead>
            <tr className="border-y border-gray-100 bg-[#f7f9fc]">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500"
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="transition-colors hover:bg-[#f9fbff]"
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-5 align-middle text-[14px] text-gray-700"
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center"
                >
                  <div className="flex flex-col items-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                      <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-600">{emptyText}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      Try adjusting filters or refreshing the page
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with count and pagination */}
      {data.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-6 py-4 text-sm text-gray-600">
          <p>
            Showing <span className="font-semibold text-gray-800">{data.length}</span> {data.length === 1 ? "organizer" : "organizers"}
          </p>
          <div className="flex items-center gap-2">
            <button className="rounded-xl border border-gray-200 px-4 py-2 font-semibold text-gray-400 transition-colors hover:bg-gray-50 disabled:opacity-60" disabled>
              Previous
            </button>
            <button className="rounded-xl border border-gray-200 px-4 py-2 font-semibold text-gray-400 transition-colors hover:bg-gray-50 disabled:opacity-60" disabled>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;

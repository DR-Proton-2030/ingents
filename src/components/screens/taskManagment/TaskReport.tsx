"use client";
import React from "react";
import { Task as TaskType } from "@/types/interface/task.interface";
import { formatDate } from "@/lib/utils";
import { TaskReportProps } from "@/types/interface/props/taskReport.props";

export const TaskReport = React.forwardRef<HTMLDivElement, TaskReportProps>(
  ({ tasks, title = "Task Management Report" }, ref) => {
    return (
      <div ref={ref} className="p-8 bg-white text-black font-sans min-h-screen">
        <style>{`
          @page {
            margin: 10mm;
          }
          @media print {
            body { 
              background: white !important;
              -webkit-print-color-adjust: exact;
            }
          }
        `}</style>
        <div className="flex justify-between items-center mb-6 border-b-2 border-orange-500 pb-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2 uppercase italic">{title}</h1>
            <p className="text-gray-500 text-sm font-bold tracking-widest uppercase">Generated on: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-black text-orange-500 tracking-tighter uppercase italic">Total Tasks: {tasks.length}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-y border-gray-200">
                <th className="py-4 px-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest italic w-2/5">Task Detail</th>
                <th className="py-4 px-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Status</th>
                <th className="py-4 px-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Priority</th>
                <th className="py-4 px-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest italic text-right">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={task._id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="py-6 px-4">
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-black text-gray-800 tracking-tight leading-none italic">{task.title}</span>
                      {task.description && (
                         <span className="text-[11px] text-gray-500 leading-relaxed max-w-sm line-clamp-2 italic font-medium">
                            {task.description}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-6 px-4">
                    <span className={`text-[10px] font-black uppercase tracking-widest italic px-2.5 py-1 rounded-full border ${
                      task.status === 'completed' || task.phase_info?.name?.toLowerCase() === 'completed'
                        ? 'bg-green-50 text-green-600 border-green-100' 
                        : 'bg-orange-50 text-orange-600 border-orange-100'
                    }`}>
                      {task.phase_info?.name || task.status?.replace('-', ' ') || 'Backlog'}
                    </span>
                  </td>
                  <td className="py-6 px-4">
                    <span className={`text-[10px] font-black uppercase tracking-widest italic ${
                      task.priority === 'urgent' || task.priority === 'high' ? 'text-red-500' :
                      task.priority === 'normal' ? 'text-orange-500' : 'text-blue-500'
                    }`}>
                      {task.priority || '—'}
                    </span>
                  </td>
                  <td className="py-6 px-4 text-right">
                    <span className="text-[11px] font-black text-gray-700 italic">
                      {task.due_date ? formatDate(task.due_date) : "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-16 text-center border-t border-gray-100 pt-8">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] italic leading-relaxed">
            Internal Document • Ingents AI • Confidental
          </p>
        </div>
      </div>
    );
  }
);

TaskReport.displayName = "TaskReport";

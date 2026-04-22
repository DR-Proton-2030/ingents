import React from "react";
import { FileText } from "lucide-react";
import { File } from "@solar-icons/react";
import { DashboardFileItem } from "./DashboardFileItem";

interface DashboardDriveProps {
    files: Array<{ name: string; when: string }>;
    newFilesCount: number;
}

export const DashboardDrive: React.FC<DashboardDriveProps> = ({ files, newFilesCount }) => {
    return (
        <div className="p-6 bg-white rounded-3xl shadow-xl shadow-gray-100 h-96 flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Project Drive</h2>
                    <p className="text-xs text-gray-400 mt-1">
                        {newFilesCount} new files added today
                    </p>
                </div>
                <div className="h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer">
                    <FileText className="h-5 w-5" />
                </div>
            </div>

            <div className="space-y-3 flex-grow overflow-y-auto pr-1 custom-scrollbar">
                {files.length > 0 ? (
                    files.map((file) => (
                        <DashboardFileItem key={`${file.name}-${file.when}`} file={file} />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                        <div className="p-4 bg-gray-50 rounded-full mb-3">
                            <File className="h-8 w-8 text-gray-300" />
                        </div>
                        <p className="text-sm text-gray-400">No recent file metadata in tasks.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

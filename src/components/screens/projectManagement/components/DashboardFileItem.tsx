import React from "react";
import { File } from "@solar-icons/react";
import { Clock3 } from "lucide-react";

interface DashboardFileItemProps {
    file: {
        name: string;
        when: string;
    };
}

export const DashboardFileItem: React.FC<DashboardFileItemProps> = ({ file }) => {
    return (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-transparent hover:border-gray-100 hover:bg-gray-50/50 transition-all duration-200">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center">
                    <File className="h-6 w-6" color='#0f4159' strokeWidth={1.5} />
                </div>
                <div>
                    <h4 className="text-[15px] font-semibold text-gray-700">
                        {file.name}
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Modified {file.when}
                    </p>
                </div>
            </div>
            <div className="text-gray-300">
                <Clock3 className="h-5 w-5" />
            </div>
        </div>
    );
};

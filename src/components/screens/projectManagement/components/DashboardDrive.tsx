import React, { useState, useRef } from "react";
import { Upload, FolderOpen } from "lucide-react";
import { File } from "@solar-icons/react";
import { DashboardFileItem } from "./DashboardFileItem";
import { api } from "@/utils/api";
import { toast } from "react-toastify";

interface DashboardDriveProps {
    files: Array<{ name: string; when: string; webViewLink?: string }>;
    newFilesCount: number;
    projectId: string;
}

export const DashboardDrive: React.FC<DashboardDriveProps> = ({ files, newFilesCount, projectId }) => {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setIsUploading(true);
        try {
            // Convert file to base64 for the Drive API
            const reader = new FileReader();
            reader.onload = async () => {
                try {
                    const base64Content = (reader.result as string).split(",")[1];

                    // Try multiple possible Composio action names for Drive upload
                    const UPLOAD_ACTIONS = [
                        "GOOGLEDRIVE_CREATE_FILE",
                        "GOOGLEDRIVE_UPLOAD_FILE",
                        "GOOGLEDRIVE_CREATE_FILE_FROM_TEXT",
                    ];

                    let uploaded = false;
                    for (const actionName of UPLOAD_ACTIONS) {
                        try {
                            await api.integration.executeAction(
                                actionName,
                                {
                                    name: selectedFile.name,
                                    content: base64Content,
                                    mimeType: selectedFile.type || "application/octet-stream",
                                    title: selectedFile.name,
                                    text: base64Content,
                                },
                                projectId
                            );
                            uploaded = true;
                            break;
                        } catch {
                            // Try next action name
                        }
                    }

                    if (uploaded) {
                        toast.success(`"${selectedFile.name}" uploaded to Drive`);
                    } else {
                        toast.error("Upload failed. Google Drive upload action not available.");
                    }
                } catch (error) {
                    console.error("Drive upload failed:", error);
                    toast.error("Upload failed. Make sure Google Drive is connected.");
                } finally {
                    setIsUploading(false);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                }
            };
            reader.onerror = () => {
                toast.error("Could not read the file.");
                setIsUploading(false);
            };
            reader.readAsDataURL(selectedFile);
        } catch (error) {
            console.error("File reading failed:", error);
            toast.error("Could not process the file.");
            setIsUploading(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-3xl shadow-xl shadow-gray-100 h-96 flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Project Drive</h2>
                    <p className="text-xs text-gray-400 mt-1">
                        {newFilesCount} new file{newFilesCount !== 1 ? "s" : ""} added today
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleUploadClick}
                        disabled={isUploading}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isUploading ? (
                            <>
                                <div className="h-3.5 w-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="h-3.5 w-3.5" />
                                Upload
                            </>
                        )}
                    </button>
                    <div className="h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer">
                        <FolderOpen className="h-5 w-5" />
                    </div>
                </div>
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
            />

            <div className="space-y-1 flex-grow overflow-y-auto pr-1 custom-scrollbar">
                {files.length > 0 ? (
                    files.map((file) => (
                        <DashboardFileItem key={`${file.name}-${file.when}`} file={file} />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                        <div className="p-4 bg-gray-50 rounded-full mb-3">
                            <File className="h-8 w-8 text-gray-300" />
                        </div>
                        <p className="text-sm text-gray-400">No recent files.</p>
                        <button
                            onClick={handleUploadClick}
                            className="mt-3 text-xs text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1"
                        >
                            <Upload className="h-3.5 w-3.5" />
                            Upload your first file
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

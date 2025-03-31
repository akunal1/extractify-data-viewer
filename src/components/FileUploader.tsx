
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload, isLoading }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileUpload(acceptedFiles[0]);
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
    disabled: isLoading
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
        isDragActive
          ? "border-extractify-primary bg-extractify-primary/10"
          : "border-gray-300 hover:border-extractify-primary hover:bg-gray-50"
      } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-4">
        <div className={`p-4 rounded-full bg-extractify-primary/10 ${isDragActive ? "animate-pulse-scale" : ""}`}>
          <Upload className="h-8 w-8 text-extractify-primary" />
        </div>
        <div>
          <p className="text-lg font-medium text-gray-700">
            {isDragActive ? "Drop the Excel file here" : "Drag & drop an Excel file here"}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            or
          </p>
          <Button 
            variant="outline" 
            className="mt-2 border-extractify-primary text-extractify-primary hover:bg-extractify-primary hover:text-white"
            disabled={isLoading}
          >
            Browse files
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Supports .xlsx and .xls files
        </p>
      </div>
    </div>
  );
};

export default FileUploader;

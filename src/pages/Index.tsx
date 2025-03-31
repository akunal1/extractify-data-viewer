
import React, { useState } from "react";
import FileUploader from "@/components/FileUploader";
import ExtractedData, { ExtractedItem } from "@/components/ExtractedData";
import { parseExcelFile } from "@/utils/excelParser";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet } from "lucide-react";

const Index = () => {
  const [extractedData, setExtractedData] = useState<ExtractedItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setFileName(file.name);
    
    try {
      const data = await parseExcelFile(file);
      setExtractedData(data);
      
      toast({
        title: "Success!",
        description: `Extracted ${data.length} items from "${file.name}"`,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error parsing Excel file:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to parse Excel file",
        variant: "destructive",
        duration: 5000,
      });
      setFileName(null);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToJSON = () => {
    if (extractedData.length === 0) return;
    
    const jsonString = JSON.stringify(extractedData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName ? `${fileName.split(".")[0]}-extracted.json` : "extracted-data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetData = () => {
    setExtractedData([]);
    setFileName(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FileSpreadsheet className="h-8 w-8 mr-2 text-extractify-primary" />
              Extractify
            </h1>
            <p className="text-sm text-gray-500">Excel Data Extractor</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {extractedData.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Excel File</h2>
            <p className="text-gray-600 mb-6">
              Upload an Excel file (.xlsx, .xls) to extract data from the "title" and "solution" columns.
            </p>
            <FileUploader onFileUpload={handleFileUpload} isLoading={isLoading} />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">File: {fileName}</h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Showing {extractedData.length} extracted items
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    className="border-extractify-primary text-extractify-primary hover:bg-extractify-primary hover:text-white"
                    onClick={exportToJSON}
                  >
                    <Download className="h-4 w-4 mr-2" /> Export JSON
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={resetData}
                  >
                    Upload New File
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <ExtractedData data={extractedData} />
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            Extractify - Extract what matters from your Excel files
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;


import React from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export interface ExtractedItem {
  title: string;
  solution: string;
}

interface ExtractedDataProps {
  data: ExtractedItem[];
}

const ExtractedData: React.FC<ExtractedDataProps> = ({ data }) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copied!",
          description: `${fieldName} copied to clipboard.`,
          duration: 2000,
        });
      },
      (err) => {
        toast({
          title: "Failed to copy",
          description: "An error occurred while copying.",
          variant: "destructive",
          duration: 2000,
        });
        console.error("Could not copy text: ", err);
      }
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Extracted Data ({data.length} items)
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
        {data.map((item, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="flex justify-between items-start">
                  <div className="flex-grow">
                    <h3 className="text-sm font-medium text-gray-500">Title</h3>
                    <p className="mt-1 text-gray-900">{item.title || "N/A"}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="ml-2 flex-shrink-0 h-8 w-8"
                    onClick={() => copyToClipboard(item.title, "Title")}
                    title="Copy title"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-start">
                  <div className="flex-grow">
                    <h3 className="text-sm font-medium text-gray-500">Solution</h3>
                    <p className="mt-1 text-gray-900 whitespace-pre-wrap">{item.solution || "N/A"}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="ml-2 flex-shrink-0 h-8 w-8"
                    onClick={() => copyToClipboard(item.solution, "Solution")}
                    title="Copy solution"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExtractedData;

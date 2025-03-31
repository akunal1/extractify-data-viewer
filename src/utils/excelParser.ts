
import * as XLSX from "xlsx";

export interface ExtractedItem {
  title: string;
  solution: string;
}

export const parseExcelFile = async (file: File): Promise<ExtractedItem[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        // Get first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert sheet to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Find title and solution column indices (case insensitive)
        const headerRow = jsonData[0] as string[];
        const titleColumnIndex = headerRow.findIndex(
          (header) => header?.toString().toLowerCase() === "title"
        );
        const solutionColumnIndex = headerRow.findIndex(
          (header) => header?.toString().toLowerCase() === "solution"
        );

        if (titleColumnIndex === -1 && solutionColumnIndex === -1) {
          reject(new Error("Could not find 'title' or 'solution' columns in the Excel file"));
          return;
        }

        // Extract data from the specified columns
        const extractedData: ExtractedItem[] = [];
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as string[];
          if (!row || row.length === 0) continue;

          const title = titleColumnIndex !== -1 ? row[titleColumnIndex]?.toString() || "" : "";
          const solution = solutionColumnIndex !== -1 ? row[solutionColumnIndex]?.toString() || "" : "";

          // Skip rows where both title and solution are empty
          if (title || solution) {
            extractedData.push({ title, solution });
          }
        }

        resolve(extractedData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsArrayBuffer(file);
  });
};

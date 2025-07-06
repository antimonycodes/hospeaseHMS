// utils/exportUtils.ts
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

// Extend jsPDF type to include autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export interface ExportColumn {
  key: string;
  label: string;
  width?: number;
  formatter?: (value: any) => string;
}

export interface ExportData {
  [key: string]: any;
}

export interface ExportOptions {
  filename?: string;
  title?: string;
  columns: ExportColumn[];
  data: ExportData[];
  additionalInfo?: {
    totalRecords?: number;
    dateRange?: string;
    filters?: Record<string, string>;
  };
}

// Helper function to format data for export
const formatDataForExport = (
  data: ExportData[],
  columns: ExportColumn[]
): string[][] => {
  const headers = columns.map((col) => col.label);
  const rows = data.map((row) =>
    columns.map((col) => {
      const value = row[col.key];
      if (col.formatter) {
        return col.formatter(value);
      }

      // Handle different data types
      if (value === null || value === undefined) return "N/A";
      if (typeof value === "object") {
        // Handle nested objects (like patient names)
        if (value.first_name && value.last_name) {
          return `${value.first_name} ${value.last_name}`;
        }
        return JSON.stringify(value);
      }
      if (Array.isArray(value)) {
        // Handle arrays (like departments)
        return value.map((item) => item.name || item).join(", ");
      }
      return String(value);
    })
  );

  return [headers, ...rows];
};

// CSV Export
export const exportToCSV = ({
  filename = "export",
  data,
  columns,
}: ExportOptions): void => {
  const csvData = formatDataForExport(data, columns);
  const csvContent = csvData
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Excel Export
export const exportToExcel = ({
  filename = "export",
  data,
  columns,
  title,
  additionalInfo,
}: ExportOptions): void => {
  const formattedData = formatDataForExport(data, columns);

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([]);

  let currentRow = 0;

  // Add title if provided
  if (title) {
    XLSX.utils.sheet_add_aoa(ws, [[title]], { origin: `A${currentRow + 1}` });
    currentRow += 2;
  }

  // Add additional info if provided
  if (additionalInfo) {
    const infoRows: string[][] = [];
    if (additionalInfo.totalRecords) {
      infoRows.push(["Total Records:", additionalInfo.totalRecords.toString()]);
    }
    if (additionalInfo.dateRange) {
      infoRows.push(["Date Range:", additionalInfo.dateRange]);
    }
    if (additionalInfo.filters) {
      Object.entries(additionalInfo.filters).forEach(([key, value]) => {
        if (value) {
          infoRows.push([`${key}:`, value]);
        }
      });
    }

    if (infoRows.length > 0) {
      XLSX.utils.sheet_add_aoa(ws, infoRows, { origin: `A${currentRow + 1}` });
      currentRow += infoRows.length + 1;
    }
  }

  // Add table data
  XLSX.utils.sheet_add_aoa(ws, formattedData, { origin: `A${currentRow + 1}` });

  // Style the worksheet
  const range = XLSX.utils.decode_range(ws["!ref"] || "A1");

  // Set column widths
  const colWidths = columns.map((col) => ({ width: col.width || 20 }));
  ws["!cols"] = colWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, "Data");

  // Save file
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

// PDF Export
export const exportToPDF = ({
  filename = "export",
  data,
  columns,
  title,
  additionalInfo,
}: ExportOptions): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  let currentY = 20;

  // Add title
  if (title) {
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(title, pageWidth / 2, currentY, { align: "center" });
    currentY += 20;
  }

  // Add additional info
  if (additionalInfo) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    if (additionalInfo.totalRecords) {
      doc.text(`Total Records: ${additionalInfo.totalRecords}`, 20, currentY);
      currentY += 10;
    }

    if (additionalInfo.dateRange) {
      doc.text(`Date Range: ${additionalInfo.dateRange}`, 20, currentY);
      currentY += 10;
    }

    if (additionalInfo.filters) {
      const activeFilters = Object.entries(additionalInfo.filters)
        .filter(([_, value]) => value)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");

      if (activeFilters) {
        doc.text(`Filters: ${activeFilters}`, 20, currentY);
        currentY += 10;
      }
    }

    currentY += 10;
  }

  // Prepare table data
  const tableData = formatDataForExport(data, columns);
  const headers = tableData[0];
  const rows = tableData.slice(1);

  // Create table
  doc.autoTable({
    head: [headers],
    body: rows,
    startY: currentY,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { top: 20, right: 20, bottom: 20, left: 20 },
    columnStyles: columns.reduce((acc, col, index) => {
      acc[index] = { cellWidth: col.width || "auto" };
      return acc;
    }, {} as Record<number, any>),
  });

  // Save PDF
  doc.save(`${filename}.pdf`);
};

// Main export function that handles all formats
export const exportData = (
  format: "csv" | "excel" | "pdf",
  options: ExportOptions
): void => {
  const timestamp = new Date().toISOString().split("T")[0];
  const defaultFilename = `${options.filename || "export"}_${timestamp}`;

  const exportOptions = {
    ...options,
    filename: defaultFilename,
  };

  switch (format) {
    case "csv":
      exportToCSV(exportOptions);
      break;
    case "excel":
      exportToExcel(exportOptions);
      break;
    case "pdf":
      exportToPDF(exportOptions);
      break;
    default:
      console.error("Unsupported export format");
  }
};

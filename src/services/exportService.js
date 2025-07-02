import * as XLSX from 'exceljs';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

class ExportService {
  // Export data to CSV
  exportToCSV(data, filename = 'export') {
    try {
      const csv = Papa.unparse(data);
      this.downloadFile(csv, `${filename}.csv`, 'text/csv');
      return { success: true, message: 'CSV exported successfully' };
    } catch (error) {
      console.error('CSV export error:', error);
      return { success: false, error: error.message };
    }
  }

  // Export data to Excel
  async exportToExcel(data, filename = 'export', sheetName = 'Data') {
    try {
      const workbook = new XLSX.Workbook();
      const worksheet = workbook.addWorksheet(sheetName);

      if (data.length > 0) {
        // Add headers
        const headers = Object.keys(data[0]);
        worksheet.addRow(headers);

        // Style headers
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true };
        headerRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF6366F1' }
        };

        // Add data rows
        data.forEach(item => {
          worksheet.addRow(Object.values(item));
        });

        // Auto-fit columns
        worksheet.columns.forEach(column => {
          column.width = 15;
        });
      }

      // Generate buffer and download
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      this.downloadBlob(blob, `${filename}.xlsx`);

      return { success: true, message: 'Excel exported successfully' };
    } catch (error) {
      console.error('Excel export error:', error);
      return { success: false, error: error.message };
    }
  }

  // Export data to JSON
  exportToJSON(data, filename = 'export') {
    try {
      const json = JSON.stringify(data, null, 2);
      this.downloadFile(json, `${filename}.json`, 'application/json');
      return { success: true, message: 'JSON exported successfully' };
    } catch (error) {
      console.error('JSON export error:', error);
      return { success: false, error: error.message };
    }
  }

  // Import CSV data
  importFromCSV(file) {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(new Error('CSV parsing failed: ' + results.errors[0].message));
          } else {
            resolve({
              success: true,
              data: results.data,
              message: `Successfully imported ${results.data.length} records`
            });
          }
        },
        error: (error) => {
          reject(new Error('CSV import failed: ' + error.message));
        }
      });
    });
  }

  // Import Excel data
  async importFromExcel(file) {
    try {
      const workbook = new XLSX.Workbook();
      await workbook.xlsx.load(file);
      
      const worksheet = workbook.getWorksheet(1);
      const data = [];
      
      if (worksheet) {
        const headers = [];
        worksheet.getRow(1).eachCell(cell => {
          headers.push(cell.value);
        });

        worksheet.eachRow((row, rowIndex) => {
          if (rowIndex > 1) { // Skip header row
            const rowData = {};
            row.eachCell((cell, colIndex) => {
              rowData[headers[colIndex - 1]] = cell.value;
            });
            data.push(rowData);
          }
        });
      }

      return {
        success: true,
        data: data,
        message: `Successfully imported ${data.length} records`
      };
    } catch (error) {
      console.error('Excel import error:', error);
      return { success: false, error: error.message };
    }
  }

  // Import JSON data
  importFromJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (Array.isArray(data)) {
            resolve({
              success: true,
              data: data,
              message: `Successfully imported ${data.length} records`
            });
          } else {
            reject(new Error('JSON file must contain an array of objects'));
          }
        } catch (error) {
          reject(new Error('Invalid JSON format: ' + error.message));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  // Export financial report as PDF
  exportFinancialReportPDF(reportData, reportType = 'Financial Report') {
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.text(reportType, 20, 20);
      
      doc.setFontSize(12);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
      
      // Summary section
      if (reportData.summary) {
        doc.setFontSize(16);
        doc.text('Summary', 20, 55);
        
        let yPos = 70;
        Object.entries(reportData.summary).forEach(([key, value]) => {
          doc.setFontSize(12);
          doc.text(`${key}: ${value}`, 20, yPos);
          yPos += 10;
        });
      }

      // Table data
      if (reportData.tableData && reportData.tableData.length > 0) {
        const startY = reportData.summary ? 120 : 70;
        
        doc.autoTable({
          head: [Object.keys(reportData.tableData[0])],
          body: reportData.tableData.map(item => Object.values(item)),
          startY: startY,
          styles: {
            fontSize: 10,
            cellPadding: 3
          },
          headStyles: {
            fillColor: [99, 102, 241],
            textColor: 255
          }
        });
      }

      // Save PDF
      doc.save(`${reportType.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.pdf`);
      
      return { success: true, message: 'PDF report exported successfully' };
    } catch (error) {
      console.error('PDF export error:', error);
      return { success: false, error: error.message };
    }
  }

  // Helper method to download file
  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    this.downloadBlob(blob, filename);
  }

  // Helper method to download blob
  downloadBlob(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // Validate import data structure
  validateImportData(data, requiredFields = []) {
    if (!Array.isArray(data) || data.length === 0) {
      return { valid: false, error: 'Data must be a non-empty array' };
    }

    const firstItem = data[0];
    const missingFields = requiredFields.filter(field => !(field in firstItem));
    
    if (missingFields.length > 0) {
      return { 
        valid: false, 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      };
    }

    return { valid: true };
  }
}

export default new ExportService();
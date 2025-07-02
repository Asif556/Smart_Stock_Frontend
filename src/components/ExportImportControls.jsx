import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  Upload, 
  FileText, 
  File, 
  Database,
  CheckCircle,
  AlertTriangle,
  Loader2,
  X
} from 'lucide-react';
import exportService from '../services/exportService';

const ExportImportControls = ({ data, onImport, filename = 'export' }) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showImportMenu, setShowImportMenu] = useState(false);
  const [importStatus, setImportStatus] = useState('idle');
  const [importMessage, setImportMessage] = useState('');
  const fileInputRef = useRef();

  const handleExport = async (format) => {
    try {
      let result;
      switch (format) {
        case 'csv':
          result = exportService.exportToCSV(data, filename);
          break;
        case 'excel':
          result = await exportService.exportToExcel(data, filename);
          break;
        case 'json':
          result = exportService.exportToJSON(data, filename);
          break;
      }
      
      if (result.success) {
        setShowExportMenu(false);
      }
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImportStatus('loading');
    setImportMessage('Processing file...');

    try {
      let result;
      const fileExtension = file.name.split('.').pop().toLowerCase();

      switch (fileExtension) {
        case 'csv':
          result = await exportService.importFromCSV(file);
          break;
        case 'xlsx':
        case 'xls':
          result = await exportService.importFromExcel(file);
          break;
        case 'json':
          result = await exportService.importFromJSON(file);
          break;
        default:
          throw new Error('Unsupported file format');
      }

      if (result.success) {
        setImportStatus('success');
        setImportMessage(result.message);
        onImport?.(result.data);
      }
    } catch (error) {
      setImportStatus('error');
      setImportMessage(error.message);
    }

    // Reset after 3 seconds
    setTimeout(() => {
      setImportStatus('idle');
      setImportMessage('');
      setShowImportMenu(false);
    }, 3000);

    // Clear file input
    event.target.value = '';
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        {/* Export Button */}
        <div className="relative">
          <motion.button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 border border-green-500 font-semibold transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </motion.button>

          <AnimatePresence>
            {showExportMenu && (
              <motion.div
                className="absolute top-full left-0 mt-2 bg-gray-800 border border-gray-600 shadow-2xl z-50 min-w-48"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-white hover:bg-gray-700 transition-colors"
                >
                  <FileText className="h-4 w-4 text-green-400" />
                  <span>Export as CSV</span>
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-white hover:bg-gray-700 transition-colors"
                >
                  <File className="h-4 w-4 text-blue-400" />
                  <span>Export as Excel</span>
                </button>
                <button
                  onClick={() => handleExport('json')}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-white hover:bg-gray-700 transition-colors"
                >
                  <Database className="h-4 w-4 text-purple-400" />
                  <span>Export as JSON</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Import Button */}
        <div className="relative">
          <motion.button
            onClick={() => setShowImportMenu(!showImportMenu)}
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 border border-blue-500 font-semibold transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Upload className="h-4 w-4" />
            <span>Import</span>
          </motion.button>

          <AnimatePresence>
            {showImportMenu && (
              <motion.div
                className="absolute top-full left-0 mt-2 bg-gray-800 border border-gray-600 shadow-2xl z-50 min-w-48"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-white hover:bg-gray-700 transition-colors"
                >
                  <Upload className="h-4 w-4 text-blue-400" />
                  <span>Import from File</span>
                </button>
                <div className="px-4 py-2 text-xs text-gray-400 border-t border-gray-700">
                  Supports CSV, Excel, and JSON files
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls,.json"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Import Status */}
      <AnimatePresence>
        {importStatus !== 'idle' && (
          <motion.div
            className={`absolute top-full left-0 mt-2 p-4 border shadow-2xl z-50 min-w-80 ${
              importStatus === 'success' 
                ? 'bg-green-600/20 border-green-500 text-green-300'
                : importStatus === 'error'
                ? 'bg-red-600/20 border-red-500 text-red-300'
                : 'bg-blue-600/20 border-blue-500 text-blue-300'
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-3">
              {importStatus === 'loading' && <Loader2 className="h-5 w-5 animate-spin" />}
              {importStatus === 'success' && <CheckCircle className="h-5 w-5" />}
              {importStatus === 'error' && <AlertTriangle className="h-5 w-5" />}
              <span className="font-semibold">{importMessage}</span>
              {importStatus !== 'loading' && (
                <button
                  onClick={() => {
                    setImportStatus('idle');
                    setImportMessage('');
                    setShowImportMenu(false);
                  }}
                  className="ml-auto"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExportImportControls;
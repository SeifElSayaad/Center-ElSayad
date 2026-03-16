import { useState } from 'react';
import apiClient from '../api/apiClient';
import toast from 'react-hot-toast';
import { UploadCloud, FileType, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BulkSync() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setResult(null);

    try {
      const res = await apiClient.post('/admin/products/bulk-sync', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setResult(res.data.result);
      toast.success('Bulk sync completed successfully');
      setFile(null); // Clear file after success
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Bulk sync failed');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const template = `action,name,slug,description,retailPrice,stockQuantity,categoryId,imageUrl\nCREATE,Math Grade 5,math-grade-5,Math textbook,120,50,bk_1,https://example.com/math.jpg\nUPDATE,,math-grade-5,,140,40,,\nDELETE,,old-math-book,,,,,`;
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_sync_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bulk Product Sync</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Upload a CSV file to create, update, or delete products in bulk. Ideal for seasonal catalog updates.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link to="/products" className="text-sm font-medium text-red-600 hover:text-red-500">
            &larr; Back to Products
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg mb-8 transition-colors">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">Upload CSV File</h3>
          
          <div className="max-w-xl flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md relative hover:border-red-400 dark:hover:border-red-500 transition-colors">
            <div className="space-y-1 text-center">
              <UploadCloud className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
              <div className="flex text-sm text-gray-600 dark:text-gray-300 justify-center">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white dark:bg-transparent rounded-md font-medium text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-white dark:focus-within:ring-offset-gray-900 focus-within:ring-red-500 transition-colors"
                >
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" accept=".csv" className="sr-only" onChange={handleFileChange} />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">CSV files only up to 5MB</p>
            </div>
          </div>

          {file && (
            <div className="mt-4 flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md border border-gray-200 dark:border-gray-600">
              <FileType className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 flex-1">{file.name}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-600 ml-3">
                {(file.size / 1024).toFixed(1)} KB
              </span>
            </div>
          )}

          <div className="mt-5 sm:flex sm:items-center">
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              style={{ backgroundColor: file && !loading ? 'var(--color-brand)' : undefined }}
              className={`inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 focus:ring-red-500 sm:w-auto sm:text-sm transition-all ${
                (!file || loading) ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-500 dark:text-gray-400' : 'hover:brightness-90'
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Processing...
                </>
              ) : (
                'Start Sync'
              )}
            </button>
            <button
              onClick={downloadTemplate}
              className="mt-3 sm:mt-0 sm:ml-3 inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 focus:ring-red-500 sm:w-auto sm:text-sm shadow-sm transition-colors"
            >
              Download Template
            </button>
          </div>
        </div>
      </div>

      {result && (
        <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg overflow-hidden transition-colors">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Sync Results</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
              <div className="px-4 py-5 bg-green-50 dark:bg-green-900/20 shadow rounded-lg overflow-hidden sm:p-6 border border-green-100 dark:border-green-800/30">
                <dt className="text-sm font-medium text-green-500 dark:text-green-400 truncate flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" /> Created
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-green-900 dark:text-green-300">{result.created}</dd>
              </div>
              <div className="px-4 py-5 bg-blue-50 dark:bg-blue-900/20 shadow rounded-lg overflow-hidden sm:p-6 border border-blue-100 dark:border-blue-800/30">
                <dt className="text-sm font-medium text-blue-500 dark:text-blue-400 truncate flex items-center">
                  <RefreshCw className="h-4 w-4 mr-2" /> Updated
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-blue-900 dark:text-blue-300">{result.updated}</dd>
              </div>
              <div className="px-4 py-5 bg-red-50 dark:bg-red-900/20 shadow rounded-lg overflow-hidden sm:p-6 border border-red-100 dark:border-red-800/30">
                <dt className="text-sm font-medium text-red-500 dark:text-red-400 truncate flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" /> Deleted
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-red-900 dark:text-red-300">{result.deleted}</dd>
              </div>
            </dl>

            {result.errors && result.errors.length > 0 && (
              <div className="mt-4">
                <h4 className="text-md font-medium text-red-800 dark:text-red-400 mb-2">Errors & Warnings ({result.errors.length})</h4>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-md max-h-64 overflow-y-auto border border-red-200 dark:border-red-800/30">
                  <ul className="divide-y divide-red-200 dark:divide-red-800/30 text-sm text-red-700 dark:text-red-300">
                    {result.errors.map((err: string, idx: number) => (
                      <li key={idx} className="px-4 py-3">{err}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

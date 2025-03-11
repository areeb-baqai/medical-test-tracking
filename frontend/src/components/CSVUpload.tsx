import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

interface CSVUploadProps {
    onUploadSuccess: (response: {
        tests: string[],
        parameters: Record<string, {
            unit: string,
            min: number,
            max: number
        }>
    }) => void;
}

const CSVUpload: React.FC<CSVUploadProps> = ({ onUploadSuccess }) => {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (file.type !== 'text/csv') {
            toast.error('Please upload a CSV file');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/medical-form/upload-csv', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                toast.success('CSV file uploaded successfully');
                onUploadSuccess({
                    tests: response.data.tests,
                    parameters: response.data.parameters
                });
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        } catch (error) {
            toast.error('Failed to upload CSV file');
            console.error('Upload error:', error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                ref={fileInputRef}
                className="hidden"
                id="csv-upload"
            />
            <label
                htmlFor="csv-upload"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium 
                    rounded-lg border border-gray-300 bg-white text-gray-700 
                    hover:bg-gray-50 focus:outline-none focus:ring-2 
                    focus:ring-offset-2 focus:ring-blue-500 cursor-pointer
                    ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {isUploading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Uploading...
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Upload CSV
                    </>
                )}
            </label>
        </div>
    );
};

export default CSVUpload; 
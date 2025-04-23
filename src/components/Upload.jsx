import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const Upload = () => {
  const onDrop = useCallback((acceptedFiles) => {
    console.log('Files uploaded:', acceptedFiles);
    // You can handle uploads here
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    multiple: true,
  });

  return (
    <div className='py-3'>
      <div className="sm:w-[200px] md:w-[400px] h-[842px]  lg:w-[595px] mx-auto border border-blue-500 rounded-lg py-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Upload</h2>
        <div
          {...getRootProps()}
          className="border-2 border-dashed  border-blue-300 rounded-lg p-6 m-6 cursor-pointer hover:border-blue-500 transition"
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-2">
            <img src="/icons/upload-cloud.png" alt="Upload" className="w-10 h-10 opacity-60" />
            <p className="text-gray-700 font-medium">
              Drag & drop files or{' '}
              <span className="text-blue-600 underline cursor-pointer">Browse</span>
            </p>
            <p className="text-xs text-gray-500">
              Supported formats: JPG, PDF, WORD, PPT
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          Tip: You can upload multiple files at once.
        </p>
      </div>
    </div>
  );
};

export default Upload;

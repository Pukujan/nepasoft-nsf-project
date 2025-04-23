import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import UploadNotification from './UploadNotification';

// Constants
const FILE_STATUS = {
  QUEUED: 'queued',
  UPLOADING: 'uploading',
  DONE: 'done',
  CANCELED: 'canceled'
};

const ACCEPTED_FILES = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
};

const getCurrentFileNumber = (files, uploadingIndex) => {
  if (uploadingIndex === null) return 0;
  const nonCanceledFiles = files.filter(f => f.status !== FILE_STATUS.CANCELED);
  const currentFileIndex = nonCanceledFiles.findIndex(f => f === files[uploadingIndex]);
  return currentFileIndex + 1;
};

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [completedFiles, setCompletedFiles] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [showNotification, setShowNotification] = useState(true);
  const [activeInterval, setActiveInterval] = useState(null);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles?.length) {
      console.error('Some files were rejected:', rejectedFiles);
    }

    const newFiles = acceptedFiles.map((file) => ({
      file,
      progress: 0,
      status: FILE_STATUS.QUEUED,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const startUploads = useCallback(() => {
    const hasQueuedFiles = files.some(f => f.status === FILE_STATUS.QUEUED);
    if (hasQueuedFiles && !uploading) {
      setUploading(true);
      uploadNext(0);
    }
  }, [files, uploading]);

  const uploadNext = useCallback((index) => {
    // Show notification when upload starts
    setShowNotification(true);

    const queuedFiles = files.filter((f) => f.status === FILE_STATUS.QUEUED);

    if (index >= queuedFiles.length) {
      setUploading(false);
      setUploadingIndex(null);
      return;
    }

    const actualIndex = files.findIndex((f) => f === queuedFiles[index]);
    setUploadingIndex(actualIndex);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;

      setFiles((prevFiles) => {
        // Check if file was canceled before updating
        if (prevFiles[actualIndex].status === FILE_STATUS.CANCELED) {
          clearInterval(interval);
          return prevFiles;
        }

        const updatedFiles = prevFiles.map((f, i) =>
          i === actualIndex
            ? {
              ...f,
              status: FILE_STATUS.UPLOADING,
              progress: Math.min(progress, 100)
            }
            : f
        );

        if (progress >= 100) {
          clearInterval(interval);
          const completedFiles = updatedFiles.map((f, i) =>
            i === actualIndex
              ? { ...f, status: FILE_STATUS.DONE, progress: 100 }
              : f
          );
          setCompletedFiles(prev => prev + 1);
          setTimeout(() => uploadNext(index + 1), 300);
          return completedFiles;
        }

        return updatedFiles;
      });
    }, 100);

    // Store the interval ID
    setActiveInterval(interval);

    return () => {
      clearInterval(interval);
      setActiveInterval(null);
    };
  }, [files]);

  useEffect(() => {
    if (files.some((f) => f.status === FILE_STATUS.QUEUED)) {
      startUploads();
    }
  }, [files, startUploads]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setUploading(false);
      setUploadingIndex(null);
    };
  }, []);

  const cancelUpload = useCallback((index) => {
    // Clear the active interval if it exists
    if (activeInterval) {
      clearInterval(activeInterval);
      setActiveInterval(null);
    }

    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.map((f, i) =>
        i === index ? { ...f, status: FILE_STATUS.CANCELED, progress: 0 } : f
      );

      const nonCanceled = updatedFiles.filter(f => f.status !== FILE_STATUS.CANCELED).length;
      setTotalFiles(nonCanceled);

      return updatedFiles;
    });

    // If canceling the current uploading file, move to next
    if (index === uploadingIndex) {
      setUploading(false);
      const nextIndex = files
        .filter((f) => f.status !== FILE_STATUS.CANCELED)
        .findIndex((_, i) => i > uploadingIndex);

      if (nextIndex !== -1) {
        uploadNext(nextIndex);
      }
    }
  }, [files, uploadingIndex, activeInterval, uploadNext]);

  const deleteFile = useCallback((index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  }, []);

  const nonCanceledFilesCount = useMemo(() =>
    files.filter(f => f.status !== FILE_STATUS.CANCELED).length,
    [files]
  );

  const allDone = useMemo(() =>
    files.length > 0 && files.every((f) =>
      f.status === FILE_STATUS.DONE || f.status === FILE_STATUS.CANCELED
    ),
    [files]
  );

  useEffect(() => {
    const nonCanceled = files.filter(f => f.status !== FILE_STATUS.CANCELED).length;
    setTotalFiles(nonCanceled);

    // Reset completed files counter when new files are added
    const completed = files.filter(f => f.status === FILE_STATUS.DONE).length;
    setCompletedFiles(completed);
  }, [files]);

  useEffect(() => {
    if (files.some(f => f.status === FILE_STATUS.QUEUED)) {
      setCompletedFiles(0);
    }
  }, [files]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILES,
    multiple: true,
  });

  return (
    <>
      <UploadNotification
        isUploading={uploading}
        totalFiles={totalFiles}
        completedFiles={completedFiles}
        show={showNotification}
        onClose={() => setShowNotification(false)}
      />

      <div className='py-3'>
        <div className="sm:w-[200px] md:w-[400px] lg:w-[595px] mx-auto border border-blue-500 rounded-lg py-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Upload</h2>

          {/* Drag & Drop Area */}
          <div
            {...getRootProps()}
            className="border-2 border-dashed bg-background-blue border-blue-300 rounded-lg p-6 m-6 cursor-pointer hover:border-blue-500 transition"
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center space-y-2">
              <img className="w-20 h-auto" src="/icons/upload-icon.png" alt="Upload" />
              <p className="text-gray-700 font-medium">
                Drag & drop files or{' '}
                <span className="text-primary-color underline cursor-pointer">Browse</span>
              </p>
              <p className="text-xs text-gray-500">
                Supported formats: JPG, PDF, WORD, PPT
              </p>
            </div>
          </div>

          {/* File Upload List */}
          <div className="px-6 space-y-4 text-left">
            {/* Uploading Section */}
            {files.some((f) => f.status === FILE_STATUS.UPLOADING || f.status === FILE_STATUS.QUEUED) && (
              <div>
                <h3 className="text-sm font-semibold mb-2">
                  Uploading - {getCurrentFileNumber(files, uploadingIndex)}/{nonCanceledFilesCount} files
                </h3>
                {files.map((f, i) =>
                  (f.status === FILE_STATUS.UPLOADING || f.status === FILE_STATUS.QUEUED) && (
                    <div
                      key={i}
                      className="border border-gray-300 rounded mb-2 relative bg-white shadow-sm"
                    >
                      <div className="flex justify-between items-center p-2">
                        <p className="text-sm font-medium">{f.file.name}</p>
                        <button
                          onClick={() => cancelUpload(i)}
                          className="text-red-500 text-lg font-bold hover:text-red-700"
                        >
                          ✖
                        </button>
                      </div>
                      <div className="w-full bg-gray-200 h-1 rounded mt-2">
                        <div
                          className={`h-1 rounded ${f.status === FILE_STATUS.UPLOADING ? 'bg-primary-color' : 'bg-gray-300'}`}
                          style={{ width: `${f.progress}%` }}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            {/* Uploaded Section */}
            {files.some((f) => f.status === FILE_STATUS.DONE) && (
              <div>
                <h3 className="text-sm font-semibold mt-4 mb-2">Uploaded</h3>
                {files.map((f, i) =>
                  f.status === FILE_STATUS.DONE && (
                    <div
                      key={i}
                      className="border border-green-500 rounded p-3 relative shadow-sm my-2"
                    >
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium">{f.file.name}</p>
                        <button
                          onClick={() => deleteFile(i)}
                          className="text-red-500 hover:underline"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Tip or Confirm Button */}
          {nonCanceledFilesCount === 0 ? (
            <p className="mt-4 text-sm text-gray-600">
              Tip: You can upload multiple files at once.
            </p>
          ) : (
            <div className="mt-6">
              <button
                disabled={!allDone}
                className={`px-6 py-2 rounded text-white transition ${allDone ? 'bg-primary-color hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                  }`}
              >
                Upload Files
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Upload;
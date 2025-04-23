import React from 'react';

const UploadNotification = ({ isUploading, totalFiles, completedFiles, show, onClose }) => {
  // Don't show notification if hidden or no files
  if (!show || totalFiles === 0) return null;

  const progress = totalFiles > 0 ? Math.floor((completedFiles / totalFiles) * 100) : 0;
  const isComplete = completedFiles === totalFiles;

  return (
    <div className="fixed top-4 right-4 w-80 bg-[#ECB90D] text-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            {isUploading ? (
              <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
            ) : (
              <div className="w-4 h-4 rounded-full bg-white" />
            )}
            <span >
              {isComplete ? 'Upload Complete' : 'Upload in Progress'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-color transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>


      </div>
    </div>
  );
};

export default UploadNotification;
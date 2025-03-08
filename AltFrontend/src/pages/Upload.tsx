import React, { useState, useCallback } from 'react';
import { Upload as UploadIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const Upload = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white">Upload Your Photo</h1>
          <p className="mt-4 text-gray-400">Share your best moments with the world</p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center ${
              isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700'
            } bg-gray-800/50`}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {selectedImage ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={selectedImage}
                  alt="Uploaded preview"
                  className="max-h-96 mx-auto rounded-lg shadow-lg"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Remove Image
                </button>
              </motion.div>
            ) : (
              <div>
                <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-300">
                  Drag and drop your image here, or{' '}
                  <label className="text-blue-400 hover:text-blue-300 cursor-pointer">
                    browse
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileSelect}
                    />
                  </label>
                </p>
                <p className="mt-2 text-sm text-gray-500">PNG, JPG up to 10MB</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
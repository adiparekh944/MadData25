import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import Spline from '@splinetool/react-spline';

function App() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleScroll = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);

    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  // Placeholder upload function
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("No files selected for upload.");
      return;
    }

    console.log("Uploading files...", selectedFiles);

    // Hypothetical API call (replace this with actual backend logic)
    try {
      // Example: Sending files to a backend endpoint
      const formData = new FormData();
      selectedFiles.forEach(file => formData.append("images", file));

      // Fake API endpoint
      await fetch("https://your-backend-api.com/upload", {
        method: "POST",
        body: formData,
      });

      alert("Files uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    }
  };

  return (
    <div className="w-screen h-screen bg-black">
      {<Spline
        scene="https://prod.spline.design/VMVgTOkbPJRNTowR/scene.splinecode"
        onClick={handleScroll}
      />}

      {/* Content Section */}
      <section ref={contentRef} className="min-h-screen py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Description Card */}
          <div className="bg-cardColor p-8 rounded-2xl">
            <h2 className="text-3xl text-white font-bold mb-6">Our Process</h2>
            <p className="text-gray-300 leading-relaxed">
              We follow a simple yet effective approach to ensure the best experience for our users. 
              Our three-step process makes it easy to get started quickly and securely.
            </p>
            <ol className="mt-8 space-y-4 list-decimal list-inside text-gray-300">
              <li>
                <strong className="text-white">Scan</strong> – Quickly analyze and gather information 
                with our advanced scanning tools.
              </li>
              <li>
                <strong className="text-white">Value</strong> – Assess and extract meaningful insights 
                to enhance your experience.
              </li>
              <li>
                <strong className="text-white">Protect</strong> – Keep your data and content secure 
                with industry-leading safeguards.
              </li>
            </ol>
          </div>

          {/* Upload Card */}
          <div className="bg-cardColor backdrop-blur-lg p-8 rounded-2xl">
            <h2 className="text-3xl text-white font-bold mb-6">Upload Images</h2>
            <div className="relative">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept="image/*"
              />
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-white transition-colors"
              >
                <Upload className="w-12 h-12 mb-2 text-white" />
                <span className="text-gray-300">Click to upload images</span>
              </label>
            </div>

            {/* Preview Section */}
            {previewUrls.length > 0 && (
              <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={url} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload to Backend Button */}
            <button
              onClick={handleUpload}
              className="mt-6 w-full bg-accent hover:bg-accentHover text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Upload to Backend
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
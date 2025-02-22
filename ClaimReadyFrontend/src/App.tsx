import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import Spline from '@splinetool/react-spline';

function App() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleScroll = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  
    files.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (reader.result) {
          setPreviewUrls(prev => [...prev, reader.result as string]);
        }
      };
    });
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };


  const handleSendData = async () => {
    if (selectedFiles.length === 0) {
      alert("No files selected!");
      return;
    }
  
    setUploading(true);
  
    const base64Promises = selectedFiles.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
    });
  
    try {
      const base64Images = await Promise.all(base64Promises);
  
      const requestBody = JSON.stringify({
        name: "User's Upload", // Modify as needed
        value: base64Images
      });
  
      const response = await fetch("http://10.141.85.222:5000/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestBody,
      });
  
      if (!response.ok) {
        throw new Error("Failed to upload images");
      }
  
      const result = await response.json();
      alert("Images uploaded successfully!");
      console.log(result);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload images.");
    }
  
    setUploading(false);
  };

  return (
    <div className="w-screen h-screen bg-black">
      {<Spline
        scene="https://prod.spline.design/VMVgTOkbPJRNTowR/scene.splinecode"
        onClick={handleScroll}
      />}

      <section ref={contentRef} className="min-h-screen py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div className="bg-cardColor p-8 rounded-2xl">
            <h2 className="text-3xl text-white font-bold mb-6">The Process</h2>
            <ol className="mt-8 space-y-4 list-decimal list-inside text-gray-300">
              <li><strong className="text-white">Scan:</strong> Upload images of your belongings.</li>
              <li><strong className="text-white">Value:</strong> Our model will analyze the image and give you pricing of each product in the picture.</li>
              <li><strong className="text-white">Protect:</strong> Using this pricing, you can easily get a valuation of your belongings for insurance claims.</li>
            </ol>
          </div>

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

            <button
              onClick={handleSendData}
              className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              {uploading ? "Uploading..." : "Send Data"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
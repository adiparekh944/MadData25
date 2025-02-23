import React, { useRef, useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import Spline from '@splinetool/react-spline';
import DynamicTable from './DynamicTable';
import BasicPage from './BasicPage';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

const LOCAL_STORAGE_KEY = "tableData";

const App: React.FC = () => {
  // Load data from localStorage or use default values
  const [tableData, setTableData] = useState<{ item: string; price: string }[]>(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : [
      { item: 'Laptop', price: '$1,200' },
      { item: 'Phone', price: '$800' },
      { item: 'Headphones', price: '$200' },
      { item: 'Camera', price: '$1,500' },
    ];
  });

  // Save to localStorage whenever tableData changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tableData));
  }, [tableData]);

  // Add a new row
  const addRow = () => {
    const newRow = { item: `New Item ${tableData.length + 1}`, price: "$0" };
    setTableData([...tableData, newRow]);
  };

  // Clear the table
  const clearTable = () => {
    setTableData([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  // Sample dataset (addressData)

  const addressData = [
    { street: "3340 Clerendon Rd", city: "Beverly Hills", zipcode: "90210", state: "CA", price: "$8,325,300" },
    { street: "95 Tustin Rd", city: "Pasadena", zipcode: "91105", state: "CA", price: "$5,800,000" },
    { street: "860 Chautauqua Blvd", city: "Pacific Palisades", zipcode: "90272", state: "CA", price: "$9,348,700" },
    { street: "808 Wilshire Blvd", city: "Santa Monica", zipcode: "90017", state: "CA", price: "$1,430,000" },
    { street: "615 Seward St", city: "Los Angeles", zipcode: "90004", state: "CA", price: "$3,729,100" },
    { street: "10250 Constellation Blvd", city: "Los Angeles", zipcode: "90067", state: "CA", price: "$4,642,563" },
    { street: "7615 Hollywood Blvd", city: "Los Angeles", zipcode: "90046", state: "CA", price: "$1,887,500" },
    { street: "1137 Tiffany Cir S", city: "Palm Springs", zipcode: "92262", state: "CA", price: "$6,890,000" },
    { street: "3903 Carbon Canyon Rd", city: "Brea", zipcode: "92823", state: "CA", price: "$22,625,617" },
    { street: "10100 Blvd", city: "Santa Monica", zipcode: "90067", state: "CA", price: "$5,716,124" },
    { street: "9601 Wilshire Blvd", city: "Beverly Hills", zipcode: "90210", state: "CA", price: "$2,004,436" },
    { street: "17072 Sandra Lee Ln", city: "Huntington Beach", zipcode: "92469", state: "CA", price: "$1,471,100" },
    { street: "4715 E Maychelle Dr", city: "Anaheim", zipcode: "92807", state: "CA", price: "$1,191,800" },
    { street: "22031 Carbon Mesa Rd", city: "Malibu", zipcode: "90265", state: "CA", price: "$5,853,800" },
    { street: "2271 Cheremoya Ave", city: "Los Angeles", zipcode: "90068", state: "CA", price: "$1,774,500" },
    { street: "656 Lachman Ln", city: "Pacific Palisades", zipcode: "90272", state: "CA", price: "$6,913,600" },
    { street: "1680 Woodglen Ln", city: "Altadena", zipcode: "91001", state: "CA", price: "$1,666,500" },
    { street: "9057 Nemo St", city: "West Hollywood", zipcode: "90069", state: "CA", price: "$12,523,567" },
    { street: "18038 Blue Sail Dr", city: "Pacific Palisades", zipcode: "90272", state: "CA", price: "$8,550,000" },
    { street: "2050 Stanley Hills Dr", city: "Malibu", zipcode: "90046", state: "CA", price: "$1,356,400" },
    { street: "1505 10th St", city: "Santa Monica", zipcode: "90401", state: "CA", price: "$8,603,100" },
    { street: "3903 Carbon Canyon Rd", city: "Brea", zipcode: "92823", state: "CA", price: "$22,625,617" },
  ];

  // Image upload states
  const contentRef = useRef<HTMLDivElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [address, setAddress] = useState(''); // For user input
  const [suggestions, setSuggestions] = useState<typeof addressData>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  
  const listItems = [
    {
      label: "Overview",
      text: "This is the overview text. It gives a quick summary or introduction."
    },
    {
      label: "Details",
      text: "Here are the details. You can provide more in-depth information here."
    },
    {
      label: "Contact",
      text: "This is the contact section. Provide contact info or next steps here."
    },
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleScroll = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  
    files.forEach(file => {
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

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);
    if (value.length > 0) {
      const filtered = addressData.filter(item => {
        const fullAddress = `${item.street}, ${item.city}, ${item.state} ${item.zipcode}`;
        return fullAddress.toLowerCase().includes(value.toLowerCase());
      });
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (item: typeof addressData[0]) => {
    const fullAddress = `${item.street}, ${item.city}, ${item.state} ${item.zipcode}`;
    setAddress(fullAddress);
    setShowSuggestions(false);
  };

  const handleSendData = async () => {
    if (selectedFiles.length === 0) {
      alert("No files selected!");
      return;
    }
    setUploading(true);

    // Convert image files to base64 strings
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
      // Prepare and send the images payload
      const imageRequestBody = JSON.stringify({
        name: "User's Upload",
        value: base64Images
      });
  
      const imageResponse = await fetch("http://10.141.85.222:5000/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: imageRequestBody,
      });
      const imageResult = await imageResponse.json();

      // If an address is provided, send it to a different endpoint
      let addressResult = null;
      if (address.trim()) {
        const addressRequestBody = JSON.stringify({ address });
        const addressResponse = await fetch("http://10.141.85.222:5000/api/address", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: addressRequestBody,
        });
        addressResult = await addressResponse.json();
      }
  
      // Show both results together
      alert(JSON.stringify({ imageResult, addressResult }, null, 2));
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload data.");
    }
    setUploading(false);
  };

  return (
    <div className="w-screen h-screen bg-background">
      <Spline
        scene="https://prod.spline.design/VMVgTOkbPJRNTowR/scene.splinecode"
        onClick={handleScroll}
      />

      <section ref={contentRef} className="min-h-screen py-20 px-4 bg-background">
        {/* 
          1) Vertical list + detail text in a 2-column layout 
          2) Then below that, the "Process" and "Upload Images" cards
        */}
        <div className="max-w-6xl mx-auto">
          {/* 2-column layout for the list and its text */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Left Column: Vertical list */}
            <div className="flex flex-col space-y-6">
              {listItems.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <button
                    key={item.label}
                    onClick={() => setSelectedIndex(index)}
                    className={`
                      text-5xl text-white text-left py-2 transition-colors duration-300
                      hover:text-red-500
                      ${isSelected ? 'border-l-4 border-cardColor pl-4' : ''}
                    `}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Right Column: Text for the selected item */}
            <div className="text-white text-xl">
              {listItems[selectedIndex].text}
            </div>
          </div>

          {/* The Process & Upload Images section */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* The Process Card */}
            <div className="bg-cardColor p-8 rounded-2xl">
              <h2 className="text-3xl text-white font-bold mb-6">
                The Process
              </h2>
              <ol className="mt-8 space-y-4 list-decimal list-inside text-gray-300">
                <li>
                  <strong className="text-white">Scan:</strong> Upload images of
                  your belongings.
                </li>
                <li>
                  <strong className="text-white">Value:</strong> Our model will
                  analyze the image and give you pricing of each product in the
                  picture.
                </li>
                <li>
                  <strong className="text-white">Protect:</strong> Using this
                  pricing, you can easily get a valuation of your belongings for
                  insurance claims.
                </li>
              </ol>
            </div>

            {/* Upload Images Card */}
            <div className="bg-cardColor backdrop-blur-lg p-8 rounded-2xl relative">
              <h2 className="text-3xl text-white font-bold mb-6">
                Upload Images
              </h2>

              <div className="mb-4 relative">
                <input
                  type="text"
                  value={address}
                  onChange={handleAddressChange}
                  placeholder="Enter your address"
                  className="w-full p-2 rounded-lg border border-gray-400 focus:outline-none"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md max-h-60 overflow-y-auto mt-1">
                    {suggestions.map((item, index) => {
                      const fullAddress = `${item.street}, ${item.city}, ${item.state} ${item.zipcode}`;
                      return (
                        <li
                          key={index}
                          className="p-2 hover:bg-gray-200 cursor-pointer"
                          onClick={() => handleSelectSuggestion(item)}
                        >
                          {fullAddress}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              

              {/* File Upload */}
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

              {/* Image Previews */}
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

              {/* Submit Button */}
              <button
                onClick={handleSendData}
                className="w-full mt-4 bg-buttonColor text-black font-semibold py-2 px-4 rounded-lg"
              >
                {uploading ? "Uploading..." : "Send Data"}
              </button>
            </div>
          </div>

          {/* New Button Linking to BasicPage */}
            {/* Other components */}
            <button className="flex justify-center mt-12" onClick={() => navigate('/basic')}>
              <span className="bg-buttonColor text-black font-semibold py-2 px-4 rounded-lg">
                Go to Basic Page
              </span>
            </button>
        </div>
      </section>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">My Dynamic Table</h2>
        <DynamicTable data={tableData} />
        {/* You can add your Add/Clear row buttons anywhere you like: */}
        <div className="mt-4 flex gap-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={addRow}
          >
            Add Row
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded"
            onClick={clearTable}
          >
            Clear Table
          </button>
        </div>
      </div>
    </div>
  );
};

const Main = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/basic" element={<BasicPage />} />
    </Routes>
  </Router>
);

export default Main;

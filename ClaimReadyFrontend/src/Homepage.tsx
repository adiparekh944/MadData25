import React, { useRef, useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import Spline from '@splinetool/react-spline';
import DynamicTable from './DynamicTable';

const LOCAL_STORAGE_KEY = "tableData";

const App: React.FC = () => {
  const [tableData, setTableData] = useState<{ item: string; price: string }[]>(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : [
    ];
  });

  // Save to localStorage whenever tableData changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tableData));
  }, [tableData]);

  
  const escapeCSVField = (field: string) => {
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  };
  
  const exportToCSV = () => {
    const header = ['Item', 'Price'];
    const rows = tableData.map(row => [row.item, row.price]);
    const csvContent = [header, ...rows]
      .map(row => row.map(escapeCSVField).join(","))
      .join("\n");
  
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "PriceList.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  

  const addRow = () => {
    const newRow = { item: `New Item ${tableData.length + 1}`, price: "$0" };
    setTableData([...tableData, newRow]);
  };

  const clearTable = () => {
    setTableData([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const editPrice = (index: number) => {
    const newPrice = prompt('Enter the new dollar amount:');
    if (newPrice !== null) {
      setTableData((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], price: newPrice };
        return updated;
      });
    }
  };

  const deleteRow = (index: number) => {
    setTableData((prev) => prev.filter((_, i) => i !== index));
  };

  
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


  const contentRef = useRef<HTMLDivElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState<typeof addressData>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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
      const imageRequestBody = JSON.stringify({
        name: "User's Upload",
        value: base64Images
      });
  
      // const res = await fetch("http://10.141.85.222:5000/api/upload", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: imageRequestBody,
      // });
       const res = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: imageRequestBody,
      });
      const responseData = await res.json();

      // let addressResult = null;
      // if (address.trim()) {
      //   const addressRequestBody = JSON.stringify({ address });
      //   const addressRes = await fetch("http://10.141.85.222:5000/api/address", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: addressRequestBody,
      //   });
      //   addressResult = await addressRes.json();
      // }
       let addressResult = null;
      if (address.trim()) {
        const addressRequestBody = JSON.stringify({ address });
        const addressRes = await fetch("http://localhost:8080/api/address", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: addressRequestBody,
        });
        addressResult = await addressRes.json();
      }
  
  



      if (address.trim()) {
        const matched = addressData.find((a) => address.includes(a.street));
        if (matched) {
          setTableData((prev) => [
            { item: matched.street, price: matched.price },
            ...prev,
          ]);
        }
      }      
      if (responseData.detected_items?.length) {
       


        responseData.detected_items.forEach((detectedItem: any) => {
          setTableData((prev) => [
            ...prev,
            {
              item: detectedItem.title || 'Unnamed Item',
              price: detectedItem.price.slice(0, -1) || '$0',
            },
          ]);
        });
      }


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

      <section ref={contentRef} className="h-[800px] py-20 px-4 bg-background">
        
        <div className="max-w-6xl mx-auto">


          <div className="grid md:grid-cols-2 gap-12">
       
            <div className="bg-cardColor p-8 rounded-2xl">
              <h2 className="text-4xl text-white font-bold mb-6">
                The Process
              </h2>
              <ol className="mt-8 space-y-4 list-decimal list-inside text-gray-300 text-xl">
                <li>
                  <strong className="text-white">Scan:</strong> Upload images, and let AI catalog your lost belongings.
                </li>
                <li>
                  <strong className="text-white">Value:</strong> Instantly retrieve item prices for accurate insurance claims.
                </li>
                <li>
                  <strong className="text-white">Protect:</strong> Ensure smooth and verified claims for a faster recovery.

                </li>
              </ol>
            </div>

            {/* Upload Images Card */}
            <div className="bg-cardColor backdrop-blur-lg p-8 rounded-2xl relative">
              <h2 className="text-4xl text-white font-bold mb-6">
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
                  <ul className="absolute z-10 w-full bg-background border border-gray-300 rounded-md max-h-60 overflow-y-auto mt-1">
                    {suggestions.map((item, idx) => {
                      const fullAddress = `${item.street}, ${item.city}, ${item.state} ${item.zipcode}`;
                      return (
                        <li
                          key={idx}
                          className="p-2 hover:bg-gray-200 cursor-pointer"
                          onClick={() => {
                            setAddress(fullAddress);
                            setShowSuggestions(false);
                          }}
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
                  {previewUrls.map((url, idx) => (
                    <div key={url} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(idx)}
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
        </div>
      </section>

      <div className="w-full bg-background">
        <h2 className="text-3xl text-black font-bold mb-4 text-center ">Price List</h2>
        <DynamicTable
          data={tableData}
          
          onEditPrice={editPrice}
          onDeleteRow={deleteRow}
        />
        <div className="mt-4 flex gap-4">
          <button
            className="px-4 py-2 bg-red text-black rounded"
            onClick={clearTable}
          >
            Clear Table
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded"
            onClick={exportToCSV}
          >
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
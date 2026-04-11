// import React, { useState } from 'react';
// import API from '../api';

// const AdminBookUpload = () => {
//     const [isBulk, setIsBulk] = useState(true); // Toggle between bulk and single upload
//     const [jsonInput, setJsonInput] = useState(`[
//     { "title": "Calculus: Early Transcendentals", "author": "Stewart", "isbn": "9781305267261", "quantity": 5, "available": 5, "category": "Math" },
//     { "title": "Principles of Physics", "author": "Halliday", "isbn": "9781118230749", "quantity": 7, "available": 7, "category": "Science" }
// ]`);
//     const [singleInput, setSingleInput] = useState({ title: '', author: '', isbn: '', quantity: 1, available: 1, category: '' });
//     const [message, setMessage] = useState('');
//     const [error, setError] = useState('');

//     const handleSingleChange = (e) => {
//         let { name, value, type } = e.target;
//         // Convert quantity/available to numbers
//         if (type === 'number') {
//             value = parseInt(value) || 0;
//             // Ensure available is always <= quantity
//             if (name === 'quantity') {
//                  setSingleInput(prev => ({ ...prev, [name]: value, available: Math.min(value, prev.available) }));
//             } else {
//                  setSingleInput(prev => ({ ...prev, [name]: value }));
//             }
//         } else {
//              setSingleInput(prev => ({ ...prev, [name]: value }));
//         }
//     };
    
//     // Function to handle both single and bulk submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setMessage('Uploading books...');
//         setError('');
        
//         let payload;
//         let route;

//         try {
//             if (isBulk) {
//                 payload = JSON.parse(jsonInput);
//                 route = '/api/books/bulk';
//                 if (!Array.isArray(payload) || payload.length === 0) {
//                     throw new Error('Invalid JSON format. Must be an array.');
//                 }
//             } else {
//                 payload = singleInput;
//                 route = '/api/books';
//                 if (!payload.title || payload.quantity < 1) {
//                     throw new Error('Title and Quantity are required for a single entry.');
//                 }
//             }
            
//             // API call uses the admin token automatically via the interceptor
//             const res = await API.post(route, payload);

//             if (res.status === 207) { // Multi-Status for partial bulk success
//                 setError(`Failed to insert ${res.data.failedCount} book(s). See console for details.`);
//                 console.error("Bulk Upload Failures:", res.data.failures);
//                 setMessage(`${res.data.successCount} books added successfully.`);
//             } else {
//                  setMessage(res.data.msg || `${isBulk ? payload.length : 1} book(s) added successfully!`);
//             }
            
//             // Reset input after success
//             if (isBulk) setJsonInput('[]');
//             else setSingleInput({ title: '', author: '', isbn: '', quantity: 1, available: 1, category: '' });

//         } catch (err) {
//             const errorMessage = err.response?.data?.msg || err.message || 'An unknown error occurred.';
//             setError(errorMessage);
//             setMessage('');
//         }
//     };


//     // --- RENDERING ---
//     return (
//         <div className="p-4">
//             <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Book Inventory Management</h3>
            
//             {/* Toggle Button */}
//             <div className="mb-6 flex space-x-4">
//                 <button
//                     onClick={() => setIsBulk(true)}
//                     className={`px-6 py-2 rounded-lg font-semibold transition duration-150 ${isBulk ? 'bg-red-600 text-white shadow-md' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
//                 >
//                     Bulk Upload (JSON)
//                 </button>
//                 <button
//                     onClick={() => setIsBulk(false)}
//                     className={`px-6 py-2 rounded-lg font-semibold transition duration-150 ${!isBulk ? 'bg-red-600 text-white shadow-md' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
//                 >
//                     Add Single Book
//                 </button>
//             </div>

//             {/* Messages */}
//             {message && <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">{message}</div>}
//             {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

//             <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl shadow-inner">
//                 {isBulk ? (
//                     /* Bulk Upload Area */
//                     <>
//                         <label htmlFor="json-input" className="block text-sm font-medium text-gray-700 mb-2">
//                             Paste Books as JSON Array:
//                         </label>
//                         <textarea
//                             id="json-input"
//                             className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-red-500 focus:border-red-500 resize-none font-mono"
//                             rows="15"
//                             value={jsonInput}
//                             onChange={(e) => setJsonInput(e.target.value)}
//                             placeholder="[ { title: 'Book A', author: 'Author A', quantity: 1 } ]"
//                             required
//                         />
//                         <p className="text-xs text-gray-500 mt-2">Use the format: "title": "...", "author": "...", "isbn": "...", "quantity": 5, "available": 5</p>
//                     </>
//                 ) : (
//                     /* Single Upload Form */
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <input type="text" name="title" placeholder="Title*" value={singleInput.title} onChange={handleSingleChange} required className="p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" />
//                         <input type="text" name="author" placeholder="Author" value={singleInput.author} onChange={handleSingleChange} className="p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" />
//                         <input type="text" name="isbn" placeholder="ISBN (Unique)" value={singleInput.isbn} onChange={handleSingleChange} className="p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" />
//                         <input type="text" name="category" placeholder="Category" value={singleInput.category} onChange={handleSingleChange} className="p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" />
                        
//                         <input type="number" name="quantity" placeholder="Total Quantity*" value={singleInput.quantity} onChange={handleSingleChange} required min="1" className="p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" />
//                         <input type="number" name="available" placeholder="Available*" value={singleInput.available} onChange={handleSingleChange} required min="0" max={singleInput.quantity} className="p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" />
//                     </div>
//                 )}
                
//                 <button
//                     type="submit"
//                     className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-150 shadow-md"
//                 >
//                     {isBulk ? 'Process Bulk Upload' : 'Add Single Book'}
//                 </button>
//             </form>
//         </div>
//     );
// }

// export default AdminBookUpload;





import React, { useState } from "react";
import * as XLSX from "xlsx";
import API from "../api";
import { isKrutidev } from "../utils/hindiConverter";

const AdminBookUpload = () => {
  const [isBulk, setIsBulk] = useState(true);
  const [uploadMode, setUploadMode] = useState("json"); // "json" | "excel"
  const [jsonInput, setJsonInput] = useState(`[{"title":"Calculus: Early Transcendentals","author":"Stewart",
    ,"totalCopies":5,
    "copiesAvailable":5,
    "category":"Math"
    }]`);
  const [excelData, setExcelData] = useState([]);
  const [singleInput, setSingleInput] = useState({
  title: "",
  author: "",
  // isbn: "",
  totalCopies: 1,
  copiesAvailable: 1,
  // category: "",
});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  // Handle single field change
  // const handleSingleChange = (e) => {
    // let { name, value, type } = e.target;
    // if (type === "number") {
    //   value = parseInt(value) || 0;
    //   if (name === "totalCopies") {
    //     setSingleInput((prev) => ({
    //       ...prev,
    //       totalCopies: value,
    //       copiesAvailable: Math.min(prev.copiesAvailable, value),
    //     }));
    //   } else if (name === "copiesAvailable") {
    //     setSingleInput((prev) => ({
    //       ...prev,
    //       copiesAvailable: Math.min(value, prev.totalCopies),
    //     }));
    //   } else {
    //     setSingleInput((prev) => ({ ...prev, [name]: value }));
    //   }
    // } else {
    //   setSingleInput((prev) => ({ ...prev, [name]: value }));
    // }
  // };

  const handleSingleChange = (e) => {
  let { name, value, type } = e.target;

  // Convert number inputs properly
  if (type === "number") {
    value = parseInt(value) || 0;

    // Ensure copiesAvailable <= totalCopies
    if (name === "totalCopies") {
      setSingleInput((prev) => ({
        ...prev,
        [name]: value,
        copiesAvailable: Math.min(value, prev.copiesAvailable),
      }));
    } else {
      setSingleInput((prev) => ({ ...prev, [name]: value }));
    }
  } else {
    setSingleInput((prev) => ({ ...prev, [name]: value }));
  }
};


  // Handle Excel upload
  const handleExcelUpload = (file) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        if (!parsedData || parsedData.length === 0) {
          setError("No valid data found in Excel file.");
          return;
        }

        // Map data to match Book model
        const validData = parsedData
          .filter((row) => (row.title || row.Title) && (row.totalCopies || row.totalcopies || row.copiesAvailable))
          .map((row) => {
            const getField = (keys) => {
              const key = keys.find(k => row[k] !== undefined);
              return row[key] !== undefined ? String(row[key]).trim() : "";
            };

            const convert = (val) => {
              // Return raw value from Excel without any conversion
              return val ? String(val).trim() : "";
            };

            const total = Number(getField(["totalCopies", "totalcopies", "Total Copies", "copies"])) || 1;
            const available = getField(["copiesAvailable", "available", "Available"]) 
              ? Math.min(Number(getField(["copiesAvailable", "available", "Available"])), total)
              : total;

            return {
              title: convert(getField(["title", "Title", "TITLE"])),
              author: convert(getField(["author", "Author", "AUTHOR"])),
              department: convert(getField(["department", "Department", "DEPARTMENT"])),
              totalCopies: total,
              copiesAvailable: available,
            };
          });

        if (validData.length === 0) {
          setError("No valid rows with required fields found.");
          return;
        }

        setExcelData(validData);
        setMessage(`${validData.length} books ready for upload.`);
        console.log("Valid Excel Data:", validData);
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      setError("Failed to read Excel file. Please check format.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
      handleExcelUpload(file);
    } else {
      setError("Please upload a valid Excel file (.xlsx or .xls).");
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleTableChange = (index, field, value) => {
    const updatedData = [...excelData];
    updatedData[index][field] = value;
    setExcelData(updatedData);
  };

  // Handle submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Uploading books...");
    setError("");

    try {
      let payload;
      let route;

      if (isBulk) {
        route = "/api/books/bulk";

        if (uploadMode === "excel") {
          if (excelData.length === 0)
            throw new Error("No Excel data found. Upload a file first.");
          payload = excelData;
        } else {
          payload = JSON.parse(jsonInput);
          if (!Array.isArray(payload) || payload.length === 0)
            throw new Error("Invalid JSON format. Must be an array.");
        }
      } else {
        payload = singleInput;
        route = "/api/books";
        if (!payload.title || payload.totalCopies < 1)
          throw new Error("Title and Total Copies are required for a single entry.");
      }

      const res = await API.post(route, payload);

      if (res.status === 207) {
        setError(`Failed to insert ${res.data.failedCount} book(s). See console for details.`);
        console.error("Bulk Upload Failures:", res.data.failures);
        setMessage(`${res.data.successCount} books added successfully.`);
      } else {
        setMessage(res.data.msg || `${isBulk ? payload.length : 1} book(s) added successfully!`);
      }

      setExcelData([]);
      setJsonInput("[]");
      setSingleInput({
        title: "",
        author: "",
        // isbn: "",
        totalCopies: 1,
        copiesAvailable: 1,
        // category: "",
      });
    } catch (err) {
      const errorMessage = err.response?.data?.msg || err.message || "An unknown error occurred.";
      setError(errorMessage);
      setMessage("");
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        Book Inventory Management
      </h3>

      {/* Mode Toggle */}
      <div className="mb-6 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        <button
          onClick={() => setIsBulk(true)}
          className={`w-full sm:w-auto px-6 py-2 rounded-lg font-semibold transition duration-150 ${
            isBulk ? "bg-red-600 text-white shadow-md" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Bulk Upload
        </button>
        <button
          onClick={() => setIsBulk(false)}
          className={`w-full sm:w-auto px-6 py-2 rounded-lg font-semibold transition duration-150 ${
            !isBulk ? "bg-red-600 text-white shadow-md" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Add Single Book
        </button>
      </div>

      {/* Success/Error */}
      {message && <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">{message}</div>}
      {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl shadow-inner" onDragEnter={handleDrag}>
        {isBulk ? (
          <>
            {/* Upload Type Switch */}
            <div className="flex space-x-4 mb-4">
              <button
                type="button"
                onClick={() => setUploadMode("json")}
                className={`px-4 py-2 rounded-lg font-semibold ${uploadMode === "json" ? "bg-red-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
              >
                JSON Upload
              </button>
              <button
                type="button"
                onClick={() => setUploadMode("excel")}
                className={`px-4 py-2 rounded-lg font-semibold ${uploadMode === "excel" ? "bg-red-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
              >
                Excel Upload
              </button>
            </div>

            {uploadMode === "excel" && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                <span className="text-sm font-medium text-blue-800">
                  <span className="font-bold">Info:</span> Hindi (Krutidev) text will be auto-detected and displayed correctly.
                </span>
              </div>
            )}

            {uploadMode === "json" ? (
              <>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-red-500 focus:border-red-500 resize-none font-mono"
                  rows="15"
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Format: "title", "author", 
                  {/* "isbn", */}
                   "totalCopies", "copiesAvailable", 
                   {/* "category" */}
                </p>
              </>
            ) : (
              <>
                {/* Drag & Drop Zone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  className={`border-2 border-dashed rounded-lg p-10 text-center transition ${
                    dragActive ? "border-red-500 bg-red-50" : "border-gray-400 bg-white"
                  }`}
                >
                  <p className="text-gray-600">
                    Drag and drop your Excel file here or{" "}
                    <label className="text-red-600 underline cursor-pointer">
                      click to browse
                      <input type="file" accept=".xlsx, .xls" onChange={(e) => handleExcelUpload(e.target.files[0])} className="hidden" />
                    </label>
                  </p>
                </div>

                {/* Preview Table */}
                {excelData.length > 0 && (
                  <div className="mt-4 max-h-80 overflow-y-auto border rounded-lg bg-white">
                    <div className="p-2 bg-yellow-50 border-b text-xs text-yellow-800">
                      💡 Tip: Click on any cell to manually correct the Hindi text before uploading.
                    </div>
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-gray-100 sticky top-0">
                        <tr>
                          <th className="px-3 py-2 border-b font-semibold">#</th>
                          {Object.keys(excelData[0]).map((key) => (
                            <th key={key} className="px-3 py-2 border-b font-semibold capitalize">{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {excelData.map((row, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-3 py-1 border-b text-gray-400">{i + 1}</td>
                            {Object.entries(row).map(([key, val], j) => (
                              <td key={j} className="px-1 py-1 border-b">
                                <input
                                  type={typeof val === "number" ? "number" : "text"}
                                  value={val}
                                  onChange={(e) => handleTableChange(i, key, e.target.value)}
                                  className={`w-full px-2 py-1 bg-transparent border border-transparent hover:border-gray-300 focus:bg-white focus:border-red-500 rounded outline-none ${isKrutidev(val) ? 'font-kruti' : ''}`}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </>
        ) : 
        // (
        //   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        //     <input type="text" name="title" placeholder="Title*" value={singleInput.title} onChange={handleSingleChange} required className="p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" />
        //     <input type="text" name="author" placeholder="Author" value={singleInput.author} onChange={handleSingleChange} className="p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" />
        //     <input type="text" name="isbn" placeholder="ISBN (Unique)" value={singleInput.isbn} onChange={handleSingleChange} className="p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" />
        //     <input type="text" name="category" placeholder="Category" value={singleInput.category} onChange={handleSingleChange} className="p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" />
        //     <input type="number" name="totalCopies" placeholder="Total Copies*" value={singleInput.totalCopies} onChange={handleSingleChange} required min="1" className="p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" />
        //     <input type="number" name="copiesAvailable" placeholder="Available*" value={singleInput.copiesAvailable} onChange={handleSingleChange} required min="0" max={singleInput.totalCopies} className="p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" />
        //   </div>
        // )
         (
                    /* Single Upload Form */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="title" placeholder="Title*" value={singleInput.title} onChange={handleSingleChange} required className="p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" />
                        <input type="text" name="author" placeholder="Author" value={singleInput.author} onChange={handleSingleChange} className="p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" />
                        
                        <input type="number" name="totalCopies" placeholder="Total Quantity*" value={singleInput.totalCopies} onChange={handleSingleChange} required min="1" className="p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" />
                        <input type="number" name="copiesAvailable" placeholder="Available*" value={singleInput.copiesAvailable} onChange={handleSingleChange} required min="0" max={singleInput.totalCopies} className="p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" />
                    </div>
                )
      
      }

        

        <button type="submit" className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-150 shadow-md">
          {isBulk ? (uploadMode === "excel" ? "Upload Excel Data" : "Process Bulk Upload") : "Add Single Book"}
        </button>
      </form>
    </div>
  );
};

export default AdminBookUpload;


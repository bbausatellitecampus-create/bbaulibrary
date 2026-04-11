// import React, { useEffect, useState } from "react";
// import API from "../api";

// const AdminIssueManagement = () => {
//   const [issues, setIssues] = useState([]);
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [showFineModal, setShowFineModal] = useState(false);
//   const [selectedIssue, setSelectedIssue] = useState(null);

//   // Fetch all issue records
//   const fetchAllIssues = async () => {
//     setLoading(true);
//     setMessage("");
//     try {
//       const res = await API.get("/api/issues");
//       const sorted = res.data.sort((a, b) => {
//         if (a.status === "pending" && b.status !== "pending") return -1;
//         if (a.status !== "pending" && b.status === "pending") return 1;
//         return 0;
//       });
//       setIssues(sorted);
//     } catch (err) {
//       setMessage("Error fetching issue records. Check backend connection.");
//       console.error("Admin Issue Fetch Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllIssues();
//   }, []);

//   // ---- ACTION HANDLER ----
//   const handleAction = async (issueId, actionType, fine = 0) => {
//     let route = "";
//     let actionName = "";

//     if (actionType === "approve") {
//       route = `/api/issues/approve/${issueId}`;
//       actionName = "Approving Request";
//     } else if (actionType === "return") {
//       if (fine > 0) {
//         const issue = issues.find((i) => i._id === issueId);
//         setSelectedIssue(issue);
//         setShowFineModal(true);
//         return; // Wait for modal confirmation
//       }
//       route = `/api/issues/return/${issueId}`;
//       actionName = "Approving Return";
//     }

//     const confirmed = window.confirm(`Confirm ${actionName}?`);
//     if (!confirmed) return;

//     setMessage(`${actionName}...`);
//     try {
//       await API.put(route, {});
//       setMessage(`${actionName} complete!`);
//       fetchAllIssues();
//     } catch (err) {
//       setMessage(`Action failed: ${err.response?.data?.msg || "Check backend"}`);
//     }
//   };

//   // ---- CONFIRM FINE PAID & RETURN ----
//   const confirmFinePaid = async () => {
//     if (!selectedIssue) return;
//     setShowFineModal(false);
//     const fineRoute = `/api/issues/fine/${selectedIssue._id}`;
//     const returnRoute = `/api/issues/return/${selectedIssue._id}`;

//     setMessage("Processing fine and approving return...");

//     try {
//       // Step 1: Clear fine
//       await API.put(fineRoute, { amountPaid: selectedIssue.fine });

//       // Step 2: Approve return
//       await API.put(returnRoute, { fineCleared: true });

//       setMessage("✅ Fine cleared and return approved successfully!");
//       fetchAllIssues();
//     } catch (err) {
//       setMessage(`❌ Error: ${err.response?.data?.msg || "Something went wrong."}`);
//     } finally {
//       setSelectedIssue(null);
//     }
//   };

//   const cancelFineModal = () => {
//     setShowFineModal(false);
//     setSelectedIssue(null);
//   };

//   // ---- STATUS COLOR ----
//   const getStatusClasses = (status) => {
//     switch (status) {
//       case "pending":
//         return "bg-blue-100 text-blue-700 border-blue-400";
//       case "issued":
//         return "bg-yellow-100 text-yellow-700 border-yellow-400";
//       case "returned":
//         return "bg-green-100 text-green-700 border-green-400";
//       default:
//         return "bg-gray-100 text-gray-700 border-gray-400";
//     }
//   };

//   const formatDate = (date) =>
//     date ? new Date(date).toLocaleDateString() : "—";
//   const isLate = (issue) =>
//     issue.status === "issued" && new Date(issue.dueDate) < new Date();

//   if (loading)
//     return <div className="text-center py-10 text-gray-500">Loading records...</div>;

//   return (
//     <div className="px-4 sm:px-8">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h3 className="text-2xl font-bold text-gray-800">
//           Issue & Request Records
//         </h3>
//         <button
//           onClick={fetchAllIssues}
//           className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg border-4 border-red-400 transition duration-150"
//         >
//           Refresh
//         </button>
//       </div>

//       {/* Message */}
//       {message && (
//         <div
//           className={`p-3 mb-4 text-sm rounded-lg ${
//             message.startsWith("✅")
//               ? "bg-green-100 text-green-700 border border-green-300"
//               : message.startsWith("❌")
//               ? "bg-red-100 text-red-700 border border-red-300"
//               : "bg-yellow-50 text-yellow-800 border border-yellow-300"
//           }`}
//         >
//           {message}
//         </div>
//       )}

//       {/* List */}
//       <div className="space-y-4">
//         {issues.map((issue) => (
//           <div
//             key={issue._id}
//             className={`bg-white shadow-md rounded-lg p-5 border-l-8 transition duration-300 ${
//               issue.status === "pending"
//                 ? "border-blue-600 hover:shadow-lg"
//                 : isLate(issue)
//                 ? "border-red-600 hover:shadow-lg"
//                 : "border-gray-300"
//             }`}
//           >
//             <div className="flex justify-between items-start flex-wrap gap-2">
//               {/* Left Details */}
//               <div className="flex-1 min-w-[250px]">
//                 <p className="text-lg font-bold text-gray-900">
//                   {issue.book?.title || "Book Details Missing"}
//                 </p>
//                 <p className="text-sm text-gray-600 mb-2">
//                   User: {issue.student?.name || "User Deleted"}
//                 </p>
                

//                 <div className="grid grid-cols-2 text-sm text-gray-500 gap-1">
//                   {/* <p className="text-sm text-gray-600 mb-2">
//                   Fine: ₹{issue.fine?.toFixed(2) || 0}
//                 </p> */}

// {/* Fine Section with Color and Paid Status */}
// {/* <p
//   className={`text-sm mb-2 font-medium ${
//     issue.fine === 0
//       ? "text-green-600"
//       : issue.finePaid
//       ? "text-green-600"
//       : "text-red-600"
//   }`}
// >
//   {issue.fine === 0 ? (
//     <>✅ Fine: ₹0 (No Fine)</>
//   ) : issue.finePaid ? (
//     <>✅ Fine Paid: ₹{issue.fine.toFixed(2)}</>
//   ) : (
//     <>⚠️ Fine Due: ₹{issue.fine.toFixed(2)}</>
//   )}
// </p> */}


//   {/* Fine Section with Color + Paid Amount Info */}
// <p className={`text-sm mb-2 font-medium ${
//     issue.fine === 0 && issue.finePaid
//       ? "text-green-600"
//       : issue.fine > 0
//       ? "text-red-600"
//       : "text-gray-600"
//  }`}
// >
//   {issue.fine === 0 && issue.finePaid ? (
//     <>
//       ✅ Fine Paid: ₹{issue.paidAmount?.toFixed(2) || 0}
//     </>
//   ) : issue.fine > 0 ? (
//     <>
//       ⚠️ Fine Due: ₹{issue.fine.toFixed(2)}
//     </>
//   ) : (
//     <>
//       💰 Fine: ₹0 (No Fine)
//     </>
//   )}
// </p>



//                   <p>
//                     Issued:{" "}
//                     <span className="font-medium">
//                       {formatDate(issue.issueDate)}
//                     </span>
//                   </p>
//                   <p>
//                     Due:{" "}
//                     <span className="font-medium text-red-500">
//                       {formatDate(issue.dueDate)}
//                     </span>
//                   </p>
//                   <p>
//                     Returned:{" "}
//                     <span className="font-medium">
//                       {formatDate(issue.returnDate)}
//                     </span>
//                   </p>
//                   {/* 🕒 Countdown (Days Remaining or Late) */}
//     {issue.status === "issued" && (
//       <p className="mt-2">
//         {(() => {
//           const today = new Date();
//           const due = new Date(issue.dueDate);
//           const diffDays = Math.ceil(
//             (due - today) / (1000 * 60 * 60 * 24)
//           );

//           if (diffDays > 0) {
//             return (
//               <p className="text-sm font-semibold text-green-600">
//                 ⏳ {diffDays} day{diffDays !== 1 ? "s" : ""} remaining
//               </p>
//             );
//           } else if (diffDays === 0) {
//             return (
//               <p className="text-sm font-semibold text-yellow-600">
//                 ⚠️ Due today
//               </p>
//             );
//           } else {
//             return (
//               <p className="text-sm font-semibold text-red-600">
//                 ❌ {Math.abs(diffDays)} day{Math.abs(diffDays) !== 1 ? "s" : ""} late
//               </p>
//             );
//           }
//         })()}
//       </p>
//     )}
//                   <p>
//                     ID:{" "}
//                     <span className="font-mono text-xs">{issue._id}</span>
//                   </p>
//                 </div>
//               </div>

//               {/* Right Actions */}
//               <div className="flex flex-col items-end space-y-2">
//                 <div className="flex items-center space-x-3">
//                   {issue.status === "pending" && (
//                     <button
//                       onClick={() => handleAction(issue._id, "approve")}
//                       className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-1 px-3 rounded-lg"
//                     >
//                       Approve Request
//                     </button>
//                   )}

//                   {issue.status === "issued" && (
//                     <button
//                       onClick={() =>
//                         handleAction(issue._id, "return", issue.fine)
//                       }
//                       className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-1 px-3 rounded-lg"
//                     >
//                       Approve Return
//                     </button>
//                   )}

//                   <span
//                     className={`text-xs px-3 py-1 rounded-full border ${getStatusClasses(
//                       issue.status
//                     )}`}
//                   >
//                     {issue.status.toUpperCase()}
//                   </span>
//                 </div>

//                 {issue.status === "returned" && issue.fine > 0 && (
//                   <p className="text-xs text-red-600 font-medium">
//                     Fine: ₹{issue.fine.toFixed(2)}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {issues.length === 0 && !loading && (
//         <div className="text-center py-10 text-gray-500">
//           No issue records found.
//         </div>
//       )}

//       {/* Fine Confirmation Modal */}
//       {showFineModal && selectedIssue && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white rounded-xl p-6 shadow-lg max-w-sm w-full text-center">
//             <h4 className="text-lg font-semibold mb-2 text-gray-800">
//               Pending Fine
//             </h4>
//             <p className="text-gray-600 mb-4">
//               Fine ₹{selectedIssue.fine.toFixed(2)} is pending.
//               <br />
//               Has it been paid?
//             </p>
//             <div className="flex justify-center space-x-4">
//               <button
//                 onClick={confirmFinePaid}
//                 className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg"
//               >
//                 Yes, Paid
//               </button>
//               <button
//                 onClick={cancelFineModal}
//                 className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg"
//               >
//                 No, Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminIssueManagement;




































// import React, { useEffect, useState } from "react";
// import API from "../api";

// const AdminIssueManagement = () => {
//   const [issues, setIssues] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState("");
//   const [showFineModal, setShowFineModal] = useState(false);
//   const [selectedIssue, setSelectedIssue] = useState(null);

//   // 🔹 Search & Filters
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");

//   // Fetch issues
//   const fetchAllIssues = async (query = "", status = "") => {
//     setLoading(true);
//     setMessage("");
//     try {
//       const res = await API.get(`/api/issues?search=${query}&status=${status}`);
//       const sorted = res.data.sort((a, b) => {
//         if (a.status === "pending" && b.status !== "pending") return -1;
//         if (a.status !== "pending" && b.status === "pending") return 1;
//         return 0;
//       });
//       setIssues(sorted);
//     } catch (err) {
//       setMessage("Error fetching issue records.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllIssues();
//   }, []);

//   // ---- ACTION HANDLER ----
//   const handleAction = async (issueId, actionType, fine = 0) => {
//     let route = "";
//     let actionName = "";

//     if (actionType === "approve") {
//       route = `/api/issues/approve/${issueId}`;
//       actionName = "Approving Request";
//     } else if (actionType === "return") {
//       if (fine > 0) {
//         const issue = issues.find((i) => i._id === issueId);
//         setSelectedIssue(issue);
//         setShowFineModal(true);
//         return;
//       }
//       route = `/api/issues/return/${issueId}`;
//       actionName = "Approving Return";
//     }

//     const confirmed = window.confirm(`Confirm ${actionName}?`);
//     if (!confirmed) return;

//     setMessage(`${actionName}...`);
//     try {
//       await API.put(route, {});
//       setMessage(`${actionName} complete!`);
//       fetchAllIssues(searchQuery, statusFilter);
//     } catch (err) {
//       setMessage(`Action failed: ${err.response?.data?.msg || "Check backend"}`);
//     }
//   };

//   // ---- FINE MODAL ----
//   const confirmFinePaid = async () => {
//     if (!selectedIssue) return;
//     setShowFineModal(false);

//     try {
//       await API.put(`/api/issues/fine/${selectedIssue._id}`, { amountPaid: selectedIssue.fine });
//       await API.put(`/api/issues/return/${selectedIssue._id}`, { fineCleared: true });
//       setMessage("✅ Fine cleared and return approved!");
//       fetchAllIssues(searchQuery, statusFilter);
//     } catch (err) {
//       setMessage(`❌ Error: ${err.response?.data?.msg || "Something went wrong."}`);
//     } finally {
//       setSelectedIssue(null);
//     }
//   };

//   const cancelFineModal = () => {
//     setShowFineModal(false);
//     setSelectedIssue(null);
//   };

//   // ---- Helpers ----
//   const getStatusClasses = (status) => {
//     switch (status) {
//       case "pending": return "bg-blue-100 text-blue-700 border-blue-400";
//       case "issued": return "bg-yellow-100 text-yellow-700 border-yellow-400";
//       case "returned": return "bg-green-100 text-green-700 border-green-400";
//       default: return "bg-gray-100 text-gray-700 border-gray-400";
//     }
//   };

//   const formatDate = (date) => date ? new Date(date).toLocaleDateString() : "—";
//   const isLate = (issue) => issue.status === "issued" && new Date(issue.dueDate) < new Date();

//   if (loading) return <div className="text-center py-10 text-gray-500">Loading records...</div>;

//   return (
//     <div className="px-4 sm:px-8">
//       {/* Header + Filters */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//         <h3 className="text-2xl font-bold text-gray-800">Issue & Request Records</h3>

//         <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
//           <input
//             type="text"
//             placeholder="Search by username/book title/ISBN/category"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
//           />
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
//           >
//             <option value="">All Statuses</option>
//             <option value="pending">Pending</option>
//             <option value="issued">Issued</option>
//             <option value="returned">Returned</option>
//           </select>
//           <button
//             onClick={() => fetchAllIssues(searchQuery, statusFilter)}
//             className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg border-4 border-red-400 transition duration-150"
//           >
//             Apply
//           </button>
//           <button
//             onClick={() => { setSearchQuery(""); setStatusFilter(""); fetchAllIssues(); }}
//             className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-150"
//           >
//             Clear
//           </button>
//         </div>
//       </div>

//       {/* Message */}
//       {message && (
//         <div
//           className={`p-3 mb-4 text-sm rounded-lg ${
//             message.startsWith("✅") ? "bg-green-100 text-green-700 border border-green-300" :
//             message.startsWith("❌") ? "bg-red-100 text-red-700 border border-red-300" :
//             "bg-yellow-50 text-yellow-800 border border-yellow-300"
//           }`}
//         >
//           {message}
//         </div>
//       )}

//       {/* Issue List */}
//       <div className="space-y-4">
//         {issues.map((issue) => (
//           <div key={issue._id} className={`bg-white shadow-md rounded-lg p-5 border-l-8 transition duration-300 ${issue.status==="pending" ? "border-blue-600 hover:shadow-lg" : isLate(issue) ? "border-red-600 hover:shadow-lg" : "border-gray-300"}`}>
//             <div className="flex justify-between items-start flex-wrap gap-2">
//               {/* Left Details */}
//               <div className="flex-1 min-w-[250px]">
//                 <p className="text-lg font-bold text-gray-900">{issue.book?.title || "Book Missing"}</p>
//                 <p className="text-sm text-gray-600 mb-2">User: {issue.student?.name || "Deleted"}</p>
//                 <p className={`text-sm mb-2 font-medium ${issue.fine>0 ? "text-red-600" : "text-green-600"}`}>
//                   {issue.fine>0 ? `⚠️ Fine Due: ₹${issue.fine.toFixed(2)}` : "✅ Fine Paid / No Fine"}
//                 </p>
//                 <p>Issued: <span className="font-medium">{formatDate(issue.issueDate)}</span></p>
//                 <p>Due: <span className="font-medium text-red-500">{formatDate(issue.dueDate)}</span></p>
//                 <p>Returned: <span className="font-medium">{formatDate(issue.returnDate)}</span></p>
//                 {issue.status === "issued" && (
//                   <p className="mt-2 text-sm font-semibold text-red-600">
//                     {(() => { const diff = Math.ceil((new Date(issue.dueDate) - new Date())/(1000*60*60*24)); return diff>0?`⏳ ${diff} day(s) remaining`:diff===0?"⚠️ Due today":`❌ ${Math.abs(diff)} day(s) late`;})()}
//                   </p>
//                 )}
//                 <p>ID: <span className="font-mono text-xs">{issue._id}</span></p>
//               </div>

//               {/* Right Actions */}
//               <div className="flex flex-col items-end space-y-2">
//                 <div className="flex items-center space-x-3">
//                   {issue.status==="pending" && <button onClick={()=>handleAction(issue._id,"approve")} className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-1 px-3 rounded-lg">Approve Request</button>}
//                   {issue.status==="issued" && <button onClick={()=>handleAction(issue._id,"return",issue.fine)} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-1 px-3 rounded-lg">Approve Return</button>}
//                   <span className={`text-xs px-3 py-1 rounded-full border ${getStatusClasses(issue.status)}`}>{issue.status.toUpperCase()}</span>
//                 </div>
//                 {issue.status==="returned" && issue.fine>0 && <p className="text-xs text-red-600 font-medium">Fine: ₹{issue.fine.toFixed(2)}</p>}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {issues.length===0 && !loading && <div className="text-center py-10 text-gray-500">No issue records found.</div>}

//       {/* Fine Modal */}
//       {showFineModal && selectedIssue && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white rounded-xl p-6 shadow-lg max-w-sm w-full text-center">
//             <h4 className="text-lg font-semibold mb-2 text-gray-800">Pending Fine</h4>
//             <p className="text-gray-600 mb-4">Fine ₹{selectedIssue.fine.toFixed(2)} is pending. Has it been paid?</p>
//             <div className="flex justify-center space-x-4">
//               <button onClick={confirmFinePaid} className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg">Yes, Paid</button>
//               <button onClick={cancelFineModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg">No, Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminIssueManagement;





















import React, { useEffect, useState } from "react";
import API from "../api";

const AdminIssueManagement = () => {
  const [issues, setIssues] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFineModal, setShowFineModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [submittedQuery, setSubmittedQuery] = useState("");
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Fetch issues with pagination
  const fetchIssues = async (currentPage, query = "", status = "") => {
    setLoading(true);
    try {
      const res = await API.get("/api/issues", {
        params: { search: query, status, page: currentPage, limit: 25 },
      });
      
      const { issues: newIssues, hasMore: more } = res.data;

      if (currentPage === 1) {
        setIssues(newIssues);
      } else {
        setIssues((prev) => [...prev, ...newIssues]);
      }
      setHasMore(more);
    } catch (err) {
      console.error(err);
      setMessage("Error fetching issues");
    } finally {
      setLoading(false);
    }
  };

  // Effect: Fetch when page, query, or filter changes
  useEffect(() => {
    fetchIssues(page, submittedQuery, statusFilter);
  }, [page, submittedQuery, statusFilter]);

  // Handlers
  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      setPage(1);
      setSubmittedQuery(searchQuery); 
    }
  };

  const handleStatusChange = (e) => {
    setPage(1);
    setStatusFilter(e.target.value);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const refreshList = () => {
    setPage(1);
    fetchIssues(1, submittedQuery, statusFilter);
  };

  // ---- ACTION HANDLER ----
  const handleAction = async (issueId, actionType, fine = 0) => {
    let route = "";
    let actionName = "";

    if (actionType === "approve") {
      route = `/api/issues/approve/${issueId}`;
      actionName = "Approving Request";
    } else if (actionType === "return") {
      if (fine > 0) {
        const issue = issues.find((i) => i._id === issueId);
        setSelectedIssue(issue);
        setShowFineModal(true);
        return; // wait for modal confirmation
      }
      route = `/api/issues/return/${issueId}`;
      actionName = "Approving Return";
    }

    const confirmed = window.confirm(`Confirm ${actionName}?`);
    if (!confirmed) return;

    setMessage(`${actionName}...`);
    try {
      const res = await API.put(route, {});
      setMessage(`${actionName} complete!`);
      
      // Update local state
      const updatedIssue = actionType === "approve" ? res.data : res.data.issue;
      setIssues((prev) => prev.map((i) => (i._id === issueId ? updatedIssue : i)));

    } catch (err) {
      setMessage(`Action failed: ${err.response?.data?.msg || "Check backend"}`);
    }
  };

  // ---- CONFIRM FINE PAID & RETURN ----
  const confirmFinePaid = async () => {
    if (!selectedIssue) return;
    setShowFineModal(false);
    const fineRoute = `/api/issues/fine/${selectedIssue._id}`;
    const returnRoute = `/api/issues/return/${selectedIssue._id}`;

    setMessage("Processing fine and approving return...");
    try {
      // 1. Pay Fine
      await API.put(fineRoute, { amountPaid: selectedIssue.fine });
      // 2. Return Book
      const res = await API.put(returnRoute, { fineCleared: true });
      
      const updatedIssue = res.data.issue;
      setMessage("✅ Fine cleared and return approved successfully!");

      // Update local state
      setIssues((prev) => prev.map((i) => (i._id === selectedIssue._id ? updatedIssue : i)));

    } catch (err) {
      setMessage(`❌ Error: ${err.response?.data?.msg || "Something went wrong."}`);
    } finally {
      setSelectedIssue(null);
    }
  };

  const cancelFineModal = () => {
    setShowFineModal(false);
    setSelectedIssue(null);
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-700 border-blue-400";
      case "issued":
        return "bg-yellow-100 text-yellow-700 border-yellow-400";
      case "returned":
        return "bg-green-100 text-green-700 border-green-400";
      default:
        return "bg-gray-100 text-gray-700 border-gray-400";
    }
  };

  const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : "—");
  const isLate = (issue) => issue.status === "issued" && new Date(issue.dueDate) < new Date();

  return (
    <div className="px-4 sm:px-8 pb-10">
      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-center mb-6 gap-4">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 text-center xl:text-left">Issue & Request Records</h3>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-2 items-center w-full xl:w-auto">
           <button
            onClick={refreshList}
            className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-3 rounded"
            title="Reload List"
          >
            Refresh
          </button>
          <input
            type="text"
            placeholder="Search by username, book title, ISBN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} 
            onKeyDown={handleSearchSubmit}
            className="w-full sm:w-64 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          />
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="w-full sm:w-auto p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="issued">Issued</option>
            <option value="returned">Returned</option>
          </select>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-3 mb-4 text-sm rounded-lg ${
            message.startsWith("✅")
              ? "bg-green-100 text-green-700 border border-green-300"
              : message.startsWith("❌")
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-yellow-50 text-yellow-800 border border-yellow-300"
          }`}
        >
          {message}
        </div>
      )}

      {/* Issue List */}
      <div className="space-y-4">
        {(!issues || issues.length === 0) && !loading && (
          <div className="text-center py-10 text-gray-500">No issue records found.</div>
        )}

        {issues && issues.map((issue) => (
          <div
            key={issue._id}
            className={`bg-white shadow-md rounded-lg p-5 border-l-8 transition duration-300 ${
              issue.status === "pending"
                ? "border-blue-600 hover:shadow-lg"
                : isLate(issue)
                ? "border-red-600 hover:shadow-lg"
                : "border-gray-300"
            }`}
          >
            <div className="flex justify-between items-start flex-wrap gap-2">
              {/* Left Details */}
              <div className="flex-1 min-w-[250px]">
                <p className="text-lg font-bold text-gray-900">{issue.book?.title || "Book Missing"}</p>
                <p className="text-sm text-gray-600 mb-2">User: {issue.student?.name || "Deleted User"}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                   <span>Dept: {issue.student?.department || "N/A"}</span>
                   <span>Sem: {issue.student?.semester || "N/A"}</span>
                   <span>Card: {issue.student?.libraryCardNo || "N/A"}</span>
                </div>

                <div className="grid grid-cols-2 text-sm text-gray-500 gap-1">
                  <p
                    className={`text-sm mb-2 font-medium ${
                      issue.fine === 0 && issue.finePaid
                        ? "text-green-600"
                        : issue.fine > 0
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {issue.fine === 0 && issue.finePaid ? (
                      <>✅ Fine Paid: ₹{issue.paidAmount?.toFixed(2) || 0}</>
                    ) : issue.fine > 0 ? (
                      <>⚠️ Fine Due: ₹{issue.fine.toFixed(2)}</>
                    ) : (
                      <>💰 Fine: ₹0</>
                    )}
                  </p>

                  <p>Issued: <span className="font-medium">{formatDate(issue.issueDate)}</span></p>
                  <p>Due: <span className="font-medium text-red-500">{formatDate(issue.dueDate)}</span></p>
                  <p>Returned: <span className="font-medium">{formatDate(issue.returnDate)}</span></p>

                  {issue.status === "issued" && (
                    <p className="mt-2 text-sm font-semibold text-green-600">
                      {(() => {
                        const today = new Date();
                        const due = new Date(issue.dueDate);
                        const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
                        if (diffDays > 0) return <>⏳ {diffDays} day{diffDays !== 1 ? "s" : ""} remaining</>;
                        if (diffDays === 0) return <>⚠️ Due today</>;
                        return <>❌ {Math.abs(diffDays)} day{Math.abs(diffDays) !== 1 ? "s" : ""} late</>;
                      })()}
                    </p>
                  )}

                  <p>ID: <span className="font-mono text-xs">{issue._id}</span></p>
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex flex-col items-end space-y-2">
                <div className="flex items-center space-x-3">
                  {issue.status === "pending" && (
                    <button
                      onClick={() => handleAction(issue._id, "approve")}
                      className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-1 px-3 rounded-lg"
                    >
                      Approve Request
                    </button>
                  )}

                  {issue.status === "issued" && (
                    <button
                      onClick={() => handleAction(issue._id, "return", issue.fine)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-1 px-3 rounded-lg"
                    >
                      Approve Return
                    </button>
                  )}

                  <span className={`text-xs px-3 py-1 rounded-full border ${getStatusClasses(issue.status)}`}>
                    {issue.status.toUpperCase()}
                  </span>
                </div>

                {issue.status === "returned" && issue.fine > 0 && (
                  <p className="text-xs text-red-600 font-medium">Fine: ₹{issue.fine.toFixed(2)}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Load More Button */}
      {loading && <div className="text-center py-4 text-gray-500">Loading...</div>}
      
      {!loading && hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transition transform hover:scale-105"
          >
            Load More Results
          </button>
        </div>
      )}

      {/* Fine Confirmation Modal */}
      {showFineModal && selectedIssue && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg max-w-sm w-full text-center">
            <h4 className="text-lg font-semibold mb-2 text-gray-800">Pending Fine</h4>
            <p className="text-gray-600 mb-4">
              Fine ₹{selectedIssue.fine.toFixed(2)} is pending.
              <br />
              Has it been paid?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmFinePaid}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg"
              >
                Yes, Paid
              </button>
              <button
                onClick={cancelFineModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg"
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminIssueManagement;

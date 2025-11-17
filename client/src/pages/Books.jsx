// import React, { useEffect, useState } from "react";
// import API from "../api";
// import useAuth from "../hooks/useAuth";

// export default function Books() {
//   const auth = useAuth(); // get auth context safely
//   const userRole = auth?.userRole || null;
//   const isLoggedIn = auth?.isLoggedIn || false;


//   const [books, setBooks] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [message, setMessage] = useState({ text: "", type: "" });

//   useEffect(() => {
//     console.log("Current user role:", userRole);
//   }, [userRole]);

//   // Fetch books
//   const fetchBooks = async (query = "") => {
//     setMessage({ text: "Fetching books...", type: "info" });
//     try {
//       const res = await API.get(`/api/books?q=${query}`);
//       setBooks(res.data);
//       setMessage({ text: "", type: "" });
//     } catch (err) {
//       console.error(err);
//       setMessage({ text: "Failed to fetch books.", type: "error" });
//     }
//   };

//   useEffect(() => {
//     fetchBooks();
//   }, []);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     fetchBooks(searchQuery);
//   };

//   const handleRequest = async (bookId, title) => {
//     if (!isLoggedIn) {
//       setMessage({ text: "Please log in to request a book.", type: "error" });
//       return;
//     }

//     // if (userRole !== "student") {
//     //   setMessage({
//     //     text: "Admins should use the admin panel for issuing.",
//     //     type: "warning",
//     //   });
//     //   return;
//     // }

//     setMessage({ text: `Requesting "${title}"...`, type: "info" });
//     try {
//       await API.post(`/api/issues/request/${bookId}`);
//       setMessage({
//         text: `Successfully requested "${title}". Check 'My Books' for status.`,
//         type: "success",
//       });
//     } catch (err) {
//       console.error(err);
//       setMessage({
//         text:
//           err.response?.data?.msg ||
//           "Request failed. You might have already issued this book.",
//         type: "error",
//       });
//     }
//   };

//   return (
//     <div className="container mx-auto px-6 py-10">
//       <h2 className="text-4xl font-extrabold text-gray-900 mb-6 border-b-4 border-red-600 inline-block pb-2">
//         📚 Book Catalog
//       </h2>

//       {/* Debug Info */}
//       <p className="text-sm text-gray-500 mb-4">
//         Logged in:{" "}
//         <span className="font-semibold">
//           {isLoggedIn ? "Yes ✅" : "No ❌"}
//         </span>{" "}
//         | Role:{" "}
//         <span className="font-semibold">
//           {userRole ? userRole : "Not loaded yet..."}
//         </span>
//       </p>

//       {/* Search Bar */}
//       <form
//         onSubmit={handleSearch}
//         className="flex flex-col sm:flex-row sm:space-x-3 gap-3 mb-8"
//       >
//         {/* //want to search by title author isbn category */}
//         <input
//           type="text"
//           placeholder="Search by Title..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
//         />
//         <button
//           type="submit"
//           className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
//         >
//           Search
//         </button>
//       </form>

//       {/* Message */}
//       {message.text && (
//         <div
//           className={`p-3 mb-6 rounded-lg text-sm font-medium ${
//             message.type === "error"
//               ? "bg-red-100 text-red-700 border border-red-300"
//               : message.type === "success"
//               ? "bg-green-100 text-green-700 border border-green-300"
//               : message.type === "warning"
//               ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
//               : "bg-blue-100 text-blue-700 border border-blue-300"
//           }`}
//         >
//           {message.text}
//         </div>
//       )}

//       {/* Book List */}
//       {books.length === 0 ? (
//         <p className="text-gray-600 text-center mt-10 text-lg">
//           No books found. Try searching for another title.
//         </p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//           {books.map((b) => (
//             <div
//               key={b._id}
//               className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-transform duration-300 hover:-translate-y-1 border border-gray-200"
//             >
//               <div className="p-6">
//                 <h3 className="text-lg font-bold text-gray-900 mb-1">
//                   {b.title}
//                 </h3>
//                 <p className="text-sm text-gray-600 italic mb-3">
//                   by {b.author}
//                 </p>
//                 <p className="text-sm font-medium mb-2">
//                   Available:{" "}
//                   <span
//                     className={`${
//                       b.copiesAvailable > 0
//                         ? "text-green-600 font-semibold"
//                         : "text-red-600 font-semibold"
//                     }`}
//                   >
//                     {b.copiesAvailable}
//                   </span>
//                 </p>
//                 <p className="text-xs text-gray-500 mb-4">
//                   ISBN: {b.isbn || "N/A"}
//                 </p>

//                 {/* Buttons */}
//                 {!isLoggedIn && (
//                   <button className="w-full bg-gray-300 text-gray-700 font-semibold py-2.5 rounded-lg cursor-not-allowed">
//                     Login to Request
//                   </button>
//                 )}

//                 {isLoggedIn && b.copiesAvailable > 0 && (
//                   <button
//                     onClick={() => handleRequest(b._id, b.title)}
//                     className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg transition duration-150"
//                   >
//                     Request Book
//                   </button>
//                 )}

//                 {/* {isLoggedIn && userRole === "admin" && (
//                   <button
//                     className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg mt-2 transition duration-150"
//                   >
//                     Admin Tools
//                   </button>
//                 )} */}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }





import React, { useEffect, useState } from "react";
import API from "../api";
import useAuth from "../hooks/useAuth";

export default function Books() {
  const auth = useAuth();
  const userRole = auth?.userRole || null;
  const isLoggedIn = auth?.isLoggedIn || false;

  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [department, setDepartment] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  // ✅ Fetch books with filters
  const fetchBooks = async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams({
        q: filters.searchQuery || "",
        category: filters.category || "",
        department: filters.department || "",
      }).toString();

      const res = await API.get(`/api/books?${queryParams}`);
      setBooks(res.data);
      setMessage({ text: "", type: "" });
    } catch (err) {
      console.error(err);
      setMessage({ text: "Failed to fetch books.", type: "error" });
    }
  };

  // ✅ Fetch available categories and departments dynamically
  const fetchFilters = async () => {
    try {
      const [catRes, depRes] = await Promise.all([
        API.get("/api/books/categories"),
        API.get("/api/books/departments"),
      ]);
      setCategories(catRes.data || []);
      setDepartments(depRes.data || []);
    } catch (err) {
      console.error("Failed to fetch filter data:", err);
    }
  };

  // ✅ Initial load
  useEffect(() => {
    fetchBooks();
    fetchFilters();
  }, []);

  // ✅ Auto-update books when search/filter changes (with debounce)
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchBooks({ searchQuery, 
        // category,
         department });
    }, 500); // 0.5s debounce

    return () => clearTimeout(delay);
  }, [searchQuery, 
    // category,
     department]);

  // ✅ Handle book request
  const handleRequest = async (bookId, title) => {
    if (!isLoggedIn) {
      setMessage({ text: "Please log in to request a book.", type: "error" });
      return;
    }

    setMessage({ text: `Requesting "${title}"...`, type: "info" });
    try {
      await API.post(`/api/issues/request/${bookId}`);
      setMessage({
        text: `Successfully requested "${title}". Check 'My Books' for status.`,
        type: "success",
      });
    } catch (err) {
      console.error(err);
      setMessage({
        text:
          err.response?.data?.msg ||
          "Request failed. You might have already issued this book.",
        type: "error",
      });
    }
  };

  return (
    <div className="container mx-auto px-6 py-10">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-6 border-b-4 border-red-600 inline-block pb-2">
        📚 Book Catalog
      </h2>

      {/* Debug Info */}
      {/* <p className="text-sm text-gray-500 mb-4">
        Logged in:{" "}
        <span className="font-semibold">
          {isLoggedIn ? "Yes ✅" : "No ❌"}
        </span>{" "}
        | Role:{" "}
        <span className="font-semibold">
          {userRole ? userRole : "Not loaded yet..."}
        </span>
      </p> */}

      {/* 🔍 Search + Filters */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mb-8">
        {/* Live Search */}
        <input
          type="text"
          placeholder="Search by Title or Author"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />

        {/* Dynamic Category Filter */}
        {/* <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select> */}

        {/* Dynamic Department Filter */}
        {/* <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
        >
          <option value="">All Departments</option>
          {departments.map((dep) => (
            <option key={dep} value={dep}>
              {dep}
            </option>
          ))}
        </select> */}
      </div>

      {/* ⚠️ Message */}
      {message.text && (
        <div
          className={`p-3 mb-6 rounded-lg text-sm font-medium ${
            message.type === "error"
              ? "bg-red-100 text-red-700 border border-red-300"
              : message.type === "success"
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-blue-100 text-blue-700 border border-blue-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* 📖 Book List */}
      {books.length === 0 ? (
        <p className="text-gray-600 text-center mt-10 text-lg">
          No books found. Try changing search or filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {books.map((b) => (
            // console.log("jqnd", b)
            <div
              key={b._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-transform duration-300 hover:-translate-y-1 border border-gray-200"
            >
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {b.title}
                </h3>
                <p className="text-sm text-gray-600 italic mb-3">
                  by {b.author}
                </p>
                <p className="text-sm font-medium mb-2">
                  Available:{" "}
                  <span
                    className={`${
                      b.copiesAvailable > 0
                        ? "text-green-600 font-semibold"
                        : "text-red-600 font-semibold"
                    }`}
                  >
                    {b.copiesAvailable}
                  </span>
                </p>
                {/* <p className="text-xs text-gray-500 mb-2">
                  ISBN: {b.isbn || "N/A"}
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  Category: {b.category || "N/A"}
                </p> */}
                {/* <p className="text-xs text-gray-500 mb-4">
                  Department: {b.department || "N/A"}
                </p> */}

                {!isLoggedIn && (
                  <button className="w-full bg-gray-300 text-gray-700 font-semibold py-2.5 rounded-lg cursor-not-allowed">
                    Login to Request
                  </button>
                )}

                {isLoggedIn && b.copiesAvailable > 0 && (
                  <button
                    onClick={() => handleRequest(b._id, b.title)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg transition duration-150"
                  >
                    Request Book
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

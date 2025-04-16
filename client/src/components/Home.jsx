import React, { useState } from "react";
import {
  Badge,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  useGetAllCustomerQuery,
  useGetUniqueTagsQuery,
} from "../services/api.config";
import { Cancel, Search, ArrowDropDown } from "@mui/icons-material";
import PaginationLayout from "./layout/pagination/pagination";

const Home = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTags, setFilterTags] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;
  const tags = filterTags.join(",");
  const {
    data: customersData,
    isLoading: isCustomersLoading,
    error: customersError,
  } = useGetAllCustomerQuery({
    page,
    limit,
    search: searchQuery,
    tags,
  });
  const { data: tagsData, error: tagsError } = useGetUniqueTagsQuery();

  const isLoading = isCustomersLoading; // Simplify loading check

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <CircularProgress className="text-blue-500 text-4xl" />
      </div>
    );
  }

  if (customersError || tagsError) {
    return (
      <div className="text-red-500 text-center text-lg font-semibold">
        Error: {customersError?.message || tagsError?.message}
      </div>
    );
  }

  const totalPages = customersData?.totalPages || 1;
  const totalItems = customersData?.totalCustomers || 0;
  const filteredCustomers = customersData?.customers || [];

  const handleTagChange = (tag) => {
    setFilterTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
    setPage(1);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="flex flex-col p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white shadow-lg rounded px-6 pt-6">
          <div className="flex justify-between mb-4">
            <Typography variant="h5" className="font-semibold text-gray-800">
              Customers List
            </Typography>
            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="search"
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg transition-all duration-200"
                />
              </div>
              <div className="relative w-[250px]">
                <div
                  className="border border-gray-300 rounded-md px-3 py-2 bg-white flex items-center justify-between cursor-pointer hover:bg-gray-100 transition"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span className="text-gray-600">
                    {filterTags.length > 0
                      ? filterTags.join(", ")
                      : "Select Tags"}
                  </span>
                  <ArrowDropDown />
                </div>
                {dropdownOpen && (
                  <div className="absolute left-0 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-md p-2 z-50">
                    {tagsData?.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center gap-2 p-2 cursor-pointer hover:bg-blue-100 rounded-md transition"
                      >
                        <input
                          type="checkbox"
                          checked={filterTags.includes(tag)}
                          onChange={() => handleTagChange(tag)}
                        />
                        <span className="text-gray-700">{tag}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="h-[400px] w-full overflow-auto rounded border border-gray-300">
            <Table>
              <TableHead>
                <TableRow className="bg-gray-100">
                  <TableCell className="font-semibold text-gray-700">
                    Name
                  </TableCell>
                  <TableCell className="font-semibold text-gray-700">
                    Email
                  </TableCell>
                  <TableCell className="font-semibold text-gray-700">
                    Company
                  </TableCell>
                  <TableCell className="font-semibold text-gray-700">
                    Tags
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-gray-500 font-medium"
                    >
                      No customers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow
                      key={customer.id}
                      className="cursor-pointer hover:bg-gray-50 transition"
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.company}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {customer.tags.map((tag, index) => (
                            <Badge
                              key={`${tag}-${index}`}
                              variant="outlined"
                              className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="p-2">
            <PaginationLayout
              totalPages={totalPages}
              page={page}
              onChangePage={handleChangePage}
              totalItems={totalItems}
              itemsPerPage={limit}
              type={"customers"}
            />
          </div>
        </div>
        {selectedCustomer && (
          <div className="w-full md:w-1/3 bg-white shadow-lg rounded p-6">
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h5" className="font-semibold text-gray-800">
                Customer Details
              </Typography>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <Cancel className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {["Name", "Email", "Phone", "Company", "Location"].map(
                (field) => (
                  <div key={field} className="space-y-2">
                    <span className="font-semibold">{field}:</span>
                    <p>{selectedCustomer[field.toLowerCase()] || "N/A"}</p>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

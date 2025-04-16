import React, { useState, useRef } from "react";
import {
  useCreateCustomerMutation,
  useDeleteCustomerMutation,
  useGetAllCustomerQuery,
  useUpdateCustomerMutation,
} from "../services/api.config";
import PaginationLayout from "./layout/pagination/pagination";
import { ArrowDropDown } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

const JobsPage = () => {
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    location: "",
    tags: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editCustomerId, setEditCustomerId] = useState(null);
  const [deletingCustomerId, setDeletingCustomerId] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const availableTags = ["Lead", "Prospect", "Client"];

  const {
    data: customersData,
    isLoading: loadingCustomers,
    error: errorCustomers,
    refetch,
  } = useGetAllCustomerQuery({ page, limit, search: "", tags: "" });

  const [createCustomer, { isLoading: creating, error: createError }] =
    useCreateCustomerMutation();
  const [updateCustomer, { isLoading: updating, error: updateError }] =
    useUpdateCustomerMutation();
  const [deleteCustomer, { error: deleteError }] = useDeleteCustomerMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({ ...newCustomer, [name]: value });
  };

  const handleTagChange = (tag) => {
    setNewCustomer((prevCustomer) => {
      const tags = prevCustomer.tags.includes(tag)
        ? prevCustomer.tags.filter((t) => t !== tag)
        : [...prevCustomer.tags, tag];
      return { ...prevCustomer, tags };
    });
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    if (
      Object.values(newCustomer).some((value) => !value && name !== "tags") ||
      newCustomer.tags.length === 0
    ) {
      alert("Please fill out all fields and add at least one tag");
      return;
    }
    try {
      await createCustomer(newCustomer).unwrap();
      setNewCustomer({
        name: "",
        email: "",
        phone: "",
        company: "",
        location: "",
        tags: [],
      });
      alert("Customer created successfully!");
      refetch();
    } catch (err) {
      console.error("Error creating Customer:", err);
      alert(
        `Error creating Customer: ${
          err?.data?.message || "Something went wrong"
        }`
      );
    }
  };

  const handleEditCustomer = (Customer) => {
    setIsEditing(true);
    setEditCustomerId(Customer.id);
    setNewCustomer({ ...Customer });
  };

  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    try {
      await updateCustomer({
        id: editCustomerId,
        updateData: newCustomer,
      }).unwrap();
      alert("Customer updated successfully!");
      setIsEditing(false);
      setEditCustomerId(null);
      setNewCustomer({
        name: "",
        email: "",
        phone: "",
        company: "",
        location: "",
        tags: [],
      });
      refetch();
    } catch (err) {
      console.error("Error updating Customer:", err);
      alert(
        `Error updating Customer: ${
          err?.data?.message || "Something went wrong"
        }`
      );
    }
  };

  const handleDeleteCustomer = async (CustomerId) => {
    if (window.confirm("Are you sure you want to delete this Customer?")) {
      setDeletingCustomerId(CustomerId);
      try {
        await deleteCustomer({ id: CustomerId }).unwrap();
        alert("Customer deleted successfully!");
        refetch();
      } catch (err) {
        console.error("Error deleting Customer:", err);
        alert(
          `Failed to delete Customer: ${
            err?.data?.message || "Please try again."
          }`
        );
      } finally {
        setDeletingCustomerId(null);
      }
    }
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const totalPages = customersData?.totalPages || 1;
  const totalItems = customersData?.totalCustomers || 0;
  return (
    <div className="min-h-full p-6">
      <h1 className="text-3xl font-bold mb-6">Customers Management</h1>

      <form
        onSubmit={isEditing ? handleUpdateCustomer : handleAddCustomer}
        className="mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="p-2 border rounded bg-white"
            value={newCustomer.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="p-2 border rounded bg-white"
            value={newCustomer.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            className="p-2 border rounded bg-white"
            value={newCustomer.location}
            onChange={handleInputChange}
            required
          />
          <div className="relative w-full">
            <div
              className="border rounded px-3 py-2 bg-white flex items-center justify-between cursor-pointer hover:bg-gray-100 transition"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span className="text-gray-600">
                {newCustomer.tags.length > 0
                  ? newCustomer.tags.join(", ")
                  : "Select Tags"}
              </span>
              <ArrowDropDown />
            </div>
            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-md p-2 z-50">
                {availableTags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-2 p-2 cursor-pointer hover:bg-blue-100 rounded-md transition"
                  >
                    <input
                      type="checkbox"
                      checked={newCustomer.tags.includes(tag)}
                      onChange={() => handleTagChange(tag)}
                    />
                    <span className="text-gray-700">{tag}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <input
            type="text"
            name="company"
            placeholder="Company"
            className="p-2 border rounded bg-white"
            value={newCustomer.company}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            className="p-2 border rounded bg-white"
            value={newCustomer.phone}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            disabled={creating || updating}
            className={`px-4 py-2 rounded ${
              creating || updating
                ? "bg-blue-300 cursor-not-allowed flex items-center justify-center gap-2"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            {creating || updating ? (
              <>
                <CircularProgress size={20} className="text-white" />
                {isEditing ? "Updating Customer..." : "Adding Customer..."}
              </>
            ) : isEditing ? (
              "Update Customer"
            ) : (
              "Add Customer"
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setNewCustomer({
                name: "",
                email: "",
                phone: "",
                company: "",
                location: "",
                tags: [],
              });
              setIsEditing(false);
              setEditCustomerId(null);
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>

      {(createError || updateError || deleteError) && (
        <p className="text-red-500 mb-4">
          Error:{" "}
          {createError?.data?.message ||
            updateError?.data?.message ||
            deleteError?.data?.message ||
            "Something went wrong"}
        </p>
      )}

      <table className="w-full border-collapse border border-gray-300 bg-white">
        <thead>
          <tr className="bg-gray-300">
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Phone</th>
            <th className="border border-gray-300 px-4 py-2">Company</th>
            <th className="border border-gray-300 px-4 py-2">Location</th>
            <th className="border border-gray-300 px-4 py-2">Tags</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loadingCustomers ? (
            <tr>
              <td colSpan="7" className="text-center py-4">
                <CircularProgress />
              </td>
            </tr>
          ) : errorCustomers ? (
            <tr>
              <td colSpan="7" className="text-center py-4 text-red-500">
                Error loading Customers:{" "}
                {errorCustomers.message || "Something went wrong"}
              </td>
            </tr>
          ) : customersData?.customers?.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-4">
                No Customers found. Add a new Customer above!
              </td>
            </tr>
          ) : (
            customersData?.customers?.map((customer) => (
              <tr key={customer.id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">
                  {customer?.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {customer?.email}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {customer?.phone}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {customer?.company}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {customer?.location}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {customer?.tags.join(", ")}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleEditCustomer(customer)}
                    className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCustomer(customer.id)}
                    disabled={deletingCustomerId === customer.id}
                    className={`px-2 py-1 rounded text-white ${
                      deletingCustomerId === customer.id
                        ? "bg-red-300 cursor-not-allowed flex items-center justify-center gap-2"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {deletingCustomerId === customer.id ? (
                      <>
                        <CircularProgress size={20} className="text-white" />
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <PaginationLayout
        totalPages={totalPages}
        page={page}
        onChangePage={handleChangePage}
        totalItems={totalItems}
        itemsPerPage={limit}
        type={"customers"}
      />
    </div>
  );
};

export default JobsPage;
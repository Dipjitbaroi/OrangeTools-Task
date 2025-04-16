import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Custom base query with re-authentication logic
const baseQueryWithReauth = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}`,
    prepareHeaders: (headers) => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  const result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    window.location.href = "/login";
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
  }

  return result;
};

// Define a service using a base URL and expected endpoints
export const configApi = createApi({
  reducerPath: "Api",
  baseQuery: baseQueryWithReauth, // Use the custom base query
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `/auth/login`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `/auth/register`,
        method: "POST",
        body: data,
      }),
    }),
    getProfile: builder.query({
      query: () => `/auth/me`,
    }),
    createCustomer: builder.mutation({
      query: (data) => ({
        url: `/customers/`,
        method: "POST",
        body: data,
      }),
    }),
    getAllCustomer: builder.query({
      query: ({ page = 1, limit = 10, search = "", tags = "" }) =>
        `/customers/all/?search=${search}&page=${page}&limit=${limit}&tags=${tags}`,
    }),
    updateCustomer: builder.mutation({
      query: ({ id, updateData }) => ({
        url: `/customers/${id}`,
        method: "PUT",
        body: updateData,
      }),
    }),
    deleteCustomer: builder.mutation({
      query: ({ id }) => ({
        url: `/customers/${id}`,
        method: "DELETE",
      }),
    }),
    getUniqueTags: builder.query({
      query: () => `/customers/tags/unique`,
    }),
    uploadCSV: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: `/upload/csv`,
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useCreateCustomerMutation,
  useGetAllCustomerQuery,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useGetUniqueTagsQuery,
  useUploadCSVMutation,
} = configApi;

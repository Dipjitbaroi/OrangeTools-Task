import React from "react";
import { Pagination } from "@mui/material";

const PaginationLayout = ({
  totalPages,
  page,
  totalItems,
  itemsPerPage,
  onChangePage,
  type,
}) => {
  const startItem = totalItems === 0 ? 0 : (page - 1) * itemsPerPage + 1;
  const endItem = Math.min(page * itemsPerPage, totalItems);

  const handlePageChange = (event, value) => {
    onChangePage(value);
  };

  return (
    <div className="flex justify-between py-2">
      <div>
        <p>
          Showing {startItem}-{endItem} of {totalItems} {type}
        </p>
      </div>
      <div>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          shape="rounded"
          sx={{
            "& .MuiPaginationItem-root.Mui-selected": {
              color: "#ffffff!important", // Text color of the selected page button
              backgroundColor: "#182F59!important", // Background color of the selected page button
            },
          }}
        />
      </div>
    </div>
  );
};

export default PaginationLayout;

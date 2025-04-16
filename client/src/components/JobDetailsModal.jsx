import React from "react";
import { Box, Typography, Modal, Button, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
};

// Default job details
const defaultJobDetails = {
  title: "Default Job Title",
  overview: "This is a default job overview.",
  description:
    "This is a default job description providing more details about the role.",
  location: "Default Location",
  salary: "Default Salary",
};

const JobDetailsModal = ({ open, handleClose, jobDetails }) => {
  const details = jobDetails || defaultJobDetails; // Fallback to default data

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="job-details-title"
      aria-describedby="job-details-description"
    >
      <Box sx={style}>
        {/* Close Button */}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: -20,
            right: -20,
            backgroundColor: "#f5f5f5",
            "&:hover": {
              backgroundColor: "#e0e0e0",
            },
          }}
        >
          <Close />
        </IconButton>

        {/* Job Details */}
        <Typography id="job-details-title" variant="h6" component="h2">
          {details?.title}
        </Typography>
        <Typography id="job-details-description" sx={{ mt: 2 }}>
          <strong>Overview:</strong> {details?.overview}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          <strong>Description:</strong> {details?.description}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          <strong>Location:</strong> {details?.location}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          <strong>Salary:</strong> {details?.salary}
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 3, width: "100%" }}
          onClick={() => alert("Application Submitted!")}
        >
          Submit Application
        </Button>
      </Box>
    </Modal>
  );
};

export default JobDetailsModal;

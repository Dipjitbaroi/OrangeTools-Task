import React, { useState } from "react";
import {
  Button,
  Typography,
  Card,
  CardContent,
  CardHeader,
  LinearProgress,
} from "@mui/material";
import {
  InsertDriveFile,
  ErrorOutline,
  CheckCircleOutline,
  DeleteOutline,
} from "@mui/icons-material";
import { useUploadCSVMutation } from "../services/api.config";

const Docs = () => {
  const [file, setFile] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [message, setMessage] = useState("");
  const [uploadCSV, { isLoading }] = useUploadCSVMutation();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (
        selectedFile.type !== "text/csv" &&
        !selectedFile.name.endsWith(".csv")
      ) {
        setMessage("Invalid file type. Please upload a .csv file.");
        setFile(null);
        return;
      }

      event.target.value = ""; // Reset file input

      setFile(selectedFile);
      setMessage("");
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    try {
      const response = await uploadCSV(file).unwrap();
      setResponseData(response.summary);
      setMessage(response.message || "File uploaded successfully!");
    } catch (error) {
      setMessage(error.data?.message || "An error occurred during upload.");
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setMessage("");
    setResponseData(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Upload CSV</h1>
      {isLoading && <LinearProgress sx={{ mt: 2 }} />}
      <div className="flex flex-col items-center justify-center mt-4">
        <Card sx={{ maxWidth: 500, padding: 2 }}>
          <CardHeader
            title="Upload CSV File"
            subheader="Import your data seamlessly."
          />
          <CardContent
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              id="file-upload"
              style={{ display: "none" }}
            />
            <label htmlFor="file-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<InsertDriveFile />}
              >
                Choose File
              </Button>
            </label>

            {file && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Typography color="textSecondary">{file.name}</Typography>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<DeleteOutline />}
                  onClick={handleRemoveFile}
                >
                  Remove File
                </Button>
              </div>
            )}

            <Button
              onClick={handleFileUpload}
              variant="contained"
              color="primary"
              disabled={isLoading || !file}
            >
              {isLoading ? "Uploading..." : "Upload File"}
            </Button>

            {message && (
              <div
                className={`p-2 rounded border ${
                  message.includes("error")
                    ? "border-red-500 bg-red-50 text-red-500"
                    : "border-green-500 bg-teal-50 text-green-500"
                } flex items-center gap-1`}
              >
                {message.includes("error") ? (
                  <ErrorOutline />
                ) : (
                  <CheckCircleOutline />
                )}
                <Typography>{message}</Typography>
              </div>
            )}

            {responseData && (
              <div
                style={{
                  padding: 10,
                  backgroundColor: "#f5f5f5",
                  borderRadius: 4,
                }}
              >
                <Typography variant="subtitle1">Upload Summary:</Typography>
                <Typography>
                  Total Processed: {responseData.totalProcessed}
                </Typography>
                <Typography>
                  Total Skipped: {responseData.totalSkipped}
                </Typography>
                <Typography>
                  Total Failed: {responseData.totalFailed}
                </Typography>

                {responseData.errorSummary && (
                  <div
                    style={{
                      padding: 8,
                      borderRadius: 4,
                      border: "1px solid red",
                      backgroundColor: "#ffebee",
                      color: "red",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <ErrorOutline /> Skipping Reasons:
                    </Typography>
                    <ul style={{ marginLeft: 16 }}>
                      <li>
                        <Typography>
                          Validation Errors:{" "}
                          {responseData.errorSummary.validation}
                        </Typography>
                      </li>
                      <li>
                        <Typography>
                          Duplicate Entries:{" "}
                          {responseData.errorSummary.duplicates}
                        </Typography>
                      </li>
                      <li>
                        <Typography>
                          Processing Failures:{" "}
                          {responseData.errorSummary.failed}
                        </Typography>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Description Section */}
      <div>
        <CardHeader title="📌 Description" />
        <CardContent>
          <Typography variant="body1" gutterBottom>
            The file uploading time should be 2-5 min for 1 million depending on
            the system configuration
          </Typography>
          <Typography variant="body1" gutterBottom>
            The following are common reasons why some rows were skipped during
            the upload process:
          </Typography>
          <ul style={{ paddingLeft: 16, listStyleType: "disc" }}>
            <li>
              <Typography variant="body2">
                <strong>❌ Validation Errors:</strong> Some rows have invalid
                data formats that failed validation checks.
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <strong>🔁 Duplicate Entries:</strong> The data in these rows
                already exists in the system, causing duplication.
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <strong>⚠️ Processing Failures:</strong> Unexpected system
                errors prevented these rows from being processed.
              </Typography>
            </li>
          </ul>
          <Typography variant="body1" style={{ marginTop: 12 }}>
            ✅ <strong>Tip:</strong> To reduce errors, check your CSV file for
            formatting issues and duplicates before uploading.
          </Typography>
        </CardContent>
      </div>
    </div>
  );
};

export default Docs;

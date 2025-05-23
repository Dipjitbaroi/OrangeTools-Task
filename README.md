# Mini CRM Dashboard

## Overview

This project is a simplified Customer Relationship Management (CRM) dashboard built as a take-home assignment. It allows users to manage customer information, categorize them with tags, search and filter through the customer base, and provides an admin panel for uploading customer data in bulk via CSV. The application is built using ReactJS for the frontend, Node.js and Express for the backend API, and PostgreSQL for data persistence. It is also containerized using Docker for easy setup and deployment.

## Core Features

* **Customer Management:**
    * Add new customers with name, email, phone, and company.
    * Edit existing customer information.
    * Delete customers.
* **Tagging System:**
    * Assign multiple tags (e.g., Lead, Prospect, Client) to each customer.
    * Filter customers based on one or more selected tags.
* **Search & Filter:**
    * Search customers by name, email, or phone.
    * Combine search with tag filtering.
* **CSV Upload (Admin Panel):**
    * Admin interface to upload CSV files containing up to 1 million customer records.
    * Data validation for email format, required fields, and duplicate entries.
    * Efficient backend processing using batch inserts, streaming, or queue-based methods to handle large datasets.
    * Basic progress and summary display after upload (total processed, skipped, failed).
* **Backend API:**
    * RESTful API endpoints for customer management, tagging, search, filtering, and CSV upload.
    * Built with Node.js and Express.
    * PostgreSQL database for storing application data.
    * Basic token-based authentication for protecting admin-related routes (e.g., CSV upload).
* **Frontend:**
    * User-friendly and responsive interface built with ReactJS using hooks and functional components.
    * Minimal navigation with clear sections for Dashboard, Customers, and Upload (admin only).
* **Dockerization:**
    * Dockerfiles for containerizing both the frontend and backend applications.
    * `docker-compose.yml` file to orchestrate the full stack (frontend, backend, and PostgreSQL database).
    * `.env` file support for configuring environment variables for all services.

### The JavaScript Heap Memory Allocation Problem

The JavaScript engine (both in web browsers for frontend code and in Node.js for backend code) uses a region of memory called the **heap** to store dynamic data like objects, arrays, and strings. This heap has a limited size.

**The Problem with Large CSVs:**

A naive approach to processing a CSV file involves reading the entire file content into memory at once. For large files containing hundreds of thousands or millions of rows, this can lead to severe memory issues:

1.  **Memory Exhaustion:** Loading the entire CSV content as a single string or parsing it into a large array of JavaScript objects can easily exceed the available heap memory. This results in an "**Out of Memory**" (OOM) error, causing the application to crash.

2.  **Performance Degradation:** Even before crashing, the attempt to allocate and manage such massive data structures puts immense pressure on the JavaScript engine's garbage collector. The garbage collector frequently pauses the main execution thread to reclaim memory, leading to:
    * **Unresponsive Application:** The user interface (in the frontend) or the server (in the backend) becomes slow and unresponsive.
    * **High CPU Usage:** The garbage collection process itself consumes significant CPU resources.

3.  **Inefficient Processing:** Once the entire dataset is in memory, performing operations like validation, transformation, or individual database insertions can be slow and further contribute to memory pressure by creating intermediate data structures.

**Why This is Critical for This Project:**

Given the requirement to handle up to 1 million customer records via CSV upload, directly loading and processing the entire file in memory is not a viable solution. It would likely lead to frequent crashes and a poor user experience.

### Mitigation Strategies Employed

To avoid the JavaScript heap memory allocation problem, this project will employ the following efficient techniques:

* **Backend Streaming:** The backend (Node.js) will utilize streams to read the CSV file in small chunks. This means only a small portion of the file resides in memory at any given time. Libraries like `fs.createReadStream` and a CSV parsing library will process the data incrementally.

* **Batch Inserts:** Instead of inserting each customer record into the PostgreSQL database individually, the backend will group validated records into batches and perform bulk insert operations. This significantly reduces the number of database queries and the memory overhead associated with individual insertions.

* **Optional Queue-Based Processing (for extreme cases):** For very large files or computationally intensive processing, a message queue (like RabbitMQ or Kafka) could be used. The backend could process the uploaded file in chunks and enqueue individual records or batches as jobs. Separate worker processes would then consume these jobs and perform the database operations. This further isolates the upload handling from the data processing and allows for better resource management and scalability.

## Project Structure and Tech Choices

├───client          # Frontend application (ReactJS)
│   ├───.vite      # Vite build artifacts and cache
│   │   └───deps
│   ├───public     # Static assets
│   └───src        # Source code
│       ├───assets   # Images, fonts, etc.
│       ├───components # Reusable UI components
│       │   └───layout # Layout related components (e.g., navigation, pagination)
│       │       └───pagination
│       ├───services # API service for interacting with the backend
│       ├───store    # State management (e.g., Context API, Redux - can be specified later)
│       └───utils    # Utility functions
├───nginx           # Configuration for Nginx (if used for reverse proxy in production)
└───server          # Backend API (Node.js and Express)
├───controllers # Logic for handling API requests
├───data        # Sample data or temporary storage (can be removed later)
├───middlewares # Middleware functions (e.g., authentication)
├───models      # Data models (e.g., using Prisma or Sequelize)
├───prisma      # Prisma ORM related files (if used)
│   └───migrations # Database schema migrations
│       └───20250414134100_newdb # Example migration file
├───routes      # API endpoint definitions
└───utils       # Backend utility functions

**Tech Choices:**

* **Frontend:** ReactJS, Vite (for build tooling), potentially a UI library like Material UI or Tailwind CSS (for styling - can be specified later).
* **Backend:** Node.js, Express.js, PostgreSQL.
* **Database ORM:** Prisma (chosen for type safety and ease of use) or Sequelize.
* **Containerization:** Docker and Docker Compose.
* **Authentication:** JSON Web Tokens (JWT) for basic token-based authentication.

## Setup & Run Instructions

### Prerequisites

* Node.js and npm (or yarn) installed.
* Docker and Docker Compose installed.

### Local Development Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```

2.  **Backend Setup:**
    ```bash
    cd server
    npm install  # or yarn install
    # Configure environment variables in a new .env file based on .env.example (if provided)
    # Example .env for server:
    # DATABASE_URL="postgresql://user:password@host:port/database"
    # JWT_SECRET="your-secret-key"
    npx prisma migrate dev --name init # Initialize database and run migrations (if using Prisma)
    npm run dev    # or yarn dev (to start the development server)
    ```

3.  **Frontend Setup:**
    ```bash
    cd ../client
    npm install  # or yarn install
    # Configure environment variables in a new .env file based on .env.example (if provided)
    # Example .env for client:
    # VITE_API_BASE_URL="http://localhost:3000/api"
    npm run dev    # or yarn dev (to start the development server)
    ```

    The frontend will typically be accessible at `http://localhost:5173` (or a similar port), and the backend API at `http://localhost:3000/api`.

### Running with Docker

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```

2.  **Create `.env` files:**
    * Create a `.env` file in the `server` directory with your PostgreSQL connection details and JWT secret:
        ```
        DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>"
        JWT_SECRET="your-secret-key"
        ```
    * Create a `.env` file in the `client` directory to configure the backend API URL:
        ```
        VITE_API_BASE_URL="http://localhost:3000/api" # Adjust if you map ports differently
        ```

3.  **Run Docker Compose:**
    ```bash
    docker-compose up -d --build
    ```

    This command will build the Docker images for the frontend, backend, and PostgreSQL database, and then start the containers in detached mode.

4.  **Access the application:**
    * Frontend: Typically accessible at `http://localhost:80` (or the port mapped in your `docker-compose.yml`).
    * Backend API: Accessible at `http://localhost:3000/api`.
    * Database: Running within the Docker network.

5.  **Stop the Docker containers:**
    ```bash
    docker-compose down
    ```

## CSV Upload Instructions

### Accessing the Admin Panel

The CSV upload functionality will be located within an "Upload" or "Admin" section in the frontend navigation. This section might be protected by basic authentication.

### CSV File Format Expectations

The CSV file should adhere to the following format:

* **Headers:** The first row of the CSV file must contain the following column headers (case-insensitive): `name`, `email`, `phone`, `company`. The order of the columns does not matter.
* **Data Rows:** Each subsequent row represents a customer record, with values corresponding to the headers.
* **Required Fields:** The `name` and `email` fields are mandatory for each customer record. Rows missing these fields will be skipped.
* **Email Format:** The `email` field will be validated to ensure it is a valid email address format. Invalid email addresses will cause the corresponding row to be skipped.
* **Duplicate Entries:** The backend will check for duplicate customer entries based on the `email` field. Duplicate entries found in the CSV will be skipped, and existing customers in the database with the same email will not be updated by the upload.
* **File Size Limit:** While the system is designed to handle up to 1 million records, the actual upload time and memory usage might depend on the server resources.

### Upload Process

1.  Navigate to the "Upload" or "Admin" section in the frontend.
2.  Click on the "Choose File" or a similar button to select the CSV file from your local machine.
3.  Click the "Upload" button to initiate the upload process.
4.  The frontend will display a basic progress indicator (if implemented) during the upload.
5.  Once the upload is complete, a summary will be shown, indicating:
    * Total number of rows processed.
    * Number of new customers successfully added.
    * Number of rows skipped due to validation errors (with potential reasons).
    * Number of duplicate entries skipped.

### Sample CSV File

```csv
name,email,phone,company,location,tags
John Doe,john.doe@example.com,1234567890,Doe Enterprises,Dhaka,"lead,prospect"
Jane Smith,jane.smith@example.com,9876543210,Smith & Co,Dhaka,prospect
Robert Jones,robert.jones@example.com,5551234567,Jones Inc,Dhaka,"lead,client"
Mary Brown,mary.brown@example.com,2223334444,Brown Ltd,Dhaka,prospect
Michael Davis,michael.davis@example.com,7778889999,Davis Group,Dhaka,client
Jennifer Wilson,jennifer.wilson@example.com,4445556666,Wilson Corp,Dhaka,lead
David Garcia,david.garcia@example.com,3332221111,Garcia LLC,Dhaka,prospect
Linda Rodriguez,linda.rodriguez@example.com,8887776666,Rodriguez Co,Dhaka,client
Christopher Williams,christopher.williams@example.com,6665554444,Williams & Sons,Dhaka,"prospect,client"
Angela Garcia,angela.garcia@example.com,4443332222,Garcia Bros,Dhaka,lead
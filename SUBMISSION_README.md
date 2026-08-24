# StudyFlow Submission Readme

- **Student:** Chaitanya Verma
- **Domain:** Full Stack Development
- **Project:** StudyFlow
- **Completed Tasks:** Tasks 1–6

## Project Location
The final integrated project codebase is located in the `Final-StudyFlow-Project/` directory within this submission folder.

## Task-Wise Folder Explanation
To demonstrate the incremental progress of the internship, clean exports of the codebase at the end of each task are provided in their respective folders:
- `Task-1/`: HTML Structure and Basic Server Interaction
- `Task-2/`: Client/Server Validation and Temporary Storage
- `Task-3/`: Advanced CSS and Responsive Design
- `Task-4/`: Dynamic DOM Manipulation and Client-Side Routing
- `Task-5/`: REST API and Front-End Interaction
- `Task-6/`: Database Integration and User Authentication

> **Note:** The `Final-StudyFlow-Project/` directory is functionally identical to the `Task-6/` directory.

## Installation Instructions

1. Open a terminal and navigate to the `Final-StudyFlow-Project` directory.
2. Install the required dependencies:
   ```bash
   npm install
   ```

## Environment Setup

> **⚠️ IMPORTANT NOTE:** All `node_modules/` folders and `.env` files containing real secrets (such as the private MongoDB URI and Session Secret) have been intentionally excluded from this submission to adhere to security best practices.

To run the application, you must configure a local `.env` file:
1. Locate the `.env.example` file in the project root.
2. Duplicate it and rename it to `.env`.
3. Fill in the required fields with your own test MongoDB Atlas connection string and a random session secret.

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=your_test_mongodb_connection_string
SESSION_SECRET=a_random_secure_string
```

Once the `.env` file is configured, start the application:
```bash
npm start
```
The application will be accessible at `http://localhost:3000`.

## GitHub Repository Link
[StudyFlow Internship Repository](https://github.com/chaitanyaverma-blockchain/StudyFlow-Internship)
*(Note: Tasks 7 and 8 have not been implemented).*

# StudyFlow – Project Report
**Author:** Chaitanya Verma
**Domain:** Full Stack Development Internship

## Introduction
StudyFlow is a student productivity web application designed to help students organize their studies, manage assignments, and track deadlines efficiently.

## Problem Statement
Students often struggle with managing multiple assignments, deadlines, and study materials across different subjects. Traditional to-do lists lack the specific categorizations and features required for academic workloads.

## Objective
To build a comprehensive, full-stack Task Manager specifically tailored for students, demonstrating a progression of web development skills from basic HTML to a fully secure, database-backed application.

## Tasks Summary
- **Task 1: HTML Structure & Server Interaction** - Established the basic Express.js server, EJS templating engine, and fundamental HTML structure.
- **Task 2: Client/Server Validation & Temporary Storage** - Implemented robust form validation to ensure data integrity, temporarily storing data in an in-memory array.
- **Task 3: Advanced CSS & Responsive Design** - Integrated Bootstrap 5 to create a mobile-first, responsive interface with a custom dark mode toggle.
- **Task 4: Dynamic DOM Manipulation** - Added client-side filtering, sorting, and modal interactions without requiring full page reloads.
- **Task 5: REST API Integration** - Exchanged direct form submissions for a fully functional JSON REST API and `fetch()` interactions.
- **Task 6: Database Integration & Authentication** - Migrated the application to MongoDB, added secure `bcrypt` user authentication, and implemented session management.

## Technologies
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas), Mongoose
- **Authentication:** express-session, connect-mongo, bcryptjs
- **Frontend:** HTML5, CSS3, Vanilla JavaScript, Bootstrap 5, EJS

## Architecture
StudyFlow follows the Model-View-Controller (MVC) architectural pattern. Express handles routing, EJS renders dynamic views on the server, Mongoose interacts with the MongoDB cluster, and Vanilla JavaScript handles dynamic DOM updates and API calls on the client.

## MongoDB Models
The application relies on two primary collections:
1. **Users:** Stores account details and securely hashed passwords.
2. **Tasks:** Stores task details, referencing the `owner`'s User ID to ensure strict data isolation.

## Authentication Flow
Users register with an email and password. The password is hashed using `bcrypt` and stored in MongoDB. Upon login, the credentials are verified and a secure HTTP-only session cookie is issued via `express-session` and `connect-mongo`.

## REST API
The REST API is structured under the `/api/` prefix, providing complete CRUD functionality for tasks. All API endpoints respond with a standardized JSON structure containing `success`, `message`, and `data` or `errors`.

## Authorization
All protected API endpoints require an active session. Mongoose queries strictly enforce that any requested task matches both the provided Task ID and the authenticated user's ID (`owner: req.session.userId`), preventing unauthorized access.

## Validation
Validation is performed twice:
1. **Client-side:** Provides instant feedback to the user before submission.
2. **Server-side:** Ensures data integrity against malicious or bypassed client validation, returning structured error messages.

## Responsive Design
The UI leverages Bootstrap 5's grid system, adapting seamlessly from 375px mobile screens up to 1440px desktop monitors without horizontal overflow.

## Dark Mode
A custom dark mode toggle persists the user's preference in `localStorage`. CSS variables are used to dynamically swap the color palette across the entire application.

## Testing
Comprehensive testing was performed throughout development, ensuring proper error handling, successful database persistence, and secure authorization barriers between users.

## Challenges and Solutions
- **Challenge:** Handling DNS SRV resolution issues with Node.js 18+ and MongoDB Atlas.
  **Solution:** Configured explicit DNS fallbacks and sanitized the connection URI within `app.js`.
- **Challenge:** Preventing UI flashing during dark mode loading.
  **Solution:** Included a blocking `<script>` in the document `<head>` to immediately apply the stored theme before the body renders.

## Security Measures
- Passwords are never stored in plain text.
- API endpoints are protected against unauthorized access.
- Express sessions use secure cookies and MongoDB-backed persistence.

## Limitations
- The application currently relies on traditional session cookies rather than stateless JWTs, limiting potential scalability across disconnected mobile apps.
- No real-time updates (e.g., WebSockets).

## Future Scope
Future improvements could include:
- CI/CD integration and deployment (Task 7).
- A standalone React SPA frontend (Task 8).
- Email notifications for upcoming deadlines.

## Conclusion
StudyFlow successfully demonstrates a complete full-stack workflow, resulting in a secure, responsive, and fully functional productivity application tailored for students.

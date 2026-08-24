# 📄 StudyFlow – Internship Project Report

## 1. Problem Statement

Students frequently struggle with managing multiple academic tasks across different subjects. Without a centralized system, assignments get missed, deadlines are forgotten, and study time is poorly allocated. There is a need for a simple, accessible tool that helps students organize their coursework efficiently.

## 2. Objective

Develop a web-based student task management application called **StudyFlow** that allows students to:

- Create and organize study tasks with relevant details
- Track deadlines and prioritize work
- View, edit, and delete tasks through an intuitive interface
- Interact with a RESTful API for all data operations
- Use the application across devices with responsive design

The project was built incrementally across five internship tasks, each introducing progressively advanced web development concepts.

---

## 3. Task Implementation Summary

### Task 1 — HTML Structure & Basic Server Interaction

Set up the foundational project architecture using Node.js, Express.js, and EJS templating. Created the core pages (Home, Add Task, About, 404, Error) with a clean navigation system and server-side form handling.

**Key deliverables:** Express server, EJS partials, page routing, HTML form, custom CSS.

### Task 2 — Client/Server Validation & Temporary Storage

Extended the form with additional fields (email, category, estimated hours, confirmation) and implemented matching validation on both client and server. Introduced temporary in-memory storage using a JavaScript array.

**Key deliverables:** `taskValidation.js` middleware, `validation.js` client script, live character counter, form error preservation, task list page.

### Task 3 — Advanced CSS & Responsive Design

Integrated Bootstrap 5 for responsive layout. Redesigned all pages with a consistent design system using CSS custom properties. Implemented dark/light mode toggling with localStorage persistence.

**Key deliverables:** Bootstrap 5 integration, CSS variables for theming, dark mode toggle, responsive navbar, card layouts, animations with `prefers-reduced-motion` support.

### Task 4 — Dynamic DOM Manipulation & Client-Side Routing

Added advanced client-side features including live search, priority/status/deadline filtering, DOM-based sorting, task detail modals, completion toggling, and hash-based client-side routing.

**Key deliverables:** `tasks.js` script, dynamic filtering/sorting, Bootstrap modals, toast notifications, URL hash routing.

### Task 5 — REST API & Front-End Interaction

Refactored the application into a proper MVC-like architecture with separated routes, controllers, and data store. Created a complete RESTful API with six endpoints and migrated the frontend to use `fetch()` for all data operations.

**Key deliverables:** `apiRoutes.js`, `pageRoutes.js`, `taskController.js`, `taskStore.js`, `apiErrorHandler.js`, `api-docs.ejs`, standardized JSON responses.

---

## 4. Technologies Used

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 16+ | JavaScript runtime |
| Express.js | 4.18.x | Web framework |
| EJS | 3.1.x | Server-side templating |
| Bootstrap | 5.3.x | Responsive CSS framework |
| Vanilla JavaScript | ES6+ | Client-side interactivity |
| CSS3 | — | Custom styling with variables |
| Nodemon | 3.1.x | Development auto-restart |
| Git | — | Version control |

---

## 5. Challenges and Solutions

| Challenge | Solution |
|-----------|----------|
| Matching validation rules on client and server | Maintained identical validation logic in both `validation.js` and `taskValidation.js` |
| Preventing flash of wrong theme on page load | Added inline `<script>` in `<head>` that applies saved theme before body renders |
| Ensuring API errors return JSON instead of HTML | Created dedicated `apiErrorHandler.js` middleware that checks `req.originalUrl` prefix |
| DOM sorting without API round-trips | Used `data-*` attributes on card elements for client-side sort comparisons |
| Preventing XSS in dynamically rendered task data | Used `escapeHTML()` helper function when inserting task data via `innerHTML` |
| Duplicate task detection across client and server | Server checks in-memory store; client checks injected `window.activeTasks` array |

---

## 6. Testing Summary

### Functional Testing
- All page routes render correctly
- Form validation catches all invalid inputs (client and server)
- CRUD operations work through both UI and API
- Search, filter, and sort produce correct results
- Modals display and function correctly
- Theme toggle persists across pages and refreshes

### API Testing
- All six endpoints return correct status codes and JSON format
- Validation errors return 400 with field-specific error messages
- Non-existent resources return 404
- Invalid JSON payloads return 400
- Unknown API routes return 404 JSON

### Responsive Testing
- Tested at 375px, 768px, 1024px, and 1440px
- No horizontal overflow at any breakpoint
- Mobile navbar functions correctly
- Cards and forms adapt to screen width

### Theme Testing
- Dark and light modes verified on all pages
- No low-contrast or hidden text issues
- Theme persists after refresh and between pages

---

## 7. Conclusion

StudyFlow successfully demonstrates a full progression from basic server-side rendering to a complete REST API-driven application. The project covers core full-stack web development concepts including:

- Server setup and routing
- Template rendering
- Form design and validation
- Responsive and accessible UI design
- Dynamic DOM manipulation
- RESTful API architecture
- Client-server communication via fetch()

The application is functional, well-documented, and ready for the next phase of development (persistent database storage).

---

## 8. Future Scope

| Task | Description |
|------|-------------|
| Task 6 | MongoDB integration for persistent data storage |
| Task 7 | User authentication (login/register) and deployment |
| Task 8 | React frontend integration (optional) |

Additional improvements could include:
- Email notifications for approaching deadlines
- Task sharing between students
- Progress analytics and study time tracking
- Export/import of task data

---

## Author

**Chaitanya Verma**

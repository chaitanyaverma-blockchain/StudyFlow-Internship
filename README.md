# 📚 StudyFlow – Student Task Manager

A student productivity web application for organizing studies, managing assignments, and tracking deadlines.

---

## Internship Task 1 – Objective

Introduce server-side rendering and basic form submission using **Node.js**, **Express.js**, and **EJS**. This task sets up the foundational project structure that will be extended in Tasks 2–6.

### Task 1 Features

- ✅ Responsive navigation bar with working links
- ✅ Home page with hero section and feature cards
- ✅ Add Task page with a complete HTML form
- ✅ Server-side form handling with Express
- ✅ Task success page displaying submitted data dynamically
- ✅ About page with project information
- ✅ Custom 404 page for invalid routes
- ✅ Error handling page for server errors
- ✅ EJS partials for reusable header and footer
- ✅ Clean CSS with blue/purple colour palette
- ✅ Mobile-responsive layout

---

## Internship Task 2 – Objective

Extend the existing forms, add client-side interaction and validation, implement server-side validation, and temporarily store valid task data on the server using an in-memory array.

### Task 2 Features

- ✅ Extended form with new fields: email, category, estimated study hours, confirmation checkbox
- ✅ Client-side validation with live feedback (red/green borders, error messages)
- ✅ Live description character counter (e.g. `45/500`)
- ✅ Server-side validation middleware with identical rules
- ✅ Validation error messages displayed below each field
- ✅ Previously entered values preserved on validation failure
- ✅ Temporary in-memory task storage (array on server)
- ✅ Task list page with card display and empty state
- ✅ Duplicate submission prevention (submit button disabled after click)
- ✅ Form reset button with confirmation prompt
- ✅ "View Tasks" navigation link added

### New Form Fields (Task 2)

| Field | Type | Validation |
|---|---|---|
| Student Email | email | Required, valid email format |
| Task Category | select | Required (Assignment, Exam Preparation, Project, Revision, Other) |
| Estimated Study Hours | number | Required, between 1 and 100 |
| Confirmation Checkbox | checkbox | Must be checked before submission |

### Client-Side Validation Rules

| Field | Rule |
|---|---|
| Student Name | At least 2 characters, no numbers |
| Email | Valid email format |
| Task Title | Between 3 and 80 characters |
| Subject | At least 2 characters |
| Description | Between 10 and 500 characters |
| Deadline | Required, cannot be in the past |
| Priority | Must be selected |
| Category | Must be selected |
| Estimated Hours | Between 1 and 100 |
| Confirmation | Must be checked |

### Server-Side Validation

The same validation rules are applied on the server through Express middleware (`middleware/taskValidation.js`). The server:

- Trims all string inputs
- Rejects missing or invalid fields
- Rejects past deadlines
- Rejects hours outside the 1–100 range
- Rejects unchecked confirmation
- Never stores invalid data
- Re-renders the form with errors and preserved values on failure

### Temporary Storage

Task data is stored in a **server-side in-memory array**. Each task includes a unique ID, all form fields, a `completed` status (set to `false`), and a `createdAt` timestamp.

> ⚠️ **Important:** Stored data is erased every time the server restarts. This is temporary storage only. A real database (MongoDB) will be introduced in a later task.

### New Files (Task 2)

| File | Purpose |
|---|---|
| `middleware/taskValidation.js` | Server-side validation middleware |
| `public/js/validation.js` | Client-side validation with live feedback |
| `views/task-list.ejs` | Task list page with cards and empty state |

## Technologies Used

- **Node.js** – JavaScript runtime
- **Express.js** – Web framework for Node.js
- **EJS** – Embedded JavaScript templating engine
- **CSS** – Custom stylesheet for layout and design
- **Nodemon** – Development tool for auto-restarting the server

## Folder Structure

```
StudyFlow/
├── middleware/
│   └── taskValidation.js
├── public/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── validation.js
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── index.ejs
│   ├── add-task.ejs
│   ├── task-list.ejs
│   ├── task-success.ejs
│   ├── about.ejs
│   ├── 404.ejs
│   └── error.ejs
├── app.js
├── package.json
├── .gitignore
└── README.md
```

## Installation

1. Make sure [Node.js](https://nodejs.org/) is installed on your computer.

2. Clone or download this project, then open a terminal inside the `StudyFlow` folder.

3. Install dependencies:

   ```bash
   npm install
   ```

## Running the Project

**Development mode** (auto-restarts on file changes):

```bash
npm run dev
```

**Production mode**:

```bash
npm start
```

The server will start at **http://localhost:3000**.

## Available Routes

| Route           | Method | Description                              |
| --------------- | ------ | ---------------------------------------- |
| `/`             | GET    | Home page                                |
| `/tasks/new`    | GET    | Add Task form page                       |
| `/tasks`        | GET    | View all stored tasks                    |
| `/tasks`        | POST   | Handles form submission with validation  |
| `/about`        | GET    | About StudyFlow page                     |
| Any other route | GET    | Shows 404 Page Not Found                 |

## Testing Checklist

### Task 1 Tests

- [ ] `npm install` completes without errors
- [ ] `npm run dev` starts the server on port 3000
- [ ] Home page loads at `http://localhost:3000/`
- [ ] Navigation links work correctly
- [ ] About page loads at `http://localhost:3000/about`
- [ ] Visiting an invalid URL shows the 404 page
- [ ] CSS loads and styling appears correctly
- [ ] Layout is responsive on mobile and desktop

### Task 2 Tests – Valid Cases

- [ ] Add Task page loads with all fields at `http://localhost:3000/tasks/new`
- [ ] Submit a completely valid task
- [ ] Success page displays all submitted data including new fields
- [ ] Task appears on `/tasks` page
- [ ] Submit multiple valid tasks
- [ ] Task count updates on `/tasks` page

### Task 2 Tests – Invalid Cases

- [ ] Empty form shows all error messages
- [ ] Invalid email shows error
- [ ] Name with numbers shows error
- [ ] Short task title (less than 3 chars) shows error
- [ ] Description shorter than 10 characters shows error
- [ ] Description longer than 500 characters shows error
- [ ] Past deadline shows error
- [ ] Missing priority shows error
- [ ] Missing category shows error
- [ ] Estimated hours below 1 shows error
- [ ] Estimated hours above 100 shows error
- [ ] Unchecked confirmation shows error
- [ ] Direct POST with invalid data returns errors (server validation)
- [ ] Previously entered valid values are preserved on validation failure

### Task 2 Tests – Interactions

- [ ] Character counter updates live while typing description
- [ ] Fields show red border when invalid
- [ ] Fields show green border when valid
- [ ] Submit button disables after valid form submission
- [ ] Reset button asks for confirmation on partially filled form
- [ ] Task list shows empty state when no tasks exist
- [ ] Mobile layout works at approximately 375px

### Task 3 Tests – Responsive Design & UI

- [ ] Bootstrap 5 is successfully integrated and styles are active
- [ ] Navbar includes a functioning hamburger menu on mobile (approx. 375px)
- [ ] Homepage displays Hero, Features, How It Works, and Call-to-action sections
- [ ] Task list page `/tasks` displays summary cards (Total, High Priority, Upcoming, Completed)
- [ ] Tasks are displayed in a responsive Bootstrap card grid
- [ ] Priority badges use the correct colors (High=red, Medium=yellow/orange, Low=green)
- [ ] Add Task form uses a two-column responsive layout (single column on mobile)
- [ ] About page displays multiple sections (timeline/cards)
- [ ] CSS animations (e.g., fade-in, hover effects) are smooth and not distracting
- [ ] Dark Mode toggle works and saves preference in `localStorage`
- [ ] Accessibility: Sufficient contrast and `prefers-reduced-motion` support
- [ ] Previous Task 1 and 2 features (like validation and temporary storage) still function perfectly

## Internship Task 4 – Objective

Add more advanced form-validation rules, dynamically update the DOM based on user interactions, and implement lightweight client-side routing for a smoother experience without resorting to a full SPA framework.

### Task 4 Features

- ✅ **Advanced Validation**: Stricter rules for email, spaces, titles, and decimals.
- ✅ **Custom Category**: Dynamic field appears when "Other" is selected.
- ✅ **Dynamic Deadline Status**: Live display of "Due today", "Overdue!", etc.
- ✅ **Duplicate Checking**: Server-side and client-side warning for identical active tasks.
- ✅ **Live Search**: Filter task cards by title, subject, student without reloading.
- ✅ **Dynamic Filters**: Filter by Priority, Deadline status, and Completion state.
- ✅ **DOM Sorting**: Sort tasks by Date, Deadline, Priority, or Title purely via DOM manipulation.
- ✅ **Task Details Modal**: Bootstrap modal populated dynamically to view complete task data.
- ✅ **Completion Toggle**: Non-REST `POST /tasks/:id/toggle` endpoint accessed via `fetch()` to mark tasks completed/pending with visual DOM updates.
- ✅ **Client-side Routing**: Hash-based routing (`#all`, `#pending`, `#high-priority`) updates active filters automatically.
- ✅ **User Feedback**: Dynamic empty states and toast notifications on actions.

### New Files / Routes (Task 4)

| File / Route | Purpose |
|---|---|
| `public/js/tasks.js` | Manages DOM sorting, filtering, modals, and fetch calls |
| `POST /tasks/:id/toggle` | Server endpoint to toggle completion status temporarily |

## Future Development

This project will be extended progressively across the remaining internship tasks:

- ~~**Task 1** – HTML structure and basic server interaction~~
- ~~**Task 2** – Validation, interaction, and temporary storage~~
- ~~**Task 3** – Advanced CSS styling and responsive design (Bootstrap)~~
- ~~**Task 4** – Complex form validation and dynamic DOM manipulation~~
- **Task 5** – MongoDB integration for persistent data storage
- **Task 6** – REST API development
- **Task 7** – React frontend integration
- **Task 8** – Authentication and deployment

> **Note:** No database, authentication, or frontend framework has been added yet. Task data is stored temporarily in server memory and will be lost on restart. A real database will be introduced in Task 4.

# 📚 StudyFlow – Student Task Manager

A student productivity web application for organizing studies, managing assignments, and tracking deadlines. Built as part of a **Full Stack Development Internship** covering server-side rendering, form validation, responsive design, dynamic DOM manipulation, and REST API integration.

---

## 📋 Internship Context

**StudyFlow** was developed incrementally across five internship tasks, each building on the previous to demonstrate progressively advanced web development skills:

| Task | Focus Area | Status |
|------|-----------|--------|
| Task 1 | HTML Structure & Basic Server Interaction | ✅ Complete |
| Task 2 | Client/Server Validation & Temporary Storage | ✅ Complete |
| Task 3 | Advanced CSS & Responsive Design (Bootstrap 5) | ✅ Complete |
| Task 4 | Dynamic DOM Manipulation & Client-Side Routing | ✅ Complete |
| Task 5 | REST API & Front-End Interaction | ✅ Complete |

---

## ✨ Features

- **Task Management** — Create, view, edit, delete, and toggle completion of study tasks
- **Form Validation** — Matching client-side and server-side validation with live feedback
- **Live Character Counter** — Real-time character counting for description field
- **Search & Filter** — Search tasks by title, subject, or student; filter by priority, status, deadline
- **Sorting** — Sort by newest, oldest, deadline, priority, or title
- **Hash-Based Routing** — URL-driven filter state (`#pending`, `#high`, `#completed`, etc.)
- **REST API** — Full CRUD JSON API with standardized response format
- **Dark/Light Mode** — Theme toggle with `localStorage` persistence across pages
- **Responsive Design** — Mobile-first layout using Bootstrap 5 (375px–1440px+)
- **Modals** — Task details, edit, and delete confirmation via Bootstrap modals
- **Toast Notifications** — User feedback on CRUD actions
- **API Documentation** — Dedicated `/api-docs` page describing all endpoints
- **Health Check** — `GET /health` endpoint for deployment monitoring

---

## 🛠 Technologies Used

| Technology | Purpose |
|-----------|---------|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web framework |
| **EJS** | Server-side templating |
| **Bootstrap 5** | Responsive CSS framework |
| **Vanilla JavaScript** | Client-side interactivity |
| **CSS3** | Custom styling with CSS variables |
| **Nodemon** | Development auto-restart |

---

## 📁 Project Structure

```
StudyFlow/
├── controllers/
│   └── taskController.js       # CRUD logic for API endpoints
├── data/
│   └── taskStore.js            # In-memory task storage module
├── middleware/
│   ├── apiErrorHandler.js      # JSON error handler for /api/* routes
│   └── taskValidation.js       # Server-side form validation
├── public/
│   ├── css/
│   │   └── style.css           # Custom styles with CSS variables & dark mode
│   └── js/
│       ├── tasks.js            # Task list: fetch, filter, sort, modals, CRUD
│       ├── theme.js            # Dark/light mode toggle logic
│       └── validation.js       # Client-side form validation with live feedback
├── routes/
│   ├── apiRoutes.js            # Express router for JSON API endpoints
│   └── pageRoutes.js           # Express router for EJS page routes
├── views/
│   ├── partials/
│   │   ├── header.ejs          # HTML head, navbar, theme script
│   │   └── footer.ejs          # Footer, Bootstrap JS, theme script
│   ├── index.ejs               # Homepage with hero & features
│   ├── add-task.ejs            # Add task form
│   ├── task-list.ejs           # Task dashboard with cards, modals, filters
│   ├── task-success.ejs        # Task submission success page
│   ├── about.ejs               # About page with project journey
│   ├── api-docs.ejs            # REST API documentation page
│   ├── 404.ejs                 # Page not found
│   └── error.ejs               # Server error page
├── docs/
│   ├── API_TESTING.md          # API testing guide
│   ├── PROJECT_REPORT.md       # Internship project report
│   └── VIDEO_SCRIPT.md         # Demo video script
├── app.js                      # Express application entry point
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

---

## 🚀 Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later recommended)

### Setup

```bash
git clone https://github.com/chaitanyaverma-blockchain/StudyFlow-Internship.git
cd StudyFlow-Internship/StudyFlow
npm install
```

### Run Commands

**Production mode:**

```bash
npm start
```

**Development mode** (auto-restarts on file changes):

```bash
npm run dev
```

The application will open at:

```
http://localhost:3000
```

---

## 🗺 Application Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/` | GET | Homepage with hero section and feature cards |
| `/tasks/new` | GET | Add Task form with validation |
| `/tasks` | GET | Task dashboard with search, filters, sorting |
| `/tasks/success` | GET | Task submission success page |
| `/about` | GET | About page with project development journey |
| `/api-docs` | GET | REST API documentation page |
| `/health` | GET | Health check endpoint (JSON) |
| `/*` | GET | 404 Page Not Found |

---

## 🔌 REST API Endpoints

All API routes are prefixed with `/api` and return JSON responses in the format:

```json
{
  "success": true,
  "message": "Description of result",
  "data": { ... }
}
```

Error responses include an `errors` object for validation failures:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "fieldName": "Error description"
  }
}
```

### Endpoint Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | Retrieve all tasks (supports `?search`, `?priority`, `?status`, `?sort` query params) |
| `GET` | `/api/tasks/:id` | Retrieve a single task by ID |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/:id` | Update an existing task |
| `DELETE` | `/api/tasks/:id` | Delete a task |
| `PATCH` | `/api/tasks/:id/status` | Update task completion status |

For detailed request/response examples, see the [API Testing Guide](docs/API_TESTING.md) or visit `/api-docs` in the running application.

---

## ✅ Validation Rules

Both client-side and server-side validation enforce identical rules:

| Field | Rules |
|-------|-------|
| Student Name | Required, 2–50 characters, letters and spaces only |
| Email | Required, valid email format, max 100 characters |
| Task Title | Required, 3–80 characters, cannot be only symbols |
| Subject | Required, 2–50 characters, letters/numbers/spaces/hyphens only |
| Description | Required, 10–500 characters |
| Deadline | Required, cannot be in the past |
| Priority | Required, must be Low/Medium/High |
| Category | Required, must be Assignment/Exam Preparation/Project/Revision/Other |
| Custom Category | Required if category is "Other", 2–30 characters |
| Estimated Hours | Required, 1–100, max 2 decimal places |
| Confirmation | Must be checked (checkbox) |

---

## 🌗 Light / Dark Mode

- Toggle via the 🌙/☀️ button in the navbar
- Theme is saved in `localStorage` and persists across pages and refreshes
- Inline `<script>` in `<head>` prevents flash of wrong theme on page load
- All custom CSS uses CSS variables that swap between light and dark palettes
- Respects `prefers-reduced-motion` for users who prefer minimal animation

---

## 📱 Responsive Design

The application is tested and works at:

| Breakpoint | Device |
|-----------|--------|
| 375px | Mobile |
| 768px | Tablet |
| 1024px | Laptop |
| 1440px | Desktop |

Key responsive features:
- Bootstrap 5 collapsible navbar with hamburger menu
- Card grid adapts from 1 column (mobile) to 3 columns (desktop)
- Form layout adapts from single column to two-column
- Modals fit all screen sizes
- No horizontal overflow at any breakpoint

---

## 🧪 Testing

### Quick Smoke Test

1. Start the server: `npm start`
2. Open `http://localhost:3000` — homepage loads
3. Navigate to `/tasks/new` — add a task with valid data
4. Navigate to `/tasks` — verify the task appears
5. Test search, filters, sort, edit, delete, and status toggle
6. Toggle dark mode — verify it persists on refresh
7. Visit `/api-docs` — API documentation loads
8. Visit `/nonexistent` — 404 page loads

For comprehensive testing instructions, see the [API Testing Guide](docs/API_TESTING.md).

---

## ⚠️ Temporary Storage Notice

> **Important:** This project uses **in-memory storage**. All task data is lost when the server restarts.

This is intentional for Tasks 1–5 of the internship. The in-memory array in `data/taskStore.js` demonstrates CRUD operations without database complexity. Persistent storage with MongoDB is planned for optional Task 6 and has not been implemented.

This limitation does **not** mean the REST API is broken — it functions correctly for the entire duration of a server session.

---

## 📸 Screenshots

> Screenshots should be placed in a `screenshots/` directory within the project. The following screenshots are recommended:

- [ ] Homepage (light mode)
- [ ] Homepage (dark mode)
- [ ] Add Task form
- [ ] Validation errors on form
- [ ] Task dashboard with tasks
- [ ] Search and filter controls
- [ ] Task details modal
- [ ] Edit task modal
- [ ] Delete confirmation modal
- [ ] API documentation page
- [ ] API JSON response (browser/Postman)
- [ ] Mobile view (375px)

*To capture screenshots, run the application locally and use browser developer tools or a screenshot tool.*

---

## 🚢 Deployment

### Deployment Configuration

| Setting | Value |
|---------|-------|
| Build command | `npm install` |
| Start command | `npm start` |
| Node environment | `production` |
| Port | Uses `process.env.PORT` (set by hosting platform) |

### Deployment Steps (Render / Railway / similar)

1. Push code to GitHub
2. Connect your GitHub repository to the hosting platform
3. Set the root directory to `StudyFlow/` if the repo contains a parent folder
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Deploy

### Post-Deployment Verification

After deployment, verify:
- Homepage loads with CSS and JavaScript
- EJS views render correctly
- API routes return JSON
- `/health` returns `{ "success": true, "message": "StudyFlow server is running" }`
- 404 handling works

> **Warning:** In-memory tasks will reset whenever the hosting service restarts or redeploys the application. This is expected behavior for Tasks 1–5.

---

## 🔮 Future Improvements

The following tasks are part of the extended internship roadmap but have **not been implemented**:

- **Task 6** — MongoDB integration for persistent data storage
- **Task 7** — User authentication and deployment
- **Task 8** — React frontend integration (Optional)

---

## 👤 Author

**Chaitanya Verma**

---

## 📄 License

ISC

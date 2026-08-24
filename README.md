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
| Task 6 | Database Integration & User Authentication | ✅ Complete |

---

## ✨ Features

- **Task Management** — Create, view, edit, delete, and toggle completion of study tasks
- **User Authentication** — Secure registration, login, and session management using bcrypt and express-session
- **Database Persistence** — Full MongoDB integration for all data storage, isolated by user owner
- **Form Validation** — Matching client-side and server-side validation with live feedback
- **Live Character Counter** — Real-time character counting for description field
- **Search & Filter** — Search tasks by title, subject, or student; filter by priority, status, deadline
- **Sorting** — Sort by newest, oldest, deadline, priority, or title
- **Hash-Based Routing** — URL-driven filter state (`#pending`, `#high`, `#completed`, etc.)
- **Protected REST API** — Full CRUD JSON API secured by authentication with standardized response format
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
| **MongoDB / Mongoose** | Persistent Data Storage and ODM |
| **express-session / connect-mongo** | User session management |
| **bcryptjs** | Secure password hashing |
| **EJS** | Server-side templating |
| **Bootstrap 5** | Responsive CSS framework |
| **Vanilla JavaScript** | Client-side interactivity |
| **CSS3** | Custom styling with CSS variables |
| **Nodemon** | Development auto-restart |

---

## 📁 Project Structure

```
StudyFlow/
├── config/
│   └── database.js             # MongoDB connection setup
├── controllers/
│   ├── taskController.js       # CRUD logic for tasks with owner checks
│   └── authController.js       # Registration, login, and logout logic
├── models/
│   ├── User.js                 # Mongoose User schema with password hashing
│   └── Task.js                 # Mongoose Task schema referencing User
├── middleware/
│   ├── apiErrorHandler.js      # JSON error handler for /api/* routes
│   ├── auth.js                 # Authentication verification and redirection
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
│   ├── register.ejs            # User registration form with validation
│   ├── login.ejs               # User login form
│   ├── add-task.ejs            # Add task form (Protected)
│   ├── task-list.ejs           # Task dashboard with cards (Protected)
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

### Environment Variables

Create a `.env` file in the project root by copying the example file. On Windows/Linux/macOS:
```bash
cp .env.example .env
# OR on Windows
copy .env.example .env
```
Ensure your `.env` contains:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=your_real_mongodb_connection_string
SESSION_SECRET=a_strong_random_secret_string
```

> **Security Note:** Never commit your actual `.env` file. It is safely added to `.gitignore`.

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
| `/` | GET | Homepage with hero section and feature cards (Public) |
| `/register` | GET/POST | Create a new user account (Public) |
| `/login` | GET/POST | Authenticate user and start session (Public) |
| `/logout` | POST | Destroy user session and redirect (Protected) |
| `/tasks/new` | GET | Add Task form with validation (Protected) |
| `/tasks` | GET | Task dashboard with search, filters, sorting (Protected) |
| `/tasks/success` | GET | Task submission success page (Protected) |
| `/about` | GET | About page with project development journey (Public) |
| `/api-docs` | GET | REST API documentation page (Public) |
| `/health` | GET | Health check endpoint (Public) |
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
| `GET` | `/api/tasks` | Retrieve all owned tasks (supports filtering/sorting) |
| `GET` | `/api/tasks/:id` | Retrieve a single owned task by ID |
| `POST` | `/api/tasks` | Create a new task tied to the authenticated user |
| `PUT` | `/api/tasks/:id` | Update an existing owned task |
| `DELETE` | `/api/tasks/:id` | Delete an owned task |
| `PATCH` | `/api/tasks/:id/status` | Update owned task completion status |

> **Authentication Required:** All `/api/tasks` routes are protected. Requests without a valid session cookie will receive a `401 Unauthorized` JSON response.

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

1. Ensure MongoDB connection URI is configured in `.env`.
2. Start the server: `npm start`
3. Open `http://localhost:3000` — homepage loads
4. Navigate to `/register` — create an account.
5. Navigate to `/tasks/new` — add a task with valid data.
6. Navigate to `/tasks` — verify the task appears.
7. Test search, filters, sort, edit, delete, and status toggle.
8. Logout and log in with a different account. Verify that the tasks of the first account are invisible.
9. Verify MongoDB persistence: stop the server, restart it, and verify tasks are still there.
10. Visit `/api-docs` — API documentation loads
11. Visit `/nonexistent` — 404 page loads

For comprehensive testing instructions, see the [API Testing Guide](docs/API_TESTING.md).

---

## 🗄️ Database Integration & Authentication (Task 6)

> **MongoDB Integration:** In Task 6, temporary storage was replaced with a robust MongoDB database.

- **Mongoose Models**: `User` and `Task` schemas added.
- **Data Persistence**: Tasks are saved to a remote MongoDB instance, persisting securely across server restarts.
- **Authentication**: Custom `express-session` backed by `connect-mongo`.
- **Security**: Passwords securely hashed with `bcryptjs`.
- **Authorization**: Route and API-level protection ensuring users can only interact with tasks tied to their own unique `owner` ID.

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

> **Note:** With the completion of Task 6, all tasks are securely stored in MongoDB and will persist across deployments and server restarts!
---

## 🔮 Future Improvements

The following tasks are part of the extended internship roadmap but have **not been implemented**:

- **Task 7** — Deployment & CI/CD
- **Task 8** — React frontend integration (Optional)

---

## 👤 Author

**Chaitanya Verma**

---

## 📄 License

ISC

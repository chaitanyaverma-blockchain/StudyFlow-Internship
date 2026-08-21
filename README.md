# 📚 StudyFlow – Student Task Manager

A student productivity web application for organizing studies, managing assignments, and tracking deadlines.

## Internship Task 1 – Objective

Introduce server-side rendering and basic form submission using **Node.js**, **Express.js**, and **EJS**. This task sets up the foundational project structure that will be extended in Tasks 2–6.

## Technologies Used

- **Node.js** – JavaScript runtime
- **Express.js** – Web framework for Node.js
- **EJS** – Embedded JavaScript templating engine
- **CSS** – Custom stylesheet for layout and design
- **Nodemon** – Development tool for auto-restarting the server

## Features Completed

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

## Folder Structure

```
StudyFlow/
├── public/
│   └── css/
│       └── style.css
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── index.ejs
│   ├── add-task.ejs
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

| Route           | Method | Description                          |
| --------------- | ------ | ------------------------------------ |
| `/`             | GET    | Home page                            |
| `/tasks/new`    | GET    | Add Task form page                   |
| `/tasks`        | POST   | Handles form submission              |
| `/about`        | GET    | About StudyFlow page                 |
| Any other route | GET    | Shows 404 Page Not Found             |

## Testing Checklist

- [ ] `npm install` completes without errors
- [ ] `npm run dev` starts the server on port 3000
- [ ] Home page loads at `http://localhost:3000/`
- [ ] Navigation links work correctly
- [ ] Add Task page loads at `http://localhost:3000/tasks/new`
- [ ] Form submits and redirects to the success page
- [ ] Submitted task details display correctly on the success page
- [ ] About page loads at `http://localhost:3000/about`
- [ ] Visiting an invalid URL shows the 404 page
- [ ] CSS loads and styling appears correctly
- [ ] Layout is responsive on mobile and desktop

## Future Development

This project will be extended progressively across the remaining internship tasks:

- **Task 2** – CSS styling and responsive design enhancements
- **Task 3** – MongoDB integration for persistent data storage
- **Task 4** – REST API development
- **Task 5** – React frontend integration
- **Task 6** – Authentication and deployment

> **Note:** No database, authentication, or frontend framework has been added in Task 1. The current implementation demonstrates server-side rendering and basic form handling only.

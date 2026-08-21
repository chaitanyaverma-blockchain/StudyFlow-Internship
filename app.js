const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// ──── Routes ────

// Home page
app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

// Add Task page
app.get('/tasks/new', (req, res) => {
  res.render('add-task', { title: 'Add Task' });
});

// Handle task form submission
app.post('/tasks', (req, res) => {
  const { studentName, taskTitle, subject, description, deadline, priority } = req.body;

  // Pass submitted data to the success page
  res.render('task-success', {
    title: 'Task Added',
    task: {
      studentName,
      taskTitle,
      subject,
      description,
      deadline,
      priority
    }
  });
});

// About page
app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

// 404 handler – catches all unmatched routes
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { title: 'Error', message: 'Something went wrong on the server.' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`StudyFlow server is running at http://localhost:${PORT}`);
});

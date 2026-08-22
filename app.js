const express = require('express');
const path = require('path');
const validateTask = require('./middleware/taskValidation');

const app = express();
const PORT = 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// ──── In-Memory Task Storage ────
// Tasks are stored here temporarily. Data is lost when the server restarts.
const tasks = [];
let nextId = 1;

// ──── Routes ────

// Home page
app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

// Add Task page
app.get('/tasks/new', (req, res) => {
  // Pass only necessary data for client-side duplicate checking
  const activeTasks = tasks.filter(t => !t.completed).map(t => ({ title: t.taskTitle, email: t.email }));
  res.render('add-task', {
    title: 'Add Task',
    errors: {},
    formData: {},
    tasks: activeTasks
  });
});

// Task list page
app.get('/tasks', (req, res) => {
  // Calculate summary stats
  const totalTasks = tasks.length;
  const highPriority = tasks.filter(t => t.priority === 'High').length;
  
  // Upcoming = not past deadline (simplified for this task)
  const today = new Date();
  today.setHours(0,0,0,0);
  const upcoming = tasks.filter(t => {
    if (t.completed) return false;
    const deadlineDate = new Date(t.deadline + 'T00:00:00');
    return deadlineDate >= today;
  }).length;
  
  const completed = tasks.filter(t => t.completed).length;

  res.render('task-list', {
    title: 'All Tasks',
    tasks: tasks,
    stats: {
      total: totalTasks,
      highPriority: highPriority,
      upcoming: upcoming,
      completed: completed
    }
  });
});

// Handle task form submission with server-side validation
app.post('/tasks', validateTask, (req, res) => {
  const errors = req.validationErrors || {};
  const data = req.taskData || req.body;

  // Check for duplicates (same email, same title, active)
  if (!errors.taskTitle && data.email && data.taskTitle) {
    const isDuplicate = tasks.some(t => 
      t.email.toLowerCase() === data.email.toLowerCase() && 
      t.taskTitle.toLowerCase() === data.taskTitle.toLowerCase() && 
      !t.completed
    );
    if (isDuplicate) {
      errors.taskTitle = 'An active task with this title already exists for your email.';
    }
  }

  // If validation fails, re-render the form with errors and previous values
  if (Object.keys(errors).length > 0) {
    const activeTasks = tasks.filter(t => !t.completed).map(t => ({ title: t.taskTitle, email: t.email }));
    return res.status(400).render('add-task', {
      title: 'Add Task',
      errors: errors,
      formData: data,
      tasks: activeTasks
    });
  }

  // Create the task object and store it
  const newTask = {
    id: nextId++,
    studentName: data.studentName,
    email: data.email,
    taskTitle: data.taskTitle,
    subject: data.subject,
    description: data.description,
    deadline: data.deadline,
    priority: data.priority,
    category: data.category === 'Other' ? data.customCategory : data.category,
    estimatedHours: data.estimatedHours,
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);

  // Render the success page with the stored task
  res.render('task-success', {
    title: 'Task Added',
    task: newTask
  });
});

// Toggle task completion
app.post('/tasks/:id/toggle', express.json(), (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  tasks[taskIndex].completed = !tasks[taskIndex].completed;
  
  res.json({ success: true, task: tasks[taskIndex] });
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

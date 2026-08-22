const express = require('express');
const router = express.Router();
const taskStore = require('../data/taskStore');

// Home page
router.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

// Add Task page
router.get('/tasks/new', (req, res) => {
  // Pass only necessary data for client-side duplicate checking
  const activeTasks = taskStore.getTasks().filter(t => !t.completed).map(t => ({ title: t.taskTitle, email: t.email }));
  res.render('add-task', {
    title: 'Add Task',
    errors: {},
    formData: {},
    tasks: activeTasks
  });
});

// Task list page
router.get('/tasks', (req, res) => {
  const tasks = taskStore.getTasks();
  
  // Calculate summary stats
  const totalTasks = tasks.length;
  const highPriority = tasks.filter(t => t.priority.toLowerCase() === 'high').length;
  
  // Upcoming = not past deadline (simplified for this task)
  const today = new Date();
  today.setHours(0,0,0,0);
  const upcoming = tasks.filter(t => {
    if (t.completed) return false;
    const parts = t.deadline.split('-');
    const deadlineDate = new Date(parts[0], parts[1] - 1, parts[2]);
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

// Task success page (preserved for Task 1 evidence, though frontend will override)
router.get('/tasks/success', (req, res) => {
  res.render('task-success', {
    title: 'Task Added',
    task: {} // This is a placeholder since we normally pass a specific task
  });
});

// About page
router.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

// API Documentation page
router.get('/api-docs', (req, res) => {
  res.render('api-docs', { title: 'API Documentation' });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authController = require('../controllers/authController');
const { requireAuth, redirectIfAuthenticated } = require('../middleware/auth');

// ──── Public Pages ────

// Home page
router.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

// About page
router.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

// API Documentation page
router.get('/api-docs', (req, res) => {
  res.render('api-docs', { title: 'API Documentation' });
});

// ──── Auth Pages ────

router.get('/register', redirectIfAuthenticated, (req, res) => {
  res.render('register', { title: 'Register' });
});

router.post('/register', redirectIfAuthenticated, authController.registerUser);

router.get('/login', redirectIfAuthenticated, (req, res) => {
  res.render('login', { title: 'Login' });
});

router.post('/login', redirectIfAuthenticated, authController.loginUser);

router.post('/logout', authController.logoutUser);

// ──── Protected Pages ────

// Add Task page
router.get('/tasks/new', requireAuth, async (req, res) => {
  try {
    // Pass only necessary data for client-side duplicate checking
    const activeTasks = await Task.find({ owner: req.session.userId, completed: false }).select('taskTitle email');
    const mappedTasks = activeTasks.map(t => ({ title: t.taskTitle, email: t.email }));
    
    res.render('add-task', {
      title: 'Add Task',
      errors: {},
      formData: {},
      tasks: mappedTasks
    });
  } catch (err) {
    res.status(500).render('error', { title: 'Error', message: 'Failed to load task page.' });
  }
});

// Task list page
router.get('/tasks', requireAuth, async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.session.userId });
    
    // Calculate summary stats
    const totalTasks = tasks.length;
    const highPriority = tasks.filter(t => t.priority.toLowerCase() === 'high').length;
    
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
      title: 'My Tasks',
      tasks: tasks,
      stats: {
        total: totalTasks,
        highPriority: highPriority,
        upcoming: upcoming,
        completed: completed
      }
    });
  } catch (err) {
    res.status(500).render('error', { title: 'Error', message: 'Failed to load tasks.' });
  }
});

// Task success page
router.get('/tasks/success', requireAuth, (req, res) => {
  res.render('task-success', {
    title: 'Task Added',
    task: {}
  });
});

module.exports = router;

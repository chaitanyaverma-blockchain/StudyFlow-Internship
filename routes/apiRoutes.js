const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const validateTask = require('../middleware/taskValidation');
const { requireAuth } = require('../middleware/auth');

// Protect all task routes
router.use('/tasks', requireAuth);

// GET /api/tasks
router.get('/tasks', taskController.getAllTasks);

// GET /api/tasks/:id
router.get('/tasks/:id', taskController.getTaskById);

// POST /api/tasks
router.post('/tasks', validateTask, taskController.createTask);

// PUT /api/tasks/:id
router.put('/tasks/:id', validateTask, taskController.updateTask);

// DELETE /api/tasks/:id
router.delete('/tasks/:id', taskController.deleteTask);

// PATCH /api/tasks/:id/status
router.patch('/tasks/:id/status', taskController.updateTaskStatus);

module.exports = router;

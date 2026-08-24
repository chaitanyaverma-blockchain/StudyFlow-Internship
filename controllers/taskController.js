const Task = require('../models/Task');

exports.getAllTasks = async (req, res) => {
  try {
    const { search, priority, status, sort } = req.query;
    
    // Base query restricted to current user
    let query = { owner: req.session.userId };

    if (search) {
      query.$or = [
        { taskTitle: { $regex: search, $options: 'i' } },
        { studentName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (priority) {
      query.priority = new RegExp(`^${priority}$`, 'i');
    }

    if (status) {
      if (status.toLowerCase() === 'completed') query.completed = true;
      else if (status.toLowerCase() === 'pending') query.completed = false;
    }

    let sortOptions = {};
    if (sort) {
      switch(sort) {
        case 'oldest':
          sortOptions.createdAt = 1;
          break;
        case 'priorityDesc':
          // Can't easily sort by custom priority string in MongoDB without aggregation.
          // Will fetch and sort in memory if needed, or sort by creation.
          // For simplicity in Task 6, fallback to in-memory sort after fetch
          break;
        case 'titleAsc':
          sortOptions.taskTitle = 1;
          break;
        default:
          sortOptions.createdAt = -1; // newest
      }
    } else {
      sortOptions.createdAt = -1; // default newest
    }

    let tasks = await Task.find(query).sort(sortOptions);

    // Handle priorityDesc in memory if requested
    if (sort === 'priorityDesc') {
      const pScore = { 'high': 3, 'medium': 2, 'low': 1 };
      tasks.sort((a, b) => (pScore[b.priority.toLowerCase()] || 0) - (pScore[a.priority.toLowerCase()] || 0));
    }
    
    // Map tasks to include an 'id' field for frontend compatibility
    const formattedTasks = tasks.map(t => ({
      ...t.toObject(),
      id: t._id.toString()
    }));

    res.status(200).json({
      success: true,
      message: 'Tasks retrieved successfully',
      data: formattedTasks
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error retrieving tasks' });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.session.userId });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    const formattedTask = { ...task.toObject(), id: task._id.toString() };
    res.status(200).json({
      success: true,
      message: 'Task retrieved successfully',
      data: formattedTask
    });
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).json({ success: false, message: 'Task not found' });
    res.status(500).json({ success: false, message: 'Server error retrieving task' });
  }
};

exports.createTask = async (req, res) => {
  const errors = req.validationErrors || {};
  const data = req.taskData || req.body;

  try {
    // Duplicate Check for current owner
    if (!errors.taskTitle && data.email && data.taskTitle) {
      const isDuplicate = await Task.findOne({
        owner: req.session.userId,
        email: { $regex: new RegExp(`^${data.email}$`, 'i') },
        taskTitle: { $regex: new RegExp(`^${data.taskTitle}$`, 'i') },
        completed: false
      });
      if (isDuplicate) {
        errors.taskTitle = 'An active task with this title already exists for your email.';
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }

    const categoryToSave = data.category === 'Other' ? data.customCategory : data.category;
    
    const newTask = new Task({
      owner: req.session.userId,
      studentName: data.studentName,
      email: data.email,
      taskTitle: data.taskTitle,
      subject: data.subject,
      description: data.description,
      deadline: data.deadline,
      priority: data.priority,
      category: categoryToSave,
      estimatedHours: data.estimatedHours
    });

    const savedTask = await newTask.save();
    const formattedTask = { ...savedTask.toObject(), id: savedTask._id.toString() };

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: formattedTask
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error creating task' });
  }
};

exports.updateTask = async (req, res) => {
  const errors = req.validationErrors || {};
  const data = req.taskData || req.body;

  try {
    // Duplicate check (ignore self) for current owner
    if (!errors.taskTitle && data.email && data.taskTitle) {
      const isDuplicate = await Task.findOne({
        _id: { $ne: req.params.id },
        owner: req.session.userId,
        email: { $regex: new RegExp(`^${data.email}$`, 'i') },
        taskTitle: { $regex: new RegExp(`^${data.taskTitle}$`, 'i') },
        completed: false
      });
      if (isDuplicate) {
        errors.taskTitle = 'An active task with this title already exists for your email.';
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }

    const categoryToSave = data.category === 'Other' ? data.customCategory : data.category;

    const updateData = {
      studentName: data.studentName,
      email: data.email,
      taskTitle: data.taskTitle,
      subject: data.subject,
      description: data.description,
      deadline: data.deadline,
      priority: data.priority,
      category: categoryToSave,
      estimatedHours: data.estimatedHours
    };

    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.session.userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const formattedTask = { ...updatedTask.toObject(), id: updatedTask._id.toString() };

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: formattedTask
    });
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).json({ success: false, message: 'Task not found' });
    res.status(500).json({ success: false, message: 'Server error updating task' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, owner: req.session.userId });
    
    if (!deletedTask) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: {}
    });
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).json({ success: false, message: 'Task not found' });
    res.status(500).json({ success: false, message: 'Server error deleting task' });
  }
};

exports.updateTaskStatus = async (req, res) => {
  if (typeof req.body.completed !== 'boolean') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: { completed: 'completed status must be a boolean' }
    });
  }

  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.session.userId },
      { completed: req.body.completed },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const formattedTask = { ...updatedTask.toObject(), id: updatedTask._id.toString() };

    res.status(200).json({
      success: true,
      message: 'Task status updated successfully',
      data: formattedTask
    });
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).json({ success: false, message: 'Task not found' });
    res.status(500).json({ success: false, message: 'Server error updating task status' });
  }
};

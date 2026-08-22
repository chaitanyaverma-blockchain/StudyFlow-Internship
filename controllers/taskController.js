const taskStore = require('../data/taskStore');

exports.getAllTasks = (req, res) => {
  let tasks = taskStore.getTasks();

  // Optional Query Parameters for Filtering/Searching
  const { search, priority, status, sort } = req.query;

  if (search) {
    const searchTerms = search.toLowerCase();
    tasks = tasks.filter(t => {
      const searchableText = `${t.taskTitle} ${t.studentName} ${t.email} ${t.subject} ${t.category} ${t.description}`.toLowerCase();
      return searchableText.includes(searchTerms);
    });
  }

  if (priority) {
    tasks = tasks.filter(t => t.priority.toLowerCase() === priority.toLowerCase());
  }

  if (status) {
    if (status.toLowerCase() === 'completed') {
      tasks = tasks.filter(t => t.completed);
    } else if (status.toLowerCase() === 'pending') {
      tasks = tasks.filter(t => !t.completed);
    }
  }

  if (sort) {
    tasks = [...tasks]; // Copy to avoid mutating original
    switch(sort) {
      case 'oldest':
        tasks.sort((a, b) => a.id - b.id);
        break;
      case 'priorityDesc':
        const pScore = { 'high': 3, 'medium': 2, 'low': 1 };
        tasks.sort((a, b) => (pScore[b.priority.toLowerCase()] || 0) - (pScore[a.priority.toLowerCase()] || 0));
        break;
      case 'titleAsc':
        tasks.sort((a, b) => a.taskTitle.localeCompare(b.taskTitle));
        break;
      default:
        // default newest
        tasks.sort((a, b) => b.id - a.id);
    }
  } else {
    // Default sort: newest first
    tasks = [...tasks].sort((a, b) => b.id - a.id);
  }

  res.status(200).json({
    success: true,
    message: 'Tasks retrieved successfully',
    data: tasks
  });
};

exports.getTaskById = (req, res) => {
  const task = taskStore.getTaskById(req.params.id);
  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }
  res.status(200).json({
    success: true,
    message: 'Task retrieved successfully',
    data: task
  });
};

exports.createTask = (req, res) => {
  // Uses validateTask middleware before reaching here
  const errors = req.validationErrors || {};
  const data = req.taskData || req.body;

  // Duplicate Check
  if (!errors.taskTitle && data.email && data.taskTitle) {
    const isDuplicate = taskStore.getTasks().some(t => 
      t.email.toLowerCase() === data.email.toLowerCase() && 
      t.taskTitle.toLowerCase() === data.taskTitle.toLowerCase() && 
      !t.completed
    );
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
  
  const newTaskData = {
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

  const createdTask = taskStore.addTask(newTaskData);

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: createdTask
  });
};

exports.updateTask = (req, res) => {
  // Uses validateTask middleware
  const errors = req.validationErrors || {};
  const data = req.taskData || req.body;

  // Duplicate check (ignore self)
  if (!errors.taskTitle && data.email && data.taskTitle) {
    const isDuplicate = taskStore.getTasks().some(t => 
      t.id !== parseInt(req.params.id, 10) &&
      t.email.toLowerCase() === data.email.toLowerCase() && 
      t.taskTitle.toLowerCase() === data.taskTitle.toLowerCase() && 
      !t.completed
    );
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

  const updatedTask = taskStore.updateTask(req.params.id, updateData);

  if (!updatedTask) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    data: updatedTask
  });
};

exports.deleteTask = (req, res) => {
  const deleted = taskStore.deleteTask(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }
  res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
    data: {}
  });
};

exports.updateTaskStatus = (req, res) => {
  if (typeof req.body.completed !== 'boolean') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: { completed: 'completed status must be a boolean' }
    });
  }

  const updatedTask = taskStore.updateTaskStatus(req.params.id, req.body.completed);
  if (!updatedTask) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  res.status(200).json({
    success: true,
    message: 'Task status updated successfully',
    data: updatedTask
  });
};

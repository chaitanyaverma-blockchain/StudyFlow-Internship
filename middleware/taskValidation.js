// Validation rules for task form data
// Used as Express middleware on the POST /tasks route

function validateTask(req, res, next) {
  const errors = {};
  const body = req.body;

  // Trim all string fields
  const studentName = (body.studentName || '').trim();
  const email = (body.email || '').trim();
  const taskTitle = (body.taskTitle || '').trim();
  const subject = (body.subject || '').trim();
  const description = (body.description || '').trim();
  const deadline = (body.deadline || '').trim();
  const priority = (body.priority || '').trim();
  const category = (body.category || '').trim();
  const estimatedHours = body.estimatedHours;
  const confirmation = body.confirmation;

  // Student name: at least 2 chars, no numbers
  if (studentName.length < 2) {
    errors.studentName = 'Name must contain at least 2 characters.';
  } else if (/\d/.test(studentName)) {
    errors.studentName = 'Name should not contain numbers.';
  }

  // Email: valid format
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.email = 'Email is required.';
  } else if (!emailPattern.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  // Task title: 3–80 characters
  if (taskTitle.length < 3) {
    errors.taskTitle = 'Task title must contain at least 3 characters.';
  } else if (taskTitle.length > 80) {
    errors.taskTitle = 'Task title cannot exceed 80 characters.';
  }

  // Subject: at least 2 chars
  if (subject.length < 2) {
    errors.subject = 'Subject must contain at least 2 characters.';
  }

  // Description: 10–500 characters
  if (description.length < 10) {
    errors.description = 'Description must contain at least 10 characters.';
  } else if (description.length > 500) {
    errors.description = 'Description cannot exceed 500 characters.';
  }

  // Deadline: not empty and not in the past
  if (!deadline) {
    errors.deadline = 'Deadline is required.';
  } else {
    const deadlineDate = new Date(deadline + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (deadlineDate < today) {
      errors.deadline = 'Deadline cannot be in the past.';
    }
  }

  // Priority: must be selected
  const validPriorities = ['Low', 'Medium', 'High'];
  if (!priority || !validPriorities.includes(priority)) {
    errors.priority = 'Please select a valid priority.';
  }

  // Category: must be selected
  const validCategories = ['Assignment', 'Exam Preparation', 'Project', 'Revision', 'Other'];
  if (!category || !validCategories.includes(category)) {
    errors.category = 'Please select a valid category.';
  }

  // Estimated hours: between 1 and 100
  const hours = Number(estimatedHours);
  if (!estimatedHours || isNaN(hours)) {
    errors.estimatedHours = 'Estimated study hours are required.';
  } else if (hours < 1 || hours > 100) {
    errors.estimatedHours = 'Estimated hours must be between 1 and 100.';
  }

  // Confirmation checkbox
  if (!confirmation) {
    errors.confirmation = 'You must confirm that the information is correct.';
  }

  // Store trimmed values and errors on the request object
  req.taskData = {
    studentName,
    email,
    taskTitle,
    subject,
    description,
    deadline,
    priority,
    category,
    estimatedHours: hours,
    confirmation: !!confirmation
  };
  req.validationErrors = errors;

  next();
}

module.exports = validateTask;

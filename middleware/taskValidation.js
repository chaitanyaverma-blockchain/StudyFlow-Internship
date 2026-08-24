// Validation rules for task form data
// Used as Express middleware on the POST /tasks route

function validateTask(req, res, next) {
  const errors = {};
  const body = req.body;

  // Trim and replace repeated spaces for string fields
  const studentName = (body.studentName || '').trim().replace(/\s+/g, ' ');
  const email = (body.email || '').trim().toLowerCase();
  const taskTitle = (body.taskTitle || '').trim().replace(/\s+/g, ' ');
  const subject = (body.subject || '').trim().replace(/\s+/g, ' ');
  const description = (body.description || '').trim();
  const deadline = (body.deadline || '').trim();
  const priority = (body.priority || '').trim();
  const category = (body.category || '').trim();
  const customCategory = (body.customCategory || '').trim().replace(/\s+/g, ' ');
  const estimatedHours = body.estimatedHours;
  const confirmation = body.confirmation;

  // Student name: 2-50 chars, no numbers or symbols, not empty
  if (studentName.length === 0) {
    errors.studentName = 'Name cannot be empty or only spaces.';
  } else if (studentName.length < 2 || studentName.length > 50) {
    errors.studentName = 'Name must contain 2–50 characters.';
  } else if (!/^[a-zA-Z\s]+$/.test(studentName)) {
    errors.studentName = 'Name must contain letters and spaces only.';
  }

  // Email: valid format, length, no whitespace
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.email = 'Email is required.';
  } else if (/\s/.test(email)) {
    errors.email = 'Email cannot contain whitespace.';
  } else if (email.length > 100) {
    errors.email = 'Email is too long.';
  } else if (!emailPattern.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  // Task title: 3–80 characters, not only symbols
  if (taskTitle.length === 0) {
    errors.taskTitle = 'Task title cannot be empty.';
  } else if (taskTitle.length < 3 || taskTitle.length > 80) {
    errors.taskTitle = 'Task title must contain 3–80 characters.';
  } else if (/^[^\w]+$/.test(taskTitle.replace(/\s/g, ''))) {
    errors.taskTitle = 'Task title cannot contain only symbols.';
  }

  // Subject: 2-50 chars, not only symbols, specific chars allowed
  if (subject.length === 0) {
    errors.subject = 'Subject cannot be empty.';
  } else if (subject.length < 2 || subject.length > 50) {
    errors.subject = 'Subject must contain 2–50 characters.';
  } else if (/^[^\w]+$/.test(subject.replace(/\s/g, ''))) {
    errors.subject = 'Subject cannot contain only symbols.';
  } else if (!/^[a-zA-Z0-9\s\-]+$/.test(subject)) {
    errors.subject = 'Subject can only contain letters, numbers, spaces, and hyphens.';
  }

  // Description: 10–500 characters, not empty
  if (description.length === 0) {
    errors.description = 'Description cannot be whitespace only.';
  } else if (description.length < 10) {
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

  if (category === 'Other') {
    if (customCategory.length === 0) {
      errors.customCategory = 'Custom category cannot be empty.';
    } else if (customCategory.length < 2 || customCategory.length > 30) {
      errors.customCategory = 'Custom category must be 2-30 characters.';
    }
  }

  // Estimated hours: between 1 and 100, valid decimals
  const hours = Number(estimatedHours);
  if (!estimatedHours) {
    errors.estimatedHours = 'Estimated study hours are required.';
  } else if (isNaN(hours)) {
    errors.estimatedHours = 'Must be a valid number.';
  } else if (hours <= 0 || hours > 100) {
    errors.estimatedHours = 'Estimated hours must be between 1 and 100.';
  } else if (String(estimatedHours).includes('.') && String(estimatedHours).split('.')[1].length > 2) {
    errors.estimatedHours = 'Maximum two decimal places allowed.';
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
    customCategory,
    estimatedHours: hours,
    confirmation: !!confirmation
  };
  
  req.validationErrors = errors;

  next();
}

module.exports = validateTask;

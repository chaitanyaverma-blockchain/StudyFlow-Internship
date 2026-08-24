// Client-side form validation for the Add Task page

(function () {
  'use strict';

  const form = document.getElementById('taskForm');
  if (!form) return;

  // Field references
  const fields = {
    studentName: document.getElementById('studentName'),
    email: document.getElementById('email'),
    taskTitle: document.getElementById('taskTitle'),
    subject: document.getElementById('subject'),
    description: document.getElementById('description'),
    deadline: document.getElementById('deadline'),
    priority: document.getElementById('priority'),
    category: document.getElementById('category'),
    customCategory: document.getElementById('customCategory'),
    estimatedHours: document.getElementById('estimatedHours'),
    confirmation: document.getElementById('confirmation')
  };

  const charCounter = document.getElementById('charCounter');
  const deadlineMsg = document.getElementById('deadlineMsg');
  const submitBtn = document.getElementById('submitBtn');
  const resetBtn = document.getElementById('resetBtn');
  const customCategoryContainer = document.getElementById('customCategoryContainer');

  // Existing active tasks for duplicate checking (injected via template if available)
  const existingTasks = window.activeTasks || [];

  // ──── Validation Rules ────

  function validateStudentName(value) {
    // Trim repeated spaces
    value = value.trim().replace(/\s+/g, ' ');
    fields.studentName.value = value;
    if (value.length === 0) return 'Name cannot be empty or only spaces.';
    if (value.length < 2 || value.length > 50) return 'Name must contain 2–50 characters.';
    if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name must contain letters and spaces only.';
    return '';
  }

  function validateEmail(value) {
    value = value.trim().toLowerCase();
    fields.email.value = value;
    if (!value) return 'Email is required.';
    if (/\s/.test(value)) return 'Email cannot contain whitespace.';
    if (value.length > 100) return 'Email is too long.';
    var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(value)) return 'Please enter a valid email address.';
    return '';
  }

  function validateTaskTitle(value) {
    value = value.trim().replace(/\s+/g, ' ');
    fields.taskTitle.value = value;
    if (value.length === 0) return 'Task title cannot be empty.';
    if (value.length < 3 || value.length > 80) return 'Task title must contain 3–80 characters.';
    if (/^[^\w]+$/.test(value.replace(/\s/g, ''))) return 'Task title cannot contain only symbols.';
    
    // Check for duplicates
    const emailValue = fields.email.value.trim().toLowerCase();
    if (emailValue && existingTasks.length > 0) {
      const isDuplicate = existingTasks.some(t => t.email.toLowerCase() === emailValue && t.title.toLowerCase() === value.toLowerCase());
      if (isDuplicate) return 'Warning: An active task with this title already exists for your email.';
    }
    
    return '';
  }

  function validateSubject(value) {
    value = value.trim().replace(/\s+/g, ' ');
    fields.subject.value = value;
    if (value.length === 0) return 'Subject cannot be empty.';
    if (value.length < 2 || value.length > 50) return 'Subject must contain 2–50 characters.';
    if (/^[^\w]+$/.test(value.replace(/\s/g, ''))) return 'Subject cannot contain only symbols.';
    if (!/^[a-zA-Z0-9\s\-]+$/.test(value)) return 'Subject can only contain letters, numbers, spaces, and hyphens.';
    return '';
  }

  function validateDescription(value) {
    value = value.trim();
    if (value.length === 0) return 'Description cannot be whitespace only.';
    if (value.length < 10) return 'Description must contain at least 10 characters.';
    if (value.length > 500) return 'Description cannot exceed 500 characters.';
    return '';
  }

  function validateDeadline(value) {
    if (!value) {
      if (deadlineMsg) deadlineMsg.textContent = '';
      return 'Deadline is required.';
    }
    
    var selected = new Date(value + 'T00:00:00');
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calculate difference in days
    const diffTime = selected - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (deadlineMsg) {
      deadlineMsg.className = 'small fw-bold mt-1 d-block ';
      if (diffDays < 0) {
        deadlineMsg.textContent = 'Overdue!';
        deadlineMsg.classList.add('text-danger');
      } else if (diffDays === 0) {
        deadlineMsg.textContent = 'Due today!';
        deadlineMsg.classList.add('text-warning');
      } else if (diffDays === 1) {
        deadlineMsg.textContent = 'Due tomorrow.';
        deadlineMsg.classList.add('text-info');
      } else {
        deadlineMsg.textContent = 'Due in ' + diffDays + ' days.';
        deadlineMsg.classList.add('text-success');
      }
    }
    
    if (selected < today) return 'Deadline cannot be in the past.';
    return '';
  }

  function validatePriority(value) {
    if (!value) return 'Please select a priority.';
    return '';
  }

  function validateCategory(value) {
    if (!value) return 'Please select a category.';
    return '';
  }
  
  function validateCustomCategory(value) {
    if (fields.category.value !== 'Other') return '';
    value = value.trim().replace(/\s+/g, ' ');
    fields.customCategory.value = value;
    if (value.length === 0) return 'Custom category cannot be empty.';
    if (value.length < 2 || value.length > 30) return 'Custom category must be 2-30 characters.';
    return '';
  }

  function validateEstimatedHours(value) {
    if (!value) return 'Estimated study hours are required.';
    var num = Number(value);
    if (isNaN(num)) return 'Must be a valid number.';
    if (num <= 0) return 'Estimated hours must be greater than zero.';
    if (num > 100) return 'Estimated hours must be 100 or less.';
    // Restrict excessive decimals
    if (value.includes('.') && value.split('.')[1].length > 2) return 'Maximum two decimal places allowed.';
    return '';
  }

  function validateConfirmation(checked) {
    if (!checked) return 'You must confirm that the information is correct.';
    return '';
  }

  // Map field names to their validator functions
  var validators = {
    studentName: function () { return validateStudentName(fields.studentName.value); },
    email: function () { return validateEmail(fields.email.value); },
    taskTitle: function () { return validateTaskTitle(fields.taskTitle.value); },
    subject: function () { return validateSubject(fields.subject.value); },
    description: function () { return validateDescription(fields.description.value); },
    deadline: function () { return validateDeadline(fields.deadline.value); },
    priority: function () { return validatePriority(fields.priority.value); },
    category: function () { return validateCategory(fields.category.value); },
    customCategory: function () { return validateCustomCategory(fields.customCategory ? fields.customCategory.value : ''); },
    estimatedHours: function () { return validateEstimatedHours(fields.estimatedHours.value); },
    confirmation: function () { return validateConfirmation(fields.confirmation.checked); }
  };

  // ──── Display Helpers ────

  // Show or clear a field's error message and border colour
  function showFieldStatus(fieldName, errorMsg) {
    var field = fields[fieldName];
    if (!field) return; // For custom category if it doesn't exist
    var errorSpan = document.getElementById(fieldName + 'Error');

    // Warning styling for duplicate check
    const isWarning = errorMsg && errorMsg.startsWith('Warning:');
    const displayMsg = isWarning ? errorMsg.substring(9) : errorMsg;

    if (errorMsg) {
      if (errorSpan) errorSpan.textContent = displayMsg;
      if (isWarning) {
        field.classList.add('field-valid'); // Or some warning class
        field.classList.remove('field-invalid');
        if(errorSpan) {
            errorSpan.classList.add('text-warning');
            errorSpan.classList.remove('text-danger');
        }
      } else {
        field.classList.add('field-invalid');
        field.classList.remove('field-valid');
        if(errorSpan) {
            errorSpan.classList.add('text-danger');
            errorSpan.classList.remove('text-warning');
        }
      }
    } else {
      if (errorSpan) errorSpan.textContent = '';
      field.classList.remove('field-invalid');
      // Only show green if the field has a value
      var hasValue = (field.type === 'checkbox') ? field.checked : field.value.trim().length > 0;
      if (hasValue) {
        field.classList.add('field-valid');
      } else {
        field.classList.remove('field-valid');
      }
    }
  }

  // ──── Live Validation on Input/Change ────

  // Attach listeners to each field for real-time feedback
  var fieldNames = Object.keys(fields);
  for (var i = 0; i < fieldNames.length; i++) {
    (function (name) {
      var field = fields[name];
      if (!field) return;
      var eventType = (field.type === 'checkbox' || field.tagName === 'SELECT' || field.type === 'date') ? 'change' : 'input';
      field.addEventListener(eventType, function () {
        var error = validators[name]();
        showFieldStatus(name, error);
        
        // If email or title changes, re-validate title for duplicate check
        if (name === 'email' && fields.taskTitle.value) {
            showFieldStatus('taskTitle', validators['taskTitle']());
        }
      });
    })(fieldNames[i]);
  }
  
  // Category change listener to toggle Custom Category
  if (fields.category) {
    fields.category.addEventListener('change', function() {
        if (fields.category.value === 'Other') {
            if (customCategoryContainer) customCategoryContainer.style.display = 'block';
            if (fields.customCategory) fields.customCategory.required = true;
        } else {
            if (customCategoryContainer) customCategoryContainer.style.display = 'none';
            if (fields.customCategory) {
                fields.customCategory.value = '';
                fields.customCategory.required = false;
                showFieldStatus('customCategory', '');
            }
        }
    });
  }

  // ──── Character Counter for Description ────

  if (fields.description && charCounter) {
    // Set initial count
    charCounter.textContent = fields.description.value.length + '/500';

    fields.description.addEventListener('input', function () {
      var len = fields.description.value.length;
      charCounter.textContent = len + '/500';

      if (len > 500) {
        charCounter.classList.add('counter-over');
        charCounter.classList.remove('text-warning');
      } else if (len >= 450) {
        charCounter.classList.remove('counter-over');
        charCounter.classList.add('text-warning'); // Warning style when approaching limit
      } else {
        charCounter.classList.remove('counter-over', 'text-warning');
      }
    });
  }

  // ──── Form Submission ────

  form.addEventListener('submit', function (e) {
    var hasErrors = false;

    // Run all validators
    for (var j = 0; j < fieldNames.length; j++) {
      var name = fieldNames[j];
      if (!fields[name]) continue;
      
      var error = validators[name]();
      
      // Treat warnings as valid for submission, but block on real errors
      if (error && !error.startsWith('Warning:')) {
          showFieldStatus(name, error);
          hasErrors = true;
      }
    }

    if (hasErrors) {
      e.preventDefault();
      // Scroll to the first error
      var firstInvalid = form.querySelector('.field-invalid');
      if (firstInvalid) {
        firstInvalid.focus();
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    e.preventDefault(); // Always prevent default form submission now

    // Disable submit button to prevent duplicate submissions
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    // Gather form data
    var formData = {
      studentName: fields.studentName.value,
      email: fields.email.value,
      taskTitle: fields.taskTitle.value,
      subject: fields.subject.value,
      description: fields.description.value,
      deadline: fields.deadline.value,
      priority: fields.priority.value,
      category: fields.category.value,
      customCategory: fields.customCategory ? fields.customCategory.value : '',
      estimatedHours: fields.estimatedHours.value,
      confirmation: fields.confirmation.checked
    };

    // Submit via API
    fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(function(response) {
      return response.json().then(data => ({ status: response.status, data }));
    })
    .then(function(result) {
      if (result.status === 401) {
        alert('Session expired. Please log in again.');
        window.location.href = '/login';
        return;
      }
      if (result.status === 201 && result.data.success) {
        // Success! Redirect to task list
        window.location.href = '/tasks';
      } else if (result.status === 400 && result.data.errors) {
        // Validation errors from server
        var apiErrors = result.data.errors;
        for (var key in apiErrors) {
          if (apiErrors.hasOwnProperty(key)) {
            showFieldStatus(key, apiErrors[key]);
          }
        }
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Task';
        
        var firstInvalid = form.querySelector('.field-invalid');
        if (firstInvalid) {
          firstInvalid.focus();
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        alert(result.data.message || 'An unexpected error occurred.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Task';
      }
    })
    .catch(function(error) {
      console.error('Error submitting task:', error);
      alert('Network error. Please try again.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Task';
    });
  });

  // ──── Reset Button with Confirmation ────

  if (resetBtn) {
    resetBtn.addEventListener('click', function (e) {
      // Check if any field has a value
      var hasContent = false;
      for (var k = 0; k < fieldNames.length; k++) {
        var f = fields[fieldNames[k]];
        if (!f) continue;
        if (f.type === 'checkbox') {
          if (f.checked) { hasContent = true; break; }
        } else if (f.value.trim()) {
          hasContent = true; break;
        }
      }

      if (hasContent) {
        var confirmed = confirm('Are you sure you want to reset the form? All entered data will be lost.');
        if (!confirmed) {
          e.preventDefault();
          return;
        }
      }

      // Clear all validation states
      for (var m = 0; m < fieldNames.length; m++) {
        var field = fields[fieldNames[m]];
        if (!field) continue;
        field.classList.remove('field-invalid', 'field-valid');
        var errSpan = document.getElementById(fieldNames[m] + 'Error');
        if (errSpan) {
            errSpan.textContent = '';
            errSpan.className = 'field-error'; // Reset class
        }
      }

      if (charCounter) {
          charCounter.textContent = '0/500';
          charCounter.classList.remove('counter-over', 'text-warning');
      }
      if (deadlineMsg) deadlineMsg.textContent = '';
      if (customCategoryContainer) customCategoryContainer.style.display = 'none';
      
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Task';
    });
  }
})();

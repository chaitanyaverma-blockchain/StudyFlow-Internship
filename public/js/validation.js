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
    estimatedHours: document.getElementById('estimatedHours'),
    confirmation: document.getElementById('confirmation')
  };

  const charCounter = document.getElementById('charCounter');
  const submitBtn = document.getElementById('submitBtn');
  const resetBtn = document.getElementById('resetBtn');

  // ──── Validation Rules ────

  function validateStudentName(value) {
    value = value.trim();
    if (value.length < 2) return 'Name must contain at least 2 characters.';
    if (/\d/.test(value)) return 'Name should not contain numbers.';
    return '';
  }

  function validateEmail(value) {
    value = value.trim();
    if (!value) return 'Email is required.';
    var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(value)) return 'Please enter a valid email address.';
    return '';
  }

  function validateTaskTitle(value) {
    value = value.trim();
    if (value.length < 3) return 'Task title must contain at least 3 characters.';
    if (value.length > 80) return 'Task title cannot exceed 80 characters.';
    return '';
  }

  function validateSubject(value) {
    value = value.trim();
    if (value.length < 2) return 'Subject must contain at least 2 characters.';
    return '';
  }

  function validateDescription(value) {
    value = value.trim();
    if (value.length < 10) return 'Description must contain at least 10 characters.';
    if (value.length > 500) return 'Description cannot exceed 500 characters.';
    return '';
  }

  function validateDeadline(value) {
    if (!value) return 'Deadline is required.';
    var selected = new Date(value + 'T00:00:00');
    var today = new Date();
    today.setHours(0, 0, 0, 0);
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

  function validateEstimatedHours(value) {
    if (!value) return 'Estimated study hours are required.';
    var num = Number(value);
    if (isNaN(num) || num < 1 || num > 100) return 'Estimated hours must be between 1 and 100.';
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
    estimatedHours: function () { return validateEstimatedHours(fields.estimatedHours.value); },
    confirmation: function () { return validateConfirmation(fields.confirmation.checked); }
  };

  // ──── Display Helpers ────

  // Show or clear a field's error message and border colour
  function showFieldStatus(fieldName, errorMsg) {
    var field = fields[fieldName];
    var errorSpan = document.getElementById(fieldName + 'Error');

    if (errorMsg) {
      if (errorSpan) errorSpan.textContent = errorMsg;
      field.classList.add('field-invalid');
      field.classList.remove('field-valid');
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
      var eventType = (field.type === 'checkbox' || field.tagName === 'SELECT') ? 'change' : 'input';
      field.addEventListener(eventType, function () {
        var error = validators[name]();
        showFieldStatus(name, error);
      });
    })(fieldNames[i]);
  }

  // ──── Character Counter for Description ────

  if (fields.description && charCounter) {
    // Set initial count
    charCounter.textContent = fields.description.value.trim().length + '/500';

    fields.description.addEventListener('input', function () {
      var len = fields.description.value.trim().length;
      charCounter.textContent = len + '/500';

      if (len > 500) {
        charCounter.classList.add('counter-over');
      } else {
        charCounter.classList.remove('counter-over');
      }
    });
  }

  // ──── Form Submission ────

  form.addEventListener('submit', function (e) {
    var hasErrors = false;

    // Run all validators
    for (var j = 0; j < fieldNames.length; j++) {
      var name = fieldNames[j];
      var error = validators[name]();
      showFieldStatus(name, error);
      if (error) hasErrors = true;
    }

    if (hasErrors) {
      e.preventDefault();
      // Scroll to the first error
      var firstInvalid = form.querySelector('.field-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Disable submit button to prevent duplicate submissions
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
  });

  // ──── Reset Button with Confirmation ────

  if (resetBtn) {
    resetBtn.addEventListener('click', function (e) {
      // Check if any field has a value
      var hasContent = false;
      for (var k = 0; k < fieldNames.length; k++) {
        var f = fields[fieldNames[k]];
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
        field.classList.remove('field-invalid', 'field-valid');
        var errSpan = document.getElementById(fieldNames[m] + 'Error');
        if (errSpan) errSpan.textContent = '';
      }

      if (charCounter) charCounter.textContent = '0/500';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Task';
    });
  }
})();

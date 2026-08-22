// Task 5: API-driven Task List page

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // --- DOM Elements ---
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');
  const filterButtonsContainer = document.getElementById('filterButtons');
  const tasksContainer = document.getElementById('tasksContainer');
  const controlsContainer = document.getElementById('controlsContainer');
  const visibleCountSpan = document.getElementById('visibleCount');
  const totalCountSpan = document.getElementById('totalCount');
  const filterEmptyState = document.getElementById('filterEmptyState');
  const emptyStateResetBtn = document.getElementById('emptyStateResetBtn');
  const globalEmptyState = document.getElementById('globalEmptyState');
  const loadingState = document.getElementById('loadingState');
  const errorState = document.getElementById('errorState');
  const retryLoadBtn = document.getElementById('retryLoadBtn');

  // Summary Elements
  const summaryTotal = document.getElementById('summary-total');
  const summaryHigh = document.getElementById('summary-high');
  const summaryPending = document.getElementById('summary-pending');
  const summaryCompleted = document.getElementById('summary-completed');

  // Modals
  let bsTaskModal = null;
  let bsEditModal = null;
  let bsDeleteModal = null;
  let bsToast = null;
  
  if (typeof bootstrap !== 'undefined') {
    if(document.getElementById('taskDetailsModal')) bsTaskModal = new bootstrap.Modal(document.getElementById('taskDetailsModal'));
    if(document.getElementById('editTaskModal')) bsEditModal = new bootstrap.Modal(document.getElementById('editTaskModal'));
    if(document.getElementById('deleteTaskModal')) bsDeleteModal = new bootstrap.Modal(document.getElementById('deleteTaskModal'));
    if(document.getElementById('liveToast')) bsToast = new bootstrap.Toast(document.getElementById('liveToast'));
  }

  // Only proceed if we are on the task list page
  if (!tasksContainer) return;

  // --- State ---
  let currentFilter = 'all'; 
  let currentSearch = '';
  let currentSort = 'default';
  let allTasksData = []; // Store raw API data
  
  // --- 1. Fetching Tasks ---
  
  function fetchTasks() {
    // Show loading
    loadingState.classList.remove('d-none');
    tasksContainer.classList.add('d-none');
    controlsContainer.classList.add('d-none');
    globalEmptyState.classList.add('d-none');
    errorState.classList.add('d-none');
    
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => {
        loadingState.classList.add('d-none');
        if (data.success) {
          allTasksData = data.data;
          renderAllCards();
        } else {
          showErrorState(data.message);
        }
      })
      .catch(err => {
        loadingState.classList.add('d-none');
        showErrorState('Network error while fetching tasks.');
        console.error(err);
      });
  }
  
  function showErrorState(msg) {
    errorState.classList.remove('d-none');
    document.getElementById('errorMessage').textContent = msg;
  }
  
  if (retryLoadBtn) {
    retryLoadBtn.addEventListener('click', fetchTasks);
  }

  // --- 2. DOM Rendering ---
  
  function renderAllCards() {
    tasksContainer.innerHTML = ''; // Clear container
    
    if (allTasksData.length === 0) {
      globalEmptyState.classList.remove('d-none');
      tasksContainer.classList.remove('d-none');
      controlsContainer.classList.add('d-none');
      updateSummaryStats();
      return;
    }
    
    globalEmptyState.classList.add('d-none');
    controlsContainer.classList.remove('d-none');
    tasksContainer.classList.remove('d-none');
    if(totalCountSpan) totalCountSpan.textContent = allTasksData.length;
    
    allTasksData.forEach(task => {
      const cardWrapper = document.createElement('div');
      cardWrapper.className = 'col task-card-wrapper';
      
      // Add data attributes for filtering and sorting
      cardWrapper.setAttribute('data-task-id', task.id);
      cardWrapper.setAttribute('data-title', String(task.taskTitle).toLowerCase());
      cardWrapper.setAttribute('data-student', String(task.studentName).toLowerCase());
      cardWrapper.setAttribute('data-email', String(task.email).toLowerCase());
      cardWrapper.setAttribute('data-subject', String(task.subject).toLowerCase());
      cardWrapper.setAttribute('data-category', String(task.category).toLowerCase());
      cardWrapper.setAttribute('data-description', String(task.description).toLowerCase());
      cardWrapper.setAttribute('data-priority', task.priority.toLowerCase());
      cardWrapper.setAttribute('data-deadline', task.deadline);
      cardWrapper.setAttribute('data-completed', task.completed);
      cardWrapper.setAttribute('data-created-at', task.createdAt);
      cardWrapper.setAttribute('data-hours', task.estimatedHours);
      
      // Determine badges and colors safely
      let badgeClass = 'bg-secondary';
      if (task.priority === 'High') badgeClass = 'bg-danger';
      if (task.priority === 'Medium') badgeClass = 'bg-warning text-dark';
      if (task.priority === 'Low') badgeClass = 'bg-success';
      
      const statusClass = task.completed ? 'status-complete' : 'status-pending';
      const statusText = task.completed ? 'Completed' : 'Pending';
      const cardOpacity = task.completed ? 'opacity-75' : '';
      const toggleBtnClass = task.completed ? 'btn-outline-secondary' : 'btn-primary';
      const toggleBtnText = task.completed ? 'Mark Pending' : 'Mark Complete';

      // Inner HTML construction using textContent to prevent XSS (we create elements manually where needed or escape carefully)
      // Since it's a lot of DOM to create manually, we'll use innerHTML but escape the text variables safely.
      const escapeHTML = (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
      };
      
      cardWrapper.innerHTML = `
        <div class="card h-100 card-hover ${cardOpacity}" id="taskCard-${task.id}">
          <div class="card-header bg-transparent border-bottom-0 pt-4 pb-0 d-flex justify-content-between align-items-start">
            <h3 class="h5 fw-bold mb-0 text-truncate pe-2 text-theme-heading" title="${escapeHTML(task.taskTitle)}">${escapeHTML(task.taskTitle)}</h3>
            <span class="badge rounded-pill ${badgeClass}">${escapeHTML(task.priority)}</span>
          </div>
          
          <div class="card-body">
            <ul class="list-unstyled mb-0 small text-theme-secondary">
              <li class="mb-2"><strong><span aria-hidden="true">📚</span> Subject:</strong> ${escapeHTML(task.subject)}</li>
              <li class="mb-2"><strong><span aria-hidden="true">⏰</span> Deadline:</strong> ${escapeHTML(task.deadline)}</li>
              <li class="mb-2 text-truncate" title="${escapeHTML(task.description)}"><strong><span aria-hidden="true">📝</span> Desc:</strong> ${escapeHTML(task.description)}</li>
            </ul>
          </div>
          
          <div class="card-footer bg-transparent border-top-0 pb-3 pt-0 d-flex flex-column gap-2">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="status-badge ${statusClass}" id="statusBadge-${task.id}">${statusText}</span>
              <span class="small text-theme-secondary"><strong>⏳</strong> ${escapeHTML(String(task.estimatedHours))} hrs</span>
            </div>
            
            <div class="d-flex gap-2 mb-2">
              <button type="button" class="btn btn-sm btn-outline-primary flex-grow-1 view-details-btn" data-id="${task.id}">View Details</button>
              <button type="button" class="btn btn-sm ${toggleBtnClass} toggle-status-btn flex-grow-1" data-id="${task.id}" id="toggleBtn-${task.id}">${toggleBtnText}</button>
            </div>
            
            <div class="d-flex gap-2 border-top pt-2">
              <button type="button" class="btn btn-sm btn-outline-secondary flex-grow-1 edit-task-btn" data-id="${task.id}">Edit</button>
              <button type="button" class="btn btn-sm btn-outline-danger flex-grow-1 delete-task-btn" data-id="${task.id}">Delete</button>
            </div>
          </div>
        </div>
      `;
      
      tasksContainer.appendChild(cardWrapper);
    });
    
    updateSummaryStats();
    applySorting();
    
    // Process initial hash if any
    if (window.location.hash) {
      handleHashChange();
    } else {
      applyFiltersAndSearch();
    }
  }

  const getTaskCards = () => Array.from(document.querySelectorAll('.task-card-wrapper'));

  // --- 3. Filtering & Searching ---

  function applyFiltersAndSearch() {
    const cards = getTaskCards();
    let visibleCount = 0;
    
    const today = new Date();
    today.setHours(0,0,0,0);

    cards.forEach(card => {
      let matchesSearch = true;
      if (currentSearch) {
        const searchTerms = currentSearch.toLowerCase();
        const searchableText = [
          card.getAttribute('data-title'),
          card.getAttribute('data-student'),
          card.getAttribute('data-email'),
          card.getAttribute('data-subject'),
          card.getAttribute('data-category'),
          card.getAttribute('data-description')
        ].join(' ');
        
        if (!searchableText.includes(searchTerms)) matchesSearch = false;
      }

      let matchesFilter = true;
      const isCompleted = card.getAttribute('data-completed') === 'true';
      const priority = card.getAttribute('data-priority');
      const deadline = card.getAttribute('data-deadline');
      
      switch (currentFilter) {
        case 'high': matchesFilter = (priority === 'high'); break;
        case 'medium': matchesFilter = (priority === 'medium'); break;
        case 'low': matchesFilter = (priority === 'low'); break;
        case 'completed': matchesFilter = isCompleted; break;
        case 'pending': matchesFilter = !isCompleted; break;
        case 'due-today':
        case 'upcoming':
          if (!deadline) {
            matchesFilter = false;
          } else {
            const parts = deadline.split('-');
            const deadlineDate = new Date(parts[0], parts[1] - 1, parts[2]);
            const diffTime = deadlineDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (currentFilter === 'due-today') {
              matchesFilter = (diffDays === 0) && !isCompleted;
            } else { // upcoming
              matchesFilter = (diffDays >= 0) && !isCompleted;
            }
          }
          break;
        case 'all':
        default:
          matchesFilter = true;
          break;
      }

      if (matchesSearch && matchesFilter) {
        card.style.display = 'block';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (visibleCountSpan) visibleCountSpan.textContent = visibleCount;
    
    if (filterEmptyState) {
      if (visibleCount === 0 && allTasksData.length > 0) {
        filterEmptyState.classList.remove('d-none');
        if(!filterEmptyState.parentNode || filterEmptyState.parentNode !== tasksContainer) {
          tasksContainer.appendChild(filterEmptyState);
        }
      } else {
        filterEmptyState.classList.add('d-none');
      }
    }
  }

  // --- 4. Sorting ---

  function applySorting() {
    const cards = getTaskCards();
    
    cards.sort((a, b) => {
      const getVal = (card, attr) => card.getAttribute(attr);
      switch (currentSort) {
        case 'oldest': return parseInt(getVal(a, 'data-task-id')) - parseInt(getVal(b, 'data-task-id'));
        case 'deadlineAsc':
        case 'deadlineDesc':
          const valA = getVal(a, 'data-deadline') || '9999-99-99';
          const valB = getVal(b, 'data-deadline') || '9999-99-99';
          return currentSort === 'deadlineAsc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        case 'priorityDesc':
          const pScore = { 'high': 3, 'medium': 2, 'low': 1 };
          return (pScore[getVal(b, 'data-priority')] || 0) - (pScore[getVal(a, 'data-priority')] || 0);
        case 'titleAsc':
          return (getVal(a, 'data-title') || '').localeCompare(getVal(b, 'data-title') || '');
        case 'default':
        default:
          return parseInt(getVal(b, 'data-task-id')) - parseInt(getVal(a, 'data-task-id'));
      }
    });

    cards.forEach(card => tasksContainer.appendChild(card));
    if (filterEmptyState && !filterEmptyState.classList.contains('d-none')) {
      tasksContainer.appendChild(filterEmptyState);
    }
  }

  // --- 5. Controls Events ---

  if (searchInput) searchInput.addEventListener('input', (e) => { currentSearch = e.target.value.trim(); applyFiltersAndSearch(); });
  if (sortSelect) sortSelect.addEventListener('change', (e) => { currentSort = e.target.value; applySorting(); });

  if (filterButtonsContainer) {
    filterButtonsContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.task-filter-btn');
      if (!btn) return;

      const allBtns = filterButtonsContainer.querySelectorAll('.task-filter-btn');
      allBtns.forEach(b => {
        b.classList.remove('btn-primary', 'active');
        b.classList.add('btn-outline-primary');
      });
      btn.classList.remove('btn-outline-primary');
      btn.classList.add('btn-primary', 'active');

      currentFilter = btn.getAttribute('data-filter');
      
      if(history.pushState) history.pushState(null, null, `#${currentFilter}`);
      else window.location.hash = currentFilter;
      
      applyFiltersAndSearch();
    });
  }

  function resetAllFilters() {
    currentSearch = '';
    currentSort = 'default';
    currentFilter = 'all';
    if (searchInput) searchInput.value = '';
    if (sortSelect) sortSelect.value = 'default';
    
    if (filterButtonsContainer) {
      const allBtns = filterButtonsContainer.querySelectorAll('.task-filter-btn');
      allBtns.forEach(b => {
        b.classList.remove('btn-primary', 'active');
        b.classList.add('btn-outline-primary');
        if (b.getAttribute('data-filter') === 'all') {
          b.classList.remove('btn-outline-primary');
          b.classList.add('btn-primary', 'active');
        }
      });
    }
    
    if (history.pushState) history.pushState("", document.title, window.location.pathname + window.location.search);
    else window.location.hash = '';

    applyFiltersAndSearch();
    applySorting();
  }

  if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', resetAllFilters);
  if (emptyStateResetBtn) emptyStateResetBtn.addEventListener('click', resetAllFilters);

  function handleHashChange() {
    let hash = window.location.hash.substring(1);
    if (!hash) return;
    if (hash === 'high-priority') hash = 'high';
    if (hash === 'medium-priority') hash = 'medium';
    if (hash === 'low-priority') hash = 'low';

    if (filterButtonsContainer) {
      const targetBtn = filterButtonsContainer.querySelector(`.task-filter-btn[data-filter="${hash}"]`);
      if (targetBtn) targetBtn.click();
      else resetAllFilters();
    }
  }

  window.addEventListener('hashchange', handleHashChange);

  // --- 6. Task Modals & Interactions ---

  tasksContainer.addEventListener('click', (e) => {
    
    // View Details
    if (e.target.closest('.view-details-btn')) {
      const btn = e.target.closest('.view-details-btn');
      const taskId = btn.getAttribute('data-id');
      const task = allTasksData.find(t => t.id == taskId);
      
      if (!task || !bsTaskModal) return;

      document.getElementById('modal-title').textContent = task.taskTitle;
      document.getElementById('modal-student').textContent = task.studentName;
      document.getElementById('modal-email').textContent = task.email;
      document.getElementById('modal-subject').textContent = task.subject;
      document.getElementById('modal-description').textContent = task.description;
      document.getElementById('modal-deadline').textContent = task.deadline;
      document.getElementById('modal-priority').textContent = task.priority;
      document.getElementById('modal-category').textContent = task.category;
      document.getElementById('modal-hours').textContent = task.estimatedHours;
      
      const statusBadge = document.getElementById('modal-status');
      statusBadge.textContent = task.completed ? 'Completed' : 'Pending';
      statusBadge.className = `status-badge status-${task.completed ? 'complete' : 'pending'}`;

      bsTaskModal.show();
    }

    // Mark Complete / Pending
    if (e.target.closest('.toggle-status-btn')) {
      const btn = e.target.closest('.toggle-status-btn');
      const taskId = btn.getAttribute('data-id');
      const task = allTasksData.find(t => t.id == taskId);
      
      if (!task) return;

      btn.disabled = true;
      const originalText = btn.textContent;
      btn.textContent = 'Updating...';

      fetch(`/api/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Update local data
          const index = allTasksData.findIndex(t => t.id == taskId);
          allTasksData[index] = data.data;
          // Re-render the cards array
          renderAllCards();
          showToast(`Task marked as ${data.data.completed ? 'Completed' : 'Pending'}!`, 'success');
        } else {
          throw new Error(data.message || 'Server error');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        btn.textContent = originalText;
        showToast('Failed to update status.', 'error');
      })
      .finally(() => {
        btn.disabled = false;
      });
    }

    // Delete Task Setup
    if (e.target.closest('.delete-task-btn')) {
      const btn = e.target.closest('.delete-task-btn');
      const taskId = btn.getAttribute('data-id');
      const task = allTasksData.find(t => t.id == taskId);
      
      if (!task || !bsDeleteModal) return;

      document.getElementById('deleteTaskId').value = taskId;
      document.getElementById('deleteModalTaskTitle').textContent = task.taskTitle;
      bsDeleteModal.show();
    }

    // Edit Task Setup
    if (e.target.closest('.edit-task-btn')) {
      const btn = e.target.closest('.edit-task-btn');
      const taskId = btn.getAttribute('data-id');
      const task = allTasksData.find(t => t.id == taskId);
      
      if (!task || !bsEditModal) return;

      document.getElementById('editTaskId').value = task.id;
      document.getElementById('editStudentName').value = task.studentName;
      document.getElementById('editEmail').value = task.email;
      document.getElementById('editTaskTitle').value = task.taskTitle;
      document.getElementById('editSubject').value = task.subject;
      document.getElementById('editDescription').value = task.description;
      document.getElementById('editDeadline').value = task.deadline;
      document.getElementById('editPriority').value = task.priority;
      
      // Select category or fallback
      const catSelect = document.getElementById('editCategory');
      const options = Array.from(catSelect.options).map(o => o.value);
      if(options.includes(task.category)) {
        catSelect.value = task.category;
      } else {
        catSelect.value = 'Other'; 
        // We simplified it here and don't have custom category input in modal,
        // but we'll assign it to 'Other' if not found. Or we could just add the option.
        const newOption = new Option(task.category, task.category);
        catSelect.add(newOption);
        catSelect.value = task.category;
      }
      
      document.getElementById('editEstimatedHours').value = task.estimatedHours;
      
      // Clear errors
      document.querySelectorAll('#editTaskForm .invalid-feedback').forEach(el => el.textContent = '');
      document.querySelectorAll('#editTaskForm .is-invalid').forEach(el => el.classList.remove('is-invalid'));

      bsEditModal.show();
    }
  });

  // --- 7. Delete Task Action ---
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', () => {
      const taskId = document.getElementById('deleteTaskId').value;
      confirmDeleteBtn.disabled = true;
      confirmDeleteBtn.textContent = 'Deleting...';

      fetch(`/api/tasks/${taskId}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            allTasksData = allTasksData.filter(t => t.id != taskId);
            bsDeleteModal.hide();
            renderAllCards();
            showToast('Task deleted successfully.', 'success');
          } else {
            showToast(data.message || 'Failed to delete task.', 'error');
          }
        })
        .catch(err => {
          showToast('Network error.', 'error');
        })
        .finally(() => {
          confirmDeleteBtn.disabled = false;
          confirmDeleteBtn.textContent = 'Yes, Delete';
        });
    });
  }

  // --- 8. Edit Task Action ---
  const editTaskForm = document.getElementById('editTaskForm');
  const saveEditBtn = document.getElementById('saveEditBtn');
  if (editTaskForm) {
    editTaskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const taskId = document.getElementById('editTaskId').value;
      
      const payload = {
        studentName: document.getElementById('editStudentName').value,
        email: document.getElementById('editEmail').value,
        taskTitle: document.getElementById('editTaskTitle').value,
        subject: document.getElementById('editSubject').value,
        description: document.getElementById('editDescription').value,
        deadline: document.getElementById('editDeadline').value,
        priority: document.getElementById('editPriority').value,
        category: document.getElementById('editCategory').value,
        estimatedHours: document.getElementById('editEstimatedHours').value
      };

      saveEditBtn.disabled = true;
      saveEditBtn.textContent = 'Saving...';
      document.querySelectorAll('#editTaskForm .is-invalid').forEach(el => el.classList.remove('is-invalid'));

      fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const index = allTasksData.findIndex(t => t.id == taskId);
          allTasksData[index] = data.data;
          bsEditModal.hide();
          renderAllCards();
          showToast('Task updated successfully.', 'success');
        } else if (data.errors) {
          // Show errors
          for (const key in data.errors) {
            const errEl = document.getElementById(`edit${key.charAt(0).toUpperCase() + key.slice(1)}Error`);
            const inputEl = document.getElementById(`edit${key.charAt(0).toUpperCase() + key.slice(1)}`);
            if (errEl && inputEl) {
              errEl.textContent = data.errors[key];
              errEl.style.display = 'block';
              inputEl.classList.add('is-invalid');
            }
          }
        } else {
          showToast(data.message || 'Update failed.', 'error');
        }
      })
      .catch(err => {
        showToast('Network error.', 'error');
      })
      .finally(() => {
        saveEditBtn.disabled = false;
        saveEditBtn.textContent = 'Save Changes';
      });
    });
  }

  // --- 9. Summary Stats Update ---
  
  function updateSummaryStats() {
    const total = allTasksData.length;
    let high = 0;
    let completed = 0;

    allTasksData.forEach(task => {
      if (task.priority === 'High') high++;
      if (task.completed) completed++;
    });

    const pending = total - completed;

    if (summaryTotal) summaryTotal.textContent = total;
    if (summaryHigh) summaryHigh.textContent = high;
    if (summaryPending) summaryPending.textContent = pending;
    if (summaryCompleted) summaryCompleted.textContent = completed;
  }

  // --- 10. Notification Helpers ---

  function showToast(message, type) {
    if (!bsToast) return;
    document.getElementById('toastMessage').textContent = message;
    
    if (type === 'error') {
      document.getElementById('liveToast').classList.remove('bg-success');
      document.getElementById('liveToast').classList.add('bg-danger');
    } else {
      document.getElementById('liveToast').classList.add('bg-success');
      document.getElementById('liveToast').classList.remove('bg-danger');
    }
    
    bsToast.show();
  }

  // --- Initialize ---
  
  fetchTasks();

});

// Task 4: Dynamic Interactions for the Task List page

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // --- DOM Elements ---
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');
  const filterButtonsContainer = document.getElementById('filterButtons');
  const tasksContainer = document.getElementById('tasksContainer');
  const visibleCountSpan = document.getElementById('visibleCount');
  const filterEmptyState = document.getElementById('filterEmptyState');
  const emptyStateResetBtn = document.getElementById('emptyStateResetBtn');
  const globalEmptyState = document.getElementById('globalEmptyState');

  // Summary Elements
  const summaryTotal = document.getElementById('summary-total');
  const summaryHigh = document.getElementById('summary-high');
  const summaryPending = document.getElementById('summary-pending');
  const summaryCompleted = document.getElementById('summary-completed');

  // Modal Elements
  const taskDetailsModal = document.getElementById('taskDetailsModal');
  let bsModal = null;
  if (taskDetailsModal && typeof bootstrap !== 'undefined') {
    bsModal = new bootstrap.Modal(taskDetailsModal);
  }

  // Toast Elements
  const liveToast = document.getElementById('liveToast');
  const toastMessage = document.getElementById('toastMessage');
  let bsToast = null;
  if (liveToast && typeof bootstrap !== 'undefined') {
    bsToast = new bootstrap.Toast(liveToast);
  }

  // Only proceed if we are on the task list page (with tasks container)
  if (!tasksContainer) return;

  // --- State ---
  let currentFilter = 'all'; // Default
  let currentSearch = '';
  let currentSort = 'default';
  
  // Get all task cards as an array for easier sorting/filtering
  const getTaskCards = () => Array.from(document.querySelectorAll('.task-card-wrapper'));

  // --- 1. Search & Filtering ---

  function applyFiltersAndSearch() {
    const cards = getTaskCards();
    let visibleCount = 0;
    
    // Determine today for "due-today" and "upcoming" without timezone shift
    const today = new Date();
    today.setHours(0,0,0,0);

    cards.forEach(card => {
      // 1. Check Search
      let matchesSearch = true;
      if (currentSearch) {
        const searchTerms = currentSearch.toLowerCase();
        const title = card.getAttribute('data-title') || '';
        const student = card.getAttribute('data-student') || '';
        const email = card.getAttribute('data-email') || '';
        const subject = card.getAttribute('data-subject') || '';
        const category = card.getAttribute('data-category') || '';
        const desc = card.getAttribute('data-description') || '';
        
        const searchableText = `${title} ${student} ${email} ${subject} ${category} ${desc}`;
        if (!searchableText.includes(searchTerms)) {
          matchesSearch = false;
        }
      }

      // 2. Check Filter
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

      // Combine and apply
      if (matchesSearch && matchesFilter) {
        card.style.display = 'block';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Handle Empty State and Count
    if (visibleCountSpan) visibleCountSpan.textContent = visibleCount;
    
    if (!globalEmptyState && filterEmptyState) {
      if (visibleCount === 0) {
        filterEmptyState.classList.remove('d-none');
      } else {
        filterEmptyState.classList.add('d-none');
      }
    }
  }

  // --- 2. Sorting ---

  function applySorting() {
    const cards = getTaskCards();
    
    cards.sort((a, b) => {
      const getVal = (card, attr) => card.getAttribute(attr);
      
      switch (currentSort) {
        case 'oldest':
          return parseInt(getVal(a, 'data-task-id')) - parseInt(getVal(b, 'data-task-id'));
          
        case 'deadlineAsc':
        case 'deadlineDesc':
          const valA = getVal(a, 'data-deadline') || '9999-99-99';
          const valB = getVal(b, 'data-deadline') || '9999-99-99';
          return currentSort === 'deadlineAsc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
          
        case 'priorityDesc':
          const pScore = { 'high': 3, 'medium': 2, 'low': 1 };
          const pA = pScore[getVal(a, 'data-priority')] || 0;
          const pB = pScore[getVal(b, 'data-priority')] || 0;
          return pB - pA;
          
        case 'titleAsc':
          const tA = getVal(a, 'data-title') || '';
          const tB = getVal(b, 'data-title') || '';
          return tA.localeCompare(tB);
          
        case 'default':
        default:
          return parseInt(getVal(b, 'data-task-id')) - parseInt(getVal(a, 'data-task-id'));
      }
    });

    // Re-append to DOM in new order safely
    cards.forEach(card => tasksContainer.appendChild(card));
    if (filterEmptyState) tasksContainer.appendChild(filterEmptyState);
  }

  // --- 3. Event Listeners for Controls ---

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.trim();
      applyFiltersAndSearch();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      applySorting();
    });
  }

  // Event delegation for filter buttons
  if (filterButtonsContainer) {
    filterButtonsContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.task-filter-btn');
      if (!btn) return;

      // Update UI active state
      const allBtns = filterButtonsContainer.querySelectorAll('.task-filter-btn');
      allBtns.forEach(b => {
        b.classList.remove('btn-primary', 'active');
        b.classList.add('btn-outline-primary');
      });
      btn.classList.remove('btn-outline-primary');
      btn.classList.add('btn-primary', 'active');

      // Update state and apply
      currentFilter = btn.getAttribute('data-filter');
      
      // Update URL Hash for routing cleanly without reloading
      if(history.pushState) {
        history.pushState(null, null, `#${currentFilter}`);
      } else {
        window.location.hash = currentFilter;
      }
      
      applyFiltersAndSearch();
    });
  }

  function resetAllFilters() {
    currentSearch = '';
    currentSort = 'default';
    currentFilter = 'all';
    
    if (searchInput) searchInput.value = '';
    if (sortSelect) sortSelect.value = 'default';
    
    // Reset buttons safely
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
    
    // Clear hash cleanly
    if (history.pushState) {
      history.pushState("", document.title, window.location.pathname + window.location.search);
    } else {
      window.location.hash = '';
    }

    applyFiltersAndSearch();
    applySorting();
  }

  if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', resetAllFilters);
  if (emptyStateResetBtn) emptyStateResetBtn.addEventListener('click', resetAllFilters);

  // --- 4. Hash Routing ---
  
  function handleHashChange() {
    let hash = window.location.hash.substring(1);
    if (!hash) return;
    
    // Map old 'high-priority' to 'high' safely
    if (hash === 'high-priority') hash = 'high';
    if (hash === 'medium-priority') hash = 'medium';
    if (hash === 'low-priority') hash = 'low';

    // Find matching button
    if (filterButtonsContainer) {
      const targetBtn = filterButtonsContainer.querySelector(`.task-filter-btn[data-filter="${hash}"]`);
      if (targetBtn) {
        targetBtn.click();
      } else {
        resetAllFilters();
      }
    }
  }

  window.addEventListener('hashchange', handleHashChange);


  // --- 5. Task Details Modal & Toggle ---

  tasksContainer.addEventListener('click', (e) => {
    // 1. View Details Modal
    if (e.target.closest('.view-details-btn')) {
      const btn = e.target.closest('.view-details-btn');
      const taskId = btn.getAttribute('data-id');
      const card = document.querySelector(`.task-card-wrapper[data-task-id="${taskId}"]`);
      
      if (!card || !bsModal) return;

      const priority = card.getAttribute('data-priority');
      let displayPriority = priority;
      if(priority === 'high') displayPriority = 'High';
      if(priority === 'medium') displayPriority = 'Medium';
      if(priority === 'low') displayPriority = 'Low';

      document.getElementById('modal-title').textContent = card.querySelector('h3').textContent;
      document.getElementById('modal-student').textContent = card.getAttribute('data-student').replace(/\b\w/g, l => l.toUpperCase()); 
      document.getElementById('modal-email').textContent = card.getAttribute('data-email');
      document.getElementById('modal-subject').textContent = card.getAttribute('data-subject').replace(/\b\w/g, l => l.toUpperCase());
      document.getElementById('modal-description').textContent = card.getAttribute('data-description').charAt(0).toUpperCase() + card.getAttribute('data-description').slice(1);
      document.getElementById('modal-deadline').textContent = card.getAttribute('data-deadline');
      document.getElementById('modal-priority').textContent = displayPriority;
      document.getElementById('modal-category').textContent = card.getAttribute('data-category').replace(/\b\w/g, l => l.toUpperCase());
      document.getElementById('modal-hours').textContent = card.getAttribute('data-hours');
      
      const isCompleted = card.getAttribute('data-completed') === 'true';
      const statusBadge = document.getElementById('modal-status');
      statusBadge.textContent = isCompleted ? 'Completed' : 'Pending';
      statusBadge.className = `status-badge status-${isCompleted ? 'complete' : 'pending'}`;

      bsModal.show();
    }

    // 2. Task Completion Toggle
    if (e.target.closest('.toggle-status-btn')) {
      const btn = e.target.closest('.toggle-status-btn');
      const taskId = btn.getAttribute('data-id');
      const card = document.querySelector(`.task-card-wrapper[data-task-id="${taskId}"]`);
      const innerCard = document.getElementById(`taskCard-${taskId}`);
      const statusBadge = document.getElementById(`statusBadge-${taskId}`);
      
      if (!card) return;

      btn.disabled = true;
      const originalText = btn.textContent;
      btn.textContent = 'Updating...';

      fetch(`/tasks/${taskId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        if (data.success) {
          const isCompleted = data.task.completed;
          card.setAttribute('data-completed', isCompleted.toString());
          
          if (isCompleted) {
            innerCard.classList.add('opacity-75');
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-outline-secondary');
            btn.textContent = 'Mark Pending';
            if (statusBadge) {
              statusBadge.className = 'status-badge status-complete';
              statusBadge.textContent = 'Completed';
            }
          } else {
            innerCard.classList.remove('opacity-75');
            btn.classList.add('btn-primary');
            btn.classList.remove('btn-outline-secondary');
            btn.textContent = 'Mark Complete';
            if (statusBadge) {
              statusBadge.className = 'status-badge status-pending';
              statusBadge.textContent = 'Pending';
            }
          }

          showToast(`Task marked as ${isCompleted ? 'Completed' : 'Pending'}!`, 'success');
          updateSummaryStats();
          applyFiltersAndSearch();
        } else {
          throw new Error(data.message || 'Server error');
        }
      })
      .catch(error => {
        console.error('Error toggling task:', error);
        btn.textContent = originalText;
        showToast('Failed to update task. Please try again.', 'error');
      })
      .finally(() => {
        btn.disabled = false;
      });
    }
  });

  // --- 7. Summary Stats Update ---
  
  function updateSummaryStats() {
    const cards = getTaskCards();
    
    const total = cards.length;
    let high = 0;
    let completed = 0;

    cards.forEach(card => {
      if (card.getAttribute('data-priority') === 'high') high++;
      if (card.getAttribute('data-completed') === 'true') completed++;
    });

    const pending = total - completed;

    if (summaryTotal) summaryTotal.textContent = total;
    if (summaryHigh) summaryHigh.textContent = high;
    if (summaryPending) summaryPending.textContent = pending;
    if (summaryCompleted) summaryCompleted.textContent = completed;
  }

  // --- 8. Notification Helpers ---

  function showToast(message, type) {
    if (!bsToast) return;
    
    toastMessage.textContent = message;
    
    if (type === 'error') {
      liveToast.classList.remove('bg-success');
      liveToast.classList.add('bg-danger');
    } else {
      liveToast.classList.add('bg-success');
      liveToast.classList.remove('bg-danger');
    }
    
    bsToast.show();
  }

  // --- Initialize ---
  
  applySorting();
  
  if (window.location.hash) {
    handleHashChange();
  }

});

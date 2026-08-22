// Task 4: Dynamic Interactions for the Task List page

(function() {
  'use strict';

  // --- DOM Elements ---
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');
  const filterButtons = document.querySelectorAll('.filter-btn');
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
  let bsModal = null; // Will be initialized if modal exists
  if (taskDetailsModal) {
    bsModal = new bootstrap.Modal(taskDetailsModal);
  }

  // Toast Elements
  const liveToast = document.getElementById('liveToast');
  const toastMessage = document.getElementById('toastMessage');
  let bsToast = null;
  if (liveToast) {
    bsToast = new bootstrap.Toast(liveToast);
  }

  // Only proceed if we are on the task list page (with tasks container)
  if (!tasksContainer) return;

  // --- State ---
  let currentFilter = 'all'; // Default
  let currentSearch = '';
  let currentSort = 'default';
  
  // Get all task cards as an array for easier sorting/filtering
  // Note: we ignore the globalEmptyState and filterEmptyState nodes
  const getTaskCards = () => Array.from(document.querySelectorAll('.task-card-wrapper'));

  // --- 1. Search & Filtering ---

  function applyFiltersAndSearch() {
    const cards = getTaskCards();
    let visibleCount = 0;
    
    // Determine today for "due-today" and "upcoming"
    const today = new Date();
    today.setHours(0,0,0,0);

    cards.forEach(card => {
      // 1. Check Search
      let matchesSearch = true;
      if (currentSearch) {
        const searchTerms = currentSearch.toLowerCase();
        // Get all searchable text from data attributes
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
        case 'high-priority': matchesFilter = (priority === 'High'); break;
        case 'medium-priority': matchesFilter = (priority === 'Medium'); break;
        case 'low-priority': matchesFilter = (priority === 'Low'); break;
        case 'completed': matchesFilter = isCompleted; break;
        case 'pending': matchesFilter = !isCompleted; break;
        case 'due-today':
        case 'upcoming':
          if (!deadline) {
            matchesFilter = false;
          } else {
            const deadlineDate = new Date(deadline + 'T00:00:00');
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

    // Handle Empty State
    if (visibleCountSpan) visibleCountSpan.textContent = visibleCount;
    
    // Only manage filter empty state if there are actually tasks in the system
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
      // Helper function to get sortable values
      const getVal = (card, attr) => card.getAttribute(attr);
      
      switch (currentSort) {
        case 'oldest':
          // We assume DOM order is newest first by default if we prepend, but our server appends.
          // Wait, server pushes to array, so array is oldest first. 
          // Let's use data-id to be safe. Higher ID = newer.
          return parseInt(getVal(a, 'data-id')) - parseInt(getVal(b, 'data-id'));
          
        case 'deadlineAsc':
        case 'deadlineDesc':
          const dateA = new Date(getVal(a, 'data-deadline') + 'T00:00:00').getTime();
          const dateB = new Date(getVal(b, 'data-deadline') + 'T00:00:00').getTime();
          return currentSort === 'deadlineAsc' ? dateA - dateB : dateB - dateA;
          
        case 'priorityDesc':
          // High > Medium > Low
          const pScore = { 'High': 3, 'Medium': 2, 'Low': 1 };
          const pA = pScore[getVal(a, 'data-priority')] || 0;
          const pB = pScore[getVal(b, 'data-priority')] || 0;
          return pB - pA;
          
        case 'titleAsc':
          const tA = getVal(a, 'data-title') || '';
          const tB = getVal(b, 'data-title') || '';
          return tA.localeCompare(tB);
          
        case 'default':
        default:
          // Default: Newest first (highest ID)
          return parseInt(getVal(b, 'data-id')) - parseInt(getVal(a, 'data-id'));
      }
    });

    // Re-append to DOM in new order
    // Ensure we don't move the empty state node if it exists
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

  filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Update UI active state
      filterButtons.forEach(b => {
        b.classList.remove('btn-primary', 'active');
        b.classList.add('btn-outline-primary');
      });
      e.target.classList.remove('btn-outline-primary');
      e.target.classList.add('btn-primary', 'active');

      // Update state and apply
      currentFilter = e.target.getAttribute('data-filter');
      
      // Update URL Hash for routing
      window.location.hash = currentFilter;
      
      applyFiltersAndSearch();
    });
  });

  function resetAllFilters() {
    currentSearch = '';
    currentSort = 'default';
    currentFilter = 'all';
    
    if (searchInput) searchInput.value = '';
    if (sortSelect) sortSelect.value = 'default';
    
    // Reset buttons
    filterButtons.forEach(b => {
      b.classList.remove('btn-primary', 'active');
      b.classList.add('btn-outline-primary');
      if (b.getAttribute('data-filter') === 'all') {
        b.classList.remove('btn-outline-primary');
        b.classList.add('btn-primary', 'active');
      }
    });
    
    // Clear hash cleanly
    history.pushState("", document.title, window.location.pathname + window.location.search);

    applyFiltersAndSearch();
    applySorting();
  }

  if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', resetAllFilters);
  if (emptyStateResetBtn) emptyStateResetBtn.addEventListener('click', resetAllFilters);

  // --- 4. Hash Routing ---
  
  function handleHashChange() {
    const hash = window.location.hash.substring(1); // remove '#'
    if (!hash) return;
    
    // Find matching button
    const targetBtn = Array.from(filterButtons).find(b => b.getAttribute('data-filter') === hash);
    if (targetBtn) {
      targetBtn.click(); // Re-use the click logic
    } else {
      // Fallback to all
      resetAllFilters();
    }
  }

  window.addEventListener('hashchange', handleHashChange);


  // --- 5. Task Details Modal ---

  // Event delegation on the container
  tasksContainer.addEventListener('click', (e) => {
    // Check if View Details was clicked
    if (e.target.closest('.view-details-btn')) {
      const btn = e.target.closest('.view-details-btn');
      const taskId = btn.getAttribute('data-id');
      const card = document.querySelector(`.task-card-wrapper[data-id="${taskId}"]`);
      
      if (!card || !bsModal) return;

      // Populate modal safely using textContent (prevents XSS)
      document.getElementById('modal-title').textContent = card.querySelector('h3').textContent;
      document.getElementById('modal-student').textContent = card.getAttribute('data-student').replace(/\b\w/g, l => l.toUpperCase()); // Capitalize
      document.getElementById('modal-email').textContent = card.getAttribute('data-email');
      document.getElementById('modal-subject').textContent = card.getAttribute('data-subject').replace(/\b\w/g, l => l.toUpperCase());
      document.getElementById('modal-description').textContent = card.getAttribute('data-description').charAt(0).toUpperCase() + card.getAttribute('data-description').slice(1);
      document.getElementById('modal-deadline').textContent = card.getAttribute('data-deadline');
      document.getElementById('modal-priority').textContent = card.getAttribute('data-priority');
      document.getElementById('modal-category').textContent = card.getAttribute('data-category').replace(/\b\w/g, l => l.toUpperCase());
      document.getElementById('modal-hours').textContent = card.getAttribute('data-hours');
      
      // Status formatting
      const isCompleted = card.getAttribute('data-completed') === 'true';
      const statusBadge = document.getElementById('modal-status');
      statusBadge.textContent = isCompleted ? 'Completed' : 'Pending';
      statusBadge.className = `status-badge status-${isCompleted ? 'complete' : 'pending'}`;

      bsModal.show();
    }

    // --- 6. Task Completion Toggle ---
    if (e.target.closest('.toggle-status-btn')) {
      const btn = e.target.closest('.toggle-status-btn');
      const taskId = btn.getAttribute('data-id');
      const card = document.querySelector(`.task-card-wrapper[data-id="${taskId}"]`);
      const innerCard = document.getElementById(`taskCard-${taskId}`);
      const statusBadge = document.getElementById(`statusBadge-${taskId}`);
      
      if (!card) return;

      // Disable button while processing
      btn.disabled = true;
      const originalText = btn.textContent;
      btn.textContent = 'Updating...';

      // Call Express endpoint
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
          
          // Update DOM attributes
          card.setAttribute('data-completed', isCompleted.toString());
          
          // Update card visuals
          if (isCompleted) {
            innerCard.classList.add('opacity-75');
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-outline-secondary');
            btn.textContent = 'Mark Pending';
            statusBadge.className = 'status-badge status-complete';
            statusBadge.textContent = 'Completed';
          } else {
            innerCard.classList.remove('opacity-75');
            btn.classList.add('btn-primary');
            btn.classList.remove('btn-outline-secondary');
            btn.textContent = 'Mark Complete';
            statusBadge.className = 'status-badge status-pending';
            statusBadge.textContent = 'Pending';
          }

          // Show Toast Success
          showToast(`Task marked as ${isCompleted ? 'Completed' : 'Pending'}!`, 'success');
          
          // Update Summary Stats dynamically
          updateSummaryStats();

          // Re-apply filters so card hides if it no longer matches the current filter
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
      if (card.getAttribute('data-priority') === 'High') high++;
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
  
  // Sort default logic (DOM order)
  applySorting();
  
  // Check hash on load
  if (window.location.hash) {
    handleHashChange();
  }

})();

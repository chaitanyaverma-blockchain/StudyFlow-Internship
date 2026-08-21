// Dark Mode Toggling Logic

(function() {
  const themeToggleBtn = document.getElementById('themeToggle');
  const body = document.body;
  const icon = document.getElementById('themeIcon');

  // Check for saved theme preference in localStorage
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme) {
    body.setAttribute('data-theme', currentTheme);
    updateIcon(currentTheme);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function() {
      // Toggle theme
      let newTheme = 'light';
      if (body.getAttribute('data-theme') !== 'dark') {
        newTheme = 'dark';
      }
      
      body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateIcon(newTheme);
    });
  }

  function updateIcon(theme) {
    if (!icon) return;
    if (theme === 'dark') {
      icon.textContent = '☀️'; // Sun for light mode
    } else {
      icon.textContent = '🌙'; // Moon for dark mode
    }
  }
})();

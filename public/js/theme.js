// Dark Mode Toggling Logic
// Applied as early as possible to avoid flash of wrong theme

(function() {
  // Apply saved theme immediately (this runs in <head> via inline script too)
  var savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.body && document.body.setAttribute('data-theme', 'dark');
  }

  // Wait for DOM to set up toggle button
  document.addEventListener('DOMContentLoaded', function() {
    var themeToggleBtn = document.getElementById('themeToggle');
    var icon = document.getElementById('themeIcon');
    var body = document.body;

    // Apply saved theme to body (in case inline script only got <html>)
    var currentTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', currentTheme);
    updateIcon(currentTheme);
    updateAriaLabel(currentTheme);

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', function() {
        var current = body.getAttribute('data-theme');
        var newTheme = (current === 'dark') ? 'light' : 'dark';

        body.setAttribute('data-theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
        updateAriaLabel(newTheme);
      });
    }

    function updateIcon(theme) {
      if (!icon) return;
      icon.textContent = (theme === 'dark') ? '☀️' : '🌙';
    }

    function updateAriaLabel(theme) {
      if (!themeToggleBtn) return;
      themeToggleBtn.setAttribute('aria-label',
        (theme === 'dark') ? 'Switch to light mode' : 'Switch to dark mode'
      );
    }
  });
})();

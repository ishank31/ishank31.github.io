document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("darkModeToggle");
  const body = document.body;
  const moonIcon = '<i class="fas fa-moon fa-lg"></i>';
  const sunIcon = '<i class="fas fa-sun fa-lg"></i>';

  // Function to apply the correct theme and icon
  function applyTheme(theme) {
    if (theme === "dark") {
      body.classList.add("dark-mode");
      toggleButton.innerHTML = sunIcon;
    } else {
      body.classList.remove("dark-mode");
      toggleButton.innerHTML = moonIcon;
    }
  }

  // Check for saved theme in localStorage, or use system preference
  let savedTheme = localStorage.getItem("theme");
  if (!savedTheme) {
    savedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  applyTheme(savedTheme);

  // Event listener for the toggle button
  toggleButton.addEventListener("click", () => {
    const isDarkMode = body.classList.contains("dark-mode");
    const newTheme = isDarkMode ? "light" : "dark";

    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  });
});

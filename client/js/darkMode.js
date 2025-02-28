document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("dark-mode-toggle");
    const toggleIcon = document.getElementById("toggle-icon");
    const body = document.body;
  
    
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark-mode") {
      body.classList.add("dark-mode");
      toggleIcon.textContent = "🌙"; 
    }
  
    toggleButton.addEventListener("click", () => {
      body.classList.toggle("dark-mode");
  
      if (body.classList.contains("dark-mode")) {
        toggleIcon.textContent = "🌙";
        localStorage.setItem("theme", "dark-mode"); 
      } else {
        toggleIcon.textContent = "🌞"; 
        localStorage.setItem("theme", "light-mode"); 
      }
    });
  });
  
document.addEventListener('DOMContentLoaded', function() {
  const categories = document.getElementById('categories');
  const toggleButton = document.getElementById('dark-mode-toggle');

  // Ensure dashboard is visible on page load
  categories.classList.add('show');
  categories.style.display = 'block';

  // Toggle categories visibility
  function toggleCategories() {
      if (categories.classList.contains('show')) {
          categories.classList.remove('show'); // Hide it
          categories.style.display = 'none'; // Ensure it's hidden
      } else {
          categories.classList.add('show'); // Show it
          categories.style.display = 'block'; // Ensure it's visible
      }
  }

  // Function to hide the categories
  function hideCategories() {
      categories.classList.remove('show');
      categories.style.display = 'none';
  }

  // Toggle dashboard when button is clicked
  toggleButton.addEventListener('click', function(event) {
      toggleCategories();
      event.stopPropagation(); // Prevent click from bubbling to document
  });

  // Hide when clicking a link inside it
  categories.addEventListener('click', function(event) {
      if (event.target.tagName === 'A') {
          hideCategories();
      }
  });

  // Hide when clicking outside
  document.addEventListener('click', function(event) {
      if (!categories.contains(event.target) && event.target !== toggleButton) {
          hideCategories();
      }
  });
});

  document.getElementById("backToTop").addEventListener("click", function() {
     window.scrollTo({ top: 0, behavior: "smooth" });
  });
  

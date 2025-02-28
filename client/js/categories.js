 // JavaScript to toggle the categories section on page load and with button click
 document.addEventListener('DOMContentLoaded', function() {
    const categories = document.getElementById('categories');
    const toggleButton = document.getElementById('dark-mode-toggle');
  
    // Function to toggle the categories visibility
    function toggleCategories() {
      categories.classList.toggle('show'); // Adds/removes the 'show' class
    }
  
    // Automatically show the categories on page load
    categories.classList.add('show');
  
    // Toggle categories when the button is clicked
    toggleButton.addEventListener('click', function() {
      toggleCategories();
    });
  });
  
  
  
  
  document.getElementById("backToTop").addEventListener("click", function() {
     window.scrollTo({ top: 0, behavior: "smooth" });
  });
  
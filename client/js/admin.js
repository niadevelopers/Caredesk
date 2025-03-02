document.getElementById('blogForm').addEventListener('submit', async function (event) {
    event.preventDefault();
  
    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();
    const category = document.getElementById('category').value;
    const image = document.getElementById('imageUrl').value.trim();
    const video = document.getElementById('videoUrl').value.trim();
  
    // ✅ Ensure at least one media is provided
    if (!image && !video) {
      alert('You must provide either an image URL or a video URL.');
      return;
    }
  
    // ✅ Validate URL Format (Ensuring URLs start with "http" or "https")
    const validURL = (url) => url && /^(https?:\/\/)/.test(url);
  
    if (image && !validURL(image)) {
      alert('Invalid image URL. Ensure it starts with "http" or "https".');
      return;
    }
  
    if (video && !validURL(video)) {
      alert('Invalid video URL. Ensure it starts with "http" or "https".');
      return;
    }
  
    const formData = { title, content, category, image, video };
  
    try {
      const response = await fetch('/api/blog/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert('🎉 Blog created successfully!');
        window.location.reload(); // ✅ Reload page to see the new blog
      } else {
        alert(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      console.error('❌ Error submitting blog:', error);
      alert('An unexpected error occurred while submitting the blog.');
    }
  });
  

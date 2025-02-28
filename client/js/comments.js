const queryParams = new URLSearchParams(window.location.search);
const blogId = queryParams.get('blogId');
const commentsContainer = document.getElementById('comments');
const commentForm = document.getElementById('commentForm');


const fetchComments = async () => {
  try {
    const response = await fetch(`/api/comment/${blogId}`);
    const comments = await response.json();

    if (comments.length === 0) {
      commentsContainer.innerHTML = '<p>No comments yet. Be the first to comment!</p>';
    } else {
      commentsContainer.innerHTML = comments
        .map(
          (comment) => `
          <div class="comment">
            <h4>${comment.username}</h4>
            <p>${comment.text}</p>
            <small>${new Date(comment.createdAt).toLocaleString()}</small>
          </div>
        `
        )
        .join('');
    }
  } catch (err) {
    console.error('Error fetching comments:', err.message);
    commentsContainer.innerHTML = '<p>Error loading comments. Please try again later.</p>';
  }
};


commentForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const text = document.getElementById('text').value;

  try {
    await fetch(`/api/comment/${blogId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, text }),
    });

    fetchComments();
    commentForm.reset();
  } catch (err) {
    console.error('Error adding comment:', err.message);
  }
});


fetchComments();

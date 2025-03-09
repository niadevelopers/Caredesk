document.addEventListener("DOMContentLoaded", function () {
  function createOverlay(videoElement) {
    // Ensure the parent container is positioned correctly
    videoElement.parentElement.style.position = "relative";

    // Create the overlay
    const overlay = document.createElement("div");
    overlay.classList.add("video-overlay");
    overlay.innerHTML = `<p>Video paused. Click to resume.</p>`;
    overlay.style.display = "none"; // Initially hidden

    // Append overlay to video container
    videoElement.parentElement.appendChild(overlay);

    // Clicking overlay resumes video
    overlay.addEventListener("click", () => {
      videoElement.play();
      overlay.style.display = "none";
    });

    return overlay;
  }

  function handleVideo(video) {
    const overlay = createOverlay(video);

    video.addEventListener("pause", () => {
      overlay.style.display = "flex"; // Show overlay when paused
    });

    video.addEventListener("play", () => {
      overlay.style.display = "none"; // Hide overlay when playing
    });

    video.addEventListener("timeupdate", () => {
      if (video.duration - video.currentTime <= 3) {
        overlay.style.display = "flex"; // Show overlay 3 seconds before the end
      }
    });
  }

  function applyOverlayToVideos() {
    document.querySelectorAll(".blog-card video").forEach(video => {
      if (!video.dataset.overlayAdded) {
        handleVideo(video);
        video.dataset.overlayAdded = "true"; // Prevent duplicate overlays
      }
    });
  }

  function waitForBlogsContainer() {
    const blogsContainer = document.getElementById("blogsContainer");
    if (!blogsContainer) {
      setTimeout(waitForBlogsContainer, 100); // Wait until it exists
      return;
    }

    // Apply overlay to existing videos
    applyOverlayToVideos();

    // Observe dynamically added blog posts
    const observer = new MutationObserver(() => applyOverlayToVideos());
    observer.observe(blogsContainer, { childList: true, subtree: true });
  }

  waitForBlogsContainer(); // Start checking for blogsContainer
});

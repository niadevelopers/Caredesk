document.addEventListener("DOMContentLoaded", function () {
  function createOverlay(videoElement) {
    // Create overlay
    const overlay = document.createElement("div");
    overlay.classList.add("video-overlay");
    overlay.innerHTML = `<p>Video paused. Click to continue watching.</p>`;
    overlay.style.display = "none";

    // Position overlay inside the video container
    videoElement.parentElement.style.position = "relative";
    videoElement.parentElement.appendChild(overlay);

    // Clicking overlay resumes video
    overlay.addEventListener("click", () => {
      if (videoElement.tagName === "VIDEO") {
        videoElement.play();
      } else if (videoElement.tagName === "IFRAME") {
        resumeIframeVideo(videoElement);
      }
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
        overlay.style.display = "flex"; // Show overlay near end
      }
    });
  }

  function handleIframe(iframe) {
    const overlay = createOverlay(iframe);

    // YouTube & Facebook Video API Check
    const checkPause = setInterval(() => {
      getIframeStatus(iframe, (paused) => {
        overlay.style.display = paused ? "flex" : "none";
      });
    }, 1000);

    iframe.dataset.overlayInterval = checkPause;
  }

  function getIframeStatus(iframe, callback) {
    if (iframe.src.includes("youtube.com")) {
      try {
        iframe.contentWindow.postMessage(
          '{"event":"listening","id":1,"channel":"yt"}',
          "*"
        );
        window.addEventListener("message", (event) => {
          if (event.data && typeof event.data === "object" && event.data.info) {
            callback(event.data.info.playerState === 2); // 2 = Paused
          }
        });
      } catch (e) {
        console.error("YouTube iframe status error:", e);
      }
    }
  }

  function resumeIframeVideo(iframe) {
    if (iframe.src.includes("youtube.com")) {
      try {
        iframe.contentWindow.postMessage(
          '{"event":"command","func":"playVideo","args":""}',
          "*"
        );
      } catch (e) {
        console.error("YouTube resume error:", e);
      }
    }
  }

  // Apply overlay to all videos & iframes
  document.querySelectorAll("video").forEach(handleVideo);
  document.querySelectorAll("iframe").forEach(handleIframe);
});

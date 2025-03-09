document.addEventListener("DOMContentLoaded", function () {
  function createOverlay(videoElement) {
    const overlay = document.createElement("div");
    overlay.classList.add("video-overlay");
    overlay.innerHTML = `
      <p>Video paused. Click to continue watching.</p>
    `;
    overlay.style.display = "none";
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
      overlay.style.display = "flex"; // Show overlay
    });

    video.addEventListener("play", () => {
      overlay.style.display = "none"; // Hide overlay
    });

    video.addEventListener("timeupdate", () => {
      if (video.duration - video.currentTime <= 3) {
        overlay.style.display = "flex"; // Show overlay when video is about to end
      }
    });
  }

  function handleIframe(iframe) {
    const overlay = createOverlay(iframe);

    const checkPause = setInterval(() => {
      getIframeStatus(iframe, (paused) => {
        if (paused) {
          overlay.style.display = "flex"; // Show overlay
        } else {
          overlay.style.display = "none"; // Hide overlay
        }
      });
    }, 1000);

    iframe.dataset.overlayInterval = checkPause;
  }

  function getIframeStatus(iframe, callback) {
    if (iframe.src.includes("youtube.com")) {
      iframe.contentWindow.postMessage(
        '{"event":"listening","id":1,"channel":"yt"}',
        "*"
      );
      window.addEventListener("message", (event) => {
        if (event.data && typeof event.data === "object" && event.data.info) {
          callback(event.data.info.playerState === 2); // 2 = Paused
        }
      });
    }
  }

  function resumeIframeVideo(iframe) {
    if (iframe.src.includes("youtube.com")) {
      iframe.contentWindow.postMessage(
        '{"event":"command","func":"playVideo","args":""}',
        "*"
      );
    }
  }

  // Apply logic to all videos and iframes
  document.querySelectorAll("video").forEach(handleVideo);
  document.querySelectorAll("iframe").forEach(handleIframe);
});

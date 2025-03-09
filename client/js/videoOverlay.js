document.addEventListener("DOMContentLoaded", function () {
  function createOverlay(iframe) {
    const parent = iframe.parentElement;
    parent.style.position = "relative"; // Ensure correct positioning

    const overlay = document.createElement("div");
    overlay.classList.add("video-overlay");
    overlay.innerHTML = `<p>Video paused. Click to resume.</p>`;

    Object.assign(overlay.style, {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.7)",
      color: "#fff",
      fontSize: "18px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      zIndex: "10",
      display: "none" // Initially hidden
    });

    parent.appendChild(overlay);

    overlay.addEventListener("click", () => {
      iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', "*");
      overlay.style.display = "none";
    });

    return overlay;
  }

  function handleIframe(iframe) {
    const overlay = createOverlay(iframe);

    // ✅ Detect when video is paused (Only works for YouTube)
    window.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === "infoDelivery" && data.info && data.info.playerState === 2) {
          overlay.style.display = "flex"; // Show overlay on pause
        }
      } catch (error) {
        // Ignore non-JSON messages
      }
    });

    // ✅ Ensure the YouTube player API is enabled
    if (iframe.src.includes("youtube.com/embed/")) {
      iframe.src += (iframe.src.includes("?") ? "&" : "?") + "enablejsapi=1";
    }
  }

  function applyOverlayToIframes() {
    document.querySelectorAll(".blog-card iframe").forEach(iframe => {
      if (!iframe.dataset.overlayAdded) {
        handleIframe(iframe);
        iframe.dataset.overlayAdded = "true"; // Prevent duplicate overlays
      }
    });
  }

  // ✅ Watch for dynamically added blogs and apply overlays
  function observeBlogChanges() {
    const blogsContainer = document.getElementById("blogsContainer");

    if (!blogsContainer) {
      setTimeout(observeBlogChanges, 100); // Retry if container not found
      return;
    }

    applyOverlayToIframes(); // Apply to existing iframes

    new MutationObserver(() => applyOverlayToIframes())
      .observe(blogsContainer, { childList: true, subtree: true });
  }

  observeBlogChanges();
});

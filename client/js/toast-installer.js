// JavaScript to handle the toast banner functionality
let deferredPrompt;
const installToast = document.getElementById('installToast');
const installButton = document.getElementById('installButton');
const closeToast = document.getElementById('closeToast');

// Listen for the 'beforeinstallprompt' event
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the default prompt from showing
    e.preventDefault();
    deferredPrompt = e;

    // Show the custom install toast
    setTimeout(() => {
        installToast.style.display = 'block';
    }, 6000); // The toast appears after 6 seconds

    // Install button click handler
    installButton.addEventListener('click', () => {
        installToast.style.display = 'none'; // Hide the toast
        deferredPrompt.prompt(); // Show the install prompt
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            deferredPrompt = null;
        });
    });

    // Close button click handler
    closeToast.addEventListener('click', () => {
        installToast.style.display = 'none'; // Hide the toast when closed
    });
});

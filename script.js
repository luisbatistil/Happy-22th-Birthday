window.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const pageContent = document.querySelector('.page-content');

    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
        if (pageContent) {
            pageContent.classList.add('loaded');
        }
    }, 15000);
});
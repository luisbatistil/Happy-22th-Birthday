window.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const pageContent = document.querySelector('.page-content');
    const quoteElement = document.getElementById('loading-quote');

    const quotes = [
        'Warning: This website contains one extremely adorable girl who has completely stolen my heart.',
        'Even Kuromi would be jealous because you\'re the cutest troublemaker in my heart.',
        'Among all the stars, you\'re my favorite shade of purple.',
        'Every page you open is another reason why I\'m thankful you exist.',
        'If love had a color, it would be your favorite shade of purple.'
    ];

    let quoteIndex = 0;

    if (quoteElement) {
        quoteElement.textContent = quotes[quoteIndex];

        const rotateQuote = () => {
            quoteElement.classList.add('fade-out');
            setTimeout(() => {
                quoteIndex = (quoteIndex + 1) % quotes.length;
                quoteElement.textContent = quotes[quoteIndex];
                quoteElement.classList.remove('fade-out');
            }, 500);
        };

        setInterval(rotateQuote, 3500);
    }

    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 800);
        }
        if (pageContent) {
            pageContent.classList.add('loaded');
        }
    }, 18000);
});
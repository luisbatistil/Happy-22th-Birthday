window.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const portalScreen = document.querySelector('.portal-screen');
    const portalButton = document.getElementById('portal-button');
    const moonPortal = document.getElementById('moon-portal');
    const bgZoom = document.querySelector('.bg-zoom');
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

    const showPortalScreen = () => {
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 800);
        }
        if (portalScreen) {
            portalScreen.classList.remove('hidden');
            requestAnimationFrame(() => {
                portalScreen.classList.add('loaded');
            });
        }
    };

    const playWhoosh = () => {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const bufferSize = audioCtx.sampleRate * 0.5;
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);

            for (let i = 0; i < bufferSize; i += 1) {
                data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
            }

            const noise = audioCtx.createBufferSource();
            noise.buffer = buffer;
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 1200;

            const gain = audioCtx.createGain();
            gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.35, audioCtx.currentTime + 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

            noise.connect(filter).connect(gain).connect(audioCtx.destination);
            noise.start();
            noise.stop(audioCtx.currentTime + 0.5);
        } catch (error) {
            console.warn('Unable to play portal sound:', error);
        }
    };

    const activatePortal = () => {
        if (!moonPortal || !portalScreen || !bgZoom) return;

        portalScreen.classList.add('fading-out');
        bgZoom.classList.remove('hidden');
        requestAnimationFrame(() => {
            bgZoom.classList.add('zooming');
        });

        moonPortal.classList.remove('hidden');
        moonPortal.classList.add('visible', 'active');
        document.body.classList.add('darkened');
        playWhoosh();

        setTimeout(() => {
            moonPortal.classList.add('zooming');
        }, 600);

        setTimeout(() => {
            bgZoom.style.opacity = '0';
        }, 1200);

        setTimeout(() => {
            window.location.href = 'portal.html';
        }, 2200);
    };

    if (portalButton) {
        portalButton.addEventListener('click', activatePortal);
    }

    setTimeout(showPortalScreen, 18000);
});

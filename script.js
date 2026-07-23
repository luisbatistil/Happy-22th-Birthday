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

// Treasure hunt: Kuromi gift finder
(() => {
    const treasures = {
        'gift-1': {
            title: 'Gift Kuromi 1',
            subtitle: 'A hidden present awaits!',
            image: 'images/kuromi_gift.png',
            text: 'You discovered the first Kuromi holding a gift. One memory unlocked!'
        },
        'gift-2': {
            title: 'Gift Kuromi 2',
            subtitle: 'Nice find!',
            image: 'images/kuromi_gift.png',
            text: 'Second gift found. Keep searching among the Kuromi that look like they belong here.'
        },
        'gift-3': {
            title: 'Gift Kuromi 3',
            subtitle: 'Another treasure!',
            image: 'images/kuromi_gift.png',
            text: 'Three gifts down. The hunt is getting more exciting.'
        },
        'gift-4': {
            title: 'Gift Kuromi 4',
            subtitle: 'You found one hidden in the gallery!',
            image: 'images/kuromi_gift.png',
            text: 'Four gifts collected. You are doing great — only a few left to unlock the final surprise.'
        },
        'gift-5': {
            title: 'Gift Kuromi 5',
            subtitle: 'A sweet discovery!',
            image: 'images/kuromi_gift.png',
            text: 'Five gifts unlocked. These Kuromi are blending in beautifully with the page design.'
        },
        'gift-6': {
            title: 'Gift Kuromi 6',
            subtitle: 'Hidden in the letter area!',
            image: 'images/kuromi_gift.png',
            text: 'Six gifts found — only two more hidden Kuromi to find before the final surprise appears.'
        },
        'gift-7': {
            title: 'Gift Kuromi 7',
            subtitle: 'One more step closer!',
            image: 'images/kuromi_gift.png',
            text: 'Seven gifts collected. The last hidden Kuromi is waiting for you.'
        },
        'gift-8': {
            title: 'Gift Kuromi 8',
            subtitle: 'All gifts found!',
            image: 'images/kuromi_gift.png',
            text: 'You discovered the eighth gift Kuromi. The final surprise is now unlocked—tap the final gift card below.'
        }
    };

    const totalTreasures = Object.keys(treasures).length;
    const foundTreasureIds = new Set();

    const counterEl = document.getElementById('treasure-counter');
    const finalGiftEl = document.getElementById('final-gift-card');
    const treasureModal = document.getElementById('treasure-modal');
    const treasureOverlay = document.getElementById('treasure-modal-overlay');
    const closeTreasure = document.getElementById('close-treasure');
    const modalTitle = document.getElementById('treasure-modal-title');
    const modalSubtitle = document.getElementById('treasure-modal-subtitle');
    const modalText = document.getElementById('treasure-modal-text');
    const modalImage = document.getElementById('treasure-modal-image');
    const nodeElements = document.querySelectorAll('.kuromi-node');
    const treasureGiftButton = document.getElementById('treasure-hunt-gift');

    function updateCounter() {
        if (counterEl) {
            counterEl.textContent = String(foundTreasureIds.size);
        }
    }

    function initTreasureImages() {
        nodeElements.forEach((node) => {
            const src = node.dataset.imageSrc;
            if (src) {
                node.style.backgroundImage = `url("${src}")`;
                node.style.backgroundSize = 'contain';
                node.style.backgroundPosition = 'center';
                node.style.backgroundRepeat = 'no-repeat';
            }
        });
    }

    initTreasureImages();

    function openTreasureModal(title, subtitle, text, imageSrc) {
        if (!treasureModal || !modalTitle || !modalSubtitle || !modalText || !modalImage) return;
        modalTitle.textContent = title;
        modalSubtitle.textContent = subtitle;
        modalText.textContent = text;
        modalImage.src = imageSrc || '';
        treasureModal.classList.remove('hidden');
        treasureModal.classList.add('visible');
    }

    function closeTreasureModal() {
        if (!treasureModal) return;
        treasureModal.classList.remove('visible');
        setTimeout(() => {
            treasureModal.classList.add('hidden');
        }, 250);
    }

    function handleTreasureClick(node, treasureId) {
        if (!treasureId) return;
        const isGift = treasureId.startsWith('gift-');
        const alreadyFound = foundTreasureIds.has(treasureId);

        if (!isGift) {
            openTreasureModal('Not a gift', 'Keep searching!', 'This Kuromi is a decoy and not holding a gift. The real gift Kuromi are hidden nearby.', 'images/kuromi_gift.png');
            return;
        }

        if (alreadyFound) {
            openTreasureModal('Already found', 'Great job!', 'You already unlocked this Kuromi gift. Keep looking for the remaining gifts to unlock the final surprise.', 'images/kuromi_gift.png');
            return;
        }

        foundTreasureIds.add(treasureId);
        if (node) node.classList.add('found');
        updateCounter();
        const treasure = treasures[treasureId];
        openTreasureModal(treasure.title, treasure.subtitle, treasure.text, treasure.image);

        if (foundTreasureIds.size === totalTreasures) {
            if (finalGiftEl) {
                finalGiftEl.classList.add('unlocked');
                finalGiftEl.textContent = 'Final Surprise Unlocked! Tap to open';
            }
            if (treasureGiftButton) {
                treasureGiftButton.classList.add('unlocked');
                treasureGiftButton.setAttribute('aria-label', 'Open final surprise gift');
            }
            const note = document.querySelector('.treasure-hunt-note');
            if (note) {
                note.textContent = 'Final surprise unlocked! Tap the gift to open it.';
            }
        }
    }

    if (nodeElements.length && counterEl) {
        nodeElements.forEach((node) => {
            const treasureId = node.getAttribute('data-treasure-id');
            node.addEventListener('click', () => handleTreasureClick(node, treasureId));
        });
    }

    if (finalGiftEl) {
        finalGiftEl.addEventListener('click', () => {
            const count = foundTreasureIds.size;
            if (count === totalTreasures) {
                openTreasureModal('Final Surprise!', 'A big gift box appears', 'Congratulations! You found all 8 gift-bearing Kuromi. The final surprise is yours: a long letter full of love and a special memory meant only for you.', 'images/Bunch_kuromi1.png');
            } else {
                openTreasureModal('Keep searching', 'Not ready yet', `You need ${totalTreasures - count} more gift Kuromi before the final surprise can be unlocked. Explore the page and find the hidden gifts!`, 'images/kuromi_gift.png');
            }
        });
    }

    if (treasureGiftButton) {
        treasureGiftButton.addEventListener('click', () => {
            const count = foundTreasureIds.size;
            if (count === totalTreasures) {
                openTreasureModal('Final Surprise!', 'Open the big gift', 'You found all 8 hidden Kuromi gifts. Enjoy the final surprise and the special message inside.', 'images/Bunch_kuromi1.png');
            } else {
                openTreasureModal('Not ready yet', 'Find all gifts first', `You still need ${totalTreasures - count} more gift Kuromi before the final surprise can open. Keep searching!`, 'images/kuromi_gift.png');
            }
        });
    }

    if (closeTreasure) closeTreasure.addEventListener('click', closeTreasureModal);
    if (treasureOverlay) treasureOverlay.addEventListener('click', closeTreasureModal);
})();

// Love letter interaction: envelope click -> modal with handwritten typing
(() => {
    const envelopes = document.querySelectorAll('.envelope');
    const letterModal = document.getElementById('letter-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const closeBtn = document.getElementById('close-letter');
    const letterInner = document.getElementById('letter-inner');

    if (!envelopes.length || !letterModal || !letterInner) return;

    const letterTexts = {
        '1': `Happy 22nd Birthday, my love!\n\nThis first letter is a tiny reminder of how grateful I am for every laugh we share.\n\nYou make ordinary days feel magical.\n\nLove always,\n- Me`,
        '2': `Dear birthday girl,\n\nYou are my favorite story, every chapter sweeter than the last.\nThank you for being my person and my home.\n\nForever and ever,\n- Me`,
        '3': `Sweetheart,\n\nOn your special day I just want you to know you are cherished, adored, and never taken for granted.\n\nAlways yours,\n- Me`,
        '4': `My dearest,\n\nI hope this letter finds you smiling. My heart is full because you are in it.\n\nHappy birthday, my one and only.\n- Me`
    };

    function typeLetter(text, target, speed = 30) {
        target.textContent = '';
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        target.appendChild(cursor);
        let i = 0;
        function step() {
            if (i < text.length) {
                const ch = text[i++];
                if (ch === '\n') {
                    target.insertBefore(document.createElement('br'), cursor);
                } else {
                    const node = document.createTextNode(ch);
                    target.insertBefore(node, cursor);
                }
                setTimeout(step, speed);
            } else {
                cursor.remove();
            }
        }
        step();
    }

    function openLetterModal(targetEnvelope) {
        envelopes.forEach((env) => env.classList.remove('open'));
        targetEnvelope.classList.add('open');
        const id = targetEnvelope.dataset.letter || '1';
        const letterText = letterTexts[id] || letterTexts['1'];
        setTimeout(() => {
            letterModal.classList.remove('hidden');
            letterModal.classList.add('visible');
            const paper = document.querySelector('.letter-paper');
            if (paper) paper.classList.add('pop');
            // start typing
            typeLetter(letterText, letterInner, 28);
        }, 420);
    }

    function closeLetterModal() {
        const paper = document.querySelector('.letter-paper');
        if (paper) paper.classList.remove('pop');
        letterInner.textContent = '';
        letterModal.classList.remove('visible');
        // small delay before hiding to allow transition
        setTimeout(() => {
            letterModal.classList.add('hidden');
            envelopes.forEach((env) => env.classList.remove('open'));
        }, 300);
    }

    envelopes.forEach((envelope) => {
        envelope.addEventListener('click', () => openLetterModal(envelope));
    });
    if (closeBtn) closeBtn.addEventListener('click', closeLetterModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeLetterModal);
})();

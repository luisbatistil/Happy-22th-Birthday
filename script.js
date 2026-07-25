window.addEventListener("DOMContentLoaded", () => {
  const loadingScreen = document.getElementById("loading-screen");
  const portalScreen = document.querySelector(".portal-screen");
  const portalButton = document.getElementById("portal-button");
  const moonPortal = document.getElementById("moon-portal");
  const bgZoom = document.querySelector(".bg-zoom");
  const quoteElement = document.getElementById("loading-quote");

  const quotes = [
    "Warning: This website contains one extremely adorable girl who has completely stolen my heart.",
    "Even Kuromi would be jealous because you're the cutest troublemaker in my heart.",
    "Among all the stars, you're my favorite shade of purple.",
    "Every page you open is another reason why I'm thankful you exist.",
    "If love had a color, it would be your favorite shade of purple.",
  ];

  let quoteIndex = 0;

  if (quoteElement) {
    quoteElement.textContent = quotes[quoteIndex];

    const rotateQuote = () => {
      quoteElement.classList.add("fade-out");
      setTimeout(() => {
        quoteIndex = (quoteIndex + 1) % quotes.length;
        quoteElement.textContent = quotes[quoteIndex];
        quoteElement.classList.remove("fade-out");
      }, 500);
    };

    setInterval(rotateQuote, 3500);
  }

  const showPortalScreen = () => {
    if (loadingScreen) {
      loadingScreen.classList.add("fade-out");
      setTimeout(() => {
        loadingScreen.style.display = "none";
      }, 800);
    }
    if (portalScreen) {
      portalScreen.classList.remove("hidden");
      requestAnimationFrame(() => {
        portalScreen.classList.add("loaded");
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
      filter.type = "lowpass";
      filter.frequency.value = 1200;

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.35, audioCtx.currentTime + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

      noise.connect(filter).connect(gain).connect(audioCtx.destination);
      noise.start();
      noise.stop(audioCtx.currentTime + 0.5);
    } catch (error) {
      console.warn("Unable to play portal sound:", error);
    }
  };

  const activatePortal = () => {
    if (!moonPortal || !portalScreen || !bgZoom) return;

    portalScreen.classList.add("fading-out");
    bgZoom.classList.remove("hidden");
    requestAnimationFrame(() => {
      bgZoom.classList.add("zooming");
    });

    moonPortal.classList.remove("hidden");
    moonPortal.classList.add("visible", "active");
    document.body.classList.add("darkened");
    playWhoosh();

    setTimeout(() => {
      moonPortal.classList.add("zooming");
    }, 600);

    setTimeout(() => {
      bgZoom.style.opacity = "0";
    }, 1200);

    setTimeout(() => {
      window.location.href = "portal.html";
    }, 2200);
  };

  if (portalButton) {
    portalButton.addEventListener("click", activatePortal);
  }

  setTimeout(showPortalScreen, 18000);
});

// Treasure hunt: Kuromi gift finder
(() => {
  const treasures = {
    "gift-1": {
      title: "Grabe pwede na pwede na",
      subtitle: "A hidden present awaits!",
      image: "images/kuromi_gift.png",
      text: "You discovered Kuromi holding a gift!",
    },
    "gift-2": {
      title: "nanalo ka ng 1million na kiss hehe",
      subtitle: "Nice find!",
      image: "images/kuromi_gift.png",
      text: "You discovered Kuromi holding a gift!",
    },
    "gift-3": {
      title: "What theeeee",
      subtitle: "Another treasure!",
      image: "images/kuromi_gift.png",
      text: "You discovered Kuromi holding a gift!",
    },
    "gift-4": {
      title: "Dali lang to para sayo hehe",
      subtitle: "You found one hidden in the gallery!",
      image: "images/kuromi_gift.png",
      text: "You discovered Kuromi holding a gift!",
    },
    "gift-5": {
      title: "Gift Kuromi 5",
      subtitle: "Wooaaaaaahhh!!!",
      image: "images/kuromi_gift.png",
      text: "You discovered Kuromi holding a gift!",
    },
    "gift-6": {
      title: "Talas talaga ng eyes mo baby",
      subtitle: "Galing sobra baby hihi!",
      image: "images/kuromi_gift.png",
      text: "You discovered Kuromi holding a gift!",
    },
    "gift-7": {
      title: "Basic na basic ah",
      subtitle: "Grabe professional ahh!",
      image: "images/kuromi_gift.png",
      text: "You discovered Kuromi holding a gift!",
    },
    "gift-8": {
      title: "IQ level 999999999999999",
      subtitle: "galing baby!",
      image: "images/kuromi_gift.png",
      text: "You discovered Kuromi holding a gift!",
    },
  };

  const totalTreasures = Object.keys(treasures).length;
  const foundTreasureIds = new Set();

  const counterEl = document.getElementById("treasure-counter");
  const finalGiftEl = document.getElementById("final-gift-card");
  const treasureModal = document.getElementById("treasure-modal");
  const treasureOverlay = document.getElementById("treasure-modal-overlay");
  const closeTreasure = document.getElementById("close-treasure");
  const modalTitle = document.getElementById("treasure-modal-title");
  const modalSubtitle = document.getElementById("treasure-modal-subtitle");
  const modalText = document.getElementById("treasure-modal-text");
  const modalImage = document.getElementById("treasure-modal-image");
  const nodeElements = document.querySelectorAll(".kuromi-node");
  const treasureGiftButton = document.getElementById("treasure-hunt-gift");

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
        node.style.backgroundSize = "contain";
        node.style.backgroundPosition = "center";
        node.style.backgroundRepeat = "no-repeat";
      }
    });
  }

  function setupTreasureReveal() {
    const treasureSection = document.querySelector(".treasure-hunt-section");
    if (!treasureSection) return;

    nodeElements.forEach((node) => node.classList.add("hidden-until-reveal"));

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            nodeElements.forEach((node) => node.classList.add("revealed"));
            obs.disconnect();
          }
        });
      },
      {
        threshold: 0.2,
      },
    );

    observer.observe(treasureSection);
  }

  initTreasureImages();
  setupTreasureReveal();

  function openTreasureModal(title, subtitle, text, imageSrc) {
    if (
      !treasureModal ||
      !modalTitle ||
      !modalSubtitle ||
      !modalText ||
      !modalImage
    )
      return;
    modalTitle.textContent = title;
    modalSubtitle.textContent = subtitle;
    modalText.textContent = text;
    modalImage.src = imageSrc || "";
    treasureModal.classList.remove("hidden");
    treasureModal.classList.add("visible");
  }

  function closeTreasureModal() {
    if (!treasureModal) return;
    treasureModal.classList.remove("visible");
    setTimeout(() => {
      treasureModal.classList.add("hidden");
    }, 250);
  }

  window.closeTreasureModal = closeTreasureModal;

  function handleTreasureClick(node, treasureId) {
    if (!treasureId) return;
    const isGift = treasureId.startsWith("gift-");
    const alreadyFound = foundTreasureIds.has(treasureId);

    if (!isGift) {
      openTreasureModal(
        "Not a gift",
        "Keep searching!",
        "This Kuromi is a decoy and not holding a gift. The real gift Kuromi are hidden nearby.",
        "images/kuromi_nogift.png",
      );
      return;
    }

    if (alreadyFound) {
      openTreasureModal(
        "Already found",
        "Great job!",
        "You already unlocked this Kuromi gift. Keep looking for the remaining gifts to unlock the final surprise.",
        "images/kuromi_gift.png",
      );
      return;
    }

    foundTreasureIds.add(treasureId);
    if (node) node.classList.add("found");
    updateCounter();
    const treasure = treasures[treasureId];
    openTreasureModal(
      treasure.title,
      treasure.subtitle,
      treasure.text,
      treasure.image,
    );

    if (foundTreasureIds.size === totalTreasures) {
      if (finalGiftEl) {
        finalGiftEl.classList.add("unlocked");
        finalGiftEl.textContent = "Final Surprise Unlocked! Tap to open";
      }
      if (treasureGiftButton) {
        treasureGiftButton.classList.add("unlocked");
        treasureGiftButton.setAttribute(
          "aria-label",
          "Open final surprise gift",
        );
      }
      const note = document.querySelector(".treasure-hunt-note");
      if (note) {
        note.textContent =
          "Final surprise unlocked! Tap the gift to open the letter.";
      }
    }
  }

  if (nodeElements.length && counterEl) {
    nodeElements.forEach((node) => {
      const treasureId = node.getAttribute("data-treasure-id");
      node.addEventListener("click", () =>
        handleTreasureClick(node, treasureId),
      );
    });
  }

  if (finalGiftEl) {
    finalGiftEl.addEventListener("click", () => {
      const count = foundTreasureIds.size;
      if (count === totalTreasures) {
        if (window.openFinalLetterModal) {
          window.openFinalLetterModal();
        }
      } else {
        openTreasureModal(
          "Keep searching",
          "Not ready yet",
          `You need ${totalTreasures - count} more gift Kuromi before the final surprise can be unlocked. Explore the page and find the hidden gifts!`,
          "images/kuromi_gift.png",
        );
      }
    });
  }

  if (treasureGiftButton) {
    treasureGiftButton.addEventListener("click", () => {
      const count = foundTreasureIds.size;
      if (count === totalTreasures) {
        if (window.openFinalLetterModal) {
          window.openFinalLetterModal();
        }
      } else {
        openTreasureModal(
          "Not ready yet",
          "Find all gifts first",
          `You still need ${totalTreasures - count} more gift Kuromi before the final surprise can open. Keep searching!`,
          "images/kuromi_gift.png",
        );
      }
    });
  }

  if (closeTreasure)
    closeTreasure.addEventListener("click", closeTreasureModal);
  if (treasureOverlay)
    treasureOverlay.addEventListener("click", closeTreasureModal);
})();

// Love letter interaction: envelope click -> modal with handwritten typing
(() => {
  const envelopes = document.querySelectorAll(".envelope");
  const letterModal = document.getElementById("letter-modal");
  const modalOverlay = document.getElementById("modal-overlay");
  const closeBtn = document.getElementById("close-letter");
  const letterInner = document.getElementById("letter-inner");
  const letterActions = document.getElementById("letter-actions");
  const finalSurpriseLink = document.getElementById("final-surprise-link");
  let typingSession = 0;

  if (!envelopes.length || !letterModal || !letterInner) return;

  const letterTexts = {
    1: `Grabe baby ko Minsan nga naiisip ko na sana pwede ko ihinto yung oras kapag magkasama tayo. Kasi ang bilis lagi lumipas. Parang kakasimula palang ng araw tapos biglang gabi na agad. Gusto ko mas humaba pa yung oras natin. Gusto ko mas madami pa tayong kwentuhan. Mas madami pa tayong tawanan. Mas madami pa tayong memories. Kasi bawat memory na kasama kita sobrang special para sakin. \n- Baby`,
    2: `Babyyy gusto ko lang sabihin na sobrang proud ako sayo. Proud ako sa lahat ng ginagawa mo kahit feeling mo maliit lang yun. Proud ako kasi ang sipag sipag mo. Proud ako kasi kahit napapagod ka lumalaban ka padin. Proud ako kasi hindi ka basta sumusuko. Alam ko minsan may mga araw na parang gusto mo nalang humiga at wag gawin lahat pero ginagawa mo padin kasi gusto mo maabot mga pangarap mo. Kaya sobrang hanga ako sayo. Sana wag mo kakalimutan na nandito lang ako lagi para suportahan ka. Kahit maliit lang yung kaya kong gawin gusto ko maramdaman mo na hindi ka nag iisa.\n- Baby`,
    3: `I loveelovevee lovee youuu sooo sooo muchyy hihi. Sobrang sobra babyyy. Mahaaal na mahaal mahaaal kita lovelove koooooo. Hindi ko talaga mapapagod sabihin yan sayo. Kahit araw araw ko pa sabihin feeling ko kulang padin. Kasi habang tumatagal mas lalo lang kitang minamahal. Akala ko dati may limit yung pagmamahal pero nung dumating ka parang wala pala. Habang tumatagal lalo lang lumalalim. Lalo lang lumalaki. Lalo lang nagiging totoo.

Sana sa birthday mo ngayon maging sobrang saya mo. Sana lahat ng hinihiling mo matupad. Sana healthy ka palagi. Sana safe ka lagi. Sana lagi kang may dahilan para ngumiti. Kasi gustong gusto ko yung ngiti mo. Ang cute cute mo pag nakangiti ka hihi. Pag masaya ka masaya din ako. Pag nalulungkot ka nalulungkot din ako. Kaya gusto ko lagi nandito para sayo. Gusto ko maging tao na pwede mong takbuhan kahit anong mangyari.\n- Baby`,
    4: `Happy Birthday ulit mahal ko. Sana pag gising mo araw araw lagi mong maalala na may isang tao na sobrang nagmamahal sayo. Isang tao na handang makinig sayo kahit anong oras. Isang tao na handang samahan ka sa lahat ng pangarap mo. Isang tao na handang tumawa kasama ka at umiyak kasama ka. At yung taong yun ako yun babyyy. Hindi man ako perfect pero totoo lahat ng pagmamahal ko sayo.

Kaya sana sa bawat birthday mo ako padin yung nandyan. Sana sa susunod na taon ako padin yung unang babati sayo. Sana sa maraming taon pa ako padin yung tatawag sayong babyyy at mahal ko. Sana tayo padin hanggang sa pagtanda natin. Alam kong walang nakakaalam ng future pero isa lang sigurado ako araw araw kitang pipiliin. Araw araw kitang mamahalin. Araw araw kitang lalambingin. Araw araw sasabihin ko sayo na I loveelovevee lovee youuu sooo sooo muchyy hihi. Mahaaal na mahaal mahaaal kita lovelove koooooo. Mwaaa mwaaaa mwaaa mwaaaaa.\n- Baby`,
  };

  const finalLetterText = `My Baby.

Happy happy birthday mahal ko. Hindi ko talaga alam pano sisimulan tong letter na to kasi ang 
dami ko gusto sabihin sayo hihi. Alam mo ba habang sinusulat ko to nakangiti lang ako kasi 
ikaw lang talaga nasa isip ko.Gusto ko lang malaman mo na sobrang thankful ako kasi dumating 
ka sa buhay ko. Hindi ko alam kung pano magiging araw araw ko kung wala ka. Siguro sobrang 
boring at wala akong aabangan paggising sa umaga. Pero simula nung nakilala kita parang nag 
iba lahat. Mas naging masaya ako, mas naging excited ako sa bawat araw kasi alam ko nandyan 
ka. Babyyy, thank you sa lahat. Thank you kasi lagi moko iniintindi kahit minsan ang kulit 
kulit ko. Thank you kasi lagi moko pinapatawa at pinapasaya. Thank you kasi kahit may mga 
araw na pareho tayong pagod, nandyan ka padin. Hindi mo alam kung gaano kalaki yung epekto 
mo sa buhay ko. Yung simpleng good morning mo o simpleng ingat mo sapat na para gumaan 
pakiramdam ko. Ang babaw ko no hihi pero wala eh, ganon talaga pag sobrang mahal yung tao.
Minsan napapangiti nalang ako bigla kasi naaalala kita. Minsan habang may ginagawa ako 
bigla nalang kita maiisip tapos mapapangiti nalang ako, parang ewan HAHAHA. Tapos sasabihin
ko sa sarili ko, grabe ang swerte ko naman kasi may girlfriend akong sobrang bait,sobrang 
ganda at sobrang cute. Sana wag mo kakalimutan na proud na proud ako sayo palagi. Proud ako
sa lahat ng ginagawa mo at sa lahat ng pangarap mo. Kahit feeling mo maliit lang yung 
achievements mo, sobrang proud padin ako kasi alam ko kung gaano ka nagsisikap. Babyyy, 
gusto ko lang sabihin na sana wag ka magsawa sakin ha. Alam ko minsan makulit ako, minsan 
matampuhin ako pero promise ginagawa ko lang yun kasi sobrang mahal kita. Hindi ko man laging 
nasasabi, pero araw araw kitang pinipili. Kahit ilang beses pa tayo mag away, ikaw padin. 
Kahit minsan pareho tayong matigas ulo, ikaw padin. Ikaw lang talaga babyyy. 
I loveelovevee lovee youuu sooo sooo muchyy hihi. Mahaaal na mahaal mahaaal kita lovelove
koooooo. Hindi ako magsasawa sabihin yan sayo kahit araw araw pa. Gusto ko lagi mo marinig at 
maramdaman kung gaano kita kamahal. Mwaaa mwaaaa mwaaa mwaaaaa hihi. Happy Birthday ulit 
babyyy ko. Sana lahat ng wishes mo matupad at sana lagi kang healthy at safe. Sana lagi kang 
may dahilan para ngumiti kasi ang ganda ganda mo pag masaya ka. Lagi mong tandaan na nandito 
lang ako palagi para sayo. Sa mga panahong masaya ka sasamahan kita at sa mga panahong
malungkot ka yayakapin kita. Hindi kita iiwan at hindi kita papabayaan. Thank you kasi
ikaw yung ikaw at thank you kasi pinili mo ako. Sana sa susunod na birthday mo ako padin 
yung unang babati sayo. Happy Birthday ulit mahal ko. I love you sooo sooo muchyy hihi

Always yours,
Your baby`;

  function typeLetter(text, target, speed = 30, onComplete) {
    typingSession += 1;
    const sessionId = typingSession;
    target.textContent = "";
    const cursor = document.createElement("span");
    cursor.className = "cursor";
    target.appendChild(cursor);
    let i = 0;
    function step() {
      if (sessionId !== typingSession) {
        return;
      }
      if (i < text.length) {
        const ch = text[i++];
        if (ch === "\n") {
          target.insertBefore(document.createElement("br"), cursor);
        } else {
          const node = document.createTextNode(ch);
          target.insertBefore(node, cursor);
        }
        setTimeout(step, speed);
      } else {
        cursor.remove();
        if (onComplete) {
          onComplete();
        }
      }
    }
    step();
  }

  function resetLetterView() {
    if (letterActions) {
      letterActions.hidden = true;
      letterActions.classList.remove("visible");
    }
    if (finalSurpriseLink) {
      finalSurpriseLink.textContent = "Open your next surprise";
      finalSurpriseLink.setAttribute("href", "final-page.html");
    }
  }

  function showTypedLetter(text, options = {}) {
    const {
      showActionButton = false,
      buttonLabel = "Open your next surprise",
      buttonHref = "final-page.html",
    } = options;
    resetLetterView();
    setTimeout(() => {
      letterModal.classList.remove("hidden");
      letterModal.classList.add("visible");
      const paper = document.querySelector(".letter-paper");
      if (paper) paper.classList.add("pop");
      typeLetter(text, letterInner, 28, () => {
        if (showActionButton && letterActions && finalSurpriseLink) {
          finalSurpriseLink.textContent = buttonLabel;
          finalSurpriseLink.setAttribute("href", buttonHref);
          letterActions.hidden = false;
          letterActions.classList.add("visible");
        }
      });
    }, 420);
  }

  function openLetterModal(targetEnvelope) {
    envelopes.forEach((env) => env.classList.remove("open"));
    targetEnvelope.classList.add("open");
    const id = targetEnvelope.dataset.letter || "1";
    const letterText = letterTexts[id] || letterTexts["1"];
    showTypedLetter(letterText, { showActionButton: false });
  }

  function openFinalLetterModal() {
    showTypedLetter(finalLetterText, {
      showActionButton: true,
      buttonLabel: "Open the next page",
      buttonHref: "final-page.html",
    });
  }

  window.openFinalLetterModal = openFinalLetterModal;

  function closeLetterModal() {
    typingSession += 1;
    const paper = document.querySelector(".letter-paper");
    if (paper) paper.classList.remove("pop");
    letterInner.textContent = "";
    resetLetterView();
    letterModal.classList.remove("visible");
    setTimeout(() => {
      letterModal.classList.add("hidden");
      envelopes.forEach((env) => env.classList.remove("open"));
    }, 300);
  }

  envelopes.forEach((envelope) => {
    envelope.addEventListener("click", () => openLetterModal(envelope));
  });
  if (closeBtn) closeBtn.addEventListener("click", closeLetterModal);
  if (modalOverlay) modalOverlay.addEventListener("click", closeLetterModal);
})();

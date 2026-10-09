/* =========================================================
   1. COMPTE À REBOURS DE 10 MINUTES (page index.html)
   ========================================================= */

const TEN_MINUTES_MS = 10 * 60 * 1000;

function getUnlockTime() {
    let unlockTime = localStorage.getItem('love_timer_unlock_10m');
    
    if (!unlockTime) {
        unlockTime = new Date().getTime() + TEN_MINUTES_MS;
        localStorage.setItem('love_timer_unlock_10m', unlockTime);
    }
    return parseInt(unlockTime, 10);
}

const targetTime = getUnlockTime();

function updateCountdown() {
    const hoursElem = document.getElementById('hours');
    if (!hoursElem) return;

    const now = new Date().getTime();
    const remainingTime = targetTime - now;

    const photoBtn = document.getElementById('photo-btn');
    const btnText = document.getElementById('btn-text');
    const btnIcon = document.getElementById('btn-icon');
    const statusTitle = document.getElementById('timer-status-title');
    const statusSubtitle = document.getElementById('status-subtitle');

    if (remainingTime <= 0) {
        hoursElem.innerText = "00";
        document.getElementById('minutes').innerText = "00";
        document.getElementById('seconds').innerText = "00";

        if (photoBtn && photoBtn.classList.contains('locked')) {
            photoBtn.classList.remove('locked');
            photoBtn.classList.add('unlocked');
            btnText.innerText = "Un peu de toi";
            btnIcon.className = "fa-solid fa-heart";
            
            if (statusTitle) statusTitle.innerText = "Le moment est venu ! 🎉";
            if (statusSubtitle) statusSubtitle.innerText = "Clique ci-dessous pour découvrir tes photos ✨";
        }
        return;
    }

    const hours = Math.floor(remainingTime / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    hoursElem.innerText = hours < 10 ? '0' + hours : hours;
    document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;

    if (photoBtn) {
        btnText.innerText = `Verrouillé (${minutes}m ${seconds}s restants)`;
    }
}

if (document.getElementById('hours')) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

/* =========================================================
   2. PARTICULES DE CŒURS ANIMÉES
   ========================================================= */
const heartsContainer = document.getElementById('particles-container');
const heartSymbols = ['❤️', '💖', '💕', '💗', '✨', '🌸'];

function createHeart() {
    if (!heartsContainer) return;

    const heart = document.createElement('div');
    heart.classList.add('heart-particle');
    heart.innerText = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = (Math.random() * 1.5 + 0.8) + 'rem';
    const duration = (Math.random() * 5 + 6) + 's';
    heart.style.animationDuration = duration;
    
    heartsContainer.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, parseFloat(duration) * 1000);
}

setInterval(createHeart, 400);

/* =========================================================
   3. LECTEUR AUDIO FLOTTANT
   ========================================================= */
const audio = document.getElementById('bg-music');
const playPauseBtn = document.getElementById('play-pause-btn');
const playIcon = document.getElementById('play-icon');
const volumeSlider = document.getElementById('volume-slider');
const volumeIcon = document.getElementById('volume-icon');

if (audio && playPauseBtn) {
    audio.volume = volumeSlider.value;

    playPauseBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playIcon.className = 'fa-solid fa-pause';
        } else {
            audio.pause();
            playIcon.className = 'fa-solid fa-play';
        }
    });

    volumeSlider.addEventListener('input', (e) => {
        const val = e.target.value;
        audio.volume = val;

        if (val == 0) {
            volumeIcon.className = 'fa-solid fa-volume-xmark';
        } else if (val < 0.5) {
            volumeIcon.className = 'fa-solid fa-volume-low';
        } else {
            volumeIcon.className = 'fa-solid fa-volume-high';
        }
    });
}

/* =========================================================
   4. MODAL AGRANDISSEMENT PHOTO (photos.html) & ENVELOPPE (lettre.html)
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
    // Galerie photo Modal
    const photoCards = document.querySelectorAll('.photo-card');
    const modal = document.getElementById('photo-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDate = document.getElementById('modal-date');
    const modalClose = document.querySelector('.modal-close');

    if (modal && photoCards.length > 0) {
        photoCards.forEach(card => {
            card.addEventListener('click', () => {
                const imgElement = card.querySelector('img');
                const imgSrc = card.getAttribute('data-img') || (imgElement ? imgElement.src : '');
                const title = card.getAttribute('data-title') || card.querySelector('.caption-title').innerText;
                const date = card.getAttribute('data-date') || card.querySelector('.caption-date').innerText;

                if (imgElement && imgElement.style.display !== 'none') {
                    modalImg.src = imgElement.src;
                } else {
                    modalImg.src = imgSrc;
                }

                modalTitle.innerText = title;
                modalDate.innerText = date;
                modal.classList.add('active');
            });
        });

        if (modalClose) {
            modalClose.addEventListener('click', () => modal.classList.remove('active'));
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    }

    // Animation Ouverture/Fermeture Enveloppe
    const envelope = document.getElementById('envelope');
    const touchText = document.getElementById('touch-text');

    if (envelope) {
        envelope.addEventListener('click', () => {
            envelope.classList.toggle('open');
            if (touchText) {
                if (envelope.classList.contains('open')) {
                    touchText.innerText = "Clique à nouveau pour refermer 💕";
                } else {
                    touchText.innerText = "Touch This Heart";
                }
            }
        });
    }
});
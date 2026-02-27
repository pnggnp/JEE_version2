// ========== SLIDE NAVIGATION ==========
(function () {
    const slides = document.querySelectorAll('.slide');
    const progressBar = document.getElementById('progressBar');
    const slideCounter = document.getElementById('slideCounter');
    const navHint = document.getElementById('navHint');
    let currentSlide = 0;
    let isTransitioning = false;

    // ========== CREATE NAV BUTTONS ==========
    const navButtons = document.createElement('div');
    navButtons.className = 'nav-buttons';
    navButtons.innerHTML = `
        <button class="nav-btn nav-prev" id="btnPrev" title="Previous Slide">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
        </button>
        <button class="nav-btn nav-next" id="btnNext" title="Next Slide">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 6 15 12 9 18"></polyline>
            </svg>
        </button>
    `;
    document.body.appendChild(navButtons);

    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');

    // ========== CORE SLIDE CHANGE ==========
    function goToSlide(newIndex) {
        if (isTransitioning || newIndex < 0 || newIndex >= slides.length || newIndex === currentSlide) return;
        isTransitioning = true;

        // Hide ALL slides first
        slides.forEach(function (slide, i) {
            if (i !== currentSlide && i !== newIndex) {
                slide.classList.remove('active');
                slide.style.opacity = '0';
                slide.style.visibility = 'hidden';
                slide.style.transform = '';
            }
        });

        var oldSlide = slides[currentSlide];
        var newSlide = slides[newIndex];

        // Fade out old slide
        oldSlide.style.transition = 'opacity 0.4s ease';
        oldSlide.style.opacity = '0';

        // After old slide fades out, show new slide
        setTimeout(function () {
            oldSlide.classList.remove('active');
            oldSlide.style.visibility = 'hidden';
            oldSlide.style.transform = '';
            oldSlide.style.transition = '';

            // Prepare new slide
            newSlide.style.transition = 'none';
            newSlide.style.opacity = '0';
            newSlide.style.visibility = 'visible';
            newSlide.classList.add('active');

            // Force browser to process above changes
            void newSlide.offsetWidth;

            // Fade in new slide
            newSlide.style.transition = 'opacity 0.4s ease';
            newSlide.style.opacity = '1';

            setTimeout(function () {
                // Clean up inline styles
                newSlide.style.transition = '';
                newSlide.style.opacity = '';
                newSlide.style.visibility = '';
                isTransitioning = false;
            }, 450);
        }, 350);

        currentSlide = newIndex;
        updateProgress();
        updateCounter();
        updateNavState();

        // Hide nav hint after first navigation
        if (navHint) navHint.style.opacity = '0';
    }

    function updateProgress() {
        var progress = ((currentSlide + 1) / slides.length) * 100;
        progressBar.style.width = progress + '%';
    }

    function updateCounter() {
        slideCounter.textContent = (currentSlide + 1) + ' / ' + slides.length;
    }

    function updateNavState() {
        btnPrev.disabled = currentSlide === 0;
        btnNext.disabled = currentSlide === slides.length - 1;
        btnPrev.style.opacity = currentSlide === 0 ? '0.3' : '1';
        btnNext.style.opacity = currentSlide === slides.length - 1 ? '0.3' : '1';
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    // ========== BUTTON HANDLERS ==========
    btnPrev.addEventListener('click', function (e) {
        e.stopPropagation();
        prevSlide();
    });
    btnNext.addEventListener('click', function (e) {
        e.stopPropagation();
        nextSlide();
    });

    // ========== KEYBOARD NAVIGATION ==========
    document.addEventListener('keydown', function (e) {
        switch (e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                nextSlide();
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                prevSlide();
                break;
            case 'Home':
                e.preventDefault();
                goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                goToSlide(slides.length - 1);
                break;
        }
    });

    // ========== TOUCH SWIPE ==========
    var touchStartX = 0;

    document.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    document.addEventListener('touchend', function (e) {
        var touchEndX = e.changedTouches[0].screenX;
        var diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
    }, { passive: true });

    // ========== INITIALIZE ==========
    // Make sure only slide 0 is visible
    slides.forEach(function (slide, i) {
        if (i === 0) {
            slide.classList.add('active');
            slide.style.opacity = '1';
            slide.style.visibility = 'visible';
            slide.style.transform = 'translateX(0)';
        } else {
            slide.classList.remove('active');
            slide.style.opacity = '0';
            slide.style.visibility = 'hidden';
        }
    });

    updateProgress();
    updateCounter();
    updateNavState();

    // ========== PARTICLES ==========
    function createParticles(containerId) {
        var container = document.getElementById(containerId);
        if (!container) return;

        var colors = ['#6366f1', '#a855f7', '#ec4899', '#10b981', '#f59e0b'];

        for (var i = 0; i < 30; i++) {
            var particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.width = (Math.random() * 4 + 2) + 'px';
            particle.style.height = particle.style.width;
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.animationDelay = Math.random() * 5 + 's';
            particle.style.animationDuration = (Math.random() * 6 + 5) + 's';
            container.appendChild(particle);
        }
    }

    createParticles('particles');
    createParticles('particles2');

    // ========== TICKER ANIMATION ==========
    function animateTicker() {
        var prices = document.querySelectorAll('.ticker-price');
        var changes = document.querySelectorAll('.ticker-change');

        setInterval(function () {
            prices.forEach(function (el, i) {
                var base = [189, 141, 378][i];
                var variation = (Math.random() - 0.5) * 4;
                var newPrice = (base + variation).toFixed(2);
                var changePercent = ((variation / base) * 100).toFixed(2);
                var isUp = variation >= 0;

                el.textContent = '$' + newPrice;
                el.className = 'ticker-price ' + (isUp ? 'up' : 'down');

                if (changes[i]) {
                    changes[i].textContent = (isUp ? '▲ +' : '▼ ') + changePercent + '%';
                    changes[i].className = 'ticker-change ' + (isUp ? 'up' : 'down');
                }
            });
        }, 3000);
    }

    animateTicker();
})();

// ========== SLIDE NAVIGATION ==========
(function() {
    const slides = document.querySelectorAll('.slide');
    const progressBar = document.getElementById('progressBar');
    const slideCounter = document.getElementById('slideCounter');
    const navHint = document.getElementById('navHint');
    let currentSlide = 0;
    let isTransitioning = false;

    function updateSlide(newIndex, direction = 'next') {
        if (isTransitioning || newIndex < 0 || newIndex >= slides.length || newIndex === currentSlide) return;
        isTransitioning = true;

        const oldSlide = slides[currentSlide];
        const newSlide = slides[newIndex];

        // Exit old slide
        oldSlide.classList.remove('active');
        oldSlide.classList.add(direction === 'next' ? 'exit-left' : '');

        // Enter new slide
        newSlide.style.transform = direction === 'next' ? 'translateX(60px)' : 'translateX(-60px)';
        newSlide.classList.add('active');

        // Reset after transition
        setTimeout(() => {
            oldSlide.classList.remove('exit-left');
            oldSlide.style.transform = '';
            newSlide.style.transform = '';
            isTransitioning = false;
        }, 600);

        currentSlide = newIndex;
        updateProgress();
        updateCounter();

        // Hide nav hint after first navigation
        if (navHint) navHint.style.opacity = '0';
    }

    function updateProgress() {
        const progress = ((currentSlide + 1) / slides.length) * 100;
        progressBar.style.width = progress + '%';
    }

    function updateCounter() {
        slideCounter.textContent = (currentSlide + 1) + ' / ' + slides.length;
    }

    function nextSlide() { updateSlide(currentSlide + 1, 'next'); }
    function prevSlide() { updateSlide(currentSlide - 1, 'prev'); }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
            case ' ':
            case 'Enter':
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
                updateSlide(0, 'prev');
                break;
            case 'End':
                e.preventDefault();
                updateSlide(slides.length - 1, 'next');
                break;
        }
    });

    // Click navigation (click right half = next, left half = prev)
    document.addEventListener('click', (e) => {
        // Don't navigate when clicking on code blocks or interactive elements
        if (e.target.closest('pre, code, .code-window, a, button')) return;
        
        const x = e.clientX;
        const width = window.innerWidth;
        if (x > width * 0.5) {
            nextSlide();
        } else {
            prevSlide();
        }
    });

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
    }, { passive: true });

    // Initialize
    updateProgress();
    updateCounter();

    // ========== PARTICLES ==========
    function createParticles(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const colors = ['#6366f1', '#a855f7', '#ec4899', '#10b981', '#f59e0b'];
        
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
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
        const prices = document.querySelectorAll('.ticker-price');
        const changes = document.querySelectorAll('.ticker-change');
        
        setInterval(() => {
            prices.forEach((el, i) => {
                const base = [189, 141, 378][i];
                const variation = (Math.random() - 0.5) * 4;
                const newPrice = (base + variation).toFixed(2);
                const changePercent = ((variation / base) * 100).toFixed(2);
                const isUp = variation >= 0;
                
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

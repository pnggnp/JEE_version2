// ========== SLIDE NAVIGATION ==========
(function () {
    const slides = document.querySelectorAll('.slide');
    const progressBar = document.getElementById('progressBar');
    const slideCounter = document.getElementById('slideCounter');
    const navHint = document.getElementById('navHint');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentSlide = 0;
    let isTransitioning = false;

    function updateSlide(newIndex, direction = 'next') {
        if (isTransitioning || newIndex < 0 || newIndex >= slides.length || newIndex === currentSlide) return;
        isTransitioning = true;

        const oldSlide = slides[currentSlide];
        const newSlide = slides[newIndex];

        // Prepare new slide position before showing it
        newSlide.style.transition = 'none';
        newSlide.style.transform = direction === 'next' ? 'translateX(60px)' : 'translateX(-60px)';
        newSlide.style.opacity = '0';

        // Trigger reflow
        newSlide.offsetHeight;

        // Start transitions
        newSlide.style.transition = '';
        oldSlide.classList.remove('active');
        oldSlide.classList.add(direction === 'next' ? 'exit-left' : 'exit-right');

        newSlide.classList.add('active');
        newSlide.style.transform = '';
        newSlide.style.opacity = '';

        // Reset after transition
        setTimeout(() => {
            oldSlide.classList.remove('exit-left', 'exit-right');
            oldSlide.style.transform = '';
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

    // Button navigation
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
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

    // ========== COMMON UTILS ==========
    window.trace = function (id, msg, type = 'system') {
        const el = document.getElementById(id);
        if (!el) return;
        const line = document.createElement('div');
        line.className = `trace-line ${type}`;
        line.textContent = `[${new Date().toLocaleTimeString().split(' ')[0]}] ${msg}`;
        const content = el.querySelector('.trace-content');
        if (content) {
            content.prepend(line);
            if (content.children.length > 10) content.removeChild(content.lastChild);
        }
    };

    // ========== HUB DEMO (SECTION 1) - ALEX ==========
    window.hubDemo = {
        init: function () {
            const pool = document.getElementById('threadPool');
            if (!pool) return;
            pool.innerHTML = '';
            for (let i = 0; i < 12; i++) {
                const slot = document.createElement('div');
                slot.className = 'thread-slot';
                slot.textContent = 'IDLE';
                pool.appendChild(slot);
            }
        },
        addTask: function () {
            const input = document.getElementById('taskLabel');
            const label = input.value || 'GenericTask';
            const queueEl = document.getElementById('taskQueue');

            const task = document.createElement('div');
            task.className = 'task-item';
            task.textContent = label;
            queueEl.appendChild(task);

            trace('hubTrace', `Managed Task "${label}" submitted to container.`, 'system');
            this.process();
            input.value = '';
        },
        process: function () {
            const queue = document.getElementById('taskQueue');
            const slots = document.querySelectorAll('.thread-slot');

            if (queue.children.length > 0) {
                for (let slot of slots) {
                    if (!slot.classList.contains('active')) {
                        const taskEl = queue.children[0];
                        const taskName = taskEl.textContent;
                        queue.removeChild(taskEl);

                        slot.classList.add('active');
                        slot.textContent = taskName;
                        trace('hubTrace', `Thread assigned for "${taskName}". Injecting Context...`, 'success');

                        setTimeout(() => {
                            slot.classList.remove('active');
                            slot.textContent = 'IDLE';
                            trace('hubTrace', `Task "${taskName}" completed. Thread returned to pool.`, 'system');
                            this.process();
                        }, 2000 + Math.random() * 2000);
                        break;
                    }
                }
            }
        },
        reset: function () {
            document.getElementById('taskQueue').innerHTML = '';
            this.init();
        }
    };

    // ========== PIZZA DEMO (SECTION 2) - SARAH ==========
    window.pizzaDemo = {
        start: function () {
            const input = document.getElementById('custName');
            const name = input.value || 'Guest';
            const steps = ['p-save', 'p-email', 'p-push', 'p-kitchen'];

            steps.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.classList.remove('active');
            });

            // Step 1: Sync
            const save = document.getElementById('p-save');
            if (save) save.classList.add('active');

            setTimeout(() => {
                // Async steps
                ['p-email', 'p-push', 'p-kitchen'].forEach((id, i) => {
                    setTimeout(() => {
                        const el = document.getElementById(id);
                        if (el) {
                            el.classList.add('active');
                            const label = el.querySelector('.step-label');
                            if (label && !label.textContent.includes('(')) {
                                label.textContent += ` (${name})`;
                            }
                        }
                    }, i * 400);
                });
            }, 800);
            input.value = '';
        }
    };

    // ========== TICKER DEMO (SECTION 3) - MIKE ==========
    window.tickerDemo = {
        running: true,
        add: function () {
            const input = document.getElementById('tickerSym');
            const sym = input.value.toUpperCase();
            if (!sym) return;
            const row = document.createElement('div');
            row.className = 'ticker-row';
            row.innerHTML = `<span class="ticker-symbol">${sym}</span>
                             <span class="ticker-price up">$${(Math.random() * 500).toFixed(2)}</span>
                             <span class="ticker-change up">▲ +0.00%</span>`;
            document.getElementById('tickerBody').prepend(row);
            input.value = '';
        },
        toggle: function () {
            this.running = !this.running;
        }
    };

    // ========== SOCIAL DEMO (SECTION 4) - EMMA ==========
    window.socialDemo = {
        events: [],
        post: function () {
            const input = document.getElementById('notifText');
            const txt = input.value || 'New Interaction';
            const stack = document.getElementById('notifStack');
            if (!stack) return;
            const item = document.createElement('div');
            item.className = 'notif-item';
            item.innerHTML = `<span>🔔</span> ${txt}`;
            stack.prepend(item);
            this.events.push(txt);
            input.value = '';

            if (this.events.length >= 3) this.batch();
        },
        batch: function () {
            const arrow = document.getElementById('batchArrow');
            if (!arrow) return;
            arrow.textContent = '📦 BATCHING...';
            arrow.style.color = '#f59e0b';

            setTimeout(() => {
                const digest = document.getElementById('digestEmail');
                const body = digest.querySelector('.email-body');
                body.innerHTML = `<strong>You have ${this.events.length} new updates:</strong><br>` +
                    this.events.map(e => `• ${e}`).join('<br>');
                this.events = [];
                const stack = document.getElementById('notifStack');
                if (stack) stack.innerHTML = '';
                arrow.textContent = '📦 Waiting (1h)';
                arrow.style.color = '';
            }, 1500);
        }
    };

    // ========== CONTEXT DEMO (SECTION 5) - LIAM ==========
    window.contextDemo = {
        updateIdentity: function () {
            const userInput = document.getElementById('ctxUser');
            if (!userInput) return;
            const user = userInput.value;
            const role = document.getElementById('ctxRole').value;
            document.getElementById('p-user').textContent = user;
            document.getElementById('p-role').textContent = role;
            const pass = document.getElementById('passport');
            pass.style.border = '2px solid var(--accent-blue)';
            setTimeout(() => pass.style.border = '', 500);
        },
        transmit: function () {
            const passport = document.getElementById('passport');
            const receiver = document.getElementById('passportReceiver');
            const clone = passport.cloneNode(true);

            clone.style.position = 'fixed';
            const rect = passport.getBoundingClientRect();
            clone.style.left = rect.left + 'px';
            clone.style.top = rect.top + 'px';
            clone.style.width = rect.width + 'px';
            clone.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
            clone.style.zIndex = '1000';
            document.body.appendChild(clone);

            setTimeout(() => {
                const target = receiver.getBoundingClientRect();
                clone.style.left = (target.left + 20) + 'px';
                clone.style.top = (target.top + 20) + 'px';
                clone.style.transform = 'scale(0.5)';
                clone.style.opacity = '0';
            }, 100);

            setTimeout(() => {
                receiver.innerHTML = '';
                const final = passport.cloneNode(true);
                final.style.transform = 'scale(0.7)';
                final.classList.remove('active');
                receiver.appendChild(final);
                document.body.removeChild(clone);

                const success = document.createElement('div');
                success.style.color = '#10b981';
                success.style.fontSize = '12px';
                success.style.marginTop = '10px';
                success.style.fontWeight = 'bold';
                success.textContent = '✓ IDENTITY RESTORED';
                receiver.appendChild(success);
            }, 1100);
        }
    };

    // ========== E-COMMERCE DEMO (SECTION 6) - SOPHIA ==========
    window.ecommerceDemo = {
        count: 0,
        placeOrder: function () {
            const itemInput = document.getElementById('orderItem');
            const item = itemInput.value || 'Order';
            const loadEl = document.getElementById('orderLoad');
            const load = parseInt(loadEl.value);
            this.count++;
            document.getElementById('orderCount').textContent = this.count;

            for (let i = 0; i < load; i++) {
                setTimeout(() => {
                    this.simulate(item + (load > 1 ? ` [SubTask ${i + 1}]` : ''));
                }, i * 500);
            }
            itemInput.value = '';
        },
        simulate: function (name) {
            const services = ['inventory', 'billing', 'shipping', 'email'];
            const activeEl = document.getElementById('activeThreads');

            services.forEach((s, idx) => {
                setTimeout(() => {
                    const el = document.getElementById('service-' + s);
                    if (!el) return;
                    el.classList.add('working');
                    el.querySelector('.strip-status').textContent = 'RUNNING...';
                    activeEl.textContent = parseInt(activeEl.textContent) + 1;
                    this.log(`Task: ${name} -> Service: ${s.toUpperCase()}`, 'system');

                    setTimeout(() => {
                        el.classList.remove('working');
                        el.querySelector('.strip-status').textContent = 'IDLE';
                        activeEl.textContent = Math.max(0, parseInt(activeEl.textContent) - 1);
                        this.log(`Task: ${name} -> ${s.toUpperCase()} DONE`, 'success');
                    }, 2000 + Math.random() * 2000);
                }, idx * 300);
            });
        },
        log: function (msg, type) {
            const logEl = document.getElementById('systemLog');
            if (!logEl) return;
            const entry = document.createElement('div');
            entry.className = 'log-entry ' + type;
            entry.textContent = `[${new Date().toLocaleTimeString().split(' ')[0]}] ${msg}`;
            logEl.prepend(entry);
        }
    };

    // Initialize all demos
    setTimeout(() => {
        if (typeof hubDemo !== 'undefined') hubDemo.init();
    }, 500);

    // ========== TICKER ANIMATION ==========
    function animateTicker() {
        const body = document.getElementById('tickerBody');
        if (!body) return;

        setInterval(() => {
            if (typeof tickerDemo !== 'undefined' && !tickerDemo.running) return;
            const prices = body.querySelectorAll('.ticker-price');
            const changes = body.querySelectorAll('.ticker-change');

            prices.forEach((el, i) => {
                const curText = el.textContent.replace('$', '');
                const cur = parseFloat(curText);
                const variation = (Math.random() - 0.5) * 5;
                const newPrice = (cur + variation).toFixed(2);
                const changePercent = ((variation / cur) * 100).toFixed(2);
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


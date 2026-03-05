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

    // ========== HUB DEMO (SECTION 1) ==========
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

            fetch('../api/demo/hub', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({taskName: label})
            })
            .then(res => res.json())
            .then(data => {
                this.process(data);
            });
            input.value = '';
        },
        process: function (data) {
            const queue = document.getElementById('taskQueue');
            const slots = document.querySelectorAll('.thread-slot');

            if (queue.children.length > 0) {
                for (let slot of slots) {
                    if (!slot.classList.contains('active')) {
                        const taskEl = queue.children[0];
                        const taskName = taskEl.textContent;
                        queue.removeChild(taskEl);

                        slot.classList.add('active');
                        slot.innerHTML = `<strong>${taskName}</strong><br><small style="font-size:0.6em;opacity:0.8">${data.threadName}</small>`;
                        trace('hubTrace', `Thread [${data.threadName}] processing "${taskName}"...`, 'success');

                        setTimeout(() => {
                            slot.classList.remove('active');
                            slot.textContent = 'IDLE';
                            trace('hubTrace', `Task "${taskName}" completed. Thread returned to pool.`, 'system');
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

    // ========== PIZZA DEMO (SECTION 2) ==========
    window.pizzaDemo = {
        start: function () {
            const input = document.getElementById('custName');
            const name = input.value || 'Guest';
            const steps = ['p-save', 'p-email', 'p-push', 'p-kitchen'];

            steps.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.classList.remove('active');
            });

            fetch('../api/demo/pizza', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({customerName: name})
            })
            .then(r => r.json())
            .then(data => {
                const save = document.getElementById('p-save');
                if (save) {
                    save.classList.add('active');
                    save.querySelector('.step-type').textContent = data[0].threadName;
                }

                setTimeout(() => {
                    ['p-email', 'p-push', 'p-kitchen'].forEach((id, i) => {
                        setTimeout(() => {
                            const el = document.getElementById(id);
                            if (el) {
                                el.classList.add('active');
                                const label = el.querySelector('.step-label');
                                if (label && !label.textContent.includes('(')) label.textContent += ` (${name})`;
                                el.querySelector('.step-type').textContent = data[i+1].threadName;
                            }
                        }, i * 400);
                    });
                }, 800);
            });
            input.value = '';
        }
    };

    // ========== TICKER DEMO (SECTION 3) ==========
    window.tickerDemo = {
        running: true,
        add: function () {
            const input = document.getElementById('tickerSym');
            const sym = input.value.toUpperCase();
            if (!sym) return;
            fetch('../api/demo/ticker', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({symbol: sym})
            });
            input.value = '';
        },
        toggle: function () {
            this.running = !this.running;
        }
    };

    // ========== SOCIAL DEMO (SECTION 4) ==========
    window.socialDemo = {
        post: function () {
            const input = document.getElementById('notifText');
            const txt = input.value || 'New Interaction';
            input.value = '';
            
            fetch('../api/demo/social', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({event: txt})
            })
            .then(r => r.json())
            .then(events => {
                const stack = document.getElementById('notifStack');
                if (!stack) return;
                stack.innerHTML = '';
                events.forEach(e => {
                    const item = document.createElement('div');
                    item.className = 'notif-item';
                    item.innerHTML = `<span>🔔</span> ${e}`;
                    stack.prepend(item);
                });

                if (events.length >= 3) this.batch();
            });
        },
        batch: function () {
            const arrow = document.getElementById('batchArrow');
            if (arrow) {
                arrow.textContent = '📦 BATCHING (Backend)...';
                arrow.style.color = '#f59e0b';
            }

            setTimeout(() => {
                fetch('../api/demo/social/digest')
                .then(r => r.json())
                .then(digest => {
                    if (digest.length > 0) {
                        const digestEmail = document.getElementById('digestEmail');
                        const body = digestEmail.querySelector('.email-body');
                        body.innerHTML = `<strong>You have ${digest.length} new updates:</strong><br>` +
                            digest.map(e => `• ${e}`).join('<br>');
                        
                        const stack = document.getElementById('notifStack');
                        if (stack) stack.innerHTML = '';
                        if (arrow) {
                            arrow.textContent = '📦 Digest Sent';
                            arrow.style.color = '#10b981';
                        }
                    }
                });
            }, 6000);
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
            const user = document.getElementById('p-user').textContent;
            const role = document.getElementById('p-role').textContent;
            const passport = document.getElementById('passport');
            const receiver = document.getElementById('passportReceiver');

            fetch('../api/demo/context', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({user: user, role: role})
            })
            .then(r => r.json())
            .then(data => {
                // Animation Logic
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
                    
                    const stamp = final.querySelector('.passport-stamp');
                    if(stamp && data.status === 'SUCCESS') {
                        stamp.textContent = 'CONTEXT RESTORED';
                        stamp.style.color = '#10b981';
                        stamp.style.borderColor = '#10b981';
                    } else if(stamp) {
                         stamp.textContent = 'FAILED';
                    }

                    receiver.appendChild(final);
                    document.body.removeChild(clone);

                    const success = document.createElement('div');
                    success.style.color = data.status === 'SUCCESS' ? '#10b981' : '#ef4444';
                    success.style.fontSize = '12px';
                    success.style.marginTop = '10px';
                    success.style.fontWeight = 'bold';
                    success.textContent = data.status === 'SUCCESS' ? '✓ ' + data.threadName : '✗ ' + data.threadName;
                    receiver.appendChild(success);
                }, 1100);
            });
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
        setInterval(() => {
            if (typeof tickerDemo !== 'undefined' && !tickerDemo.running) return;
            fetch('../api/demo/ticker')
            .then(r => r.json())
            .then(prices => {
                const body = document.getElementById('tickerBody');
                if (!body) return;
                body.innerHTML = '';
                prices.forEach(p => {
                    const isUp = p.isUp;
                    const changeStr = (isUp ? '▲ +' : '▼ ') + p.changePercent.toFixed(2) + '%';
                    const row = document.createElement('div');
                    row.className = 'ticker-row';
                    row.innerHTML = `<span class="ticker-symbol">${p.symbol}</span>
                                     <span class="ticker-price ${isUp ? 'up' : 'down'}">$${p.price.toFixed(2)}</span>
                                     <span class="ticker-change ${isUp ? 'up' : 'down'}">${changeStr}</span>`;
                    body.appendChild(row);
                });
            })
            .catch(e => console.log("Ticker fetch error", e));
        }, 3000);
    }

    animateTicker();
})();


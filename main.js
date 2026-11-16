/* ==========================================================================
   PORTFOLIO JS - MUHAMMAD AHMED KHAN
   Active nav (with sliding highlight), smooth scroll, stat counters,
   scroll progress, card spotlight, timeline progress, hero parallax.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Floating nav: active section + sliding indicator ---------- */
    const nav = document.getElementById('navbar');
    const navLinks = [...document.querySelectorAll('.floating-nav .nav-link')];
    const indicator = document.querySelector('.nav-indicator');

    function moveIndicator(link) {
        if (!indicator || !link) return;
        const li = link.parentElement;
        indicator.style.setProperty('--nx', `${li.offsetLeft}px`);
        indicator.style.opacity = link.classList.contains('nav-contact') ? '0' : '1';
    }

    function setActive(id) {
        navLinks.forEach(link => {
            const isActive = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('active', isActive);
            if (isActive) {
                link.setAttribute('aria-current', 'true');
                moveIndicator(link);
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    if (nav && indicator) nav.classList.add('has-indicator');

    const sections = [...document.querySelectorAll('section[id]')];
    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) setActive(entry.target.id);
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(section => sectionObserver.observe(section));

    window.addEventListener('resize', () => moveIndicator(document.querySelector('.floating-nav .nav-link.active')));
    moveIndicator(document.querySelector('.floating-nav .nav-link.active'));

    /* ---------- Smooth scrolling for in-page links ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
            }
        });
    });

    /* ---------- Stat counters (run once when the stats bar is visible) ---------- */
    const statValues = document.querySelectorAll('.hstat-value');
    const statsBar = document.querySelector('.hero-stats-bar');

    function animateCounters() {
        statValues.forEach(counter => {
            const text = counter.textContent.trim();
            const target = parseInt(text, 10);
            if (isNaN(target)) return;
            const suffix = text.replace(String(target), '');
            if (reduceMotion) return;
            const duration = 1400;
            const start = performance.now();
            const tick = now => {
                const t = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - t, 3);
                counter.textContent = Math.round(target * eased) + suffix;
                if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        });
    }

    if (statsBar) {
        const statsObserver = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                animateCounters();
                statsObserver.disconnect();
            }
        }, { threshold: 0.5 });
        statsObserver.observe(statsBar);
    }

    /* ---------- Scroll-driven effects: progress bar + timeline line ---------- */
    const root = document.documentElement;
    const timeline = document.querySelector('.timeline');
    const timelineItems = [...document.querySelectorAll('.timeline-item')];
    let ticking = false;

    function onScroll() {
        const max = root.scrollHeight - window.innerHeight;
        root.style.setProperty('--scroll', max > 0 ? (window.scrollY / max).toFixed(4) : 0);

        if (timeline) {
            const rect = timeline.getBoundingClientRect();
            const anchor = window.innerHeight * 0.65;
            const progress = Math.min(Math.max((anchor - rect.top) / rect.height, 0), 1);
            timeline.style.setProperty('--line', reduceMotion ? 1 : progress.toFixed(3));
            timelineItems.forEach(item => {
                item.classList.toggle('is-lit', item.getBoundingClientRect().top + 16 < anchor);
            });
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });
    onScroll();

    /* ---------- Cursor spotlight on cards (mouse and pen only) ---------- */
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (finePointer) {
        document.querySelectorAll('.bento-card, .service-card, .subproject-card, .project-card, .video-card, .cert-card, .timeline-content, .contact-item')
            .forEach(card => {
                card.classList.add('spotlight');
                card.addEventListener('pointermove', e => {
                    const r = card.getBoundingClientRect();
                    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
                    card.style.setProperty('--my', `${e.clientY - r.top}px`);
                });
            });
    }

    /* ---------- Hero portrait parallax (follows the mouse slightly) ---------- */
    const stage = document.querySelector('.portrait-stage');
    const hero = document.querySelector('.hero');
    if (stage && hero && finePointer && !reduceMotion) {
        hero.addEventListener('pointermove', e => {
            const x = (e.clientX / window.innerWidth - 0.5) * 14;
            const y = (e.clientY / window.innerHeight - 0.5) * 10;
            stage.style.setProperty('--px', `${x.toFixed(1)}px`);
            stage.style.setProperty('--py', `${y.toFixed(1)}px`);
        });
        hero.addEventListener('pointerleave', () => {
            stage.style.setProperty('--px', '0px');
            stage.style.setProperty('--py', '0px');
        });
    }


    /* ---------- HamSayaa chat preview: play messages once when visible ---------- */
    const chat = document.querySelector('.chat-mock');
    if (chat && !reduceMotion) {
        chat.classList.add('will-play');
        const chatObserver = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                chat.classList.add('is-playing');
                chatObserver.disconnect();
            }
        }, { threshold: 0.4 });
        chatObserver.observe(chat);
    }

    /* ---------- Pause SVG pulse animations when motion is reduced ---------- */
    if (reduceMotion) {
        document.querySelectorAll('svg.fasal-diagram').forEach(svg => svg.pauseAnimations && svg.pauseAnimations());
    }
});

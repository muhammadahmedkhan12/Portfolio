/* ==========================================================================
   PORTFOLIO JS - MUHAMMAD AHMED KHAN
   Features: Active floating nav scroll highlight, smooth scroll, counter stats
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Floating Nav Scroll Active Link Highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.floating-nav .nav-link');

    function highlightNavOnScroll() {
        const scrollPosition = window.scrollY + 250;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavOnScroll);

    // Smooth Scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Stat counter animation
    const statValues = document.querySelectorAll('.hstat-value');
    let hasAnimated = false;

    function animateCounters() {
        statValues.forEach(counter => {
            const text = counter.innerText;
            const target = parseInt(text, 10);
            if (isNaN(target)) return;

            const hasPlus = text.includes('+');
            const hasPercent = text.includes('%');
            let count = 0;
            const duration = 1500;
            const increment = target / (duration / 16);

            const timer = setInterval(() => {
                count += increment;
                if (count >= target) {
                    counter.innerText = target + (hasPlus ? '+' : '') + (hasPercent ? '%' : '');
                    clearInterval(timer);
                } else {
                    counter.innerText = Math.floor(count) + (hasPlus ? '+' : '') + (hasPercent ? '%' : '');
                }
            }, 16);
        });
    }

    // Trigger counter animation on scroll into hero stats
    const statsBar = document.querySelector('.hero-stats-bar');
    if (statsBar) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasAnimated) {
                animateCounters();
                hasAnimated = true;
            }
        }, { threshold: 0.5 });
        observer.observe(statsBar);
    }
});
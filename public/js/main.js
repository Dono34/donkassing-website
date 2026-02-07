/* ========================================
   donkassing.com — Interactions & Animations
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- Navigation scroll effect ---
    const nav = document.querySelector('.nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // --- Mobile menu toggle ---
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('open');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }

    // --- Hero typing effect ---
    const taglineEl = document.querySelector('.hero-tagline');
    if (taglineEl && taglineEl.dataset.text) {
        const text = taglineEl.dataset.text;
        taglineEl.innerHTML = '<span class="typed-cursor">|</span>';
        let i = 0;
        function typeChar() {
            if (i < text.length) {
                taglineEl.innerHTML = text.substring(0, i + 1) + '<span class="typed-cursor">|</span>';
                i++;
                setTimeout(typeChar, 25 + Math.random() * 20);
            } else {
                taglineEl.innerHTML = text;
            }
        }
        // Delay typing until hero animates in
        setTimeout(typeChar, 1200);
    }

    // --- Hero entrance animation (GSAP) ---
    if (typeof gsap !== 'undefined') {
        const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        heroTl
            .to('.hero-image', { opacity: 1, duration: 0.8, y: 0 }, 0.2)
            .to('.hero-greeting', { opacity: 1, y: 0, duration: 0.6 }, 0.4)
            .to('.hero-name', { opacity: 1, y: 0, duration: 0.8 }, 0.5)
            .to('.hero-tagline', { opacity: 1, y: 0, duration: 0.6 }, 0.8)
            .to('.hero-ctas', { opacity: 1, y: 0, duration: 0.6 }, 1.0);

        // Set initial states
        gsap.set(['.hero-image', '.hero-greeting', '.hero-name', '.hero-tagline', '.hero-ctas'], {
            y: 30
        });
    }

    // --- Scroll reveal (works with or without GSAP) ---
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length) {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);

            revealElements.forEach(el => {
                gsap.to(el, {
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        once: true,
                        onEnter: () => el.classList.add('active')
                    }
                });
            });
        } else {
            // Fallback: IntersectionObserver
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });

            revealElements.forEach(el => observer.observe(el));
        }
    }

    // --- Counter animation ---
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length) {
        const animateCounter = (el) => {
            const target = parseFloat(el.dataset.count);
            const prefix = el.dataset.prefix || '';
            const suffix = el.dataset.suffix || '';
            const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
            const duration = 2000;
            const start = performance.now();

            function update(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = target * eased;
                el.textContent = prefix + current.toFixed(decimals) + suffix;
                if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(el => counterObserver.observe(el));
    }

    // --- Horizontal timeline scroll (GSAP ScrollTrigger) ---
    const timelineWrapper = document.querySelector('.timeline-wrapper');
    const timelineTrack = document.querySelector('.timeline-track');
    if (timelineWrapper && timelineTrack && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        function initTimeline() {
            const totalScroll = timelineTrack.scrollWidth - window.innerWidth;
            if (totalScroll <= 0) return;

            gsap.to(timelineTrack, {
                x: -totalScroll,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.timeline',
                    start: 'top top',
                    end: () => '+=' + (totalScroll * 1.5),
                    pin: true,
                    scrub: 0.5,
                    invalidateOnRefresh: true,
                    anticipatePin: 1
                }
            });

            const timelineLineFill = document.querySelector('.timeline-line-fill');
            if (timelineLineFill) {
                gsap.to(timelineLineFill, {
                    width: '100%',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.timeline',
                        start: 'top top',
                        end: () => '+=' + (totalScroll * 1.5),
                        scrub: 0.5
                    }
                });
            }
        }

        // Wait for images to load before calculating widths
        window.addEventListener('load', () => {
            initTimeline();
            ScrollTrigger.refresh();
        });
    }

    // --- 3D tilt on venture cards ---
    const tiltCards = document.querySelectorAll('.venture-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // --- Contact form handling ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('.btn-primary');
            const originalText = btn.textContent;
            btn.textContent = 'Message Sent!';
            btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                contactForm.reset();
            }, 3000);
        });
    }

});

(function () {
    'use strict';

    /* ----------------------------------------------------------
       NAV: scroll state
    ---------------------------------------------------------- */
    const nav = document.querySelector('.nav');
    const onScroll = () => {
        nav.classList.toggle('scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ----------------------------------------------------------
       NAV: mobile toggle
    ---------------------------------------------------------- */
    const toggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            const open = navLinks.classList.toggle('open');
            toggle.setAttribute('aria-expanded', String(open));
        });

        // Close on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ----------------------------------------------------------
       INTERSECTION OBSERVER: animate-on-scroll
    ---------------------------------------------------------- */
    const animTargets = document.querySelectorAll('[data-animate], .timeline-item, .project-card, .skill-group');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );

        animTargets.forEach(el => observer.observe(el));
    } else {
        // ------------------------------------
        // Fallback: show all immediately
        // ------------------------------------
        animTargets.forEach(el => el.classList.add('visible'));
    }

    /* ----------------------------------------------------------
       SMOOTH ANCHOR SCROLL (offset for fixed nav)
    ---------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const navHeight = nav ? nav.getBoundingClientRect().height : 0;
            const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 24;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    /* ----------------------------------------------------------
       ACTIVE NAV LINK on scroll
    ---------------------------------------------------------- */
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

    const highlightNav = () => {
        const scrollY = window.scrollY;
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 100;
            if (scrollY >= top) current = section.getAttribute('id');
        });
        navAnchors.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
        });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });
    highlightNav();

})();
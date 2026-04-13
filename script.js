/* ================================================================
   REVIVAL — Website Script
   ================================================================ */

(function () {
    'use strict';

    /* ============================================================
       CUSTOM CURSOR
    ============================================================ */
    const cursor   = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    let mouseX = window.innerWidth  / 2;
    let mouseY = window.innerHeight / 2;
    let fx = mouseX, fy = mouseY;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top  = mouseY + 'px';
    });

    function tickFollower() {
        fx += (mouseX - fx) * 0.11;
        fy += (mouseY - fy) * 0.11;
        follower.style.left = fx + 'px';
        follower.style.top  = fy + 'px';
        requestAnimationFrame(tickFollower);
    }
    tickFollower();

    document.querySelectorAll('a, button, .size-btn, .product-image-wrapper, .painting').forEach((el) => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor--hover');
            follower.classList.add('cursor-follower--hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor--hover');
            follower.classList.remove('cursor-follower--hover');
        });
    });

    /* ============================================================
       NAV — scroll behaviour
    ============================================================ */
    const nav = document.getElementById('nav');

    function updateNav() {
        nav.classList.toggle('nav--scrolled', window.scrollY > 60);
    }
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();

    /* ============================================================
       PARALLAX — hero layers + napoleon feature bg
    ============================================================ */
    const heroShirtStage  = document.querySelector('.hero-shirt-stage');
    const heroBgText      = document.querySelector('.hero-bg-text');
    const heroVignette    = document.querySelector('.hero-vignette');
    const compassRose     = document.querySelector('.compass-rose');
    const mapArcs         = document.querySelector('.map-arcs');
    const napoleonPainting = document.querySelector('.js-parallax-bg');

    function onScroll() {
        const sy = window.scrollY;

        if (heroShirtStage) {
            heroShirtStage.style.transform = `translateY(${sy * 0.14}px)`;
        }
        if (heroBgText) {
            heroBgText.style.transform = `translateY(${sy * 0.28}px)`;
        }
        if (heroVignette) {
            const p = Math.min(sy / (window.innerHeight * 0.8), 1);
            heroVignette.style.opacity = 1 + p * 0.4;
        }
        // Slow compass drift with scroll
        if (compassRose) {
            compassRose.style.transform = `rotate(${sy * 0.04}deg) translateY(${sy * -0.06}px)`;
        }
        // Map arcs slide slightly
        if (mapArcs) {
            mapArcs.style.transform = `translateY(${sy * 0.08}px)`;
        }

        // Napoleon feature parallax
        if (napoleonPainting) {
            const section = napoleonPainting.closest('.napoleon-feature');
            if (section) {
                const rect = section.getBoundingClientRect();
                const progress = -rect.top / (window.innerHeight + rect.height);
                napoleonPainting.style.transform = `translateY(${progress * 80}px)`;
            }
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    /* ============================================================
       SCROLL REVEAL — Intersection Observer
    ============================================================ */
    const revealEls = document.querySelectorAll('.reveal-block, .reveal-text, .reveal-img');

    const revealObs = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el     = entry.target;
                const parent = el.closest('section, .heritage-grid') || el.parentElement;
                const siblings = Array.from(
                    parent.querySelectorAll('.reveal-block, .reveal-text, .reveal-img')
                );
                const idx = siblings.indexOf(el);
                setTimeout(() => el.classList.add('is-visible'), idx * 130);
                revealObs.unobserve(el);
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    revealEls.forEach((el) => revealObs.observe(el));

    /* ============================================================
       3-D TILT on product image
    ============================================================ */
    const tiltEl = document.querySelector('.js-tilt');

    if (tiltEl) {
        tiltEl.addEventListener('mousemove', (e) => {
            const r = tiltEl.getBoundingClientRect();
            const x = (e.clientX - r.left  - r.width  / 2) / r.width;
            const y = (e.clientY - r.top   - r.height / 2) / r.height;
            tiltEl.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
            tiltEl.style.transition = 'transform 0.08s linear';
        });
        tiltEl.addEventListener('mouseleave', () => {
            tiltEl.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
            tiltEl.style.transition = 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
    }

    /* ============================================================
       SIZE SELECTOR
    ============================================================ */
    document.querySelectorAll('.size-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.size-btn').forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    /* ============================================================
       ADD TO CART
    ============================================================ */
    const addBtn    = document.querySelector('.btn-add-cart');
    const cartCount = document.querySelector('.cart-count');
    let cartQty     = 0;

    if (addBtn) {
        addBtn.addEventListener('click', () => {
            cartQty++;
            cartCount.textContent = cartQty;
            cartCount.classList.add('cart-count--bump');
            setTimeout(() => cartCount.classList.remove('cart-count--bump'), 400);
            addBtn.textContent = 'Added \u2713';
            addBtn.classList.add('btn-add-cart--success');
            setTimeout(() => {
                addBtn.textContent = 'Add to Cart';
                addBtn.classList.remove('btn-add-cart--success');
            }, 2200);
        });
    }

    /* ============================================================
       NOTIFY FORM
    ============================================================ */
    const notifyForm = document.getElementById('notifyForm');
    if (notifyForm) {
        notifyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = notifyForm.querySelector('.notify-input');
            const btn   = notifyForm.querySelector('.notify-btn');
            btn.textContent = "You're on the list \u2713";
            btn.classList.add('notify-btn--success');
            input.value = '';
            input.placeholder = "We'll be in touch.";
            input.disabled = btn.disabled = true;
            setTimeout(() => {
                btn.textContent = 'Notify Me';
                btn.classList.remove('notify-btn--success');
                input.placeholder = 'Enter your email';
                input.disabled = btn.disabled = false;
            }, 4000);
        });
    }

    /* ============================================================
       MARQUEE — pause on hover
    ============================================================ */
    const marqueeTrack = document.querySelector('.marquee-track');
    if (marqueeTrack) {
        const strip = marqueeTrack.parentElement;
        strip.addEventListener('mouseenter', () => { marqueeTrack.style.animationPlayState = 'paused'; });
        strip.addEventListener('mouseleave', () => { marqueeTrack.style.animationPlayState = 'running'; });
    }

    /* ============================================================
       SMOOTH ANCHOR SCROLL
    ============================================================ */
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const navH = nav ? nav.offsetHeight : 0;
            const top  = target.getBoundingClientRect().top + window.scrollY - navH;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    /* ============================================================
       PAINTING HOVER — subtle scale reveal
    ============================================================ */
    document.querySelectorAll('.painting-frame').forEach((frame) => {
        frame.addEventListener('mouseenter', () => {
            const img = frame.querySelector('.painting-img');
            if (img) {
                img.style.animationPlayState = 'paused';
                img.style.filter = 'sepia(0.1) contrast(1.1) brightness(1.05)';
            }
        });
        frame.addEventListener('mouseleave', () => {
            const img = frame.querySelector('.painting-img');
            if (img) {
                img.style.animationPlayState = 'running';
                img.style.filter = 'sepia(0.3) contrast(1.05) brightness(0.92)';
            }
        });
    });

})();

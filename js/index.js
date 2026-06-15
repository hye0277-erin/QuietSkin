document.addEventListener('DOMContentLoaded', () => {
    const heroVideo = document.querySelector('.qs-hero__video');
    const thumbBtns = Array.from(document.querySelectorAll('.thumb-btn'));
    const heroContent = document.querySelector('.qs-hero__content');
    const heroBadges = document.querySelector('.qs-hero__badges');

    function playVideo(video) {
        if (!video) return;
        video.muted = true;
        video.playsInline = true;
        video.play().catch(() => {});
    }

    function updateHeroContent(btn) {
        const data = btn.dataset;

        if (heroContent) {
            heroContent.querySelector('.qs-hero__eyebrow').textContent = data.eyebrow || '';
            heroContent.querySelector('.l1').textContent = data.line1 || '';
            heroContent.querySelector('.l2').textContent = data.line2 || '';
            heroContent.querySelector('.l3').textContent = data.line3 || '';
            heroContent.querySelector('.qs-hero__sub').textContent = data.sub || '';

            const actions = heroContent.querySelector('.qs-hero__actions');
            const [primary, ghost] = actions.querySelectorAll('a');
            primary.textContent = data.ctaPrimary || '제품 탐색하기';
            primary.href = data.ctaPrimaryHref || 'sub_all_products.html';
            ghost.textContent = data.ctaGhost || '브랜드 스토리';
            ghost.href = data.ctaGhostHref || 'sub_brand_story.html';

            const lines = heroContent.querySelectorAll('.qs-hero__headline .line');
            lines.forEach(line => { line.style.animation = 'none'; });
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    lines.forEach(line => { line.style.animation = ''; });
                });
            });
        }

        if (heroBadges) {
            const badges = heroBadges.querySelectorAll('.hero-badge');
            [
                [data.badge1Strong, data.badge1Span],
                [data.badge2Strong, data.badge2Span],
                [data.badge3Strong, data.badge3Span],
            ].forEach(([strong, span], index) => {
                if (!badges[index]) return;
                badges[index].querySelector('strong').textContent = strong || '';
                badges[index].querySelector('span').textContent = span || '';
            });
        }
    }

    if (heroVideo && thumbBtns.length) {
        let currentIndex = 0;

        const switchTo = (index) => {
            const btn = thumbBtns[index];
            if (!btn) return;

            if (heroContent) heroContent.style.opacity = '0';
            heroVideo.style.opacity = '0';

            setTimeout(() => {
                const source = heroVideo.querySelector('source');
                if (source) source.src = btn.dataset.video;
                else heroVideo.src = btn.dataset.video;

                heroVideo.load();
                playVideo(heroVideo);
                heroVideo.style.opacity = '1';

                updateHeroContent(btn);
                if (heroContent) heroContent.style.opacity = '1';
            }, 300);

            thumbBtns.forEach(item => item.classList.remove('active'));
            btn.classList.add('active');
            currentIndex = index;
        };

        thumbBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => switchTo(index));
        });

        setInterval(() => {
            switchTo((currentIndex + 1) % thumbBtns.length);
        }, 4000);
    }

    document.querySelectorAll('video').forEach(playVideo);

    document.querySelectorAll('.card-wish').forEach(button => {
        button.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();

            const isActive = button.classList.toggle('is-active');
            button.setAttribute('aria-pressed', String(isActive));

            const icon = button.querySelector('.material-icons');
            if (icon) icon.textContent = isActive ? 'favorite' : 'favorite_border';
        });
    });

    const revealEls = document.querySelectorAll('.qs-reveal');
    if (revealEls.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(el => observer.observe(el));
    }

    const routineEl = document.querySelector('.routine-slider');
    const isMobileRoutine = window.matchMedia('(max-width: 767px)').matches;
    if (routineEl && isMobileRoutine) {
        routineEl.querySelectorAll('.routine-oval-overlay').forEach(overlay => {
            overlay.style.background = 'rgba(10,20,14,0.42)';
        });
    }

    if (routineEl && !isMobileRoutine && typeof Swiper !== 'undefined') {
        const updateSlides = (swiper) => {
            swiper.slides.forEach(slide => {
                const overlay = slide.querySelector('.routine-oval-overlay');
                const isActive = slide.classList.contains('swiper-slide-active');
                if (!overlay) return;
                overlay.style.background = isActive
                    ? 'rgba(10,20,14,0.34)'
                    : 'rgba(10,20,14,0.58)';
            });
        };

        const routineSwiper = new Swiper('.routine-slider', {
            slidesPerView: 3,
            spaceBetween: 0,
            loop: true,
            centeredSlides: true,
            grabCursor: true,
            speed: 700,
            autoplay: {
                delay: 2800,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },
            breakpoints: {
                0: { slidesPerView: 1, spaceBetween: 16 },
                640: { slidesPerView: 2, spaceBetween: 12 },
                900: { slidesPerView: 3, spaceBetween: 0 },
            },
            on: {
                init: updateSlides,
                slideChange: updateSlides,
                slideChangeTransitionEnd: updateSlides,
            },
        });

        document.querySelector('.routine-prev')?.addEventListener('click', () => routineSwiper.slidePrev());
        document.querySelector('.routine-next')?.addEventListener('click', () => routineSwiper.slideNext());
    }

    const reviewSliderEl = document.querySelector('.review_slider_new');
    if (reviewSliderEl && typeof Swiper !== 'undefined') {
        const reviewSwiper = new Swiper('.review_slider_new', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            pagination: {
                el: '.review-pag',
                clickable: true,
                type: 'bullets',
            },
            breakpoints: {
                640: { slidesPerView: 1.5, centeredSlides: true },
                900: { slidesPerView: 2, centeredSlides: false },
                1100: { slidesPerView: 3, centeredSlides: false },
            },
            autoplay: { delay: 5000, disableOnInteraction: false },
        });

        document.querySelector('.rev-prev')?.addEventListener('click', () => reviewSwiper.slidePrev());
        document.querySelector('.rev-next')?.addEventListener('click', () => reviewSwiper.slideNext());
    }

    const stats = document.querySelectorAll('.n-stat strong');
    if (stats.length) {
        const parseValue = el => parseFloat(el.childNodes[0].nodeValue.trim().replace(/,/g, ''));
        const formatValue = (el, val) => {
            const suffix = el.querySelector('span');
            const suffixText = suffix ? suffix.outerHTML : '';
            const raw = el.childNodes[0].nodeValue.trim();
            let num = raw.includes('.') ? val.toFixed(raw.split('.')[1].replace(/\D/g, '').length) : Math.round(val);
            if (raw.includes(',')) num = Number(num).toLocaleString('ko-KR');
            el.innerHTML = num + suffixText;
        };

        const countUp = el => {
            const target = parseValue(el);
            const start = performance.now();
            const tick = now => {
                const progress = Math.min((now - start) / 1600, 1);
                const ease = 1 - Math.pow(1 - progress, 3);
                formatValue(el, target * ease);
                if (progress < 1) requestAnimationFrame(tick);
                else formatValue(el, target);
            };
            requestAnimationFrame(tick);
        };

        const statsSection = document.querySelector('.narrative-stats');
        if (statsSection) {
            let fired = false;
            const statObserver = new IntersectionObserver(entries => {
                if (!entries[0].isIntersecting || fired) return;
                fired = true;
                stats.forEach(countUp);
                statObserver.disconnect();
            }, { threshold: 0.5 });
            statObserver.observe(statsSection);
        }
    }

    const nlForm = document.querySelector('.nl-form');
    if (nlForm) {
        nlForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const input = nlForm.querySelector('.nl-input');
            const btn = nlForm.querySelector('.nl-btn');
            if (!input || !btn || !input.value) return;

            btn.textContent = '구독 완료!';
            btn.style.background = '#2d7a5a';
            input.value = '';

            setTimeout(() => {
                btn.textContent = '구독하기';
                btn.style.background = '';
            }, 3000);
        });
    }
});

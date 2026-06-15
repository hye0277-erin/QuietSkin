/* QuietSkin 2026 Index — index.js */

document.addEventListener('DOMContentLoaded', () => {

    /* ── 1. 히어로 비디오 전환 ── */
    const heroVideo = document.querySelector('.qs-hero__video');
    const thumbBtns = document.querySelectorAll('.thumb-btn');
    const heroContent = document.querySelector('.qs-hero__content');
    const heroBadges = document.querySelector('.qs-hero__badges');

    function updateHeroContent(btn) {
        const d = btn.dataset;

        /* 텍스트 콘텐츠 교체 */
        if (heroContent) {
            heroContent.querySelector('.qs-hero__eyebrow').textContent = d.eyebrow || '';
            heroContent.querySelector('.l1').textContent = d.line1 || '';
            heroContent.querySelector('.l2').textContent = d.line2 || '';
            heroContent.querySelector('.l3').textContent = d.line3 || '';
            heroContent.querySelector('.qs-hero__sub').textContent = d.sub || '';

            const actions = heroContent.querySelector('.qs-hero__actions');
            const [primary, ghost] = actions.querySelectorAll('a');
            primary.textContent = d.ctaPrimary || '제품 탐색하기';
            primary.href = d.ctaPrimaryHref || 'sub_all_products.html';
            ghost.textContent = d.ctaGhost || '브랜드 스토리';
            ghost.href = d.ctaGhostHref || 'sub_brand_story.html';
        }

        /* 배지 교체 */
        if (heroBadges) {
            const badges = heroBadges.querySelectorAll('.hero-badge');
            [[d.badge1Strong, d.badge1Span],
             [d.badge2Strong, d.badge2Span],
             [d.badge3Strong, d.badge3Span]].forEach(([strong, span], i) => {
                if (!badges[i]) return;
                badges[i].querySelector('strong').textContent = strong || '';
                badges[i].querySelector('span').textContent = span || '';
            });
        }

        /* 라인 애니메이션 재실행 */
        if (heroContent) {
            const lines = heroContent.querySelectorAll('.qs-hero__headline .line');
            lines.forEach(l => { l.style.animation = 'none'; });
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    lines.forEach(l => { l.style.animation = ''; });
                });
            });
        }
    }

    if (heroVideo && thumbBtns.length) {
        let currentIndex = 0;

        const switchTo = (idx) => {
            const btn = Array.from(thumbBtns)[idx];
            if (!btn) return;

            /* 콘텐츠 페이드 */
            heroContent && (heroContent.style.opacity = '0');
            heroVideo.style.opacity = '0';

            setTimeout(() => {
                heroVideo.src = btn.dataset.video;
                heroVideo.load();
                heroVideo.play().catch(() => {});
                heroVideo.style.opacity = '1';

                updateHeroContent(btn);
                heroContent && (heroContent.style.opacity = '1');
            }, 300);

            thumbBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentIndex = idx;
        };

        thumbBtns.forEach((btn, idx) => {
            btn.addEventListener('click', () => switchTo(idx));
        });

        /* 자동 순환 — 4초 */
        setInterval(() => {
            switchTo((currentIndex + 1) % thumbBtns.length);
        }, 4000);
    }

    /* ── 2. qs-reveal 스크롤 등장 ── */
    const revealEls = document.querySelectorAll('.qs-reveal');
    if (revealEls.length) {
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
        revealEls.forEach(el => observer.observe(el));
    }

    /* ── 3. 루틴 오벌 슬라이더 ── */
    const routineEl = document.querySelector('.routine-slider');
    if (routineEl) {

        /* transform/shadow → CSS .swiper-slide-active가 전담
           overlay 밝기만 JS에서 처리 */
        const updateSlides = (swiper) => {
            swiper.slides.forEach(slide => {
                const overlay  = slide.querySelector('.routine-oval-overlay');
                const isActive = slide.classList.contains('swiper-slide-active');
                if (overlay) {
                    overlay.style.background = isActive
                        ? 'rgba(10,20,14,0.04)'
                        : 'rgba(10,20,14,0.58)';
                }
            });
        };

        const rs = new Swiper('.routine-slider', {
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
            on: {
                init:                    updateSlides,
                slideChange:             updateSlides,
                slideChangeTransitionEnd: updateSlides,  /* 루프 점프 후 재보정 */
            },
        });

        document.querySelector('.routine-prev')
            ?.addEventListener('click', () => rs.slidePrev());
        document.querySelector('.routine-next')
            ?.addEventListener('click', () => rs.slideNext());
    }

    /* ── 5. 리뷰 슬라이더 (새 선택자) ── */
    const reviewSliderEl = document.querySelector('.review_slider_new');
    if (reviewSliderEl) {
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
                640:  { slidesPerView: 1.5, centeredSlides: true },
                900:  { slidesPerView: 2, centeredSlides: false },
                1100: { slidesPerView: 3, centeredSlides: false },
            },
            autoplay: { delay: 5000, disableOnInteraction: false },
        });

        const prevBtn = document.querySelector('.rev-prev');
        const nextBtn = document.querySelector('.rev-next');
        if (prevBtn) prevBtn.addEventListener('click', () => reviewSwiper.slidePrev());
        if (nextBtn) nextBtn.addEventListener('click', () => reviewSwiper.slideNext());
    }

    /* ── 4. narrative-stats 카운트업 애니메이션 ── */
    const stats = document.querySelectorAll('.n-stat strong');
    if (stats.length) {
        const parseValue = el => {
            const text = el.childNodes[0].nodeValue.trim();
            return parseFloat(text.replace(/,/g, ''));
        };
        const formatValue = (el, val) => {
            const suffix = el.querySelector('span');
            const suffixText = suffix ? suffix.outerHTML : '';
            const raw = el.childNodes[0].nodeValue.trim();
            const isComma = raw.includes(',');
            const decimals = raw.includes('.') ? raw.split('.')[1]?.replace(/\D/g, '').length : 0;
            let num = decimals > 0 ? val.toFixed(decimals) : Math.round(val);
            if (isComma) num = Number(num).toLocaleString('ko-KR');
            el.innerHTML = num + suffixText;
        };

        const countUp = el => {
            const target = parseValue(el);
            const duration = 1600;
            const start = performance.now();
            const tick = now => {
                const progress = Math.min((now - start) / duration, 1);
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
                if (entries[0].isIntersecting && !fired) {
                    fired = true;
                    stats.forEach(el => countUp(el));
                    statObserver.disconnect();
                }
            }, { threshold: 0.5 });
            statObserver.observe(statsSection);
        }
    }

    /* ── 5. 뉴스레터 폼 ── */

    const nlForm = document.querySelector('.nl-form');
    if (nlForm) {
        nlForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = nlForm.querySelector('.nl-input');
            if (input && input.value) {
                const btn = nlForm.querySelector('.nl-btn');
                btn.textContent = '구독 완료!';
                btn.style.background = '#2d7a5a';
                input.value = '';
                setTimeout(() => {
                    btn.textContent = '구독하기';
                    btn.style.background = '';
                }, 3000);
            }
        });
    }

    /* ── 5. 헤더 스크롤 투명→불투명 ── */
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('is-scrolled', window.scrollY > 60);
        }, { passive: true });
    }

    /* ── 6. 루틴 스텝 — 모바일 전체 표시 복구 ── */
    function handleRoutineVisibility() {
        const steps = document.querySelectorAll('.routine-step');
        if (window.innerWidth < 768) {
            steps.forEach((s, i) => {
                s.style.display = i < 5 ? '' : 'none';
            });
        } else {
            steps.forEach(s => { s.style.display = ''; });
        }
    }
    handleRoutineVisibility();
    window.addEventListener('resize', handleRoutineVisibility, { passive: true });

});

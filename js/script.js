/**
 * QuietSkin common UI script
 * - header/footer partial loading
 * - navigation and search interactions
 * - optional Swiper/reveal interactions
 */

document.addEventListener('DOMContentLoaded', function () {
    loadCommonParts().then(function () {
        initNavigation();
        initSearch();
        initCartIndicators();
        initHeroSwiper();
        initRevealAnimation();
        initPromiseReviewSwiper();
        initDetailReviewSlider();
        initProductCategoryFilter();
        initQuickMenu();
    });
});

function loadCommonParts() {
    const includeTargets = document.querySelectorAll('[data-include]');
    const tasks = Array.from(includeTargets).map(function (target) {
        const name = target.dataset.include;
        if (!name) return Promise.resolve();

        return fetch('./' + name + '.html')
            .then(function (response) {
                if (!response.ok) throw new Error(name + '.html load failed');
                return response.text();
            })
            .then(function (html) {
                target.outerHTML = html;
            })
            .catch(function (error) {
                console.warn(error.message);
            });
    });

    return Promise.all(tasks);
}

function initNavigation() {
    const menuLinks = document.querySelectorAll('.gnb > .has_sub > .main_menu_link');
    const navLinks = document.querySelectorAll('.gnb a');
    const gnbWrap = document.querySelector('.gnb_wrap');
    const menuToggleBtn = document.querySelector('.btn_m_menu');
    const header = document.querySelector('.header');
    const mobileQuery = window.matchMedia('(max-width: 767px)');

    const closeMobileMenu = function () {
        if (!gnbWrap || !menuToggleBtn) return;

        gnbWrap.classList.remove('open');
        document.body.classList.remove('no-scroll');
        menuToggleBtn.setAttribute('aria-expanded', 'false');
        menuToggleBtn.setAttribute('aria-label', '메뉴 열기');

        const iconNode = menuToggleBtn.querySelector('.material-icons');
        if (iconNode) iconNode.textContent = 'menu';
    };

    const setActiveNavigation = function () {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';

        navLinks.forEach(function (link) {
            const linkPath = link.getAttribute('href') ? link.getAttribute('href').replace('./', '') : '';
            const isActive = linkPath === currentPath;
            link.classList.toggle('is-current', isActive);
            if (isActive) link.setAttribute('aria-current', 'page');

            if (isActive && link.closest('.has_sub')) {
                const parentLink = link.closest('.has_sub').querySelector('.main_menu_link');
                if (parentLink) parentLink.classList.add('is-current');
            }
        });
    };

    const isIndexPage = document.body.dataset.page === 'index';

    const updateHeaderState = function () {
        if (!header) return;
        if (!isIndexPage) {
            header.classList.add('is-scrolled');
            return;
        }
        header.classList.toggle('is-scrolled', window.scrollY > 60);
    };

    menuLinks.forEach(function (link) {
        link.addEventListener('click', function (event) {
            if (!mobileQuery.matches) return;

            event.preventDefault();
            const parentLi = this.parentElement;
            const isActive = parentLi.classList.contains('active');

            menuLinks.forEach(function (item) {
                item.parentElement.classList.remove('active');
                item.setAttribute('aria-expanded', 'false');
            });

            parentLi.classList.toggle('active', !isActive);
            this.setAttribute('aria-expanded', String(!isActive));
        });
    });

    if (menuToggleBtn && gnbWrap) {
        menuToggleBtn.addEventListener('click', function () {
            const isOpen = gnbWrap.classList.toggle('open');
            document.body.classList.toggle('no-scroll', isOpen);
            this.setAttribute('aria-expanded', String(isOpen));
            this.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');

            const iconNode = this.querySelector('.material-icons');
            if (iconNode) {
                iconNode.textContent = isOpen ? 'close' : 'menu';
            }
        });

        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                if (!this.parentElement.classList.contains('has_sub')) {
                    closeMobileMenu();
                }
            });
        });
    }

    document.addEventListener('click', function (event) {
        if (!gnbWrap || !menuToggleBtn || !gnbWrap.classList.contains('open')) return;
        if (gnbWrap.contains(event.target) || menuToggleBtn.contains(event.target)) return;
        closeMobileMenu();
    });

    document.addEventListener('keydown', function (event) {
        if (event.key !== 'Escape') return;
        closeMobileMenu();
    });

    window.addEventListener('resize', function () {
        if (!mobileQuery.matches) closeMobileMenu();
    });

    window.addEventListener('scroll', updateHeaderState);
    updateHeaderState();
    setActiveNavigation();
}

function initSearch() {
    /* header.html 삽입 후 body 직속 자식으로 존재하는 오버레이 탐색 */
    const searchToggleBtns = document.querySelectorAll('.btn_search_toggle');
    const searchCloseBtn  = document.querySelector('.btn_search_close');
    const searchOverlay   = document.querySelector('.search_overlay');
    const searchInput     = document.querySelector('.search_input');
    const searchForm      = document.querySelector('.search_form');

    if (!searchOverlay) return;

    const openSearch = function () {
        if (!searchOverlay) return;
        searchOverlay.classList.add('open');
        searchOverlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('no-scroll');
        searchToggleBtns.forEach(btn => btn.setAttribute('aria-expanded', 'true'));
        if (searchInput) setTimeout(() => searchInput.focus(), 200);
    };

    const closeSearch = function () {
        if (!searchOverlay) return;
        searchOverlay.classList.remove('open');
        searchOverlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('no-scroll');
        searchToggleBtns.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
        if (searchInput) searchInput.value = '';
    };

    searchToggleBtns.forEach(btn => btn.addEventListener('click', openSearch));
    if (searchCloseBtn)  searchCloseBtn.addEventListener('click', closeSearch);

    /* 추천 태그 클릭 → 검색창에 삽입 후 바로 이동 */
    document.querySelectorAll('.search_tags button').forEach(function (btn) {
        btn.addEventListener('click', function () {
            if (searchInput) {
                searchInput.value = this.textContent.trim();
                /* 폼이 있으면 바로 제출해서 search.html로 이동 */
                if (searchForm) searchForm.submit();
                else searchInput.focus();
            }
        });
    });

    /* 오버레이 배경 클릭 시 닫기 */
    if (searchOverlay) {
        searchOverlay.addEventListener('click', function (e) {
            if (e.target === searchOverlay) closeSearch();
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeSearch();
    });
}

function initCartIndicators() {
    const CART_KEY = 'quietskinCartCount';
    const addButtons = document.querySelectorAll('.btn_cart_add, .btn-cart-add, .pd-cart-btn, .pd-pair-add, .rec-add');
    const cartLinks = document.querySelectorAll('a[href$="cart.html"]');
    let hideToastTimer;

    const getCartCount = function () {
        return Math.max(parseInt(localStorage.getItem(CART_KEY), 10) || 0, 0);
    };

    const setCartCount = function (count) {
        localStorage.setItem(CART_KEY, String(count));
        cartLinks.forEach(function (link) {
            link.classList.add('has-cart-count');
            link.setAttribute('data-cart-count', String(count));
            link.setAttribute('aria-label', count > 0 ? '장바구니, 담긴 상품 ' + count + '개' : '장바구니');
        });
    };

    const showCartToast = function (name) {
        let toast = document.querySelector('.cart-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'cart-toast';
            toast.setAttribute('role', 'status');
            toast.setAttribute('aria-live', 'polite');
            document.body.appendChild(toast);
        }

        toast.replaceChildren();
        const icon = document.createElement('span');
        icon.className = 'material-icons';
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = 'check_circle';

        const message = document.createElement('span');
        message.textContent = name ? name + ' 상품을 담았어요' : '장바구니에 상품을 담았어요';

        toast.append(icon, message);
        toast.classList.add('show');

        window.clearTimeout(hideToastTimer);
        hideToastTimer = window.setTimeout(function () {
            toast.classList.remove('show');
        }, 1800);
    };

    const getProductName = function (button) {
        const card = button.closest('.product_card, .qs-product-card, .pd-hero-info, .pd-pair-card, .cart-recommend-item');
        if (!card) return '';

        const nameNode = card.querySelector('.p_name, .card-name, h1, strong');
        return nameNode ? nameNode.textContent.trim() : '';
    };

    setCartCount(getCartCount());

    addButtons.forEach(function (button) {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();

            const nextCount = getCartCount() + 1;
            const productName = getProductName(button);
            setCartCount(nextCount);
            showCartToast(productName);

            button.classList.add('is-added');
            button.setAttribute('aria-label', '장바구니에 담김');
            window.setTimeout(function () {
                button.classList.remove('is-added');
            }, 1200);
        });
    });
}

function initHeroSwiper() {
    if (typeof Swiper === 'undefined' || !document.querySelector('.hero_slider')) return;

    new Swiper('.hero_slider', {
        loop: true,
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        }
    });
}

function initRevealAnimation() {
    const revealTargets = document.querySelectorAll('.img_reveal_target');
    if (!('IntersectionObserver' in window) || revealTargets.length === 0) {
        revealTargets.forEach(function (target) {
            target.classList.add('revealed');
        });
        return;
    }

    const revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    });

    revealTargets.forEach(function (target) {
        revealObserver.observe(target);
    });
}

function initPromiseReviewSwiper() {
    if (typeof Swiper === 'undefined' || !document.querySelector('.review_slider')) return;

    new Swiper('.review_slider', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 20,
        autoplay: {
            delay: 4500,
            disableOnInteraction: false
        },
        navigation: {
            nextEl: '.review-next',
            prevEl: '.review-prev'
        }
    });
}

function initDetailReviewSlider() {
    const reviewList = document.querySelector('.review-card-list');
    const reviewCards = reviewList ? Array.from(reviewList.querySelectorAll('.review-card')) : [];
    const prevButton = document.querySelector('.review-prev');
    const nextButton = document.querySelector('.review-next');

    if (!reviewList || reviewCards.length === 0 || !prevButton || !nextButton) return;

    let currentIndex = 0;

    const getVisibleCount = function () {
        if (window.matchMedia('(max-width: 1023px)').matches) return 1;
        return 3;
    };

    const updateReviewPosition = function () {
        const gap = parseFloat(window.getComputedStyle(reviewList).columnGap) || 0;
        const cardWidth = reviewCards[0].getBoundingClientRect().width;
        const maxIndex = Math.max(reviewCards.length - getVisibleCount(), 0);

        currentIndex = Math.min(currentIndex, maxIndex);
        reviewList.scrollTo({
            left: currentIndex * (cardWidth + gap),
            behavior: 'smooth'
        });

        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === maxIndex;
    };

    prevButton.addEventListener('click', function () {
        currentIndex = Math.max(currentIndex - 1, 0);
        updateReviewPosition();
    });

    nextButton.addEventListener('click', function () {
        const maxIndex = Math.max(reviewCards.length - getVisibleCount(), 0);
        currentIndex = Math.min(currentIndex + 1, maxIndex);
        updateReviewPosition();
    });

    window.addEventListener('resize', updateReviewPosition);
    updateReviewPosition();
}

function initQuickMenu() {
    const qm = document.querySelector('.quick-menu');
    if (!qm) return;

    const topBtn = qm.querySelector('.qm-top');

    const onScroll = function () {
        qm.classList.toggle('is-visible', window.scrollY > 300);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (topBtn) {
        topBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

function initProductCategoryFilter() {
    const filterWrap = document.querySelector('.product-category-filter');
    const productCards = document.querySelectorAll('.product_card[data-category]');

    if (!filterWrap || productCards.length === 0) return;

    filterWrap.addEventListener('click', function (event) {
        const button = event.target.closest('button[data-filter]');
        if (!button) return;

        const selectedFilter = button.dataset.filter;

        filterWrap.querySelectorAll('button').forEach(function (item) {
            item.classList.toggle('active', item === button);
        });

        productCards.forEach(function (card) {
            const isVisible = selectedFilter === 'all' || card.dataset.category === selectedFilter;
            card.hidden = !isVisible;
        });
    });
}

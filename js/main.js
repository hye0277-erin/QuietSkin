document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    const mobileMenuButton = document.querySelector('.mobile-menu-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    const updateHeaderState = () => {
        if (!header) return;
        header.classList.toggle('is-scrolled', window.scrollY > 0);
    };

    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState);

    if (header && mobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            const isOpen = header.classList.toggle('is-menu-open');
            mobileMenuButton.setAttribute('aria-expanded', String(isOpen));
            mobileMenuButton.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
        });

        menuItems.forEach(item => {
            const depthLink = item.querySelector('.depth1');
            if (!depthLink) return;

            depthLink.addEventListener('click', event => {
                if (!window.matchMedia('(max-width: 1023px)').matches) return;

                event.preventDefault();
                const wasOpen = item.classList.contains('is-open');

                menuItems.forEach(menuItem => {
                    if (menuItem !== item) {
                        menuItem.classList.remove('is-open');
                    }
                });

                item.classList.toggle('is-open', !wasOpen);
            });
        });

        document.addEventListener('click', event => {
            if (!window.matchMedia('(max-width: 1023px)').matches) return;
            if (!header.classList.contains('is-menu-open')) return;
            if (header.contains(event.target)) return;

            header.classList.remove('is-menu-open');
            mobileMenuButton.setAttribute('aria-expanded', 'false');
            mobileMenuButton.setAttribute('aria-label', '메뉴 열기');
        });
    }
    
    // Swiper Slider 초기화
    const heroSwiper = new Swiper('.hero-slider', {
        loop: true,
        speed: 800,
        watchSlidesProgress: true,
        grabCursor: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            type: 'custom',
            renderCustom: function (swiper, current, total) {
                const padNumber = (number) => String(number).padStart(2, '0');
                let nextItems = '';

                for (let index = 1; index <= total; index++) {
                    if (index !== current) {
                        nextItems += '<span class="hero-pagination-number">' + padNumber(index) + '</span>';
                    }
                }

                return '<div class="hero-pagination-inner">' +
                    '<span class="hero-pagination-current">' + padNumber(current) + '</span>' +
                    '<span class="hero-pagination-line"></span>' +
                    '<div class="hero-pagination-list">' + nextItems + '</div>' +
                    '</div>';
            }
        },
        on: {
            touchStart: function () {
                if (!window.matchMedia('(min-width: 1024px)').matches) return;
                this.el.classList.add('is-dragging');
            },
            sliderMove: function () {
                if (!window.matchMedia('(min-width: 1024px)').matches) return;
                this.el.classList.add('is-dragging');
            },
            touchEnd: function () {
                if (!window.matchMedia('(min-width: 1024px)').matches) return;
                window.setTimeout(() => {
                    this.el.classList.remove('is-dragging');
                }, 180);
            },
            transitionEnd: function () {
                this.el.classList.remove('is-dragging');
            }
        },
    });

    // GNB 마우스 오버 시 스타일 변경 (선택사항)
    const gnbLinks = document.querySelectorAll('.depth1');
    gnbLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.color = '#2d5a4c';
        });
        link.addEventListener('mouseleave', () => {
            link.style.color = '';
        });
    });
});

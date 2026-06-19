/**
 * QuietSkin 고유 프론트엔드 인터랙션 스크립트
 * - GNB 반응형 및 아코디언 서브메뉴 제어
 * - 검색 레이어 오버레이 토글
 * - 메인 히어로 Swiper 3단 롤링 슬라이더 최적화
 * - 스크롤 반응형 이미지 리빌(Reveal) 애니메이션 
 */

document.addEventListener('DOMContentLoaded', function () {
    
    // ==========================================
    // 01. 네비게이션 GNB 서브메뉴 토글 제어
    // ==========================================
    const menuLinks = document.querySelectorAll('.gnb > .has_sub > .main_menu_link');
    const gnbWrap = document.querySelector('.gnb_wrap');
    const menuToggleBtn = document.querySelector('.btn_m_menu');

    menuLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // 반응형 모바일웹 스펙 및 태블릿 터치 스크린에서 링크 기본 이동 방지
            e.preventDefault();
            const parentLi = this.parentElement;
            
            // 동일 레벨의 활성화된 다른 서브메뉴가 있다면 닫기 조치
            if (parentLi.classList.contains('active')) {
                parentLi.classList.remove('active');
            } else {
                menuLinks.forEach(item => item.parentElement.classList.remove('active'));
                parentLi.classList.add('active');
            }
        });
    });

    // 모바일 전용 트리거 햄버거 버튼 제어 (오버 인터랙션 유연화)
    if (menuToggleBtn && gnbWrap) {
        menuToggleBtn.addEventListener('click', function () {
            gnbWrap.classList.toggle('open');
            
            // 아이콘 변경 인터랙션 (menu -> close 호환 제어)
            const iconNode = this.querySelector('.material-icons');
            if (iconNode) {
                iconNode.textContent = gnbWrap.classList.contains('open') ? 'close' : 'menu';
            }
        });
    }

    // ==========================================
    // 02. 검색 바 슬라이드 다운 오버레이 제어
    // ==========================================
    const searchToggleBtn = document.querySelector('.btn_search_toggle');
    const searchCloseBtn = document.querySelector('.btn_search_close');
    const searchOverlay = document.querySelector('.search_overlay_bar');
    const searchInput = document.querySelector('.search_input');

    if (searchToggleBtn && searchOverlay) {
        searchToggleBtn.addEventListener('click', function () {
            searchOverlay.classList.add('open');
            // 열림과 동시에 입력창에 포커스를 주어 UX 최적화 보장
            if (searchInput) setTimeout(() => searchInput.focus(), 300);
        });
    }

    if (searchCloseBtn && searchOverlay) {
        searchCloseBtn.addEventListener('click', function () {
            searchOverlay.classList.remove('open');
        });
    }

    // ==========================================
    // 03. 히어로 배너 슬라이더 초기화 (Swiper 라이브러리 바인딩)
    // ==========================================
    const heroSwiper = new Swiper('.hero_slider', {
        loop: true,                         // 무한 루프 롤링 3개 구현
        effect: 'fade',                     // 비주얼 이미지 겹침 투명도 모션 페이드 효과
        fadeEffect: { 
            crossFade: true 
        },
        autoplay: { 
            delay: 5000, 
            disableOnInteraction: false     // 사용자 마우스 제어 후에도 자동 재생 유지
        },
        pagination: { 
            el: '.swiper-pagination', 
            clickable: true 
        },
        navigation: { 
            nextEl: '.swiper-button-next', 
            prevEl: '.swiper-button-prev' 
        },
    });

    // ==========================================
    // 04. 스크롤 인터랙션 - 이미지 나타남 효과
    // ==========================================
    const observerOptions = {
        root: null,         // 뷰포트 기준 감지
        rootMargin: '0px',
        threshold: 0.15     // 대상 타겟 요소가 15% 정도 화면에 보일 때 실행
    };

    const revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 스크롤 내렸을 때 클래스를 결합하여 CSS 트랜지션 모션 발동
                entry.target.classList.add('revealed');
                // 불필요한 중복 연산을 막기 위해 한번 나타난 뒤 감지 해제(unobserve) 처리
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 스크롤 감지 대상 노드(베스트 상품 썸네일 등) 쿼리 셀렉팅 후 옵저버 바인딩
    const revealTargets = document.querySelectorAll('.img_reveal_target');
    revealTargets.forEach(target => {
        revealObserver.observe(target);
    });

});


// ==========================================
    // 05. 약속 섹션 리뷰 슬라이더 (5개 노드 롤링 시스템)
    // ==========================================
/*     const reviewSwiper = new Swiper('.review_slider', {
        loop: true,                         // 5개 리뷰 무한 루프 롤링
        slidesPerView: 1,                   // 기본 모바일 뷰에서는 1개씩 노출
        spaceBetween: 20,                   // 슬라이드 간 간격 격차
        autoplay: {
            delay: 4500,                    // 4.5초 간격 전환
            disableOnInteraction: false,    // 사용자 제어 후에도 자동 재생 지속 유지
        },
        navigation: {
            nextEl: '.review-next',
            prevEl: '.review-prev',
        },
        // 태블릿 이상 해상도에서 안정적인 레이아웃 매칭을 위한 브레이크포인트 설정
        breakpoints: {
            768: {
                slidesPerView: 1,
                spaceBetween: 30
            }
        }
    }); */
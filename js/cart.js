/* 장바구니 아이콘 카운트 동기화 - cart.html 진입 시 담긴 수량을 헤더에 반영 */
function applyCartBadge() {
    const CART_KEY = 'quietskinCartCount';
    const items = document.querySelectorAll('.cart-item');
    if (items.length > 0) {
        localStorage.setItem(CART_KEY, String(items.length));
    }
    const count = Math.max(parseInt(localStorage.getItem(CART_KEY), 10) || 0, 0);
    document.querySelectorAll('a[href$="cart.html"]').forEach(function (link) {
        if (count > 0) {
            link.classList.add('has-cart-count');
            link.setAttribute('data-cart-count', String(count));
            link.setAttribute('aria-label', '장바구니, 담긴 상품 ' + count + '개');
        } else {
            link.classList.remove('has-cart-count');
            link.removeAttribute('data-cart-count');
        }
    });
}

/* 헤더가 동적으로 주입된 뒤 뱃지를 적용하기 위해 헤더 링크가 생길 때까지 대기 */
(function waitForHeader() {
    if (document.querySelector('.header_util a[href$="cart.html"]')) {
        applyCartBadge();
        return;
    }
    const observer = new MutationObserver(function () {
        if (document.querySelector('.header_util a[href$="cart.html"]')) {
            observer.disconnect();
            applyCartBadge();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();

/* 수량 +/- */
document.querySelectorAll('.cart-qty').forEach(wrap => {
    const display = wrap.querySelector('span');
    wrap.querySelectorAll('button').forEach((btn, i) => {
        btn.addEventListener('click', () => {
            let v = parseInt(display.textContent);
            if (i === 0 && v > 1) v--;
            if (i === 1) v++;
            display.textContent = v;
        });
    });
});

/* 삭제 버튼 */
document.querySelectorAll('.cart-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.cart-item').style.opacity = '0';
        btn.closest('.cart-item').style.transform = 'translateX(20px)';
        btn.closest('.cart-item').style.transition = 'all 0.3s';
        setTimeout(() => btn.closest('.cart-item').remove(), 300);
    });
});

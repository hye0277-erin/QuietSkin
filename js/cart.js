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

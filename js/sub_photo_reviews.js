/* ── 숫자 카운트업 애니메이션 ── */
function animateCount(el) {
    const rawText = el.textContent.trim();
    const isPercent = rawText.endsWith('%');
    const target = parseFloat(rawText.replace('%', ''));
    const duration = 1600;
    const start = performance.now();

    function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        /* easeOutExpo */
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = target * ease;
        el.textContent = (Number.isInteger(target)
            ? Math.round(current)
            : current.toFixed(1)) + (isPercent ? '%' : '');
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

const statEls = document.querySelectorAll('.rv-stats strong, .rv-score-big strong');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
            entry.target.dataset.counted = '1';
            animateCount(entry.target);
        }
    });
}, { threshold: 0.5 });
statEls.forEach(el => observer.observe(el));

/* ── 필터 기능 ── */
const filterBtns = document.querySelectorAll('.rv-filter button');
const cards = document.querySelectorAll('.rv-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        cards.forEach(card => {
            const match = filter === 'all' || card.dataset.tag === filter;
            if (match) {
                card.style.display = '';
                card.style.animation = 'none';
                card.offsetHeight;
                card.style.animation = 'rv-fade-in 0.35s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

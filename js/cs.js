/* 탭 전환 함수 */
const csTabs = document.querySelectorAll('.cs-tab');
const csPanels = document.querySelectorAll('.cs-panel');

function switchCsTab(tabId) {
    csTabs.forEach(t => t.classList.remove('active'));
    csPanels.forEach(p => p.classList.remove('active'));
    const target = document.querySelector(`.cs-tab[data-tab="${tabId}"]`);
    if (target) target.classList.add('active');
    const panel = document.getElementById('tab-' + tabId);
    if (panel) panel.classList.add('active');
}

csTabs.forEach(tab => {
    tab.addEventListener('click', () => switchCsTab(tab.dataset.tab));
});

/* URL 앵커로 탭 자동 활성화 (#faq, #qna, #order) */
const hash = location.hash.replace('#', '');
if (hash && ['faq', 'order', 'qna'].includes(hash)) {
    switchCsTab(hash);
}

/* FAQ 아코디언 */
document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
    });
});

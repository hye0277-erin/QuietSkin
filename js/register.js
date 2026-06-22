/* 전체 동의 체크박스 */
const agreeAll = document.getElementById('agree-all');
const agreeItems = document.querySelectorAll('.rg-agree-list input[type="checkbox"]');
agreeAll.addEventListener('change', () => {
    agreeItems.forEach(cb => cb.checked = agreeAll.checked);
});
agreeItems.forEach(cb => {
    cb.addEventListener('change', () => {
        agreeAll.checked = [...agreeItems].every(c => c.checked);
    });
});

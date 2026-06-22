/* 카테고리 필터 */
const filterSelect = document.querySelector('.product-category-select');
const cards = document.querySelectorAll('.product_card');
filterSelect.addEventListener('change', () => {
    const f = filterSelect.value;
    cards.forEach(card => {
        card.style.display = (f === 'all' || card.dataset.category === f) ? '' : 'none';
    });
});

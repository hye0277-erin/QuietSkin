/* 썸네일 클릭 시 메인 이미지 교체 */
const mainImg = document.querySelector('.pd-main-img img');
document.querySelectorAll('.pd-thumb').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.pd-thumb').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        mainImg.src = btn.querySelector('img').src;
    });
});

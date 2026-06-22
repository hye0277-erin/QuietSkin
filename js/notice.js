/* 공지사항 탭 전환 */
const noticeTabs = document.querySelectorAll('.notice-tab');
const noticePanels = document.querySelectorAll('.notice-panel');
noticeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        noticeTabs.forEach(t => t.classList.remove('active'));
        noticePanels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
    });
});

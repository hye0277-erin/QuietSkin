/* 탭 전환 */
const faTabs = document.querySelectorAll('.fa-tab');
const faPanels = document.querySelectorAll('.fa-panel-body');
faTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        faTabs.forEach(t => t.classList.remove('active'));
        faPanels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
    });
});

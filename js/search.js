/* ── 검색 데이터 ── */
const PRODUCTS = [
    {
        name: '카밍 진정 앰플 30ml',
        desc: '민감 피부를 위한 데일리 진정 앰플',
        hash: '#진정 #수분장벽 #민감피부 #병풀 #히알루론산',
        price: '32,000원',
        img: './images/sec2_img02.jpg',
        badge: 'BEST',
        href: './sub_products_view.html'
    },
    {
        name: '카밍 토너',
        desc: '수분을 가득 채워주는 진정 토너 100ml',
        hash: '#진정 #민감피부 #민감보습 #수분 #히알루론산',
        price: '24,000원',
        img: './images/sec2_img03.jpg',
        href: './sub_products_view.html'
    },
    {
        name: '카밍 폼 클렌저',
        desc: '약산성 저자극 폼 클렌저 150ml',
        hash: '#저자극세안 #약산성 #민감피부',
        price: '20,000원',
        img: './images/sec2_img04.jpg',
        href: './sub_products_view.html'
    },
    {
        name: '카밍 모이스처라이징 크림',
        desc: '피부 장벽을 강화하는 보습 크림 50ml',
        hash: '#장벽강화 #보습지속 #수분크림 #세라마이드',
        price: '28,000원',
        img: './images/sec2_img05.jpg',
        href: './sub_products_view.html'
    },
    {
        name: '카밍 선크림',
        desc: '산뜻하게 마무리되는 데일리 선크림 50ml',
        hash: '#데일리보호 #산뜻마무리 #민감피부',
        price: '28,000원',
        img: './images/product_suncream.png',
        href: './sub_products_view.html'
    },
    {
        name: '진정 루틴 세트',
        desc: '앰플 + 토너 + 크림 구성 루틴 세트',
        hash: '#루틴케어 #세트할인 #진정 #민감피부',
        price: '75,600원',
        original: '94,000원',
        img: './images/product_all.jpg',
        badge: 'SET',
        href: './sub_products_view.html'
    }
];

const CONTENTS = [
    {
        icon: 'auto_stories',
        title: '브랜드 스토리',
        desc: 'QuietSkin이 추구하는 조용한 피부 철학',
        href: './sub_brand_story.html',
        keywords: ['브랜드', '스토리', '철학', 'QuietSkin', '성분', '지속가능']
    },
    {
        icon: 'wb_sunny',
        title: '모닝 루틴',
        desc: '민감한 피부를 위한 아침 스킨케어 루틴',
        href: './sub_morning_routine.html',
        keywords: ['루틴', '아침', '모닝', '스킨케어', '민감', '순서']
    },
    {
        icon: 'photo_camera',
        title: '포토 리뷰',
        desc: '실제 사용자들의 피부 변화 후기',
        href: './sub_photo_reviews.html',
        keywords: ['리뷰', '후기', '사용기', '포토', '민감피부', '진정']
    },
    {
        icon: 'inventory_2',
        title: '전체 상품',
        desc: '피부에 꼭 필요한 것만 담은 전 제품 라인업',
        href: './sub_all_products.html',
        keywords: ['상품', '제품', '전체', '라인업', '구매', '쇼핑']
    }
];

/* ── 검색 실행 ── */
function runSearch(q) {
    const keyword = q.trim().toLowerCase();

    document.getElementById('sr-keyword').textContent = q;
    document.getElementById('sr-input').value = q;
    document.title = `"${q}" 검색 결과 - QuietSkin`;

    /* 제품 필터 */
    const matchedProducts = PRODUCTS.filter(p =>
        [p.name, p.desc, p.hash].join(' ').toLowerCase().includes(keyword)
    );

    /* 콘텐츠 필터 */
    const matchedContents = CONTENTS.filter(c =>
        [c.title, c.desc, ...c.keywords].join(' ').toLowerCase().includes(keyword)
    );

    /* 총 카운트 */
    const total = matchedProducts.length + matchedContents.length;
    document.getElementById('sr-count').textContent =
        total > 0 ? `총 ${total}개의 결과를 찾았습니다.` : '검색 결과가 없습니다.';

    /* 배지 */
    document.getElementById('badge-products').textContent = matchedProducts.length;
    document.getElementById('badge-content').textContent = matchedContents.length;

    /* 제품 렌더 */
    const grid = document.getElementById('product-grid');
    const emptyP = document.getElementById('empty-products');
    if (matchedProducts.length === 0) {
        grid.innerHTML = '';
        emptyP.style.display = '';
    } else {
        emptyP.style.display = 'none';
        grid.innerHTML = matchedProducts.map(p => `
            <div class="product_card">
                <a href="${p.href}">
                    <div class="img_thumb img_reveal_target${p.badge === 'BEST' ? ' unique_badge_best' : p.badge === 'SET' ? ' unique_badge_set' : ''}">
                        <img src="${p.img}" alt="${p.name}">
                        <button type="button" class="btn_cart_add" aria-label="장바구니 담기">
                            <span class="material-icons">add_shopping_cart</span>
                        </button>
                    </div>
                </a>
                <div class="product_info">
                    <strong class="p_name">${p.name}</strong>
                    <span class="p_volume">${p.desc}</span>
                    <span class="p_hash">${p.hash}</span>
                    <div class="p_price_box">
                        <span class="price">${p.price}</span>
                        ${p.original ? `<del class="p_original">${p.original}</del>` : ''}
                    </div>
                    <a href="${p.href}" class="btn_product_detail">자세히 보기 <span class="material-icons">arrow_forward</span></a>
                </div>
            </div>
        `).join('');
    }

    /* 콘텐츠 렌더 */
    const list = document.getElementById('content-list');
    const emptyC = document.getElementById('empty-content');
    if (matchedContents.length === 0) {
        list.innerHTML = '';
        emptyC.style.display = '';
    } else {
        emptyC.style.display = 'none';
        list.innerHTML = matchedContents.map(c => `
            <a class="sr-content-card" href="${c.href}">
                <div class="sr-content-icon">
                    <span class="material-icons">${c.icon}</span>
                </div>
                <div class="sr-content-info">
                    <strong>${c.title}</strong>
                    <span>${c.desc}</span>
                </div>
                <span class="material-icons arrow">chevron_right</span>
            </a>
        `).join('');
    }

    /* 결과 없으면 콘텐츠 탭 자동 활성 */
    if (matchedProducts.length === 0 && matchedContents.length > 0) {
        switchTab('content');
    } else {
        switchTab('products');
    }
}

/* ── 탭 전환 ── */
function switchTab(tabId) {
    document.querySelectorAll('.sr-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.tab === tabId);
    });
    document.querySelectorAll('.sr-panel').forEach(p => {
        p.classList.toggle('active', p.id === 'panel-' + tabId);
    });
}

document.querySelectorAll('.sr-tab').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

/* ── 폼 제출 ── */
document.getElementById('sr-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const q = document.getElementById('sr-input').value.trim();
    if (!q) return;
    const url = new URL(window.location.href);
    url.searchParams.set('q', q);
    history.pushState({}, '', url);
    runSearch(q);
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── URL 파라미터에서 키워드 읽기 ── */
const params = new URLSearchParams(window.location.search);
const q = params.get('q') || '';
if (q) {
    runSearch(q);
} else {
    document.getElementById('sr-title').textContent = '검색어를 입력해보세요';
    document.getElementById('sr-count').textContent = '';
}

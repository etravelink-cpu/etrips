// ============================================================
// list.js - 产品列表页渲染器（改造版）
// ============================================================

// ===== 渲染产品列表 =====
function renderList(products, containerId) {
    const grid = document.getElementById(containerId || 'list-grid');
    if (!grid) return;
    
    const data = products || window.TOURS || [];
    
    if (data.length === 0) {
        grid.innerHTML = `
            <div style="text-align:center;padding:60px 20px;color:#5b6f87;grid-column:1/-1;">
                <p style="font-size:18px;margin-bottom:8px;">📭 暂无产品数据</p>
                <p style="font-size:14px;">请运行 python tools/convert_all.py 生成数据文件</p>
            </div>
        `;
        return;
    }
    
    // 排序：有价格的排前面，邮轮优先
    const sorted = [...data].sort((a, b) => {
        const aHasPrice = a.adult_price && a.adult_price > 0;
        const bHasPrice = b.adult_price && b.adult_price > 0;
        if (aHasPrice && !bHasPrice) return -1;
        if (!aHasPrice && bHasPrice) return 1;
        const aIsCruise = a.name && (a.name.includes('邮轮') || a.name.includes('游轮'));
        const bIsCruise = b.name && (b.name.includes('邮轮') || b.name.includes('游轮'));
        if (aIsCruise && !bIsCruise) return -1;
        if (!aIsCruise && bIsCruise) return 1;
        return 0;
    });
    
    grid.innerHTML = sorted.map(p => `
        <div class="card tour-card" onclick="location.href='detail.html?id=${p.id}'" style="cursor:pointer;border-radius:16px;overflow:hidden;border:1px solid #e8edf4;transition:0.3s;background:#fff;">
            <div class="body" style="padding:18px 20px;">
                <div class="tour-tags" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px;">
                    <span class="tag" style="font-size:11px;padding:2px 12px;border-radius:12px;background:#eef3f9;color:#1a3355;">${p.tour_type || '常规'}</span>
                    <span class="tag" style="font-size:11px;padding:2px 12px;border-radius:12px;background:#eef3f9;color:#1a3355;">${p.duration_days || 0}天</span>
                    ${p.name && (p.name.includes('邮轮') || p.name.includes('游轮')) ? 
                        '<span class="tag" style="font-size:11px;padding:2px 12px;border-radius:12px;background:#1a3a6a;color:#fff;">🚢 邮轮</span>' : ''}
                </div>
                <h3 style="font-size:16px;font-weight:600;color:#0b1a33;margin:4px 0 6px;line-height:1.3;">${p.name || '未命名产品'}</h3>
                <p class="muted" style="font-size:13px;color:#5b6f87;margin-bottom:8px;">📍 ${p.region || '多地'} · ${p.supplier || ''}</p>
                <div class="tour-bottom" style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;padding-top:10px;border-top:1px solid #e8edf4;">
                    <span class="tour-price" style="font-weight:700;color:#2a7de1;font-size:18px;">${p.adult_price ? 'A$' + p.adult_price : '价格待询'} 起</span>
                    <a href="detail.html?id=${p.id}" class="btn btn-outline" style="padding:4px 16px;font-size:12px;border:1px solid #2a7de1;border-radius:20px;color:#2a7de1;text-decoration:none;transition:0.2s;">查看详情</a>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== 筛选功能 =====
function filterList() {
    const products = window.TOURS || [];
    const region = document.getElementById('f-region')?.value || '';
    const days = document.getElementById('f-days')?.value || '';
    const budget = document.getElementById('f-budget')?.value || '';
    
    let filtered = [...products];
    
    if (region) {
        filtered = filtered.filter(p => p.region === region);
    }
    
    if (days) {
        if (days === 's') filtered = filtered.filter(p => (p.duration_days || 0) <= 7);
        else if (days === 'm') filtered = filtered.filter(p => (p.duration_days || 0) >= 8 && (p.duration_days || 0) <= 10);
        else if (days === 'l') filtered = filtered.filter(p => (p.duration_days || 0) >= 11);
    }
    
    if (budget) {
        if (budget === 'low') filtered = filtered.filter(p => (p.adult_price || 0) < 500);
        else if (budget === 'medium') filtered = filtered.filter(p => (p.adult_price || 0) >= 500 && (p.adult_price || 0) < 1500);
        else if (budget === 'high') filtered = filtered.filter(p => (p.adult_price || 0) >= 1500);
    }
    
    renderList(filtered);
}

// ===== 初始化列表页 =====
function initList() {
    const products = window.TOURS || [];
    
    // 检查是否有区域筛选参数
    const params = new URLSearchParams(window.location.search);
    const region = params.get('region');
    const d = params.get('d');
    
    let filtered = products;
    
    if (region) {
        filtered = products.filter(p => p.region === region);
    } else if (d) {
        // 按目的地分类筛选（兼容原有 ?d= 参数）
        const dMap = {
            'china': ['中国', '江南', '北京', '西安', '九寨沟', '张家界', '云南', '广东', '新疆', '西藏', '青海', '甘肃', '长江三峡', '山东', '山西', '东北', '河南', '重庆', '贵州'],
            'australia': ['澳洲', '悉尼', '墨尔本', '黄金海岸', '凯恩斯', '珀斯', '塔斯马尼亚', '阿德莱德', '乌鲁鲁'],
            'newzealand': ['新西兰', '奥克兰', '皇后镇', '基督城', '罗托鲁瓦'],
            'asia': ['亚洲', '日本', '韩国', '台湾', '泰国', '越南', '新加坡', '马来西亚'],
            'europe': ['欧洲'],
            'usa': ['美加', '美国', '加拿大'],
            'cruise': ['邮轮']
        };
        const keywords = dMap[d] || [];
        if (keywords.length > 0) {
            filtered = products.filter(p => {
                const regionName = p.region || '';
                return keywords.some(k => regionName.includes(k));
            });
        }
    }
    
    renderList(filtered);
    
    // 绑定筛选事件
    document.getElementById('f-region')?.addEventListener('change', filterList);
    document.getElementById('f-days')?.addEventListener('change', filterList);
    document.getElementById('f-budget')?.addEventListener('change', filterList);
}

// ===== 监听数据就绪事件 =====
document.addEventListener('data-ready', function(e) {
    window.TOURS = e.detail.products || [];
    initList();
    console.log('📋 列表页已渲染，共', window.TOURS.length, '个产品');
});

// ===== DOM 加载完成后初始化 =====
document.addEventListener('DOMContentLoaded', function() {
    if (window.TOURS && window.TOURS.length > 0) {
        initList();
    } else {
        console.log('⏳ 等待数据加载...');
    }
});

console.log('📋 list.js 已加载');

// ============================================================
// 返回功能
// ============================================================

function goBack() {
    // 如果有历史记录，返回上一页
    if (document.referrer && document.referrer.includes(window.location.host)) {
        window.history.back();
    } else {
        // 否则跳转到首页
        window.location.href = 'index.html';
    }
}

// 如果页面中有 .back-btn 元素，绑定点击事件
document.addEventListener('DOMContentLoaded', function() {
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function(e) {
            e.preventDefault();
            goBack();
        });
    }
});


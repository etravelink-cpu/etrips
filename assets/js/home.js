// ============================================================
// home.js - 首页完整渲染（修复版）
// ============================================================

// ===== 渲染热门产品（只取前6个） =====
function renderHotItems(products) {
    const grid = document.getElementById('hot-grid');
    if (!grid) return;
    
    // 只取前6个产品，并且过滤掉没有价格或没有名称的无效数据
    const validProducts = (products || window.TOURS || [])
        .filter(p => p.name && p.name.length > 0)
        .slice(0, 6);
    
    if (validProducts.length === 0) {
        grid.innerHTML = `
            <div style="text-align:center;padding:40px 20px;color:#5b6f87;grid-column:1/-1;">
                <p>暂无热门产品，请稍后访问</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = validProducts.map(p => `
        <div class="card tour-card" onclick="location.href='detail.html?id=${p.id}'" style="cursor:pointer;border-radius:16px;overflow:hidden;border:1px solid #e8edf4;transition:0.3s;background:#fff;">
            <div class="body" style="padding:18px 20px;">
                <div class="tour-tags" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px;">
                    <span class="tag" style="font-size:11px;padding:2px 12px;border-radius:12px;background:#eef3f9;color:#1a3355;">${p.tour_type || '常规'}</span>
                    <span class="tag" style="font-size:11px;padding:2px 12px;border-radius:12px;background:#eef3f9;color:#1a3355;">${p.duration_days || 0}天</span>
                    ${p.name && (p.name.includes('邮轮') || p.name.includes('游轮')) ? 
                        '<span class="tag" style="font-size:11px;padding:2px 12px;border-radius:12px;background:#1a3a6a;color:#fff;">🚢 邮轮</span>' : ''}
                </div>
                <h3 style="font-size:15px;font-weight:600;color:#0b1a33;margin:4px 0 6px;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${p.name || '未命名产品'}</h3>
                <p class="muted" style="font-size:13px;color:#5b6f87;margin-bottom:8px;">📍 ${p.region || '多地'} · ${p.supplier || ''}</p>
                <div class="tour-bottom" style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;padding-top:10px;border-top:1px solid #e8edf4;">
                    <span class="tour-price" style="font-weight:700;color:#2a7de1;font-size:17px;">${p.adult_price ? 'A$' + p.adult_price : '价格待询'} 起</span>
                    <a href="detail.html?id=${p.id}" class="btn btn-outline" style="padding:4px 16px;font-size:12px;border:1px solid #2a7de1;border-radius:20px;color:#2a7de1;text-decoration:none;transition:0.2s;" onmouseover="this.style.background='#2a7de1';this.style.color='#fff';" onmouseout="this.style.background='transparent';this.style.color='#2a7de1';">查看详情</a>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== 渲染目的地板块 =====
function renderDestinations(products) {
    const grid = document.getElementById('biz-grid');
    if (!grid) return;
    
    // 从产品中提取所有区域
    const regionMap = {};
    (products || window.TOURS || []).forEach(p => {
        if (p.region) {
            regionMap[p.region] = (regionMap[p.region] || 0) + 1;
        }
    });
    
    // 按产品数量排序，取前8个
    const sortedRegions = Object.entries(regionMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([name]) => name);
    
    const iconMap = {
        '中国': '🏯', '澳洲': '🦘', '新西兰': '🌿', '亚洲': '🌸',
        '欧洲': '🏛️', '美加': '🗽', '邮轮': '🚢', '江南': '🌸',
        '北京': '🏯', '云南': '🌸', '新疆': '🏜️', '西藏': '⛰️',
        '广东': '🥘', '桂林': '🏞️', '厦门': '🌊', '海南': '🏖️',
        '九寨沟': '🏔️', '张家界': '⛰️', '西安': '🏯', '长江三峡': '🌊',
        '山东': '⛰️', '山西': '⛰️', '东北': '❄️', '河南': '🏯',
        '重庆': '🏙️', '贵州': '⛰️', '日本': '🌸', '韩国': '🌸',
        '台湾': '🌸', '泰国': '🌴', '越南': '🌴', '新加坡': '🌴',
        '马来西亚': '🌴', '柬埔寨': '🏯', '悉尼': '🌊', '墨尔本': '🌊',
        '黄金海岸': '🏖️', '凯恩斯': '🏝️', '珀斯': '🌅', '塔斯马尼亚': '🌿',
        '阿德莱德': '🍷', '乌鲁鲁': '🏜️', '新西兰多地联动': '🌿'
    };
    
    if (sortedRegions.length === 0) {
        grid.innerHTML = '';
        return;
    }
    
    grid.innerHTML = sortedRegions.map(name => `
        <a href="list.html?region=${encodeURIComponent(name)}" class="biz-card" style="display:block;text-align:center;padding:20px 16px;background:#fff;border-radius:16px;border:1px solid #e8edf4;text-decoration:none;transition:0.3s;cursor:pointer;">
            <span class="biz-icon" style="font-size:36px;display:block;margin-bottom:8px;">${iconMap[name] || '🌍'}</span>
            <div class="biz-name" style="font-weight:600;color:#0b1a33;font-size:16px;">${name}</div>
            <div class="biz-name-en" style="font-size:12px;color:#5b6f87;margin-top:2px;">${name}</div>
        </a>
    `).join('');
}

// ===== 渲染优势板块 =====
function renderAdvantages() {
    const grid = document.getElementById('adv-grid');
    if (!grid) return;
    
    const data = window.ADVANTAGES || [
        { title: '澳洲本地正规注册旅行社，资质可查', desc: '悉尼出发，正规持牌' },
        { title: '全程中文领队，中英双语服务', desc: '适配本地居民与华人' },
        { title: '精品小团+私家定制，节奏舒适无购物', desc: '拒绝走马观花' },
        { title: '机票+酒店+接送+门票一站式全包', desc: '省心出行' }
    ];
    
    grid.innerHTML = data.map((a, i) => `
        <div class="card" style="text-align:center;padding:24px 20px;background:#fff;border-radius:16px;border:1px solid #e8edf4;">
            <div class="body">
                <div style="font-size:28px;font-weight:700;color:#2a7de1;margin-bottom:8px;">${String(i+1).padStart(2, '0')}</div>
                <h3 style="font-size:16px;color:#0b1a33;margin-bottom:4px;">${a.title}</h3>
                <p style="font-size:13px;color:#5b6f87;">${a.desc}</p>
            </div>
        </div>
    `).join('');
}

// ===== 渲染评价板块 =====
function renderReviews() {
    const grid = document.getElementById('review-grid');
    if (!grid) return;
    
    const data = window.REVIEWS || [
        { name: '王女士（悉尼）', text: '中文领队太贴心，全程无购物，老人孩子都轻松。', stars: 5 },
        { name: '张先生（布里斯班）', text: '带爸妈去悉尼蓝山和黄金海岸，司机在机场举牌等我们。', stars: 5 },
        { name: '李先生（墨尔本）', text: '新西兰蜜月安排得超浪漫，星空那晚终生难忘。', stars: 5 }
    ];
    
    grid.innerHTML = data.map(r => `
        <div class="rev-item" style="min-width:240px;flex:0 0 auto;padding:20px;background:#fff;border-radius:16px;border:1px solid #e8edf4;margin-right:16px;">
            <div style="color:#f5a623;font-size:16px;margin-bottom:6px;">${'★'.repeat(r.stars || 5)}</div>
            <p style="font-size:14px;color:#1a3355;line-height:1.6;">${r.text}</p>
            <p style="font-size:13px;color:#5b6f87;margin-top:8px;font-weight:600;">— ${r.name}</p>
        </div>
    `).join('');
}

// ===== 渲染出行小贴士 =====
function renderTips() {
    const grid = document.getElementById('tips-grid');
    if (!grid) return;
    
    const data = window.DESTINATIONS || [
        { title: '澳洲入境需提前填好 DPD 数字旅客声明', icon: '📋' },
        { title: '新西兰自驾需国际驾照，靠左行驶', icon: '🚗' },
        { title: '中国长线建议提前办理签证与疫苗', icon: '🛂' },
        { title: '海岛游注意防晒与浮潜安全', icon: '🏖️' }
    ];
    
    grid.innerHTML = data.map(t => `
        <div class="card" style="padding:16px 20px;background:#f8fafc;border-radius:12px;border:1px solid #e8edf4;">
            <div class="body">
                <span style="font-size:20px;margin-right:10px;">${t.icon || '📌'}</span>
                <span style="font-size:14px;color:#1a3355;">${t.title}</span>
            </div>
        </div>
    `).join('');
}

// ===== 初始化首页 =====
function initHome() {
    const products = window.TOURS || [];
    console.log('🏠 初始化首页，产品数:', products.length);
    
    renderHotItems(products);
    renderDestinations(products);
    renderAdvantages();
    renderReviews();
    renderTips();
}

// ===== 监听数据就绪事件 =====
document.addEventListener('data-ready', function(e) {
    const products = e.detail.products || [];
    window.TOURS = products;
    initHome();
    console.log('✅ 首页渲染完成，共', products.length, '个产品');
});

// ===== DOM 加载完成后初始化 =====
document.addEventListener('DOMContentLoaded', function() {
    if (window.TOURS && window.TOURS.length > 0) {
        initHome();
    } else {
        console.log('⏳ 等待数据加载...');
    }
});

console.log('🏠 home.js (完整版) 已加载');
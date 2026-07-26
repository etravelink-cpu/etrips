// ============================================================
// detail.js - 产品详情页（完整修复版，含Tab切换）
// ============================================================

// ===== 获取产品数据 =====
function getProduct(id) {
    const products = window.TOURS || [];
    return products.find(p => p.id === id);
}

// ===== 渲染行程面板 =====
function renderItinerary(product) {
    const panel = document.getElementById('panel-itinerary');
    if (!panel) return;
    
    if (product.itinerary && product.itinerary.length > 0) {
        panel.innerHTML = `
            <div class="itinerary" style="display:flex;flex-direction:column;gap:12px;">
                ${product.itinerary.map(d => `
                    <div class="day-block" style="display:flex;gap:16px;padding:14px 20px;background:#f8fafc;border-radius:12px;border-left:4px solid #2a7de1;border:1px solid #e8edf4;border-left-width:4px;">
                        <span class="day-label" style="font-weight:700;color:#2a7de1;min-width:60px;font-size:14px;">Day ${d.day}</span>
                        <div>
                            <strong style="color:#0b1a33;font-size:15px;">${d.title}</strong>
                            <p style="font-size:14px;color:#2c3e5c;margin-top:4px;line-height:1.6;">${d.description || ''}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        return;
    }
    
    panel.innerHTML = `
        <div style="padding:8px 0;">
            <div style="background:#f8fafc;border-radius:12px;padding:20px;border:1px solid #e8edf4;margin-bottom:12px;">
                <h4 style="color:#0b1a33;margin-bottom:8px;">📋 行程概览</h4>
                <ul style="list-style:none;padding:0;margin:0;">
                    <li style="padding:6px 0;border-bottom:1px solid #eef3f9;font-size:14px;color:#2c3e5c;">
                        <span style="font-weight:600;">📍 目的地：</span> ${product.region || '待确认'}
                    </li>
                    <li style="padding:6px 0;border-bottom:1px solid #eef3f9;font-size:14px;color:#2c3e5c;">
                        <span style="font-weight:600;">📅 行程天数：</span> ${product.duration_days || 0} 天
                    </li>
                    <li style="padding:6px 0;border-bottom:1px solid #eef3f9;font-size:14px;color:#2c3e5c;">
                        <span style="font-weight:600;">🏷️ 团型：</span> ${product.tour_type || '常规'}
                    </li>
                    <li style="padding:6px 0;font-size:14px;color:#2c3e5c;">
                        <span style="font-weight:600;">🏢 供应商：</span> ${product.supplier || '待确认'}
                    </li>
                </ul>
            </div>
            <div style="background:#fef3e2;border-radius:12px;padding:16px 20px;border:1px solid #fde8c8;">
                <p style="font-size:14px;color:#b46f1e;margin:0;">💡 详细行程请咨询客服获取</p>
            </div>
        </div>
    `;
}

// ===== 渲染住宿面板 =====
function renderHotel(product) {
    const panel = document.getElementById('panel-hotel');
    if (!panel) return;
    panel.innerHTML = `
        <div style="padding:16px 0;">
            <p style="font-size:14px;color:#2c3e5c;">🏨 住宿安排请咨询客服获取详细信息</p>
            <p style="font-size:13px;color:#5b6f87;margin-top:8px;">${product.supplier ? '供应商：' + product.supplier : ''}</p>
        </div>
    `;
}

// ===== 渲染额外信息面板 =====
function renderExtra(product) {
    const panel = document.getElementById('panel-extra');
    if (!panel) return;
    panel.innerHTML = `
        <div style="padding:16px 0;">
            <p style="font-size:14px;color:#2c3e5c;">📋 额外信息</p>
            <ul style="font-size:13px;color:#5b6f87;margin-top:8px;list-style:none;padding:0;">
                <li style="padding:4px 0;">🏷️ 产品编号：${product.id || '-'}</li>
                <li style="padding:4px 0;">🏢 供应商：${product.supplier || '-'}</li>
                <li style="padding:4px 0;">📍 区域：${product.region || '-'}</li>
                <li style="padding:4px 0;">📅 天数：${product.duration_days || 0} 天</li>
                ${product.adult_price ? `<li style="padding:4px 0;">💰 成人价：A$ ${product.adult_price}</li>` : ''}
                ${product.child_price ? `<li style="padding:4px 0;">🧒 儿童价：A$ ${product.child_price}</li>` : ''}
                ${product.single_supplement ? `<li style="padding:4px 0;">🛏 单间差：A$ ${product.single_supplement}</li>` : ''}
            </ul>
            <p style="font-size:13px;color:#5b6f87;margin-top:12px;padding-top:12px;border-top:1px solid #e8edf4;">💡 以上信息仅供参考，详情请咨询客服</p>
        </div>
    `;
}

// ===== 渲染退改政策面板 =====
function renderCancel() {
    const panel = document.getElementById('panel-cancel');
    if (!panel) return;
    panel.innerHTML = `
        <div style="padding:16px 0;">
            <p style="font-size:14px;color:#2c3e5c;">📋 退改政策</p>
            <ul style="font-size:13px;color:#5b6f87;margin-top:8px;list-style:none;padding:0;">
                <li style="padding:4px 0;">• 出发前 30 天以上取消：扣除 10% 手续费</li>
                <li style="padding:4px 0;">• 出发前 15-29 天取消：扣除 30% 团费</li>
                <li style="padding:4px 0;">• 出发前 7-14 天取消：扣除 50% 团费</li>
                <li style="padding:4px 0;">• 出发前 7 天内取消：扣除 100% 团费</li>
                <li style="padding:4px 0;margin-top:8px;font-size:12px;color:#b33a3a;">⚠️ 具体退改政策以确认单为准</li>
            </ul>
        </div>
    `;
}

// ===== 渲染产品详情 =====
function renderDetail(product) {
    if (!product) {
        const head = document.getElementById('detail-head');
        if (head) head.innerHTML = `
            <div style="text-align:center;padding:40px 0;">
                <p style="font-size:18px;color:#5b6f87;">⚠️ 产品未找到</p>
                <p style="font-size:14px;color:#5b6f87;">请检查产品 ID 是否正确</p>
                <a href="list.html" style="color:#2a7de1;font-size:14px;">返回列表页</a>
            </div>
        `;
        return;
    }
    
    // ---- 头部信息 ----
    const head = document.getElementById('detail-head');
    if (head) {
        head.innerHTML = `
            <h1 style="font-size:28px;font-weight:700;color:#0b1a33;margin-bottom:8px;">${product.name || '未命名产品'}</h1>
            <div class="detail-meta" style="display:flex;flex-wrap:wrap;gap:16px 28px;font-size:14px;color:#5b6f87;margin-bottom:10px;">
                <span>📍 ${product.region || '多地'}</span>
                <span>📅 ${product.duration_days || 0} 天</span>
                <span>💰 ${product.adult_price ? 'A$' + product.adult_price : '价格待询'}</span>
                <span>🏢 ${product.supplier || ''}</span>
            </div>
            <div class="detail-tags" style="display:flex;gap:8px;flex-wrap:wrap;">
                <span class="tag" style="padding:4px 16px;border-radius:20px;background:#eef3f9;color:#1a3355;font-size:13px;">${product.tour_type || '常规'}</span>
                ${product.region ? `<span class="tag" style="padding:4px 16px;border-radius:20px;background:#eef3f9;color:#1a3355;font-size:13px;">📍 ${product.region}</span>` : ''}
                ${product.adult_price ? `<span class="tag" style="padding:4px 16px;border-radius:20px;background:#e3f5ec;color:#0f7b4a;font-size:13px;">A$ ${product.adult_price}</span>` : ''}
            </div>
        `;
    }
    
    // ---- 渲染所有面板 ----
    renderItinerary(product);
    renderHotel(product);
    renderExtra(product);
    renderCancel();
}

// ===== Tab 切换功能 =====
function initTabs() {
    const tabButtons = document.querySelectorAll('#tabs .tab-btn, #tabs button');
    const tabPanels = {
        'itinerary': document.getElementById('panel-itinerary'),
        'hotel': document.getElementById('panel-hotel'),
        'extra': document.getElementById('panel-extra'),
        'cancel': document.getElementById('panel-cancel')
    };
    
    if (tabButtons.length === 0) {
        console.warn('⚠️ 没有找到 Tab 按钮');
        return;
    }
    
    // 隐藏所有面板
    function hideAllPanels() {
        Object.keys(tabPanels).forEach(key => {
            if (tabPanels[key]) {
                tabPanels[key].style.display = 'none';
            }
        });
        tabButtons.forEach(btn => btn.classList.remove('active'));
    }
    
    // 显示指定面板
    function showPanel(tabId) {
        hideAllPanels();
        if (tabPanels[tabId]) {
            tabPanels[tabId].style.display = 'block';
        }
        tabButtons.forEach(btn => {
            if (btn.dataset.tab === tabId) {
                btn.classList.add('active');
            }
        });
    }
    
    // 绑定点击事件
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.dataset.tab;
            if (tabId) {
                showPanel(tabId);
                console.log('🔘 切换到 Tab:', tabId);
            }
        });
    });
    
    // 默认显示第一个 Tab（行程）
    const firstTab = tabButtons.length > 0 ? tabButtons[0].dataset.tab : 'itinerary';
    showPanel(firstTab);
    console.log('✅ Tab 切换已初始化，默认显示:', firstTab);
}

// ===== 初始化详情页 =====
function initDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    
    if (!id) {
        const head = document.getElementById('detail-head');
        if (head) head.innerHTML = `
            <div style="text-align:center;padding:40px 0;">
                <p style="font-size:18px;color:#5b6f87;">⚠️ 请指定产品 ID</p>
                <p style="font-size:14px;color:#5b6f87;">使用 ?id=产品编号 参数访问产品详情</p>
                <a href="list.html" style="color:#2a7de1;font-size:14px;">返回列表页</a>
            </div>
        `;
        return;
    }
    
    const product = getProduct(id);
    renderDetail(product);
    
    // 渲染完成后初始化 Tab
    setTimeout(initTabs, 50);
}

// ===== 监听数据就绪事件 =====
document.addEventListener('data-ready', function(e) {
    window.TOURS = e.detail.products || [];
    initDetail();
    console.log('📄 详情页已初始化，产品ID:', new URLSearchParams(window.location.search).get('id'));
});

// ===== DOM 加载完成后初始化 =====
document.addEventListener('DOMContentLoaded', function() {
    if (window.TOURS && window.TOURS.length > 0) {
        initDetail();
    } else {
        console.log('⏳ 等待数据加载...');
    }
});

console.log('📄 detail.js (完整修复版) 已加载');
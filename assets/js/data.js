// ============================================================
// data.js - 从 JSON 加载数据（改造版）
// ============================================================

// 缓存变量
let TOURS = [];
let DEPARTURES = [];
let REVIEWS = [];
let ADVANTAGES = [];
let BIZ_ITEMS = [];
let HOT_ITEMS = [];
let DESTINATIONS = [];

// 备用数据（当 JSON 加载失败时使用）
const FALLBACK_TOURS = [
    { id: 'FTJN7', name: '2026 水韵江南·美景美食7日游', tour_type: '超值特价团', region: '江南', duration_days: 7, adult_price: 599, supplier: '趣旅游' },
    { id: 'FTBJ5', name: '2026 圆梦北京轻松5天', tour_type: '超值特价团', region: '北京', duration_days: 5, adult_price: 169, supplier: '趣旅游' },
    { id: 'FTJNNS6', name: '2026 纯玩水韵江南逍遥6天', tour_type: '纯玩无购物团', region: '江南', duration_days: 6, adult_price: 999, supplier: '趣旅游' },
    { id: 'CM-0001', name: '2026 铂金江南，穿越胡杨林喀什南疆秘境14日', tour_type: '超值特价团', region: '江南', duration_days: 14, adult_price: 1298, supplier: '中国美' }
];

// 从 JSON 加载数据
async function loadDataFromJSON() {
    try {
        const response = await fetch('/data/products.json');
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const products = await response.json();
        
        console.log('✅ 成功加载产品数据:', products.length, '个产品');
        
        // 赋值给 TOURS
        TOURS = products;
        
        // 生成 DEPARTURES
        DEPARTURES = products
            .filter(p => p.departure_date)
            .map(p => ({
                id: p.id,
                date: p.departure_date || '2026-08-15',
                seats: p.seats || 10,
                price: p.adult_price ? 'A$' + p.adult_price : 'A$0'
            }));
        
        if (DEPARTURES.length === 0) {
            DEPARTURES = products.slice(0, 6).map(p => ({
                id: p.id,
                date: '2026-08-15',
                seats: Math.floor(Math.random() * 15) + 5,
                price: p.adult_price ? 'A$' + p.adult_price : 'A$0'
            }));
        }
        
        // 更新全局变量
        window.TOURS = TOURS;
        window.DEPARTURES = DEPARTURES;
        
        // 触发数据就绪事件
        document.dispatchEvent(new CustomEvent('data-ready', { detail: { products } }));
        
        return products;
    } catch (error) {
        console.warn('⚠️ 加载 products.json 失败，使用备用数据', error);
        TOURS = FALLBACK_TOURS;
        window.TOURS = TOURS;
        document.dispatchEvent(new CustomEvent('data-ready', { detail: { products: TOURS } }));
        return TOURS;
    }
}

// ============================================================
// 站点配置数据（与产品数据分开，保持硬编码）
// ============================================================

// 优势列表
ADVANTAGES = [
    { title: '澳洲本地正规注册旅行社，资质可查', desc: '悉尼出发，正规持牌' },
    { title: '全程中文领队，中英双语服务', desc: '适配本地居民与华人' },
    { title: '精品小团 + 私家定制，节奏舒适无购物', desc: '拒绝走马观花' },
    { title: '机票+酒店+接送+门票一站式全包', desc: '省心出行' }
];

// 客户评价
REVIEWS = [
    { name: '王女士（悉尼）', text: '中文领队太贴心，全程无购物，老人孩子都轻松。', stars: 5 },
    { name: '张先生（布里斯班）', text: '带爸妈去悉尼蓝山和黄金海岸，司机在机场举牌等我们，行李都帮忙搬上车。', stars: 5 },
    { name: '李先生（墨尔本）', text: '新西兰蜜月安排得超浪漫，星空那晚终生难忘。', stars: 5 },
    { name: '周小姐（车士活）', text: '云南大理丽江七日团只有十二个人，导游带我们去了本地人开的米线店。', stars: 5 }
];

// 目的地列表
BIZ_ITEMS = [
    { name: '澳洲', nameEn: 'AUSTRALIA', icon: '🦘', link: 'list.html?d=australia' },
    { name: '新西兰', nameEn: 'NEW ZEALAND', icon: '🌿', link: 'list.html?d=newzealand' },
    { name: '中国', nameEn: 'CHINA', icon: '🏯', link: 'list.html?d=china' },
    { name: '亚洲', nameEn: 'ASIA', icon: '🌸', link: 'list.html?d=asia' },
    { name: '欧洲', nameEn: 'EUROPE', icon: '🏛️', link: 'list.html?d=europe' },
    { name: '邮轮', nameEn: 'CRUISE', icon: '🚢', link: 'list.html?d=cruise' },
    { name: '美加', nameEn: 'USA & CANADA', icon: '🗽', link: 'list.html?d=usa' },
    { name: '特别订制', nameEn: 'TAILOR-MADE', icon: '✨', link: 'custom.html' }
];

// 出行小贴士
DESTINATIONS = [
    { title: '澳洲入境需提前填好 DPD 数字旅客声明', icon: '📋' },
    { title: '新西兰自驾需国际驾照，靠左行驶', icon: '🚗' },
    { title: '中国长线建议提前办理签证与疫苗', icon: '🛂' },
    { title: '海岛游注意防晒与浮潜安全', icon: '🏖️' }
];

// 导出到全局
window.TOURS = TOURS;
window.DEPARTURES = DEPARTURES;
window.REVIEWS = REVIEWS;
window.ADVANTAGES = ADVANTAGES;
window.BIZ_ITEMS = BIZ_ITEMS;
window.HOT_ITEMS = HOT_ITEMS;
window.DESTINATIONS = DESTINATIONS;

// 页面加载时自动加载数据
document.addEventListener('DOMContentLoaded', function() {
    loadDataFromJSON();
});

console.log('📦 data.js 已加载，等待数据就绪...');
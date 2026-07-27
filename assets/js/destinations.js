// ============================================================
// destinations.js - 统一目的地配置
// ============================================================

var CORE_DESTINATIONS = [
    { id: 'australia', name: '澳洲', nameEn: 'AUSTRALIA', icon: '🦘', link: 'list.html?d=australia' },
    { id: 'newzealand', name: '新西兰', nameEn: 'NEW ZEALAND', icon: '🌿', link: 'list.html?d=newzealand' },
    { id: 'china', name: '中国', nameEn: 'CHINA', icon: '🏯', link: 'list.html?d=china' },
    { id: 'asia', name: '亚洲', nameEn: 'ASIA', icon: '🌸', link: 'list.html?d=asia' },
    { id: 'europe', name: '欧洲', nameEn: 'EUROPE', icon: '🏛️', link: 'list.html?d=europe' },
    { id: 'cruise', name: '邮轮', nameEn: 'CRUISE', icon: '🚢', link: 'list.html?d=cruise' },
    { id: 'usa', name: '美加', nameEn: 'USA & CANADA', icon: '🗽', link: 'list.html?d=usa' },
    { id: 'custom', name: '特别订制', nameEn: 'TAILOR-MADE', icon: '✨', link: 'custom.html' }
];

// 导出到全局
window.CORE_DESTINATIONS = CORE_DESTINATIONS;

console.log('✅ destinations.js 已加载，共', CORE_DESTINATIONS.length, '个核心目的地');
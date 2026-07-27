// ============================================================
// site.js - 站点通用功能（导航、页脚、搜索等）
// ============================================================

(function() {
    'use strict';

    // ============================================================
    // 1. 导航渲染
    // ============================================================

    function renderNav() {
        const header = document.getElementById('site-header');
        if (!header) return;

        // 从统一配置获取目的地
        const destinations = window.CORE_DESTINATIONS || [];

        header.innerHTML = `
            <div class="nav-container">
                <div class="nav-left">
                    <a href="index.html" class="logo">
                        <img src="assets/img/logo.png" alt="Etrips 易游" class="logo-img">
                        <span class="logo-text">E<strong>trips</strong> 易游</span>
                    </a>
                </div>

                <!-- 主导航链接 -->
                <nav class="nav-links" id="navLinks">
                    <a href="index.html" class="nav-link active">首页</a>
                    <a href="list.html?d=australia" class="nav-link">澳洲</a>
                    <a href="list.html?d=newzealand" class="nav-link">新西兰</a>
                    <a href="list.html?d=china" class="nav-link">中国</a>
                    <a href="list.html?d=asia" class="nav-link">亚洲</a>
                    <a href="list.html?d=europe" class="nav-link">欧洲</a>
                    <a href="list.html?d=cruise" class="nav-link">邮轮 <span class="badge-new">NEW</span></a>
                    <a href="list.html?d=usa" class="nav-link">美加</a>
                    <a href="custom.html" class="nav-link special">私人订制</a>
                </nav>

                <!-- 右侧：搜索 + 语言切换 -->
                <div class="nav-right">
                    <div class="search-box" id="searchBox">
                        <input type="text" id="searchInput" placeholder="搜索目的地、线路..." aria-label="搜索">
                        <button id="searchBtn" aria-label="执行搜索">🔍</button>
                        <div class="search-dropdown" id="searchDropdown"></div>
                    </div>
                    <div class="lang-switch">
                        <span class="lang-active" id="langToggle">中文</span>
                        <span class="lang-divider">|</span>
                        <span class="lang-option" data-lang="en">EN</span>
                    </div>
                </div>

                <!-- 移动端汉堡菜单 -->
                <button class="hamburger" id="hamburger" aria-label="菜单">
                    <span></span><span></span><span></span>
                </button>
            </div>

            <!-- 移动端下拉菜单 -->
            <div class="mobile-menu" id="mobileMenu">
                <a href="index.html">首页</a>
                <a href="list.html?d=australia">澳洲</a>
                <a href="list.html?d=newzealand">新西兰</a>
                <a href="list.html?d=china">中国</a>
                <a href="list.html?d=asia">亚洲</a>
                <a href="list.html?d=europe">欧洲</a>
                <a href="list.html?d=cruise">邮轮 <span class="badge-new">NEW</span></a>
                <a href="list.html?d=usa">美加</a>
                <a href="custom.html" class="special">私人订制</a>
                <div class="mobile-divider"></div>
                <a href="about.html">关于我们</a>
                <a href="contact.html">联系我们</a>
                <a href="faq.html">常见问题</a>
                <a href="departures.html">团期价格</a>
            </div>
        `;

        // ============================================================
        // 2. 绑定事件
        // ============================================================

        // 2.1 移动端菜单切换
        const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobileMenu');
        if (hamburger && mobileMenu) {
            hamburger.addEventListener('click', function() {
                this.classList.toggle('active');
                mobileMenu.classList.toggle('open');
                document.body.classList.toggle('menu-open');
            });
            // 点击菜单项关闭
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', function() {
                    hamburger.classList.remove('active');
                    mobileMenu.classList.remove('open');
                    document.body.classList.remove('menu-open');
                });
            });
        }

        // 2.2 搜索功能
        initSearch();

        // 2.3 语言切换
        initLangSwitch();

        // 2.4 高亮当前页面
        highlightCurrentPage();

        // 2.5 渲染搜索下拉建议
        renderSearchSuggestions();
    }

    // ============================================================
    // 3. 搜索功能
    // ============================================================

    function initSearch() {
        const input = document.getElementById('searchInput');
        const btn = document.getElementById('searchBtn');
        const dropdown = document.getElementById('searchDropdown');

        if (!input || !btn) return;

        function doSearch() {
            const keyword = input.value.trim();
            if (!keyword) {
                dropdown.classList.remove('show');
                return;
            }
            // 跳转到列表页并带上搜索参数
            window.location.href = 'list.html?q=' + encodeURIComponent(keyword);
        }

        btn.addEventListener('click', doSearch);
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') doSearch();
        });

        // 搜索建议（输入时显示目的地建议）
        input.addEventListener('input', function() {
            const val = this.value.trim().toLowerCase();
            if (!val) {
                dropdown.classList.remove('show');
                return;
            }
            renderSearchSuggestions(val);
            dropdown.classList.add('show');
        });

        // 点击外部关闭下拉
        document.addEventListener('click', function(e) {
            const box = document.getElementById('searchBox');
            if (box && !box.contains(e.target)) {
                if (dropdown) dropdown.classList.remove('show');
            }
        });
    }

    // ============================================================
    // 4. 搜索下拉建议（使用统一目的地配置）
    // ============================================================

    function renderSearchSuggestions(keyword) {
        const dropdown = document.getElementById('searchDropdown');
        if (!dropdown) return;

        const destinations = window.CORE_DESTINATIONS || [];
        let items = destinations;

        if (keyword) {
            const kw = keyword.toLowerCase();
            items = destinations.filter(d =>
                d.name.includes(kw) ||
                d.nameEn.toLowerCase().includes(kw) ||
                d.id.includes(kw)
            );
        }

        if (items.length === 0) {
            dropdown.innerHTML = `
                <div class="search-empty">没有找到匹配的目的地</div>
            `;
            return;
        }

        dropdown.innerHTML = items.map(item => `
            <a href="${item.link}" class="search-item">
                <span class="icon">${item.icon}</span>
                <span class="name">${item.name}</span>
                <span class="en">${item.nameEn}</span>
            </a>
        `).join('');
    }

    // ============================================================
    // 5. 语言切换（预留）
    // ============================================================

    function initLangSwitch() {
        const toggle = document.getElementById('langToggle');
        const options = document.querySelectorAll('.lang-option');
        if (!toggle) return;

        // 从 localStorage 读取语言
        let currentLang = localStorage.getItem('etrips_lang') || 'zh';

        function setLang(lang) {
            currentLang = lang;
            localStorage.setItem('etrips_lang', lang);
            toggle.textContent = lang === 'zh' ? '中文' : 'EN';
            document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
            // 触发自定义事件，通知其他模块
            document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
        }

        // 点击语言选项
        options.forEach(opt => {
            opt.addEventListener('click', function() {
                const lang = this.dataset.lang;
                setLang(lang);
            });
        });

        // 点击当前语言切换
        toggle.addEventListener('click', function() {
            const nextLang = currentLang === 'zh' ? 'en' : 'zh';
            setLang(nextLang);
        });

        // 初始化
        setLang(currentLang);
    }

    // ============================================================
    // 6. 高亮当前页面
    // ============================================================

    function highlightCurrentPage() {
        const current = window.location.pathname.split('/').pop() || 'index.html';
        const links = document.querySelectorAll('.nav-links .nav-link, .mobile-menu a:not(.special)');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href === current) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // ============================================================
    // 7. 页脚渲染
    // ============================================================

    function renderFooter() {
        const footer = document.getElementById('site-footer');
        if (!footer) return;

        footer.innerHTML = `
            <div class="footer-container">
                <div class="footer-col">
                    <h4>E<strong>trips</strong> 易游</h4>
                    <p>易行天下，奔赴山海</p>
                    <p class="footer-address">Connects you with moments</p>
                </div>
                <div class="footer-col">
                    <h5>目的地</h5>
                    <a href="list.html?d=australia">澳洲</a>
                    <a href="list.html?d=newzealand">新西兰</a>
                    <a href="list.html?d=china">中国</a>
                    <a href="list.html?d=asia">亚洲</a>
                    <a href="list.html?d=europe">欧洲</a>
                    <a href="list.html?d=cruise">邮轮</a>
                    <a href="list.html?d=usa">美加</a>
                    <a href="custom.html">特别订制</a>
                </div>
                <div class="footer-col">
                    <h5>服务</h5>
                    <a href="about.html">关于我们</a>
                    <a href="contact.html">联系我们</a>
                    <a href="faq.html">常见问题</a>
                    <a href="departures.html">团期价格</a>
                </div>
                <div class="footer-col">
                    <h5>联系方式</h5>
                    <p><span class="icon">📞</span> +61 2 9152 8728</p>
                    <p><span class="icon">✉️</span> info@etrips.com.au</p>
                    <p><span class="icon">📍</span> Level 17, 9 Castlereagh St, Sydney</p>
                    <div class="footer-qr">
                        <img src="assets/img/qr/wechat-xiaoyi.png" alt="微信客服 小易" loading="lazy">
                        <img src="assets/img/qr/wechat-xiaoyou.png" alt="微信客服 小游" loading="lazy">
                        <span>扫码添加微信客服</span>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <div class="footer-bottom-links">
                    <a href="#">隐私政策</a>
                    <span class="divider">|</span>
                    <a href="#">退改条款</a>
                    <span class="divider">|</span>
                    <a href="#">出行免责</a>
                </div>
                <p>© 2026 Etrips 国安易游. 保留所有权利.</p>
            </div>
        `;
    }

    // ============================================================
    // 8. 初始化
    // ============================================================

    // DOM 加载完成后渲染
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            renderNav();
            renderFooter();
            // 将 renderSearchSuggestions 暴露给全局（供其他模块调用）
            window.renderSearchSuggestions = renderSearchSuggestions;
        });
    } else {
        renderNav();
        renderFooter();
        window.renderSearchSuggestions = renderSearchSuggestions;
    }

    // ============================================================
    // 9. 暴露全局方法
    // ============================================================

    window.Etrips = window.Etrips || {};
    window.Etrips.renderSearchSuggestions = renderSearchSuggestions;
    window.Etrips.highlightCurrentPage = highlightCurrentPage;

    console.log('✅ site.js 已加载，核心目的地:', window.CORE_DESTINATIONS ? window.CORE_DESTINATIONS.length : '未加载');

})();
// Etrips 国安易游 — Home page rendering (sections 2-6 + form + hero dots)

window.EtripsForm = {
  submit(e) {
    e.preventDefault();
    const f = e.target;
    const lang = window.Etrips.getLang();
    const get = (n) =>
      (f.querySelector('[name="' + n + '"]') || {}).value || "";
    // 自动编号：ET-YYYYMMDD-HHMMSS
    const d = new Date();
    const p = (n) => String(n).padStart(2, "0");
    const ref =
      "ET-" +
      d.getFullYear() +
      p(d.getMonth() + 1) +
      p(d.getDate()) +
      "-" +
      p(d.getHours()) +
      p(d.getMinutes()) +
      p(d.getSeconds());
    const source = get("source") || location.pathname;
    const tourRef = get("tourRef") || "通用咨询";
    const rec = {
      ref,
      source,
      tourRef,
      name: get("name"),
      phone: get("phone"),
      email: get("email"),
      dest: get("dest"),
      date: get("date"),
      pax: get("pax"),
      notes: get("notes"),
      at: d.toISOString(),
    };
    // 本地留痕（无后端，存浏览器）
    try {
      const k = "etrips_leads";
      const a = JSON.parse(localStorage.getItem(k) || "[]");
      a.push(rec);
      localStorage.setItem(k, JSON.stringify(a));
    } catch (_) {}
    document.getElementById("form-msg").textContent =
      lang === "zh"
        ? "已收到咨询（编号 " +
          ref +
          "，来源：" +
          source +
          "，线路：" +
          tourRef +
          "），顾问将尽快联系您！"
        : "Received (ref " +
          ref +
          ", source: " +
          source +
          ", tour: " +
          tourRef +
          "). An advisor will contact you soon!";
    f.reset();
    return false;
  },
};

(function () {
  const T = window.TOURS,
    R = window.REVIEWS,
    TIP = window.TIPS,
    I = window.I18N;
  let lang = "zh";

  function renderHero() {
    const HERO = [
      {
        img: "assets/img/v2/au-apostles-1440.webp",
        video: "assets/video/hero-twelve-apostles.mp4",
        poster: "assets/video/hero-twelve-apostles-poster.jpg",
        tag: "易行天下，奔赴山海 · Connects you with moments",
        h1: "探索世界 · 从澳洲出发",
        sub: "从澳洲出发，抵达全球每一个值得去的地方",
        tagEn: "Connects you with moments",
        h1En: "Explore the World, from Australia",
        subEn: "From Australia to everywhere worth going",
        href: "list.html",
        cta: "查看线路",
        ctaEn: "View Tours",
      },
      {
        img: "assets/img/v2/cn-zhangjiajie-1440.webp",
        video: "assets/video/hero-zhangjiajie.mp4",
        poster: "assets/video/hero-zhangjiajie-poster.jpg",
        tag: "千年文明 · 山水中国",
        h1: "深度中国 · 长线定制",
        sub: "云南·西北·华东，小团私家任你选",
        tagEn: "Timeless China",
        h1En: "Deep China, Long-haul Journeys",
        subEn: "Yunnan, the Northwest and Jiangnan, small groups or private",
        href: "list.html?d=china",
        cta: "查看线路",
        ctaEn: "View Tours",
      },
      {
        img: "assets/img/v2/as-fuji-1440.webp",
        video: "assets/video/hero-fuji.mp4",
        poster: "assets/video/hero-fuji-poster.jpg",
        tag: "樱花与温泉 · 日本本州",
        h1: "日本本州 · 经典之旅",
        sub: "东京·富士山·京都，经典全包",
        tagEn: "Sakura & Onsen, Honshu",
        h1En: "Japan Honshu Classic",
        subEn: "Tokyo, Mt Fuji and Kyoto, all-inclusive",
        href: "list.html?d=asia",
        cta: "查看线路",
        ctaEn: "View Tours",
      },
      {
        img: "assets/img/v2/nz-milford-1440.webp",
        video: "assets/video/hero-milford.mp4",
        poster: "assets/video/hero-milford-poster.jpg",
        tag: "冰川峡湾 · 纯净新西兰",
        h1: "新西兰 · 南北岛环游",
        sub: "米尔福德峡湾·皇后镇·萤火虫洞，一次走完",
        tagEn: "Fiords & Glaciers, Pure NZ",
        h1En: "New Zealand, Both Islands",
        subEn: "Milford Sound, Queenstown and glowworm caves in one trip",
        href: "list.html?d=nz",
        cta: "查看线路",
        ctaEn: "View Tours",
      },
      {
        img: "assets/img/v2/cr-sunset-960.webp",
        video: "assets/video/hero-sydney-harbour.mp4",
        poster: "assets/video/hero-sydney-harbour-poster.jpg",
        tag: "蓝海邮轮 · 一站度假",
        h1: "邮轮专线 · 悉尼启航",
        sub: "悉尼港出发，途经海岛，全程邮轮度假",
        tagEn: "Blue-water Cruising",
        h1En: "Cruise Lines from Sydney Harbour",
        subEn: "Depart Sydney Harbour, island ports, full cruise holiday",
        href: "list.html?d=cruise",
        cta: "查看线路",
        ctaEn: "View Tours",
      },
    ];
    const wrap = document.getElementById("hero-slides");
    const dots = document.getElementById("hero-dots");
    if (!wrap) return;
    const noMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    wrap.innerHTML = HERO.map(
      (s, i) => `
      <div class="hero-slide${i === 0 ? " active" : ""}"${i === 0 ? ` style="background-image:url('${s.video && !noMotion ? s.poster : s.img}')"` : ` data-bg="${s.video && !noMotion ? s.poster : s.img}"`}>
        ${s.video && !noMotion ? `<video class="hero-video" muted loop playsinline preload="none" poster="${s.poster}" data-vsrc="${s.video}" aria-hidden="true"></video>` : ""}
        <div class="container">
          <div class="hero-content">
            <p class="hero-tagline">${lang === "zh" ? s.tag : s.tagEn}</p>
            ${i === 0 ? "<h1>" : '<p class="hero-title">'}${lang === "zh" ? s.h1 : s.h1En}${i === 0 ? "</h1>" : "</p>"}
            <p class="hero-sub">${lang === "zh" ? s.sub : s.subEn}</p>
            <div class="hero-cta">
              <a href="${s.href}" class="btn btn-gold">${lang === "zh" ? s.cta : s.ctaEn}</a>
              <a href="custom.html" class="btn btn-hero-outline">${lang === "zh" ? "私人订制 · Tailor-made" : "Tailor-made"}</a>
            </div>
          </div>
        </div>
      </div>`,
    ).join("");
    dots.innerHTML = HERO.map(
      (_, i) =>
        `<button type="button" class="dot${i === 0 ? " on" : ""}" data-i="${i}" aria-label="${lang === "zh" ? "第" + (i + 1) + "张" : "Slide " + (i + 1)}"></button>`,
    ).join("");
    let cur = 0;
    const slides = [...wrap.querySelectorAll(".hero-slide")];
    const dotEls = [...dots.querySelectorAll(".dot")];
    function hydrate() {
      slides.forEach((sl) => {
        if (sl.dataset.bg) {
          sl.style.backgroundImage = "url('" + sl.dataset.bg + "')";
          delete sl.dataset.bg;
        }
      });
    }
    function playActive() {
      slides.forEach((sl, i) => {
        const v = sl.querySelector(".hero-video");
        if (!v) return;
        if (i === cur) {
          if (v.dataset.vsrc) {
            v.src = v.dataset.vsrc;
            delete v.dataset.vsrc;
          }
          const p = v.play();
          if (p) p.catch(() => {});
        } else if (!v.paused) {
          v.pause();
        }
      });
    }
    function go(n) {
      hydrate();
      cur = (n + slides.length) % slides.length;
      slides.forEach((sl, i) => sl.classList.toggle("active", i === cur));
      dotEls.forEach((d, i) => d.classList.toggle("on", i === cur));
      playActive();
    }
    function armTimer() {
      if (window.__heroTimer) clearInterval(window.__heroTimer);
      window.__heroTimer = setInterval(() => go(cur + 1), 7000);
    }
    dotEls.forEach((d) =>
      d.addEventListener("click", () => {
        go(+d.dataset.i);
        armTimer();
      }),
    );
    playActive();
    armTimer();
  }

  function rebuild() {
    lang = window.Etrips.getLang();
    renderHero();

    // 板块2 选择你的目的地（竖向长条卡）
    const dest = [
      {
        zh: "澳洲",
        en: "AUSTRALIA",
        img: "assets/img/destinations/australia.jpg",
        href: "list.html?d=australia",
      },
      {
        zh: "新西兰",
        en: "NEW ZEALAND",
        img: "assets/img/destinations/nz.jpg",
        href: "list.html?d=nz",
      },
      {
        zh: "中国",
        en: "CHINA",
        img: "assets/img/destinations/china.jpg",
        href: "list.html?d=china",
      },
      {
        zh: "亚洲",
        en: "ASIA",
        img: "assets/img/destinations/asia.jpg",
        href: "list.html?d=asia",
      },
      {
        zh: "欧洲",
        en: "EUROPE",
        img: "assets/img/destinations/europe.jpg",
        href: "list.html?d=europe",
      },
      {
        zh: "邮轮",
        en: "CRUISE",
        img: "assets/img/destinations/cruise.jpg",
        href: "list.html?d=cruise",
      },
      {
        zh: "美加",
        en: "USA & CANADA",
        img: "assets/img/destinations/america.jpg",
        href: "list.html?d=america",
      },
      {
        zh: "特别订制",
        en: "SPECIAL CUSTOM",
        img: "assets/img/destinations/special.jpg",
        href: "list.html?d=special",
      },
    ];
    document.getElementById("biz-grid").innerHTML =
      `<div class="dest-row">` +
      dest
        .map(
          (d) => `
      <a class="dest-strip${d.wide ? " wide" : ""}" href="${d.href}">
        <img src="${d.img}" alt="${d.zh}" loading="lazy">
        <div class="ov"></div>
        <div class="lbl">${d.zh}<span class="en">${d.en}</span></div>
      </a>`,
        )
        .join("") +
      `</div>`;

    // 板块3 爆款6卡（横向滚动）
    const HOT = T.slice(0, 9);
    const hotWrap = document.getElementById("hot-grid");
    hotWrap.className = "grid grid-3";
    hotWrap.innerHTML = HOT.map((t) => window.tourCard(t, lang)).join("");

    // 板块4 优势（真人实景图 + 编号，无 emoji — 见 DESIGN.md）
    const adv = ["home.adv1", "home.adv2", "home.adv3", "home.adv4"];
    document.getElementById("adv-grid").innerHTML = adv
      .map(
        (a, i) => `
      <div class="adv-item">
      <img class="adv-img" src="assets/img/adv/adv-${i + 1}.jpg" alt="" loading="lazy">
      <span class="adv-num">0${i + 1}</span>
      <h4>${I[lang][a]}</h4></div>`,
      )
      .join("");

    // 板块5 评价（Trustpilot 式卡片轮播）
    const verified = lang === "zh" ? "已核实出团客人" : "Verified traveller";
    document.getElementById("review-grid").innerHTML = R.map((r) => {
      const stars = r.stars || 5;
      return `
      <article class="review">
        <div class="rev-head">
          <span class="rev-ava" aria-hidden="true">${r.nameZh.charAt(0)}</span>
          <div class="rev-id"><span class="rev-name">${lang === "zh" ? r.nameZh : r.nameEn}</span>
          <span class="rev-meta">${r.date} · ${lang === "zh" ? r.tourZh : r.tourEn}</span></div>
        </div>
        <div class="rev-stars" role="img" aria-label="${stars}/5">${Array.from({ length: 5 }, (_, i) => `<i class="${i < stars ? "on" : ""}">★</i>`).join("")}</div>
        <h4 class="rev-title">${lang === "zh" ? r.titleZh : r.titleEn}</h4>
        <p class="rev-text">${lang === "zh" ? r.textZh : r.textEn}</p>
        <span class="rev-badge">✓ ${verified}</span>
      </article>`;
    }).join("");
    initRevCarousel();

    // 板块6 出行小贴士
    const TIP = window.TIPS || [];
    document.getElementById("tips-grid").innerHTML = TIP.map(
      (t) =>
        `<div class="tip"><span class="tip-ico" aria-hidden="true"></span><p>${lang === "zh" ? t.zh : t.en}</p></div>`,
    ).join("");
  }

  // 评价轮播：自动滚动，悬停/触摸暂停；语言切换后 rebuild 重跑，on* 赋值天然去重旧监听
  let revTimer;
  function initRevCarousel() {
    const track = document.getElementById("review-grid");
    if (!track) return;
    const cards = [...track.children];
    const noMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const behavior = noMotion ? "auto" : "smooth";
    const step = () =>
      cards.length > 1
        ? cards[1].offsetLeft - cards[0].offsetLeft
        : track.clientWidth;
    const cur = () => Math.round(track.scrollLeft / step());
    const go = (i) =>
      track.scrollTo({
        left: Math.max(0, Math.min(i, cards.length - 1)) * step(),
        behavior,
      });
    document.getElementById("rev-prev").onclick = () => go(cur() - 1);
    document.getElementById("rev-next").onclick = () => go(cur() + 1);
    clearInterval(revTimer);
    if (noMotion) return;
    const tick = () => {
      if (document.hidden) return;
      const atEnd =
        track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
      go(atEnd ? 0 : cur() + 1);
    };
    const start = () => {
      clearInterval(revTimer);
      revTimer = setInterval(tick, 4000);
    };
    const wrap = track.closest(".rev-carousel");
    wrap.onmouseenter = () => clearInterval(revTimer);
    wrap.onmouseleave = start;
    wrap.onfocusin = () => clearInterval(revTimer);
    wrap.onfocusout = start;
    track.ontouchstart = () => clearInterval(revTimer);
    track.ontouchend = start;
    start();
  }

  // 自定义日期选择器：独立初始化（首页/子页皆可，不依赖首页 rebuild）
  if (document.getElementById("date-trigger") && window.EtripsDatePicker)
    window.EtripsDatePicker.init();

  // ---------- 自定义日期选择器（橙条表头 / 周一列首 / 今天红标 / 真实发团日高亮） ----------
  window.EtripsDatePicker = {
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    init() {
      const trigger = document.getElementById("date-trigger");
      const pop = document.getElementById("date-pop");
      const hidden = document.querySelector('input[name="date"]');
      const avail = (window.DEPARTURES || []).map((d) => d.date); // 真实发团日 YYYY-MM-DD
      const render = () => {
        const y = this.year,
          m = this.month;
        const first = new Date(y, m, 1).getDay(); // 0=Sun
        const start = (first + 6) % 7; // 周一为列首
        const days = new Date(y, m + 1, 0).getDate();
        const wk = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
        const pad = (n) => String(n).padStart(2, "0");
        const today = new Date();
        const tkey = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
        let cells = "";
        for (let i = 0; i < start; i++)
          cells += '<span class="dc empty"></span>';
        for (let d = 1; d <= days; d++) {
          const key = `${y}-${pad(m + 1)}-${pad(d)}`;
          const isToday = key === tkey;
          const can = avail.includes(key);
          cells += `<span class="dc${can ? " on" : ""}${isToday ? " today" : ""}" ${can ? `data-d="${key}"` : ""}>${isToday ? "今天" : d}</span>`;
        }
        pop.innerHTML = `<div class="dp-head">${y}-${pad(m + 1)} <span class="dp-next" id="dp-next">›</span></div>
          <div class="dp-wk">${wk.map((w) => `<span>${w}</span>`).join("")}</div>
          <div class="dp-grid">${cells}</div>`;
        pop.querySelector("#dp-next").onclick = () => {
          this.month++;
          if (this.month > 11) {
            this.month = 0;
            this.year++;
          }
          render();
        };
        pop.querySelectorAll(".dc.on").forEach(
          (c) =>
            (c.onclick = () => {
              hidden.value = c.dataset.d;
              trigger.textContent = c.dataset.d;
              pop.hidden = true;
            }),
        );
      };
      trigger.onclick = () => {
        pop.hidden = !pop.hidden;
        if (!pop.hidden) render();
      };
      document.addEventListener("click", (e) => {
        if (!pop.hidden && !pop.contains(e.target) && e.target !== trigger)
          pop.hidden = true;
      });
    },
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("date-trigger") && window.EtripsDatePicker)
      window.EtripsDatePicker.init();
  });
  document.addEventListener("DOMContentLoaded", rebuild);
  window.addEventListener("langchange", rebuild);
})();

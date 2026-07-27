// Etrips 国安易游 — Detail page (4 tabs + PDF export)
(function () {
  const T = window.TOURS,
    I = window.I18N;
  let lang = "zh",
    cur = null;

  function find() {
    const id = new URLSearchParams(location.search).get("id");
    return T.find((t) => t.id === id) || T[0];
  }

  function renderHead(t) {
    const tags = [
      ...new Set(
        lang === "zh"
          ? [
              `${I[lang]["detail.tag.days"]} ${t.days}`,
              I[lang]["detail.tag.group"],
              I[lang]["detail.tag.leader"],
              I[lang]["detail.tag.allinc"],
              ...t.tags,
            ]
          : [
              `${I[lang]["detail.tag.days"]} ${t.days}`,
              I[lang]["detail.tag.group"],
              I[lang]["detail.tag.leader"],
              I[lang]["detail.tag.allinc"],
              ...t.tagsEn,
            ],
      ),
    ];
    const price = lang === "zh" ? t.price : t.priceEn;
    document.getElementById("detail-head").innerHTML = `
      <h1>${lang === "zh" ? t.nameZh : t.nameEn}</h1>
      <div class="muted" style="color:#cdd8e3">${I[lang]["detail.tourid"]}: <b>${t.id}</b></div>
      <div class="detail-tags">${tags.map((x) => `<span class="tag">${x}</span>`).join("")}</div>
      <div class="detail-price">${price}</div>
      <p style="margin-top:10px">
        <button class="btn btn-gold" onclick="EtripsDetail.downloadPDF()">${I[lang]["btn.download"]}</button>
      </p>`;
  }

  function renderItinerary(t) {
    document.getElementById("panel-itinerary").innerHTML = t.itinerary
      .map(
        (d) => `
      <div class="day">
        <div class="d">${d.d} · ${lang === "zh" ? d.titleZh : d.titleEn}</div>
        <div class="line">${lang === "zh" ? d.descZh : d.descEn}</div>
        <div class="spots">${lang === "zh" ? d.spotsZh.join("　") : d.spotsEn.join("  ")}</div>
        <div class="line"><b style="color:var(--gold-deep);font-weight:600">${I[lang]["label.transport"]}</b> ${lang === "zh" ? d.transportZh : d.transportEn}</div>
        <div class="line"><b style="color:var(--gold-deep);font-weight:600">${I[lang]["label.meals"]}</b> ${lang === "zh" ? d.mealZh : d.mealEn}</div>
        <div class="line"><b style="color:var(--gold-deep);font-weight:600">${I[lang]["label.hotel"]}</b> ${lang === "zh" ? d.hotelZh : d.hotelEn}</div>
      </div>`,
      )
      .join("");
  }

  function renderHotel(t) {
    document.getElementById("panel-hotel").innerHTML = `
      <div class="grid grid-2">
      ${t.hotels
        .map(
          (h) => `
        <div class="card"><div class="body">
          <h3>${lang === "zh" ? h.nameZh : h.nameEn}</h3>
          <p class="muted">${lang === "zh" ? h.levelZh : h.levelEn} · ${lang === "zh" ? h.noteZh : h.noteEn}</p>
        </div></div>`,
        )
        .join("")}
      </div>`;
  }

  function renderExtra(t) {
    const inc = lang === "zh" ? t.includes : t.includesEn;
    const exc = lang === "zh" ? t.excludes : t.excludesEn;
    const not = lang === "zh" ? t.notes : t.notesEn;
    document.getElementById("panel-extra").innerHTML = `
      <h3 style="color:var(--navy)">${I[lang]["detail.includes"]}</h3>
      <ul class="includes">${inc.map((x) => `<li>${x}</li>`).join("")}</ul>
      <h3 style="color:var(--navy);margin-top:18px">${I[lang]["detail.excludes"]}</h3>
      <ul class="excludes">${exc.map((x) => `<li>${x}</li>`).join("")}</ul>
      <h3 style="color:var(--navy);margin-top:18px">${I[lang]["detail.notes"]}</h3>
      <ul class="notes">${not.map((x) => `<li>${x}</li>`).join("")}</ul>`;
  }

  function renderCancel(t) {
    document.getElementById("panel-cancel").innerHTML = `
      <h3 style="color:var(--navy)">${I[lang]["detail.cancel.title"]}</h3>
      <ul class="notes">
        <li>出发前 30 天以上取消：扣除定金 20%。</li>
        <li>出发前 15-29 天取消：扣除总费用 50%。</li>
        <li>出发前 7-14 天取消：扣除总费用 70%。</li>
        <li>出发前 7 天内取消：扣除总费用 100%。</li>
        <li>以上为通用模板，具体以合同为准。</li>
      </ul>`;
  }

  function renderAll() {
    lang = window.Etrips.getLang();
    cur = find();
    renderHead(cur);
    renderItinerary(cur);
    renderHotel(cur);
    renderExtra(cur);
    renderCancel(cur);
    window.Etrips.applyLang({ emit: false });
    document
      .querySelectorAll(
        'a.btn-primary[href="contact.html"],a.btn-gold[href="contact.html"]',
      )
      .forEach((a) => {
        a.href =
          "contact.html?route=" +
          encodeURIComponent(lang === "zh" ? cur.nameZh : cur.nameEn);
      });
  }

  // Tabs
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("#tabs button").forEach((b) => {
      b.addEventListener("click", () => {
        document
          .querySelectorAll("#tabs button")
          .forEach((x) => x.classList.remove("active"));
        document
          .querySelectorAll(".tab-panel")
          .forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
        document
          .getElementById("panel-" + b.dataset.tab)
          .classList.add("active");
      });
    });
    renderAll();
  });
  window.addEventListener("langchange", renderAll);

  // PDF export (print-based, no deps)
  window.EtripsDetail = {
    downloadPDF() {
      const t = cur;
      if (!t) return;
      const lines = [];
      lines.push(`Etrips 国安易游 / Etrips Global Easy Travel`);
      lines.push(`${lang === "zh" ? t.nameZh : t.nameEn}  (${t.id})`);
      lines.push(
        `Price: ${lang === "zh" ? t.price : t.priceEn}  |  Days: ${t.days}`,
      );
      lines.push("");
      lines.push(lang === "zh" ? "【每日行程】" : "[Itinerary]");
      t.itinerary.forEach((d) => {
        lines.push(`${d.d} ${lang === "zh" ? d.titleZh : d.titleEn}`);
        lines.push(`  ${lang === "zh" ? d.descZh : d.descEn}`);
        lines.push(
          `  景点: ${lang === "zh" ? d.spotsZh.join("、") : d.spotsEn.join(", ")}`,
        );
        lines.push(
          `  ${lang === "zh" ? d.transportZh : d.transportEn} | ${lang === "zh" ? d.mealZh : d.mealEn} | ${lang === "zh" ? d.hotelZh : d.hotelEn}`,
        );
      });
      lines.push("");
      lines.push(lang === "zh" ? "【费用包含】" : "[Included]");
      (lang === "zh" ? t.includes : t.includesEn).forEach((x) =>
        lines.push("  - " + x),
      );
      lines.push("");
      lines.push(lang === "zh" ? "【费用不含】" : "[Excluded]");
      (lang === "zh" ? t.excludes : t.excludesEn).forEach((x) =>
        lines.push("  - " + x),
      );
      const w = window.open("", "_blank");
      w.document
        .write(`<pre style="font-family:monospace;padding:24px;white-space:pre-wrap">${lines.join("\n")}</pre>
        <script>window.onload=()=>window.print()<\/script>`);
      w.document.close();
    },
  };
})();

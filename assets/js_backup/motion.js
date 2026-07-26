// Etrips 国安易游 — scroll motion (v2). No dependencies.
// Rules: everything is visible without JS (CSS only hides when .js-motion is on
// the root); prefers-reduced-motion disables all of it.
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) return;
  document.documentElement.classList.add("js-motion");

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add("revealed");
        if (el.hasAttribute("data-reveal-stagger")) {
          // children were pre-hidden in arm(); reveal them staggered
          Array.prototype.forEach.call(el.children, function (child, i) {
            setTimeout(function () {
              child.classList.add("revealed");
            }, 70 * i);
          });
        }
        // count-up numbers
        el.querySelectorAll("[data-count]").forEach(startCount);
        if (el.hasAttribute("data-count")) startCount(el);
        io.unobserve(el);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );

  function startCount(el) {
    if (el.__counted) return;
    el.__counted = true;
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-count-suffix") || "";
    var dur = 1100,
      t0 = null;
    function tick(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / dur);
      p = 1 - Math.pow(1 - p, 3); // ease-out-cubic
      el.textContent = Math.round(target * p) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function arm() {
    document
      .querySelectorAll("[data-reveal]:not(.revealed)")
      .forEach(function (el) {
        if (el.hasAttribute("data-reveal-stagger")) {
          Array.prototype.forEach.call(el.children, function (child) {
            if (!child.classList.contains("revealed"))
              child.classList.add("reveal-init");
          });
        }
        io.observe(el);
      });
  }
  document.addEventListener("DOMContentLoaded", arm);
  // re-arm after language re-render rebuilds sections
  window.addEventListener("langchange", function () {
    setTimeout(arm, 60);
  });
  arm();
})();

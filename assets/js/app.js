// ===== Saptari Next — shared site logic =====
// Header/footer injection, EN/NE language toggle, Supabase helper, demo data.

(function () {
  const C = window.SN_CONFIG || {};
  const root = location.pathname.includes("/admin/") ? "../" : "";

  // ---------- Header & footer ----------
  const NAV = [
    ["index.html", "nav.home", "Home"],
    ["about.html", "nav.about", "About"],
    ["district.html", "nav.district", "District Profile"],
    ["villages.html", "nav.villages", "Villages"],
    ["library.html", "nav.library", "Library"],
    ["progress.html", "nav.progress", "Progress"],
    ["media.html", "nav.media", "Media"],
    ["report.html", "nav.report", "Report"],
    ["get-involved.html", "nav.join", "Get Involved"]
  ];

  function buildHeader() {
    const here = location.pathname.split("/").pop() || "index.html";
    const links = NAV.map(([href, key, label]) =>
      `<li><a href="${root}${href}" class="${here === href ? "active" : ""}" data-i18n="${key}">${label}</a></li>`
    ).join("");
    return `<nav class="nav">
      <a class="brand" href="${root}index.html"><img src="${root}assets/img/logo.png" alt="Saptari Next"><span>Saptari Next</span></a>
      <ul>${links}
        <li><a href="${root}admin/index.html" data-i18n="nav.admin">Admin</a></li>
        <li><button class="lang-toggle" id="langToggle">ने</button></li>
      </ul>
    </nav>`;
  }

  function buildFooter() {
    return `<div class="cols">
      <div>
        <h4>Saptari Next</h4>
        <p data-i18n="footer.tagline">Saptari's future, together.</p>
        <p>${C.HASHTAG || "#SaptariNext"} · <a href="${C.FACEBOOK || "#"}" target="_blank" rel="noopener">Facebook</a></p>
      </div>
      <div>
        <h4 data-i18n="footer.pillars">Four Pillars</h4>
        <ul>
          <li><span data-i18n="pillar.project.t">Project</span></li>
          <li><span data-i18n="pillar.program.t">Program</span></li>
          <li><span data-i18n="pillar.poll.t">Poll</span></li>
          <li><span data-i18n="pillar.publication.t">Publication</span></li>
        </ul>
      </div>
      <div>
        <h4 data-i18n="footer.links">Links</h4>
        <ul>
          <li><a href="${root}advisors.html">Advisory Council</a></li>
          <li><a href="${root}partners.html">Partners</a></li>
          <li><a href="${root}rivers.html">Rivers &amp; Corridors</a></li>
          <li><a href="${root}library.html" data-i18n="nav.library">Library</a></li>
          <li><a href="${root}progress.html" data-i18n="nav.progress">Progress</a></li>
          <li><a href="${root}report.html" data-i18n="nav.report">Report</a></li>
          <li><a href="${root}materials/Saptari-Next-Manual-EN.pdf" target="_blank">Campaign Manual (PDF)</a></li>
        </ul>
      </div>
      <div>
        <h4 data-i18n="footer.contact">Contact</h4>
        <p>${C.OFFICE || "Saptari Next Office, Rajbiraj, Saptari"}</p>
        <p><a href="mailto:${C.CONTACT_EMAIL || ""}">${C.CONTACT_EMAIL || ""}</a></p>
      </div>
    </div>
    <p class="fine">© ${new Date().getFullYear()} Saptari Next · Open knowledge: site content and campaign publications are shared under CC BY-SA 4.0 · <a href="${root}library.html#opensource">Open Source</a></p>`;
  }

  // ---------- Breadcrumb ----------
  // Pages declare: window.SN_BREADCRUMB = [["Home","index.html"], ["Villages","villages.html"], ["Boria"]];
  // Last entry with no href is the current page (non-clickable).
  function buildBreadcrumb(trail) {
    const items = trail.map(([label, href], i) => {
      const isLast = i === trail.length - 1 || !href;
      if (isLast) return `<span class="current">${label}</span>`;
      return `<a href="${root}${href}">${label}</a><span class="sep">\u203a</span>`;
    }).join("");
    return `<div class="breadcrumb"><div class="container">${items}</div></div>`;
  }

  // ---------- i18n ----------
  function applyLang(lang) {
    document.documentElement.lang = lang;
    localStorage.setItem("sn_lang", lang);
    const dict = (window.SN_I18N && window.SN_I18N.ne) || {};
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (lang === "ne" && dict[key]) {
        if (!el.dataset.en) el.dataset.en = el.innerHTML;
        el.innerHTML = dict[key];
      } else if (lang === "en" && el.dataset.en) {
        el.innerHTML = el.dataset.en;
      }
    });
    const t = document.getElementById("langToggle");
    if (t) t.textContent = lang === "ne" ? "EN" : "ने";
  }

  // ---------- Supabase ----------
  let _db = null;
  function db() {
    if (_db) return _db;
    if (C.SUPABASE_URL && C.SUPABASE_ANON_KEY && window.supabase) {
      _db = window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY);
    }
    return _db;
  }
  const demoMode = () => !(C.SUPABASE_URL && C.SUPABASE_ANON_KEY);

  // ---------- Demo data (used until Supabase is connected) ----------
  const DEMO = {
    projects: [
      { id: 1, title: "Campaign Manual — First Edition", title_ne: "अभियान निर्देशिका — पहिलो संस्करण", pillar: "Publication", status: "ongoing", progress: 85, location: "Rajbiraj", summary: "Drafting, translation (EN/NE) and publication of the first Saptari Next Manual with District Profile Module 1.", start_date: "2026-05-01" },
      { id: 2, title: "District Profile Module 2: Demography", title_ne: "जिल्ला प्रोफाइल मोड्युल २: जनसांख्यिकी", pillar: "Publication", status: "ongoing", progress: 60, location: "District-wide", summary: "Demography and social composition research compiled by the profiling team.", start_date: "2026-06-01" },
      { id: 3, title: "Birds of Madhesh Photo Exhibition", title_ne: "मधेशका चराहरू फोटो प्रदर्शनी", pillar: "Program", status: "completed", progress: 100, location: "ChaiCharcha, Rajbiraj", summary: "101 photographs by Anant Arjun Dev, in partnership with Maithili Wikimedians, exhibited at ChaiCharcha.", start_date: "2024-01-01" },
      { id: 4, title: "Koshi Barrage Advocacy", title_ne: "कोशी ब्यारेज पैरवी", pillar: "Program", status: "ongoing", progress: 30, location: "Koshi Barrage", summary: "Advocacy for coordinated Nepal–India maintenance of the Koshi Barrage and embankments.", start_date: "2025-01-01" },
      { id: 5, title: "Endowment Fund Design", title_ne: "अक्षय कोष डिजाइन", pillar: "Project", status: "planned", progress: 10, location: "Rajbiraj", summary: "Designing the governance and investment framework for the Saptari Next endowment fund.", start_date: "2026-08-01" },
      { id: 6, title: "Baseline Opinion Poll 2027", title_ne: "आधारभूत जनमत सर्वेक्षण २०२७", pillar: "Poll", status: "planned", progress: 5, location: "All 18 local governments", summary: "First district-wide poll on citizens' development priorities, to refine the 2030/40/50 milestones.", start_date: "2027-01-01" }
    ],
    updates: [
      { id: 1, title: "Manual first edition enters publication draft", body: "The English and Nepali drafts of the Campaign Manual are complete and under final review before print.", created_at: "2026-07-01" },
      { id: 2, title: "Module 2 (Demography) drafted", body: "Bikash (profiling intern) submitted the Module 2 demography draft covering population, caste/ethnic composition and language mapping.", created_at: "2026-06-20" }
    ]
  };

  // ---------- Boot ----------
  document.addEventListener("DOMContentLoaded", () => {
    const h = document.querySelector("header.site");
    if (h) h.innerHTML = buildHeader();
    const f = document.querySelector("footer.site");
    if (f) f.innerHTML = buildFooter();

    if (Array.isArray(window.SN_BREADCRUMB) && window.SN_BREADCRUMB.length && h) {
      h.insertAdjacentHTML("afterend", buildBreadcrumb(window.SN_BREADCRUMB));
    }

    applyLang(localStorage.getItem("sn_lang") || "en");
    document.body.addEventListener("click", e => {
      if (e.target && e.target.id === "langToggle") {
        applyLang(document.documentElement.lang === "ne" ? "en" : "ne");
      }
    });
  });

  window.SN = { db, demoMode, DEMO, applyLang, config: C };
})();

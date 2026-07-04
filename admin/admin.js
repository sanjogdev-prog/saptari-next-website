// ===== Saptari Next — admin dashboard =====
// Real mode: Supabase email/password auth + database CRUD.
// Demo mode (no Supabase keys in config.js): password "saptari-demo",
// data lives in this browser's localStorage only.

(function () {
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let demo = true, db = null;

  // ---- Demo store (localStorage) ----
  const store = {
    key: k => "sn_admin_" + k,
    get(k, fallback) { try { return JSON.parse(localStorage.getItem(this.key(k))) ?? fallback; } catch { return fallback; } },
    set(k, v) { localStorage.setItem(this.key(k), JSON.stringify(v)); }
  };
  function demoData(table) {
    if (table === "projects") return store.get("projects", structuredClone(SN.DEMO.projects));
    if (table === "updates") return store.get("updates", SN.DEMO.updates.map(u => ({ ...u, published: true })));
    return store.get(table, []);
  }

  // ---- Data layer (same API both modes) ----
  const api = {
    async list(table, opts = {}) {
      if (demo) return demoData(table);
      let q = db.from(table).select("*").order(opts.order || "created_at", { ascending: false });
      const { data, error } = await q;
      if (error) { notice("warn", error.message); return []; }
      return data;
    },
    async upsert(table, row) {
      if (demo) {
        const rows = demoData(table);
        if (row.id) { const i = rows.findIndex(r => r.id == row.id); if (i > -1) rows[i] = { ...rows[i], ...row }; }
        else { row.id = Date.now(); row.created_at = new Date().toISOString(); rows.unshift(row); }
        store.set(table, rows); return null;
      }
      if (!row.id) delete row.id;
      const { error } = await db.from(table).upsert(row);
      return error;
    },
    async remove(table, id) {
      if (demo) { store.set(table, demoData(table).filter(r => r.id != id)); return null; }
      const { error } = await db.from(table).delete().eq("id", id);
      return error;
    }
  };

  function notice(kind, msg) {
    $("dashNotice").innerHTML = msg ? `<p class="notice ${kind}">${esc(msg)}</p>` : "";
  }

  // ---- Auth ----
  async function init() {
    demo = SN.demoMode();
    if (!demo) db = SN.db();
    if (demo) $("demoHint").style.display = "block";

    if (!demo) {
      const { data: { session } } = await db.auth.getSession();
      if (session) return showDash(session.user.email);
    } else if (sessionStorage.getItem("sn_demo_admin")) {
      return showDash("demo admin");
    }

    $("loginForm").addEventListener("submit", async e => {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(e.target).entries());
      if (demo) {
        if (f.password === "saptari-demo") { sessionStorage.setItem("sn_demo_admin", "1"); showDash("demo admin"); }
        else $("loginNotice").innerHTML = '<p class="notice warn">Demo password is <code>saptari-demo</code>. Connect Supabase for real accounts.</p>';
        return;
      }
      const { error } = await db.auth.signInWithPassword({ email: f.email, password: f.password });
      if (error) $("loginNotice").innerHTML = `<p class="notice warn">${esc(error.message)}</p>`;
      else showDash(f.email);
    });
  }

  async function showDash(who) {
    $("loginView").style.display = "none";
    $("dashView").style.display = "block";
    $("whoami").textContent = who;
    if (demo) notice("info", "Demo mode — data is saved only in this browser. Connect Supabase (see SETUP.md) to go live.");
    await Promise.all([renderProjects(), renderUpdates(), renderReports(), renderMembers()]);
  }

  $("logoutBtn").addEventListener("click", async () => {
    if (!demo && db) await db.auth.signOut();
    sessionStorage.removeItem("sn_demo_admin");
    location.reload();
  });

  // ---- Tabs ----
  $("tabs").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    document.querySelectorAll("#tabs button").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    document.querySelectorAll(".tab-pane").forEach(p => p.style.display = "none");
    $("tab-" + b.dataset.tab).style.display = "block";
  });

  // ---- Projects ----
  async function renderProjects() {
    const rows = await api.list("projects", { order: "start_date" });
    $("projectsTable").innerHTML = `<tr><th>Title</th><th>Pillar</th><th>Status</th><th>%</th><th></th></tr>` +
      rows.map(p => `<tr>
        <td>${esc(p.title)}</td><td>${esc(p.pillar)}</td>
        <td><span class="badge ${esc(p.status)}">${esc(p.status)}</span></td><td>${p.progress ?? 0}</td>
        <td><a href="#" data-edit="${p.id}">edit</a> · <a href="#" data-del="${p.id}" style="color:#b71c1c;">delete</a></td>
      </tr>`).join("");
    $("projectsTable").onclick = async e => {
      const ed = e.target.closest("[data-edit]"), del = e.target.closest("[data-del]");
      if (ed) { e.preventDefault(); const p = rows.find(r => r.id == ed.dataset.edit);
        const f = $("projectForm"); for (const k of ["id","title","title_ne","pillar","status","progress","location","start_date","summary"]) if (f.elements[k]) f.elements[k].value = p[k] ?? ""; }
      if (del) { e.preventDefault(); if (confirm("Delete this project?")) { await api.remove("projects", del.dataset.del); renderProjects(); } }
    };
  }
  $("projectForm").addEventListener("submit", async e => {
    e.preventDefault();
    const row = Object.fromEntries(new FormData(e.target).entries());
    row.progress = parseInt(row.progress || 0, 10);
    if (!row.id) delete row.id;
    if (!row.start_date) delete row.start_date;
    const err = await api.upsert("projects", row);
    notice(err ? "warn" : "ok", err ? err.message : "Project saved.");
    if (!err) { e.target.reset(); renderProjects(); }
  });
  $("projectReset").addEventListener("click", () => $("projectForm").reset());

  // ---- Updates ----
  async function renderUpdates() {
    const rows = await api.list("updates");
    $("updatesTable").innerHTML = `<tr><th>Date</th><th>Title</th><th>Published</th><th></th></tr>` +
      rows.map(u => `<tr><td>${esc((u.created_at || "").slice(0, 10))}</td><td>${esc(u.title)}</td>
        <td>${u.published ? "✅" : "—"}</td>
        <td><a href="#" data-del="${u.id}" style="color:#b71c1c;">delete</a></td></tr>`).join("");
    $("updatesTable").onclick = async e => {
      const del = e.target.closest("[data-del]");
      if (del) { e.preventDefault(); if (confirm("Delete this update?")) { await api.remove("updates", del.dataset.del); renderUpdates(); } }
    };
  }
  $("updateForm").addEventListener("submit", async e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const err = await api.upsert("updates", { title: f.get("title"), body: f.get("body"), published: !!f.get("published") });
    notice(err ? "warn" : "ok", err ? err.message : "Update saved.");
    if (!err) { e.target.reset(); renderUpdates(); }
  });

  // ---- Reports ----
  async function renderReports() {
    const rows = await api.list("reports");
    $("reportsTable").innerHTML = `<tr><th>Date</th><th>Name</th><th>Contact</th><th>Type</th><th>Municipality</th><th>Message</th></tr>` +
      (rows.length ? rows.map(r => `<tr><td>${esc((r.created_at || "").slice(0, 10))}</td><td>${esc(r.name)}</td>
        <td>${esc(r.contact)}</td><td>${esc(r.category)}</td><td>${esc(r.municipality)}</td><td>${esc(r.message)}</td></tr>`).join("")
      : `<tr><td colspan="6" style="color:var(--muted);">No reports yet.</td></tr>`);
  }

  // ---- Members ----
  async function renderMembers() {
    const rows = await api.list("members");
    $("membersTable").innerHTML = `<tr><th>Date</th><th>Name</th><th>Email</th><th>Type</th><th>Interest</th></tr>` +
      (rows.length ? rows.map(m => `<tr><td>${esc((m.created_at || "").slice(0, 10))}</td><td>${esc(m.name)}</td>
        <td>${esc(m.email)}</td><td>${esc(m.type)}</td><td>${esc(m.interest)}</td></tr>`).join("")
      : `<tr><td colspan="5" style="color:var(--muted);">No registrations yet.</td></tr>`);
  }

  document.addEventListener("DOMContentLoaded", init);
})();

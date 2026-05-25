// Blog feed — bejegyzéskártyák és bejegyzés-olvasó overlay.

const { useEffect: useEffectF, useMemo: useMemoF, useState: useStateF, useRef: useRefF } = React;

// Markdown → HTML
function renderMarkdown(src) {
  const esc = (s) => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let s = esc(src);
  s = s.replace(/^### (.*)$/gm, '<h3 style="font-weight:600;font-size:18px;margin:20px 0 6px">$1</h3>')
       .replace(/^## (.*)$/gm,  '<h2 style="font-weight:600;font-size:21px;margin:28px 0 8px">$1</h2>')
       .replace(/^# (.*)$/gm,   '<h1 style="font-weight:600;font-size:26px;margin:32px 0 10px">$1</h1>')
       .replace(/^> (.*)$/gm,   '<blockquote style="padding-left:16px;border-left:2px solid #6B3FE6;font-style:italic;color:#2A2620">$1</blockquote>')
       .replace(/^---$/gm,      '<hr style="border:none;border-top:1px solid #E4DDC9;margin:24px 0"/>')
       .replace(/`([^`]+)`/g,   '<code style="font-family:JetBrains Mono,monospace;font-size:13px;background:#F1ECDF;padding:1px 5px;border-radius:4px">$1</code>')
       .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
       .replace(/\*([^*]+)\*/g,  '<em>$1</em>')
       .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#6B3FE6;text-decoration:underline">$1</a>');
  s = s.replace(/(?:^|\n)((?:- .*(?:\n|$))+)/g, (_, block) =>
    `\n<ul style="list-style:disc;padding-left:24px;margin:8px 0">${block.trim().split("\n").map(l => `<li style="margin:4px 0">${l.replace(/^- /, "")}</li>`).join("")}</ul>`);
  s = s.replace(/(?:^|\n)((?:\d+\. .*(?:\n|$))+)/g, (_, block) =>
    `\n<ol style="list-style:decimal;padding-left:24px;margin:8px 0">${block.trim().split("\n").map(l => `<li style="margin:4px 0">${l.replace(/^\d+\. /, "")}</li>`).join("")}</ol>`);
  s = s.split(/\n{2,}/).map(p =>
    /^<(h\d|ul|ol|blockquote|hr|pre)/.test(p) ? p : `<p style="margin:0">${p.replace(/\n/g, "<br/>")}</p>`).join("\n");
  return s;
}

function BlogFeed({ posts, topics, filterCat, filterTeam, onClearFilters, onOpenPost, search, filterSaved, savedPostIds, onToggleFilterSaved }) {
  const filtered = useMemoF(() => {
    let rows = [...posts];
    if (filterCat)   rows = rows.filter(p => p.category === filterCat);
    if (filterTeam)  rows = rows.filter(p => p.team_id === filterTeam);
    if (filterSaved) rows = rows.filter(p => savedPostIds?.has(p.id));
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.excerpt || "").toLowerCase().includes(q)
      );
    }
    return rows;
  }, [posts, filterCat, filterTeam, filterSaved, savedPostIds, search]);

  const topicById = useMemoF(() => Object.fromEntries(topics.map(t => [t.id, t])), [topics]);
  const featured = filtered[0];
  const rest = filtered.slice(1);
  const filtersActive = filterCat || filterTeam || search || filterSaved;

  return (
    <section id="feed" className="relative" data-screen-label="feed">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pt-24 pb-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeader
            eyebrow="03 / feed"
            title={<>Amit <span className="font-serif-i text-coral">megtaláltunk</span>.</>}
            sub="Bejegyzések fordított időrendben. Görgess tovább az olvasáshoz, vagy szűrj témakör / kategória szerint fentebb."
          />
          {onToggleFilterSaved && (
            <button
              onClick={onToggleFilterSaved}
              className={"btn-press inline-flex items-center gap-2 h-8 px-3 rounded-full text-[12px] mb-1 " +
                (filterSaved ? "bg-ink text-cream" : "bg-cream ring-line hover:bg-creamdark")}>
              <Icon name="bookmark" size={12} stroke={2} /> Mentett bejegyzések
            </button>
          )}
        </div>

        {filtersActive && (
          <div className="mt-8 flex flex-wrap items-center gap-3 rounded-full bg-cream ring-line py-2 pl-3 pr-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted pl-1">szűrve</span>
            {filterCat && <CategoryChip slug={filterCat} />}
            {filterSaved && (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-creamdark text-[12px]">
                <Icon name="bookmark" size={12} stroke={2} /> mentett
              </span>
            )}
            {filterTeam && topicById[filterTeam] && (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-creamdark text-[12px]">
                <TeamMark team={topicById[filterTeam]} size={16} /> {topicById[filterTeam].name}
              </span>
            )}
            {search && (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-creamdark text-[12px] font-mono">
                „{search}"
              </span>
            )}
            <span className="ml-auto text-[12px] text-muted">{filtered.length} találat</span>
            <button onClick={onClearFilters}
              className="btn-press inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-ink text-cream text-[12px]">
              <Icon name="x" size={12} stroke={2.2} /> törlés
            </button>
          </div>
        )}

        {filtered.length === 0 ? (
          <EmptyFeed onClear={onClearFilters} />
        ) : (
          <>
            {featured && (
              <ScrollFade>
                <FeaturedCard post={featured} topic={topicById[featured.team_id]} onOpen={() => onOpenPost(featured)} />
              </ScrollFade>
            )}
            {rest.length > 0 && (
              <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((p, i) => (
                  <ScrollFade key={p.id} delay={i * 60}>
                    <PostCard post={p} topic={topicById[p.team_id]} onOpen={() => onOpenPost(p)} />
                  </ScrollFade>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

// ── Kiemelt kártya (első bejegyzés) ───────────────────────────────────
function FeaturedCard({ post, topic, onOpen }) {
  return (
    <button onClick={onOpen}
      className="group mt-12 w-full text-left rounded-2xl ring-line bg-cream overflow-hidden card-hover hover:bg-creamdark grid md:grid-cols-12">
      <div className="md:col-span-7 p-7 md:p-10 flex flex-col">
        <div className="flex items-center gap-3">
          <CategoryChip slug={post.category} />
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
            {fmtDate(post.created_at)} · {post.read} perc olvasás
          </span>
          {post.pinned && (
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-coral border border-coral/40 px-2 py-0.5 rounded-full">
              rögzítve
            </span>
          )}
        </div>
        <h3 className="mt-5 font-medium tracking-[-0.02em] leading-[1.02] text-[clamp(28px,3.6vw,44px)]">
          {post.title}
        </h3>
        <p className="mt-4 text-[16px] leading-[1.55] text-ink2 max-w-[55ch]">{post.excerpt}</p>

        <div className="mt-auto pt-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TeamMark team={topic} size={32} />
            <div className="leading-tight">
              <div className="text-[14px] font-medium">{topic?.name}</div>
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">{topic?.focus}</div>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[13px] font-medium group-hover:text-violetink transition-colors">
            olvasás
            <Icon name="arrow-up-right" size={14} stroke={2} />
          </span>
        </div>
      </div>
      <div className="md:col-span-5 border-t md:border-t-0 md:border-l border-line">
        <PostMedia image={post.image || { kind: "data", label: post.title }} team={topic} height={420} />
      </div>
    </button>
  );
}

// ── Sima bejegyzéskártya ──────────────────────────────────────────────
function PostCard({ post, topic, onOpen }) {
  return (
    <button onClick={onOpen}
      className="group text-left rounded-2xl ring-line bg-cream overflow-hidden card-hover hover:bg-creamdark flex flex-col h-full">
      {post.image && (
        <div className="overflow-hidden">
          <div className="transition-transform duration-500 group-hover:scale-[1.03]">
            <PostMedia image={post.image} team={topic} height={180} />
          </div>
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2">
          <CategoryChip slug={post.category} />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted ml-auto">
            {fmtDate(post.created_at)}
          </span>
        </div>
        <h4 className="mt-4 text-[20px] leading-[1.18] font-medium tracking-[-0.01em] text-balance">
          {post.title}
        </h4>
        <p className="mt-2.5 text-[14px] leading-[1.5] text-ink2 line-clamp-3">{post.excerpt}</p>
        <div className="mt-auto pt-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TeamMark team={topic} size={22} />
            <span className="text-[13px] font-medium">{topic?.name}</span>
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            {post.read} perc
          </span>
        </div>
        <span className="mt-5 -mb-6 -mx-6 h-1 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 bg-ink/80" />
      </div>
    </button>
  );
}

function EmptyFeed({ onClear }) {
  return (
    <div className="mt-16 rounded-2xl ring-line bg-cream p-12 text-center">
      <div className="font-serif-i text-[40px] leading-none">nincs találat.</div>
      <p className="mt-4 text-[15px] text-ink2 max-w-[44ch] mx-auto">
        A szűrőd túl szűk, vagy még senki nem írt erről. Talán te lehetsz az első?
      </p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <button onClick={onClear}
          className="btn-press inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-ink text-cream text-[13px]">
          szűrők törlése
        </button>
      </div>
    </div>
  );
}

// ── Bejegyzés-olvasó overlay ──────────────────────────────────────────
function PostOverlay({ post, topic, onClose, savedPostIds, onToggleSave, onEdit, onDelete }) {
  const [showComments, setShowComments] = useStateF(false);
  const [shareCopied, setShareCopied]   = useStateF(false);
  const [pendingAction, setPendingAction] = useStateF(null); // "edit" | "delete" | null
  const showCommentsRef = useRefF(showComments);
  showCommentsRef.current = showComments;

  useEffectF(() => {
    if (!post) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (showCommentsRef.current) setShowComments(false);
        else onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [post, onClose]);

  if (!post) return null;

  const isSaved = savedPostIds?.has(post.id);

  function handleShare() {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      }).catch(() => {});
    }
  }

  async function handlePasswordConfirm(pwd) {
    if (pendingAction === "delete") {
      const { error } = await supabase.deletePost(post.id, pwd);
      if (error) return error.message;
      onDelete?.(post.id);
      onClose();
      return null;
    }
    if (pendingAction === "edit") {
      const { error } = await supabase.checkPassword(post.id, pwd);
      if (error) return error.message;
      onEdit?.(post, pwd);
      onClose();
      return null;
    }
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 sm:p-8" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <article className="relative max-w-[820px] w-full max-h-[92vh] overflow-y-auto bg-cream ring-line rounded-2xl">
        <header className="sticky top-0 bg-cream/95 backdrop-blur border-b border-line px-6 py-3 flex items-center gap-3 z-10">
          <CategoryChip slug={post.category} />
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
            {fmtDate(post.created_at)} · {post.read} perc olvasás
          </span>
          <button onClick={onClose} className="ml-auto inline-flex items-center justify-center size-8 rounded-full hover:bg-creamdark">
            <Icon name="x" size={16} />
          </button>
        </header>

        {post.image && <PostMedia image={post.image} team={topic} height={300} />}

        <div className="p-6 sm:p-10">
          <h2 className="font-medium tracking-[-0.02em] leading-[1.02] text-[clamp(28px,3.6vw,42px)] text-balance">
            {post.title}
          </h2>
          <div className="mt-4 flex items-center gap-3">
            <TeamMark team={topic} size={32} />
            <div className="leading-tight">
              <div className="text-[14px] font-medium">{topic?.name}</div>
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">{topic?.focus}</div>
            </div>
          </div>

          <div className="mt-8 space-y-4" style={{ fontSize: "17px", lineHeight: "1.65", color: "#2A2620" }}>
            {post.content ? (
              <>
                {post.excerpt && (
                  <p className="font-serif-i text-[22px] leading-snug text-ink">{post.excerpt}</p>
                )}
                <div dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} />
              </>
            ) : post.excerpt ? (
              <p className="font-serif-i text-[22px] leading-snug text-ink">{post.excerpt}</p>
            ) : (
              <p className="text-[15px] text-muted italic">A bejegyzés szövege még nem elérhető.</p>
            )}
          </div>

          <footer className="mt-12 pt-6 border-t border-line flex flex-wrap gap-3 items-center justify-between">
            {/* szerkesztés / törlés */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPendingAction("edit")}
                className="btn-press inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-creamdark ring-line text-[12px] hover:bg-cream">
                <Icon name="pencil" size={14} /> Szerkesztés
              </button>
              <button
                onClick={() => setPendingAction("delete")}
                className="btn-press inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-[12px] text-coral ring-line hover:bg-coral/10 transition-colors">
                <Icon name="trash-2" size={14} /> Törlés
              </button>
            </div>

            {/* mentés / megjegyzések / megosztás */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleSave?.(post.id)}
                className={"btn-press inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-[12px] transition-colors " +
                  (isSaved ? "bg-ink text-cream" : "bg-creamdark ring-line hover:bg-cream")}>
                <Icon name={isSaved ? "bookmark-check" : "bookmark"} size={14} />
                {isSaved ? "Mentve" : "Mentés"}
              </button>
              <button
                onClick={() => setShowComments(true)}
                className="btn-press inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-creamdark ring-line text-[12px] hover:bg-cream">
                <Icon name="message-square" size={14} /> Megjegyzések
              </button>
              <button
                onClick={handleShare}
                className="btn-press inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-creamdark ring-line text-[12px] hover:bg-cream transition-colors">
                <Icon name={shareCopied ? "check" : "share-2"} size={14} />
                {shareCopied ? "Másolva!" : "Megosztás"}
              </button>
            </div>
          </footer>
        </div>
      </article>

      {showComments && (
        <CommentsModal postId={post.id} onClose={() => setShowComments(false)} />
      )}

      {pendingAction && (
        <PasswordModal
          title={pendingAction === "delete" ? "Bejegyzés törlése" : "Bejegyzés szerkesztése"}
          description={pendingAction === "delete"
            ? "A bejegyzés véglegesen törlődik. Add meg a létrehozáskor beállított jelszót."
            : "Add meg a bejegyzés létrehozásakor beállított jelszót."}
          confirmLabel={pendingAction === "delete" ? "Törlés" : "Szerkesztés megnyitása"}
          danger={pendingAction === "delete"}
          onConfirm={handlePasswordConfirm}
          onClose={() => setPendingAction(null)}
        />
      )}
    </div>
  );
}

// ── Jelszó megerősítő modal ───────────────────────────────────────────
function PasswordModal({ title, description, confirmLabel, danger, onConfirm, onClose }) {
  const [pwd, setPwd]       = useStateF("");
  const [err, setErr]       = useStateF("");
  const [working, setWorking] = useStateF(false);

  async function confirm() {
    if (!pwd.trim()) return;
    setWorking(true);
    setErr("");
    const errorMsg = await onConfirm(pwd.trim());
    setWorking(false);
    if (errorMsg) setErr(errorMsg);
    // onConfirm returns null on success and closes itself via parent
  }

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[360px] bg-cream ring-line rounded-2xl p-6 shadow-xl">
        <h3 className="font-medium text-[16px]">{title}</h3>
        {description && <p className="mt-1.5 text-[13px] text-muted leading-snug">{description}</p>}
        <input
          type="password"
          value={pwd}
          onChange={e => { setPwd(e.target.value); setErr(""); }}
          onKeyDown={e => { if (e.key === "Enter") confirm(); if (e.key === "Escape") onClose(); }}
          placeholder="Jelszó…"
          autoFocus
          className="mt-4 w-full h-10 px-3 rounded-lg bg-creamdark ring-line text-[13px] outline-none focus:ring-2 focus:ring-ink"
        />
        {err && <p className="mt-2 text-[12px] text-coral">{err}</p>}
        <div className="mt-4 flex gap-2">
          <button onClick={onClose}
            className="flex-1 h-9 rounded-full ring-line bg-creamdark text-[13px] hover:bg-cream transition-colors">
            Mégse
          </button>
          <button onClick={confirm} disabled={!pwd.trim() || working}
            className={"flex-1 h-9 rounded-full text-[13px] font-medium disabled:opacity-40 transition-colors " +
              (danger ? "bg-coral text-cream hover:bg-coral/80" : "bg-ink text-cream hover:bg-violetink")}>
            {working ? "…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Megjegyzések modal ────────────────────────────────────────────────
function CommentsModal({ postId, onClose }) {
  const [comments, setComments]   = useStateF([]);
  const [author, setAuthor]       = useStateF("");
  const [text, setText]           = useStateF("");
  const [loading, setLoading]     = useStateF(true);
  const [loadErr, setLoadErr]     = useStateF(null);
  const [submitting, setSubmitting] = useStateF(false);

  useEffectF(() => {
    setLoading(true);
    setLoadErr(null);
    supabase.listComments(postId).then(({ data, error }) => {
      if (error) setLoadErr(error.message);
      else setComments(data || []);
      setLoading(false);
    });
  }, [postId]);

  async function submit() {
    if (!text.trim()) return;
    setSubmitting(true);
    const { data, error } = await supabase.addComment({
      post_id: postId,
      author: author.trim() || "Névtelen",
      body: text.trim(),
    });
    setSubmitting(false);
    if (error) { alert(error.message); return; }
    if (data) setComments(prev => [...prev, data]);
    setText("");
  }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-4 sm:p-8" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-w-[520px] w-full max-h-[80vh] bg-cream ring-line rounded-2xl flex flex-col overflow-hidden">
        <header className="flex-shrink-0 border-b border-line px-6 py-4 flex items-center justify-between">
          <h3 className="font-medium text-[16px]">Megjegyzések</h3>
          <button onClick={onClose} className="size-8 grid place-items-center rounded-full hover:bg-creamdark">
            <Icon name="x" size={16} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[160px]">
          {loading ? (
            <p className="text-[14px] text-muted text-center py-8">Betöltés…</p>
          ) : loadErr ? (
            <p className="text-[13px] text-coral text-center py-8">{loadErr}</p>
          ) : comments.length === 0 ? (
            <p className="font-serif-i text-[18px] text-ink2 text-center py-8 leading-snug">
              Még nincs megjegyzés.<br />Legyél az első!
            </p>
          ) : (
            comments.map(c => (
              <div key={c.id} className="rounded-xl bg-creamdark p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] font-medium">{c.author}</span>
                  <span className="font-mono text-[10px] text-muted">{fmtDate(c.created_at)}</span>
                </div>
                <p className="text-[14px] leading-relaxed text-ink2">{c.body}</p>
              </div>
            ))
          )}
        </div>

        <div className="flex-shrink-0 border-t border-line p-4 space-y-2">
          <input value={author} onChange={e => setAuthor(e.target.value)}
            placeholder="Neved (opcionális)…"
            className="w-full h-9 px-3 rounded-lg bg-creamdark ring-line text-[13px] outline-none focus:ring-2 focus:ring-ink" />
          <textarea value={text} onChange={e => setText(e.target.value)}
            placeholder="Írd ide a megjegyzésedet…"
            rows={3}
            className="w-full p-3 rounded-lg bg-creamdark ring-line text-[13px] outline-none focus:ring-2 focus:ring-ink resize-none" />
          <button onClick={submit} disabled={!text.trim() || submitting}
            className="btn-press w-full h-9 rounded-full bg-ink text-cream text-[13px] font-medium disabled:opacity-40 hover:bg-violetink transition-colors">
            {submitting ? "Küldés…" : "Megjegyzés küldése"}
          </button>
        </div>
      </div>
    </div>
  );
}

function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("hu-HU", { year: "numeric", month: "short", day: "2-digit" }).toLowerCase();
}

Object.assign(window, { BlogFeed, PostOverlay, fmtDate, renderMarkdown });

// Bejegyzés-szerkesztő — teljes oldalas modal rich szövegszerkesztővel.

const { useState: useStateC, useEffect: useEffectC, useRef: useRefC } = React;

// ─── DOCX → HTML parser (mammoth.js) ─────────────────────────────────────────
const _TH_STYLE = 'border:1px solid #E4DDC9;padding:8px 12px;text-align:left;background:#F1ECDF;font-weight:600;font-size:13px;white-space:nowrap';
const _TD_STYLE = 'border:1px solid #E4DDC9;padding:8px 12px;font-size:13px;vertical-align:top';
const _TABLE_WRAP_OPEN  = '<div style="overflow-x:auto;margin:1.25rem 0"><table style="width:100%;border-collapse:collapse;line-height:1.5">';
const _TABLE_WRAP_CLOSE = '</table></div>';

async function parseDocxToHtml(file) {
  const mammoth = window.mammoth;
  if (!mammoth) throw new Error("mammoth.js nem töltődött be");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer });
  let html = result.value.trim();
  if (!html) return { title: "", content: "" };

  html = html
    // Tables — styled to match site palette
    .replace(/<table>/gi, _TABLE_WRAP_OPEN)
    .replace(/<\/table>/gi, _TABLE_WRAP_CLOSE)
    .replace(/<th(\s[^>]*)?>/gi, (_, a = "") => `<th${a} style="${_TH_STYLE}">`)
    .replace(/<td(\s[^>]*)?>/gi, (_, a = "") => `<td${a} style="${_TD_STYLE}">`)
    // Lists — Tailwind Preflight resets list-style; restore it inline
    .replace(/<ul>/gi, '<ul style="list-style:disc;padding-left:24px;margin:8px 0">')
    .replace(/<ol>/gi, '<ol style="list-style:decimal;padding-left:24px;margin:8px 0">')
    .replace(/<li>/gi, '<li style="margin:4px 0">')
    // Headings
    .replace(/<h1>/gi, '<h1 style="font-weight:600;font-size:26px;margin:32px 0 10px">')
    .replace(/<h2>/gi, '<h2 style="font-weight:600;font-size:21px;margin:28px 0 8px">')
    .replace(/<h3>/gi, '<h3 style="font-weight:600;font-size:18px;margin:20px 0 6px">')
    // Paragraphs
    .replace(/<p>/gi, '<p style="margin:0.75em 0;line-height:1.7">')
    // Links
    .replace(/<a /gi, '<a style="color:#6B3FE6;text-decoration:underline" ');

  const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  let title = "";
  let content = html;
  if (titleMatch) {
    title = titleMatch[1].replace(/<[^>]*>/g, "").trim();
    content = html.replace(titleMatch[0], "").trim();
  }
  return { title, content };
}


async function fetchOgMeta(url) {
  try {
    const res  = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);
    const json = await res.json();
    if (json.status !== "success") return null;
    return {
      title:       json.data.title       || "",
      description: json.data.description || "",
      ogImage:     json.data.image?.url  || json.data.screenshot?.url || "",
    };
  } catch { return null; }
}

function Composer({ open, onClose, onPublish, topics, editPost, editPassword }) {
  const [title, setTitle]       = useStateC("");
  const [topicId, setTopicId]   = useStateC(topics[0]?.id || "");
  const [category, setCategory] = useStateC(CATEGORIES[0].slug);
  const [tags, setTags]         = useStateC([]);
  const [tagInput, setTagInput] = useStateC("");
  const [content, setContent]   = useStateC("");
  const [imageUrl, setImageUrl] = useStateC("");
  const [excerpt, setExcerpt]   = useStateC("");
  const [password, setPassword] = useStateC("");
  const [saving, setSaving]     = useStateC(false);
  const [savedAt, setSavedAt]   = useStateC(null);
  const [view, setView]         = useStateC("edit");
  const [uploading, setUploading] = useStateC(false);
  const [docxParsing, setDocxParsing] = useStateC(false);
  const [docxMsg, setDocxMsg] = useStateC(null);
  const [sourceUrl, setSourceUrl]             = useStateC("");
  const [sourceMeta, setSourceMeta]           = useStateC(null);
  const [sourceFetching, setSourceFetching]   = useStateC(false);
  const [sourceFetchErr, setSourceFetchErr]   = useStateC("");
  const taRef = useRefC(null);

  const isEdit = !!editPost;

  // Billentyűzet + body overflow
  useEffectC(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [open, onClose]);

  // Szerkesztési módban: mezők feltöltése; új bejegyzésnél: reset
  useEffectC(() => {
    if (!open) return;
    if (editPost) {
      setTitle(editPost.title || "");
      setTopicId(editPost.team_id || topics[0]?.id || "");
      setCategory(editPost.category || CATEGORIES[0].slug);
      setTags(editPost.tags || []);
      setContent(editPost.content || "");
      setExcerpt(editPost.excerpt || "");
      setImageUrl(editPost.image?.label || "");
      setPassword(editPassword || "");
      setSourceUrl(editPost.source?.url || "");
      setSourceMeta(editPost.source ? {
        title: editPost.source.title || "",
        description: editPost.source.description || "",
        ogImage: editPost.source.ogImage || "",
      } : null);
    } else {
      setTitle(""); setContent(""); setTags([]); setExcerpt(""); setImageUrl(""); setPassword("");
      setSourceUrl(""); setSourceMeta(null); setSourceFetchErr("");
      setTopicId(topics[0]?.id || "");
      setCategory(CATEGORIES[0].slug);
    }
    setSavedAt(null);
  }, [open, editPost]);

  // Automatikus mentés-jelző
  useEffectC(() => {
    if (!open || (!title && !content)) return;
    setSaving(true);
    const t = setTimeout(() => { setSaving(false); setSavedAt(new Date()); }, 700);
    return () => clearTimeout(t);
  }, [title, content, topicId, category, tags, imageUrl, excerpt, open]);

  const topic = topics.find(t => t.id === topicId);
  const plainText = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const words = plainText ? plainText.split(/\s+/).length : 0;
  const readMin = Math.max(1, Math.round(words / 200));

  async function handleDocxFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setDocxParsing(true);
    setDocxMsg(null);
    try {
      const { title: dTitle, content: dHtml } = await parseDocxToHtml(file);
      if (!dTitle && !dHtml) { setDocxMsg({ ok: false, text: "Nem sikerült szöveget kinyerni a DOCX-ből." }); return; }
      if (dTitle && !title) setTitle(dTitle);
      setContent(dHtml);
      const words = dHtml.replace(/<[^>]*>/g, " ").trim().split(/\s+/).length;
      setDocxMsg({ ok: true, text: `Kész! ${words} szó importálva (HTML formátum).` });
    } catch (err) {
      setDocxMsg({ ok: false, text: "Hiba: " + err.message });
    } finally {
      setDocxParsing(false);
    }
  }

  async function handleImageFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { url, error } = await supabase.uploadImage(file);
    setUploading(false);
    if (error) { alert("Feltöltési hiba: " + error.message); return; }
    setImageUrl(url);
  }

  function addTag(raw) {
    const t = (raw || tagInput).trim().toLowerCase().replace(/[^a-z0-9-áéíóöőúüű]/g, "-");
    if (!t || tags.includes(t)) return;
    setTags([...tags, t]);
    setTagInput("");
  }
  function removeTag(t) { setTags(tags.filter(x => x !== t)); }

  async function handleFetchSource() {
    const url = sourceUrl.trim();
    if (!url) return;
    setSourceFetching(true);
    setSourceFetchErr("");
    setSourceMeta(null);
    const meta = await fetchOgMeta(url);
    setSourceFetching(false);
    if (!meta) {
      setSourceFetchErr("Nem sikerült lekérni az OG adatokat. Ellenőrizd az URL-t.");
      return;
    }
    setSourceMeta(meta);
  }

  async function publish() {
    if (!title.trim()) return;
    if (!password.trim()) { alert("Jelszó megadása kötelező."); return; }

    const payload = {
      title: title.trim(),
      team_id: topicId,
      category,
      tags,
      content,
      excerpt: excerpt || content.split("\n").find(l => l.trim()) || "",
      image: imageUrl ? { kind: "photo", label: imageUrl } : null,
      source: sourceUrl.trim() ? {
        url:         sourceUrl.trim(),
        title:       sourceMeta?.title       || "",
        description: sourceMeta?.description || "",
        ogImage:     sourceMeta?.ogImage     || "",
      } : null,
    };

    const sb = window.supabase;
    if (!sb) throw new Error("window.supabase is missing");

    if (isEdit) {
      const { data, error } = await sb.updatePost(editPost.id, password, payload);
      if (error) { alert(error.message); return; }
      onPublish(data, true);
    } else {
      const { data, error } = await sb.createPost({ ...payload, password });
      if (error) { alert(error.message); return; }
      onPublish(data, false);
    }
    setTitle(""); setContent(""); setTags([]); setExcerpt(""); setImageUrl(""); setPassword("");
    setSourceUrl(""); setSourceMeta(null); setSourceFetchErr("");
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-cream flex flex-col overflow-hidden" role="dialog" aria-modal="true">
      {/* felső sáv */}
      <div className="border-b border-line bg-cream flex-shrink-0 z-10">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 h-14 flex items-center gap-4">
          <button onClick={onClose} className="inline-flex items-center gap-1.5 text-[13px] text-ink2 hover:text-ink">
            <Icon name="chevron-left" size={14} /> bezárás
          </button>
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted hidden md:inline">
            {isEdit ? "szerkesztő / módosítás" : "szerkesztő / új bejegyzés"}
          </span>

          <div className="ml-auto flex items-center gap-2">
            <div className="text-[12px] text-muted hidden sm:block">
              {saving
                ? <span className="inline-flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-coral animate-pulse" />mentés…</span>
                : savedAt
                  ? <>automatikusan mentve {savedAt.toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" })}</>
                  : <>vázlat</>
              }
            </div>
            <ViewToggle view={view} onChange={setView} />
            <button onClick={publish} disabled={!title.trim() || !password.trim()}
              className="btn-press inline-flex items-center gap-2 h-9 pl-3 pr-4 rounded-full bg-ink text-cream text-[13px] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-violetink transition-colors">
              <Icon name={isEdit ? "save" : "send"} size={13} stroke={2} />
              {isEdit ? "Módosítás mentése" : "Közzétesz"}
            </button>
          </div>
        </div>
      </div>

      {/* görgethető tartalom */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-10 grid lg:grid-cols-12 gap-10">
          {/* főterület */}
          <div className="lg:col-span-8">
            {view === "edit" ? (
              <ComposerEdit
                title={title} setTitle={setTitle}
                content={content} setContent={setContent}
                taRef={taRef}
              />
            ) : (
              <ComposerPreview
                title={title || "Cím nélküli bejegyzés"}
                content={content}
                topic={topic}
                category={category}
                tags={tags}
                imageUrl={imageUrl}
              />
            )}
          </div>

          {/* oldalsáv */}
          <aside className="lg:col-span-4 space-y-6">
            <SideCard title="Állapot">
              <Row label="Szavak">{words}</Row>
              <Row label="Olvasási idő">{readMin} perc</Row>
              <Row label="Mentve">{savedAt ? savedAt.toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" }) : "—"}</Row>
            </SideCard>

            <SideCard
              title={isEdit ? "Jelszó ellenőrzés" : "Jelszó (kötelező)"}
              hint={isEdit
                ? "A módosítás mentéséhez add meg az eredeti jelszót."
                : "Erre szükséged lesz a szerkesztéshez és törléshez. Jegyezd meg!"}
            >
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={isEdit ? "Add meg az eredeti jelszót…" : "Válassz egy jelszót…"}
                className="w-full h-10 px-3 rounded-lg bg-cream ring-line text-[13px] outline-none focus:ring-2 focus:ring-ink"
              />
              {!isEdit && (
                <p className="mt-2 text-[11px] text-coral leading-snug">
                  ⚠ Ezt a jelszót kéri majd a rendszer szerkesztéskor és törlésnél.
                </p>
              )}
            </SideCard>

            <SideCard title="Témakör" hint="Melyik csapat publikálja ezt?">
              <div className="grid grid-cols-3 gap-2">
                {topics.map(t => (
                  <button key={t.id} onClick={() => setTopicId(t.id)}
                    className={"group rounded-lg p-2 ring-line flex flex-col items-center gap-1.5 transition " +
                      (topicId === t.id ? "ring-2 !ring-ink bg-creamdark" : "hover:bg-creamdark")}>
                    <TeamMark team={t} size={28} />
                    <span className="text-[10px] leading-none text-center">{t.name}</span>
                  </button>
                ))}
              </div>
            </SideCard>

            <SideCard title="Kategória" hint="Válassz egyet — ez alapján kerül a tudásfelhőbe.">
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map(c => (
                  <CategoryChip key={c.slug} slug={c.slug} active={category === c.slug}
                    onClick={() => setCategory(c.slug)} />
                ))}
              </div>
            </SideCard>

            <SideCard title="Címkék" hint="Legfeljebb 6 szabad címke. Nyomj entert.">
              <div className="flex flex-wrap gap-1.5">
                {tags.map(t => (
                  <span key={t} className="inline-flex items-center gap-1 h-7 pl-2.5 pr-1.5 rounded-full bg-creamdark text-[12px] font-mono">
                    #{t}
                    <button onClick={() => removeTag(t)} className="size-4 grid place-items-center rounded-full hover:bg-cream">
                      <Icon name="x" size={10} stroke={2.4} />
                    </button>
                  </span>
                ))}
                {tags.length < 6 && (
                  <input value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
                    placeholder="címke hozzáadása…"
                    className="h-7 px-2 rounded-full bg-cream ring-line text-[12px] outline-none focus:ring-2 focus:ring-ink" />
                )}
              </div>
            </SideCard>

            <SideCard title="DOCX importálás" hint="Feltöltés után automatikusan kitölti a cím és tartalom mezőket.">
              <label className={"btn-press inline-flex items-center gap-2 h-9 px-3 rounded-full ring-line text-[12px] cursor-pointer transition-colors " +
                (docxParsing ? "bg-creamdark text-muted" : "bg-ink text-cream hover:bg-violetink")}>
                <Icon name={docxParsing ? "loader" : "file-text"} size={14} />
                {docxParsing ? "Feldolgozás…" : "DOCX betöltése"}
                <input type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleDocxFile} className="sr-only" disabled={docxParsing} />
              </label>
              {docxMsg && (
                <p className={"mt-2 text-[12px] leading-snug " + (docxMsg.ok ? "text-lime-600" : "text-coral")}>
                  {docxMsg.ok ? "✓ " : "✗ "}{docxMsg.text}
                </p>
              )}
              <p className="mt-2 text-[11px] text-muted leading-snug">
                A meglévő tartalmat felülírja. A cím csak akkor töltődik ki, ha az üres.
              </p>
            </SideCard>

            <SideCard title="Forrás hozzáadása" hint="Linkeld be a témakör forrását — megjelenik a bejegyzés alatt kártyaként.">
              <div className="flex gap-2">
                <input
                  value={sourceUrl}
                  onChange={e => { setSourceUrl(e.target.value); setSourceFetchErr(""); if (!e.target.value.trim()) setSourceMeta(null); }}
                  onKeyDown={async e => { if (e.key === "Enter") { e.preventDefault(); await handleFetchSource(); } }}
                  placeholder="https://…"
                  className="flex-1 h-9 px-3 rounded-lg bg-cream ring-line text-[13px] outline-none focus:ring-2 focus:ring-ink font-mono"
                />
                <button
                  onClick={handleFetchSource}
                  disabled={!sourceUrl.trim() || sourceFetching}
                  className={"btn-press inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-[12px] transition-colors " +
                    (sourceFetching ? "bg-creamdark text-muted" : "bg-ink text-cream hover:bg-violetink disabled:opacity-40")}>
                  <Icon name={sourceFetching ? "loader" : "link"} size={13} />
                  {sourceFetching ? "…" : "Lekérés"}
                </button>
              </div>
              {sourceFetchErr && (
                <p className="mt-2 text-[12px] text-coral">{sourceFetchErr}</p>
              )}
              {sourceMeta && (
                <div className="mt-3 rounded-xl ring-line overflow-hidden bg-creamdark">
                  {sourceMeta.ogImage && (
                    <img src={sourceMeta.ogImage} alt="" className="w-full h-32 object-cover" />
                  )}
                  <div className="p-3 flex flex-col gap-1">
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                      {(() => { try { return new URL(sourceUrl).hostname.replace("www.", ""); } catch { return sourceUrl; } })()}
                    </span>
                    {sourceMeta.title && (
                      <span className="text-[13px] font-medium leading-snug">{sourceMeta.title}</span>
                    )}
                    {sourceMeta.description && (
                      <span className="text-[11px] text-ink2 leading-snug line-clamp-2">{sourceMeta.description}</span>
                    )}
                  </div>
                  <button
                    onClick={() => { setSourceUrl(""); setSourceMeta(null); setSourceFetchErr(""); }}
                    className="w-full py-1.5 text-[11px] text-coral hover:bg-coral/10 transition-colors border-t border-line">
                    Forrás eltávolítása
                  </button>
                </div>
              )}
            </SideCard>

            <SideCard title="Kiemelt kép" hint="Tölts fel fájlt, vagy add meg a kép URL-jét.">
              <label className={"btn-press inline-flex items-center gap-2 h-9 px-3 rounded-full ring-line text-[12px] cursor-pointer transition-colors " +
                (uploading ? "bg-creamdark text-muted" : "bg-creamdark hover:bg-cream")}>
                <Icon name={uploading ? "loader" : "upload"} size={14} />
                {uploading ? "Feltöltés…" : "Kép feltöltése"}
                <input type="file" accept="image/*" onChange={handleImageFile} className="sr-only" disabled={uploading} />
              </label>
              <p className="mt-2 mb-1 text-[11px] text-muted">vagy URL megadása:</p>
              <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://…"
                className="w-full h-10 px-3 rounded-lg bg-cream ring-line text-[13px] outline-none focus:ring-2 focus:ring-ink font-mono" />
              {imageUrl && (
                <div className="mt-3 rounded-lg overflow-hidden ring-line">
                  <PostMedia image={{ kind: "photo", label: imageUrl }} team={topic} height={140} />
                </div>
              )}
            </SideCard>

            <SideCard title="Összefoglaló" hint="Opcionális. A kártyán jelenik meg. Ha üres, az első bekezdésből töltődik ki.">
              <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                placeholder="Egy-két mondatos összefoglaló…"
                className="w-full p-3 rounded-lg bg-cream ring-line text-[13px] outline-none focus:ring-2 focus:ring-ink leading-snug resize-none" />
            </SideCard>

            <details className="rounded-2xl bg-creamdark ring-line p-4 text-[12px]">
              <summary className="cursor-pointer font-mono uppercase tracking-[0.22em] text-muted">
                · supabase hívás előnézete
              </summary>
              <pre className="mt-3 overflow-x-auto font-mono text-[11px] leading-relaxed text-ink2 whitespace-pre-wrap">
{`await supabase
  .from('posts')
  .${isEdit ? "update({...})" : "insert({"}
    title: ${JSON.stringify(title || "")},
    team_id: ${JSON.stringify(topicId)},
    category: ${JSON.stringify(category)},
    tags: ${JSON.stringify(tags)},
    content: <${words} szó>,
    image_url: ${JSON.stringify(imageUrl || null)},
    excerpt: ${JSON.stringify(excerpt || "")}
  ${isEdit ? `})\n  .eq('id', '${editPost?.id?.slice(0, 8) ?? "…"}…')` : "})\n  .select()\n  .single()"}`}
              </pre>
            </details>
          </aside>
        </div>
      </div>
    </div>
  );
}

function ViewToggle({ view, onChange }) {
  return (
    <div className="inline-flex items-center bg-creamdark ring-line rounded-full p-0.5 text-[12px]">
      {[["edit", "szerkesztés"], ["preview", "előnézet"]].map(([v, label]) => (
        <button key={v} onClick={() => onChange(v)}
          className={"h-8 px-3 rounded-full " + (view === v ? "bg-cream ring-line shadow-[0_1px_0_rgba(19,17,15,0.05)]" : "text-muted")}>
          {label}
        </button>
      ))}
    </div>
  );
}

function ComposerEdit({ title, setTitle, content, setContent, taRef }) {
  return (
    <div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add meg a bejegyzés címét…"
        className="w-full bg-transparent outline-none font-medium tracking-[-0.02em] leading-[1.02] text-[clamp(32px,4.4vw,52px)] placeholder:text-ink/30"
      />
      <div className="mt-4 h-px bg-line" />
      <Toolbar onAction={(act) => insertFormatting(taRef.current, act, setContent)} />
      <textarea
        ref={taRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={`Írd le, amit felfedeztél.\n\nMarkdown formázás is működik — # fejléc, **félkövér**, *dőlt*, - lista, > idézet, \`kód\`.\n\nNe gondolkozz túl sokat. A rövid és őszinte jobb, mint a hosszú és csiszolt.`}
        rows={18}
        className="mt-4 w-full bg-transparent outline-none text-[17px] leading-[1.65] text-ink resize-none placeholder:text-muted/70"
      />
    </div>
  );
}

function Toolbar({ onAction }) {
  const items = [
    { id: "h1", icon: "heading-1", label: "H1" },
    { id: "h2", icon: "heading-2", label: "H2" },
    { id: "b",  icon: "bold",      label: "Félkövér" },
    { id: "i",  icon: "italic",    label: "Dőlt" },
    { id: "ul", icon: "list",      label: "Lista" },
    { id: "ol", icon: "list-ordered", label: "Számozott" },
    { id: "q",  icon: "quote",     label: "Idézet" },
    { id: "code", icon: "code",    label: "Kód" },
    { id: "link", icon: "link",    label: "Link" },
    { id: "hr", icon: "minus",     label: "Elválasztó" },
  ];
  return (
    <div className="inline-flex items-center gap-0.5 mt-3 p-1 rounded-full bg-creamdark ring-line">
      {items.map(it => (
        <button key={it.id}
          onClick={() => onAction(it.id)}
          title={it.label}
          className="size-8 grid place-items-center rounded-full hover:bg-cream text-ink2 hover:text-ink">
          <Icon name={it.icon} size={14} />
        </button>
      ))}
    </div>
  );
}

function insertFormatting(ta, act, setContent) {
  if (!ta) return;
  const { selectionStart: s, selectionEnd: e, value } = ta;
  const sel = value.slice(s, e) || "szöveg";
  const wrap = (pre, post = pre) => pre + sel + post;
  const linePre = (pre) => pre + sel;
  const out = ({
    h1: linePre("# "),
    h2: linePre("## "),
    b: wrap("**"),
    i: wrap("*"),
    ul: linePre("- "),
    ol: linePre("1. "),
    q: linePre("> "),
    code: wrap("`"),
    link: `[${sel}](https://)`,
    hr: "\n---\n",
  })[act] || sel;
  const next = value.slice(0, s) + out + value.slice(e);
  setContent(next);
  requestAnimationFrame(() => { ta.focus(); ta.selectionStart = ta.selectionEnd = s + out.length; });
}

function ComposerPreview({ title, content, topic, category, tags, imageUrl }) {
  return (
    <article>
      <CategoryChip slug={category} />
      <h1 className="mt-5 font-medium tracking-[-0.02em] leading-[1.02] text-[clamp(32px,4.4vw,52px)] text-balance">{title}</h1>
      <div className="mt-4 flex items-center gap-3">
        <TeamMark team={topic} size={28} />
        <span className="text-[14px] font-medium">{topic?.name}</span>
        <span className="text-[12px] text-muted font-mono">· {fmtDate(new Date().toISOString())} · vázlat</span>
      </div>
      {imageUrl && (
        <div className="mt-6 rounded-xl overflow-hidden ring-line">
          <PostMedia image={{ kind: "photo", label: imageUrl }} team={topic} height={300} />
        </div>
      )}
      <div className="mt-8" dangerouslySetInnerHTML={{ __html: renderMarkdown(content || "*Kezdj el írni bal oldalon, hogy itt megjelenjen az élő előnézet.*") }} />
      {tags.length > 0 && (
        <div className="mt-10 pt-6 border-t border-line flex flex-wrap gap-1.5">
          {tags.map(t => <span key={t} className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">#{t}</span>)}
        </div>
      )}
    </article>
  );
}

function renderMarkdown(src) {
  if (!src) return "";
  const esc = s => s.replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const inline = raw => esc(raw)
    .replace(/!\[\]\(([^)]+)\)/g, '<img src="$1" alt="" style="max-width:100%;border-radius:6px;margin:4px 0;display:block">')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:#6B3FE6;text-decoration:underline">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g,     '<em>$1</em>')
    .replace(/`([^`]+)`/g,       '<code style="font-family:JetBrains Mono,monospace;font-size:13px;background:#F1ECDF;padding:1px 5px;border-radius:4px">$1</code>');
  const parseTblRow = line => line.split('|').slice(1,-1).map(c => c.trim());
  const isTblSep   = line => /^\|[\s\-:]+\|/.test(line.trim());
  const TH = 'border:1px solid #E4DDC9;padding:8px 12px;text-align:left;background:#F1ECDF;font-weight:600;font-size:13px;white-space:nowrap';
  const TD = 'border:1px solid #E4DDC9;padding:8px 12px;font-size:13px;vertical-align:top';

  const out = [];
  for (const raw of src.split(/\n{2,}/)) {
    const block = raw.trim();
    if (!block) continue;
    const lines = block.split('\n');
    const first = lines[0].trim();

    // Raw HTML passthrough — any tag (covers mammoth output, avoids double-escaping entities)
    if (/^<[a-zA-Z]/.test(first)) {
      out.push(block);
      continue;
    }

    // Heading
    const hm = first.match(/^(#{1,3})\s+(.*)/);
    if (hm) {
      const [sz,mg] = [['26px','21px','18px'],['32px 0 10px','28px 0 8px','20px 0 6px']][0];
      const n = hm[1].length;
      out.push(`<h${n} style="font-weight:600;font-size:${['26px','21px','18px'][n-1]};margin:${['32px 0 10px','28px 0 8px','20px 0 6px'][n-1]}">${inline(hm[2])}</h${n}>`);
      continue;
    }
    // HR
    if (/^---+$/.test(first)) { out.push('<hr style="border:none;border-top:1px solid #E4DDC9;margin:24px 0"/>'); continue; }
    // Blockquote
    if (lines.every(l => /^>/.test(l.trim()))) {
      out.push(`<blockquote style="padding-left:16px;border-left:2px solid #6B3FE6;font-style:italic;color:#2A2620;margin:12px 0">${
        lines.map(l => inline(l.trim().replace(/^>\s?/,''))).join('<br/>')}</blockquote>`);
      continue;
    }
    // Markdown table: | ... | / | --- | / | ... |
    if (lines.length >= 2 && /^\|/.test(first) && isTblSep(lines[1]||'')) {
      const headers = parseTblRow(lines[0]);
      const bodyRows = lines.slice(2).filter(l => /^\|/.test(l.trim()));
      const thead = `<thead><tr>${headers.map(h=>`<th style="${TH}">${inline(h)}</th>`).join('')}</tr></thead>`;
      const tbody = bodyRows.length
        ? `<tbody>${bodyRows.map(r => {
            const cells = parseTblRow(r);
            while (cells.length < headers.length) cells.push('');
            return `<tr>${cells.slice(0,headers.length).map(c=>`<td style="${TD}">${inline(c)}</td>`).join('')}</tr>`;
          }).join('')}</tbody>`
        : '';
      out.push(`<div style="overflow-x:auto;margin:1.25rem 0"><table style="width:100%;border-collapse:collapse;line-height:1.5">${thead}${tbody}</table></div>`);
      continue;
    }
    // Standalone image
    if (lines.length === 1 && /^!\[\]\([^)]+\)$/.test(first)) {
      out.push(`<img src="${first.match(/!\[\]\(([^)]+)\)/)[1]}" alt="kép" style="max-width:100%;border-radius:8px;margin:1rem 0;display:block">`);
      continue;
    }
    // Unordered list
    if (lines.every(l => /^[-•]\s/.test(l.trim()))) {
      out.push(`<ul style="list-style:disc;padding-left:24px;margin:8px 0">${
        lines.map(l=>`<li style="margin:4px 0">${inline(l.trim().replace(/^[-•]\s+/,''))}</li>`).join('')}</ul>`);
      continue;
    }
    // Ordered list
    if (lines.every(l => /^\d+[.)]\s/.test(l.trim()))) {
      out.push(`<ol style="list-style:decimal;padding-left:24px;margin:8px 0">${
        lines.map(l=>`<li style="margin:4px 0">${inline(l.trim().replace(/^\d+[.)]\s+/,''))}</li>`).join('')}</ol>`);
      continue;
    }
    // Paragraph
    out.push(`<p style="margin:0.75em 0;line-height:1.7">${lines.map(l=>inline(l)).join('<br/>')}</p>`);
  }
  return out.join('\n');
}

function SideCard({ title, hint, children }) {
  return (
    <section className="rounded-2xl bg-cream ring-line p-5">
      <h4 className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">{title}</h4>
      {hint && <p className="mt-1 text-[12px] text-ink2/80 leading-snug">{hint}</p>}
      <div className="mt-3.5">{children}</div>
    </section>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-[13px]">
      <span className="text-muted">{label}</span>
      <span className="font-medium">{children}</span>
    </div>
  );
}

Object.assign(window, { Composer });

// Tutorial — első indítás útmutató, 12 lépéses animált onboarding.

const { useState: useStateT, useEffect: useEffectT } = React;

const TUTORIAL_KEY = "ok:tutorial:v3";

const STEPS = [
  {
    icon: "sparkles",
    color: "#6B3FE6",
    bg: "#EFE7FF",
    eyebrow: "üdvözlet · 1 / 12",
    title: "Üdvözöl az Osztály!",
    body: "Ez a 12.i osztály projektmenedzsment tudásbázisa. 9 csapat dolgozik egy-egy témán, és itt osztják meg kutatásaikat, vázlataikat és összefoglalóikat. Ez a 12 lépéses bemutató segít eligazodni — bármikor visszahívható a fejléc '?' gombjával.",
    tip: "Az oldalon minden bejegyzés jelszóval védett, így csak a szerzők módosíthatják őket.",
    demo: "overview",
  },
  {
    icon: "layout-grid",
    color: "#F26A4B",
    bg: "#FFE4DC",
    eyebrow: "témakörök · 2 / 12",
    title: "A 9 témakör-kártya",
    body: "A kezdőlapon 9 kártya mutatja a csapatokat. Minden kártyán látható a csapat neve, fókusza, a tagok száma és az aktuális bejegyzésszám. Kattints bármelyikre a csapat részletes oldalának megnyitásához.",
    tip: "Görgess le a kezdőlapon a kártyák megtekintéséhez — az első szekció a témakörök.",
    demo: "teams",
  },
  {
    icon: "users",
    color: "#1B4B8F",
    bg: "#DCE9FB",
    eyebrow: "csapat oldal · 3 / 12",
    title: "Csapat részletes oldal",
    body: "Minden csapatnak saját aloldala van. Itt megtalálod: a tagok nevét, az altémák listáját, a felhasznált szoftvereket és a csapat összes bejegyzését. Vissza gombbal visszatérhetsz a főoldalra.",
    tip: "A csapat jelvénye (színes kör az emojival) mindenhol megjelenik — a kártyákon, a feedben és a bejegyzésekben is.",
    demo: "teampage",
  },
  {
    icon: "circle-dot",
    color: "#0E5C5F",
    bg: "#DCEEEF",
    eyebrow: "tudásfelhő · 4 / 12",
    title: "Kategória-szűrő",
    body: "A Tudásfelhő 6 buborékja 6 tartalomtípust képvisel: Kutatás, Design, Kódolás, Prezentáció, Terepgyakorlat és Írás. Kattints egy buborékra — a feed azonnal szűr. A szűrőt a 'törlés' gombbal törölheted.",
    tip: "Egyszerre csak egy kategória aktív, de a témakör-szűrővel kombinálható.",
    demo: "cloud",
  },
  {
    icon: "newspaper",
    color: "#3F5C12",
    bg: "#E7F2DC",
    eyebrow: "feed + keresés · 5 / 12",
    title: "Bejegyzések böngészése",
    body: "A feed fordított időrendben mutatja az összes bejegyzést. Az első mindig kiemelt kártyaként jelenik meg. A fejléc keresőjébe gépelve valós időben szűrsz cím és összefoglaló szerint. A 'Mentett bejegyzések' gombbal csak a könyvjelzőzött cikkek jelennek meg.",
    tip: "A kártyán látod a kategória chippet, a dátumot, az olvasási időt és a csapat jelvényét.",
    demo: "feed",
  },

  // ── POSZTOLÁS — 5 dedikált lépés ─────────────────────────────────────

  {
    icon: "plus-circle",
    color: "#7B1F61",
    bg: "#F6E3F0",
    eyebrow: "új bejegyzés · 6 / 12",
    title: "Hogyan indíts bejegyzést?",
    body: "Az 'Új bejegyzés' gomb a fejléc jobb felső sarkában található — sötét háttérrel, könnyen megtalálható. Kattints rá: megnyílik a szerkesztő panel. Bárki írhat bejegyzést, nincs bejelentkezési követelmény. Az elkészült cikkek, kutatási jegyzetek és összefoglalók így kerülnek fel az osztály közös tudásbázisába.",
    tip: "A fejléc rögzített marad görgetés közben is — az 'Új bejegyzés' gomb mindig elérhető az oldal tetején.",
    demo: "composerOpen",
  },
  {
    icon: "list",
    color: "#7B1F61",
    bg: "#F6E3F0",
    eyebrow: "alap adatok · 7 / 12",
    title: "Cím, témakör és kategória",
    body: "A szerkesztőben három mező kötelező — nélkülük a bejegyzés nem tehető közzé:",
    bullets: [
      { icon: "type",       color: "#7B1F61", text: "Cím — rövid, velős; max. 80 karakter ajánlott (pl. 'A projekt keretei – határidő és költség')" },
      { icon: "users",      color: "#7B1F61", text: "Témakör — válaszd a te csapatod témakörét (9 lehetőség a legördülőből)" },
      { icon: "tag",        color: "#7B1F61", text: "Kategória — Kutatás / Design / Kódolás / Prezentáció / Terepgyakorlat / Írás" },
      { icon: "align-left", color: "#7B1F61", text: "Összefoglaló — opcionális, de ajánlott: 1-2 mondat, ez látszik a feed-kártyán" },
    ],
    demo: "composerFields",
  },
  {
    icon: "file-text",
    color: "#6B4A00",
    bg: "#FFEEBB",
    eyebrow: "tartalom írása · 8 / 12",
    title: "Tartalom Markdown-ban",
    body: "A hosszabb tartalmat a szövegmezőbe írd Markdown jelöléssel. Nem kell mindent tudni — ezek elégek a legtöbb esethez:",
    bullets: [
      { icon: "hash", color: "#6B4A00", text: "# Nagy cím     ## Alcím     ### Kisebb alcím" },
      { icon: "bold", color: "#6B4A00", text: "**félkövér**   és   *dőlt* szöveg" },
      { icon: "list", color: "#6B4A00", text: "- Felsorolás pont   1. Számozott lista elem" },
      { icon: "code", color: "#6B4A00", text: "`kódrészlet`   és   > idézet (blockquote)" },
    ],
    tip: "Ha a tartalom mező üres, csak az összefoglaló jelenik meg a feedben. Hosszabb cikkeknél töltsd ki.",
    demo: "composerMarkdown",
  },
  {
    icon: "image",
    color: "#0E5C5F",
    bg: "#DCEEEF",
    eyebrow: "kép hozzáadása · 9 / 12",
    title: "Kiemelt kép hozzáadása",
    body: "A jobb oldali panelen adhatsz kiemelt képet — megjelenik a feed-kártyán és az overlay tetején is. Kétféleképpen adható meg:",
    bullets: [
      { icon: "upload", color: "#0E5C5F", text: "Fájl feltöltése — kattints a 'Kép kiválasztása' gombra, majd válassz JPG / PNG / GIF / WebP képet (max. 5 MB). A kép Supabase Storage-ba töltődik fel automatikusan." },
      { icon: "link",   color: "#0E5C5F", text: "URL beillesztése — illeszd be egy nyilvánosan elérhető kép teljes webcímét (https://...) az URL mezőbe." },
    ],
    tip: "A kép opcionális — nélküle is közzétehető a bejegyzés. Ha mindkettőt megadod, a feltöltött fájl URL-je érvényes.",
    demo: "composerImage",
  },
  {
    icon: "lock",
    color: "#13110F",
    bg: "#E8E4DC",
    eyebrow: "jelszó + közzétevés · 10 / 12",
    title: "Jelszó és közzétevés",
    body: "Mielőtt közzéteszed, adj meg egy jelszót. Ez nem a te fiókod jelszava — egy egyedi kód, amit te találsz ki, és a rendszer eltárol a bejegyzésnél. Erre lesz szükség, ha később szerkeszteni vagy törölni akarod a bejegyzést. Ha minden kész, kattints a 'Közzétesz' gombra — a bejegyzés azonnal megjelenik a feedben.",
    warning: "⚠ A jelszót nem lehet visszaállítani! Ha elveszíted, a bejegyzést nem tudod módosítani vagy törölni. Írj fel biztonságos helyre.",
    tip: "Tipp: válassz 4–8 karakteres, megjegyezhető szót vagy számot. Nem kell bonyolultnak lennie.",
    demo: "composerPublish",
  },

  // ── OLVASÁS ÉS ESZKÖZÖK ───────────────────────────────────────────────

  {
    icon: "book-open",
    color: "#6B4A00",
    bg: "#FFEEBB",
    eyebrow: "bejegyzés olvasás · 11 / 12",
    title: "Bejegyzés megnyitása",
    body: "Kattints bármely kártyára az overlay megnyitásához. Láthatod a teljes szöveget, a csapat adatait és az összes metaadatot. Az overlay fejlécén a kategória chip a tudásfelhő szűrőre is vonatkozik. Bezárás: X gomb, háttérre kattintás, vagy Esc billentyű.",
    tip: "Ha a bejegyzésnek van kiemelt képe (URL vagy feltöltött), az az overlay tetején jelenik meg.",
    demo: "overlay",
  },
  {
    icon: "shield-check",
    color: "#13110F",
    bg: "#E8E4DC",
    eyebrow: "bejegyzés eszközök · 12 / 12",
    title: "Mit tehetsz egy cikkel?",
    body: "Az overlay alján 5 gomb érhető el minden bejegyzésnél:",
    bullets: [
      { icon: "pencil",         color: "#6B3FE6", text: "Szerkesztés — jelszóval megnyílik a szerkesztő az összes mezővel kitöltve" },
      { icon: "trash-2",        color: "#F26A4B", text: "Törlés — jelszóval véglegesen törli az adatbázisból (nem visszaállítható)" },
      { icon: "bookmark",       color: "#3F5C12", text: "Mentés — könyvjelző a feedben, a 'Mentett bejegyzések' gombbal szűrhető" },
      { icon: "message-square", color: "#1B4B8F", text: "Megjegyzések — komment popup: olvasás és írás névvel vagy névtelenül" },
      { icon: "share-2",        color: "#6B4A00", text: "Megosztás — az oldal URL-jét másolja a vágólapra, a gomb visszajelzést ad" },
    ],
    demo: "actions",
  },
];

// ── Tutorial fő komponens ─────────────────────────────────────────────
function Tutorial() {
  const [show, setShow]       = useStateT(() => !localStorage.getItem(TUTORIAL_KEY));
  const [step, setStep]       = useStateT(0);
  const [animKey, setAnimKey] = useStateT(0);

  useEffectT(() => {
    const open = () => { setStep(0); setAnimKey(k => k + 1); setShow(true); };
    window.addEventListener("ok:tutorial:open", open);
    return () => window.removeEventListener("ok:tutorial:open", open);
  }, []);

  if (!show) return null;

  const total = STEPS.length;
  const s = STEPS[step];
  const isLast = step === total - 1;
  const progress = ((step + 1) / total) * 100;

  function finish() { localStorage.setItem(TUTORIAL_KEY, "1"); setShow(false); }
  function goTo(n) { setAnimKey(k => k + 1); setStep(n); }
  function next() { isLast ? finish() : goTo(step + 1); }
  function back() { if (step > 0) goTo(step - 1); }

  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-md" onClick={finish} />

      <div className="relative w-full sm:max-w-[640px] bg-cream rounded-t-[28px] sm:rounded-2xl overflow-hidden flex flex-col"
           style={{ maxHeight: "92vh", boxShadow: "0 32px 100px -16px rgba(19,17,15,0.6), 0 0 0 1px rgba(19,17,15,0.08)" }}>

        {/* Progress bar */}
        <div className="h-[3px] shrink-0" style={{ background: "#E4DDC9" }}>
          <div style={{ width: `${progress}%`, height: "100%", background: s.color, transition: "width 500ms cubic-bezier(.2,.7,.2,1), background 400ms ease" }} />
        </div>

        {/* Top: dots + skip */}
        <div className="shrink-0 flex items-center justify-between px-7 py-3 border-b border-line">
          <div className="flex items-center gap-1.5">
            {STEPS.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} aria-label={`${i + 1}. lépés`}
                style={{
                  height: "8px",
                  width: i === step ? "20px" : "8px",
                  borderRadius: "999px",
                  background: i < step ? s.color + "90" : i === step ? s.color : "#E4DDC9",
                  transition: "all 350ms ease",
                }} />
            ))}
          </div>
          <button onClick={finish}
            className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-muted hover:text-ink transition-colors">
            Kihagyás <Icon name="x" size={11} stroke={2.2} />
          </button>
        </div>

        {/* Content — scrollable */}
        <div key={animKey} className="flex-1 overflow-y-auto px-7 sm:px-10 pt-7 pb-4"
             style={{ animation: "tutSlide 280ms cubic-bezier(.2,.7,.2,1)" }}>

          {/* Icon */}
          <div className="inline-flex items-center justify-center size-14 rounded-2xl mb-5"
               style={{ background: s.bg, color: s.color }}>
            <Icon name={s.icon} size={26} stroke={1.7} />
          </div>

          <div className="font-mono text-[10px] uppercase tracking-[0.28em] mb-2" style={{ color: s.color }}>
            {s.eyebrow}
          </div>
          <h2 className="font-medium leading-tight tracking-[-0.02em] mb-3"
              style={{ fontSize: "clamp(21px, 4.5vw, 28px)" }}>
            {s.title}
          </h2>
          <p className="text-[14px] sm:text-[15px] leading-[1.65] text-ink2">{s.body}</p>

          {s.bullets && (
            <ul className="mt-4 space-y-2.5">
              {s.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-[13px] text-ink2">
                  <span className="inline-flex items-center justify-center size-7 rounded-lg shrink-0 mt-0.5"
                        style={{ background: b.color + "18", color: b.color }}>
                    <Icon name={b.icon} size={13} stroke={1.9} />
                  </span>
                  {b.text}
                </li>
              ))}
            </ul>
          )}

          {s.warning && (
            <div className="mt-4 px-4 py-3 rounded-xl text-[13px] leading-snug font-medium"
                 style={{ background: s.bg, color: s.color }}>
              {s.warning}
            </div>
          )}

          {s.tip && (
            <div className="mt-4 flex items-start gap-2 px-3 py-2.5 rounded-lg bg-creamdark text-[12px] text-muted">
              <Icon name="info" size={13} stroke={2} className="shrink-0 mt-0.5" />
              {s.tip}
            </div>
          )}

          {/* Animated demo */}
          <TutorialDemo type={s.demo} color={s.color} bg={s.bg} animKey={animKey} />
        </div>

        {/* Navigation — fixed bottom */}
        <div className="shrink-0 px-7 sm:px-10 py-5 flex items-center justify-between border-t border-line/50">
          <button onClick={back} disabled={step === 0}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-[13px] text-ink2 hover:bg-creamdark disabled:opacity-0 transition-all">
            <Icon name="arrow-left" size={14} /> Vissza
          </button>
          <button onClick={next}
            className="btn-press inline-flex items-center gap-2 h-9 px-5 rounded-full text-[13px] font-medium text-cream transition-all"
            style={{ background: s.color }}>
            {isLast
              ? <><Icon name="check" size={14} /> Kezdjük el!</>
              : <>Következő <Icon name="arrow-right" size={14} /></>
            }
          </button>
        </div>
      </div>

      <TutorialStyles />
    </div>
  );
}

// ── Demo animációk ─────────────────────────────────────────────────────
function TutorialDemo({ type, color, bg, animKey }) {
  if (!type) return null;
  const demos = {
    overview:        DemoOverview,
    teams:           DemoTeams,
    teampage:        DemoTeamPage,
    cloud:           DemoCloud,
    feed:            DemoFeed,
    composerOpen:    DemoComposerOpen,
    composerFields:  DemoComposerFields,
    composerMarkdown:DemoComposerMarkdown,
    composerImage:   DemoComposerImage,
    composerPublish: DemoComposerPublish,
    overlay:         DemoOverlay,
    actions:         DemoActions,
  };
  const Demo = demos[type];
  if (!Demo) return null;
  return (
    <div className="mt-5 rounded-xl overflow-hidden border border-line/60" style={{ background: "#F1EDE5" }}>
      {/* Mini browser chrome */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-line/40" style={{ background: "#EAE5DC" }}>
        <span className="size-2 rounded-full" style={{ background: "#F26A4B88" }} />
        <span className="size-2 rounded-full" style={{ background: "#C7E54188" }} />
        <span className="size-2 rounded-full" style={{ background: "#A3D1FF88" }} />
        <span className="mx-auto font-mono text-[9px] text-muted uppercase tracking-widest">osztály · 12.i</span>
      </div>
      <div style={{ minHeight: "110px" }}>
        <Demo color={color} bg={bg} key={animKey} />
      </div>
    </div>
  );
}

// ── Navigáció / böngészés demók ────────────────────────────────────────

function DemoOverview({ color, bg }) {
  return (
    <div className="p-3 space-y-1.5">
      {[
        { label: "01 / Témakörök", w: "100%", delay: "0ms", c: "#F26A4B" },
        { label: "02 / Tudásfelhő", w: "100%", delay: "200ms", c: "#1B4B8F" },
        { label: "03 / Feed", w: "100%", delay: "400ms", c: "#3F5C12" },
      ].map((s, i) => (
        <div key={i} className="rounded-lg flex items-center gap-2 px-3 py-2"
             style={{ background: s.c + "14", border: `1px solid ${s.c}22`,
               animation: `tutFadeUp 500ms ${s.delay} both` }}>
          <span className="size-2 rounded-full shrink-0" style={{ background: s.c }} />
          <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: s.c }}>{s.label}</span>
          <span className="ml-auto size-1.5 rounded-full" style={{ background: s.c + "50",
            animation: `tutPulse 1.8s ${s.delay} ease-in-out infinite` }} />
        </div>
      ))}
    </div>
  );
}

function DemoTeams({ color }) {
  return (
    <div className="p-2.5 grid grid-cols-3 gap-1.5">
      {[
        { n: "Design", e: "◈", c: "#6B3FE6", anim: true },
        { n: "Mi a projekt?", e: "◉", c: "#F26A4B" },
        { n: "A projekt keretei", e: "◇", c: "#1B4B8F" },
        { n: "Projektcélok", e: "◎", c: "#7B1F61" },
        { n: "Menedzsment", e: "◆", c: "#3F5C12" },
        { n: "Menedzser…", e: "○", c: "#B36A00" },
      ].map((t, i) => (
        <div key={i}
          className="rounded-lg p-2 border border-line/50 text-[9px] leading-tight font-medium"
          style={{
            background: t.anim ? t.c + "12" : "#FAF6EE",
            borderColor: t.anim ? t.c + "44" : undefined,
            animation: t.anim ? "tutCardHover 3s ease-in-out infinite" : `tutFadeUp 400ms ${i * 60}ms both`,
          }}>
          <span style={{ fontSize: "11px" }}>{t.e}</span>
          <div className="mt-1 text-ink2">{t.n}</div>
        </div>
      ))}
    </div>
  );
}

function DemoTeamPage({ color, bg }) {
  return (
    <div className="p-3 space-y-2">
      <div className="rounded-lg px-3 py-2 flex items-center gap-2"
           style={{ background: color + "18", animation: "tutFadeUp 400ms both" }}>
        <span className="inline-flex size-7 rounded-full items-center justify-center text-[11px]"
              style={{ background: color, color: "#FAF6EE" }}>◈</span>
        <div>
          <div className="text-[11px] font-medium text-ink">Design</div>
          <div className="text-[9px] font-mono text-muted uppercase tracking-wider">01 / témakör</div>
        </div>
      </div>
      <div className="flex items-center gap-1.5" style={{ animation: "tutFadeUp 400ms 150ms both" }}>
        {["ÁLD", "HN", "JA"].map(m => (
          <span key={m} className="inline-flex items-center justify-center size-6 rounded-full text-[9px] font-medium"
                style={{ background: color + "20", color }}>{m}</span>
        ))}
        <span className="text-[10px] text-muted ml-1">3 tanuló</span>
      </div>
      <div className="space-y-1" style={{ animation: "tutFadeUp 400ms 300ms both" }}>
        {["Szerkezet meghatározása", "Design elvek", "Vizuális hierarchia"].map((sub, i) => (
          <div key={i} className="flex items-center gap-2 text-[10px] text-ink2">
            <span className="size-1 rounded-full shrink-0" style={{ background: color }} />{sub}
          </div>
        ))}
      </div>
    </div>
  );
}

function DemoCloud({ color, bg }) {
  const bubbles = [
    { x: "14%", y: "38%", size: 52, label: "Kutatás",     c: "#3F1FA8", bc: "#EFE7FF", delay: "0s" },
    { x: "38%", y: "62%", size: 40, label: "Design",      c: "#B33A1D", bc: "#FFE4DC", delay: "0.4s" },
    { x: "58%", y: "28%", size: 48, label: "Kódolás",     c: "#3F5C12", bc: "#E7F2DC", delay: "0.2s" },
    { x: "80%", y: "55%", size: 44, label: "Prezentáció", c: "#1B4B8F", bc: "#DCE9FB", delay: "0.6s", active: true },
  ];
  return (
    <div className="relative" style={{ height: "110px" }}>
      {bubbles.map((b, i) => (
        <div key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex flex-col items-center justify-center text-center"
          style={{
            left: b.x, top: b.y, width: b.size, height: b.size,
            background: b.bc, color: b.c, overflow: "hidden",
            border: b.active ? `2px solid ${b.c}` : `1px solid ${b.c}33`,
            animation: `tutFloat 2.5s ${b.delay} ease-in-out infinite${b.active ? ", tutPulse 2s ease-in-out infinite" : ""}`,
          }}>
          <div style={{ fontSize: "9px", fontWeight: 600, lineHeight: 1.2, padding: "0 3px" }}>{b.label}</div>
        </div>
      ))}
      <div className="absolute bottom-2 right-3 text-[9px] font-mono px-2 py-0.5 rounded-full"
           style={{ background: "#1B4B8F22", color: "#1B4B8F", animation: "tutFadeUp 400ms 800ms both" }}>
        szűrve: Prezentáció
      </div>
    </div>
  );
}

function DemoFeed({ color }) {
  return (
    <div className="p-2.5 space-y-1.5">
      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-line/50"
           style={{ background: "#FAF6EE" }}>
        <Icon name="search" size={10} className="text-muted shrink-0" />
        <span className="font-mono text-[10px] text-muted overflow-hidden whitespace-nowrap"
              style={{ animation: "tutType 2.5s steps(18) 0.5s both", display: "inline-block", maxWidth: "160px" }}>
          projektmenedzsment
        </span>
        <span style={{ animation: "tutBlink 0.8s step-end infinite", borderRight: "1px solid #7A7468", height: "10px", display: "inline-block" }} />
      </div>
      {[
        { t: "Projektmenedzsment alapjai",      c: "#3F1FA8", cc: "#EFE7FF", delay: "0ms" },
        { t: "GIMP és Trello összehasonlítása", c: "#3F5C12", cc: "#E7F2DC", delay: "100ms" },
        { t: "Design elvek prezentációban",     c: "#B33A1D", cc: "#FFE4DC", delay: "200ms" },
      ].map((p, i) => (
        <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-line/40"
             style={{ background: "#FAF6EE", animation: `tutFadeUp 300ms ${p.delay} both` }}>
          <span className="text-[9px] px-1.5 py-0.5 rounded-full font-mono" style={{ background: p.cc, color: p.c }}>●</span>
          <span className="text-[10px] text-ink2 flex-1 truncate">{p.t}</span>
        </div>
      ))}
    </div>
  );
}

// ── Posztolás demók ────────────────────────────────────────────────────

function DemoComposerOpen({ color, bg }) {
  return (
    <div className="p-2.5 space-y-2">
      {/* Fake header bar */}
      <div className="rounded-lg border border-line/40 px-3 py-2 flex items-center gap-2"
           style={{ background: "#EAE5DC", animation: "tutFadeUp 300ms both" }}>
        <span className="font-serif-i text-[12px] text-ink">osztály</span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="size-5 rounded-full border border-line/50 inline-flex items-center justify-center"
                style={{ background: "#F1EDE5" }}>
            <Icon name="search" size={9} className="text-muted" />
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-cream text-[9px] font-medium"
                style={{ background: "#13110F", animation: "tutGlow 1.8s 0.5s ease-in-out infinite" }}>
            <Icon name="plus" size={8} stroke={2.5} /> Új bejegyzés
          </span>
        </div>
      </div>
      {/* Arrow */}
      <div className="flex items-center justify-end gap-1 pr-1" style={{ animation: "tutFadeUp 300ms 400ms both" }}>
        <span className="text-[9px] font-mono text-muted" style={{ animation: "tutPulse 1.2s ease-in-out infinite" }}>← kattints ide!</span>
      </div>
      {/* Composer panel preview */}
      <div className="rounded-lg border border-line/50 overflow-hidden"
           style={{ animation: "tutSlide 500ms 600ms both" }}>
        <div className="px-3 py-1.5 flex items-center justify-between border-b border-line/40"
             style={{ background: "#EAE5DC" }}>
          <span className="font-mono text-[9px] uppercase tracking-widest text-muted">Új bejegyzés — szerkesztő</span>
          <Icon name="x" size={10} className="text-muted" />
        </div>
        <div className="px-3 py-2 grid grid-cols-2 gap-2" style={{ background: "#FAF6EE" }}>
          <div className="space-y-1">
            <div className="h-2 rounded bg-ink/15" style={{ width: "90%" }} />
            <div className="h-2 rounded bg-ink/10" style={{ width: "70%" }} />
            <div className="h-2 rounded bg-ink/10" style={{ width: "80%" }} />
          </div>
          <div className="space-y-1">
            <div className="h-2 rounded bg-ink/10" style={{ width: "60%" }} />
            <div className="h-2 rounded" style={{ width: "80%", background: color + "30" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function DemoComposerFields({ color, bg }) {
  return (
    <div className="p-2.5 space-y-1.5">
      {/* Title field */}
      <div className="px-2.5 py-1.5 rounded-lg border text-[10px] overflow-hidden"
           style={{ background: "#FAF6EE", borderColor: color + "55", animation: "tutFadeUp 400ms both" }}>
        <div className="text-[8px] font-mono text-muted uppercase tracking-wider mb-0.5">Cím *</div>
        <div className="text-ink overflow-hidden whitespace-nowrap"
             style={{ animation: "tutType 2s steps(28) 0.2s both", display: "block", maxWidth: "100%" }}>
          A projektmenedzsment alapjai
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {/* Topic */}
        <div className="px-2 py-1.5 rounded-lg border border-line/50 text-[10px]"
             style={{ background: "#FAF6EE", animation: "tutFadeUp 400ms 500ms both" }}>
          <div className="text-[8px] font-mono text-muted uppercase tracking-wider mb-0.5">Témakör *</div>
          <div className="font-medium flex items-center gap-1 text-ink">
            <span style={{ color: "#0E5C5F" }}>◐</span>
            <span className="truncate">Projektmenedzsment</span>
          </div>
        </div>
        {/* Category */}
        <div className="px-2 py-1.5 rounded-lg border text-[10px]"
             style={{ background: bg, borderColor: color + "55", animation: "tutFadeUp 400ms 700ms both" }}>
          <div className="text-[8px] font-mono uppercase tracking-wider mb-0.5" style={{ color: color + "99" }}>Kategória *</div>
          <div className="font-medium" style={{ color }}>● Kutatás</div>
        </div>
      </div>
      {/* Excerpt */}
      <div className="px-2.5 py-1.5 rounded-lg border border-line/40 text-[10px] overflow-hidden"
           style={{ background: "#FAF6EE", animation: "tutFadeUp 400ms 900ms both" }}>
        <div className="text-[8px] font-mono text-muted uppercase tracking-wider mb-0.5">Összefoglaló (opcionális)</div>
        <div className="text-ink2 overflow-hidden whitespace-nowrap"
             style={{ animation: "tutType 2s steps(30) 1.1s both", display: "block", maxWidth: "100%" }}>
          Hogyan épül fel egy projekt és miért fontos?
        </div>
      </div>
    </div>
  );
}

function DemoComposerMarkdown({ color, bg }) {
  return (
    <div className="p-2.5">
      <div className="grid grid-cols-2 gap-2">
        {/* Editor side */}
        <div className="rounded-lg border border-line/50 overflow-hidden"
             style={{ animation: "tutFadeUp 400ms 100ms both" }}>
          <div className="px-2 py-1 border-b border-line/40 text-[8px] font-mono uppercase tracking-widest text-muted"
               style={{ background: "#EAE5DC" }}>
            szerkesztő
          </div>
          <div className="p-2 font-mono text-[9px] leading-[1.7] text-ink2 space-y-0.5">
            <div style={{ color: "#1B4B8F" }}>## Mi a projekt?</div>
            <div className="text-ink2">A projekt egy</div>
            <div><span style={{ color: "#7B1F61" }}>**egyedi feladat**</span></div>
            <div className="text-ink2">amelynek van:</div>
            <div style={{ color: "#3F5C12" }}>- határideje</div>
            <div style={{ color: "#3F5C12" }}>- költségkerete</div>
          </div>
        </div>
        {/* Preview side */}
        <div className="rounded-lg border border-line/50 overflow-hidden"
             style={{ animation: "tutFadeUp 400ms 400ms both" }}>
          <div className="px-2 py-1 border-b border-line/40 text-[8px] font-mono uppercase tracking-widest text-muted"
               style={{ background: "#EAE5DC" }}>
            előnézet
          </div>
          <div className="p-2 text-[9px] leading-[1.7]">
            <div className="font-semibold text-[11px] text-ink mb-1">Mi a projekt?</div>
            <div className="text-ink2 mb-1">A projekt egy <strong>egyedi feladat</strong>, amelynek van:</div>
            <div className="text-ink2 pl-2">• határideje</div>
            <div className="text-ink2 pl-2">• költségkerete</div>
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-1.5 justify-center" style={{ animation: "tutFadeUp 400ms 700ms both" }}>
        <Icon name="arrow-left" size={9} className="text-muted" />
        <span className="text-[9px] font-mono text-muted">Markdown → automatikusan formázva</span>
        <Icon name="arrow-right" size={9} className="text-muted" />
      </div>
    </div>
  );
}

function DemoComposerImage({ color, bg }) {
  return (
    <div className="p-2.5 space-y-2">
      {/* Upload box */}
      <div className="rounded-lg border-2 border-dashed text-center py-3 px-2"
           style={{ borderColor: color + "55", background: bg + "55", animation: "tutFadeUp 400ms both" }}>
        <div style={{ animation: "tutFloat 2.2s ease-in-out infinite" }}>
          <Icon name="upload" size={20} stroke={1.4} style={{ color }} className="mx-auto" />
        </div>
        <div className="text-[9px] font-medium mt-1.5" style={{ color }}>'Kép kiválasztása' gomb</div>
        <div className="text-[8px] text-muted mt-0.5">JPG · PNG · GIF · WebP · max 5 MB</div>
      </div>
      {/* Divider */}
      <div className="flex items-center gap-2" style={{ animation: "tutFadeUp 400ms 400ms both" }}>
        <div className="flex-1 h-px" style={{ background: "#E4DDC9" }} />
        <span className="text-[9px] font-mono text-muted">vagy</span>
        <div className="flex-1 h-px" style={{ background: "#E4DDC9" }} />
      </div>
      {/* URL input */}
      <div className="px-2.5 py-1.5 rounded-lg border border-line/50 flex items-center gap-1.5"
           style={{ background: "#FAF6EE", animation: "tutFadeUp 400ms 600ms both" }}>
        <Icon name="link" size={10} className="text-muted shrink-0" />
        <span className="font-mono text-[9px] text-muted overflow-hidden whitespace-nowrap inline-block"
              style={{ animation: "tutType 2.5s steps(28) 0.9s both", maxWidth: "100%" }}>
          https://example.com/kep.jpg
        </span>
      </div>
    </div>
  );
}

function DemoComposerPublish({ color, bg }) {
  return (
    <div className="p-2.5 space-y-2">
      {/* Password field */}
      <div className="px-3 py-2.5 rounded-xl"
           style={{
             background: bg,
             border: `1.5px solid ${color}66`,
             animation: "tutFadeUp 400ms both, tutGlow 2s 0.6s ease-in-out infinite",
           }}>
        <div className="flex items-center gap-1.5 mb-2">
          <Icon name="lock" size={12} stroke={2} style={{ color }} />
          <span className="font-mono text-[9px] uppercase tracking-wider font-medium" style={{ color }}>
            Jelszó (kötelező)
          </span>
        </div>
        <div className="font-mono tracking-[0.3em] text-[15px]" style={{ color }}>
          <span style={{ animation: "tutType 1.5s steps(6) 0.8s both", display: "inline-block", overflow: "hidden", maxWidth: "100%", whiteSpace: "nowrap" }}>
            ••••••
          </span>
        </div>
        <div className="text-[8px] mt-2 font-mono" style={{ color: color + "99" }}>
          ⚠ Nincs visszaállítás — jegyezd meg!
        </div>
      </div>
      {/* Publish button */}
      <div className="flex items-center gap-3" style={{ animation: "tutFadeUp 400ms 900ms both" }}>
        <div className="flex-1 h-px" style={{ background: "#E4DDC9" }} />
        <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-medium text-cream"
             style={{ background: "#13110F", animation: "tutPulse 1.6s 1.5s ease-in-out infinite" }}>
          <Icon name="send" size={10} stroke={2} /> Közzétesz
        </div>
        <div className="flex-1 h-px" style={{ background: "#E4DDC9" }} />
      </div>
      <div className="text-center text-[9px] font-mono text-muted"
           style={{ animation: "tutFadeUp 400ms 1.3s both" }}>
        → bejegyzés azonnal megjelenik a feedben
      </div>
    </div>
  );
}

// ── Olvasás / eszközök demók ───────────────────────────────────────────

function DemoOverlay({ color, bg }) {
  return (
    <div className="p-2.5">
      <div className="rounded-xl border border-line/50 overflow-hidden"
           style={{ background: "#FAF6EE", animation: "tutScaleIn 500ms cubic-bezier(.2,.7,.2,1) both" }}>
        <div className="flex items-center gap-2 px-3 py-2 border-b border-line/40">
          <span className="text-[9px] px-1.5 py-0.5 rounded-full font-mono"
                style={{ background: bg, color }}>Kutatás</span>
          <span className="text-[9px] text-muted font-mono ml-auto">5 perc olvasás</span>
          <span className="text-muted text-[11px]">✕</span>
        </div>
        <div className="p-3 space-y-1.5">
          <div className="h-2 rounded bg-ink/20" style={{ width: "80%", animation: "tutFadeUp 400ms 300ms both" }} />
          <div className="h-2 rounded bg-ink/10" style={{ width: "95%", animation: "tutFadeUp 400ms 400ms both" }} />
          <div className="h-2 rounded bg-ink/10" style={{ width: "70%", animation: "tutFadeUp 400ms 500ms both" }} />
          <div className="h-2 rounded bg-ink/10" style={{ width: "85%", animation: "tutFadeUp 400ms 600ms both" }} />
        </div>
      </div>
    </div>
  );
}

function DemoActions({ color }) {
  const btns = [
    { icon: "pencil",         label: "Szerkesztés", c: "#6B3FE6", delay: "0ms" },
    { icon: "trash-2",        label: "Törlés",      c: "#F26A4B", delay: "200ms" },
    { icon: "bookmark",       label: "Mentés",      c: "#3F5C12", delay: "400ms" },
    { icon: "message-square", label: "Megjegyzések",c: "#1B4B8F", delay: "600ms" },
    { icon: "share-2",        label: "Megosztás",   c: "#6B4A00", delay: "800ms" },
  ];
  return (
    <div className="p-3 flex flex-wrap gap-1.5 justify-center">
      {btns.map((b, i) => (
        <div key={i}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-medium border"
          style={{
            background: b.c + "14", color: b.c, borderColor: b.c + "30",
            animation: `tutFadeUp 350ms ${b.delay} both, tutPulse 2.5s ${b.delay} ease-in-out infinite`,
          }}>
          <Icon name={b.icon} size={11} stroke={1.9} />
          {b.label}
        </div>
      ))}
    </div>
  );
}

// ── CSS keyframe-ek ───────────────────────────────────────────────────
function TutorialStyles() {
  return (
    <style>{`
      @keyframes tutSlide    { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
      @keyframes tutFadeUp   { from { opacity:0; transform:translateY(8px);  } to { opacity:1; transform:translateY(0); } }
      @keyframes tutFadeOut  { to   { opacity:0; transform:translateY(-6px) scaleY(0.8); } }
      @keyframes tutScaleIn  { from { opacity:0; transform:scale(0.92); } to { opacity:1; transform:scale(1); } }
      @keyframes tutPulse    { 0%,100% { opacity:1; } 50% { opacity:0.55; } }
      @keyframes tutFloat    { 0%,100% { transform:translate(-50%,-50%); } 50% { transform:translate(-50%,calc(-50% - 5px)); } }
      @keyframes tutCardHover{ 0%,30%  { transform:translateY(0); box-shadow:none; }
                               40%,70% { transform:translateY(-4px); box-shadow:0 6px 16px -4px rgba(19,17,15,0.18); }
                               80%,100%{ transform:translateY(0); box-shadow:none; } }
      @keyframes tutType     { from { width:0; } to { width:100%; } }
      @keyframes tutBlink    { 50% { opacity:0; } }
      @keyframes tutGlow     { 0%,100% { box-shadow:0 0 0 0 transparent; } 50% { box-shadow:0 0 0 3px rgba(107,63,230,0.25); } }
    `}</style>
  );
}

Object.assign(window, { Tutorial });

// Közös komponensek — chipek, scroll-fade, placeholder média, fejléc/lábléc.

const { useEffect, useRef, useState, useMemo, useCallback } = React;

// ── Scroll-alapú animáció ─────────────────────────────────────────────
function ScrollFade({ children, delay = 0, className = "", as: As = "div", ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => el.classList.add("in"), delay);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  return <As ref={ref} className={"scroll-fade " + className} {...rest}>{children}</As>;
}

// ── Kategória chip ────────────────────────────────────────────────────
function CategoryChip({ slug, size = "sm", active = false, onClick }) {
  const cat = CATEGORIES.find(c => c.slug === slug);
  if (!cat) return null;
  const pad = size === "lg" ? "px-3 py-1.5 text-[13px]" : "px-2.5 py-1 text-[11px]";
  const cls = [
    "inline-flex items-center gap-1.5 rounded-full border font-mono uppercase tracking-wider",
    cat.chip, pad,
    onClick ? "btn-press cursor-pointer hover:-translate-y-px transition-transform" : "cursor-default",
    active ? "ring-2 ring-ink ring-offset-2 ring-offset-cream" : "",
  ].join(" ");
  const inner = (
    <>
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {cat.label}
    </>
  );
  if (!onClick) return <span className={cls}>{inner}</span>;
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick(e); }}
      className={cls}
    >
      {inner}
    </button>
  );
}

// ── Témakör jelvény (színes kör emojival) ─────────────────────────────
function TeamMark({ team, size = 36 }) {
  if (!team) return null;
  return (
    <span
      className="inline-flex items-center justify-center font-serif-i text-[1.05em] shrink-0"
      style={{
        width: size, height: size, borderRadius: 999,
        background: team.color, color: "#FAF6EE",
        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)",
        fontSize: size * 0.5,
      }}
      aria-hidden="true"
    >
      {team.emoji}
    </span>
  );
}

// ── Bejegyzés média (valódi kép vagy placeholder) ─────────────────────
function PostMedia({ image, team, height = 220 }) {
  if (!image) return null;

  // Valódi kép URL esetén közvetlenül jelenítjük meg
  if (image.kind === "photo" && image.label?.match(/^https?:\/\//)) {
    return (
      <div className="relative overflow-hidden bg-creamdark" style={{ height }}>
        <img src={image.label} alt="" className="w-full h-full object-cover" loading="lazy" />
      </div>
    );
  }

  const palette = {
    data:    { bg: "#EFE7FF", fg: "#3F1FA8" },
    photo:   { bg: "#FFE4DC", fg: "#B33A1D" },
    diagram: { bg: "#E7F2DC", fg: "#3F5C12" },
  }[image.kind] || { bg: "#F1ECDF", fg: "#13110F" };

  return (
    <div
      className="relative overflow-hidden stripe-bg"
      style={{ height, background: palette.bg, color: palette.fg }}
    >
      <div className="absolute inset-3 ring-line rounded-[6px] bg-[rgba(250,246,238,0.55)] backdrop-blur-[1px] flex flex-col">
        <div className="flex items-center justify-between px-3 py-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em]">
            placeholder · {image.kind}
          </span>
          {team && (
            <span className="font-mono text-[10px] uppercase tracking-[0.18em]">
              {team.name.toLowerCase()}.feed
            </span>
          )}
        </div>
        <div className="flex-1 grid place-items-center px-6 text-center">
          <p className="font-serif-i text-[18px] leading-snug" style={{ color: palette.fg }}>
            "{image.label}"
          </p>
        </div>
        <div className="px-3 py-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em]">
          <span>kép feltöltendő →</span>
          <span>16 : 9</span>
        </div>
      </div>
    </div>
  );
}

// ── Fejléc ────────────────────────────────────────────────────────────
function Header({ onCompose, onHome, route }) {
  return (
    <header className="sticky top-0 z-40 bg-cream/85 backdrop-blur border-b border-line">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 h-16 flex items-center gap-6">
        <button onClick={onHome} className="flex items-center gap-2.5 group">
          <span className="relative inline-grid size-7 rounded-full bg-ink text-cream place-items-center">
            <span className="font-serif-i text-[15px] leading-none translate-y-[-1px]">o</span>
            <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-coral" />
          </span>
          <span className="font-serif-i text-[22px] leading-none">osztály</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted hidden sm:inline border border-line rounded-full px-2 py-0.5">
            projektmenedzsment
          </span>
        </button>

        <nav className="ml-4 hidden md:flex items-center gap-5 text-[14px] text-ink2">
          <button onClick={onHome} className={"hover:text-ink " + (route === "home" ? "text-ink font-medium" : "")}>Kezdőlap</button>
          <a href="#feed" className="hover:text-ink">Feed</a>
          <a href="#teams" className="hover:text-ink">Témakörök</a>
          <a href="#cloud" className="hover:text-ink">Tudásfelhő</a>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-2 px-3 h-9 rounded-full bg-creamdark ring-line">
            <Icon name="search" size={14} className="text-muted" />
            <input
              placeholder="keresés a bejegyzésekben…"
              className="bg-transparent outline-none text-[13px] placeholder:text-muted w-44"
              onChange={(e) => window.dispatchEvent(new CustomEvent("ok:search", { detail: e.target.value }))}
            />
            <span className="font-mono text-[10px] text-muted">⌘ K</span>
          </div>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("ok:tutorial:open"))}
            className="btn-press inline-flex items-center gap-1.5 h-9 pl-2.5 pr-3.5 rounded-full bg-creamdark ring-line hover:bg-cream transition-colors text-ink2 hover:text-ink text-[13px]"
          >
            <Icon name="graduation-cap" size={15} stroke={1.7} />
            <span className="hidden sm:inline">Útmutató</span>
          </button>
          <button
            onClick={onCompose}
            className="btn-press inline-flex items-center gap-2 h-9 pl-3 pr-4 rounded-full bg-ink text-cream text-[13px] font-medium hover:bg-violetink transition-colors"
          >
            <Icon name="plus" size={14} stroke={2.2} />
            Új bejegyzés
          </button>
        </div>
      </div>
    </header>
  );
}

// ── Lábléc ────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="mt-32 border-t border-line bg-creamdark">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="inline-grid size-7 rounded-full bg-ink text-cream place-items-center font-serif-i">o</span>
            <span className="font-serif-i text-[22px]">osztály</span>
          </div>
          <p className="mt-3 text-[13px] text-ink2 max-w-[28ch]">
            Projektmenedzsment tudásbázis a 12.i osztály számára. Diákok írták, diákoknak.
          </p>
        </div>
        <FooterCol title="Navigáció" items={["Kezdőlap", "Feed", "Témakörök", "Új bejegyzés"]} />
        <FooterCol title="Tartalom" items={["A projektről", "Témakörök", "Szerkesztési útmutató", "Bejegyzési szabályok"]} />
        <FooterCol title="Eszközök" items={["React", "Tailwind CSS", "Supabase", "Lucide"]} />
      </div>
      <div className="border-t border-line">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-4 flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.18em] text-muted">
          <span>© 2026 osztály · 12.i projektév</span>
          <span>9 témakör · 9 csapat · 27 tanuló</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }) {
  return (
    <div>
      <h4 className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">{title}</h4>
      <ul className="mt-3 space-y-1.5 text-[14px]">
        {items.map(i => <li key={i}><a className="hover:underline" href="#">{i}</a></li>)}
      </ul>
    </div>
  );
}

Object.assign(window, { ScrollFade, CategoryChip, TeamMark, PostMedia, Header, Footer });

// Témakörök rácsa + Tudásfelhő (kategória-szűrő).

const { useMemo: useMemoT } = React;

function TeamsGrid({ topics, onOpenTeam, postCounts }) {
  return (
    <section id="teams" className="relative" data-screen-label="teams">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pt-24 pb-16">
        <SectionHeader
          eyebrow="01 / témakörök"
          title={<>Kilenc csapat,<br />mindegyik egy <span className="font-serif-i text-violet">külön kérdésen</span> dolgozik.</>}
          sub="Kattints egy témakörre, hogy csak az ahhoz tartozó bejegyzéseket, vázlatokat és forrásokat lásd. A csapatokat és fókuszterületeiket maguk a tanulók választották a 2. héten."
        />

        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-px bg-line ring-line rounded-2xl overflow-hidden">
          {topics.map((t, i) => (
            <ScrollFade key={t.id} delay={i * 40}>
              <TeamCard team={t} onOpen={() => onOpenTeam(t)} postCount={postCounts[t.id] || 0} />
            </ScrollFade>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamCard({ team, onOpen, postCount }) {
  return (
    <button
      onClick={onOpen}
      className="group relative text-left bg-cream p-6 lg:p-7 card-hover hover:bg-creamdark h-[268px] flex flex-col overflow-hidden"
    >
      <div className="flex items-start justify-between">
        <TeamMark team={team} size={44} />
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
          {team.number} / témakör
        </span>
      </div>

      <h3 className="mt-5 text-[22px] leading-tight tracking-[-0.01em] font-medium line-clamp-2">
        {team.name}
      </h3>
      <p className="mt-2 text-[13px] text-ink2 leading-snug line-clamp-2">{team.focus}</p>

      <div className="mt-auto pt-5 flex items-center justify-between gap-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        <span>{team.members} tanuló · {postCount} bejegyzés</span>
        <span className="inline-flex items-center gap-1 text-ink group-hover:text-violetink transition-colors shrink-0">
          megnyitás <Icon name="arrow-up-right" size={12} stroke={2} />
        </span>
      </div>

      {/* hover sáv alul */}
      <span className="absolute left-0 right-0 bottom-0 h-1 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
            style={{ background: team.color }} />
    </button>
  );
}

// ── Tudásfelhő (kategória-szűrő) ─────────────────────────────────────
function KnowledgeCloud({ active, onSelect, postCounts }) {
  const layout = useMemoT(() => {
    const pos = [
      { top: "18%", left: "12%", size: 1.6 },
      { top: "62%", left: "22%", size: 1.0 },
      { top: "28%", left: "44%", size: 1.3 },
      { top: "70%", left: "55%", size: 0.85 },
      { top: "12%", left: "70%", size: 1.1 },
      { top: "55%", left: "78%", size: 1.4 },
    ];
    return CATEGORIES.map((c, i) => ({ ...c, ...pos[i % pos.length] }));
  }, []);

  return (
    <section id="cloud" className="relative bg-creamdark border-y border-line" data-screen-label="knowledge-cloud">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-24 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <SectionHeader
            eyebrow="02 / tudásfelhő"
            title={<>Hat tartalomtípus,<br />hat féle <span className="font-serif-i text-violet">gondolkodás</span>.</>}
            sub="Minden bejegyzés be van sorolva, hogy keresztbe is tanulhass — megnézheted, hogyan közelít egy design csapat egy problémához, vagy hogyan dokumentálnak hibát a kódolók. Kattints egy kategóriára a feed szűréséhez."
          />
          <div className="mt-8 flex flex-wrap gap-2">
            <button
              onClick={() => onSelect(null)}
              className={"btn-press inline-flex items-center gap-2 h-8 px-3 rounded-full text-[12px] " +
                (!active ? "bg-ink text-cream" : "bg-cream ring-line hover:bg-cream/80")}>
              <Icon name="layout-grid" size={12} stroke={2} /> összes kategória
            </button>
            {CATEGORIES.map(c => (
              <CategoryChip key={c.slug} slug={c.slug} active={active === c.slug}
                onClick={() => onSelect(active === c.slug ? null : c.slug)} />
            ))}
          </div>

          <ul className="mt-8 divide-y divide-line/70 border-y border-line/70">
            {CATEGORIES.map(c => (
              <li key={c.slug} className="py-3 flex items-center gap-4">
                <span className="size-2 rounded-full" style={{ background: dotFor(c.slug) }} />
                <span className="text-[15px] font-medium w-28">{c.label}</span>
                <span className="text-[13px] text-muted flex-1">{c.desc}</span>
                <span className="font-mono text-[11px] text-ink2">{postCounts[c.slug] || 0}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* felhő vászon */}
        <div className="lg:col-span-7 relative min-h-[480px] rounded-2xl overflow-hidden ring-line bg-cream">
          <svg className="absolute inset-0 size-full" aria-hidden="true">
            <defs>
              <pattern id="dotgrid" width="22" height="22" patternUnits="userSpaceOnUse">
                <circle cx="1.5" cy="1.5" r="1" fill="#13110F" opacity="0.08" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotgrid)" />
          </svg>

          {layout.map(c => (
            <CloudBubble
              key={c.slug}
              cat={c}
              count={postCounts[c.slug] || 0}
              active={active === c.slug}
              onClick={() => onSelect(active === c.slug ? null : c.slug)}
            />
          ))}

          <div className="absolute right-4 bottom-4 font-serif-i text-[15px] text-ink2 max-w-[180px] text-right leading-snug">
            kattints a szűréshez →
          </div>
        </div>
      </div>
    </section>
  );
}

function CloudBubble({ cat, count, active, onClick }) {
  const size = 64 + cat.size * 36;
  return (
    <button
      onClick={onClick}
      className={"absolute -translate-x-1/2 -translate-y-1/2 rounded-full ring-line card-hover overflow-hidden " +
                 (active ? "ring-2 !ring-ink shadow-[0_10px_30px_-12px_rgba(19,17,15,0.4)]" : "hover:shadow-[0_10px_30px_-12px_rgba(19,17,15,0.25)]")}
      style={{
        top: cat.top, left: cat.left, width: size, height: size,
        background: bgFor(cat.slug), color: fgFor(cat.slug),
      }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
        <div className="font-medium text-[11px] leading-tight">{cat.label}</div>
        <div className="font-mono text-[9px] tracking-wide mt-1 opacity-80">{count} db</div>
      </div>
    </button>
  );
}

function bgFor(slug) {
  return ({ research:"#EFE7FF", design:"#FFE4DC", coding:"#E7F2DC", presentation:"#DCE9FB", fieldwork:"#FFEEBB", writing:"#F6E3F0" })[slug];
}
function fgFor(slug) {
  return ({ research:"#3F1FA8", design:"#B33A1D", coding:"#3F5C12", presentation:"#1B4B8F", fieldwork:"#6B4A00", writing:"#7B1F61" })[slug];
}
function dotFor(slug) { return fgFor(slug); }

function SectionHeader({ eyebrow, title, sub }) {
  return (
    <ScrollFade>
      <div className="flex items-center gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">{eyebrow}</span>
        <span className="h-px flex-1 bg-ink/15" />
      </div>
      <h2 className="mt-5 font-medium tracking-[-0.02em] leading-[1] text-[clamp(36px,5.2vw,64px)]">
        {title}
      </h2>
      {sub && <p className="mt-5 text-[16px] leading-[1.55] text-ink2 max-w-[58ch]">{sub}</p>}
    </ScrollFade>
  );
}

Object.assign(window, { TeamsGrid, KnowledgeCloud, SectionHeader });

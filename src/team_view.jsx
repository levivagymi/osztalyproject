// Témakör részletes nézete — banner, alfejezetek, csapattagok, bejegyzések.

function TeamView({ team: topic, posts, allTeams: allTopics, onBack, onOpenPost }) {
  const topicPosts = posts.filter(p => p.team_id === topic.id);

  return (
    <div className="relative" data-screen-label="team-view">
      {/* banner */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 -z-10" style={{ background: `linear-gradient(140deg, ${topic.color} 0%, #FAF6EE 65%)`, opacity: 0.18 }} />
        <div className="absolute inset-0 -z-10 grain opacity-60" />
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-14 lg:py-20">
          <button onClick={onBack} className="inline-flex items-center gap-1.5 text-[13px] text-ink2 hover:text-ink">
            <Icon name="chevron-left" size={14} /> vissza a kezdőlapra
          </button>

          <div className="mt-8 flex flex-wrap items-end gap-8">
            <TeamMark team={topic} size={84} />
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
                {topic.number} · témakör
              </div>
              <h1 className="mt-2 font-medium tracking-[-0.02em] leading-[1] text-[clamp(48px,7vw,96px)]">
                {topic.name}
              </h1>
              <p className="mt-4 text-[18px] text-ink2 max-w-[55ch]">
                Fókusz: <span className="font-serif-i" style={{ color: topic.color }}>{topic.focus}</span>.
                {" "}{topic.members} tanuló. {topicPosts.length} bejegyzés eddig.
              </p>
            </div>
            <div className="ml-auto grid grid-cols-3 gap-px bg-line ring-line rounded-2xl overflow-hidden">
              <Mini label="bejegyzések" n={topicPosts.length} />
              <Mini label="tanulók" n={topic.members} />
              <Mini label="olvasási perc" n={topicPosts.reduce((a, p) => a + (p.read || 0), 0)} />
            </div>
          </div>

          {/* csapattagok */}
          {topic.memberNames && topic.memberNames.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {topic.memberNames.map(m => (
                <span
                  key={m}
                  className="inline-flex items-center h-9 px-4 rounded-full font-mono text-[13px] uppercase tracking-[0.18em] font-medium"
                  style={{ background: topic.color + "18", color: topic.color, border: `1px solid ${topic.color}35` }}
                >
                  {m}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16 grid lg:grid-cols-12 gap-12">

        {/* bal oldal — alfejezetek + bejegyzések */}
        <div className="lg:col-span-8 space-y-12">

          {/* alfejezetek */}
          {topic.subtopics && topic.subtopics.length > 0 && (
            <section>
              <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted mb-5">
                Alfejezetek
              </h2>
              <ul className="divide-y divide-line/50">
                {(() => {
                  let counter = 0;
                  return topic.subtopics.map((s, i) => {
                    if (!s.indent) counter++;
                    return (
                      <li key={i} className={"py-3.5 flex items-start gap-3 " + (s.indent ? "pl-8" : "")}>
                        {s.indent ? (
                          <span className="text-muted/60 mt-0.5 shrink-0">↳</span>
                        ) : (
                          <span className="font-mono text-[10px] uppercase tracking-[0.18em] mt-1 shrink-0 min-w-[2rem]"
                                style={{ color: topic.color }}>
                            {String(counter).padStart(2, "0")}
                          </span>
                        )}
                        <span className={"text-[16px] leading-snug " + (s.indent ? "text-ink2" : "font-medium text-ink")}>
                          {s.text}
                        </span>
                      </li>
                    );
                  });
                })()}
              </ul>
            </section>
          )}

          {/* bejegyzések */}
          <section>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted mb-5">
              Bejegyzések
            </h2>
            {topicPosts.length === 0 ? (
              <div className="rounded-2xl ring-line bg-cream p-10 text-center font-serif-i text-[28px]">
                még nincs bejegyzés — légy az első.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {topicPosts.map((p, i) => (
                  <ScrollFade key={p.id} delay={i * 50}>
                    <PostCard post={p} topic={topic} onOpen={() => onOpenPost(p)} />
                  </ScrollFade>
                ))}
              </div>
            )}
          </section>

          {/* források */}
          <section>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted mb-5">
              Források
            </h2>
            {(!topic.sources || topic.sources.length === 0) ? (
              <div className="rounded-2xl bg-creamdark ring-line p-8 text-center">
                <div className="font-serif-i text-[20px] text-ink2">Hamarosan elérhető.</div>
                <p className="mt-2 text-[13px] text-muted">A csapat forrásait ide töltjük fel.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {topic.sources.map((src, i) => {
                  const item = typeof src === "object" ? src : { label: src, url: null };
                  return <TeamSourceCard key={i} src={item} />;
                })}
              </div>
            )}
          </section>
        </div>

        {/* oldalsáv */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24 space-y-5">

            <div className="rounded-2xl bg-cream ring-line p-6">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted mb-4">A csapat</h3>
              <div className="space-y-3">
                {(topic.memberNames || []).map(m => (
                  <div key={m} className="flex items-center gap-3">
                    <span className="inline-grid place-items-center size-9 rounded-full font-mono text-[11px] font-semibold shrink-0"
                          style={{ background: topic.color + "20", color: topic.color }}>
                      {m.slice(0, 2)}
                    </span>
                    <span className="font-mono text-[13px] uppercase tracking-[0.18em] text-ink">{m}</span>
                  </div>
                ))}
              </div>
            </div>

            {topic.software && topic.software.length > 0 && (
              <div className="rounded-2xl bg-cream ring-line p-6">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted mb-3">Szoftverek</h3>
                <div className="space-y-2.5">
                  {topic.software.map(s => (
                    <div key={s} className="flex items-center gap-2.5 text-[14px]">
                      <Icon name="box" size={13} className="text-muted shrink-0" />
                      <span className="font-medium">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl bg-creamdark ring-line p-6">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted mb-1">Témakör</div>
              <div className="text-[48px] font-medium leading-none tracking-[-0.02em] text-ink/20">{topic.number}</div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">/ 09</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function TeamSourceCard({ src }) {
  const [meta, setMeta]       = React.useState(null);
  const [loading, setLoading] = React.useState(!!src.url);

  React.useEffect(() => {
    if (!src.url) return;
    fetch(`https://api.microlink.io/?url=${encodeURIComponent(src.url)}`)
      .then(r => r.json())
      .then(json => {
        if (json.status === "success") {
          setMeta({
            title:       json.data.title       || "",
            description: json.data.description || "",
            ogImage:     json.data.image?.url  || json.data.screenshot?.url || "",
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [src.url]);

  const domain = (() => {
    try { return new URL(src.url).hostname.replace("www.", ""); } catch { return ""; }
  })();
  const title       = meta?.title       || src.label;
  const description = meta?.description || "";
  const ogImage     = meta?.ogImage     || "";

  if (!src.url) {
    return (
      <div className="rounded-xl ring-line bg-creamdark p-4 flex items-center gap-3">
        <Icon name="link" size={14} className="text-muted shrink-0" />
        <span className="text-[14px]">{src.label}</span>
      </div>
    );
  }

  return (
    <a href={src.url} target="_blank" rel="noopener noreferrer"
      className="group rounded-xl ring-line bg-creamdark hover:bg-cream transition-colors overflow-hidden flex flex-col no-underline">
      {loading ? (
        <div className="w-full h-36 bg-line/40 animate-pulse" />
      ) : ogImage ? (
        <img src={ogImage} alt="" className="w-full h-36 object-cover" />
      ) : null}
      <div className="p-4 flex flex-col gap-1">
        {domain && (
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">{domain}</span>
        )}
        <span className="text-[14px] font-medium leading-snug line-clamp-2 text-ink group-hover:text-violetink transition-colors">
          {loading ? src.label : title}
        </span>
        {!loading && description && (
          <span className="text-[12px] text-ink2 line-clamp-2 leading-snug mt-0.5">{description}</span>
        )}
      </div>
    </a>
  );
}

function Mini({ n, label }) {
  return (
    <div className="bg-cream px-5 py-4 min-w-[100px]">
      <div className="text-[28px] leading-none font-medium tracking-[-0.02em]">{n}</div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{label}</div>
    </div>
  );
}

// PostCard itt szükséges — a feed.jsx-ből importálás helyett újra definiálva,
// mert a team_view.jsx a feed.jsx előtt töltődik be.
function PostCard({ post, topic, onOpen }) {
  return (
    <button onClick={onOpen}
      className="group text-left rounded-2xl ring-line bg-cream overflow-hidden card-hover hover:bg-creamdark flex flex-col h-full w-full">
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
        <h4 className="mt-4 text-[20px] leading-[1.18] font-medium tracking-[-0.01em] text-balance">{post.title}</h4>
        <p className="mt-2.5 text-[14px] leading-[1.5] text-ink2 line-clamp-3">{post.excerpt}</p>
        <div className="mt-auto pt-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TeamMark team={topic} size={22} />
            <span className="text-[13px] font-medium">{topic?.name}</span>
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">{post.read} perc</span>
        </div>
        <span className="mt-5 -mb-6 -mx-6 h-1 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 bg-ink/80" />
      </div>
    </button>
  );
}

Object.assign(window, { TeamView });

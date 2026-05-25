// Hero szekció — parallax dekorációval és futó szövegszalaggal.

const { useEffect: useEffectH, useState: useStateH, useRef: useRefH } = React;

function Hero({ onCompose, onScrollToFeed, stats }) {
  const [y, setY] = useStateH(0);
  const heroRef = useRefH(null);

  useEffectH(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const top = heroRef.current?.getBoundingClientRect().top ?? 0;
        setY(-top);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const layer = (rate) => ({ transform: `translate3d(0, ${y * rate}px, 0)` });

  return (
    <section ref={heroRef} className="relative overflow-hidden border-b border-line" data-screen-label="hero">
      {/* parallax háttérblob-ok */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-24 -left-16 size-[420px] rounded-full bg-violet blob"
             style={layer(0.35)} />
        <div className="absolute top-40 right-[-80px] size-[360px] rounded-full bg-coral blob"
             style={layer(0.2)} />
        <div className="absolute bottom-[-120px] left-[20%] size-[300px] rounded-full bg-lime blob"
             style={layer(0.5)} />
      </div>
      <div className="absolute inset-0 -z-10 grain opacity-60" />

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pt-16 pb-28 lg:pt-24 lg:pb-36">
        {/* fejléc sor */}
        <div className="flex items-center gap-3" style={layer(-0.1)}>
          <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink2">
            osztály · 12.i · projektév 25/26
          </span>
          <span className="h-px flex-1 bg-ink/15" />
          <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink2 hidden sm:inline">
            projektmenedzsment témakör
          </span>
        </div>

        {/* főcím */}
        <h1 className="mt-8 font-medium tracking-[-0.02em] leading-[0.93] text-[clamp(48px,8.5vw,120px)]"
            style={layer(-0.05)}>
          Amit a 12.i<br className="hidden sm:block" />
          <span className="font-serif-i text-violet"> megtanult</span> a<br />
          projektekről.
        </h1>

        {/* alcím + gombok */}
        <div className="mt-8 grid md:grid-cols-12 gap-6 items-end" style={layer(0.04)}>
          <p className="md:col-span-7 text-[18px] leading-[1.5] text-ink2 max-w-[60ch]">
            Kilenc csapat, kilenc témakör. Projektek tervezése, keretei, céljai, a menedzsment
            alapjai és a segítő szoftverek — mind itt, egy helyen összegyűjtve.
          </p>
          <div className="md:col-span-5 flex flex-wrap items-center gap-3 md:justify-end">
            <button
              onClick={onCompose}
              className="btn-press inline-flex items-center gap-2 h-12 pl-5 pr-6 rounded-full bg-ink text-cream font-medium hover:bg-violetink transition-colors"
            >
              <Icon name="pen-line" size={16} stroke={2} />
              Bejegyzés írása
            </button>
            <button
              onClick={onScrollToFeed}
              className="btn-press inline-flex items-center gap-2 h-12 pl-5 pr-5 rounded-full bg-cream ring-ink text-ink font-medium hover:bg-creamdark"
            >
              Feed böngészése
              <Icon name="arrow-down" size={16} stroke={2} />
            </button>
          </div>
        </div>

        {/* statisztika sáv */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-line ring-line rounded-2xl overflow-hidden"
             style={layer(0.08)}>
          <HeroStat n={stats.posts}  label="bejegyzés" />
          <HeroStat n={stats.topics} label="témakör" />
          <HeroStat n={stats.cats}   label="kategória" />
          <HeroStat n="∞"            label="még tanulnivaló" italic />
        </div>
      </div>

      {/* futó szövegszalag */}
      <div className="border-y border-line bg-cream py-3 marquee-mask overflow-hidden">
        <div className="ticker flex gap-10 whitespace-nowrap font-mono text-[12px] uppercase tracking-[0.22em] text-ink2 w-max">
          {[...Array(2)].map((_, k) => (
            <span key={k} className="flex items-center gap-10 pr-10">
              <T>mi a projekt?</T><Dot />
              <T>határidő és költségkeret</T><Dot />
              <T>projektcélok háromszöge</T><Dot />
              <T>menedzsment alapjai</T><Dot />
              <T>menedzser három szerepköre</T><Dot />
              <T>projektmenedzsment folyamata</T><Dot />
              <T>gimp és trello bemutatója</T><Dot />
              <T>20 kérdéses teszt</T><Dot />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function T({ children }) { return <span>{children}</span>; }
function Dot() { return <span className="text-coral">●</span>; }

function HeroStat({ n, label, italic }) {
  return (
    <div className="bg-cream p-6 md:p-8">
      <div className={"text-[44px] md:text-[56px] leading-none tracking-[-0.02em] " + (italic ? "font-serif-i" : "font-medium")}>
        {n}
      </div>
      <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">{label}</div>
    </div>
  );
}

Object.assign(window, { Hero });

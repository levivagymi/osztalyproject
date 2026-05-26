// Lucide icon wrapper — we use the UMD `lucide` global to render icons
// declaratively without needing the react-specific bundle.
const { useEffect, useRef } = React;

function Icon({ name, size = 18, stroke = 1.6, className = "", style = {} }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || !window.lucide) return;
    const icons = window.lucide.icons;
    const def = icons && (icons[name] || icons[toPascal(name)]);
    if (!def) {
      ref.current.innerHTML = "";
      return;
    }
    // lucide UMD returns icon nodes as [tag, attrs, children]
    const svg = window.lucide.createElement(def);
    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    svg.setAttribute("stroke-width", stroke);
    svg.setAttribute("aria-hidden", "true");
    ref.current.innerHTML = "";
    ref.current.appendChild(svg);
  }, [name, size, stroke]);
  return <span ref={ref} className={"inline-flex items-center justify-center " + className} style={style} />;
}

function toPascal(s) {
  return s.replace(/(^|-)(\w)/g, (_, _d, c) => c.toUpperCase());
}

Object.assign(window, { Icon });

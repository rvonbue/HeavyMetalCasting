import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

// Renders the admin-authored sale banner HTML when the sale is active.
// - In flow (default): pushes page content down; reports its height so the
//   layout can shrink the outlet to match.
// - Fixed (home page, where the header is position:fixed): pinned just under
//   the header, overlaying the full-viewport hero like the header does.
// Closeable per session — reopens on reload.
export default function SaleBanner({ onHeightChange, fixed = false, topOffset = 0 }) {
  const settings = useSelector((state) => state.settings.settings);
  const [closed, setClosed] = useState(false);
  const ref = useRef(null);

  const html = settings.sale_banner_html;
  const visible =
    settings.sale_active === 'true' && !!html && html.trim() !== '' && !closed;

  useEffect(() => {
    if (!visible || !ref.current) {
      onHeightChange?.(0);
      return;
    }
    const el = ref.current;
    const report = () => onHeightChange?.(el.offsetHeight);
    report();
    const ro = new ResizeObserver(report);
    ro.observe(el);
    return () => {
      ro.disconnect();
      onHeightChange?.(0);
    };
  }, [visible, html, onHeightChange]);

  if (!visible) return null;

  const fixedStyle = fixed
    ? { position: 'fixed', top: `${topOffset}px`, left: 0, right: 0, zIndex: 40 }
    : undefined;

  return (
    <div ref={ref} className="relative w-full" style={fixedStyle}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <button
        type="button"
        onClick={() => setClosed(true)}
        aria-label="Close banner"
        className="absolute right-2 top-1 rounded bg-black/20 px-2 text-lg leading-none text-white hover:bg-black/40"
      >
        ✕
      </button>
    </div>
  );
}

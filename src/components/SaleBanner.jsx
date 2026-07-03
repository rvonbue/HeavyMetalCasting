import { useSelector } from 'react-redux';

// Renders the admin-authored sale banner HTML in a fixed bar just under the
// header when the sale is active. Fixed positioning keeps it from shifting any
// page layout; the HTML comes from the sale_banner_html store setting.
export default function SaleBanner() {
  const settings = useSelector((state) => state.settings.settings);
  const toolbarHeight = useSelector((state) => state.app.toolbarHeight);

  if (settings.sale_active !== 'true') return null;

  const html = settings.sale_banner_html;
  if (!html || !html.trim()) return null;

  return (
    <div
      className="absolute left-0 right-0 z-40"
      style={{ top: `${toolbarHeight}px` }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

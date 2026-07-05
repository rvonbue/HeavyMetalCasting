// Curated core theme colors exposed in the Store Settings color editor. Each
// maps to a CSS custom property defined by the active theme class.
export const THEME_COLORS = [
  { var: '--color-hmc-bodybackground', label: 'Background' },
  { var: '--color-hmc-panelbackground', label: 'Panel' },
  { var: '--color-hmc-a', label: 'Surface' },
  { var: '--color-hmc-c', label: 'Content Text' },
  { var: '--color-hmc-textprimary', label: 'Text (Primary)' },
  { var: '--color-hmc-textsecondary', label: 'Text (Secondary)' },
  { var: '--color-hmc-b', label: 'Accent' },
  { var: '--color-hmc-button-a', label: 'Button' },
  { var: '--color-hmc-button-text-a', label: 'Button Text' },
  { var: '--color-hmc-button-b', label: 'Button (Alt)' },
  { var: '--color-hmc-button-text-b', label: 'Button Text (Alt)' },
  { var: '--color-hmc-border-a', label: 'Border' },
  { var: '--color-hmc-border-b', label: 'Border (Alt)' },
  { var: '--color-hmc-link', label: 'Link' },
  { var: '--color-hmc-link-active', label: 'Link (Active)' },
  { var: '--color-hmc-header-opaque', label: 'Header' },
  { var: '--color-hmc-error', label: 'Error' },
  { var: '--color-hmc-pricing-label', label: 'Pricing Label' },
];

// Settings key for a variable's saved override, e.g.
// '--color-hmc-bodybackground' -> 'theme_color_hmc_bodybackground'.
export function themeColorKey(varName) {
  return 'theme_color_' + varName.replace('--color-', '').replace(/-/g, '_');
}

const HEX_RE = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/;

// Inline style object of saved hex overrides, applied to the theme root on load
// so they win over the theme class defaults. Only valid hex values are applied
// so a malformed setting can't wipe out the whole theme.
export function buildThemeOverrideStyle(settings) {
  const style = {};
  for (const { var: varName } of THEME_COLORS) {
    const val = settings?.[themeColorKey(varName)];
    if (val && HEX_RE.test(val.trim())) style[varName] = val.trim();
  }
  return style;
}

// Rasterizes any CSS color (incl. oklch) to a #rrggbb hex via a 1px canvas,
// which always resolves to sRGB pixels regardless of the authored color space.
function cssColorToHex(colorStr) {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000000';
  ctx.fillStyle = colorStr; // ignored if the browser can't parse it
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  const to = (n) => n.toString(16).padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
}

// Reads a CSS variable's current value off the theme root and resolves it to a
// hex string for the native picker.
export function resolveVarToHex(varName) {
  if (typeof document === 'undefined') return '#000000';
  const root = document.getElementById('hmc-theme-root') || document.documentElement;
  const raw = getComputedStyle(root).getPropertyValue(varName).trim();
  if (!raw) return '#000000';
  return cssColorToHex(raw);
}

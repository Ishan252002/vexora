const INK = 'var(--ink)';
const ACCENT = 'var(--accent-bright)';

/** The two strokes of the X on a 78 x 100 grid. One stroke carries the accent. */
function XStrokes({ base }: { base: string }) {
  return (
    <>
      <path d="M0 0h19l59 100H59z" fill={base} />
      <path d="M59 0h19L19 100H0z" fill={ACCENT} />
    </>
  );
}

/** VEXORA wordmark: six custom letterforms on a 546 x 100 grid. */
function Wordmark({ fill }: { fill: string }) {
  return (
    <>
      <g fill={fill} fillRule="evenodd">
        {/* V */}
        <path d="M0 0h17l23 70L63 0h17L48 100H32z" />
        {/* E */}
        <path d="M96 0h58v15h-43v27.5h38v15h-38V85h43v15H96z" />
        {/* X: base stroke */}
        <path d="M170 0h19l59 100h-19z" />
        {/* O */}
        <path d="M312 0a48 50 0 1 0 0 100a48 50 0 1 0 0-100zM312 15a33 35 0 1 1 0 70a33 35 0 1 1 0-70z" />
        {/* R */}
        <path d="M376 0h40a30 30 0 0 1 0 60h-25v40h-15zM391 15v30h25a15 15 0 0 0 0-30z" />
        <path d="M405 56h19l26 44h-19z" />
        {/* A */}
        <path d="M466 100h17l23-70 23 70h17L514 0h-16z" />
        <path d="M492 62h28v14h-28z" />
      </g>
      {/* X: accent stroke */}
      <path d="M229 0h19l-59 100h-19z" fill={ACCENT} />
    </>
  );
}

interface LogoProps {
  /** Rendered height in pixels. */
  height?: number;
  /** `ink` for light backgrounds, `paper` for dark backgrounds. */
  tone?: 'ink' | 'paper';
  /** `full` is the icon plus the wordmark. `icon` is the square mark alone. */
  variant?: 'full' | 'icon';
}

/**
 * VEXORA logo. The icon is a rounded tile holding the X; the lockup pairs it
 * with the wordmark. Static copies for decks and social live in /public/brand.
 */
export default function Logo({ height = 30, tone = 'ink', variant = 'full' }: LogoProps) {
  const tile = tone === 'ink' ? INK : '#FFFFFF';
  const onTile = tone === 'ink' ? '#FFFFFF' : '#0E0F13';
  const text = tone === 'ink' ? INK : '#FFFFFF';
  const icon = (
    <>
      <rect width="100" height="100" rx="22" fill={tile} />
      <g transform="translate(27.4 21) scale(0.58)">
        <XStrokes base={onTile} />
      </g>
    </>
  );

  if (variant === 'icon') {
    return (
      <svg className="logo" height={height} width={height} viewBox="0 0 100 100" role="img" aria-label="VEXORA">
        {icon}
      </svg>
    );
  }

  return (
    <svg
      className="logo"
      height={height}
      width={(height * 473) / 100}
      viewBox="0 0 473 100"
      role="img"
      aria-label="VEXORA"
    >
      {icon}
      <g transform="translate(134 19) scale(0.62)">
        <Wordmark fill={text} />
      </g>
    </svg>
  );
}

/** The bare X, used as a watermark in image placeholders. */
export function Mark({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 78 100" aria-hidden="true" focusable="false">
      <XStrokes base="currentColor" />
    </svg>
  );
}

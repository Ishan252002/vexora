import { useEffect, useState } from 'react';
import imageData from '../data/images.json';
import { Mark } from './Logo';

interface Entry {
  /** Product-matched photo on the web (Unsplash or Pexels). */
  url: string;
  alt: string;
  credit?: string;
  backup?: string;
  /** Description of the bundled demo photo in /public/img. */
  localAlt?: string;
  localSource?: string;
}

const images = imageData as unknown as Record<string, Entry>;

/** Set VITE_REMOTE_IMAGES=1 to try the web photos first and the bundled ones second. */
const REMOTE_FIRST = import.meta.env.VITE_REMOTE_IMAGES === '1';
const WIDTHS = [400, 800, 1200, 1600];

/** The single-file demo build injects every photo as a data URI on this global. */
const inlined = (globalThis as { __VEXORA_IMAGES__?: Record<string, string> }).__VEXORA_IMAGES__;

const isRemote = (src: string) => /^https?:\/\//.test(src);

function sized(url: string, width: number, ratio?: number): string {
  const height = ratio ? Math.round(width / ratio) : undefined;
  const h = height ? `&h=${height}` : '';
  if (url.includes('images.unsplash.com')) {
    return `${url}?auto=format&fit=crop&q=75&w=${width}${h}`;
  }
  if (url.includes('images.pexels.com')) {
    return `${url}?auto=compress&cs=tinysrgb&fit=crop&w=${width}${h}`;
  }
  return url;
}

interface ImgProps {
  /** Key in src/data/images.json and file name in /public/img */
  name: string;
  /** Width divided by height, e.g. 4 / 5 */
  ratio?: number;
  sizes?: string;
  eager?: boolean;
  /** Text shown in the placeholder if no photo can load. */
  label?: string;
  tone?: 'light' | 'dark';
  className?: string;
  alt?: string;
}

/**
 * Photo with fallbacks. By default it shows the bundled demo photo from
 * /public/img, then the web photo, then its backup, then a VEXORA placeholder,
 * so a missing file or dead link never leaves a hole.
 */
export default function Img({
  name,
  ratio,
  sizes = '(max-width: 700px) 50vw, 25vw',
  eager = false,
  label,
  tone = 'light',
  className = '',
  alt,
}: ImgProps) {
  const entry = images[name];
  const local = inlined?.[name] ?? `${import.meta.env.BASE_URL}img/${name}.jpg`;
  const remote = [entry?.url, entry?.backup].filter((s): s is string => Boolean(s));
  const sources = REMOTE_FIRST ? [...remote, local] : [local, ...remote];
  const [attempt, setAttempt] = useState(0);

  useEffect(() => setAttempt(0), [name]);

  const src = sources[attempt];
  const web = src ? isRemote(src) : false;
  const text = alt ?? (web ? entry?.alt : entry?.localAlt) ?? label ?? '';

  return (
    <div
      className={`img img--${tone} ${className}`.trim()}
      style={ratio ? { aspectRatio: String(ratio) } : undefined}
    >
      {src ? (
        <img
          src={web ? sized(src, 800, ratio) : src}
          srcSet={web ? WIDTHS.map((w) => `${sized(src, w, ratio)} ${w}w`).join(', ') : undefined}
          sizes={web ? sizes : undefined}
          alt={text}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setAttempt((n) => n + 1)}
        />
      ) : (
        <div className="img__ph" role="img" aria-label={text || 'Image placeholder'}>
          <Mark size={56} />
          {label && <span>{label}</span>}
        </div>
      )}
    </div>
  );
}

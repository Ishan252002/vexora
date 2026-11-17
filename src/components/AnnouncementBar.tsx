import { useEffect, useState } from 'react';
import { announcements } from '../data/content';

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const still =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % announcements.length), 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="announce" role="region" aria-label="Store announcements">
      <p key={index} className="announce__text">
        {announcements[index]}
      </p>
    </div>
  );
}

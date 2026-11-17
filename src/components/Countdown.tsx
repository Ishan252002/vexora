import { useEffect, useMemo, useState } from 'react';
import { offerEndsAt, splitDuration } from '../lib/time';

const pad = (n: number) => String(n).padStart(2, '0');

/** Counts down to Sunday 23:59:59 IST, when the weekly offers change. */
export default function Countdown() {
  const end = useMemo(() => offerEndsAt(), []);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const left = splitDuration(end.getTime() - now);
  const cells: [string, string][] = [
    [pad(left.days), 'Days'],
    [pad(left.hours), 'Hours'],
    [pad(left.minutes), 'Min'],
    [pad(left.seconds), 'Sec'],
  ];

  return (
    <div className="countdown" role="timer" aria-label="Time left on this week's offers">
      {cells.map(([value, unit]) => (
        <div className="countdown__cell" key={unit}>
          <span className="countdown__value">{value}</span>
          <span className="countdown__unit">{unit}</span>
        </div>
      ))}
    </div>
  );
}

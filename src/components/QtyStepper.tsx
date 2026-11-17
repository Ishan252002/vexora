import { MAX_QTY } from '../lib/pricing';
import Icon from './Icon';

interface Props {
  value: number;
  onChange: (next: number) => void;
  label: string;
  size?: 'sm' | 'md';
}

export default function QtyStepper({ value, onChange, label, size = 'md' }: Props) {
  return (
    <div className={`qty qty--${size}`} role="group" aria-label={`Quantity for ${label}`}>
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Decrease quantity">
        <Icon name="minus" size={14} />
      </button>
      <output aria-live="polite">{value}</output>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= MAX_QTY}
        aria-label="Increase quantity"
      >
        <Icon name="plus" size={14} />
      </button>
    </div>
  );
}

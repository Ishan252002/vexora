const rupee = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

/** Formats a rupee amount with Indian digit grouping, e.g. 125000 -> ₹1,25,000 */
export const inr = (amount: number) => `₹${rupee.format(Math.round(amount))}`;

/** Whole-number discount percentage between selling price and MRP. */
export const pctOff = (price: number, mrp: number) =>
  mrp > price ? Math.round((1 - price / mrp) * 100) : 0;

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

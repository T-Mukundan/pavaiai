/**
 * Deterministic date formatting utilities to eliminate Next.js SSR / Client hydration mismatches.
 * Never uses system locale-dependent toLocaleDateString() which differs between Node.js server (US)
 * and client browsers (IN/UK/etc).
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatDate(input: string | Date | number | null | undefined): string {
  if (!input) return '—';
  const d = new Date(input);
  if (isNaN(d.getTime())) return '—';

  const day = String(d.getDate()).padStart(2, '0');
  const month = MONTHS[d.getMonth()];
  const year = d.getFullYear();

  return `${day} ${month} ${year}`;
}

export function formatDateTime(input: string | Date | number | null | undefined): string {
  if (!input) return '—';
  const d = new Date(input);
  if (isNaN(d.getTime())) return '—';

  const day = String(d.getDate()).padStart(2, '0');
  const month = MONTHS[d.getMonth()];
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');

  return `${day} ${month} ${year}, ${hours}:${mins}`;
}

export function formatDateShort(input: string | Date | number | null | undefined): string {
  if (!input) return '—';
  const d = new Date(input);
  if (isNaN(d.getTime())) return '—';

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}

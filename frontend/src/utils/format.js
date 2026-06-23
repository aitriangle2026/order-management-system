// Format a "YYYY-MM-DD" (or ISO) date string for display, e.g. "Jun 20, 2026"
export const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Convert a date value into the "YYYY-MM-DD" shape <input type="date"> expects
export const toInputDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};

// Truncate long text for table cells, keeping the full text in a title attribute
export const truncate = (text, max = 40) => {
  if (!text) return '—';
  return text.length > max ? `${text.slice(0, max).trim()}…` : text;
};
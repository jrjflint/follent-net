export const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
export const jsonScript = value => JSON.stringify(value).replace(/</g, '\\u003c');
export const money = value => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(value);
export function safeURL(value, { internal = true } = {}) {
  if (internal && /^\/(?!\/)/.test(value)) return value;
  if (/^(https:\/\/|mailto:|tel:)/.test(value)) return value;
  throw new Error(`Unsupported URL: ${value}`);
}

import { escapeHTML as e } from '../lib/html.mjs';

export const arrow = '<span aria-hidden="true">↗</span>';
export const button = (href, text, secondary = false) => `<a class="button${secondary ? ' button-secondary' : ''}" href="${e(href)}">${e(text)} ${arrow}</a>`;
export const intro = (kicker, title, text) => `<div class="section-heading"><p class="eyebrow">${e(kicker)}</p><h2>${e(title)}</h2>${text ? `<p class="lede">${e(text)}</p>` : ''}</div>`;
export function contactDetails(site, { enquiryHref = '' } = {}) {
  const items = [];
  if (site.email) items.push(`<a href="mailto:${e(site.email)}">${e(site.email)}</a>`);
  if (site.phone) items.push(`<a href="tel:${e(site.phone.replace(/[^+\d]/g, ''))}">${e(site.phone)}</a>`);
  if (site.bookingURL) items.push(`<a href="${e(site.bookingURL)}">Book a conversation ${arrow}</a>`);
  if (site.googleBusinessProfileURL) items.push(`<a href="${e(site.googleBusinessProfileURL)}">Google Business Profile ${arrow}</a>`);
  if (items.length) return `<div class="contact-links">${items.join('')}</div>`;
  return enquiryHref ? `<div class="contact-links"><a href="${e(enquiryHref)}">Use our enquiry form ${arrow}</a></div>` : '<p class="setup-notice">Direct contact details have not been supplied.</p>';
}

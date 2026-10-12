import { loadConfig } from '../scripts/build.mjs';
import { button, intro, contactDetails } from '../src/partials/components.mjs';
import { escapeHTML as e } from '../src/lib/html.mjs';
import { enquiryForm } from '../src/partials/enquiry-form.mjs';

export const gardenEnquiry = {
  kicker: 'Garden enquiry', title: 'Ask about garden care', legend: 'Garden enquiry',
  description: 'Synthetic local intake. Required fields are marked.', queryField: 'service', analyticsField: 'service',
  fields: [
    { name: 'name', label: 'Your name', type: 'text', autocomplete: 'name', required: true, maxLength: 160 },
    { name: 'email', label: 'Email address', type: 'email', autocomplete: 'email', required: true },
    { name: 'service', label: 'Garden service', type: 'select', options: [{ value: '', label: 'Please select' }, { value: 'pruning', label: 'Pruning' }, { value: 'lawn-care', label: 'Lawn care' }] },
    { name: 'message', label: 'What needs attention?', type: 'textarea', rows: 5, required: true, maxLength: 5000, fullWidth: true }
  ]
};

// Synthetic QA only; not a ready-to-publish client site or approved privacy policy.
export async function gardenFixture() {
  const site = await loadConfig('config/client.example.json');
  Object.assign(site, { businessName: 'Synthetic Garden Care', wordmark: 'Garden Care', legalName: 'Synthetic Garden Operator', domain: 'https://garden.example', tagline: 'Garden care. Synthetic QA only.', description: 'Synthetic different-business test fixture.', serviceArea: 'Example region', email: 'hello@garden.example' });
  site.privacy.contactEmail = 'privacy@garden.example';
  site.privacy.retention = 'Synthetic retention for local QA only; no real collection approved.';
  const all = ['essential', 'professional', 'growth'], multi = ['professional', 'growth'];
  const page = (slug, nav, render, extra = {}) => ({ slug, nav, title: `${nav} — garden fixture`, description: `Synthetic garden ${nav.toLowerCase()} page for local QA only.`, packages: multi, render, ...extra });
  const wrap = html => `<section class="section"><div class="container prose">${html}</div></section>`;
  const pages = [
    page('', 'Home', ctx => wrap(`<h1>${e(ctx.site.tagline)}</h1><p>Illustrative gardening business for local tests only.</p><section id="services">${intro('Garden services', 'Care for outdoor spaces', 'Synthetic service description.')}${button(ctx.route('services'), 'Explore garden services')}</section><section id="contact">${intro('Contact', 'Ask about garden care')}${contactDetails(ctx.site)}</section>`), { packages: all }),
    page('services', 'Services', ctx => wrap(`<h1>Garden services</h1><p>Synthetic garden-care content.</p>${button(ctx.route('contact'), 'Ask about garden care')}`), { essentialSection: 'services', navigation: { order: 10, packages: all } }),
    page('garden-advice', 'Advice', () => wrap('<h1>Garden advice</h1><p>Synthetic advice page, not professional guidance.</p>'), { navigation: { order: 20, packages: multi } }),
    page('contact', 'Contact', ctx => wrap(`<h1>Garden enquiries</h1><p>Local fixture only; collection remains disabled until reviewed configuration is supplied.</p>${enquiryForm(ctx, gardenEnquiry)}`), { essentialSection: 'contact', navigation: { order: 30, packages: all }, enquiryForm: true }),
    page('privacy-policy', 'Privacy', ctx => wrap(`<h1>Synthetic privacy notice</h1><p>This fixture is not approved for real collection. It demonstrates client-specific copy without inherited provider or security claims.</p><p>Proposed operator: ${e(ctx.site.legalName)}.</p><p>Contact: <a href="mailto:${e(ctx.site.privacy.contactEmail)}">${e(ctx.site.privacy.contactEmail)}</a>.</p><p>${e(ctx.site.privacy.retention)}</p>`), { packages: all, utility: true }),
    page('404', 'Not found', () => wrap('<h1>Page not found</h1><p>Return to the <a href="/">garden fixture home</a>.</p>'), { packages: all, utility: true, noindex: true }),
    page('success', 'Submitted', () => wrap('<h1>Synthetic enquiry accepted</h1><p>Local mock only.</p>'), { utility: true, noindex: true }),
    page('form-error', 'Submission problem', () => wrap('<h1>Synthetic submission problem</h1><p>Local mock only.</p>'), { utility: true, noindex: true })
  ];
  return { site, pages };
}

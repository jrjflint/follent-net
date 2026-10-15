import { escapeHTML as e } from '../lib/html.mjs';
import { button, contactDetails, arrow } from './components.mjs';

function renderFields(intake) {
  if (!Array.isArray(intake.fields)) throw new Error('Enquiry intake needs a fields array');
  const names = new Set(['verification-status', 'verification-retry', 'consent', 'website-check', 'enquiry-form', 'form-status', 'form-setup']);
  for (const field of intake.fields) {
    if (!field || typeof field.name !== 'string' || !/^[a-z][a-z0-9_-]*$/.test(field.name) || names.has(field.name)) throw new Error('Enquiry fields need unique safe names outside reserved controls');
    names.add(field.name);
    if (typeof field.label !== 'string' || !field.label.trim()) throw new Error(`Enquiry field ${field.name} needs a label`);
    if (!['text', 'email', 'tel', 'url', 'select', 'textarea'].includes(field.type)) throw new Error(`Unsupported enquiry field type: ${field.type}`);
    if (field.required !== undefined && typeof field.required !== 'boolean') throw new Error(`Enquiry field ${field.name} required must be a boolean`);
    if (field.type === 'select' && (!Array.isArray(field.options) || field.options.some(option => !option || typeof option.value !== 'string' || typeof option.label !== 'string'))) throw new Error(`Enquiry field ${field.name} needs string choices`);
  }
  for (const key of ['queryField', 'analyticsField']) {
    if (intake[key] && !intake.fields.some(field => field.name === intake[key] && field.type === 'select')) throw new Error(`${key} must name a select field`);
  }
  if (intake.condition && (!intake.fields.some(field => field.name === intake.condition.field) || !intake.fields.some(field => field.name === intake.condition.controller) || typeof intake.condition.hideWhen !== 'string')) throw new Error('Conditional fields must reference intake fields and a string value');
  return intake.fields.map(field => {
    const label = `<label for="${e(field.name)}">${e(field.label)} <span>(${field.required ? 'required' : 'optional'})</span></label>`;
    const required = field.required ? ' required' : '';
    const maximum = field.maxLength ? ` maxlength="${e(field.maxLength)}"` : '';
    let control;
    if (field.type === 'select') control = `<select id="${e(field.name)}" name="${e(field.name)}"${required}>${field.options.map(option => `<option value="${e(option.value)}">${e(option.label)}</option>`).join('')}</select>`;
    else if (field.type === 'textarea') control = `<textarea id="${e(field.name)}" name="${e(field.name)}" rows="${e(field.rows || 5)}"${required}${maximum}></textarea>`;
    else control = `<input id="${e(field.name)}" name="${e(field.name)}" type="${e(field.type)}"${field.autocomplete ? ` autocomplete="${e(field.autocomplete)}"` : ''}${required}${maximum}>`;
    return `<div class="field${field.fullWidth ? ' field-full' : ''}">${label}${control}</div>`;
  }).join('');
}

export function enquiryForm(ctx, intake) {
  const { site, formEnabled } = ctx;
  if (site.package !== 'growth') return `<div class="contact-panel"><h2>A conversation is a good start.</h2><p>Use your preferred contact option to tell us about your project.</p>${contactDetails(site)}</div>`;
  if (site.form.provider === 'external') return `<div class="contact-panel"><h2>Your project, in a little more detail.</h2>${site.form.externalURL ? button(site.form.externalURL, 'Open the enquiry form') : '<p class="setup-notice">The enquiry form is not configured. No enquiries can be submitted from this preview.</p>'}</div>`;
  const fields = renderFields(intake);
  const query = intake.queryField ? ` data-query-field="${e(intake.queryField)}"` : '';
  const analytics = intake.analyticsField ? ` data-analytics-field="${e(intake.analyticsField)}"` : '';
  const condition = intake.condition ? ` data-conditional-field="${e(intake.condition.field)}" data-condition-controller="${e(intake.condition.controller)}" data-condition-value="${e(intake.condition.hideWhen)}"` : '';
  return `<div class="contact-panel"><p class="eyebrow">${e(intake.kicker)}</p><h2>${e(intake.title)}</h2><p class="small">${e(intake.description)}</p>${!formEnabled ? '<p class="setup-notice" id="form-setup">This enquiry form is a preview. Submission is disabled until setup and privacy review are complete; no information will be sent.</p>' : ''}<form id="enquiry-form"${ctx.formtrackEnabled ? ' data-formtrack' : ''}${query}${analytics}${condition} method="post" action="${formEnabled ? e(site.form.endpoint) : '#form-setup'}" data-provider="formspark" data-enabled="${formEnabled}" data-success="/success/" aria-describedby="form-status${!formEnabled ? ' form-setup' : ''}"><fieldset${!formEnabled ? ' disabled' : ''}><legend class="sr-only">${e(intake.legend)}</legend><div class="form-grid">${fields}<div class="field field-full"><label class="checkbox-label"><input type="checkbox" id="consent" name="consent" value="yes" required><span>I agree that ${e(site.businessName)} may use these details to respond to my enquiry. Read the <a href="/privacy-policy/">privacy notice</a>. <span>(required)</span></span></label></div></div><div class="honeypot" aria-hidden="true"><label for="website-check">Leave this field empty</label><input id="website-check" name="_gotcha" type="text" tabindex="-1" autocomplete="off"></div><input type="hidden" name="_redirect" value="${e(site.domain)}/success/"><input type="hidden" name="_error" value="${e(site.domain)}/form-error/"><input type="hidden" name="_append" value="false">${formEnabled && site.form.turnstileSiteKey ? `<div class="form-verification"><div class="cf-turnstile" data-sitekey="${e(site.form.turnstileSiteKey)}" data-size="compact"></div><p id="verification-status" class="small" data-verification-status tabindex="-1" role="status" aria-live="polite">Spam verification is required before sending.</p><button id="verification-retry" class="button button-secondary" type="button" data-verification-retry hidden>Retry verification</button><noscript><p>Spam verification requires JavaScript. Direct contact availability is shown below.</p></noscript></div>` : ''}${site.form.formtrackEnabled ? '<p class="small">When enabled, your enquiry may include campaign details from this contact page’s URL.</p>' : ''}<button class="button" type="submit">Send your enquiry ${arrow}</button></fieldset><p id="form-status" class="form-status" role="status" tabindex="-1" aria-live="polite"></p></form><div class="form-contact"><p class="small">Prefer another way to get in touch?</p>${contactDetails(site)}</div></div>`;
}

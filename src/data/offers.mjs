import { money } from '../lib/html.mjs';
const pageAllowances = { essential: 'One-page scrolling website', professional: 'Up to five pages', growth: 'Up to eight pages' };
// All commercial amounts are AUD, excluding GST. Edit once for every page.
export const packages = [
  { id: 'essential', pageAllowance: pageAllowances.essential, name: 'Essential', price: 2190, promise: 'Get online.', description: 'A polished, simple presence for businesses ready to get started.', features: [pageAllowances.essential, 'Responsive, mobile-first design', 'Client-supplied copy', 'Basic SEO and Google setup', 'Domain and DNS launch assistance', 'SSL, performance optimisation', 'Basic accessibility review', 'One revision round', '14 days post-launch support'], note: 'Enquiries via phone, email or your existing booking link. No custom hosted form.' },
  { id: 'professional', pageAllowance: pageAllowances.professional, name: 'Professional', price: 3490, recommended: true, promise: 'Get found. Generate enquiries.', description: 'A complete website for an established small business.', features: [pageAllowances.professional, 'Professional copywriting, human reviewed', 'Customised responsive design', 'Local SEO foundations', 'Google Analytics and Search Console setup', 'Google Business Profile review', 'Appropriate business schema', 'Conversion-focused structure', 'Image and performance optimisation', 'Two revision rounds', '30 days post-launch support'], note: 'Connect people to phone, email, external bookings or your existing systems. No custom hosted form.' },
  { id: 'growth', pageAllowance: pageAllowances.growth, name: 'Growth', price: 4990, promise: 'Make your website work harder.', description: 'A website that captures enquiries and moves them into your business.', features: ['Everything in Professional', pageAllowances.growth, 'Custom enquiry, quote or intake form', 'Conditional fields where practical', 'Spam protection and email notifications', 'Confirmation experience and basic lead routing', 'One initial workflow or integration', 'Conversion tracking', 'Ready for CRM and email integration', '90 days post-launch support'], note: 'Ongoing managed form processing is a separate monthly service, starting at $29 ex GST.' }
];
export const managedPlans = [
  { id: 'managed-lead-capture', name: 'Managed Lead Capture', price: 29, description: 'Straightforward enquiries and quote requests.', features: ['Form processing and submission storage', 'A custom form matching your website', 'Spam protection and email notifications', 'Confirmation message and monitoring', 'Reasonable minor form-field changes'] },
  { id: 'managed-lead-capture-pro', name: 'Managed Lead Capture Pro', price: 99, description: 'Detailed enquiries, registrations, applications and client intake.', features: ['Everything in Managed Lead Capture', 'Multi-step forms and conditional logic', 'File uploads and calculations where appropriate', 'More sophisticated validation', 'Multiple notification paths', 'One simple integration and enhanced support'] },
  { id: 'lead-automation', name: 'Lead Automation', price: 199, description: 'Turn website enquiries into automated business workflows.', features: ['Everything in Pro', 'Up to two agreed managed workflows', 'CRM or Microsoft 365 integration', 'Teams notifications and task creation', 'Customer acknowledgement and lead routing', 'Follow-up workflows and monitoring'] }
];
export const enquiryOptions = [
  { id: '', label: 'Not sure yet' },
  ...packages.map(p => ({ id: p.id, label: `${p.name} — ${money(p.price)} ex GST` })),
  ...managedPlans.map(p => ({ id: p.id, label: `${p.name} — ${money(p.price)}/month ex GST` })),
  { id: 'custom', label: 'Other / custom requirement' }
];
export const addons = [
  ['Additional page', '$350', 'Service, location, team or information pages.'],
  ['Professional copywriting', '$750', 'An Essential upgrade. Already included in Professional and Growth.'],
  ['Local SEO setup', '$550', 'An Essential upgrade. Professional and Growth include stronger local SEO foundations.'],
  ['Google Business Profile optimisation', '$350', 'A focused improvement to your existing profile.'],
  ['Booking integration', 'from $350', 'Link or integrate an appropriate existing booking system.'],
  ['Additional workflow / automation', 'from $350–$650', 'Depending on scope. Complex implementations are quoted separately.']
];
export const steps = [
  ['A proper conversation', 'We start with your business, your customers and what the website needs to achieve.'],
  ['A clear scope', 'You receive an agreed package, deliverables and price before the build begins.'],
  ['Design, write, refine', 'We build the structure and design, prepare the copy where included, and review it with you.'],
  ['Launch with confidence', 'We check mobile layouts, links, accessibility and search foundations, then connect your domain.']
];
export const faqs = [
  ['Which package is right for me?', 'Essential suits a simple one-page presence with your own copy. Professional is the recommended option for most established small businesses. Growth adds managed lead capture and an initial workflow.'],
  ['Do the prices include GST?', 'No. All website packages, add-ons and monthly plans are priced in Australian dollars, excluding GST.'],
  ['Are hosting and domain costs included?', 'Domain registration, third-party subscriptions and ongoing services are separate unless your proposal explicitly includes them. Hosting is configured on Cloudflare Pages; applicable platform costs are confirmed in your scope.'],
  ['Can you work with my existing website?', 'Yes. We review useful content, brand assets and existing URLs before planning a replacement. Redirects are reviewed before launch to preserve relevant search value.'],
  ['Do you build online stores?', 'These packages are for service-based, informational and lead-generation websites. Ecommerce is not included. Ecommerce projects can be scoped separately using an appropriate platform.'],
  ['How is AI used?', 'AI assists our internal development and copy preparation. Your website is reviewed by a human before launch. Strategy, design, accuracy and delivery remain our responsibility.'],
  ['How long does a project take?', 'A delivery schedule is agreed after discovery. Scope, approved copy, asset availability and review turnaround all affect the launch date.'],
  ['Can I update the website later?', 'Yes. The site uses portable HTML, CSS and a small build script. Content changes can be managed through the repository or scoped as ongoing support.']
];

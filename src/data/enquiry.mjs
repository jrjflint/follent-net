import { enquiryOptions } from './offers.mjs';

const input = (name, label, type, autocomplete, required = false) => ({ name, label, type, autocomplete, required, ...(type === 'text' ? { maxLength: 160 } : {}) });
const choices = values => [{ value: '', label: 'Please select' }, ...values.map(value => ({ value, label: value }))];

// Follent business-specific intake. Field names and package IDs are provider contracts.
export const follentEnquiry = {
  kicker: 'Your project brief', title: 'Let’s start with the essentials.', legend: 'Project enquiry',
  description: 'Fields marked “required” help us understand and respond to your enquiry.',
  queryField: 'package', analyticsField: 'package',
  condition: { field: 'website', controller: 'need', hideWhen: 'A new website' },
  fields: [
    input('name', 'Your name', 'text', 'name', true),
    input('business_name', 'Business name', 'text', 'organization'),
    input('email', 'Email address', 'email', 'email', true),
    input('phone', 'Phone number', 'tel', 'tel'),
    input('website', 'Existing website', 'url', 'url'),
    { name: 'need', label: 'What do you need?', type: 'select', options: choices(['A new website', 'Replace an existing website', 'Lead capture or automation', 'Help deciding']) },
    { name: 'package', label: 'Package of interest', type: 'select', options: enquiryOptions.map(option => ({ value: option.id, label: option.label })) },
    { name: 'timeline', label: 'Approximate timeline', type: 'select', options: choices(['Within a month', '1–3 months', '3–6 months', 'Just exploring']) },
    { name: 'message', label: 'Tell us about your project', type: 'textarea', rows: 5, required: true, maxLength: 5000, fullWidth: true }
  ]
};

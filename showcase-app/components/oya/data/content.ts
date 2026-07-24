import type { Faq, Testimonial } from '../types';

export const companyInfo = {
  brand: 'OYA',
  motacLicence: 'L/N/11895',
  whatsapp: '+60 12-000 0000',
  email: 'hello@oya.example',
  travelHandle: '@oyatravelmy',
  innHandle: '@oya.inn',
  address: 'OYA Inn address placeholder near KLIA',
};

export const amenities = [
  'Wi-Fi',
  'Air conditioning',
  'Comfortable bedding',
  'Private bathroom',
  'Family-friendly options',
  'Housekeeping',
  'Airport-transfer enquiry',
  'Prayer-friendly essentials',
  'Longer-stay enquiry',
];

export const testimonials: Testimonial[] = [
  {
    id: 'family-holiday',
    type: 'Family holiday',
    name: 'Sample traveller A',
    title: 'Custom family trip',
    body: 'The demo journey shows how a family could discuss dates, budget and room needs with one OYA consultant.',
    isDemo: true,
  },
  {
    id: 'island',
    type: 'Island package',
    name: 'Sample traveller B',
    title: 'Island escape',
    body: 'The island package flow is easy to compare, with clear seats, dates and what remains subject to confirmation.',
    isDemo: true,
  },
  {
    id: 'umrah',
    type: 'Umrah traveller',
    name: 'Sample traveller C',
    title: 'Prepared with care',
    body: 'The Umrah page feels calm and shows briefing, documentation and group support before departure.',
    isDemo: true,
  },
  {
    id: 'inn',
    type: 'OYA Inn transit guest',
    name: 'Sample guest D',
    title: 'Rest near KLIA',
    body: 'The Inn flow makes it clear that a room can support an early flight or post-arrival rest.',
    isDemo: true,
  },
];

export const faqs: Faq[] = [
  {
    question: 'Are these packages confirmed?',
    answer:
      'No. This is a presentation demo using sample dates, prices and availability. Final details must be confirmed by OYA.',
  },
  {
    question: 'Can I combine OYA Travel with OYA Inn?',
    answer:
      'Yes, the demo shows how travellers can enquire for a journey and add an OYA Inn stay before departure or after arrival.',
  },
  {
    question: 'Is Hajj availability guaranteed?',
    answer:
      'No. Hajj content is register-interest only and subject to official confirmation. This demo does not claim allocation or approval.',
  },
  {
    question: 'Where is OYA Inn located?',
    answer:
      'The demo uses near-KLIA wording only. Exact address and travel time should be added once officially confirmed.',
  },
];

export const gallery = [
  {
    title: 'Island journeys',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=85',
  },
  {
    title: 'Indonesia discovery',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=85',
  },
  {
    title: 'Umrah preparation',
    image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1000&q=85',
  },
  {
    title: 'Family travel',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=85',
  },
  {
    title: 'OYA Inn rooms',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=85',
  },
  {
    title: 'Airport transit',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1000&q=85',
  },
];

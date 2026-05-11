export const assetPath = (path: string) => `/showcase${path}`;

export const products = [
  {
    title: 'The Sovereign',
    label: 'Outerwear',
    src: assetPath('/images/editorial-outerwear.svg'),
  },
  {
    title: 'Noble Thread',
    label: 'Essentials',
    src: assetPath('/images/editorial-essential.svg'),
  },
  {
    title: 'Crown Jewel',
    label: 'Statement pieces',
    src: assetPath('/images/editorial-statement.svg'),
  },
];

export const lookbook = [
  {
    label: 'Autumn/Winter 2024',
    src: assetPath('/images/lookbook-yellow.svg'),
    className: 'lg:row-span-2',
  },
  {
    label: 'The Legacy Edit',
    src: assetPath('/images/lookbook-luxe.svg'),
    className: '',
  },
  {
    label: 'Street Royalty',
    src: assetPath('/images/lookbook-royalty.svg'),
    className: 'lg:row-span-2',
  },
];

export const conversionBenefits = [
  'Fast Shopee handoff',
  'TikTok Live reminders',
  'New-arrival focus',
  'Mobile-first product paths',
];

export const interactiveMoments = [
  'Collection launch sequencing',
  'Live shopping schedule',
  'Lookbook hover reveals',
  'Product story panels',
];

export const assetPath = (path: string) => `/showcase${path}`;

export const products = [
  {
    title: 'Shadow Hood',
    label: 'Oversized hoodie',
    price: 'RM 129',
    src: assetPath('/images/street-hoodie.jpg'),
  },
  {
    title: 'Court Signal Set',
    label: 'Cropped set',
    price: 'RM 159',
    src: assetPath('/images/yellow-set.jpg'),
  },
  {
    title: 'Backprint Heavy Tee',
    label: 'Graphic tee',
    price: 'RM 89',
    src: assetPath('/images/black-graphic-fit.jpg'),
  },
  {
    title: 'Grid Crew Drop',
    label: 'Live drop',
    price: 'RM 119',
    src: assetPath('/images/crew-drop.jpg'),
  },
];

export const lookbook = [
  {
    label: 'Subway fit',
    src: assetPath('/images/chamber-street.jpg'),
    className: 'lg:row-span-2',
  },
  {
    label: 'Crew drop',
    src: assetPath('/images/crew-drop.jpg'),
    className: '',
  },
  {
    label: 'Shadow hood',
    src: assetPath('/images/street-hoodie.jpg'),
    className: 'lg:row-span-2',
  },
];

export const liveSchedule = [
  { day: 'Friday', time: '8 PM MYT', note: 'New drop preview' },
  { day: 'Saturday', time: '3 PM MYT', note: 'Styling battle' },
  { day: 'Sunday', time: '8 PM MYT', note: 'Last-call deals' },
];

export const socials = ['TikTok', 'Instagram', 'Shopee'];

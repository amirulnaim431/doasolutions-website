export const rlzAsset = (path: string) => `/showcase/images/rlz/${path}`;

export type Product = {
  name: string;
  season: string;
  status: string;
  price: string;
  image: string;
  description: string;
  badge?: string;
};

export const products: Product[] = [
  {
    name: 'Parachute Jacket',
    season: 'Season 1',
    status: 'Out now',
    price: 'RM 189',
    image: 'Season1-ParachuteJacket.jpg',
    badge: 'Outerwear',
    description: 'A lightweight statement layer from the first RoyalLegacyz drop.',
  },
  {
    name: 'Season 1 Showcase Tee',
    season: 'Season 1',
    status: 'Out now',
    price: 'RM 89',
    image: 'Season1-Showcase.jpg',
    badge: 'Launch line',
    description: 'The first-line graphic piece built around the Legacyz Never Ends identity.',
  },
  {
    name: 'Pickleball Edition Jersey',
    season: 'Special Edition',
    status: 'Out now',
    price: 'RM 119',
    image: 'RLZ-pickleballedition.jpg',
    badge: 'Court drop',
    description: 'A sport-led limited line for court days, community play, and casual styling.',
  },
  {
    name: 'Pickleball Edition Set',
    season: 'Special Edition',
    status: 'Out now',
    price: 'RM 149',
    image: 'RLZ-pickleballedition3.jpg',
    badge: 'Limited',
    description: 'A sharper match-day silhouette with easy social commerce appeal.',
  },
  {
    name: 'Season 2 1.1',
    season: 'Season 2',
    status: 'Out now',
    price: 'RM 99',
    image: '1.1.jpg',
    badge: 'Drop 1.1',
    description: 'Season 2 placeholder item name for the first confirmed product slot.',
  },
  {
    name: 'Season 2 1.2',
    season: 'Season 2',
    status: 'Out now',
    price: 'RM 109',
    image: '1.jpg',
    badge: 'Drop 1.2',
    description: 'Season 2 placeholder item name for the second confirmed product slot.',
  },
  {
    name: 'Season 2 1.3',
    season: 'Season 2',
    status: 'Out now',
    price: 'RM 109',
    image: '1.3.jpg',
    badge: 'Drop 1.3',
    description: 'Season 2 placeholder item name for the third confirmed product slot.',
  },
];

export const seasons = [
  {
    title: 'Season 1',
    status: 'Out now',
    description: 'The launch era: parachute outerwear, first-line graphics, and early RoyalLegacyz identity.',
    image: 'Season1-Showcase5.jpg',
  },
  {
    title: 'Pickleball Edition',
    status: 'Special edition',
    description: 'A court-inspired capsule made for live selling, styling content, and active streetwear.',
    image: 'RLZ-pickleballedition2.jpg',
  },
  {
    title: 'Season 2',
    status: 'Out now',
    description: 'The current line: cleaner silhouettes, stronger product storytelling, and sharper drop structure.',
    image: 'Season2-Showcaseimage_alltogether.jpg',
  },
  {
    title: 'Season 3',
    status: 'Coming soon',
    description: 'Reserved for the next campaign. Product names, images, and launch dates can be added once finalized.',
    image: 'Header.jpg',
  },
];

export const shopSeasonOrder = ['Season 2', 'Special Edition', 'Season 3', 'Season 1'];

export const galleryGroups = [
  {
    title: 'Season 1',
    images: [
      'Season1-ParachuteJacket.jpg',
      'Season1-ParachuteJacket2.jpg',
      'Season1-ParachuteJacket3.jpg',
      'Season1-Showcase.jpg',
      'Season1-Showcase1.jpg',
      'Season1-Showcase2.jpg',
      'Season1-Showcase3.jpg',
      'Season1-Showcase4.jpg',
      'Season1-Showcase5.jpg',
    ],
  },
  {
    title: 'Pickleball Edition',
    images: [
      'RLZ-pickleballedition.jpg',
      'RLZ-pickleballedition2.jpg',
      'RLZ-pickleballedition3.jpg',
      'RLZ-pickleballedition4.jpg',
      'RLZ-pickleballedition5.jpg',
    ],
  },
  {
    title: 'Season 2',
    images: [
      'Season2-Showcaseimage.jpg',
      'Season2-Showcaseimage2.jpg',
      'Season2-Showcaseimage3.jpg',
      'Season2-Showcaseimage4.jpg',
      'Season2-Showcaseimage5.jpg',
      'Season2-Showcaseimage_alltogether.jpg',
      '1.1.jpg',
      '1.jpg',
      '1.3.jpg',
    ],
  },
];

export const liveSchedule = [
  { day: 'Tuesday', time: '9:00 PM', focus: 'Season 2 try-on and sizing guide' },
  { day: 'Friday', time: '9:30 PM', focus: 'Pickleball Edition styling session' },
  { day: 'Sunday', time: '8:30 PM', focus: 'Restock, bundles, and customer Q&A' },
];

export const loyaltyTiers = [
  {
    name: 'Silver',
    target: 1000,
    note: 'Unlocks after 1,000 points. Perks and privileges to be confirmed.',
  },
  {
    name: 'Gold',
    target: 1500,
    note: 'After Silver, points reset to 0 and Gold becomes the next 1,500-point target.',
  },
  {
    name: 'Platinum',
    target: 2500,
    note: 'After Gold, points reset to 0 and Platinum becomes the final 2,500-point target.',
  },
];

export const purchaseHistory = [
  {
    item: 'Parachute Jacket',
    order: '#RLZ-1049',
    date: '12 May 2026',
    points: 189,
    image: 'Season1-ParachuteJacket.jpg',
    status: 'Delivered',
  },
  {
    item: 'Season 1 Showcase Tee',
    order: '#RLZ-1032',
    date: '28 Apr 2026',
    points: 89,
    image: 'Season1-Showcase2.jpg',
    status: 'Delivered',
  },
  {
    item: 'Season 1 Restock Slot',
    order: '#RLZ-1018',
    date: '14 Apr 2026',
    points: 120,
    image: 'Season1-Showcase5.jpg',
    status: 'Completed',
  },
];

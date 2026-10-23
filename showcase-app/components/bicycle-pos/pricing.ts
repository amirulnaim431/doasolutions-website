import type { Tier } from './data';

export const packages = [
  { tier: 1, name: 'Basic POS', developmentFee: 3900 },
  { tier: 2, name: 'POS + Workshop', developmentFee: 6900 },
  { tier: 3, name: 'POS + Workshop + Purchasing', developmentFee: 9900 },
] as const;

export const hostingMaintenanceMonthly = 200;
export const pricingScopeNote = 'Software only, for one shop. Hardware, data migration and third-party integrations quoted separately. Final scope confirmed in the quotation.';
export const packageFor = (tier: Tier) => packages[tier - 1];
export const formatPackagePrice = (amount: number) => `RM${amount.toLocaleString('en-MY')}`;

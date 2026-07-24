# OYA Demo Website

This is a static Next.js demo for the OYA parent brand, covering OYA Travel and OYA Inn.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open `/showcase/oya/` when using the configured `basePath`.

## Production Build

```bash
npm run build
```

The static export is written to `showcase-app/out`. Copy the export into the repository-level `showcase/` folder for the DOA Demo section.

## Project Structure

- `app/oya/**` - public OYA routes
- `components/oya/OyaDemo.tsx` - shared OYA page renderer and interactions
- `components/oya/types.ts` - TypeScript interfaces
- `components/oya/data/packages.ts` - travel, Umrah and Hajj enquiry demo packages
- `components/oya/data/rooms.ts` - OYA Inn room demo data and availability
- `components/oya/data/content.ts` - company placeholders, testimonials, FAQ, amenities and gallery
- `components/oya/data/translations.ts` - BM/EN key interface copy
- `app/globals.css` - OYA visual system styles under `.oya-site`

## Replace Logo

The logo is currently text-based in `components/oya/OyaDemo.tsx` inside `OyaLogo()`. Replace that component with the official asset when available.

## Replace Images

Remote Unsplash images are referenced in:

- `components/oya/data/packages.ts`
- `components/oya/data/rooms.ts`
- `components/oya/data/content.ts`

Replace with official OYA photography or locally hosted assets when available.

## Edit Packages

Edit `components/oya/data/packages.ts`. All package entries are sample demo data and use `isDemo: true`.

## Edit Room Information

Edit `components/oya/data/rooms.ts`. All room entries are sample demo data and use `isDemo: true`.

## Configure WhatsApp and Contact Links

Edit `components/oya/data/content.ts`, especially `companyInfo`.

## Checks

Run:

```bash
npm run lint
npm run build
```

# OYA Demo Website

This showcase app now includes a complete OYA demo at `/showcase/oya/`.

## Setup

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

The static export is generated in `showcase-app/out`. For the DOA Solutions Demo section, copy `showcase-app/out` into the repository-level `showcase/` folder.

## OYA Project Structure

- `app/oya/**` - all public OYA routes
- `components/oya/OyaDemo.tsx` - shared layout, pages and interactions
- `components/oya/types.ts` - TypeScript interfaces
- `components/oya/data/packages.ts` - package demo data
- `components/oya/data/rooms.ts` - room and availability demo data
- `components/oya/data/content.ts` - company placeholders, testimonials, FAQ, amenities and gallery
- `components/oya/data/translations.ts` - BM/EN interface copy
- `app/globals.css` - OYA styling under `.oya-site`

## Replace Logo

Replace the text logo in `OyaLogo()` inside `components/oya/OyaDemo.tsx`.

## Replace Images

Replace Unsplash URLs in:

- `components/oya/data/packages.ts`
- `components/oya/data/rooms.ts`
- `components/oya/data/content.ts`

## Edit Packages

Edit `components/oya/data/packages.ts`.

## Edit Room Information

Edit `components/oya/data/rooms.ts`.

## Configure WhatsApp and Contacts

Edit `companyInfo` in `components/oya/data/content.ts`.

## Checks

```bash
npm run lint
npm run build
```

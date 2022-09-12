# Mytrail.live

Source for [mytrail.live](https://mytrail.live)

## Features

- PWA suppot (with next-pwa)
- Web push notificaiton management
- SMTP email integration with nodemailer
- Light/ Dark mode
- SSR, CSR, SSG for different pages
- Auth with Google, Facebook, Email
- Shareable link generation
- Integration with Prisma/ Postgres
- Nginx as reverse proxy
- ESLint setup with [eslint-config-mantine](https://github.com/mantinedev/eslint-config-mantine)

## Stack

- Next.js
- Mantine UI
- Prisma
- Nginx
- Azure Blob (image upload)
- Cloudflare (DNS/ CDN)

## Yarn/ NPM Scripts

### Build and dev scripts

- `dev` – start dev server
- `build` – bundle application for production
- `export` – exports static website to `out` folder
- `analyze` – analyzes application bundle with [@next/bundle-analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

### Testing scripts

- `typecheck` – checks TypeScript types
- `lint` – runs ESLint
- `prettier:check` – checks files with Prettier
- `jest` – runs jest tests
- `jest:watch` – starts jest watch
- `test` – runs `jest`, `prettier:check`, `lint` and `typecheck` scripts

### Other scripts

- `storybook` – starts storybook dev server
- `storybook:build` – build production storybook bundle to `storybook-static`
- `prettier:write` – formats all files with Prettier
- `npx prisma db push` - synchronize Prisma schema Postgres
- `npx prisma migrate dev` - Generate and apply Prisma migration
- `npx prisma migrate dev` - Generate Prisma client
- `npx prisma studio` - Run prisma studio

## Pre-Deployment

- Populate .env.template
- Run fullstack locally with `docker-compose up db app nginx`

## TO-DO

- Compress image before upload + better feedback
- Fix link UI
- Import/ Export feature
- Edit footprint (TBC)
- Storybook
- Full coverage with Jest
- CICD
- Auto cert renewal
- Deployment guide

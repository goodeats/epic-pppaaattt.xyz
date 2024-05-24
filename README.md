# [Epic PPPAAATTT](https://github.com/goodeats/epic-pppaaattt)

A generative art generator with various product-building demonstrations of web development

## GETTING STARTED

To get started with this project, follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Run `npm install` to install the necessary dependencies.
4. Copy environment variables `cp .env.example .env` (make changes to ADMIN env variables to your suiting, for instance GitGuardian won't let me commit a fake password)
5. Run `npm run setup`
6. Start the development server by running `npm run dev`.

## HOW TO USE

Please keep in mind this is a personal project, not yet intended for a wide audience

- login as `adminUser` set from seeds in `prisma/seed.ts` (if you want to change this then run `npm run setup` again)
- from user dropdown in upper right navigate to sketch and select `My First Artwork` (created from seed)
- add at least one design attribute for each category
- add a layer, which will adopt the artwork design attributes
- click on the layer name to select it and adjust the designs from there
- move up/down, make visible/invisible, add/remove designs and layers to create different outputs on the artwork
- creating a new version will save your progress
- creating a new branch will allow you to explore a different creative pursuit

## TECH STACK

- Framework (full-stack): [Remix Run](https://remix.run/) | [Epic Stack](https://github.com/epicweb-dev/epic-stack) | [Vite](https://remix.run/blog/remix-heart-vite)
- DB: [SQLite](https://www.sqlite.org/index.html)
- ORM: [Prisma](https://www.prisma.io/)
- UI: [tailwindcss](https://tailwindcss.com/) | [Radix](https://www.radix-ui.com/) | [shadcn/ui](https://ui.shadcn.com/)
- Forms: [Zod](https://zod.dev/) | [Conform](https://conform.guide/)

## NOTES

- this is a project built for personal use in developing a project to achieve my artistic goals: rapid development and deployment of unique artistic projects in the marketplace
- foregoing tests a bit to get the MVP out
- I took inspiration from the Figma dashboard UI for setting up how I want to build art generators

## ROADMAP

- connect to shopify products
- import/export image assets to modify pixels into art
- import/export design types and layers
- shareable links -- use [v0](v0.dev) as a guide

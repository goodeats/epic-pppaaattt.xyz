# [Epic PPPAAATTT](https://github.com/goodeats/epic-pppaaattt)

Drawing generative geometric shapes on a canvas

Progress: 🚧 Constructing MVP... 🚧

## GETTING STARTED

To get started with this project, follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Run `npm install` to install the necessary dependencies.
4. Copy environment variables `cp .env.example .env`
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

## TECH STACK

- Framework (full-stack): [Remix Run](https://remix.run/) | [Epic Stack](https://github.com/epicweb-dev/epic-stack)
- DB: [SQLite](https://www.sqlite.org/index.html)
- ORM: [Prisma](https://www.prisma.io/)
- UI: [tailwindcss](https://tailwindcss.com/) | [Radix](https://www.radix-ui.com/) | [shadcn/ui](https://ui.shadcn.com/)
- Forms: [Zod](https://zod.dev/) | [Conform](https://conform.guide/)

## NOTES

- this is a project built for personal use in developing a project to achieve my artistic goals: rapid development and deployment of unique artistic projects in the marketplace
- foregoing tests a bit to get the MVP out
- I recently discovered the Figma UI and feel that dashboard is a good representation of how I want to build this

## ROADMAP

- version history to save instances of artworks if I like the designs
- connect to shopify products
- migrate to [vite](https://remix.run/blog/remix-heart-vite)
- import/export image assets to modify pixels into art
- import/export design types and layers
- shareable links -- use [v0](v0.dev) as a guide

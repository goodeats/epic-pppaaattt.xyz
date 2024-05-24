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
- Deployment: [Fly.io](https://fly.io/) | [LiteFS](https://fly.io/docs/litefs/)
- UI: [tailwindcss](https://tailwindcss.com/) | [Radix](https://www.radix-ui.com/) | [shadcn/ui](https://ui.shadcn.com/)
- Validation: [Zod](https://zod.dev/) | [Conform](https://conform.guide/)
- Monitoring: [Sentry](https://sentry.io/auth/login/pantastic/)
- Other:
  - [Reactflow](https://reactflow.dev/): canvas as interactive node in editor (inspired by Figma)

## NOTES

- This was created as a personal project to achieve my goal of rapid development and deployment of scalable artistic projects in the marketplace
- This was also created for personal development as a software engineer
- Foregoing tests a bit to get the MVP out
- Sketch dashboard inspired by Figma dashboard UI

## ROADMAP

- blog about code, art, why I'm doing this
- demo video
- rwd review
- upload image assets to modify pixels into art (I've done this with former versions)
- connect to shopify products
- open app to many users
- shareable links to artworks -- use [v0](v0.dev) as a guide
- import/export design types and layers to use interchangeably with other artworks
- user collaboration

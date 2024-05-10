#!/bin/sh

# https://github.com/epicweb-dev/epic-stack/blob/main/docs/database.md
# to give permission to execute the file locally run:
# chmod +x scripts/fly.io/app-console-prisma-studio.sh

# run prisma studio on fly app
# npm run fly:app:console:prisma:studio
# run proxy to prisma studio on fly app to local port (separate terminal)
# npm run fly:app:console:prisma:studio:proxy

source .env

fly ssh console -C "npm run prisma:studio" --app $FLY_APP_NAME

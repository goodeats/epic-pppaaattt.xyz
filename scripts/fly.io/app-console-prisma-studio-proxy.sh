#!/bin/sh

# https://github.com/epicweb-dev/epic-stack/blob/main/docs/database.md
# to give permission to execute the file locally run:
# chmod +x scripts/fly.io/app-console-prisma-studio-proxy.sh

# run prisma studio on fly app
# npm run fly:app:console:prisma:studio
# run proxy to prisma studio on fly app to local port (separate terminal)
# npm run fly:app:console:prisma:studio:proxy

source .env

fly proxy 5556:5555 --app $FLY_APP_NAME

#!/bin/sh

# https://github.com/epicweb-dev/epic-stack/blob/main/docs/database.md
# to give permission to execute the file locally run:
# chmod +x scripts/fly.io/app-status.sh

source .env

fly status --app $FLY_APP_NAME
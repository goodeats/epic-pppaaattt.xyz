#!/bin/sh

# https://github.com/epicweb-dev/epic-stack/blob/main/docs/database.md
# to give permission to execute the file locally run:
# chmod +x scripts/fly.io/app-console-prisma-studio.sh

# run prisma studio on fly app
# npm run fly:app:console:prisma:studio
# run proxy to prisma studio on fly app to local port (separate terminal)
# npm run fly:app:console:prisma:studio:proxy

# Check if the script is running in production environment
if [ "$NODE_ENV" = "production" ]; then
  echo "This script should not run in production."
  exit 1
fi

# Default environment
ENV="development"

# Parse arguments
for ARG in "$@"
do
  case $ARG in
    --env=*)
    ENV="${ARG#*=}"
    shift
    ;;
  esac
done

# Source environment variables
source .env

# Check if the environment variable is set
if [ -z "$FLY_APP_NAME" ]; then
  echo "Error: FLY_APP_NAME environment variable is not set."
  exit 1
fi

# Modify the app name for staging environment
if [ "$ENV" = "staging" ]; then
  FLY_APP_NAME="${FLY_APP_NAME}-staging"
elif [ "$ENV" != "production" ]; then
  echo "Unknown environment: $ENV"
  exit 1
fi

# Run the Fly.io ssh console command
fly ssh console -C "npm run prisma:studio" --app $FLY_APP_NAME

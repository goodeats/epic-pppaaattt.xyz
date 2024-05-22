#!/bin/sh

# https://github.com/epicweb-dev/epic-stack/blob/main/docs/database.md
# to give permission to execute the file locally run:
# chmod +x scripts/fly.io/app-status.sh

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

# Run the Fly.io status command
fly status --app $FLY_APP_NAME
#!/usr/bin/env bash
# =====================================================================
# deploy_orderflow_frontend_prod.sh
#
# Build and deploy the OrderFlow Cloud Angular frontend to Hostpoint.
#
# Angular outputPath (angular.json):
#   dist/orderflow-cloud-frontend/browser
#
# We DEPLOY that build into:
#   /home/zitatusi/www/devprojects.ch/orderflow-cloud/browser
#
# So the effective document root on Hostpoint is:
#   /home/zitatusi/www/devprojects.ch/orderflow-cloud/browser
#
# URL in the browser stays:
#   https://devprojects.ch/orderflow-cloud/
# =====================================================================

set -euo pipefail

# --------- PROJECT ROOT ----------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOCAL_PROJECT_ROOT="$SCRIPT_DIR"

echo ">>> Project root (SCRIPT_DIR): $LOCAL_PROJECT_ROOT"

# This MUST match angular.json -> outputPath
LOCAL_BUILD_DIR="$LOCAL_PROJECT_ROOT/dist/orderflow-cloud-frontend/browser"

# --------- REMOTE CONFIG ----------------------------------------------
REMOTE_HOST="zitatusi@zitatusi.myhostpoint.ch"
REMOTE_WEB_ROOT="/home/zitatusi/www/devprojects.ch"

# IMPORTANT:
# We now DEPLOY INTO the 'browser' directory on the server.
REMOTE_APP_DIR="$REMOTE_WEB_ROOT/orderflow-cloud/browser"

# --------- BUILD + DEPLOY ---------------------------------------------
echo ">>> [1/4] Running frontend tests (npm test)..."
cd "$LOCAL_PROJECT_ROOT"
npm test -- --watch=false

echo ">>> [2/4] Building Angular app for PRODUCTION with base-href /orderflow-cloud/ ..."
npx ng build --configuration production --base-href /orderflow-cloud/

# Confirm that the local build dir exists AFTER build
if [ ! -d "$LOCAL_BUILD_DIR" ]; then
  echo "ERROR: Expected build dir does not exist: $LOCAL_BUILD_DIR"
  exit 1
fi

echo ">>> [3/4] Ensuring remote target directory exists: $REMOTE_APP_DIR"
ssh "$REMOTE_HOST" "mkdir -p '$REMOTE_APP_DIR'"

echo ">>> [4/4] Deploying build artifacts via rsync to Hostpoint..."
echo "     Source (local):  $LOCAL_BUILD_DIR/"
echo "     Target (remote): $REMOTE_APP_DIR/"

# Trailing slash = copy CONTENTS of local browser/ into remote browser/
rsync -avz --delete \
  "$LOCAL_BUILD_DIR"/ \
  "$REMOTE_HOST:$REMOTE_APP_DIR"/

echo "==================================================================="
echo "Deployment finished."
echo
echo "Angular build is now deployed to:"
echo "  $REMOTE_APP_DIR"
echo
echo "You should reach it at:"
echo "  https://devprojects.ch/orderflow-cloud/"
echo "==================================================================="
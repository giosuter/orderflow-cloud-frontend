#!/usr/bin/env bash
# =====================================================================
# deploy_orderflow_frontend_prod.sh
#
# Build and deploy the OrderFlow Cloud Angular frontend to Hostpoint.
#
# - Angular outputPath (angular.json) is:
#     dist/orderflow-cloud-frontend/browser
# - We COPY ONLY THE CONTENTS of that browser folder to Hostpoint:
#     /home/zitatusi/www/devprojects.ch/orderflow-cloud
#
# Result on Hostpoint:
#   /home/zitatusi/www/devprojects.ch/orderflow-cloud/index.html
#   /home/zitatusi/www/devprojects.ch/orderflow-cloud/main-*.js
#   /home/zitatusi/www/devprojects.ch/orderflow-cloud/polyfills-*.js
#   /home/zitatusi/www/devprojects.ch/orderflow-cloud/styles-*.css
# =====================================================================

set -euo pipefail

# --------- PROJECT ROOT ----------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOCAL_PROJECT_ROOT="$SCRIPT_DIR"

echo ">>> Project root (SCRIPT_DIR): $LOCAL_PROJECT_ROOT"

# MUST match angular.json outputPath
LOCAL_BUILD_DIR="$LOCAL_PROJECT_ROOT/dist/orderflow-cloud-frontend/browser"

if [ ! -d "$LOCAL_BUILD_DIR" ]; then
  echo "ERROR: Expected build dir does not exist: $LOCAL_BUILD_DIR"
  exit 1
fi

# --------- REMOTE CONFIG ----------------------------------------------
REMOTE_HOST="zitatusi@zitatusi.myhostpoint.ch"
REMOTE_WEB_ROOT="/home/zitatusi/www/devprojects.ch"
REMOTE_APP_DIR="$REMOTE_WEB_ROOT/orderflow-cloud"

# --------- BUILD + DEPLOY ---------------------------------------------
echo ">>> [1/4] Running frontend tests (npm test)..."
cd "$LOCAL_PROJECT_ROOT"
npm test -- --watch=false

echo ">>> [2/4] Building Angular app for PRODUCTION with base-href /orderflow-cloud/ ..."
npx ng build --configuration production --base-href /orderflow-cloud/

echo ">>> [3/4] Ensuring remote target directory exists: $REMOTE_APP_DIR"
ssh "$REMOTE_HOST" "mkdir -p '$REMOTE_APP_DIR'"

echo ">>> [4/4] Deploying *contents* of browser/ via rsync to Hostpoint..."
echo "     Source (local):  $LOCAL_BUILD_DIR/"
echo "     Target (remote): $REMOTE_APP_DIR/"

# Trailing slash = copy CONTENTS of browser/, not browser dir itself
rsync -avz --delete \
  "$LOCAL_BUILD_DIR"/ \
  "$REMOTE_HOST:$REMOTE_APP_DIR"/

echo "==================================================================="
echo "Deployment finished."
echo "Frontend should now be reachable at:"
echo "  https://devprojects.ch/orderflow-cloud/"
echo "==================================================================="
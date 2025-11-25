#!/usr/bin/env bash
# =====================================================================
# deploy_orderflow_frontend_prod.sh
#
# Build and deploy the OrderFlow Cloud Angular frontend to Hostpoint.
#
# This script:
#  - assumes Angular outputs to: dist/orderflow-cloud-frontend/browser
#  - copies ONLY the CONTENTS of that browser folder to Hostpoint:
#      /home/zitatusi/www/devprojects.ch/orderflow-cloud
#
# Final production URL:
#   https://devprojects.ch/orderflow-cloud/
#
# The backend API runs at:
#   https://devprojects.ch/orderflow-api/api/...
# and is configured via src/environments/environment.prod.ts
# =====================================================================

set -euo pipefail

# --------- PROJECT ROOT ----------------------------------------------
# Directory where this script lives (works for Jenkins and local)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOCAL_PROJECT_ROOT="$SCRIPT_DIR"

echo ">>> Project root (SCRIPT_DIR): $LOCAL_PROJECT_ROOT"

# Angular *browser* build dir (this is where Angular puts index.html, main-*.js, etc.)
LOCAL_BUILD_DIR="$LOCAL_PROJECT_ROOT/dist/orderflow-cloud-frontend/browser"

if [ ! -d "$LOCAL_BUILD_DIR" ]; then
  echo "ERROR: Expected build dir does not exist: $LOCAL_BUILD_DIR"
  echo "Did ng build run with outputPath including /browser ?"
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

# IMPORTANT:
#   - the trailing slash on $LOCAL_BUILD_DIR/ means:
#       copy CONTENTS of browser, NOT the browser folder itself
rsync -avz --delete \
  "$LOCAL_BUILD_DIR"/ \
  "$REMOTE_HOST:$REMOTE_APP_DIR"/

echo "==================================================================="
echo "Deployment finished."
echo
echo "Frontend should now be reachable at:"
echo "  https://devprojects.ch/orderflow-cloud/"
echo
echo "It will call the backend at:"
echo "  https://devprojects.ch/orderflow-api/api/orders"
echo "==================================================================="
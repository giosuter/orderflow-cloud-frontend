#!/usr/bin/env bash
# =====================================================================
# deploy_orderflow_frontend_prod.sh
#
# Build and deploy the OrderFlow Cloud Angular frontend to Hostpoint.
#
# This script is designed to work both:
#  - when run manually from your local dev project
#  - when run by Jenkins from its workspace
#
# It always uses *the directory where this script lives* as the project root.
#
# Final production URL:
#   https://devprojects.ch/orderflow-cloud/
#
# The backend API runs at:
#   https://devprojects.ch/orderflow-api/api/...
# and is configured via src/environments/environment.prod.ts
# =====================================================================

set -euo pipefail

# --------- PROJECT ROOT DETECTION -------------------------------------
# Directory where this script lives (works for Jenkins and local)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOCAL_PROJECT_ROOT="$SCRIPT_DIR"

echo ">>> Project root (SCRIPT_DIR): $LOCAL_PROJECT_ROOT"

# Angular dist root
LOCAL_DIST_ROOT="$LOCAL_PROJECT_ROOT/dist/orderflow-cloud-frontend"

# Decide which folder actually contains the browser build
if [ -d "$LOCAL_DIST_ROOT/browser" ]; then
  # Case 1: Angular created dist/orderflow-cloud-frontend/browser (your preferred case)
  LOCAL_BUILD_DIR="$LOCAL_DIST_ROOT/browser"
  echo ">>> Using build dir with browser subfolder: $LOCAL_BUILD_DIR"
else
  # Case 2: Angular wrote directly to dist/orderflow-cloud-frontend
  LOCAL_BUILD_DIR="$LOCAL_DIST_ROOT"
  echo ">>> Using build dir without browser subfolder: $LOCAL_BUILD_DIR"
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

echo ">>> [4/4] Deploying build artifacts via rsync to Hostpoint..."
# IMPORTANT: trailing slash on source so ONLY CONTENTS are copied, not the folder name
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
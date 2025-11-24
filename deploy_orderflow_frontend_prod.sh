#!/usr/bin/env bash
# =====================================================================
# deploy_orderflow_frontend_prod.sh
#
# Build and deploy the OrderFlow Cloud Angular frontend to Hostpoint.
#
# Local project root:
#   /Users/giovannisuter/dev/projects/orderflow-cloud/front-end/orderflow-cloud-frontend
#
# Remote web root:
#   /home/zitatusi/www/devprojects.ch
#
# Final production URL:
#   https://devprojects.ch/orderflow-cloud/
#
# The backend API runs at:
#   https://devprojects.ch/orderflow-api/api/...
# and is configured via src/environments/environment.prod.ts
# =====================================================================

set -euo pipefail

# --------- CONFIG -----------------------------------------------------

LOCAL_PROJECT_ROOT="/Users/giovannisuter/dev/projects/orderflow-cloud/front-end/orderflow-cloud-frontend"
LOCAL_BUILD_DIR="$LOCAL_PROJECT_ROOT/dist/orderflow-cloud-frontend/browser"

REMOTE_HOST="zitatusi@zitatusi.myhostpoint.ch"
REMOTE_WEB_ROOT="/home/zitatusi/www/devprojects.ch"
REMOTE_APP_DIR="$REMOTE_WEB_ROOT/orderflow-cloud"

# ---------------------------------------------------------------------
echo ">>> [1/4] Running frontend tests (npm test)..."
cd "$LOCAL_PROJECT_ROOT"
npm test -- --watch=false

echo ">>> [2/4] Building Angular app for PRODUCTION with base-href /orderflow-cloud/ ..."
npx ng build --configuration production --base-href /orderflow-cloud/

echo ">>> [3/4] Ensuring remote target directory exists: $REMOTE_APP_DIR"
ssh "$REMOTE_HOST" "mkdir -p '$REMOTE_APP_DIR'"

echo ">>> [4/4] Deploying build artifacts via rsync to Hostpoint..."
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

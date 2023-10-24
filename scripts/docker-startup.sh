#!/bin/bash

# load runtime configuration
LOCK_DOMAIN=${LOCK_DOMAIN:-"false"}

# store runtime configuration
RUNTIME_CONFIG_FILE=/usr/share/nginx/html/runtime-config.js
if [ -f $RUNTIME_CONFIG_FILE ]; then
    rm $RUNTIME_CONFIG_FILE
fi

echo "$(cat <<EOM
// runtime-config.js
window['RuntimeConfig'] = {
    DomainLock: "${LOCK_DOMAIN}"
};
EOM
)" > $RUNTIME_CONFIG_FILE

# Start Nginx (default entrypoint)
exec nginx -g "daemon off;"

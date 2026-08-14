#!/bin/sh
set -eu

(
    attempts=0

    until response="$(wget -qO- http://127.0.0.1/api/health 2>&1)"; do
        attempts=$((attempts + 1))

        if [ "$attempts" -ge 30 ]; then
            echo >&2 '[startup] API indisponible après 30 secondes'
            exit 1
        fi

        sleep 1
    done

    echo '[startup] API opérationnelle'
    echo "[startup] Réponse du healthcheck : $response"
) &

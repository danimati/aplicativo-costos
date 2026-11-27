#!/usr/bin/env bash
# Regenera los SVG de docs/diagramas a partir de src/*.puml usando PlantUML en Docker.
set -euo pipefail
cd "$(dirname "$0")"
docker run --rm -e HOME=/tmp -u "$(id -u):$(id -g)" -v "$PWD":/data:z \
  plantuml/plantuml:1.2025.4 -charset UTF-8 -tsvg -o /data /data/src/*.puml
echo "SVG generados: $(ls *.svg | wc -l)"

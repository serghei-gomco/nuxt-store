#!/usr/bin/env bash
# Local Lighthouse lab run (default mobile emulation: Moto G Power, slow 4G, 4x CPU slowdown).
# Usage: npm run generate && npx serve@14 .output/public -l 4173   (in another terminal)
#        bash scripts/lighthouse.sh [base-url]
set -euo pipefail
BASE="${1:-http://localhost:4173}"
OUT=.lighthouse/raw
mkdir -p "$OUT"
for path in / /products/stoneware-mug /cart; do
  name=$(echo "$path" | tr '/' '_' | sed 's/^_$/home/;s/^_//')
  npx -y lighthouse@13.6.0 "$BASE$path" \
    --only-categories=performance \
    --chrome-flags="--headless=new" \
    --output=json --output-path="$OUT/$name.json" --quiet
  node -e '
    const r = require(process.argv[1]); const a = r.audits;
    const js = a["resource-summary"].details.items.find(i => i.resourceType === "script");
    console.log([process.argv[2],
      "perf=" + Math.round(r.categories.performance.score * 100),
      "FCP=" + a["first-contentful-paint"].displayValue,
      "LCP=" + a["largest-contentful-paint"].displayValue,
      "CLS=" + a["cumulative-layout-shift"].numericValue,
      "TBT=" + a["total-blocking-time"].displayValue,
      "JS=" + (js.transferSize / 1024).toFixed(1) + "KiB",
      "total=" + (a["total-byte-weight"].numericValue / 1024).toFixed(1) + "KiB"].join("  "))
  ' "$PWD/$OUT/$name.json" "$path"
done

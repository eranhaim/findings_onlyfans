#!/bin/sh
echo "=== BACKEND STRUCTURE ==="
find ~/telescope/backend/src -type f -name "*.js" -o -name "*.ts" | head -40
echo ""
echo "=== MODELS ==="
ls ~/telescope/backend/src/models/ 2>/dev/null || echo "no models dir"
echo ""
echo "=== LOOKING FOR MEDIA/S3/CACHE ==="
grep -rl "s3\|S3\|cache\|Cache\|CloudFront\|cloudfront\|CDN\|cdn" ~/telescope/backend/src/ 2>/dev/null | head -20
echo ""
echo "=== ENV FILE ==="
cat ~/telescope/backend/.env 2>/dev/null | grep -i "s3\|aws\|cache\|cloud\|cdn\|redis" || echo "no matching env vars"

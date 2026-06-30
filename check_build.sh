#!/bin/sh
grep -c 'telescope-media-us' /usr/share/nginx/html/assets/*.js
grep -o 's3/proxy' /usr/share/nginx/html/assets/*.js | head -3

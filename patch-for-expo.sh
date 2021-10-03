pwd
ls lib/src/platform/**.*
rm -f lib/src/platform/index.expo.js
echo "export var isExpo = function () { return true; };" >> lib/src/platform/index.expo.js
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

rm -rf ~/gitmeme
mkdir ~/gitmeme
rsync -av --exclude="node_modules" --exclude="webpack" --exclude="yarn.lock" --exclude="tsconfig.json" "$DIR/../extension" ~/gitmeme/

cd ~/gitmeme/

mv extension Gitmeme

cd Gitmeme/build
ls  | grep -v contentScript.js | grep -v style.css | grep -v background.js | xargs rm
rm -rf util
rmdir util

cd ..
rm -f popup/static/js/*.map
rm -f popup/manifest.json

cd ..
zip Gitmeme.zip -r Gitmeme

mv Gitmeme.zip "$DIR/.."

cd $DIR/..

echo "Packaged Gitmeme in $DIR/../Gitmeme.zip"

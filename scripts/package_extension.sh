DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# Build the popup React app and the extension code
cd "$DIR/../popup"
source ~/.nvm/nvm.sh

echo "=== Building Popup ==="

nvm use 16
npm run build

echo "=== Building Popup Complete ==="

cd "$DIR/../extension"

echo "=== Building Extension ==="

nvm use 18
npm run build

echo "=== Building Extension Complete ==="

cd "$DIR/.."

# Create a temp folder to hold the files
rm -rf ~/gitmeme
mkdir ~/gitmeme

# Copy the extension code to the temp folder
rsync -av --exclude="node_modules" --exclude="yarn.lock" --exclude="tsconfig.json" "$DIR/../extension" ~/gitmeme/

cd ~/gitmeme/

# Rename the temp extension folder to Gitmeme
mv extension Gitmeme


cd Gitmeme/build
ls  | grep -v contentScript.js | grep -v style.css | grep -v service_worker.js | xargs rm
rm -rf util
rmdir util

cd ..
rm -f popup/static/js/*.map
rm -f popup/manifest.json

cd ..
echo "Zipping ChromeGitmeme.zip"
zip ChromeGitmeme.zip -r Gitmeme
mv ChromeGitmeme.zip "$DIR/.."

cd Gitmeme

echo "Zipping FirefoxGitmeme.zip"
zip -r -X "$DIR/../FirefoxExtension.zip" ./*

cd $DIR/..

# Package up the source for Mozilla
mkdir ./tmpPacking
rsync -av --progress ./extension ./tmpPacking --exclude node_modules --exclude popup --exclude build

rsync -av --progress ./popup ./tmpPacking/extension --exclude node_modules

(cd ./tmpPacking/extension && zip -r -X ../../FirefoxSource.zip ./*)
rm -rf ./tmpPacking

echo "Packaged Gitmeme in $DIR/.."

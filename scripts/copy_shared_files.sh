DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

rm -rf "$DIR/../extension/src/shared"
rm -rf "$DIR/../popup/src/shared"

cp -R "$DIR/../shared" "$DIR/../extension/src/shared"
cp -R "$DIR/../shared" "$DIR/../popup/src/shared"
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# Generate the /shared/secrets.ts file
echo "export const GITHUB_CLIENT_SECRET=\"$GITHUB_SECRET\";" > "$DIR/../lib/generated/secrets.ts"
#!/usr/bin/env bash
# Repeatable deploy: build the static site and publish it to the `gh-pages`
# branch, which GitHub Pages serves at https://<owner>.github.io/<repo>/.
#
# Needs only a `repo`-scoped GitHub token (no `workflow` scope). Run from the
# repo root:  npm run deploy
set -euo pipefail

# Derive owner/repo from the origin URL using portable bash expansion
# (handles both https://github.com/owner/repo.git and git@github.com:owner/repo.git).
ORIGIN_URL="$(git config --get remote.origin.url)"
ORIGIN_URL="${ORIGIN_URL%.git}"
REPO_NAME="${ORIGIN_URL##*/}"
REST="${ORIGIN_URL%/*}"
OWNER="${REST##*[:/]}"
BASE_PATH="/${REPO_NAME}"

echo "Building static site with base path ${BASE_PATH} ..."
PAGES_BASE_PATH="${BASE_PATH}" npm run build

# Disable Jekyll so GitHub Pages serves Next.js's _next/ assets verbatim.
touch out/.nojekyll

echo "Publishing ./out to gh-pages ..."
npx --yes gh-pages@6 --dotfiles --dist out --branch gh-pages --message "deploy: $(git rev-parse --short HEAD)"

echo "Done. Live at: https://${OWNER}.github.io/${REPO_NAME}/"

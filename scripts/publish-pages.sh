#!/usr/bin/env bash
# Publishes the built Storybook (storybook-static/) to the gh-pages branch,
# which GitHub Pages serves.
#   bash scripts/publish-pages.sh .                   -> live Storybook (site root)
#   bash scripts/publish-pages.sh preview/my-branch   -> a preview folder
#   bash scripts/publish-pages.sh preview/my-branch --remove   -> delete a preview
# The live site and each preview live in their own folders, so they never overwrite each other.
set -euo pipefail
DEST="$1"
MODE="${2:-}"

git config user.name "storybook-bot"
git config user.email "storybook-bot@users.noreply.github.com"

git worktree remove --force site >/dev/null 2>&1 || true
rm -rf site
git worktree prune
if git ls-remote --exit-code --heads origin gh-pages >/dev/null 2>&1; then
  git fetch -q origin gh-pages
  git worktree add -q -B gh-pages site FETCH_HEAD
else
  git worktree add -q --detach site
  (cd site && git checkout -q --orphan gh-pages && git rm -rqf . >/dev/null 2>&1 || true)
fi

cd site
touch .nojekyll
if [ "$DEST" = "." ]; then
  # Live: replace everything except the preview folders.
  find . -mindepth 1 -maxdepth 1 ! -name .git ! -name preview ! -name .nojekyll -exec rm -rf {} +
  cp -R ../storybook-static/. .
else
  rm -rf "$DEST"
  if [ "$MODE" != "--remove" ]; then
    mkdir -p "$DEST"
    cp -R ../storybook-static/. "$DEST"/
  fi
fi

git add -A
if git diff --cached --quiet; then
  echo "Nothing to publish."
  exit 0
fi
git commit -qm "Publish Storybook: ${DEST} ${MODE}"

# Another run may have published at the same time: retry on top of it.
for attempt in 1 2 3 4; do
  if git push -q origin gh-pages; then echo "Published ${DEST} ${MODE}"; exit 0; fi
  sleep $((attempt * 3))
  git fetch -q origin gh-pages
  git rebase -q FETCH_HEAD || { git rebase --abort; exit 1; }
done
exit 1

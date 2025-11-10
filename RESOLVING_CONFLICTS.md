# Resolving merge conflicts for this project

If GitHub reports that `index.html` and `script.js` cannot be merged automatically, use the following approach locally to reconcile both versions before pushing the fix:

1. Make sure your local repository is up to date.
   ```bash
   git fetch origin
   git checkout work
   git pull
   ```
2. Start an interactive rebase onto the latest `main` (or the branch the pull request targets):
   ```bash
   git rebase origin/main
   ```
   Git will pause and show the conflicting files when a conflict is detected.
3. Open each conflicting file (for example `index.html` and `script.js`) and search for the conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`).
4. Edit the file so that only the final, intended content remains. You may need to blend sections from both branches manually.
5. Stage the resolved file once you are happy with the result.
   ```bash
   git add index.html script.js
   ```
6. Continue the rebase, or if you were merging, continue the merge:
   ```bash
   git rebase --continue
   ```
   Repeat steps 3–6 until Git reports that the rebase/merge is complete.
7. Run a quick sanity check locally (open `index.html` in a browser) to ensure the dashboard renders correctly.
8. Push the rebased branch back to the remote and update the pull request:
   ```bash
   git push --force-with-lease
   ```

This process guarantees that your pull request contains the resolved files and that GitHub can merge it without further conflicts.

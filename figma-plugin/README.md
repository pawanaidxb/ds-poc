# Send to code (Figma plugin)

Sends the selected Figma components to GitHub. The AI build writes the code on the **test** branch,
the preview Storybook builds, and the "Preview: test" pull request opens. Nothing goes live until you merge.

## Install (once, Figma desktop app)
1. Download this `figma-plugin` folder (or the zip) and unzip it.
2. In Figma: **Plugins → Development → Import plugin from manifest…** and pick `manifest.json`.
3. Run it: **Plugins → Development → Send to code** (works in Design mode and in Dev Mode).
4. Open **Settings** in the plugin, paste your GitHub token (the same one Tokens Studio uses), keep the repository `pawanaidxb/ds-poc`.

## Use
1. **Publish the library first** (the build reads published components).
2. Select a component, an instance, or the frame around a component set.
3. Click **Send to code**. Or **Send all published components**.
4. In about 5 minutes check the preview: https://pawanaidxb.github.io/ds-poc/preview/test/ and merge the pull request when it is right.

The AI build needs a working AI key (repo secret `ANTHROPIC_API_KEY`, or the company gateway).

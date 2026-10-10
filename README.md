# Website deployment

This static website is published by `.github/workflows/deploy-website.yml`.
Only the contents of `website/` are uploaded to GitHub Pages.

## One-time setup

In the GitHub repository, open Settings > Pages and select GitHub Actions
under Build and deployment > Source.

## Automatic publishing

Commit the website and workflow, then push or merge them into `dev`.
Subsequent pushes to `dev` that change the website or workflow publish the site.
Pushing a feature branch does not automatically deploy it.
You can also run Deploy ResearchLens Website manually from the Actions tab.

Expected URL, unless a custom domain is configured:
https://r26-se-023.github.io/AI_Powered_Research_Gap_Identifier_And_Trend-Analyzer/

Check the deployment status and published URL in the workflow run.
No build command or additional deployment secrets are needed.

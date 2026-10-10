# Website deployment

This static website is published by `.github/workflows/deploy-website.yml`.
The site files at the repository root are uploaded to GitHub Pages.

## One-time setup

In the GitHub repository, open Settings > Pages and select GitHub Actions
under Build and deployment > Source.

## Automatic publishing

Commit the website and workflow, then push or merge them into `main`.
Subsequent pushes to `main` that change the site or workflow publish it.
Pushing a feature branch does not automatically deploy it.
You can also run Deploy ResearchLens Website manually from the Actions tab.

Expected URL, unless a custom domain is configured:
https://r26-se-023.github.io/website/

Check the deployment status and published URL in the workflow run.
No build command or additional deployment secrets are needed.

# Gitverse Automation

Welcome to **Gitverse**, the automation hub for this project.

## How it Works
This project uses GitHub Actions to automatically deploy to Vercel on every push to the `main` branch.

### Deployment Secrets
To keep the deployment secure, the following secrets must be configured in your GitHub Repository settings:

- `VERCEL_TOKEN`: Your Vercel Personal Access Token.
- `VERCEL_ORG_ID`: `team_gVxn1JjNz2RECwgDMD1mAz6Z`
- `VERCEL_PROJECT_ID`: `prj_LRWNZeGd6qUmVgyJ7K6S7tk769PB`

### Utility Scripts
- `deploy-status.sh`: Run this to check the status of your latest deployments.
- `sync-projects.js`: A powerful script to find GitHub repositories not yet on Vercel.

## Project Sync (GitHub to Vercel)
The `sync-projects.js` tool helps you keep your GitHub and Vercel accounts in sync by identifying repos that aren't deployed.

### Setup
1. Create a **GitHub Personal Access Token (PAT)** with `repo` permissions.
2. Set your environment variables:
   ```bash
   export GITHUB_TOKEN=your_github_token
   export VERCEL_TOKEN=your_vercel_token
   ```
3. Run the sync:
   ```bash
   node gitverse/sync-projects.js
   ```

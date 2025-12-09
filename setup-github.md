# GitHub Repository Setup Instructions

## Step 1: Create a New Repository on GitHub

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Repository name: `event-management-system` (or your preferred name)
5. Description: "Event Management System built with PHP and MySQL"
6. Choose **Public** or **Private** (your choice)
7. **DO NOT** initialize with README, .gitignore, or license (we already have these)
8. Click "Create repository"

## Step 2: Connect Local Repository to GitHub

After creating the repository on GitHub, run these commands in your terminal:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/event-management-system.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 3: Verify Auto-Deployment

1. Go to your repository on GitHub
2. Click on the "Actions" tab
3. You should see the workflow running automatically
4. The workflow will validate your PHP code on every push

## Future Updates

After making changes to your code:

```bash
# Add all changes
git add .

# Commit changes
git commit -m "Your commit message describing the changes"

# Push to GitHub (auto-deployment will trigger)
git push origin main
```

## GitHub Actions Workflow

The auto-deployment workflow (`.github/workflows/deploy.yml`) will:
- ✅ Validate PHP syntax on every push
- ✅ Check file structure
- ✅ Create deployment summaries
- ✅ Upload artifacts

## Notes

- All files (including assets) are included in the repository as requested
- The workflow runs automatically on push to `main` branch
- You can also manually trigger the workflow from the GitHub Actions tab


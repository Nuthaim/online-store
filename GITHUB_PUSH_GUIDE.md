# 📤 GitHub Push Guide

## ⚠️ IMPORTANT: Security Check

Before pushing, make sure your `.gitignore` file excludes sensitive files:
- ✅ `backend/config.env` (contains secrets like MongoDB URI, JWT secret, Google OAuth credentials)
- ✅ `node_modules/`
- ✅ `.env` files

**Your `.gitignore` already includes these!** ✅

## 📋 Step-by-Step Instructions

### Step 1: Check Git Status
```bash
git status
```
This shows which files are tracked/untracked.

### Step 2: Initialize Git (if not already done)
```bash
git init
```
Skip this if you already have a `.git` folder.

### Step 3: Add All Files
```bash
git add .
```
This stages all files (respecting `.gitignore`).

### Step 4: Create Initial Commit
```bash
git commit -m "Initial commit: Online store project with Google OAuth"
```

### Step 5: Add Remote Repository
```bash
git remote add origin git@github.com:Nuthaim/online-store.git
```

**Note:** If you get an error that remote already exists, use:
```bash
git remote set-url origin git@github.com:Nuthaim/online-store.git
```

### Step 6: Rename Branch to Main
```bash
git branch -M main
```

### Step 7: Push to GitHub
```bash
git push -u origin main
```

## 🔐 Alternative: Using HTTPS Instead of SSH

If SSH doesn't work, use HTTPS:

```bash
git remote add origin https://github.com/Nuthaim/online-store.git
git branch -M main
git push -u origin main
```

## ✅ Verification

After pushing, verify on GitHub:
1. Go to: https://github.com/Nuthaim/online-store
2. Check that files are uploaded
3. **VERIFY** that `backend/config.env` is **NOT** visible (it should be ignored)

## 🚨 Security Reminder

**NEVER commit these files:**
- ❌ `backend/config.env` (contains secrets)
- ❌ `node_modules/` (too large, use package.json)
- ❌ `.env` files
- ❌ Any file with API keys, passwords, or secrets

## 📝 Future Updates

For future changes:
```bash
git add .
git commit -m "Your commit message"
git push
```

## 🔧 Troubleshooting

### If you get "remote origin already exists":
```bash
git remote remove origin
git remote add origin git@github.com:Nuthaim/online-store.git
```

### If you get authentication errors:
- For SSH: Make sure your SSH key is added to GitHub
- For HTTPS: You'll need a Personal Access Token instead of password

### If you want to check what will be committed:
```bash
git status
```

### To see what's in .gitignore:
```bash
cat .gitignore
```








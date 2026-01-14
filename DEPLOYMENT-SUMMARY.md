# 🚀 GitHub Actions Deployment - Quick Start

## ✅ What's Been Created

### 1. **GitHub Actions Workflow** (`.github/workflows/deploy.yml`)
- ✅ Automated deployment on push to `main` branch
- ✅ Runs tests before deploying
- ✅ Connects to EC2 via SSH
- ✅ Pulls latest code
- ✅ Installs dependencies
- ✅ Restarts PM2 process
- ✅ Runs health check
- ✅ **FIXED:** Environment variable issue resolved

### 2. **Staging Workflow** (`.github/workflows/deploy-staging.yml`)
- ✅ Deploys to staging server on push to `develop` branch
- ✅ Separate from production deployment

### 3. **Documentation**
- ✅ `GITHUB-ACTIONS-SETUP.md` - Complete setup guide
- ✅ `GITHUB-SECRETS-CHECKLIST.md` - Secrets configuration
- ✅ `DEPLOYMENT-SUMMARY.md` - This file

### 4. **Verification Script**
- ✅ `scripts/verify-deployment-setup.sh` - Test your setup locally

---

## 🎯 Quick Setup (5 Steps)

### Step 1: Add GitHub Secrets

Go to: **GitHub Repository → Settings → Secrets and variables → Actions**

Add these 5 secrets:

| Secret Name | Value | Example |
|-------------|-------|---------|
| `EC2_SSH_KEY` | Your PEM key content | `-----BEGIN RSA PRIVATE KEY-----...` |
| `EC2_HOST` | EC2 IP or domain | `13.126.6.186` |
| `EC2_USER` | SSH username | `ubuntu` |
| `APP_DIR` | App directory path | `/home/ubuntu/online-store` |
| `API_URL` | API base URL | `https://api.gagessentials.online` |

---

### Step 2: Verify EC2 Setup

SSH into your EC2:
```bash
ssh -i your-key.pem ubuntu@13.126.6.186
```

Check these:
```bash
# 1. Verify app directory
cd /home/ubuntu/online-store
pwd

# 2. Check Git remote
git remote -v

# 3. If no remote, add it:
git remote add origin https://github.com/yourusername/online-store.git

# 4. Check PM2
pm2 list

# 5. If no PM2 process, start it:
cd backend
pm2 start server.js --name "gagessentials-api"
pm2 save
```

---

### Step 3: Test Locally (Optional)

Run the verification script:
```bash
cd /path/to/online-store
chmod +x scripts/verify-deployment-setup.sh
./scripts/verify-deployment-setup.sh
```

---

### Step 4: Test Deployment

**Option A: Manual Trigger**
1. Go to GitHub → **Actions** tab
2. Click **Deploy Backend to EC2**
3. Click **Run workflow** → **Run workflow**
4. Watch the deployment

**Option B: Push to Main**
```bash
# Make a small change
echo "# Test deployment" >> backend/README.md

# Commit and push
git add backend/README.md
git commit -m "test: trigger GitHub Actions deployment"
git push origin main
```

---

### Step 5: Monitor Deployment

1. Go to GitHub → **Actions** tab
2. Click on the running workflow
3. Watch each step execute
4. ✅ Success = Your API is deployed!

---

## 📊 Workflow Stages

```
1. Test & Lint (30-60 seconds)
   ├─ Checkout code
   ├─ Setup Node.js
   ├─ Install dependencies
   ├─ Check syntax
   └─ Verify files

2. Deploy to EC2 (60-120 seconds)
   ├─ Configure SSH
   ├─ Connect to EC2
   ├─ Pull latest code
   ├─ Install dependencies
   ├─ Restart PM2
   └─ Health check

3. Notify Status
   └─ Show success/failure message
```

---

## 🔧 What Happens on Each Push

1. **You push code** to `main` branch
2. **GitHub Actions** detects the push
3. **Tests run** to verify code quality
4. **If tests pass**, deployment starts
5. **SSH connects** to your EC2 server
6. **Git pulls** latest code
7. **Dependencies** are installed
8. **PM2 restarts** your backend
9. **Health check** verifies API is running
10. **✅ Done!** Your changes are live

---

## 🐛 Common Issues & Fixes

### Issue 1: "ssh-keyscan: command not found"
**Status:** ✅ **FIXED** in latest workflow

### Issue 2: "Permission denied (publickey)"
**Fix:** Check `EC2_SSH_KEY` secret
- Must include `-----BEGIN RSA PRIVATE KEY-----`
- Must include `-----END RSA PRIVATE KEY-----`
- No extra spaces or newlines

### Issue 3: "Host key verification failed"
**Fix:** Verify `EC2_HOST` is correct
```bash
# Test from your local machine
ssh -i your-key.pem ubuntu@13.126.6.186
```

### Issue 4: "cd: no such file or directory"
**Fix:** Verify `APP_DIR` path
```bash
# SSH into EC2 and check
ssh -i your-key.pem ubuntu@13.126.6.186
ls -la /home/ubuntu/online-store
```

### Issue 5: "git pull failed"
**Fix:** Configure Git on EC2
```bash
# SSH into EC2
cd /home/ubuntu/online-store
git remote add origin https://github.com/yourusername/online-store.git
```

### Issue 6: "PM2 process not found"
**Fix:** Start PM2 manually first
```bash
# SSH into EC2
cd /home/ubuntu/online-store/backend
pm2 start server.js --name "gagessentials-api"
pm2 save
```

---

## 📝 Files Modified

- ✅ `.github/workflows/deploy.yml` - Main deployment workflow
- ✅ `.github/workflows/deploy-staging.yml` - Staging deployment
- ✅ `GITHUB-ACTIONS-SETUP.md` - Setup guide
- ✅ `GITHUB-SECRETS-CHECKLIST.md` - Secrets reference
- ✅ `scripts/verify-deployment-setup.sh` - Verification script
- ✅ `DEPLOYMENT-SUMMARY.md` - This file

---

## 🎉 Benefits

✅ **Automated Deployment** - No manual SSH needed
✅ **Consistent Process** - Same steps every time
✅ **Fast Deployment** - 2-3 minutes from push to live
✅ **Rollback Ready** - Git history for easy rollback
✅ **Health Checks** - Automatic verification
✅ **Zero Downtime** - PM2 reload keeps API running

---

## 🚀 Next Steps

1. [ ] Add all 5 GitHub secrets
2. [ ] Test manual workflow trigger
3. [ ] Make a test commit
4. [ ] Verify deployment succeeds
5. [ ] Celebrate! 🎉

---

**Need help?** Check the detailed guides:
- `GITHUB-ACTIONS-SETUP.md` - Full setup instructions
- `GITHUB-SECRETS-CHECKLIST.md` - Secrets configuration
- Run `./scripts/verify-deployment-setup.sh` - Test your setup

**Ready to deploy?** Push to `main` and watch the magic happen! ✨



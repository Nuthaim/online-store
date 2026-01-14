# 🚀 GitHub Actions CI/CD Setup Guide

## 📋 Overview

This guide will help you set up automated deployment from GitHub to your EC2 server using GitHub Actions.

---

## 🔑 Step 1: Set Up GitHub Secrets

You need to add the following secrets to your GitHub repository:

### **How to Add Secrets:**

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret below

---

### **Required Secrets:**

#### 1. `EC2_SSH_KEY`
**Description:** Your EC2 private key (PEM file content)

**How to get it:**
```bash
# On your local machine, display your PEM key
cat ~/path/to/your-key.pem
```

**Copy the entire output** (including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`)

**Value:**
```
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
(your full private key content)
...
-----END RSA PRIVATE KEY-----
```

---

#### 2. `EC2_HOST`
**Description:** Your EC2 public IP or domain

**Value:**
```
13.126.6.186
```

Or if using domain:
```
api.gagessentials.online
```

---

#### 3. `EC2_USER`
**Description:** SSH username for EC2

**Value:**
```
ubuntu
```

(Use `ec2-user` for Amazon Linux AMI)

---

#### 4. `APP_DIR`
**Description:** Full path to your application directory on EC2

**Value:**
```
/home/ubuntu/online-store
```

---

#### 5. `API_URL`
**Description:** Your API base URL for health checks

**Value:**
```
https://api.gagessentials.online
```

---

## 🔧 Step 2: Configure EC2 Server

### **2.1 Ensure Git is Configured**

SSH into your EC2:
```bash
ssh -i your-key.pem ubuntu@13.126.6.186
```

Configure Git:
```bash
cd /home/ubuntu/online-store

# Set up Git (if not already done)
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"

# Add remote if not exists
git remote -v

# If no remote, add it:
git remote add origin https://github.com/yourusername/online-store.git

# Or use SSH (recommended):
git remote add origin git@github.com:yourusername/online-store.git
```

---

### **2.2 Set Up SSH Key for GitHub (Recommended)**

This allows EC2 to pull from private repositories without password:

```bash
# Generate SSH key on EC2
ssh-keygen -t ed25519 -C "your-email@example.com"

# Press Enter for all prompts (use default location)

# Display public key
cat ~/.ssh/id_ed25519.pub
```

**Copy the output** and add it to GitHub:
1. Go to GitHub → **Settings** → **SSH and GPG keys**
2. Click **New SSH key**
3. Paste the public key
4. Save

**Test connection:**
```bash
ssh -T git@github.com
```

---

### **2.3 Ensure PM2 is Running**

```bash
# Check PM2 status
pm2 list

# If not running, start it:
cd /home/ubuntu/online-store/backend
pm2 start server.js --name "gagessentials-api"
pm2 save

# Set up auto-start on reboot
pm2 startup
# Copy and run the command it outputs
pm2 save
```

---

## 🧪 Step 3: Test the Workflow

### **3.1 Manual Trigger (Test First)**

1. Go to GitHub → **Actions** tab
2. Click on **Deploy Backend to EC2** workflow
3. Click **Run workflow** → **Run workflow**
4. Watch the deployment process

---

### **3.2 Automatic Trigger**

Make a change to your backend code:

```bash
# On your local machine
cd /path/to/online-store

# Make a small change
echo "// Test deployment" >> backend/server.js

# Commit and push
git add backend/server.js
git commit -m "test: trigger deployment"
git push origin main
```

**Watch the deployment:**
- Go to GitHub → **Actions** tab
- You'll see the workflow running

---

## 📊 Workflow Stages

### **Stage 1: Test & Lint** ✅
- Checks out code
- Installs dependencies
- Verifies syntax
- Runs basic checks

### **Stage 2: Deploy** 🚀
- Connects to EC2 via SSH
- Pulls latest code
- Installs dependencies
- Restarts PM2 process

### **Stage 3: Health Check** 🏥
- Waits 5 seconds
- Checks if API is responding
- Fails if API is down

### **Stage 4: Notify** 📢
- Shows deployment status
- Displays success/failure message

---

## 🔍 Troubleshooting

### **Issue: SSH Connection Failed**

**Error:** `Permission denied (publickey)`

**Solution:**
1. Check `EC2_SSH_KEY` secret is correct
2. Ensure key has correct format (including BEGIN/END lines)
3. Verify `EC2_USER` is correct (`ubuntu` or `ec2-user`)

---

### **Issue: Git Pull Failed**

**Error:** `fatal: could not read Username`

**Solution:**
```bash
# On EC2, set up SSH key for GitHub (see Step 2.2)
# OR use HTTPS with personal access token:
git remote set-url origin https://YOUR_TOKEN@github.com/username/repo.git
```

---

### **Issue: PM2 Process Not Found**

**Error:** `Process gagessentials-api not found`

**Solution:**
```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@13.126.6.186

# Start PM2 manually
cd /home/ubuntu/online-store/backend
pm2 start server.js --name "gagessentials-api"
pm2 save
```

---

### **Issue: Health Check Failed**

**Error:** `Health check failed! Got response code: 000`

**Solution:**
1. Check if backend is running: `pm2 list`
2. Check logs: `pm2 logs gagessentials-api`
3. Verify API_URL secret is correct
4. Test manually: `curl https://api.gagessentials.online/api/health`

---

## 🎯 Best Practices

### **1. Use Branches**

```yaml
# Deploy only from main/master
on:
  push:
    branches:
      - main
```

### **2. Add Environment-Specific Workflows**

- `deploy-staging.yml` - Deploy to staging server
- `deploy-production.yml` - Deploy to production server

### **3. Add Rollback Capability**

Keep previous versions:
```bash
# On EC2
cd /home/ubuntu
cp -r online-store online-store-backup-$(date +%Y%m%d)
```

---

## 📝 Next Steps

1. ✅ Add all GitHub secrets
2. ✅ Configure EC2 Git access
3. ✅ Test manual workflow trigger
4. ✅ Make a test commit to trigger auto-deployment
5. ✅ Monitor deployment in Actions tab
6. ✅ Verify API is working after deployment

---

## 🚀 You're All Set!

Your CI/CD pipeline is now configured. Every push to `main` branch will automatically deploy to your EC2 server! 🎉



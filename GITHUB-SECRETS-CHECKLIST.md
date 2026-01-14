# 🔑 GitHub Secrets Checklist

## Quick Setup Guide

### Step 1: Go to GitHub Repository Settings

1. Open your repository on GitHub
2. Click **Settings** (top right)
3. In left sidebar: **Secrets and variables** → **Actions**
4. Click **New repository secret**

---

## Required Secrets

### ✅ 1. EC2_SSH_KEY

**What it is:** Your EC2 private key file content

**How to get it:**
```bash
# On your local machine
cat ~/path/to/your-ec2-key.pem
```

**Example value:**
```
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAyourprivatekeycontenthere...
...multiple lines...
...
-----END RSA PRIVATE KEY-----
```

**⚠️ Important:**
- Copy the ENTIRE content including BEGIN and END lines
- Don't add any extra spaces or newlines
- Keep this secret safe!

---

### ✅ 2. EC2_HOST

**What it is:** Your EC2 server IP address or domain

**Value for your setup:**
```
13.126.6.186
```

**Or use domain:**
```
api.gagessentials.online
```

---

### ✅ 3. EC2_USER

**What it is:** SSH username for your EC2 instance

**Value for Ubuntu:**
```
ubuntu
```

**Value for Amazon Linux:**
```
ec2-user
```

---

### ✅ 4. APP_DIR

**What it is:** Full path to your application on EC2

**Value for your setup:**
```
/home/ubuntu/online-store
```

**How to verify:**
```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@13.126.6.186

# Check the path
pwd
# Should show: /home/ubuntu

ls -la online-store
# Should show your project files
```

---

### ✅ 5. API_URL

**What it is:** Your API base URL (for health checks)

**Value for your setup:**
```
https://api.gagessentials.online
```

**⚠️ Important:**
- Use `https://` (not `http://`)
- No trailing slash
- Must be accessible from GitHub Actions runners

---

## Verification Checklist

After adding all secrets, verify:

- [ ] All 5 secrets are added
- [ ] Secret names match exactly (case-sensitive)
- [ ] EC2_SSH_KEY includes BEGIN/END lines
- [ ] EC2_HOST is correct IP or domain
- [ ] EC2_USER is correct (ubuntu or ec2-user)
- [ ] APP_DIR path exists on EC2
- [ ] API_URL is accessible via HTTPS

---

## Test Your Secrets

### Option 1: Manual Workflow Trigger

1. Go to **Actions** tab
2. Click **Deploy Backend to EC2**
3. Click **Run workflow** → **Run workflow**
4. Watch for errors

### Option 2: Make a Test Commit

```bash
# On your local machine
cd /path/to/online-store

# Make a small change
echo "# Test deployment" >> backend/README.md

# Commit and push
git add backend/README.md
git commit -m "test: trigger GitHub Actions"
git push origin main
```

---

## Common Errors & Solutions

### Error: "Permission denied (publickey)"

**Cause:** EC2_SSH_KEY is incorrect

**Fix:**
1. Re-copy your PEM key content
2. Make sure you copied the entire file
3. Update the EC2_SSH_KEY secret

---

### Error: "ssh-keyscan: command not found"

**Cause:** This shouldn't happen on GitHub Actions runners

**Fix:** The workflow has been updated to fix this

---

### Error: "Host key verification failed"

**Cause:** EC2_HOST is incorrect or unreachable

**Fix:**
1. Verify EC2_HOST value
2. Make sure EC2 instance is running
3. Check security group allows SSH (port 22)

---

### Error: "cd: no such file or directory"

**Cause:** APP_DIR path is incorrect

**Fix:**
1. SSH into EC2: `ssh -i key.pem ubuntu@13.126.6.186`
2. Check actual path: `pwd` and `ls -la`
3. Update APP_DIR secret with correct path

---

### Error: "git pull failed"

**Cause:** Git not configured on EC2

**Fix:**
```bash
# SSH into EC2
ssh -i key.pem ubuntu@13.126.6.186

# Navigate to project
cd /home/ubuntu/online-store

# Configure git
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Set up remote
git remote -v
git remote add origin https://github.com/yourusername/online-store.git
```

---

## Security Best Practices

✅ **DO:**
- Keep secrets in GitHub Secrets (never in code)
- Use separate keys for different environments
- Rotate keys periodically
- Use minimal permissions

❌ **DON'T:**
- Commit secrets to repository
- Share secrets in chat/email
- Use same key for multiple servers
- Log secret values

---

## Next Steps

1. ✅ Add all 5 secrets to GitHub
2. ✅ Verify secrets are correct
3. ✅ Test with manual workflow trigger
4. ✅ Make a test commit to trigger auto-deploy
5. ✅ Monitor deployment in Actions tab
6. ✅ Verify API is working after deployment

---

## Quick Copy-Paste Template

Use this template when adding secrets:

```
Secret Name: EC2_SSH_KEY
Value: [Paste your entire PEM key content]

Secret Name: EC2_HOST
Value: 13.126.6.186

Secret Name: EC2_USER
Value: ubuntu

Secret Name: APP_DIR
Value: /home/ubuntu/online-store

Secret Name: API_URL
Value: https://api.gagessentials.online
```

---

**All set? Test your deployment!** 🚀



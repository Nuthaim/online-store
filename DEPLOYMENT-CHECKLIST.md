# ✅ GitHub Actions Deployment Checklist

Print this and check off each item as you complete it!

---

## 📋 Pre-Deployment Setup

### GitHub Secrets Configuration

- [ ] Go to GitHub Repository → Settings → Secrets and variables → Actions
- [ ] Add secret: `EC2_SSH_KEY`
  - [ ] Copy entire PEM key content (including BEGIN/END lines)
  - [ ] Paste into secret value
  - [ ] Save
- [ ] Add secret: `EC2_HOST`
  - [ ] Value: `13.126.6.186` (or your EC2 IP)
  - [ ] Save
- [ ] Add secret: `EC2_USER`
  - [ ] Value: `ubuntu` (or `ec2-user`)
  - [ ] Save
- [ ] Add secret: `APP_DIR`
  - [ ] Value: `/home/ubuntu/online-store`
  - [ ] Save
- [ ] Add secret: `API_URL`
  - [ ] Value: `https://api.gagessentials.online`
  - [ ] Save

---

## 🖥️ EC2 Server Setup

### SSH into EC2
```bash
ssh -i your-key.pem ubuntu@13.126.6.186
```

### Verify Directory Structure
- [ ] Check app directory exists: `ls -la /home/ubuntu/online-store`
- [ ] Navigate to backend: `cd /home/ubuntu/online-store/backend`
- [ ] Verify server.js exists: `ls -la server.js`

### Configure Git
- [ ] Check Git remote: `git remote -v`
- [ ] If no remote, add it:
  ```bash
  git remote add origin https://github.com/yourusername/online-store.git
  ```
- [ ] Test Git pull: `git pull origin main`

### Verify Node.js & PM2
- [ ] Check Node.js: `node --version` (should be v18+)
- [ ] Check PM2: `pm2 --version`
- [ ] Check PM2 processes: `pm2 list`
- [ ] If no process, start it:
  ```bash
  cd /home/ubuntu/online-store/backend
  pm2 start server.js --name "gagessentials-api"
  pm2 save
  ```
- [ ] Set up PM2 auto-start: `pm2 startup` (run the command it outputs)

### Test Backend Locally
- [ ] Test API: `curl http://localhost:5000/api/health`
- [ ] Should return: `{"status":"ok"}` or similar

---

## 🧪 Test Deployment

### Option 1: Manual Trigger
- [ ] Go to GitHub → Actions tab
- [ ] Click "Deploy Backend to EC2" workflow
- [ ] Click "Run workflow" button
- [ ] Select "main" branch
- [ ] Click "Run workflow"
- [ ] Watch the workflow execute
- [ ] Verify all steps complete successfully

### Option 2: Push to Main
- [ ] Make a small change to backend code
- [ ] Commit: `git commit -m "test: trigger deployment"`
- [ ] Push: `git push origin main`
- [ ] Go to GitHub → Actions tab
- [ ] Watch the workflow execute

---

## 🔍 Verify Deployment

### Check GitHub Actions
- [ ] All jobs show green checkmarks ✅
- [ ] "Test & Lint" job passed
- [ ] "Deploy to EC2" job passed
- [ ] "Health Check" step passed
- [ ] "Notify Status" shows success

### Check EC2 Server
```bash
ssh -i your-key.pem ubuntu@13.126.6.186
```

- [ ] Check PM2 status: `pm2 list`
- [ ] Process "gagessentials-api" is "online"
- [ ] Check PM2 logs: `pm2 logs gagessentials-api --lines 20`
- [ ] No errors in logs

### Check API Endpoint
- [ ] Test from local machine:
  ```bash
  curl https://api.gagessentials.online/api/health
  ```
- [ ] Should return HTTP 200
- [ ] Response should be valid JSON

### Check Frontend (if applicable)
- [ ] Open frontend in browser
- [ ] Test API calls work
- [ ] No CORS errors in console
- [ ] Data loads correctly

---

## 🐛 Troubleshooting (If Deployment Fails)

### If "Test & Lint" fails:
- [ ] Check syntax errors in code
- [ ] Run `npm ci` locally to verify dependencies
- [ ] Fix errors and push again

### If "Configure SSH" fails:
- [ ] Verify `EC2_SSH_KEY` secret is correct
- [ ] Check `EC2_HOST` is correct
- [ ] Ensure EC2 security group allows SSH (port 22)

### If "Deploy to EC2" fails:
- [ ] Check `APP_DIR` path is correct
- [ ] Verify Git remote is configured on EC2
- [ ] Check PM2 is installed: `pm2 --version`

### If "Health Check" fails:
- [ ] SSH into EC2 and check PM2: `pm2 list`
- [ ] Check PM2 logs: `pm2 logs gagessentials-api`
- [ ] Verify Nginx is running: `sudo systemctl status nginx`
- [ ] Test API locally on EC2: `curl http://localhost:5000/api/health`

---

## 📊 Post-Deployment Verification

### Functional Tests
- [ ] API health endpoint works
- [ ] User authentication works
- [ ] Product listing works
- [ ] Cart functionality works
- [ ] Order creation works
- [ ] Admin panel accessible

### Performance Tests
- [ ] API response time < 500ms
- [ ] No memory leaks (check PM2 memory usage)
- [ ] CPU usage normal (check with `pm2 monit`)

### Monitoring
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom, etc.)
- [ ] Configure error alerts
- [ ] Set up log monitoring

---

## 🎉 Success Criteria

All of these should be ✅:

- [ ] GitHub Actions workflow completes successfully
- [ ] PM2 shows process as "online"
- [ ] API health check returns 200 OK
- [ ] Frontend can communicate with backend
- [ ] No errors in PM2 logs
- [ ] No errors in Nginx logs
- [ ] All functional tests pass

---

## 📝 Notes & Issues

Use this space to track any issues or notes:

```
Date: ___________
Issue: ___________________________________________
Solution: ________________________________________

Date: ___________
Issue: ___________________________________________
Solution: ________________________________________

Date: ___________
Issue: ___________________________________________
Solution: ________________________________________
```

---

## 🚀 Next Deployment

For future deployments, you only need to:

1. [ ] Make code changes
2. [ ] Commit: `git commit -m "your message"`
3. [ ] Push: `git push origin main`
4. [ ] Watch GitHub Actions deploy automatically
5. [ ] Verify deployment succeeded

**That's it!** 🎉

---

**Deployment Date:** ___________  
**Deployed By:** ___________  
**Status:** ⬜ Success  ⬜ Failed  ⬜ Partial  



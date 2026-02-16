# GitHub Repository Setup Guide

## 📋 Step-by-Step Instructions

### Step 1: Create GitHub Account (If You Don't Have One)

1. Go to **https://github.com**
2. Click "Sign Up"
3. Enter your email, password, and username
4. Verify your email
5. **Free account is perfect for this project!**

---

### Step 2: Create New Repository

1. **Login to GitHub**
2. Click the **"+"** icon in top right → **"New repository"**

3. **Fill in repository details:**
   - **Repository name**: `elsayad-center-ecommerce`
   - **Description**: `E-commerce mobile app for office & school supplies, educational books, and toys`
   - **Visibility**: 
     - ✅ **Public** (if you want to showcase it in your portfolio)
     - OR **Private** (if you want to keep it private while learning)
   - ✅ **Check "Add a README file"**
   - ✅ **Add .gitignore** → Select **"Node"** from dropdown
   - ⬜ **License**: None (or MIT if you want open source)

4. Click **"Create repository"**

---

### Step 3: Clone Repository to Your Computer

1. **Copy the repository URL:**
   - On your new GitHub repository page
   - Click the green **"Code"** button
   - Copy the HTTPS URL (looks like: `https://github.com/YOUR_USERNAME/elsayad-center-ecommerce.git`)

2. **Open PowerShell/Terminal** on your computer

3. **Navigate to where you want the project:**
   ```powershell
   cd C:\Users\Sayaad\
   # Or wherever you want to store your project
   ```

4. **Clone the repository:**
   ```powershell
   git clone https://github.com/YOUR_USERNAME/elsayad-center-ecommerce.git
   cd elsayad-center-ecommerce
   ```

---

### Step 4: Configure Git (First Time Only)

If this is your first time using Git, configure your identity:

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

### Step 5: Verify Setup

Check that you're connected to GitHub:

```powershell
git remote -v
```

You should see:
```
origin  https://github.com/YOUR_USERNAME/elsayad-center-ecommerce.git (fetch)
origin  https://github.com/YOUR_USERNAME/elsayad-center-ecommerce.git (push)
```

---

## 🔑 Optional: Setup SSH Keys (More Secure)

Instead of entering password every time, setup SSH:

### Windows Setup:

1. **Generate SSH key:**
   ```powershell
   ssh-keygen -t ed25519 -C "your.email@example.com"
   ```
   Press Enter 3 times (default location, no passphrase)

2. **Copy public key:**
   ```powershell
   cat ~/.ssh/id_ed25519.pub
   ```
   Copy the entire output

3. **Add to GitHub:**
   - Go to GitHub → Settings → SSH and GPG keys
   - Click "New SSH key"
   - Paste your key
   - Click "Add SSH key"

4. **Change remote URL to SSH:**
   ```powershell
   git remote set-url origin git@github.com:YOUR_USERNAME/elsayad-center-ecommerce.git
   ```

---

## 📝 Common Git Commands You'll Use

### Daily Workflow:

```powershell
# Check what files changed
git status

# Add files to staging
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main
```

### Good Commit Messages:
- ✅ `git commit -m "Add home screen UI"`
- ✅ `git commit -m "Setup backend authentication"`
- ✅ `git commit -m "Fix cart total calculation bug"`
- ❌ `git commit -m "changes"`
- ❌ `git commit -m "stuff"`

---

## ✅ What's Next

After GitHub is setup, I'll help you create:
1. **Project folder structure**
2. **Docker configuration files**
3. **React Native project**
4. **Node.js backend project**
5. **Initial commit and push**

Ready to continue with project structure setup? 🚀

# GitHub OAuth Setup Guide

This guide will help you set up real GitHub OAuth authentication for your Code Playground application.

## Prerequisites

1. A GitHub account
2. A Firebase account (free tier available)

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "code-playground")
4. Follow the setup wizard (you can disable Google Analytics if you don't need it)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Click on "GitHub" provider
5. Enable it by clicking the toggle switch
6. You'll need to configure GitHub OAuth App first (see Step 3)
7. Come back here after creating the GitHub OAuth App

## Step 3: Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "OAuth Apps" in the left sidebar
3. Click "New OAuth App"
4. Fill in the details:
   - **Application name**: `Code Playground` (or any name you prefer)
   - **Homepage URL**: `http://localhost:8000` (for local development)
   - **Application description**: `Code Playground with GitHub Integration`
   - **Authorization callback URL**: `https://your-project-id.firebaseapp.com/__/auth/handler`
     (Replace `your-project-id` with your actual Firebase project ID)
5. Click "Register application"
6. Copy the **Client ID** and **Client Secret** (you'll need these for Firebase)

## Step 4: Configure Firebase GitHub Provider

1. Go back to Firebase Authentication > Sign-in method > GitHub
2. Enter the **Client ID** and **Client Secret** from your GitHub OAuth App
3. Click "Save"

## Step 5: Update Firebase Configuration

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click the web app icon (</>) to add a web app if you haven't already
4. Register your app with a nickname (e.g., "Code Playground Web")
5. Copy the Firebase configuration object
6. Replace the placeholder configuration in `app.js`:

```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

## Step 6: Test the Integration

1. Start your local server: `python -m http.server 8000`
2. Open `http://localhost:8000` in your browser
3. Click the GitHub button (🐙) in the activity bar
4. Click "Login GitHub"
5. You should be redirected to the GitHub OAuth page (like the one in your image)
6. After authorizing, you should see your actual GitHub repositories

## Troubleshooting

### Common Issues:

1. **"Firebase not initialized" error**
   - Make sure you've replaced the placeholder Firebase config with your real config
   - Check that Firebase SDK scripts are loaded in `index.html`

2. **"Popup blocked" error**
   - Allow popups for your localhost domain
   - Try using a different browser

3. **"Invalid OAuth redirect URI" error**
   - Make sure the callback URL in GitHub OAuth App matches exactly
   - For local development, you might need to use a different approach

4. **"GitHub API error"**
   - Check that your GitHub OAuth App has the correct scopes
   - Verify that the access token is being received properly

### For Production:

1. Update the GitHub OAuth App homepage URL to your production domain
2. Update the callback URL to your production Firebase auth handler
3. Consider using environment variables for sensitive configuration

## Security Notes

- Never commit your Firebase config or GitHub secrets to version control
- Use environment variables in production
- Regularly rotate your GitHub OAuth App secrets
- Monitor your Firebase usage to stay within free tier limits

## Next Steps

Once this is working, you can:
- Customize the GitHub scopes to request specific permissions
- Add error handling for different authentication scenarios
- Implement user profile display
- Add repository creation functionality
- Implement branch management features

---

**Note**: This setup enables real GitHub OAuth authentication that will redirect users to the actual GitHub login page (as shown in your image) instead of showing demo alerts.


# Google Indexing API Setup Guide

This guide will help you configure and run the automated indexing script to prompt Google's search crawlers to index all the pages of your site (or specific ones) within 24 hours.

## How it Works
The Google Indexing API allows site owners to notify Google when pages are added, updated, or removed. Google's crawlers prioritize crawling these pages immediately. 

To prevent unauthorized crawl requests, Google requires authentication using a **Google Cloud Service Account** that has **Owner** permissions for your website.

---

## 1. Setup on Google Cloud Console

1. **Open Google Cloud Console:**
   Go to [https://console.cloud.google.com/](https://console.cloud.google.com/) and sign in with your Google Account.

2. **Create a Project:**
   - Click on the project dropdown at the top left.
   - Click **New Project**.
   - Name it (e.g., `UK-Visa-Info-Indexing`) and click **Create**.

3. **Enable the APIs (Crucial):**
   - In the top search bar, search for **Web Search Indexing API** and click **Enable**.
   - In the top search bar, search for **Google Site Verification API** and click **Enable**.

4. **Create a Service Account:**
   - Navigate to **IAM & Admin** > **Service Accounts** in the left sidebar menu.
   - Click **+ Create Service Account** at the top.
   - Give it a name (e.g., `indexing-bot`) and click **Create and Continue**.
   - You can skip role assignments; click **Continue** and then **Done**.

5. **Generate a JSON Private Key:**
   - In the Service Accounts list, click on the email address of the account you just created.
   - Select the **Keys** tab at the top.
   - Click **Add Key** > **Create new key**.
   - Select **JSON** as the key type and click **Create**.
   - A `.json` file will automatically download to your computer.

6. **Place the JSON Key in Your Project:**
   - Rename the downloaded file to exactly `service-account-key.json`.
   - Place this file in the root directory of your website project (`uk-visa-hub/`).
   - *Note: `service-account-key.json` is already added to `.gitignore` to ensure it is never committed to GitHub for security.*

---

## 2. Link Service Account to Google Search Console (Two Methods)

Because Google Search Console has a known bug that frequently returns "Failed to add user: email not found", we have two methods to verify your Service Account.

### Method A: Standard delegation (If Google has fixed the bug)
1. Copy the Service Account email address (e.g., `indexing-bot@YOUR-PROJECT.iam.gserviceaccount.com`).
2. Open [Google Search Console](https://search.google.com/search-console).
3. Navigate to **Settings** > **Users and permissions** > **Add User**.
4. Paste the email address, change the permission to **Owner**, and click **Add**.

*If Method A fails with "email not found", use Method B below.*

### Method B: Programmatic Verification Workaround (Recommended Fix)
We have created a script that lets the service account verify itself directly using an HTML file.

1. **Enable the Site Verification API** on your Google Cloud project (done in Step 1.3).
2. **Generate the Verification File:**
   In your terminal, run the following command:
   ```bash
   node scripts/verify-site.mjs --generate
   ```
   This will query Google's APIs, fetch your site's custom verification token, and automatically save it in the `public/` directory of your project (e.g. `public/googleXXXXXX.html`).

3. **Deploy the File:**
   Commit the generated HTML file and push it to GitHub to trigger a Vercel deployment:
   ```bash
   git add public/google*.html
   git commit -m "chore: add verification file for service account"
   git push origin main
   ```

4. **Verify Ownership:**
   Once the Vercel deployment completes (confirm you can visit `https://ukvisainfo.co.uk/googleXXXXXX.html` in your browser), run the verification command to complete the setup:
   ```bash
   node scripts/verify-site.mjs --verify
   ```

---

## 3. Run the Indexing Script

Once verified, you can trigger indexing for your pages:

### Run a Dry Run (Simulation)
```bash
node scripts/google-index.mjs --dry-run
```

### Request Indexing for All Sitemap Pages
Submits up to 200 URLs (standard Google API daily quota) from the live sitemap:
```bash
node scripts/google-index.mjs
```

### Request Indexing for a Single Specific URL
```bash
node scripts/google-index.mjs --url https://ukvisainfo.co.uk/take-home-pay
```

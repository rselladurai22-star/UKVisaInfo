# Google Indexing API Setup Guide

This guide will help you configure and run the automated indexing script to prompt Google's search crawlers to index all the pages of your site (or specific ones) within 24 hours.

## How it Works
The Google Indexing API allows site owners to notify Google when pages are added, updated, or removed. Google's crawlers prioritize crawling these pages immediately. 

To prevent unauthorized crawl requests, Google requires authentication using a **Google Cloud Service Account** that has **Owner** permissions for your website in **Google Search Console**.

---

## 1. Setup on Google Cloud Console

1. **Open Google Cloud Console:**
   Go to [https://console.cloud.google.com/](https://console.cloud.google.com/) and sign in with your Google Account.

2. **Create a Project:**
   - Click on the project dropdown at the top left.
   - Click **New Project**.
   - Name it (e.g., `UK-Visa-Info-Indexing`) and click **Create**.

3. **Enable the Indexing API:**
   - Go to [Web Search Indexing API Page](https://console.cloud.google.com/apis/library/indexing.googleapis.com) or search for **Web Search Indexing API** in the top search bar.
   - Select it and click **Enable**.

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

## 2. Link Service Account to Google Search Console

Google needs to verify that this service account is authorized to trigger crawls for your website.

1. **Copy the Service Account Email:**
   - Look inside your downloaded `service-account-key.json` for the `"client_email"` field (it will look like: `indexing-bot@YOUR-PROJECT.iam.gserviceaccount.com`).
   - Copy this email address.

2. **Open Google Search Console:**
   - Go to [https://search.google.com/search-console](https://search.google.com/search-console).
   - Select your website property (e.g., `https://ukvisainfo.co.uk`).

3. **Add the Service Account as an Owner:**
   - Click **Settings** in the left sidebar.
   - Click **Users and permissions**.
   - Click **Add User** (blue button in top right).
   - Paste the Service Account email address.
   - **Crucial:** Change the permission dropdown from *Full* to **Owner**.
   - Click **Add**.

---

## 3. Run the Indexing Script

Once the credentials file is placed at the root of the project and linked in Search Console, you can trigger indexing from your local machine.

### Run a Dry Run (Simulation)
Ensure the script fetches your sitemap correctly and parses your credentials without sending actual API requests to Google:
```bash
node scripts/google-index.mjs --dry-run
```

### Request Indexing for All Sitemap Pages (Standard)
Submits up to 200 URLs (standard Google API daily quota) from the live sitemap:
```bash
node scripts/google-index.mjs
```

### Request Indexing for a Single Specific URL
If you want to index one specific page immediately:
```bash
node scripts/google-index.mjs --url https://ukvisainfo.co.uk/take-home-pay
```

### Request Indexing from a Different Sitemap
```bash
node scripts/google-index.mjs --sitemap https://example.com/sitemap.xml
```

### Submit a Removal Request (URL Deleted)
If you deleted pages and want Google to remove them from search results:
```bash
node scripts/google-index.mjs --action delete
```

---

## Troubleshooting

- **Error: Permission denied (403)**
  - Double check that the Service Account email address was added as an **Owner** (not just Full/Restricted) in Google Search Console.
  - Verify that the domain URL in the sitemap matches the Search Console property exactly (including `https://` vs `http://` and `www.` prefixes).
- **Error: Quota exceeded (429)**
  - Google's default daily limit is 200 URLs. The script handles this limit automatically, but if you have already run the script today, you will need to wait 24 hours for the quota to reset.

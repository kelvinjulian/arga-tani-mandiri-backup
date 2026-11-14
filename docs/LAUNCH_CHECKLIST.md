# Technical Launch Checklist (`docs/LAUNCH_CHECKLIST.md`)

1. **Environment Variables & Indexing Switch:**
   - Set `SITE_URL` (public production origin without trailing slash) and `SITE_INDEXING=on` in the production environment.
   - Verify `/robots.txt` allows crawling and points to `${SITE_URL}/sitemap.xml`.
   - Verify `/sitemap.xml` returns the expected canonical URLs.

2. **Preview Banner & Placeholder Verification:**
   - Confirm no preview/draft banners or `[ISI: ...]` placeholders remain on any indexable route.
   - Confirm the client has approved all claims on indexable pages (the approval log is kept outside this repository).

3. **Article Publication Workflow:**
   - Publish individual articles in `src/data/articles.ts` by changing `status: "draft"` to `status: "published"` only after client review of the article content.
   - Optionally populate `datePublished` and `dateModified` (ISO 8601 format) on published articles so `sitemap.xml` and `Article` JSON-LD include publication timestamps.

4. **Google Search Console Setup:**
   - Register and verify the production domain property in Google Search Console.
   - Submit `${SITE_URL}/sitemap.xml` and inspect the Page Indexing report.

5. **Google Business Profile:**
   - Create or claim the official Google Business Profile using the client's verified corporate address, phone number, and operating hours.

6. **Core Web Vitals & Performance Re-Verification:**
   - Re-verify LCP, CLS, and INP targets on the live production URL after deployment.

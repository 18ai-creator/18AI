# 18AI — Premium Glass HD Website + Intelligence & Engagement (V7)

## Open locally

Open `index.html` in your browser. All original V6/Final Glass sections are retained, including industries, product filters, AI Anatomy, research, Academy, program PDFs, Labs, Enterprise, Wellness and Media.

## Added in V7

- AI Updates and worldwide research links with topic filtering.
- Optional live AI news feed endpoint backed by a Cloudflare Worker (`news-worker.js`).
- Client-side live date/time for India and UTC (no API required).
- Quick Connect floating menu: WhatsApp, email, call and Share a Thought.
- Community message form: email-app fallback; optional Formspree endpoint to submit online.
- Optional Cloudflare Web Analytics instrumentation for real visitor counts.
- Premium glass section styling, responsive mobile layout, accessible announcements.

## Real visitor analytics: setup REQUIRED

An offline/static website cannot know how many people have visited the public website. Do not display a fabricated visitor counter.

1. Publish the site (Cloudflare Pages or GitHub Pages).
2. In Cloudflare Dashboard > Web Analytics, add the website and get its **Site Token**.
3. Set `cloudflareAnalyticsToken` in `config.js` (or add the Cloudflare-provided beacon snippet yourself).
4. View **page views, unique visitors, referrers and geography** in the Cloudflare dashboard. The analytics dashboard is private to your account by design. No visitor figures are claimed on the public site.
5. Disclose analytics in your privacy policy and comply with relevant consent requirements.

## Receive visitor ideas/messages automatically

Default: the form opens the visitor's email application (visitor must click Send).

To capture submissions without requiring an installed mail app:

1. Create a form at https://formspree.io (or provide your own API route).
2. Configure the destination to receive submissions at `hi@18ai.in`.
3. Copy the HTTPS form endpoint into `messageFormEndpoint` in `config.js`.
4. Test a genuine submission. Add CAPTCHA/spam controls and privacy disclosures before launch.

The existing #contact form remains a mailto fallback. Visitors can always WhatsApp or call.

## AI Updates: optional automation

Without a feed endpoint, the section shows trustworthy source links **not asserted as live stories**.

For an automated feed, deploy `news-worker.js` as a Cloudflare Worker, set `ALLOWED_ORIGIN` to your actual site origin, then configure `newsFeedEndpoint: 'https://YOUR-WORKER.workers.dev/updates'` in `config.js`. The Worker fetches public Google News RSS search feeds, attributes sources, caches results, and never embeds article content. Check terms of service before production usage. Live feed reliability depends on external publishers/network access.

## Social links

Replace the YouTube, Instagram and LinkedIn discovery URLs in `config.js` with your verified profile URLs. They are placeholders until then.

## Existing business contact

- Email: hi@18ai.in
- Phone: +91 89830 89318
- WhatsApp: https://wa.me/918983089318

## Files

- `index.html`: site content
- `styles.css`, `premium.css`, `final-glass.css`: existing visual design
- `engagement.css`: new V7 visual styles
- `app.js`: existing interactivity
- `engagement.js`: clock, updates, message, quick connect, optional analytics
- `config.js`: integration points
- `news-worker.js`: optional news API endpoint
- `assets/`: HD artworks and SVG logo
- `program-kits/`: original PDF brochures

## Important

This is a production-oriented **static front-end**. Live analytics, automatic contact capture and news aggregation require the optional configuration explained above. Never publicly display user-submitted messages without moderation and consent. The news cards link to external third-party sources, which are not endorsements.

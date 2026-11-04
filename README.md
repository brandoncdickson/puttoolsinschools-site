# Put Tools In Schools: website

A multi-page static site (plain HTML, CSS, and JavaScript). There is no build step, so GitHub Pages can serve it directly from the repo root.

Content is based on the organization's own donate page, its news posts, and the public WCCB Charlotte segment. Give and sponsor buttons link to the live pages on puttoolsinschools.org.

## Pages

- `index.html`: home (purpose, recent field news, giving, Career Day call to action)
- `about.html`: purpose and where we show up
- `programs.html`: Career Days and Tool Box Work Days
- `get-involved.html`: give, sponsor, and volunteer
- `news.html`: links to recent posts
- `contact.html`: message form, phone, and mailing address
- `404.html`: not-found page

Shared styles are in `styles.css`. Behaviour (menu, reveals, counters, form checks) is in `main.js`. Decorative effects (hero sparks, cursor ring, magnetic buttons, letter reveals, trade switcher) are in `effects.js`, which does nothing when a visitor has reduced motion turned on. Colours and fonts are CSS variables at the top of `styles.css`.

## Updating styles or scripts

Every page loads `styles.css?v=5`, `main.js?v=5`, and `effects.js?v=5`. When you change any of those files, raise the number in every page (for example to `?v=6`). Otherwise browsers can mix new HTML with a cached old stylesheet and the layout breaks.

## Before launch

- **Contact form**: not connected yet. Paste a form endpoint (for example a Formspree URL) into the `data-endpoint` attribute on the form in `contact.html`. Until then the form tells visitors to call Ray Terry.
- **Contact details**: the phone number and mailing address come from the donate page. Confirm they are current, and add an email address if you want one shown.
- **Donation amounts**: the $5, $10, $25, $50, and $100 buttons mirror the donate page. Update them if the donate page changes.
- **Recent field news**: titles and short descriptions are paraphrased from the posts. Check them against the posts before launch.

## GitHub Pages

1. Push these files to the root of a public repo on `main`.
2. In the repo, go to **Settings > Pages**. Set Source to "Deploy from a branch", Branch to `main`, and folder to `/ (root)`.
3. The site will be at `https://<your-username>.github.io/<repo-name>/`. Open `index.html` if the bare address is cached from an earlier redirect.

### Custom domain

- To use a custom domain, add a file named `CNAME` in the root with that one domain on its own line, such as `vigilantintegratedsecurity.xyz`. Also set the same domain under **Settings > Pages > Custom domain**.
- At your DNS provider, point the domain to GitHub Pages. For an apex domain, add GitHub's four A records. For `www`, add a CNAME to `<your-username>.github.io`. GitHub's Pages documentation lists the current IP addresses.
- Enforce HTTPS once the certificate is ready.

## Test locally

From this folder, run `python3 -m http.server 8080` and open `http://localhost:8080`.

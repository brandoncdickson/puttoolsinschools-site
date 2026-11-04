# Put Tools In Schools: website

A multi-page static site (plain HTML, CSS, and JavaScript). There is no build step, so GitHub Pages can serve it directly.

## Pages

- `index.html`: home (hero, stats, programs, how it works, CTA)
- `about.html`: story and principles
- `programs.html`: tool drives, teacher training, student labs, catalog, FAQ
- `get-involved.html`: volunteer, donate, and partner sections
- `contact.html`: request form (schools, volunteers, donors, partners)
- `resources.html`: guides and FAQ (items marked "Coming soon")
- `404.html`: not-found page

Shared styles live in `styles.css`. Behaviour (menu, reveals, counters, forms) lives in `main.js`. Colours and fonts are CSS variables at the top of `styles.css`.

## Before you launch: replace placeholders

- **Stats** (`index.html`, the `data-count` numbers): currently placeholder figures. Replace them with real numbers, or remove the stat cards.
- **Donation amounts** (`get-involved.html`): $50, $250, and $1,000 are examples. Update them to match real costs.
- **Mission line and copy**: the wording was drafted without your materials. Check every claim before it goes live.
- **Email**: `hello@puttoolsinschools.org` appears in several places. Confirm the address exists, or change it everywhere (search the folder for `hello@`).
- **Donations**: online giving is not connected. The donate buttons open an email. Add a payment or donation link when you have one.
- **Resources**: the entries are placeholders marked "Coming soon". Link them when the files exist.

## Put it on GitHub Pages

1. Create a repository (for example `puttoolsinschools-site`) and push these files to its root on `main`.
2. In the repo: **Settings > Pages > Build and deployment**. Set Source to "Deploy from a branch", Branch to `main`, and folder to `/ (root)`.
3. Wait for the first deploy. The site will be at `https://<your-username>.github.io/<repo-name>/`.

### Custom domain

- For a test domain (for example `vigilantintegratedsecurity.xyz`) or the real one (`puttoolsinschools.org`), add a file named `CNAME` in the root containing that one domain, such as `puttoolsinschools.org`.
- Also set the same domain under **Settings > Pages > Custom domain** and tick "Enforce HTTPS" once the certificate is ready.
- At your DNS provider, point the domain to GitHub Pages. For an apex domain, use GitHub's A records. For `www`, use a CNAME to `<your-username>.github.io`. GitHub's Pages documentation lists the current IP addresses.

## Connect the contact form

The form works in the browser but does not send anywhere until you connect it. The easiest free option is Formspree.

1. Create a form at formspree.io and copy its endpoint URL.
2. In `contact.html`, set `data-endpoint=""` on the `<form>` element to that URL.
3. Submissions will then be delivered to your inbox.

Until then the form shows a message pointing visitors to email. It does not pretend to send.

## Test locally

From this folder, run `python3 -m http.server 8080` and open `http://localhost:8080`.

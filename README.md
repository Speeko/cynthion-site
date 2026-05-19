# cynthion-site

Landing page for **Cynthion** — a party-based sci-fi CRPG on a dying lunar colony.

Single static page. One job: capture an email address.

Lives at: `https://speeko.github.io/cynthion-site/` (or custom domain once configured).

---

## Pre-launch checklist

Two things need to happen before this page actually collects emails.

### 1. Form-to-email (Web3Forms)

The signup form posts to `https://api.web3forms.com/submit` with the hidden `access_key` identifying our form. Web3Forms forwards the submission as an email to the account it's tied to (Brett's Gmail, linked via Google OAuth on signup).

Manage forms / view access keys at <https://app.web3forms.com>. Email subject is `New Cynthion signup`. Free tier: 250 submissions/month — plenty for indie pre-launch.

**Migrating off:** if you outgrow form-to-email (you want broadcasts, segmentation, double opt-in, etc.), swap the form action back to a list service (Mailchimp / MailerLite / Buttondown). The rest of the page is independent.

**Why not Formsubmit:** their backend was down (HTTP 522 / Cloudflare origin timeout) during setup, so we pivoted to Web3Forms which proved more reliable.

### 2. Mailing list auto-capture

Each Web3Forms signup notification emails into `bdarling87@gmail.com`. A Gmail filter automatically applies the **`Cynthion Subscribers`** label to those notifications. On demand, run:

```bash
./scripts/sync-signups.sh
```

The script reads any unsynced labelled emails, parses out the subscriber address, appends a row to the **Cynthion Subscribers** Google Sheet (`Timestamp | Email | Source`), then applies a `Cynthion Subscribers/Synced` sub-label so the same email isn't processed twice.

Sheet: <https://docs.google.com/spreadsheets/d/13DVCThkLC1rrPW2K0Z3-uvzPZhQ0PUdiwipsigDHGaI/edit>

To run automatically every 15 minutes:

```cron
*/15 * * * *  cd /home/brett/Documents/GitHub/cynthion-site && ./scripts/sync-signups.sh >> /tmp/cynthion-sync.log 2>&1
```

### 2. (Optional) Custom domain

Until a domain is bought, the site lives at `speeko.github.io/cynthion-site`. When a domain is ready:

1. Buy domain.
2. Create a `CNAME` file in the repo root containing only the domain (e.g. `cynthion.game`). One line, no protocol, no trailing slash.
3. At the domain registrar, add either:
   - **Apex** (`cynthion.game`): four `A` records pointing to GitHub Pages IPs (`185.199.108.153`, `.109.153`, `.110.153`, `.111.153`), or
   - **Subdomain** (`www.cynthion.game`): a `CNAME` record to `speeko.github.io`.
4. In repo Settings → Pages → set custom domain, wait for the cert, enable "Enforce HTTPS".

---

## Files

| File | Job |
|---|---|
| `index.html` | Markup. Wordmark, copy, image gallery, timeline, signup form, footer. |
| `style.css` | Brand palette tokens + layout. |
| `404.html` | Brand-matching 404 page. |
| `privacy.html` | Mailing-list privacy notice. Linked from footer. |
| `favicon.svg` | Crescent moon glyph on vacuum-black. |
| `robots.txt` | Allow-all + sitemap pointer. |
| `sitemap.xml` | Single-page sitemap. |
| `CNAME` | Custom domain pointer (`cynthiongame.com`). |
| `scripts/sync-signups.sh` | Sync labelled Gmail signup emails into the Google Sheet. Run on demand or via cron. |
| `images/` | Gallery WebPs. |
| `README.md` | This file. |

No build step. No JS framework. Edits are instant — push to `main`, Pages redeploys.

---

## Local preview

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

---

## Brand notes

Copy and palette are drawn from `cynthion-game/Assets/Documentation/Research/BrandPrototype_v2.md`.

Short description is the verbatim live Steamworks copy — do not re-write here without re-writing there. The two pages must stay in sync.

No tagline on this page (D-9 in the brand prototype is unresolved). When picked, drop it above or below the short description as a single line.

No hero image / capsule art on this page (D-11 unresolved). When picked, becomes a background or a hero panel above the wordmark.

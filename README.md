# cynthion-site

Landing page for **Cynthion** — a party-based sci-fi CRPG on a dying lunar colony.

Single static page. One job: capture an email address.

Lives at: `https://speeko.github.io/cynthion-site/` (or custom domain once configured).

---

## Pre-launch checklist

Two things need to happen before this page actually collects emails.

### 1. Buttondown signup

The form posts to `https://buttondown.com/api/emails/embed-subscribe/{{BUTTONDOWN_USERNAME}}` — that placeholder needs to be replaced with a real Buttondown username.

1. Go to https://buttondown.com and sign up. Free tier covers 100 subs.
2. Claim the username `cynthion` (or whatever's available).
3. In `index.html`, search for `{{BUTTONDOWN_USERNAME}}` and replace with the chosen username.
4. Commit + push.

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
| `index.html` | Markup. Wordmark, short description, email form, footer. |
| `style.css` | Brand palette tokens + layout. |
| `CNAME` | Custom domain pointer. Added in step 2 above. |
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

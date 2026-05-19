# cynthion-site

Landing page for **Cynthion** — a party-based sci-fi CRPG on a dying lunar colony.

Single static page. One job: capture an email address.

Lives at: `https://speeko.github.io/cynthion-site/` (or custom domain once configured).

---

## Pre-launch checklist

Two things need to happen before this page actually collects emails.

### 1. Form-to-email (Formsubmit)

The signup form posts to `https://formsubmit.co/info@cynthiongame.com`. Formsubmit receives the POST and emails the submission to that address, which Porkbun's free forwarding then relays to `bdarling87@gmail.com`.

No account at Formsubmit required. **First-time activation:** the very first submission triggers a verification email from Formsubmit asking to confirm `info@cynthiongame.com` is yours. Click the link in that email once, and from then on real signups land in your Gmail.

Email subject is `New Cynthion signup`. CAPTCHA disabled by default. If spam becomes a problem, set `_captcha` to `true` in the hidden input (in `index.html`).

**Migrating off:** if you outgrow form-to-email (you want broadcasts, segmentation, double opt-in, etc.), swap the form action back to a list service (Mailchimp / MailerLite / Buttondown). The rest of the page is independent.

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

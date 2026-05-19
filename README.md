# cynthion-site

Landing page for **Cynthion** — a party-based sci-fi CRPG on a dying lunar colony.

Single static page. One job: capture an email address.

Lives at: `https://speeko.github.io/cynthion-site/` (or custom domain once configured).

---

## Pre-launch checklist

Two things need to happen before this page actually collects emails.

### 1. MailerLite signup

The form posts to `{{MAILERLITE_FORM_ACTION}}` — that placeholder needs to be replaced with a real MailerLite form action URL.

1. Go to https://mailerlite.com and sign up. Free tier covers 1,000 subscribers + 12,000 emails/month.
2. Create a new **Embedded form**. Pick any style — we don't use their CSS, only the action URL.
3. After creating the form, click "Embed". MailerLite gives you HTML — find the `<form action="...">` URL inside it. It will look like one of:
   - `https://app.mailerlite.com/webforms/submit/abcd1234`
   - `https://assets.mailerlite.com/jsonp/{ACCOUNT_ID}/forms/{FORM_ID}/subscribe`
   - Or similar
4. In `index.html`, search for `{{MAILERLITE_FORM_ACTION}}` and replace with that URL (the value of `action="..."`).
5. Commit + push.

**Field names already match MailerLite's expectations** (`fields[email]` + `ml-submit=1`), so the form will POST correctly as soon as the action URL is filled in.

**Note:** Buttondown was the original plan but they rejected the account during manual review. Kit was considered next, but their free tier is buried behind a 14-day trial flow. MailerLite has the most generous indie-friendly free tier (1k subs vs Mailchimp's 500) and the same one-form-POST pattern, no JS required.

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

# cynthion-site

Landing page for **Cynthion** — a party-based sci-fi CRPG on a dying lunar colony.

Single static page. One job: capture an email address.

Lives at: `https://speeko.github.io/cynthion-site/` (or custom domain once configured).

---

## Pre-launch checklist

Two things need to happen before this page actually collects emails.

### 1. MailerLite (wired up)

The form posts to MailerLite — account `2360035`, form `187859158354102019` (the "Cynthion Landing Page" embedded form). Subscribers are added to the **Cynthion Subscribers** group.

To manage the list, send broadcasts, or change the form name:
- Log in at https://dashboard.mailerlite.com
- Forms → Embedded forms → Cynthion Landing Page

**Trial vs free tier:** the account was auto-enrolled in a 14-day trial (advanced features unlocked). When the trial expires it reverts to MailerLite's forever-free plan (1,000 subscribers + 12,000 emails/month). The embed form keeps working through the transition — only the dashboard features change.

**Double opt-in is on by default.** New subscribers get a confirmation email; they're not added to the group until they click confirm. Toggle off in the form's overview page if you want single opt-in.

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

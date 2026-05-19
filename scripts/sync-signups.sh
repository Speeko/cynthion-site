#!/usr/bin/env bash
# Sync Cynthion mailing-list signups from Gmail → Google Sheets.
#
# - Pulls Gmail threads labelled "Cynthion Subscribers" that aren't yet labelled "Synced".
# - Parses each one for the subscriber's email address.
# - Appends a row to the Cynthion Subscribers spreadsheet (Timestamp, Email, Source).
# - Applies the "Synced" label so the same thread won't be processed twice.
#
# Requires: gog (https://github.com/.../gogcli) signed in as bdarling87@gmail.com.
#
# Run on demand:
#     ./scripts/sync-signups.sh
#
# Or schedule it: add a cron entry like:
#     */15 * * * *  cd /path/to/cynthion-site && ./scripts/sync-signups.sh >> /tmp/cynthion-sync.log 2>&1

set -euo pipefail

# Cron's PATH doesn't include user-local bins by default. gog lives in
# ~/.local/bin so we prepend it (and a couple common locations) explicitly
# so this script behaves identically whether invoked from cron or a shell.
export PATH="$HOME/.local/bin:/usr/local/bin:/usr/bin:/bin:$PATH"

ACCOUNT="bdarling87@gmail.com"
SHEET_ID="13DVCThkLC1rrPW2K0Z3-uvzPZhQ0PUdiwipsigDHGaI"
SOURCE_LABEL="Cynthion Subscribers"
SYNCED_LABEL="Cynthion Subscribers/Synced"

log() { printf '[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*"; }

# Sanity check: is gog actually on PATH? If not, fail loudly so the cron log
# captures the real error instead of silently swallowing it.
if ! command -v gog >/dev/null 2>&1; then
  log "ERROR: 'gog' CLI not found on PATH. PATH=$PATH"
  exit 1
fi

# Ensure "Synced" sub-label exists (gog will error harmlessly if it already does)
gog gmail labels create "$SYNCED_LABEL" --account "$ACCOUNT" --no-input >/dev/null 2>&1 || true

# Find threads that have the source label but NOT the synced label.
# Gmail's search syntax uses "label:foo-bar" with hyphens for slashes in label names,
# but the actual label name keeps the slash. Both syntaxes work; using the slashed form
# inside quotes is the reliable one.
QUERY="label:\"$SOURCE_LABEL\" -label:\"$SYNCED_LABEL\""

THREAD_IDS=$(gog gmail search "$QUERY" --account "$ACCOUNT" -p 2>&1 | awk 'NR>1 {print $1}')

if [[ -z "$THREAD_IDS" ]]; then
  log "No unsynced signups."
  exit 0
fi

COUNT=0
while IFS= read -r THREAD_ID; do
  [[ -z "$THREAD_ID" ]] && continue

  # Get the message body (gog returns the full thread; we look at the first/only message)
  BODY=$(gog gmail get "$THREAD_ID" --account "$ACCOUNT" 2>/dev/null)

  # Extract the subscriber's email. The form's JS injects "Subscriber: <email>"
  # into the message field, which Web3Forms renders in the body. We grep for
  # that exact pattern, which avoids picking up emails from the From / To
  # headers or the web3forms.com footer.
  EMAIL=$(printf '%s' "$BODY" \
    | { grep -oE 'Subscriber:[[:space:]]+[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}' || true; } \
    | { grep -oE '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}' || true; } \
    | head -1)

  if [[ -z "$EMAIL" ]]; then
    log "Could not parse subscriber email from thread $THREAD_ID — skipping."
    continue
  fi

  TIMESTAMP=$(date -u '+%Y-%m-%dT%H:%M:%SZ')

  # Append to sheet
  gog sheets append "$SHEET_ID" "A:C" \
    "$TIMESTAMP" "$EMAIL" "cynthiongame.com" \
    --account "$ACCOUNT" >/dev/null

  # Mark thread as synced
  gog gmail thread modify "$THREAD_ID" --add "$SYNCED_LABEL" --account "$ACCOUNT" >/dev/null

  log "Synced $EMAIL (thread $THREAD_ID)"
  COUNT=$((COUNT + 1))
done <<<"$THREAD_IDS"

log "Done. Appended $COUNT new subscriber(s) to the sheet."

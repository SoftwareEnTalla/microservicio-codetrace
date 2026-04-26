#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
# Test E2E — codetrace-service
# ═══════════════════════════════════════════════════════════════
set -uo pipefail

BASE_URL="${BASE_URL:-http://localhost:3002/api}"
# ── Auth bootstrap: login real contra security-service ─────────
SECURITY_BASE_URL="${SECURITY_BASE_URL:-http://localhost:3015/api}"
SA_EMAIL="${SA_EMAIL:-softwarentalla@gmail.com}"
SA_PWD="${SA_PWD:-admin123}"
__login_resp=$(curl -s -w "\n%{http_code}" -X POST "$SECURITY_BASE_URL/logins/command" \
  -H "Content-Type: application/json" \
  -d "{\"identifier\":\"$SA_EMAIL\",\"password\":\"$SA_PWD\"}" 2>/dev/null)
__login_code=$(echo "$__login_resp" | tail -n1)
if [[ "$__login_code" != "200" && "$__login_code" != "201" ]]; then
  echo "✘ Auth bootstrap falló: HTTP $__login_code contra $SECURITY_BASE_URL/logins/command"
  echo "  Body: $(echo "$__login_resp" | sed '$d' | head -c 300)"
  exit 1
fi
__login_body=$(echo "$__login_resp" | sed '$d')
__token=$(echo "$__login_body" | (jq -r '.accessToken // .data.accessToken // .token // empty' 2>/dev/null || \
  echo "$__login_body" | grep -oE '"accessToken"[[:space:]]*:[[:space:]]*"[^"]+"' | head -1 | sed -E 's/.*"accessToken"[[:space:]]*:[[:space:]]*"([^"]+)".*/\1/'))
[[ -z "$__token" ]] && { echo "✘ Auth bootstrap: respuesta sin accessToken"; exit 1; }
AUTH="Bearer $__token"
echo "  ✔ Auth bootstrap: token JWT obtenido para $SA_EMAIL"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'; BLUE='\033[0;34m'
PASS=0; FAIL=0; TOTAL=0; WARN=0
log_step() { echo -e "\n${BLUE}═══ PASO $1: $2 ═══${NC}"; }
log_ok()   { echo -e "  ${GREEN}✔ $1${NC}"; PASS=$((PASS+1)); TOTAL=$((TOTAL+1)); }
log_fail() { echo -e "  ${RED}✘ $1${NC}"; FAIL=$((FAIL+1)); TOTAL=$((TOTAL+1)); }
do_post()   { curl -s -w "\n%{http_code}" -X POST   "$1" -H "Content-Type: application/json" -H "Authorization: $AUTH" -d "$2" 2>/dev/null; }
do_get()    { curl -s -w "\n%{http_code}" -X GET    "$1" -H "Authorization: $AUTH" 2>/dev/null; }
do_delete() { curl -s -w "\n%{http_code}" -X DELETE "$1" -H "Authorization: $AUTH" 2>/dev/null; }
extract_body() { echo "$1" | sed '$d'; }
extract_code() { echo "$1" | tail -n1; }
json_get() { echo "$1" | jq -r "$2" 2>/dev/null || echo ""; }

UNIQUE="$(date +%s)"
NOW="$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")"

echo -e "${BLUE}╔═ TEST E2E — Codetrace Microservice ═╗${NC}"
echo -e "  Base URL: $BASE_URL | Unique: $UNIQUE"

log_step 0 "Pre-flight"
RESP=$(do_get "$BASE_URL/codetraces/query/count")
CODE=$(extract_code "$RESP")
if [[ "$CODE" =~ ^(200|201)$ ]]; then log_ok "Service UP ($CODE)"; else log_fail "Service NO responde ($CODE)"; exit 1; fi

log_step 1 "Crear codetrace"
PAYLOAD=$(cat <<JSON
{"name":"trace-$UNIQUE","correlationId":"corr-$UNIQUE","traceId":"trace-$UNIQUE","sourceService":"test","eventName":"TestEvent","level":"INFO","message":"e2e test","payload":{"foo":"bar"},"emittedAt":"$NOW","creationDate":"$NOW","modificationDate":"$NOW","isActive":true}
JSON
)
RESP=$(do_post "$BASE_URL/codetraces/command" "$PAYLOAD")
CODE=$(extract_code "$RESP"); BODY=$(extract_body "$RESP")
CT_ID=$(json_get "$BODY" '.data.id // .id // empty')
[[ "$CODE" =~ ^(200|201)$ && -n "$CT_ID" ]] && log_ok "Created id=$CT_ID" || log_fail "Create failed ($CODE)"

log_step 2 "Get by id"
RESP=$(do_get "$BASE_URL/codetraces/query/$CT_ID")
CODE=$(extract_code "$RESP")
[[ "$CODE" == "200" ]] && log_ok "Got trace" || log_fail "Get failed ($CODE)"

log_step 3 "List"
RESP=$(do_get "$BASE_URL/codetraces/query/list?page=1&size=10")
CODE=$(extract_code "$RESP")
[[ "$CODE" == "200" ]] && log_ok "List ok" || log_fail "List failed ($CODE)"

log_step 4 "Delete"
[[ -n "$CT_ID" ]] && { RESP=$(do_delete "$BASE_URL/codetraces/command/$CT_ID"); CODE=$(extract_code "$RESP"); [[ "$CODE" =~ ^(200|204)$ ]] && log_ok "Deleted" || log_fail "Delete failed ($CODE)"; }

echo -e "\n${BLUE}╔══ RESUMEN ══╗${NC}"
echo -e "  Total: $TOTAL  ${GREEN}✔ OK: $PASS${NC}  ${RED}✘ FAIL: $FAIL${NC}  ${YELLOW}⚠ WARN: $WARN${NC}"
[[ $FAIL -eq 0 ]] && exit 0 || exit 1

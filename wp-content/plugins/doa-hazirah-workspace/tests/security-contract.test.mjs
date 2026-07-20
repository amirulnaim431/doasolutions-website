import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const phpFiles = [
  "doa-hazirah-workspace.php",
  "includes/class-doa-hazirah-api.php",
  "includes/class-doa-hazirah-db.php",
  "bin/seed-user.php",
].map(read).join("\n");

assert.equal(phpFiles.includes("0411"), false, "Initial password must never be committed.");
assert.match(phpFiles, /wp_check_password/, "Password changes must verify the current password.");
assert.match(phpFiles, /wp_verify_nonce/, "Login must include CSRF verification.");
assert.match(phpFiles, /wp_create_nonce\(\s*'wp_rest'/, "REST writes must use WordPress nonces.");
assert.match(phpFiles, /permission_callback[\s\S]*can_access/, "REST routes must have authorization callbacks.");
assert.match(phpFiles, /set_transient[\s\S]*15 \* MINUTE_IN_SECONDS/, "Login attempts must be rate limited.");
assert.match(phpFiles, /due date cannot be earlier/i, "Invalid date ranges must be rejected server-side.");
assert.equal(/wp_ajax_nopriv/.test(phpFiles), false, "No unauthenticated data endpoint is permitted.");
assert.equal(/DELETE\s+FROM.+projects/i.test(phpFiles), false, "Normal controls must not permanently delete projects.");

console.log("Security contract checks passed.");


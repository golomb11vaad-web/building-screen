# Publish SmartScreen on Cloudflare

SmartScreen is configured as a Cloudflare Worker rather than a static GitHub Pages site because the public screen, admin editor, shared messages, and uploaded photos need the same persistent backend.

## One-time account setup

1. Create or sign in to a free Cloudflare account, then run:

   ```powershell
   npx wrangler login
   ```

2. Create the shared database and copy the `database_id` returned by Cloudflare:

   ```powershell
   npx wrangler d1 create smartscreen-data
   ```

3. Replace `REPLACE_WITH_D1_DATABASE_ID` in `wrangler.jsonc` with that ID.

4. Create the photo bucket and initialise the message table:

   ```powershell
   npx wrangler r2 bucket create smartscreen-uploads
   npx wrangler d1 migrations apply smartscreen-data --remote
   ```

5. Set the two private admin secrets interactively. Do not store them in `wrangler.jsonc` or commit them.

   ```powershell
   npx wrangler secret put ADMIN_PASSWORD
   npx wrangler secret put SESSION_SECRET
   ```

   Use a long random value for `SESSION_SECRET` (for example, `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`).

6. Publish:

   ```powershell
   npm run deploy
   ```

Cloudflare prints the public `*.workers.dev` address. Open that address on the lobby display and open `/admin` on any staff computer. Every admin with the shared password sees and edits the same D1-backed notices and R2-uploaded images.

## Change building details

`wrangler.jsonc` contains the non-secret building name, contact lines, and weather coordinates. Update those values, run `npm run cf-typegen`, and deploy again.

## Free-plan fit

The screen uses Workers static assets, D1 for a compact message document, and R2 only for staff-uploaded images. It is designed for a normal single-building setup and stays inside Cloudflare's free allowances at modest display and editing volume. Review Cloudflare's current plan limits before connecting a large fleet of displays.

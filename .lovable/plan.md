# Round of fixes: colours, roommate swipe, limits, first-sign-in form, listing prices

## What changes
1. **Green to blue everywhere** – buttons, selected menu item, highlights, logo and browser-tab icon switch to a professional blue. Property-card Appearance colours stay as they are.
2. **One close button on phones** – the mobile menu currently shows two crosses; keep a single one.
3. **Swipe only for roommates**
   - Roommates page shows only the swipe deck (no grid/list toggle).
   - PG and Rentals pages lose the swipe option and keep the normal card layout.
   - Home page swipe section shows roommates only (Homes/Roommates switch removed).
   - Small label in the top-left of each card: "Looking for roommate" or "Looking for property", based on the profile.
4. **Swipe limit** – 25 swipes per account (likes and passes both count). When used up, a friendly message appears. Admin panel gets a setting to change the number.
5. **Phone play button** – stop the play icon showing over the hero video on phones (force silent inline autoplay, hide native controls, show a still image until playing).
6. **Scroll to top on page change** – switching pages (including the in-page sections like PG, Rentals, Roommates) jumps back to the top.
7. **Welcome form on first sign-in** – after a user's first sign-in, a form they cannot skip asks for name, phone number, email and address, with validation. Once saved it never shows again for that account.
8. **Different price per listing type** – Rental, PG and Roommate listings each have their own fee. Admin panel gets fields to edit all three; the payment box shows and charges the right one.

## Admin panel
New "Settings" card: swipe limit per account, and listing fees for Rental / PG / Roommate.

## Technical notes
- Swap `--primary`/`--success`/`--accent` tokens to blue in `src/styles.css`; recolour `public/logo.svg` and `favicon.svg` (and the header logo image if it is a raster).
- `listings-section.tsx`: drop `layout` toggle; render `SwipeDeck` when type is Roommate, grid otherwise. `swipe-deck.tsx`: add top-left label (uses `hasProperty`), swipe-count check via a new `src/lib/app-settings.ts`.
- Scroll reset: `window.scrollTo(0,0)` (and Lenis `scrollTo(0,{immediate})`) on page/route change in `src/routes/index.tsx` and root.
- Settings (swipe limit, fees) and swipe counts / profile-complete flag: the uploaded server has no endpoints for these, so they are stored in the browser for now (same as Appearance); profile details are also sent to the server's user-update call if one exists, otherwise kept locally. Will switch to server storage once endpoints exist.
- `list-property-payment-modal.tsx` receives `amount` from the selected listing type.
- Add a small test for the 25-swipe limit and per-type fee lookup.

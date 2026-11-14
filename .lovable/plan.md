# Admin clean-up and new "Users" section

## What changes
1. **One place for listing prices** – remove the Rental / PG / Roommate fee boxes from the Appearance tab. The existing "Pricing Management" card (Listings prices) becomes the only place to set them, and the payment box charges whatever is saved there.
2. **Swipe limit moves** – "Swipes per account" moves out of Appearance into the same pricing/listing settings area, saved with the same Save button.
3. **New "Users" section** – a new tab in both the Admin panel and the Staff panel listing everyone who filled the welcome form: name, phone, email, address and date submitted, with a search box.

## Important limitation
The welcome form answers are currently kept in the visitor's own browser (the server has no place for them yet). So the Users list will show entries saved on this browser, plus anything the server returns if it offers a user list. To see every user from every device, the server needs a "save profile" and "list users" endpoint — I'll wire the page to use them as soon as they exist.

## Technical notes
- `app-settings-card.tsx`: delete fee inputs; move swipe-limit input into the Management pricing card in `src/routes/admin/index.tsx`.
- `feeFor()` in `src/lib/app-settings.ts` reads from the `pricing.listings` store (roommate/pg/rental) used by Pricing Management, falling back to defaults; update `app-settings.test.ts`.
- Welcome form: append each submission (with timestamp) to a `setmystay_user_profiles` list; still attempt `PUT /users/complete-profile/`.
- New shared `src/components/admin/user-profiles-table.tsx`: tries `GET /users/` from the server, merges with local list, dedupes by email; add a "Users" tab to admin and staff panels.

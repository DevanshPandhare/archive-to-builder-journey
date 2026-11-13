# Connect to the real server, keep test mode as a switch

The uploaded project uses the same server address and the same calls as the current site, so the look of the site stays exactly as it is. The one change is that the site now talks to your real server by default, and the temporary test mode can still be switched on.

## What changes
- By default, listings, sign-in (Google), phone-number setup, payments (Razorpay), admin, staff, coupons, ads and purchase history go to your real server (`https://setmystay-backend.onrender.com`), the same way the uploaded project does.
- Test mode (sample data, "Continue with test account", fake checkout, reset test data) is off by default. You turn it on with one setting, and you can also turn it on yourself in the browser by opening the site with `?demo=1` (`?demo=0` turns it off again).
- The look, layout, animations and Appearance colours stay the same.

## Technical details
- `src/lib/demo-backend.ts`: `DEMO_MODE` is true only when `VITE_DEMO_MODE=true`, or when localStorage `setmystay_demo=1` is set, which `?demo=1|0` controls. It defaults to false.
- `.env`: keep `VITE_API_URL` and add `VITE_DEMO_MODE=false`. Check whether the uploaded API base needs the `/api` suffix. If the server routes live under `/api`, set `VITE_API_URL=https://setmystay-backend.onrender.com/api` so it matches the endpoints in the upload's `api.ts`.
- `api.ts`, `auth-modal.tsx`, `razorpay-script.tsx` and the payment modals keep the upload's endpoints and payloads. They are already identical, apart from the demo adapter wiring, which stays behind the flag.
- Keep the richer roommate field mapping, which falls back to the upload's defaults when fields are missing.
- Verify: the home page loads listings from the real server, or shows its empty state if the server is asleep. `?demo=1` shows the sample data again. The build and tests pass.

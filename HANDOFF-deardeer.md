# Dear Deer - Handoff

## Context
Landing page for "Dear Deer," an improv comedy podcast. The site lives at `deardeer.html` in the repo root.

## Current State
- `deardeer.html` is fully styled (pink/mint theme, DM Sans + Space Mono, animated blobs, bouncy cards)
- 6 placeholder episodes with titles, descriptions, durations, and PayPal donate buttons ($2.99+ each)
- No actual audio wired up — all episodes show "Audio coming soon"
- Logo is a deer emoji placeholder (slots ready for img/video)
- Sticky bottom donate bar links to `paypal.me/DearDeerPodcast/2.99`

## Actual Episode Files
Located at:
```
/Users/pietsuess/Library/CloudStorage/GoogleDrive-psuess@gmail.com/My Drive/Projects/175/Dear Deer/Podcast/Episodes/SHOWS
```

14 files (~1.8 GB total):
- `AcornDan.wav` (761 MB) — needs mp3 conversion
- `TheDiane_And_Darryl_Show_251208.wav` (875 MB) — needs mp3 conversion
- `ApocalypseReasons.mp3` (49 MB)
- `ApocalypseReasons 2.mp3` (49 MB)
- `BoysNight-OdeToPoe.mp3` (20 MB)
- `BoysNight-TravelSized_Guillotine.mp3` (26 MB)
- `CharacterExcercise.mp3` (18 MB)
- `DrJekyl_MrsLuteal.mp3` (40 MB)
- `QuestionGame.mp3` (4.6 MB)
- `SororityReport-Full.mp3` (55 MB)
- `TheDocks.mp3` (14 MB)
- `WaitWhat_CockHouse.m4a` (6.6 MB)

Note: The 6 episodes on the site don't match these real file names — episode listing needs updating to reflect actual shows.

## Next Steps
1. **Convert .wav files to .mp3** — AcornDan.wav and TheDiane_And_Darryl_Show would shrink from ~1.6 GB to ~130 MB
2. **Set up Cloudflare R2** — decided as hosting solution for episode downloads
   - Create account at cloudflare.com (free tier)
   - Create bucket (e.g. `deardeer-episodes`)
   - Enable public access (r2.dev subdomain or custom domain)
   - Upload all episodes
3. **Update deardeer.html** — replace placeholder episodes with real show names/descriptions, wire up R2 download URLs
4. **Decide on download gating** — currently PayPal donate links are separate from downloads. Options:
   - Simple: public download links + honor-system donate buttons (current approach)
   - Gated: Cloudflare Worker to verify payment before serving file (more complex)

## Decision Made
- Cloudflare R2 chosen over Vercel (file size limits), GitHub Releases, Backblaze B2, Bunny CDN, AWS S3
- Key reason: zero egress fees, 10 GB free storage, well within budget at ~400 MB after wav conversion

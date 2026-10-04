# calmcrew.app

The one-page website for **Calm Crew** (calmcrew.app), Libby Pickett's iPhone app and course
for superyacht crew. Plain static HTML, CSS and a little vanilla JavaScript:
no build step, no framework, and no requests to any other domain (fonts are
self-hosted; there are no analytics, CDNs or embeds).

- Copy: `copy_final.json` (1 Oct 2026), the session lead's build overrides, and
  then the client's manual edits in Figma (1 Oct 2026). Those edits win: the
  Figma web frames are the source of truth for section order and wording.
- Design: Figma *Calm Crew — App Design V1* (`f0J6MJZNgvUgkXO1FzVUjd`), web
  frames at 1440px. Brand v2.0: Day and Night only.
- **3 Oct 2026 design update** (Figma page "09 · Prototype — design changes"):
  the phone screens are the new app screens (face and dot check-in buttons,
  the S.O.S. tab), titles are Newsreader ExtraBold in `--black`, secondary
  buttons are the app's white chip with a 1.5px slate outline,
  inline links take the app's slate underline, and `--selection-solid` is
  #6E97AA. Screen images carry a `-v3` suffix so the year-long asset cache
  cannot serve the old ones.
- The page makes **exactly one claim**, in the `#history` section. Do not add
  outcome or benefit language, statistics or "what gets better" anywhere else.
- **4 Oct 2026 copy rewrite** (client request: much more concise, relaxed
  and playful). The visible copy is about 40% shorter. Kept verbatim: the
  safety note, the footer disclaimer, the tagline, tab and course names, and
  the meaning of every privacy line. Some detail was cut: the eight-week
  length, neuroception and glimmers, Settings behind the three dots, and the
  crewmate page in S.O.S. The "Boat Industry Leaders" card no longer promises
  "the calm they deserve" or says leaders "track" their crew's mood. Some
  items in the checklist below quote the earlier wording.

## Files

```
index.html              the page
404.html                not-found page (root-absolute paths on purpose)
netlify.toml            headers (CSP, security, caching); keeps README.md and
                        netlify.toml from being served
robots.txt
favicon.ico             16/32/48px, for older browsers and link-preview crawlers
assets/css/tokens.css   design tokens: every colour, space and type size
assets/css/site.css     layout and components (no colours of its own)
assets/js/site.js       the Menu button only;
                        the page works without it
assets/fonts/           Newsreader (one variable file, 200–800: Light 300 text,
                        ExtraBold 800 titles), Work Sans
                        (variable 400–700) and Work Sans Italic, self-hosted woff2
assets/brand/           mark.svg, favicon.svg, og-image.png (1200×630),
                        apple-touch-icon.png (180×180)
assets/img/             app screens: WebP 786w/1179w + PNG 786w fallback
```

Section anchors, in page order: `#top` (Day), `#history` (Day, THE ONE
CLAIM), `#at-sea` (Night), `#app` (Night), `#drop-anchor` (Night, the S.O.S.
tab), `#course` (Day), `#privacy` (Day), `#pilot` (Night), `#about` (Day),
`#contact` (Night). Order and `#pilot` copy follow the hand edits on Figma
page 10 (3 Oct 2026); "for easier days at sea" was left out of the Boat
Industry Leaders card under the one-claim rule.
The nav shows six of them (The app · The course · At sea · Privacy · The pilot
· About Libby). Drop Anchor and History are deliberately not in the nav or the
footer.

How the page is put together:

- A Night band is `class="band-night"` on a section. tokens.css redefines the
  colour custom properties there, so the same CSS draws Day and Night. All
  small text on a Night band (eyebrows, leads, body, card text, captions,
  links) is white (`--black`, the app's Night maximum-contrast ink).
- Phone mock-ups are drawn in CSS (10px bezel, 64/54px radii, token shadow at
  the 413px design size). They scale with their container, so pairs and
  mobile phones keep the same proportions.
- **No form (3 Oct 2026).** calmcrew.app is published with Figma Sites, which
  has no forms, so `#contact` is an "Email Libby" button and the address as a
  `mailto:` link (subject "Calm Crew"). Every call to action scrolls there.
  Nothing is collected or stored by the site. The old Netlify form, its
  thank-you page and its JavaScript are in the git history (commit a5d1bf5)
  if a form host is ever chosen.
- Breakpoints: 1359px (header links tighten), 1279px (header collapses to a
  Menu button), 1080px (side-by-side sections stack), 760px (mobile tokens,
  single column). site.js repeats the 1280px value; change them together.
- Editing notes that used to sit in the page source: Drop Anchor has no screen
  because the Figma render does not match the build; At sea describes offline
  audio as design intent, because no recording exists yet; the Drop Anchor
  disclaimer is a bordered note, never red. The At sea, Privacy and About copy
  is the client's own (manual Figma edits) and is kept word for word.
- `assets/brand/apple-touch-icon.png` and `favicon.ico` were drawn with
  Pillow from the mark's geometry and the Day colours in tokens.css, like
  `og-image.png`. Redraw them if the mark or the colours change.

### Deliberate differences from Figma

- Secondary buttons use the app's 3 Oct 2026 chip: a `--white`
  surface with a 1.5px `--ink-secondary` outline (4.64:1 Day / 5.79:1 Night
  against the ground, above the 3:1 WCAG asks for control boundaries).
- The header keeps a 1px hairline along its bottom edge (Figma has none),
  because it is sticky and would otherwise merge into the Day bands it
  scrolls over.
- Headings and card titles use balanced line breaks,
  so a few lines break differently from Figma (for example "A check-in is /
  three things"), without Figma's single orphan words.
- Captions and the footer's legal line keep Figma's 12px label style. The
  legal line is not set in capitals, because it carries the email address and
  the Instagram handle.

## Run it locally

```sh
cd calmcrew-website
python3 -m http.server 8000
# open http://localhost:8000/
```

The local server does not apply netlify.toml, so the CSP and other headers are
only enforced on Netlify. Check the browser console on the first deploy
preview.

## Where it is published

**calmcrew.app is published with Figma Sites** (decided 3 Oct 2026), from the
Figma file *Calm Crew — App Design V1*, page "10 · Figma Sites — calmcrew.app",
which mirrors this code: the email link instead of a form, no partner row, and
the phone screens as images. The step-by-step (Sites settings, alt text, DNS
records) is on that page's checklist card. This repository is the code version
of the same page, and can still be hosted on Netlify as below.

## Public test deploy on Vercel

`vercel.json` mirrors the Netlify headers (CSP, security, one-year asset cache)
and adds `X-Robots-Tag: noindex, nofollow` so the test site stays out of search
engines; `.vercelignore` keeps README.md and netlify.toml off the deploy. No
build step.

**Every push to `main` deploys to https://calmcrew-website.vercel.app** through
`.github/workflows/deploy-vercel.yml` (GitHub Actions + Vercel CLI). It needs
the repository secret `VERCEL_TOKEN` (a Vercel access token); the variables
`VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` are already set. Without the secret
the run only logs a warning. A manual deploy still works too:
`npx vercel deploy --prod` from this folder. Vercel's Hobby plan cannot deploy
a *private* organisation repo, which is why this repo is public; Hobby is also
non-commercial only, so move the project to a Pro team before launch.
**Remove the X-Robots-Tag line on launch day**, as for Netlify.

## Deploy on Netlify (optional)

1. Create a site from this folder (drag-and-drop the folder in the Netlify UI,
   or connect the Git repository). There is no build command; the publish
   directory is the repository root (`netlify.toml` already says so).
2. **Domain:** add the domain (and `www`) under *Domain management* and let
   Netlify issue the HTTPS certificate. calmcrew.app is on Figma Sites, so use
   Netlify only for a staging or alternative copy.
3. Netlify uses `404.html` for anything missing (it does that by itself).
   `README.md` and `netlify.toml` are blocked from being served.

**Caching.** Everything under `/assets/` is cached for a year. The HTML links
CSS and JS with `?v=2026-10-03d`: when you change `site.css`, `tokens.css`,
`fonts.css` or `site.js`, bump that value in `index.html` and `404.html`. Images and fonts are not versioned, so give a changed image a new
file name.

**CSP.** The Content-Security-Policy allows only this site's own origin. Inline
`<script>`, inline `style=""` and any outside URL will be blocked. Netlify's
deploy-preview feedback widget is blocked too; that only affects previews.

## LAUNCH CHECKLIST

Unticked items are not done. Items marked **BLOCKER** must be cleared before
the site goes public.

### Blockers

- [ ] **BLOCKER — Website privacy notice.** There is no form any more, but
      calmcrew.app on Figma Sites is hosted in the US (AWS, Cloudflare) and
      sets a Cloudflare cookie, so the site still needs a short privacy page:
      who Libby is, what the host processes, and how email to her is handled.
      Then un-comment the "Website privacy notice" link in the footer.
- [ ] **BLOCKER — The History section (the one claim).** The deck ships this
      section only once Pablo's fix to `app/history.tsx` is in the build: Week
      buckets are keyed by weekday letter, so Tuesday/Thursday and
      Saturday/Sunday merge into one bar (Year merges months the same way).
      Key Week by date and Year by year-month, add a test, then decide whether
      to keep the current Figma render (`history-week`) or replace it with a
      screenshot of the fixed build. The Figma render shows a "5 day streak",
      a "14–20 SEP 2026" label, an empty W column and 1–5 axis numbers that the
      current build does not show.
- [ ] **BLOCKER — Privacy copy must match the app.** The client's Figma edits
      say management sees *aggregated* crew mood and energy over a Bluetooth
      connection the crew member authorises, that identifiable data is not
      shared, and offer "Your Data. Your iCloud sync." The app today has no
      Bluetooth or aggregation feature, no iCloud sync code, and its own
      *What management sees* screen says "Nothing. Not today, and not by
      design later." The site and the app must say the same thing, and it must
      be true, before launch (it is also what pilot consent will rely on).
      "Anonymous" with crews of 4–7 per vessel needs a minimum group size.
- [ ] **BLOCKER — At sea describes iCloud sync** ("No signal needed — For
      iCloud sync backup, Internet is required." and "Sync to iCloud — iCloud
      sync is optional."). iCloud sync is not built yet; ship it or change the
      cards.
- [ ] **Partner logos.** The placeholder row was removed on 3 Oct 2026. Add
      real logos to `#about` (see the comment there) only with each partner's
      written permission; alt text = the partner's name, without "logo".
- [ ] **Email link check.** On the live site, tap "Email Libby" on an iPhone
      and on a desktop: the mail app opens to libby@calmcrewcoaching.com with
      the subject "Calm Crew".

### Screens (flagged to the developer separately)

The images are the current Figma renders, unedited, by decision of 1 Oct 2026.
They differ from the build; captions say "Sample screen(s)." / "Sample data".

- [ ] Today renders (`today-checkin`, `today-saved-day`, `today-saved-night`)
      show a "DAY 20 · The long exhale" player that is not in the build, keep
      Steady and the middle energy level selected after saving (the build
      clears both), and pair "5 day streak" with "1 day ago" / "just now"
      wording the build does not produce.
- [ ] Learn renders (`learn-index`, `learn-chapter-2`) show "Free to everyone."
      on Chapter 1 (unconfirmed, CC-51) and a playing mini player, although no
      recording exists yet. The `learn-index` alt text leaves "Free to
      everyone." out, so only sighted readers get that unconfirmed line.
      Decide: confirm it (and add it to the alt), or replace the render.
- [x] The unused `drop-anchor-*` and `settings-*` renders were removed from
      `assets/img/` so they are never deployed (the originals stay in Figma).
- [ ] No "What management sees" screen exists yet; the privacy section has no
      image for that reason.

### Copy to confirm with Libby

- [x] **Tab name: S.O.S.** (decided 3 Oct 2026). The `#app` card, its lead and the
      section eyebrow say S.O.S.; the section keeps the `#drop-anchor` id.

- [ ] History: the claim is correlation, not cause ("a pattern, not proof of a
      cause"), and History does not overlay listening — "Look across the
      three" asks the reader to compare screens. OK?
- [ ] Eight weeks: "In the pilot, the programme runs for eight weeks." What do
      the eight weeks contain? (The code has no week or day schedule.)
- [ ] Recordings: "still to be made" (Learn card). Is there a date?
- [ ] Chapter 1 glosses: "neuroception" and "glimmers" as defined. OK?
- [ ] Leadership Track: "being made for you … How it opens is still being
      decided." The app says "Ask to join" with no way to ask.
- [ ] Founding partners: has any vessel signed? (If so, "We are looking for…"
      can become "are contributing".) Confirm "a first look at the study's
      overall findings" and "No vessel or company sees any crew member's own
      answers" — a promise the study design must keep with 4–7 crew per vessel.
- [ ] Pilot facts: November 2026, around forty crew, six to ten vessels,
      validated measures at four points, an independent clinical advisor. All
      still current?
- [ ] "For the pilot, the app is iPhone only." Nothing is said about later.
- [ ] Drop Anchor: no helpline is named or numbered until CC-52 is resolved;
      the copy says its "details are being confirmed before the pilot".
- [ ] Privacy wording (client edit): "Anonymous. Now, and later. By design."
      and the three cards. Spelling is American ("utilizes", "authorization")
      against the British spelling elsewhere. Keep or align?
- [ ] About: the credit "I'm building the Calm Crew app with AI Product Leader,
      Pablo Rosero" links to https://pablorosero.me/ai ("Learn More →"). Libby
      to approve an external link from her site. Branagh Marine Composites was
      removed so it cannot read as a partner.
- [ ] The one claim now sits straight after the hero (client edit). The first
      brief put it near the bottom, "not front and centre". Confirm.
- [ ] All industry statistics and the "What gets better" list were removed
      under the one-claim rule. Should the commercial case live in a separate
      document for vessels and management?
- [ ] History caption: the build overrides say "Sample data" (no full stop,
      as in Figma); the deck and the other captions use a full stop ("Sample
      data."). Pick one.

### Related app issues (not blocking the site)

- [ ] The app's Settings footnote says "Calm at sea. Steady within."; the brand
      tagline is "Steady at sea · calm within".
- [ ] With iCloud sync switched on, *What management sees* prints a line about
      an iCloud copy, but no sync code exists.
- [ ] The breath ratio is left out of the site on purpose: the old site said
      "four in, six out", the app's P-04 says "Five in, five out".
- [ ] 10 of 23 CheckInProvider tests fail in the working copy.

### Technical, before going public

- [ ] **On launch day, remove the `X-Robots-Tag = "noindex, nofollow"` line**
      from `netlify.toml`. It was added on 1 Oct 2026 so that the staging
      deploy stays out of search engines while the blockers above are open.
- [ ] Custom domain and HTTPS on Netlify. The HSTS header includes
      `includeSubDomains`: check no subdomain still needs plain HTTP.
- [ ] Paste the URL into a link-preview checker (LinkedIn Post Inspector,
      WhatsApp, iMessage) to confirm `og-image.png` and the texts show.
- [ ] Final accessibility pass on the live site: keyboard only, VoiceOver on
      iPhone, 200% zoom, and an automated check (axe or Lighthouse).
- [ ] Headers on the live site: `curl -sI https://calmcrew.app/` shows
      Content-Security-Policy, X-Content-Type-Options: nosniff,
      Referrer-Policy, Permissions-Policy, X-Frame-Options and
      Strict-Transport-Security;
      `curl -sI "https://calmcrew.app/assets/css/site.css?v=2026-10-03d"`
      shows `Cache-Control: public, max-age=31536000, immutable`; the HTML
      does NOT have that header.
- [ ] `curl -sI https://calmcrew.app/README.md`, `/netlify.toml` and
      `/no-such-page` each return HTTP 404 and the custom not-found page.
- [ ] Open the live page with DevTools: the Console shows no
      Content-Security-Policy errors, and the Network panel shows no request
      to any other domain.
- [ ] Make the apex `calmcrew.app` the primary domain in Netlify so
      that `www` 301s to it (canonical and og:url use the apex).
- [ ] Lighthouse (mobile) on the live URL: LCP under 2.5 s, CLS 0.
- [x] An `apple-touch-icon` PNG (180×180) for iPhone home screens, and a
      root `favicon.ico`, next to the SVG favicon.

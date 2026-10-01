# calmcrewcoaching.com

The one-page website for **Calm Crew**, Libby Pickett's iPhone app and course
for superyacht crew. Plain static HTML, CSS and a little vanilla JavaScript:
no build step, no framework, and no requests to any other domain (fonts are
self-hosted; there are no analytics, CDNs or embeds).

- Copy: `copy_final.json` (1 Oct 2026), the session lead's build overrides, and
  then the client's manual edits in Figma (1 Oct 2026). Those edits win: the
  Figma web frames are the source of truth for section order and wording.
- Design: Figma *Calm Crew — App Design V1* (`f0J6MJZNgvUgkXO1FzVUjd`), web
  frames at 1440px. Brand v2.0: Day and Night only.
- The page makes **exactly one claim**, in the `#history` section. Do not add
  outcome or benefit language, statistics or "what gets better" anywhere else.

## Files

```
index.html              the page
thanks.html             shown after the contact form is sent (/thanks)
404.html                not-found page (root-absolute paths on purpose)
netlify.toml            headers (CSP, security, caching); keeps README.md and
                        netlify.toml from being served
robots.txt
favicon.ico             16/32/48px, for older browsers and link-preview crawlers
assets/css/tokens.css   design tokens: every colour, space and type size
assets/css/site.css     layout and components (no colours of its own)
assets/js/site.js       Menu button, form preselect, form error messages;
                        the page works without it
assets/fonts/           Newsreader (variable: Light 300 + Bold 700), Work Sans
                        (variable 400–700) and Work Sans Italic, self-hosted woff2
assets/brand/           mark.svg, favicon.svg, og-image.png (1200×630),
                        apple-touch-icon.png (180×180)
assets/img/             app screens: WebP 786w/1179w + PNG 786w fallback
```

Section anchors, in page order: `#top` (Day), `#history` (Day, THE ONE
CLAIM), `#at-sea` (Night), `#course` (Day), `#app` (Night), `#drop-anchor`
(Night), `#privacy` (Day), `#pilot` (Night), `#about` (Day), `#contact` (Night).
The nav shows six of them (The app · The course · At sea · Privacy · The pilot
· About Libby). Drop Anchor and History are deliberately not in the nav or the
footer.

How the page is put together:

- A Night band is `class="band-night"` on a section. tokens.css redefines the
  colour custom properties there, so the same CSS draws Day and Night.
- Phone mock-ups are drawn in CSS (10px bezel, 64/54px radii, token shadow at
  the 413px design size). They scale with their container, so pairs and
  mobile phones keep the same proportions.
- Every call to action that should preselect the form has
  `data-interest="waitlist|partner|advisor"`. site.js sets the select and moves
  focus to Name. The choice never goes in the URL.
- Breakpoints: 1359px (header links tighten), 1279px (header collapses to a
  Menu button), 1080px (side-by-side sections stack), 760px (mobile tokens,
  single column). site.js repeats the 1280px and 1080px values; change them
  together.
- With JavaScript, the form shows each problem under its field and keeps it
  there until it is fixed. The wording is the browser's own (its
  `validationMessage`), so the page adds no copy of its own; without
  JavaScript the browser's usual bubbles appear instead.
- Editing notes that used to sit in the page source: Drop Anchor has no screen
  because the Figma render does not match the build; At sea describes offline
  audio as design intent, because no recording exists yet; the Drop Anchor
  disclaimer is a bordered note, never red. The At sea, Privacy and About copy
  is the client's own (manual Figma edits) and is kept word for word.
- `assets/brand/apple-touch-icon.png` and `favicon.ico` were drawn with
  Pillow from the mark's geometry and the Day colours in tokens.css, like
  `og-image.png`. Redraw them if the mark or the colours change.

### Deliberate differences from Figma

- Form fields have a 1px `--ink-secondary` outline, not Figma's `--hairline`:
  hairline against the ground is about 1.6:1, below the 3:1 WCAG asks for
  field boundaries.
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

The form cannot be sent locally: `python3 -m http.server` does not accept POST.
Open `http://localhost:8000/thanks.html` to see the thank-you page.

The local server does not apply netlify.toml, so the CSP and other headers are
only enforced on Netlify. Check the browser console on the first deploy
preview.

## Deploy on Netlify

1. Create a site from this folder (drag-and-drop the folder in the Netlify UI,
   or connect the Git repository). There is no build command; the publish
   directory is the repository root (`netlify.toml` already says so).
2. **Forms:** in *Site configuration → Forms*, make sure form detection is on.
   After the first deploy a form called `contact` should be listed. Set up an
   email notification for it so Libby gets each message.
3. **Domain:** add `calmcrewcoaching.com` (and `www`) under *Domain management*
   and let Netlify issue the HTTPS certificate.
4. Netlify serves `/thanks` from `thanks.html` and uses `404.html` for anything
   missing (it does that by itself; there is deliberately no catch-all rule,
   which could catch the form's POST). `README.md` and `netlify.toml` are
   blocked from being served.

**Caching.** Everything under `/assets/` is cached for a year. The HTML links
CSS and JS with `?v=2026-10-01b`: when you change `site.css`, `tokens.css`,
`fonts.css` or `site.js`, bump that value in `index.html`, `thanks.html` and
`404.html`. Images and fonts are not versioned, so give a changed image a new
file name.

**CSP.** The Content-Security-Policy allows only this site's own origin. Inline
`<script>`, inline `style=""` and any outside URL will be blocked. Netlify's
deploy-preview feedback widget is blocked too; that only affects previews.

## LAUNCH CHECKLIST

Unticked items are not done. Items marked **BLOCKER** must be cleared before
the site goes public.

### Blockers

- [ ] **BLOCKER — Website privacy notice (GDPR Art. 13).** The contact form
      must not go live without it: who Libby is, the purpose, the legal basis,
      how long details are kept, processors and transfers out of the EU
      (Netlify is US-based; name Kit/ConvertKit too if the waiting list moves
      there). Then:
      - link it in the form help text (search `TODO(privacy-notice)` in
        `index.html`);
      - un-comment the "Website privacy notice" link in the footer;
      - confirm the help text above Send is accurate.
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
- [ ] **BLOCKER — Partner logos.** The four tiles in `#about` are placeholders
      (`data-placeholder="partners"`). Replace them with real logos only with
      each partner's written permission (alt text = the partner's name, without
      the word "logo"), or delete the whole block, rule included. Hiding it
      with CSS is not enough.
- [ ] **BLOCKER — Form check on the live site.** After deploy, confirm Netlify
      lists the `contact` form, then send one test from Chrome with a saved
      address profile autofilled (the honeypot is now `bot-field`, hidden with
      the `hidden` attribute, replacing the old `company` field that autofill
      could fill). Check it arrives and lands on /thanks.

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
- [ ] Form error messages. Today they are the browser's own wording ("Please
      fill out this field." and so on, in the visitor's browser language). If
      Libby wants house wording, suggested: "Please add your name.", "Please
      add an email address, like name@example.com." and "Please choose one."
      Optionally, a hidden status line could tell screen-reader users which
      option a button chose ("I'm interested in" is set silently today).
      Both are new copy and need her approval.
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
- [ ] Headers on the live site: `curl -sI https://calmcrewcoaching.com/` shows
      Content-Security-Policy, X-Content-Type-Options: nosniff,
      Referrer-Policy, Permissions-Policy, X-Frame-Options and
      Strict-Transport-Security;
      `curl -sI "https://calmcrewcoaching.com/assets/css/site.css?v=2026-10-01b"`
      shows `Cache-Control: public, max-age=31536000, immutable`; the HTML
      does NOT have that header.
- [ ] `curl -sI https://calmcrewcoaching.com/README.md`, `/netlify.toml` and
      `/no-such-page` each return HTTP 404 and the custom not-found page.
- [ ] Open the live page with DevTools: the Console shows no
      Content-Security-Policy errors, and the Network panel shows no request
      to any other domain.
- [ ] Make the apex `calmcrewcoaching.com` the primary domain in Netlify so
      that `www` 301s to it (canonical and og:url use the apex).
- [ ] Lighthouse (mobile) on the live URL: LCP under 2.5 s, CLS 0.
- [ ] After the test form send, check Netlify → Forms → Spam submissions as
      well as Verified, and check the plan's monthly form-submission
      allowance.
- [x] An `apple-touch-icon` PNG (180×180) for iPhone home screens, and a
      root `favicon.ico`, next to the SVG favicon.

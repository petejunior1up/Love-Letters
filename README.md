# Love-Letters
If music is the food of love, play on.....
# Love Letters

A romantic, single-page website: hero with a glowing pulsing heart, a memory
timeline, an animated photo grid, a rotating quote carousel, a flip-card
hidden message, and a "leave a love message" wall that saves to the visitor's
own browser. No build step, no dependencies — just three files.

## Files

| File | What it does |
|---|---|
| `index.html` | Page structure — hero, Our Story, Memories, Quotes, hidden message, message form |
| `style.css` | The pink / red / white / dark-purple theme, glow effects, all animations |
| `script.js` | Floating hearts, scroll reveals, quote carousel, flip reveal, message wall |

Open `index.html` directly in a browser to preview — no setup needed.

## Making it yours

Everything in here is a placeholder meant to be replaced:

- **Hero title / subtitle** — edit the text inside `<h1>` and the `.hero-sub`
  paragraph in `index.html`.
- **Our Story timeline** — each `<li class="timeline-item">` in `index.html`
  is one moment. Edit the date label, title, and description; add or remove
  `<li>` entries freely, the timeline layout adapts automatically.
- **Memories photos** — open `script.js` and find the `memories` array near
  the top. Each entry has a `caption` and a `src`. Right now `src` is `null`,
  which shows a placeholder heart icon; set it to an image path (e.g.
  `'photos/us-at-the-beach.jpg'`) and it automatically renders as a real photo
  instead.
- **Quotes** — edit the `quotes` array in `script.js`. Any number of quotes
  works; the dots and counter update automatically.
- **Hidden message** — edit the text inside `<p id="hiddenMessage">` in
  `index.html`.
- **Colors** — every color is a CSS variable at the top of `style.css` (the
  `:root` block). Change `--rose`, `--purple-deep`, etc. and the whole site
  re-themes.

## How the message wall works

The "Leave a Love Message" form doesn't send anywhere — there's no backend.
Instead, `script.js` saves each message into the visitor's browser via
`localStorage`, and re-renders the wall from there. That means:

- Messages persist between visits, on the same device and browser.
- Messages are **not** shared between different people or devices — if you
  want a wall that both partners can add to and see, you'd need a small
  backend (e.g. a free tier on Supabase or Firebase) to store messages
  centrally instead of in `localStorage`.

## Step-by-step: publish it on GitHub

1. **Create a new repository** on GitHub — click the `+` in the top right →
   *New repository*. Name it something like `love-letters`, keep it public,
   and skip adding a README (you already have one).
2. **Add these files** to the repo: on the repo's page, click
   *Add file → Upload files*, then drag in `index.html`, `style.css`,
   `script.js`, and this `README.md`. Commit directly to `main`.
3. **Turn on GitHub Pages**: go to *Settings → Pages*. Under "Build and
   deployment", set **Source** to `Deploy from a branch`, **Branch** to `main`
   and folder to `/ (root)`, then **Save**.
4. **Wait about a minute**, then refresh that same Pages settings page — it'll
   show a live URL like `https://your-username.github.io/love-letters/`.

Any time you edit a file and commit, the live site updates automatically
within a minute or two.

## Ideas for extending it

- A **background music toggle** with a soft instrumental track.
- A **countdown** to an anniversary or special date.
- **Confetti of hearts** on page load, not just on the hidden-message reveal.
- Swap `localStorage` for a tiny hosted database so messages are shared
  between two people's devices, not just saved locally.

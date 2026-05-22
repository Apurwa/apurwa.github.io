# apurwa.github.io

Personal site at https://apurwa.github.io.

Single-page minimalist portfolio. Plain HTML + CSS + a tiny bit of JS. No build step.

## Structure

- `index.html` — all content
- `styles.css` — typography and layout
- `script.js` — stat counter animation (intersection-observer)
- `assets/favicon.svg`
- `resume.pdf` — sourced from [Apurwa/Resume](https://github.com/Apurwa/Resume); the hero links directly to that repo so I only update the resume in one place

## Editing

Edit `index.html`. Push to `main`. GitHub Pages picks up the change in ~1 minute.

## Local preview

```bash
python3 -m http.server 8000
open http://localhost:8000
```

Or just open `index.html` directly in a browser.

## Inspiration

Layout follows the structure of [basrizk.github.io](https://basrizk.github.io/) — hero, stats, currently, experience, education, skills. Light theme, system font.

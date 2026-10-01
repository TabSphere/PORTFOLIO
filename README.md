# Frederick Tabiri portfolio

Static HTML/CSS/JavaScript portfolio with an interactive artistic / black-and-white portrait.

## Preview

Run `python -m http.server 3000` from this directory and open http://localhost:3000.

## Portrait interaction

Two aligned transparent portrait images share one frame. A CSS clip-path reveals the artistic image over the photographic image. Pointer position determines the reveal target; requestAnimationFrame applies frame-rate-independent damping. Leaving the hero returns to 50/50. The role buttons also work with keyboard focus and touch. Reduced-motion mode updates the reveal immediately.

The reference site's published `animateFace()` uses jQuery, a timed loop, image widths and damped mouse coordinates. This implementation is original code and does not require GSAP or the reference's code/assets.

## Content

Experience and project contribution summaries follow the supplied October 2026 Digital Product Manager CV. Project cards are typographic covers, not product screenshots. Full case-study evidence and screenshots can be added when available. The downloadable CV is the supplied version.

## Deployment

Serve this directory with any static host. Legacy blog pages and assets remain in the repository; the new homepage does not link to those pages.


## About page and motion refresh
Dedicated about.html uses supplied field photographs and design archive, with general captions where project names are unconfirmed. Manrope fonts and GSAP 3.15.0 / ScrollTrigger are served locally. Motion respects reduced-motion preference and content stays readable if scripts fail. Home backdrop uses independent decorative layers; it is a 2D depth effect, not a 3D model. The supplied five-second design video is opt-in with native controls.

# GLUKONDDVERSE
### The Multiverse Portfolio of Parthiba

---

I got tired of the question — *so what do you do?* — and having to pick one answer.

I'm a web developer. I'm also a cinematographer. I'm also a musician. I'm a human from Kolkata, currently at IIIT Agartala, trying to hold three completely different creative worlds without any of them collapsing into the others. Every time I tried to build a portfolio that showed all of that, it fell apart. Too much. Too contradictory. A developer's portfolio looks one way. A musician's sounds different. A cinematographer's sees differently. They don't live on the same page.

Then I thought about a guitar capo. You clamp it on a fret and the whole instrument shifts key — same strings, same hands, different sound. That became the answer. The portfolio is one instrument. The fret decides which version of me you're in.

So I built GlukonddVerse. Four dimensions. One site. All of it is me.

---

## Stack

Next.js · React · TypeScript · Tailwind CSS · Framer Motion · Supabase · Upstash Redis · Discord · 

---

## The Capo Engine

Bottom-left corner of every page. Four buttons: `0` `1` `2` `3`. Each one is a full personality switch — not just colors, everything. The background, the accent, the fonts, the cursor, the overlays on the whole page, even how every photo looks. It's not a theme toggle. The site becomes a different thing.

**Fret 0 — TECH BASE**
Black and yellow. Monospace. Crosshair cursor. Barely-visible horizontal scanlines across the whole screen. This is the engineering dimension. Minimal, precise, cold in a good way.

**Fret 1 — STUDIO VIBE**
Near-black and deep red. A grain you can feel but not quite see sits over everything. A knob cursor that blooms open when you hover. This is the music dimension. Dark the way a recording studio at 2am is dark.

**Fret 2 — MATRIX VIBE**
Dark green. Neon green. Serif type. A pulsing ring cursor that slowly rotates. Green because film. Because something is being watched. This is the cinema dimension.

**Fret 3 — CLUB VIBE**
White. Black. Nothing else. The whole site inverts. Brutalist. Two thin black bars at the very top and bottom of the screen — like a widescreen film print. Maximum contrast, zero decoration.

### How to switch

| Method | How |
|---|---|
| Mouse | Click `0` `1` `2` `3` in the CAPO widget, bottom-left of every page |
| Keyboard | Press `0`, `1`, `2`, or `3` anywhere — works instantly, skips inputs |
| Memory | Your last fret is saved. The site opens back in your dimension. |

---

## Pages

### Home
The page opens with a camera flash — a white burst that's gone before you consciously register it. Every load is a shutter clicking.

Then the hero: a headline, a portrait that parallaxes as you scroll, a floating `location` badge. Below that, a live radar showing the status of real deployed projects. Scroll further and the three dimensions — Web Developer, Musician, Cinematographer — introduce themselves. None of them apologize for being next to each other.

### About
A dossier. Who I am. Where I came from. What I'm building.

There's a portrait on this page. Hover over it and it breaks apart — a second version of me bleeds through, distorted, shifted. It says `// HOVER TO DISTORT`. I think that's more honest than a clean headshot. People aren't stable images.

Below the portrait: an identity map showing how the three disciplines connect. Then a personal timeline styled like a git log — real dates, real events, formatted as commit history because that's how I think about time passing. Then Side Quests, a collapsible section for everything I'm doing that doesn't fit neatly anywhere.

### Career
Every project I've shipped. Status (live / building / archived), links to GitHub and the live site, and the full tech. A ledger, not a brag sheet.

### Studio
The music page. Glukondd & The Signal Chain — the full story of the band. Five members. Then the track archive: every release, with BPM, key, duration, genre, and a Spotify link on each. A Spotify embed. Photos from sessions.

### Gallery
The cinematography page. Named "Contact Sheet" — the unedited print of every frame on a roll of film. Everything before the selection happens. That's the intention.

### Club
The white dimension. Fret 3 lives here.

### Contact
A form. It reaches me directly.

---

## Features and hidden things

**The camera flash** — every page load. White burst. Gone in half a second. Intentional.

**Four custom cursors** — one per fret, each completely different. They disappear on touch devices because they'd be pointless there. On desktop, they have weight — they trail the mouse slightly instead of snapping to it.

**The Guestbook Terminal** — fixed to the bottom-right of every page. "LEAVE A MARK ↗". It slides open as a drawer. Two modes:
- **Public** — your message shows in the terminal for every visitor
- **Private** — goes directly to me and nowhere else. A direct line.

**The portrait glitch** — hover the About photo. A distorted second version of me bleeds through.

**The Active Radar** — on the home page. Real statuses. Real projects. The dot breathes. It's not decoration.

**Open DevTools** and look at the console. There's something there. I won't describe it.

**Right-click** — try it.



**Keyboard shortcuts:**
- `0` — switch to Tech Base
- `1` — switch to Studio Vibe
- `2` — switch to Matrix Vibe
- `3` — switch to Club Vibe
- Works from anywhere on the page. Doesn't fire inside text inputs.

---

## Why



The portrait glitch — a clean still image of a person isn't accurate. We're unstable. The distortion is more honest than the photograph.

The guestbook — I wanted this site to feel like a live transmission, not a static document. If you're here, I want to know.

The Active Radar — I didn't want any part of this site to be performed. Real projects, real status. No fake placeholder data.


The Capo Engine — because I refused to choose one dimension. I don't think I should have to. I don't think most people should have to. We contain more than one thing.

---

## Running locally

```bash
npm install
npm run dev
```

You'll need a `.env.local` with Supabase, Upstash Redis, and Discord webhook keys. Reach out if you actually want to run this — contact.parthibanaskar@gmail.com.

---

## License

Copyright © 2026 Parthiba. All rights reserved. Not open source.

---

contact.parthibanaskar@gmail.com · github.com/glukondd · linkedin.com/parthibanaskar · instagram.com/glukondd

or open the site and hit **LEAVE A MARK ↗**

THANK YOU.



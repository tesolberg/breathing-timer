# Breathing Timer

A browser-based timer for Wim Hof-style breathing exercises. Try it at
[tesolberg.github.io/breathing-timer](https://tesolberg.github.io/breathing-timer/).

This document explains *why* the timer is shaped the way it is: the breathing
method it times, the physiology behind that method's structure, and the
reasoning behind the app's design. For the practical steps of getting the code
running, see the "Running it locally" section at the end — everything before
that is background, not instructions.

## The method behind the timer

The exercise this app times follows the structure popularised by Wim Hof, and
it has three distinct movements repeated over several rounds: a burst of deep
breathing, a breath hold, and a single recovery breath. The app's phase model
(`preHyperventilation → hyperventilation → breathHold → recoveryBreath →
postRecoveryBreath`, visible in `scripts/model.js`) mirrors this structure
directly rather than being an arbitrary design — each phase corresponds to a
distinct physiological event, and the app's job is really just to keep
faithful time across them.

The reason breath holds get dramatically longer after a round of deep
breathing has less to do with oxygen than most people assume. Blood
haemoglobin is already close to fully saturated with oxygen under normal
breathing, so hyperventilating doesn't meaningfully add more of it. What it
does do is expel carbon dioxide, and it's rising CO₂ — not falling oxygen —
that triggers the reflexive urge to breathe. Lowering blood CO₂
(hypocapnia) delays that alarm, which is why a breath hold that would be
unbearable after normal breathing feels comfortable after a hyperventilation
round. This is also the reason breath-hold duration is left as a user setting
rather than something the app tries to standardise: the "right" length is
whatever the individual can sustain that day, and it will vary.

The recovery breath at the end of each round — inhale, hold for fifteen
seconds — exists to bring CO₂ and blood gases back towards baseline before
either starting the next round or returning to normal breathing. It is
short and fixed (unlike the breath hold) because its purpose is
stabilisation, not challenge.

### Why this needs a safety note

Because hyperventilation suppresses the CO₂-driven urge to breathe without
increasing how much oxygen is actually available, it's possible to lose
consciousness from low oxygen (hypoxia) *before* feeling any need to breathe.
On land this is usually harmless — you black out and resume breathing
automatically. In water it isn't: this exact mechanism is the cause of
shallow-water blackout, which is why this kind of breathing practice should
never be combined with swimming, bathing, or being near water, and why
standing up quickly after a breath hold (when blood pressure is already
unusual) is its own minor risk. None of this is medical advice — it's the
reasoning behind a warning you'll see repeated everywhere this method is
taught, included here because understanding *why* the warning exists makes
it easier to take seriously than a bare instruction would.

## Why the app is built the way it is

**No framework, no build step.** The whole thing is `index.html`, three
script files, and a stylesheet, loaded directly by the browser with Bootstrap
pulled in from a CDN for the settings panel's chrome, and Quicksand (Google
Fonts) for a softer, rounder typeface than Bootstrap's default. For an app
whose entire job is "show a shape, change its size and colour on a schedule,
and display some text," a build pipeline would add ceremony without adding
capability. The trade-off is that this doesn't scale gracefully if the app
grows more complex — but that's a decision to revisit if and when that
happens, not a default to design in from the start.

**The theme is "air" as a literal constraint, not just a palette.** The
background is a dusk-sky gradient with two very slowly drifting soft glows
standing in for clouds; the settings panel and buttons are translucent
frosted "glass" rather than solid panels, so the sky shows through them; and
the breathing circle itself is a glowing gradient orb instead of a flat disc.
The four phase colours were chosen as different *qualities* of air rather
than an arbitrary four-colour set: still air (get ready), moving air
(hyperventilation), suspended air (breath hold), and a fresh breeze
(recovery). The palette leans dusky rather than a bright daytime sky
deliberately — this is normally used with eyes closed, and a glaring white
background would work against the point of the exercise.

**Sizing follows the space actually available, not the screen.** The circle
and its glow are sized with CSS container query units (`cqmin`) against
`.main-container`, the box that holds them — not the viewport. That distinction
matters the moment the settings panel is open: it eats into the vertical space
`.main-container` gets, and because the circle is sized relative to that
container rather than the raw screen, it shrinks to fit instead of overlapping
the panel above it.

**A single ticking loop drives everything.** `model.js` implements the phase
sequence as a small state machine that schedules its own next tick via
`setTimeout`, and `controller.js` listens for changes and updates the DOM
accordingly — a lightweight model/view/controller split rather than a
framework's. Hand-rolling this is straightforward for a timer this small, but
it comes with a subtlety worth naming: naively chaining `setTimeout` calls
drifts, because each call's actual delay is *at least* what you asked for,
never exactly it. Over a 90-second breath hold, that overhead compounds. The
current implementation schedules each tick against the phase's absolute start
time rather than against "now," which keeps ticks aligned to real elapsed
time instead of drifting further apart the longer a phase runs.

**The circle can be clicked to skip a phase.** This is a small but deliberate
concession to the fact that a fixed script can't know an individual's limits
on a given day. A breath hold that felt fine yesterday might not today, and
the app deliberately gives that decision back to the person doing the
exercise rather than enforcing a countdown to zero.

**Phase changes make sound and, on supported devices, vibrate.** The
exercise is normally done with eyes closed, which makes a purely visual timer
awkward to actually use — you'd have to keep peeking. The audio cues are
generated with the Web Audio API rather than shipped as sound files, since a
few short synthesised tones cost nothing to bundle and are trivial to
generate on the fly.

## Running it locally

The project ships a dev container (`.devcontainer/`) so a consistent Node
environment doesn't have to be set up by hand: open the folder in VS Code (or
any dev-container-compatible tool) and it will install a static file server
and forward port 8080 automatically. Without a dev container, `npm install`
followed by `npm start` serves the site the same way, or you can simply open
`index.html` directly in a browser, since nothing here depends on a server
beyond serving static files.

## Licence

MIT — see [LICENSE](LICENSE).

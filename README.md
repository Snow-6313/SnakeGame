# 🐍 Snake: Feature-Rich Browser Snake Game

A heavily expanded take on the classic Snake game, built with vanilla HTML, CSS, and JavaScript. Eat food, survive random events, chase high scores, and unlock escalating win levels, all in your browser with no dependencies.

---

## 🚀 Getting Started

No build step or server required.

1. Clone or download the project folder.
2. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari).
3. Enter your name and hit **▶ PLAY**.

> **Tip:** Append `?debug` to the URL (e.g. `file:///…/index.html?debug`) to enable the developer debug panel.

---

## 🎮 How to Play

| Key | Action |
|-----|--------|
| `↑ W` | Move Up |
| `↓ S` | Move Down |
| `← A` | Move Left |
| `→ D` | Move Right |
| `P` | Pause / Resume |

- **Eat** the orange food to grow and score points.
- **Avoid** hitting walls or your own body.
- Every **8 seconds** a random event fires, it can help or hurt you.
- Reach the **score target** (default: 1 000 pts) to win a level and push on with a higher goal.

---

## ✨ Features

### Scoring System
- **Base score** per food eaten, multiplied by your current length multiplier.
- **Streak system**: consecutive eats without missing bump a streak counter; every 3 eats raises the streak multiplier.
- **Win levels**: each continue scales the target and bonuses.

### Random Events (54 total)
Events fire every 8 seconds. A **pre-warning banner** and countdown bar give you advance notice for dangerous events. Events are drawn from a persistent **5-event queue** shown in the Upcoming panel.

| Rarity | Weight | Examples |
|--------|--------|---------|
| Common | 6× | Speed Boost, Slow Motion, Bonus Food, Score Drain |
| Rare | 3× | Double Points, Food Frenzy, Reverse Controls, Moving Food |
| Epic | 1× | Triple Points, Invincible, All Seeing Eye, Rewind |
| Legendary | 8% flat | Golden Hour, Score Jackpot, Cosmic Jackpot (1% only) |
| Mythic | Special | Cosmic Jackpot (once per session) |

<details>
<summary>Full event list</summary>

Speed Boost · Slow Motion · Double Points · Bonus Food · Ghost Mode · Triple Points · Food Frenzy · Invincible · Shrink · Growth · Mini Snake · Bigger Snake · Score Drain · Score Growth · Reverse Controls · Expand Board · Shrink Board · Speed Trap · Blind · Teleport · Point Surge · Score Multiplier ×5 · Shuffle Food · Poison · Moving Food · Chaos · Swap Controls · Length Drain · Golden Hour · Score Jackpot · Full Send · Time Stop · Feast · Length Surge · Multiplier Freeze · Multiplier Boost · Magnet · Freeze Growth · Bomb Food · Dash · Mystery Box · Food Swap · Mirror Board · All Seeing Eye · Loop Board · Wall Maze · Fake Food · Ticking Time Bomb · Gamble · Rewind · Prismatic · Divine Trade · Gravity Flip · Cosmic Jackpot

</details>

### Special Food Types
- 🍎 **Bonus food**: extra score, temporary spawns.
- 💣 **Bomb food**: eating it is painful; defuse the *Ticking Time Bomb* for +20 pts instead.
- ❓ **Mystery Box**: random reward on eat.
- 👻 **Fake food**: plays a sound but gives nothing.

### God's Eye (in-game overlay)
Pause the game mid-run and manually curate the next 5 events. Maximum 1 legendary per edit session.

### Leaderboard
- Persisted in `localStorage` (up to 50 entries).
- Tracks: score, win level, food eaten, bonus eaten, bombs hit, events lived, snake length, and run duration.
- Sortable by **Score** or **Date**.
- Duplicate names keep only the best score.

### Themes (10 presets)
Switch visual themes from the title screen. Choice is saved across sessions.

| Theme | Flavour |
|-------|---------|
| Classic | Deep blue, the default |
| Neon | Cyberpunk cyan & pink |
| Forest | Earthy greens |
| Cosmic | Deep space purple |
| Lava | Fire orange & red |
| Ocean | Deep sea teal |
| Retro | Arcade lime-on-black |
| Blood Moon | Horror crimson |
| Blizzard | Icy light blue |
| Gilded | Luxury gold |

### Other Highlights
- **rAF-based game loop** with smooth sub-tick interpolation for fluid snake movement.
- **Spawn protection**: 5 seconds of invincibility + ghost mode after a win continue.
- **How to Play modal**: pauses the game while open.
- **Hidden cheat code**: type `curtis67` after death to resume in-place with 5 s ghost mode.
- **Low-score auto-cleanup**: runs under 50 pts are removed from the leaderboard after 30 s.
- **Debug panel** (`?debug`): force any event, edit the leaderboard, and set your score on the fly.

---

## 📁 Project Structure

```
SnakeGame/
├── index.html          # Markup, overlays, modals
├── style.css           # All styling & animations
├── js/
│   ├── drawboard.js    # Renderer: canvas drawing, themes, interpolation
│   ├── events.js       # All 54 event definitions (apply / remove logic)
│   └── game.js         # Game loop, scoring, leaderboard, UI wiring
└── Sounds/
    ├── ding.mp3        # Food-eat sound effect
    └── msuic.mp3       # Background music
```

---

## 🛠️ Tech Stack

- **HTML5 Canvas**: game rendering
- **Vanilla JavaScript (ES6+)**: no frameworks, no bundler
- **CSS3**: UI, animations, theme variables
- **localStorage**: leaderboard & theme persistence

---

## 📝 License

This project is for personal / educational use. Feel free to fork and expand it.

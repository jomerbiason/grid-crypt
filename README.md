# ⬛ GridCrypt

**GridCrypt** is a high-intensity, terminal-inspired roguelike dungeon crawler built from the ground up for the mobile web. Featuring procedural generation, a custom Web Audio synthesizer, and a tactile virtual interface, it offers a retro-futuristic survival experience directly in your browser.

---

## 🚀 Play Now

👉 **[Enter the Dungeon](https://jomerbiason.github.io/gridcrypt/)** *(Update this link to your actual deployment)*

---

## 🎮 Core Gameplay

* **Procedural Depths:** Every floor is dynamically generated using a hybrid Maze/Cave algorithm, ensuring that no two runs are identical.
* **Tactical Survival:** Manage your resources—Torch (light radius), Sword (durability), Shield (defense), and Potions (health)—to navigate increasingly dangerous floors.
* **Dynamic HUD:** Real-time state tracking of your HP, Level, XP, and equipment status.
* **Touch-Optimized Interface:** Designed for mobile play, featuring a virtual D-Pad and a "Diamond" action button layout for ergonomic interaction.

---

## 🛠 Engineering Stack

| Layer | Technology |
| :--- | :--- |
| **View Engine** | HTML5 Canvas API |
| **Logic** | Vanilla ES6+ JavaScript |
| **Audio** | Custom Web Audio API Synthesizer (No external assets) |
| **Responsiveness** | Dynamic viewport units (`dvh`/`vw`), touch-event hooks |

---

## ⚡ Technical Highlights

* **Procedural Audio Engine:** The game uses a custom-built Web Audio synthesizer to generate all sound effects and ambient tracks procedurally. No external files are loaded, keeping the initial footprint minimal.
* **Ghost-Click Mitigation:** Built with `touch-action: none` and specialized pointer event handling to prevent browser interference on mobile devices.
* **Memory-Efficient Rendering:** Optimized frame loop using CSS `pixelated` rendering and intelligent exploration masking to handle high-density dungeon layouts.
* **Viewport Lock:** Forced landscape orientation logic via CSS ensures the UI remains stable and usable on mobile devices.

---

## 🕹 Controls

| Action | Keyboard | Interface |
| :--- | :--- | :--- |
| **Move** | W, A, S, D | D-Pad |
| **Attack** | Q | Sword (🗡️) |
| **Defend** | E | Shield (🛡️) |
| **Torch** | R | Torch (🔥) |
| **Heal** | T | Potion (🧪) |

---

## 📂 Repository Architecture

```text
├── index.html        # Single-file architecture (Markup, CSS, & Game Engine)
└── README.md         # Documentation

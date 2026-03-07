# Nuxt Portfolio Landing 🚀

An interactive landing page prototype built with **Nuxt 4** and **Nuxt UI**, showcasing a gamified system boot sequence for CubeDesigns*.

*My personal website.

---

## 🌟 User Experience

1. **Initial Boot**  
   - CubeDesigns logo is displayed  
   - Terminal-like window shows typewriting messages simulating module loading  
   - Messages like: “New design loading…”, “Modules compiling…”  

2. **System Failure** ⚡  
   - During the lighting module, a critical error occurs  
   - Screen flickers and goes dark  
   - Mouse cursor acts like a **flashlight** to explore the dark screen  
   - Terminal turns **red**, showing an error message  
   - A **“Power Emergency Supply”** button appears in the lower-right  

3. **Recovery Boot** 🔋  
   - Clicking the emergency power button restores power  
   - Terminal displays a recovery sequence with progress messages  
   - Lights return, and system is fully online  

4. **Interactive Replay** 🔄  
   - After recovery, users can toggle the power button to replay the effect  
   - Provides a controlled interactive experience of the boot/failure sequence  

---

## 🛠️ Tech Stack

- **Nuxt 4** – app framework  
- **Nuxt UI** – UI components  
- **Tailwind CSS** – styling  
- **Vue 3 Composition API** – state and phase management  
- **Custom components**: `BootSequence`, `FaultyBootSequence`, `SpotlightEffect`, `LightSwitch`, `PowerSwitch`, `Terminal`, `TypeWriter`  

---

## 📂 Project Structure (Highlights)

- `pages/index.vue` – main landing page logic & system phase management  
- `components/` – modular interactive components (terminal, spotlight, light switch, etc.)  
- `assets/` – logo, CSS, images  
- `app.vue` – layout & SEO meta setup  
- `app.config.ts` – footer links and app colors  

---

This repo is kept for reference and demonstrates **interactive UI effects**, **phase management**, and **Nuxt 4 capabilities**.
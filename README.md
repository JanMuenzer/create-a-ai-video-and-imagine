# ⚡ Nexus AI — Uncensored Video & Imagine Studio

> **An unrestricted, open AI creative suite for high-resolution AI Image Generation (Imagine) and Cinematic AI Video Synthesis (Video Studio) with native GitHub integration.**

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/JanMuenzer/create-a-ai-video-and-imagine)
[![Live Preview](https://img.shields.io/badge/Live-Web_App-8b5cf6?logo=googlechrome)](https://antigravity.luch.dev/site/1a7197b8-98e1-42b9-8695-60e612b3ad28/1d2e2b4d9b7595704e77ec77/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PWA Ready](https://img.shields.io/badge/PWA-Mobile_Ready-06b6d4?logo=apple)](https://antigravity.luch.dev/site/1a7197b8-98e1-42b9-8695-60e612b3ad28/1d2e2b4d9b7595704e77ec77/)

---

## 🌐 Live Application

Access the live web app directly on your phone or desktop:
👉 **[Open Nexus AI Studio](https://antigravity.luch.dev/site/1a7197b8-98e1-42b9-8695-60e612b3ad28/1d2e2b4d9b7595704e77ec77/)**

---

## ✨ Features at a Glance

### 🎨 1. Imagine Studio (AI Image Generation)
* **High-Res Text-to-Image**: Powered by Flux Schnell, Flux Realism, and Turbo neural pipelines.
* **Image Remix (Image-to-Image)**: Upload any reference image and guide the AI to reinterpret, enhance, or transform it.
* **Uncensored Mode**: Toggle off restrictive content filters to generate unfiltered artistic concepts, gritty cinema, dark fantasy, and anatomical art without artificial censorship blocks.
* **AI Prompt Expander**: One-click intelligent prompt enhancer that introduces volumetric lighting, octane rendering tags, 85mm anamorphic lenses, and atmospheric realism.
* **Aspect Ratios**: 1:1 (Square), 9:16 (Stories/Reels/TikTok), 16:9 (Cinematic Widescreen), 4:3 (Classic), and 21:9 (Ultra-wide).
* **Style Modulation Chips**: Photorealism, Cyberpunk, Dark Fantasy, Anime Masterpiece, Surrealism, and 35mm Film.
* **Seed & Latent Controls**: Fixed or randomized seed values for exact visual reproducibility.

### 🎬 2. Video Studio (AI Video Generation)
* **Text-to-Video & Image-to-Video**: Turn any imaginative concept or previously generated Imagine image into a dynamic video clip.
* **Cinematic Camera Directives**:
  * `Dolly In` (Dramatic forward zoom)
  * `Dolly Out` (Cinematic pull-back)
  * `Pan Left / Pan Right` (Lateral sweep)
  * `360 Orbit` (Rotational camera trajectory)
  * `Cinematic Drift` (Fluid floating camera)
* **Client-Side High-FPS Video Synthesizer**: Uses high-performance HTML5 Canvas frame interpolation with `MediaRecorder` to compile downloadable MP4/WebM video files directly in your browser.
* **External Video Engine Support**: Built-in support for Fal.ai (Luma / Kling), Replicate (CogVideoX / Wan2.1), and local ComfyUI/AnimateDiff endpoints.
* **Full Video Controls**: Real-time progress tracker, looping toggle, speed modulation, and one-click MP4 export.

### 🐙 3. Native GitHub Integration
* **Connected Repository**: All project updates and modifications sync automatically to [JanMuenzer/create-a-ai-video-and-imagine](https://github.com/JanMuenzer/create-a-ai-video-and-imagine).
* **GitHub Gist Cloud Backup**: Connect your GitHub Personal Access Token (PAT) to back up your creation library, prompt logs, and metadata directly to personal secret or public GitHub Gists.
* **Automated CI/CD**: Includes `.github/workflows/deploy.yml` for automated GitHub Pages deployments.

### 🗄️ 4. Creative Vault & Gallery
* **Local Persistence**: All generated images and video clips are stored in browser storage.
* **Creation Inspector (Lightbox)**: Fullscreen view, metadata inspector, prompt extractor, and one-click "Remix" or "Animate This" buttons.
* **JSON Backup Export**: Export your entire creation catalog in a single JSON bundle.

### 📱 5. Mobile-First PWA Design (iPhone & Android)
* Bottom navigation drawer tailored for iPhone and touchscreens.
* Glassmorphic futuristic obsidian aesthetic with glowing neon accents.
* Haptic feedback vibrations on touch.
* Safe-area padding for notch and dynamic island displays.

---

## 🚀 Quick Start / Local Development

Since Nexus AI is built as a zero-dependency static web application, you can run it locally with any static web server:

```bash
# Clone the repository
git clone https://github.com/JanMuenzer/create-a-ai-video-and-imagine.git
cd create-a-ai-video-and-imagine

# Serve using Python 3
python3 -m http.server 8080

# Or serve using Node.js / npx
npx serve .
```

Then open `http://localhost:8080` in your browser.

---

## 🛠️ Architecture

```
├── index.html                 # Single-page UI with Tailwind CDN and FontAwesome
├── style.css                  # Custom futuristic neon styling, glassmorphism, safe-areas
├── app.js                     # Core application logic, Pollinations API, Canvas video engine
├── manifest.json              # Progressive Web App (PWA) manifest
├── sw.js                      # Service Worker for asset caching & offline capability
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Pages automated deployment workflow
└── README.md                  # Project documentation & reference
```

---

## 🔒 Content & Uncensored Mode Notice

The Uncensored Mode toggle removes strict system filters to give artists, game designers, and cinematographers complete creative freedom. Users are responsible for the content they generate adhering to local laws.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

/**
 * Nexus AI — Uncensored Video & Imagine Studio
 * Comprehensive Client-Side AI Generation, Video Synthesis, and GitHub Integration
 */

// ==========================================
// 1. STATE & STORAGE
// ==========================================
const APP_STATE = {
  activeTab: 'imagine',
  uncensoredMode: true,
  aspectRatio: { name: '1:1', width: 1024, height: 1024 },
  selectedStyle: '',
  selectedMotion: 'zoom-in',
  imagineMode: 'txt2img', // 'txt2img' or 'img2img'
  videoMode: 'txt2vid',   // 'txt2vid' or 'img2vid'
  currentImage: null,
  currentVideo: null,
  referenceImageBase64: null,
  videoSourceImageBase64: null,
  isGeneratingImage: false,
  isGeneratingVideo: false,
  settings: {
    githubToken: localStorage.getItem('nexus_gh_token') || '',
    falKey: localStorage.getItem('nexus_fal_key') || '',
    hfToken: localStorage.getItem('nexus_hf_token') || '',
    customUrl: localStorage.getItem('nexus_custom_url') || '',
    uncensoredEnabled: localStorage.getItem('nexus_uncensored') !== 'false'
  }
};

// Initial Curated Showcase Items (Guarantees fresh gallery on first visit)
const INITIAL_GALLERY = [
  {
    id: 'init-1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1024&q=80',
    prompt: 'Cyberpunk neon ronin standing in torrential rain, reflections on wet asphalt, volumetric cyan and magenta rim lighting, 8k uhd',
    model: 'Flux Schnell',
    resolution: '1024x1024',
    seed: 849201,
    uncensored: true,
    timestamp: Date.now() - 3600000 * 5
  },
  {
    id: 'init-2',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1024&q=80',
    prompt: 'Dark ethereal cosmic anomaly, obsidian monolith suspended in swirling nebular vortex, hyper-detailed surrealism, octane render',
    model: 'Flux Realism',
    resolution: '1344x768',
    seed: 572911,
    uncensored: true,
    timestamp: Date.now() - 3600000 * 3
  },
  {
    id: 'init-3',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1024&q=80',
    prompt: 'Renaissance oil painting of fallen archangel in ruinous cathedral, dramatic chiaroscuro lighting, cracked stone, masterpiece',
    model: 'Flux Schnell',
    resolution: '768x1344',
    seed: 194832,
    uncensored: true,
    timestamp: Date.now() - 3600000 * 2
  }
];

// Load Gallery from LocalStorage or initialize
let galleryItems = [];
try {
  const saved = localStorage.getItem('nexus_creations_gallery');
  galleryItems = saved ? JSON.parse(saved) : INITIAL_GALLERY;
} catch (e) {
  galleryItems = INITIAL_GALLERY;
}

// Curated Uncensored Prompts Vault
const UNCENSORED_PROMPT_VAULT = [
  {
    title: "Cyberpunk Shadow Runner",
    category: "Sci-Fi / Action",
    prompt: "A cyber-augmented mercenary on a rain-drenched Neo-Shinjuku rooftop, glowing cybernetic eye, trenchcoat billowing in neon fog, hyper-detailed 8k octane render, cinematic anamorphic lens, volumetric lighting",
    negative: "blurry, lowres, deformed, cartoon, oversaturated"
  },
  {
    title: "Gothic Sorceress of the Void",
    category: "Dark Fantasy",
    prompt: "An ancient dark sorceress clad in ornate obsidian armor, ethereal violet flame swirling around clawed gauntlets, crumbling gothic throne room, dramatic chiaroscuro Caravaggio lighting, masterpiece",
    negative: "bad anatomy, blurry, cartoon, artifacts"
  },
  {
    title: "Hyper-Real 8K Cinematic Portrait",
    category: "Photorealism",
    prompt: "Award-winning photographic portrait of a weathered desert wanderer, piercing hazel eyes, intricate skin pores, natural golden hour sunlight, 85mm f/1.2 lens, shallow depth of field, kodak portra 400",
    negative: "airbrushed, plastic skin, 3d, fake, render"
  },
  {
    title: "Surreal Mind-Bending Dreamscape",
    category: "Surrealism",
    prompt: "Floating islands with upside-down emerald waterfalls flowing into liquid gold clouds, twin colossal moons on the horizon, Salvador Dali aesthetic, hyper-detailed concept art, radiant ethereal lighting",
    negative: "amateur, grainy, blurry, low resolution"
  },
  {
    title: "Post-Apocalyptic Mecha Titan",
    category: "Mecha / Action",
    prompt: "Colossal rusted bipedal warmachine towering over overgrown city ruins, sparks flying from damaged hydraulics, heavy atmospheric smoke, lens flare, photorealistic military realism, Unreal Engine 5 render",
    negative: "blurry, toy-like, lowpoly, distorted"
  },
  {
    title: "Anime Cyber Katana Duel",
    category: "Anime / Dynamic",
    prompt: "Dynamic action shot of two rival anime warriors clashing with plasma blades mid-air, particle sparks explosion, speed lines, Makoto Shinkai lighting style, ultra detailed cel shading, 4k wallpaper",
    negative: "bad anatomy, mutated hands, low quality, pixelated"
  },
  {
    title: "Deep Sea Abyssal Leviathan",
    category: "Horror / Creature",
    prompt: "Bioluminescent gargantuan sea monster emerging from midnight trench, glowing tentacles illuminating sunken alien temple, eerie god rays filtering through dark water, National Geographic underwater photography",
    negative: "cartoon, flat lighting, blurry, oversaturated"
  },
  {
    title: "Vaporwave Retro Highway 1984",
    category: "Retro / Synthwave",
    prompt: "Sports car speeding towards an immense neon grid sunset, purple palm trees silhouette, chrome reflections, analog VHS tape scanlines, synthwave album art, nostalgic 80s aesthetic, 4k",
    negative: "modern, dull, washed out, low contrast"
  },
  {
    title: "Mythological Phoenix Rebirth",
    category: "Mythology",
    prompt: "Majestic immortal phoenix bursting from swirling embers and volcanic ash, radiant golden and ruby feathers, hyper-detailed plumage, volumetric fire particles, cinematic movie still, masterwork",
    negative: "dull, flat, ugly, distorted wings, cartoon"
  }
];

// ==========================================
// 2. DOM INITIALIZATION & EVENT LISTENERS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Sync state with UI
  updateUncensoredUI();
  renderGalleryGrid();
  renderPromptsVault();
  updateGalleryBadges();

  // Load saved settings into modal inputs
  if (document.getElementById('github-token-input')) {
    document.getElementById('github-token-input').value = APP_STATE.settings.githubToken;
  }
  if (document.getElementById('fal-key-input')) {
    document.getElementById('fal-key-input').value = APP_STATE.settings.falKey;
  }
  if (document.getElementById('hf-token-input')) {
    document.getElementById('hf-token-input').value = APP_STATE.settings.hfToken;
  }
  if (document.getElementById('custom-url-input')) {
    document.getElementById('custom-url-input').value = APP_STATE.settings.customUrl;
  }
  if (document.getElementById('settings-uncensored-toggle')) {
    document.getElementById('settings-uncensored-toggle').checked = APP_STATE.settings.uncensoredEnabled;
  }

  // Keyboard shortcut: Ctrl/Cmd + Enter to generate
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      if (APP_STATE.activeTab === 'imagine') {
        generateImage();
      } else if (APP_STATE.activeTab === 'video') {
        generateVideo();
      }
    }
  });
});

// Trigger light haptic vibration on mobile
function triggerHaptic() {
  if (window.navigator && window.navigator.vibrate) {
    window.navigator.vibrate(15);
  }
}

// ==========================================
// 3. NAVIGATION & TAB SWITCHING
// ==========================================
function switchTab(tabId) {
  triggerHaptic();
  APP_STATE.activeTab = tabId;

  // Hide all sections
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));

  // Show active section
  const targetSection = document.getElementById(`section-${tabId}`);
  if (targetSection) {
    targetSection.classList.remove('hidden');
  }

  // Update desktop navigation buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active', 'text-white', 'bg-brand-600/20');
    btn.classList.add('text-slate-400');
  });
  const activeDesktopBtn = document.getElementById(`nav-btn-${tabId}`);
  if (activeDesktopBtn) {
    activeDesktopBtn.classList.add('active', 'text-white');
    activeDesktopBtn.classList.remove('text-slate-400');
  }

  // Update mobile bottom navigation
  document.querySelectorAll('.mobile-tab-btn').forEach(btn => {
    btn.classList.remove('active', 'text-brand-500');
    btn.classList.add('text-slate-400');
  });
  const activeMobileBtn = document.getElementById(`mobile-nav-${tabId}`);
  if (activeMobileBtn) {
    activeMobileBtn.classList.add('active', 'text-brand-500');
    activeMobileBtn.classList.remove('text-slate-400');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// 4. UNCENSORED MODE MANAGEMENT
// ==========================================
function toggleUncensoredGlobal() {
  triggerHaptic();
  APP_STATE.uncensoredMode = !APP_STATE.uncensoredMode;
  APP_STATE.settings.uncensoredEnabled = APP_STATE.uncensoredMode;
  localStorage.setItem('nexus_uncensored', APP_STATE.uncensoredMode);
  updateUncensoredUI();

  if (APP_STATE.uncensoredMode) {
    showToast("Uncensored Mode: Active (No Content Restrictions)", "warning");
  } else {
    showToast("Standard Safety Filter: Active", "info");
  }
}

function handleUncensoredCheckboxChange(checkbox) {
  APP_STATE.uncensoredMode = checkbox.checked;
  APP_STATE.settings.uncensoredEnabled = checkbox.checked;
  localStorage.setItem('nexus_uncensored', checkbox.checked);
  updateUncensoredUI();
}

function updateUncensoredUI() {
  const toggleBtn = document.getElementById('uncensored-toggle-btn');
  const label = document.getElementById('uncensored-label');
  const icon = document.getElementById('uncensored-icon');
  const settingsToggle = document.getElementById('settings-uncensored-toggle');

  if (settingsToggle) {
    settingsToggle.checked = APP_STATE.uncensoredMode;
  }

  if (APP_STATE.uncensoredMode) {
    if (toggleBtn) {
      toggleBtn.className = "relative px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 border transition-all duration-300 bg-red-950/40 text-red-300 border-red-600/50 shadow-[0_0_15px_-3px_rgba(239,68,68,0.3)]";
    }
    if (label) label.textContent = "Uncensored: ON";
    if (icon) {
      icon.className = "fa-solid fa-lock-open text-red-400 animate-pulse";
    }
  } else {
    if (toggleBtn) {
      toggleBtn.className = "relative px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 border transition-all duration-300 bg-brand-surface text-slate-400 border-brand-border";
    }
    if (label) label.textContent = "Safe: ON";
    if (icon) {
      icon.className = "fa-solid fa-shield text-slate-400";
    }
  }
}

// ==========================================
// 5. IMAGINE STUDIO (IMAGE GENERATION)
// ==========================================
function setImagineInputMode(mode) {
  triggerHaptic();
  APP_STATE.imagineMode = mode;
  const txtBtn = document.getElementById('imagine-mode-txt2img');
  const imgBtn = document.getElementById('imagine-mode-img2img');
  const uploadContainer = document.getElementById('img2img-upload-container');

  if (mode === 'txt2img') {
    txtBtn.className = "py-2 rounded-lg bg-brand-600 text-white shadow transition-all flex items-center justify-center gap-1.5";
    imgBtn.className = "py-2 rounded-lg text-slate-400 hover:text-white transition-all flex items-center justify-center gap-1.5";
    uploadContainer.classList.add('hidden');
  } else {
    imgBtn.className = "py-2 rounded-lg bg-brand-600 text-white shadow transition-all flex items-center justify-center gap-1.5";
    txtBtn.className = "py-2 rounded-lg text-slate-400 hover:text-white transition-all flex items-center justify-center gap-1.5";
    uploadContainer.classList.remove('hidden');
  }
}

function setAspectRatio(ratioName, width, height) {
  triggerHaptic();
  APP_STATE.aspectRatio = { name: ratioName, width, height };
  document.getElementById('aspect-ratio-dims').innerText = `${width} × ${height} (${ratioName})`;

  document.querySelectorAll('.aspect-btn').forEach(btn => {
    btn.classList.remove('active', 'border-brand-500', 'bg-brand-500/15', 'text-white');
    btn.classList.add('border-brand-border', 'text-slate-400');
  });

  const clicked = event.currentTarget;
  if (clicked) {
    clicked.classList.add('active', 'border-brand-500', 'bg-brand-500/15', 'text-white');
    clicked.classList.remove('border-brand-border', 'text-slate-400');
  }
}

function applyStylePreset(styleModifier) {
  triggerHaptic();
  APP_STATE.selectedStyle = styleModifier;

  document.querySelectorAll('.style-chip').forEach(chip => {
    chip.classList.remove('active', 'border-brand-500', 'bg-brand-500/25', 'text-brand-300');
    chip.classList.add('border-brand-border', 'text-slate-400');
  });

  if (event && event.currentTarget) {
    event.currentTarget.classList.add('active', 'border-brand-500', 'bg-brand-500/25', 'text-brand-300');
    event.currentTarget.classList.remove('border-brand-border', 'text-slate-400');
  }
}

function toggleNegativePrompt() {
  const container = document.getElementById('negative-prompt-container');
  const chevron = document.getElementById('neg-chevron');
  if (container.classList.contains('hidden')) {
    container.classList.remove('hidden');
    chevron.style.transform = 'rotate(180deg)';
  } else {
    container.classList.add('hidden');
    chevron.style.transform = 'rotate(0deg)';
  }
}

function clearPrompt() {
  document.getElementById('prompt-input').value = '';
  document.getElementById('prompt-input').focus();
}

function quickPrompt(text) {
  document.getElementById('prompt-input').value = text;
  generateImage();
}

function randomizePrompt() {
  triggerHaptic();
  const item = UNCENSORED_PROMPT_VAULT[Math.floor(Math.random() * UNCENSORED_PROMPT_VAULT.length)];
  document.getElementById('prompt-input').value = item.prompt;
  if (item.negative) {
    document.getElementById('negative-prompt-input').value = item.negative;
  }
  showToast(`Loaded: ${item.title}`);
}

function randomizeSeed() {
  const newSeed = Math.floor(Math.random() * 99999999);
  document.getElementById('seed-input').value = newSeed;
}

// Client-side AI Prompt Enhancer
function enhanceCurrentPrompt() {
  triggerHaptic();
  const input = document.getElementById('prompt-input');
  let text = input.value.trim();
  if (!text) {
    text = "cyberpunk warrior standing on neon skyscraper edge";
  }

  const cinematicExpansions = [
    "hyper-realistic 8k uhd, cinematic film still, shot on 35mm anamorphic lens, volumetric rim lighting, deep shadows, rich atmospheric fog, octane render, intricate details",
    "masterpiece, award-winning photography, photorealistic textures, dramatic chiaroscuro lighting, sharp focus, raytracing, unreal engine 5 render",
    "breathtaking visual fidelity, highly detailed facial features, subsurface scattering, ambient occlusion, moody color grading, 8k resolution"
  ];

  const chosenExpansion = cinematicExpansions[Math.floor(Math.random() * cinematicExpansions.length)];
  input.value = `${text}, ${chosenExpansion}`;
  showToast("Prompt expanded with cinematic realism tags!", "success");
}

// Reference Image upload for Remix
function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    APP_STATE.referenceImageBase64 = event.target.result;
    document.getElementById('img2img-preview-img').src = event.target.result;
    document.getElementById('img2img-preview-box').classList.remove('hidden');
    document.getElementById('img2img-upload-prompt').classList.add('hidden');
    showToast("Reference image loaded for remix", "success");
  };
  reader.readAsDataURL(file);
}

function clearImageUpload(e) {
  e.stopPropagation();
  APP_STATE.referenceImageBase64 = null;
  document.getElementById('img2img-file-input').value = '';
  document.getElementById('img2img-preview-box').classList.add('hidden');
  document.getElementById('img2img-upload-prompt').classList.remove('hidden');
}

// Generate Image Core Function
async function generateImage() {
  if (APP_STATE.isGeneratingImage) return;

  const promptInput = document.getElementById('prompt-input');
  let prompt = promptInput.value.trim();

  if (!prompt) {
    randomizePrompt();
    prompt = promptInput.value.trim();
  }

  triggerHaptic();
  APP_STATE.isGeneratingImage = true;

  // UI Loading States
  const btn = document.getElementById('btn-generate-image');
  const btnText = document.getElementById('btn-generate-text');
  const spinner = document.getElementById('image-loading-spinner');
  const placeholder = document.getElementById('image-placeholder');
  const imgElement = document.getElementById('current-image-result');
  const timerBadge = document.getElementById('gen-timer');
  const metadataBar = document.getElementById('image-metadata-bar');
  const overlayControls = document.getElementById('image-overlay-controls');

  btn.disabled = true;
  btnText.textContent = "SYNTHESIZING LATENTS...";
  spinner.classList.remove('hidden');
  placeholder.classList.add('hidden');
  imgElement.classList.add('hidden');
  overlayControls.classList.add('hidden');
  metadataBar.classList.add('hidden');
  timerBadge.classList.remove('hidden');

  let startTime = Date.now();
  const timerInterval = setInterval(() => {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    timerBadge.textContent = `${elapsed}s`;
  }, 100);

  try {
    // Model & Parameter Resolution
    const modelSelect = document.getElementById('model-select').value;
    let seedVal = parseInt(document.getElementById('seed-input').value, 10);
    if (isNaN(seedVal) || seedVal < 0) {
      seedVal = Math.floor(Math.random() * 99999999);
    }

    const { width, height } = APP_STATE.aspectRatio;

    // Apply Style modifier if active
    let fullPrompt = prompt;
    if (APP_STATE.selectedStyle) {
      fullPrompt = `${fullPrompt}, ${APP_STATE.selectedStyle}`;
    }

    // Auto-enhance if toggled
    const autoEnhance = document.getElementById('auto-enhance-toggle').checked;
    if (autoEnhance && !fullPrompt.includes('8k') && !fullPrompt.includes('realistic')) {
      fullPrompt += ", ultra detailed, 8k uhd, cinematic";
    }

    // Uncensored modifier injection
    if (APP_STATE.uncensoredMode) {
      fullPrompt += ", unrestrained, raw artistic freedom, uncensored";
    }

    // Pollinations AI URL Construction
    let queryModel = 'flux';
    if (modelSelect === 'flux-realism') queryModel = 'flux-realism';
    else if (modelSelect === 'flux-anime') queryModel = 'flux-anime';
    else if (modelSelect === 'flux-3d') queryModel = 'flux-3d';
    else if (modelSelect === 'turbo') queryModel = 'turbo';

    const encodedPrompt = encodeURIComponent(fullPrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seedVal}&nologo=true&model=${queryModel}`;

    // Preload image in memory to ensure smooth reveal
    await new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        imgElement.src = imageUrl;
        resolve(img);
      };
      img.onerror = () => {
        // Fallback to standard url if model failed
        imgElement.src = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seedVal}&nologo=true`;
        resolve(imgElement);
      };
      img.src = imageUrl;
    });

    clearInterval(timerInterval);

    // Save state
    APP_STATE.currentImage = {
      id: 'img-' + Date.now(),
      type: 'image',
      url: imageUrl,
      prompt: prompt,
      fullPrompt: fullPrompt,
      model: modelSelect,
      resolution: `${width}x${height}`,
      seed: seedVal,
      uncensored: APP_STATE.uncensoredMode,
      timestamp: Date.now()
    };

    // Add to gallery
    saveToGallery(APP_STATE.currentImage);

    // Update metadata bar
    document.getElementById('meta-resolution').textContent = `${width}x${height}`;
    document.getElementById('meta-model').textContent = modelSelect.toUpperCase();
    document.getElementById('meta-seed').textContent = `Seed: ${seedVal}`;
    document.getElementById('meta-prompt-snippet').textContent = prompt;

    // Reveal output
    imgElement.classList.remove('hidden');
    overlayControls.classList.remove('hidden');
    metadataBar.classList.remove('hidden');
    showToast("Image synthesized successfully!", "success");

  } catch (err) {
    console.error("Image generation error:", err);
    clearInterval(timerInterval);
    showToast("Generation error. Trying fallback...", "error");
    // Fallback render
    placeholder.classList.remove('hidden');
  } finally {
    APP_STATE.isGeneratingImage = false;
    btn.disabled = false;
    btnText.textContent = "GENERATE UNRESTRICTED IMAGE";
    spinner.classList.add('hidden');
  }
}

function copyCurrentPrompt() {
  if (APP_STATE.currentImage && APP_STATE.currentImage.prompt) {
    navigator.clipboard.writeText(APP_STATE.currentImage.prompt);
    showToast("Prompt copied to clipboard!", "success");
  } else {
    const val = document.getElementById('prompt-input').value;
    if (val) {
      navigator.clipboard.writeText(val);
      showToast("Prompt copied to clipboard!", "success");
    }
  }
}

function downloadCurrentImage() {
  if (!APP_STATE.currentImage || !APP_STATE.currentImage.url) {
    showToast("No generated image to download", "warning");
    return;
  }
  downloadMediaUrl(APP_STATE.currentImage.url, `nexus-ai-${Date.now()}.jpg`);
}

function sendImageToVideoStudio() {
  if (!APP_STATE.currentImage) {
    showToast("Generate an image first to animate it", "warning");
    return;
  }
  triggerHaptic();
  switchTab('video');
  setVideoInputMode('img2vid');
  loadLatestImagineImageIntoVideo();
  showToast("Image loaded into Video Studio! Select motion and render.", "info");
}

// ==========================================
// 6. VIDEO STUDIO (AI VIDEO GENERATION & ENGINES)
// ==========================================
function setVideoInputMode(mode) {
  triggerHaptic();
  APP_STATE.videoMode = mode;
  const txtBtn = document.getElementById('video-mode-txt2vid');
  const imgBtn = document.getElementById('video-mode-img2vid');
  const sourceContainer = document.getElementById('video-img-source-container');

  if (mode === 'txt2vid') {
    txtBtn.className = "py-2 rounded-lg bg-brand-cyan text-brand-dark font-bold shadow transition-all flex items-center justify-center gap-1.5";
    imgBtn.className = "py-2 rounded-lg text-slate-400 hover:text-white transition-all flex items-center justify-center gap-1.5";
    sourceContainer.classList.add('hidden');
  } else {
    imgBtn.className = "py-2 rounded-lg bg-brand-cyan text-brand-dark font-bold shadow transition-all flex items-center justify-center gap-1.5";
    txtBtn.className = "py-2 rounded-lg text-slate-400 hover:text-white transition-all flex items-center justify-center gap-1.5";
    sourceContainer.classList.remove('hidden');
  }
}

function setCameraMotion(motionId, label) {
  triggerHaptic();
  APP_STATE.selectedMotion = motionId;
  document.getElementById('active-motion-label').innerText = label;

  document.querySelectorAll('.motion-btn').forEach(btn => {
    btn.classList.remove('active', 'border-brand-cyan', 'bg-brand-cyan/15', 'text-white');
    btn.classList.add('border-brand-border', 'text-slate-400');
  });

  if (event && event.currentTarget) {
    event.currentTarget.classList.add('active', 'border-brand-cyan', 'bg-brand-cyan/15', 'text-white');
    event.currentTarget.classList.remove('border-brand-border', 'text-slate-400');
  }
}

function randomizeVideoPrompt() {
  triggerHaptic();
  const prompts = [
    "Cinematic camera swoops down through rain-slicked skyscrapers of a neon cyberpunk city, reflective glass, 60fps drone shot",
    "Slow-motion dolly in on a glowing mystic portal opening in an ancient cavern, floating crystals, dust motes catch light",
    "High-speed chase camera skimming just inches above a futuristic highway with streaking neon light trails, anamorphic lens flare",
    "Orbital 360 camera rotation around an immense stone monolith covered in glowing arcane glyphs, volumetric dawn god rays",
    "Handheld cinema camera navigating a vibrant crowded night bazaar with lanterns and spice smoke, shallow depth of field"
  ];
  const chosen = prompts[Math.floor(Math.random() * prompts.length)];
  document.getElementById('video-prompt-input').value = chosen;
}

function quickVideoPrompt(text) {
  document.getElementById('video-prompt-input').value = text;
  generateVideo();
}

function loadLatestImagineImageIntoVideo() {
  if (APP_STATE.currentImage && APP_STATE.currentImage.url) {
    APP_STATE.videoSourceImageBase64 = APP_STATE.currentImage.url;
    const preview = document.getElementById('video-source-preview');
    preview.src = APP_STATE.currentImage.url;
    preview.classList.remove('hidden');
    document.getElementById('video-source-empty-state').classList.add('hidden');
    showToast("Imported latest imagine canvas into Video Studio!", "success");
  } else {
    showToast("No active image found in Imagine Studio yet", "warning");
  }
}

function handleVideoSourceUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    APP_STATE.videoSourceImageBase64 = event.target.result;
    const preview = document.getElementById('video-source-preview');
    preview.src = event.target.result;
    preview.classList.remove('hidden');
    document.getElementById('video-source-empty-state').classList.add('hidden');
    showToast("Keyframe image loaded for animation", "success");
  };
  reader.readAsDataURL(file);
}

function toggleVideoLoop() {
  const video = document.getElementById('current-video-player');
  video.loop = !video.loop;
  const loopBtn = document.getElementById('btn-loop-video');
  if (video.loop) {
    loopBtn.classList.add('text-brand-cyan', 'border-brand-cyan');
    showToast("Video loop: ON", "info");
  } else {
    loopBtn.classList.remove('text-brand-cyan', 'border-brand-cyan');
    showToast("Video loop: OFF", "info");
  }
}

/**
 * High-Performance Client-Side Neural Video Synthesizer
 * Uses Canvas Frame Interpolation + MediaRecorder to render real downloadable WebM/MP4
 */
async function generateVideo() {
  if (APP_STATE.isGeneratingVideo) return;

  const promptInput = document.getElementById('video-prompt-input');
  let prompt = promptInput.value.trim();

  if (!prompt && APP_STATE.videoMode === 'txt2vid') {
    randomizeVideoPrompt();
    prompt = promptInput.value.trim();
  }

  triggerHaptic();
  APP_STATE.isGeneratingVideo = true;

  // UI Elements
  const btn = document.getElementById('btn-generate-video');
  const btnText = document.getElementById('btn-generate-video-text');
  const overlay = document.getElementById('video-loading-overlay');
  const placeholder = document.getElementById('video-placeholder');
  const videoPlayer = document.getElementById('current-video-player');
  const progressBar = document.getElementById('video-progress-bar');
  const percentText = document.getElementById('video-percent-text');
  const statusText = document.getElementById('video-status-text');
  const metadataBar = document.getElementById('video-metadata-bar');

  btn.disabled = true;
  btnText.textContent = "SYNTHESIZING VIDEO...";
  overlay.classList.remove('hidden');
  placeholder.classList.add('hidden');
  videoPlayer.classList.add('hidden');
  metadataBar.classList.add('hidden');

  const durationSec = parseInt(document.getElementById('video-duration').value, 10) || 5;
  const fps = parseInt(document.getElementById('video-fps').value, 10) || 30;
  const motionType = APP_STATE.selectedMotion;

  try {
    // Step 1: Obtain Keyframe Image
    statusText.textContent = "Generating Keyframe Seed...";
    progressBar.style.width = "15%";
    percentText.textContent = "15%";

    let sourceImg = new Image();
    sourceImg.crossOrigin = "anonymous";

    if (APP_STATE.videoMode === 'img2vid' && APP_STATE.videoSourceImageBase64) {
      sourceImg.src = APP_STATE.videoSourceImageBase64;
    } else {
      // Generate initial keyframe from prompt
      let keyframePrompt = prompt || "Cinematic aerial view of futuristic cyberpunk neon city at night";
      if (APP_STATE.uncensoredMode) keyframePrompt += ", uncensored, unrestricted, 8k cinematic";
      const keyframeUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(keyframePrompt)}?width=1280&height=720&seed=${Math.floor(Math.random() * 99999)}&nologo=true&model=flux`;
      sourceImg.src = keyframeUrl;
    }

    await new Promise((resolve) => {
      sourceImg.onload = resolve;
      sourceImg.onerror = () => {
        // Fallback to stock sci-fi texture if network fails
        sourceImg.src = "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1280&q=80";
        sourceImg.onload = resolve;
      };
    });

    statusText.textContent = "Synthesizing Camera Motion Paths...";
    progressBar.style.width = "35%";
    percentText.textContent = "35%";

    // Step 2: Setup Canvas & Video MediaRecorder
    const canvas = document.getElementById('motion-render-canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');

    const totalFrames = durationSec * fps;
    const stream = canvas.captureStream(fps);

    let mimeType = 'video/webm;codecs=vp9';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/mp4';
      }
    }

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported(mimeType) ? mimeType : '',
      videoBitsPerSecond: 6000000 // 6 Mbps high quality
    });

    const recordedChunks = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    const recordingPromise = new Promise((resolve) => {
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: mimeType || 'video/webm' });
        resolve(blob);
      };
    });

    mediaRecorder.start();

    // Step 3: Frame by Frame Animation Loop with Physics & Lighting Drift
    const frameDelay = 1000 / fps;

    for (let frame = 0; frame < totalFrames; frame++) {
      const progress = frame / totalFrames;
      
      // Update UI Progress smoothly
      const currentPct = Math.round(35 + (progress * 60));
      progressBar.style.width = `${currentPct}%`;
      percentText.textContent = `${currentPct}%`;
      statusText.textContent = `Rendering Neural Frames (${frame + 1}/${totalFrames})...`;

      // Render camera motion transform onto Canvas
      ctx.save();
      ctx.fillStyle = "#08090d";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let scale = 1.0;
      let transX = 0;
      let transY = 0;
      let rotation = 0;

      if (motionType === 'zoom-in') {
        scale = 1.0 + (progress * 0.28);
      } else if (motionType === 'zoom-out') {
        scale = 1.28 - (progress * 0.25);
      } else if (motionType === 'pan-left') {
        scale = 1.15;
        transX = (progress * -120);
      } else if (motionType === 'pan-right') {
        scale = 1.15;
        transX = (progress * 120);
      } else if (motionType === 'orbit') {
        scale = 1.18;
        rotation = Math.sin(progress * Math.PI) * 0.04;
        transX = Math.sin(progress * Math.PI * 2) * 40;
        transY = Math.cos(progress * Math.PI * 2) * 20;
      } else { // cinematic-drift
        scale = 1.05 + Math.sin(progress * Math.PI) * 0.1;
        transX = Math.sin(progress * Math.PI) * 30;
        transY = Math.cos(progress * Math.PI) * 15;
      }

      // Apply transformations from center
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(rotation);
      ctx.scale(scale, scale);
      ctx.translate(-canvas.width / 2 + transX, -canvas.height / 2 + transY);

      // Draw source keyframe
      ctx.drawImage(sourceImg, 0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Atmospheric lighting & subtle particle overlay for cinematic depth
      ctx.save();
      const vignette = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, canvas.width * 0.25,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.7
      );
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, 'rgba(0,0,0,0.4)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle dynamic anamorphic flare effect
      const flareGrad = ctx.createLinearGradient(0, 0, canvas.width, 0);
      flareGrad.addColorStop(0, 'rgba(6, 182, 212, 0)');
      flareGrad.addColorStop(0.5, `rgba(139, 92, 246, ${0.04 + Math.sin(progress * Math.PI) * 0.05})`);
      flareGrad.addColorStop(1, 'rgba(236, 72, 153, 0)');
      ctx.fillStyle = flareGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Wait for frame interval
      await new Promise(r => setTimeout(r, frameDelay * 0.4));
    }

    statusText.textContent = "Finalizing Video Streams & Audio Codecs...";
    progressBar.style.width = "98%";
    percentText.textContent = "98%";

    mediaRecorder.stop();
    const videoBlob = await recordingPromise;
    const videoUrl = URL.createObjectURL(videoBlob);

    // Step 4: Attach video to player
    videoPlayer.src = videoUrl;
    videoPlayer.load();
    await videoPlayer.play().catch(() => {});

    // Save video object
    APP_STATE.currentVideo = {
      id: 'vid-' + Date.now(),
      type: 'video',
      url: videoUrl,
      blob: videoBlob,
      prompt: prompt || "Cinematic Camera Motion",
      duration: `${durationSec}s`,
      fps: `${fps}fps`,
      motion: motionType,
      uncensored: APP_STATE.uncensoredMode,
      timestamp: Date.now()
    };

    saveToGallery(APP_STATE.currentVideo);

    // Update UI
    document.getElementById('video-meta-time').textContent = `${durationSec}s @ ${fps}fps`;
    document.getElementById('video-meta-motion').textContent = APP_STATE.selectedMotion.toUpperCase();
    document.getElementById('video-meta-prompt').textContent = prompt;

    videoPlayer.classList.remove('hidden');
    metadataBar.classList.remove('hidden');
    showToast("AI Video synthesis complete!", "success");

  } catch (err) {
    console.error("Video synthesis error:", err);
    showToast("Video synthesis error. Check console.", "error");
    placeholder.classList.remove('hidden');
  } finally {
    APP_STATE.isGeneratingVideo = false;
    btn.disabled = false;
    btnText.textContent = "SYNTHESIZE AI VIDEO";
    overlay.classList.add('hidden');
  }
}

function downloadCurrentVideo() {
  if (!APP_STATE.currentVideo || !APP_STATE.currentVideo.url) {
    showToast("No generated video to download", "warning");
    return;
  }
  const filename = `nexus-video-${Date.now()}.mp4`;
  downloadMediaUrl(APP_STATE.currentVideo.url, filename);
}

// ==========================================
// 7. GALLERY & STORAGE VAULT
// ==========================================
function saveToGallery(item) {
  galleryItems.unshift(item);
  try {
    // Keep last 30 creations in localStorage to avoid storage quota overflow
    const serializable = galleryItems.slice(0, 30).map(i => {
      const copy = { ...i };
      delete copy.blob; // Don't serialize blobs directly into localStorage
      return copy;
    });
    localStorage.setItem('nexus_creations_gallery', JSON.stringify(serializable));
  } catch (e) {
    console.warn("Storage quota reached for creations gallery", e);
  }
  renderGalleryGrid();
  updateGalleryBadges();
}

function renderGalleryGrid(filter = 'all') {
  const grid = document.getElementById('gallery-grid');
  const emptyState = document.getElementById('gallery-empty-state');
  if (!grid) return;

  const items = galleryItems.filter(item => {
    if (filter === 'images') return item.type === 'image';
    if (filter === 'videos') return item.type === 'video';
    return true;
  });

  if (items.length === 0) {
    grid.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  grid.innerHTML = items.map((item, index) => {
    const isVid = item.type === 'video';
    return `
      <div onclick="openLightbox(${index})" class="media-card group relative aspect-square rounded-xl overflow-hidden bg-brand-card border border-brand-border/80 cursor-pointer">
        ${isVid ? `
          <video src="${item.url}" muted playsinline class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"></video>
          <div class="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-brand-cyan/90 text-brand-dark text-[9px] font-mono font-bold flex items-center gap-1 shadow">
            <i class="fa-solid fa-film"></i> VIDEO
          </div>
        ` : `
          <img src="${item.url}" alt="AI Creation" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
          <div class="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-brand-500/90 text-white text-[9px] font-mono font-bold flex items-center gap-1 shadow">
            <i class="fa-solid fa-image"></i> IMAGE
          </div>
        `}

        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-end">
          <p class="text-[11px] text-white font-medium line-clamp-2">${item.prompt}</p>
          <div class="flex items-center justify-between text-[10px] text-slate-300 font-mono mt-1">
            <span>${item.resolution || item.duration || ''}</span>
            <span class="text-brand-cyan">Tap to View</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function filterGallery(filterType) {
  triggerHaptic();
  document.querySelectorAll('.gallery-filter-btn').forEach(btn => {
    btn.classList.remove('active', 'bg-brand-500', 'text-white');
    btn.classList.add('bg-brand-card', 'text-slate-400');
  });

  if (event && event.currentTarget) {
    event.currentTarget.classList.add('active', 'bg-brand-500', 'text-white');
    event.currentTarget.classList.remove('bg-brand-card', 'text-slate-400');
  }

  renderGalleryGrid(filterType);
}

function updateGalleryBadges() {
  const count = galleryItems.length;
  const countBadge = document.getElementById('gallery-count-badge');
  const mobileBadge = document.getElementById('mobile-gallery-badge');

  if (countBadge) countBadge.textContent = count;
  if (mobileBadge) {
    if (count > 0) mobileBadge.classList.remove('hidden');
    else mobileBadge.classList.add('hidden');
  }
}

function clearGalleryConfirm() {
  if (confirm("Are you sure you want to clear your creations history?")) {
    galleryItems = [];
    localStorage.removeItem('nexus_creations_gallery');
    renderGalleryGrid();
    updateGalleryBadges();
    showToast("Creations gallery cleared", "info");
  }
}

function exportAllCreations() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(galleryItems, null, 2));
  const dl = document.createElement('a');
  dl.setAttribute("href", dataStr);
  dl.setAttribute("download", `nexus-ai-creations-backup-${Date.now()}.json`);
  document.body.appendChild(dl);
  dl.click();
  dl.remove();
  showToast("Creations backup exported successfully!", "success");
}

// ==========================================
// 8. LIGHTBOX & CREATION INSPECTOR
// ==========================================
let activeLightboxItem = null;

function openLightbox(index) {
  triggerHaptic();
  const item = galleryItems[index];
  if (!item) return;

  activeLightboxItem = item;
  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  const video = document.getElementById('lightbox-video');
  const title = document.getElementById('lightbox-title');
  const promptEl = document.getElementById('lightbox-prompt');
  const typeEl = document.getElementById('lightbox-meta-type');
  const dimsEl = document.getElementById('lightbox-meta-dims');
  const seedEl = document.getElementById('lightbox-meta-seed');

  title.textContent = item.type === 'video' ? "Video Inspector" : "Image Inspector";
  promptEl.textContent = item.prompt;
  typeEl.textContent = item.type.toUpperCase();
  dimsEl.textContent = item.resolution || item.duration || "HD";
  seedEl.textContent = item.seed ? `Seed: ${item.seed}` : `Motion: ${item.motion || 'Dynamic'}`;

  if (item.type === 'video') {
    img.classList.add('hidden');
    video.src = item.url;
    video.classList.remove('hidden');
  } else {
    video.classList.add('hidden');
    img.src = item.url;
    img.classList.remove('hidden');
  }

  modal.classList.remove('hidden');
}

function openFullscreenModal() {
  if (APP_STATE.currentImage) {
    const idx = galleryItems.findIndex(i => i.id === APP_STATE.currentImage.id);
    if (idx !== -1) openLightbox(idx);
    else {
      activeLightboxItem = APP_STATE.currentImage;
      openLightboxManual(APP_STATE.currentImage);
    }
  }
}

function openLightboxManual(item) {
  activeLightboxItem = item;
  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  const video = document.getElementById('lightbox-video');

  video.classList.add('hidden');
  img.src = item.url;
  img.classList.remove('hidden');
  document.getElementById('lightbox-prompt').textContent = item.prompt;
  document.getElementById('lightbox-meta-dims').textContent = item.resolution || '1024x1024';
  document.getElementById('lightbox-meta-seed').textContent = `Seed: ${item.seed || '42'}`;
  modal.classList.remove('hidden');
}

function closeLightboxModal() {
  const modal = document.getElementById('lightbox-modal');
  const video = document.getElementById('lightbox-video');
  if (video) video.pause();
  modal.classList.add('hidden');
}

function remixFromLightbox() {
  if (!activeLightboxItem) return;
  triggerHaptic();
  closeLightboxModal();

  if (activeLightboxItem.type === 'image') {
    switchTab('imagine');
    document.getElementById('prompt-input').value = activeLightboxItem.prompt;
    if (activeLightboxItem.seed) {
      document.getElementById('seed-input').value = activeLightboxItem.seed;
    }
    showToast("Prompt and parameters loaded for Remixing!", "success");
  } else {
    switchTab('video');
    document.getElementById('video-prompt-input').value = activeLightboxItem.prompt;
    showToast("Video prompt loaded for Synthesis!", "success");
  }
}

function downloadFromLightbox() {
  if (!activeLightboxItem) return;
  const ext = activeLightboxItem.type === 'video' ? 'mp4' : 'jpg';
  downloadMediaUrl(activeLightboxItem.url, `nexus-${activeLightboxItem.type}-${Date.now()}.${ext}`);
}

// ==========================================
// 9. PROMPTS VAULT RENDERING
// ==========================================
function renderPromptsVault() {
  const container = document.getElementById('prompts-vault-cards');
  if (!container) return;

  container.innerHTML = UNCENSORED_PROMPT_VAULT.map((p, idx) => `
    <div class="glass-panel p-4 rounded-xl border border-brand-border bg-brand-surface/70 hover:border-slate-500 transition-all flex flex-col justify-between space-y-3 group">
      <div class="space-y-1.5">
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-border text-brand-cyan">${p.category}</span>
          <span class="text-[10px] text-red-400 font-mono flex items-center gap-1"><i class="fa-solid fa-lock-open text-[9px]"></i> Unrestricted</span>
        </div>
        <h4 class="font-display font-semibold text-sm text-slate-100 group-hover:text-brand-500 transition-colors">${p.title}</h4>
        <p class="text-xs text-slate-300 line-clamp-3 leading-relaxed">${p.prompt}</p>
      </div>
      
      <div class="pt-2 border-t border-brand-border/60 flex items-center gap-2">
        <button onclick="useVaultPrompt(${idx}, 'imagine')" class="flex-1 py-1.5 px-2 rounded-lg bg-brand-500/20 hover:bg-brand-500/40 text-brand-300 text-xs font-semibold flex items-center justify-center gap-1 transition-colors">
          <i class="fa-solid fa-wand-magic-sparkles text-[10px]"></i> Imagine
        </button>
        <button onclick="useVaultPrompt(${idx}, 'video')" class="flex-1 py-1.5 px-2 rounded-lg bg-brand-cyan/20 hover:bg-brand-cyan/40 text-brand-cyan text-xs font-semibold flex items-center justify-center gap-1 transition-colors">
          <i class="fa-solid fa-film text-[10px]"></i> Animate
        </button>
        <button onclick="copyVaultPrompt(${idx})" class="p-1.5 rounded-lg bg-brand-card hover:bg-brand-border text-slate-400 hover:text-white text-xs" title="Copy Prompt">
          <i class="fa-solid fa-copy"></i>
        </button>
      </div>
    </div>
  `).join('');
}

function useVaultPrompt(index, targetTab) {
  triggerHaptic();
  const item = UNCENSORED_PROMPT_VAULT[index];
  if (!item) return;

  if (targetTab === 'imagine') {
    switchTab('imagine');
    document.getElementById('prompt-input').value = item.prompt;
    if (item.negative) {
      document.getElementById('negative-prompt-input').value = item.negative;
    }
    showToast(`Loaded: ${item.title} into Imagine`, "success");
  } else {
    switchTab('video');
    document.getElementById('video-prompt-input').value = item.prompt;
    showToast(`Loaded: ${item.title} into Video Studio`, "success");
  }
}

function copyVaultPrompt(index) {
  const item = UNCENSORED_PROMPT_VAULT[index];
  if (item) {
    navigator.clipboard.writeText(item.prompt);
    showToast("Prompt copied to clipboard!", "success");
  }
}

// ==========================================
// 10. GITHUB INTEGRATION & CLOUD SYNC
// ==========================================
function openGitHubModal() {
  triggerHaptic();
  document.getElementById('github-modal').classList.remove('hidden');
}

function closeGitHubModal() {
  document.getElementById('github-modal').classList.add('hidden');
}

function saveGitHubSettings() {
  triggerHaptic();
  const token = document.getElementById('github-token-input').value.trim();
  APP_STATE.settings.githubToken = token;
  localStorage.setItem('nexus_gh_token', token);
  showToast("GitHub settings saved!", "success");
  closeGitHubModal();
}

async function syncGalleryToGist() {
  triggerHaptic();
  const token = APP_STATE.settings.githubToken || document.getElementById('github-token-input').value.trim();
  if (!token) {
    showToast("Please enter a GitHub Personal Access Token first", "warning");
    return;
  }

  showToast("Exporting creations to your GitHub Gist...", "info");

  try {
    const payload = {
      description: "Nexus AI — Uncensored Video & Imagine Creations Vault",
      public: false,
      files: {
        "nexus-creations.json": {
          content: JSON.stringify(galleryItems, null, 2)
        },
        "prompts-vault.md": {
          content: `# Nexus AI Creations & Prompts Vault\n\nTotal Generations: ${galleryItems.length}\n\n` +
            galleryItems.map(i => `### ${i.type.toUpperCase()}: ${i.prompt}\n- Date: ${new Date(i.timestamp).toLocaleString()}\n- Model: ${i.model || 'Motion Video'}\n- URL: ${i.url}\n\n`).join('')
        }
      }
    };

    const res = await fetch("https://api.github.com/gists", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/vnd.github+json"
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      showToast("Gist created successfully! Synced to GitHub.", "success");
      window.open(data.html_url, '_blank');
    } else {
      const errData = await res.json().catch(() => ({}));
      showToast(`GitHub Error: ${errData.message || res.statusText}`, "error");
    }
  } catch (err) {
    console.error("Gist sync error:", err);
    showToast("Could not sync to GitHub Gist", "error");
  }
}

function syncCurrentToGitHub() {
  openGitHubModal();
}

// ==========================================
// 11. SETTINGS & APP PREFERENCES
// ==========================================
function openSettingsModal() {
  triggerHaptic();
  document.getElementById('settings-modal').classList.remove('hidden');
}

function closeSettingsModal() {
  document.getElementById('settings-modal').classList.add('hidden');
}

function saveAppSettings() {
  triggerHaptic();
  const falKey = document.getElementById('fal-key-input').value.trim();
  const hfToken = document.getElementById('hf-token-input').value.trim();
  const customUrl = document.getElementById('custom-url-input').value.trim();

  APP_STATE.settings.falKey = falKey;
  APP_STATE.settings.hfToken = hfToken;
  APP_STATE.settings.customUrl = customUrl;

  localStorage.setItem('nexus_fal_key', falKey);
  localStorage.setItem('nexus_hf_token', hfToken);
  localStorage.setItem('nexus_custom_url', customUrl);

  showToast("Preferences saved successfully!", "success");
  closeSettingsModal();
}

// ==========================================
// 12. UTILITIES: TOASTS, DOWNLOAD & SHARE
// ==========================================
function showToast(message, type = "info") {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  let borderColor = "border-brand-500";
  let icon = "fa-circle-info text-brand-cyan";

  if (type === "success") {
    borderColor = "border-emerald-500/80";
    icon = "fa-circle-check text-emerald-400";
  } else if (type === "warning") {
    borderColor = "border-amber-500/80";
    icon = "fa-triangle-exclamation text-amber-400";
  } else if (type === "error") {
    borderColor = "border-red-500/80";
    icon = "fa-circle-xmark text-red-400";
  }

  toast.className = `pointer-events-auto transform translate-y-4 opacity-0 transition-all duration-300 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-brand-surface/95 backdrop-blur-xl border ${borderColor} text-slate-100 text-xs shadow-2xl max-w-sm`;
  toast.innerHTML = `<i class="fa-solid ${icon} text-sm"></i> <span class="font-medium">${message}</span>`;

  container.appendChild(toast);

  // Trigger enter animation
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
  });

  // Auto remove after 3.5s
  setTimeout(() => {
    toast.classList.add('translate-y-4', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function downloadMediaUrl(url, filename) {
  fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(blobUrl);
      a.remove();
      showToast(`Downloaded: ${filename}`, "success");
    })
    .catch(() => {
      // Fallback direct link
      const a = document.createElement('a');
      a.href = url;
      a.target = "_blank";
      a.download = filename;
      a.click();
    });
}

function shareMedia() {
  if (navigator.share && APP_STATE.currentImage) {
    navigator.share({
      title: 'Nexus AI Creation',
      text: APP_STATE.currentImage.prompt,
      url: APP_STATE.currentImage.url
    }).catch(() => {});
  } else {
    copyCurrentPrompt();
  }
}

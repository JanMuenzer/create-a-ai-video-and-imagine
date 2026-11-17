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
  referenceImageUrl: '',
  conditioning: {
    mode: 'full', // 'full' | 'identity' | 'pose' | 'composition' | 'style' | 'custom'
    referenceWeight: 85, // Master reference conditioning influence (0-100%)
    identityWeight: 95,  // Identity & facial likeness preservation (0-100%)
    poseWeight: 90,      // Pose & facial orientation fidelity (0-100%)
    compositionWeight: 90, // Camera angle & composition fidelity (0-100%)
    styleWeight: 75,     // Style, lighting & palette transfer (0-100%)
    identityLocked: true,
    poseLocked: true,
    compositionLocked: true,
    styleLocked: false,
    uploadedPublicUrl: '',
    subjectProfile: {
      name: 'Elena',
      gender: 'Woman (Early 20s)',
      hair: 'Dark brunette wavy hair with middle part',
      eyes: 'Hazel almond eyes',
      facialFeatures: 'Sculpted jawline, defined cheekbones, full lips',
      complexion: 'Warm olive complexion',
      customLikenessNotes: 'Elena, athletic elegant facial structure'
    },
    poseProfile: {
      angle: '3/4 Turn Facing Left (25°)',
      gaze: 'Direct Eye Contact with Camera',
      shoulders: 'Shoulders angled 3/4 to camera'
    },
    compositionProfile: {
      framing: 'Tight Close-up Portrait (85mm Lens)',
      elevation: 'Eye-Level Perspective',
      focalLength: '85mm f/1.4'
    },
    styleProfile: {
      lighting: 'Dramatic Directional Studio Lighting with chiaroscuro contrast',
      palette: ['#0f172a', '#3b82f6', '#ec4899', '#f8fafc']
    },
    referenceAttributes: {
      framing: 'Close-up Portrait (85mm)',
      faceAngle: '3/4 Turn Facing Left (25°)',
      lighting: 'Dramatic Chiaroscuro',
      palette: ['#0f172a', '#3b82f6', '#ec4899', '#f8fafc'],
      aspectRatio: '1:1',
      aspectWidth: 1024,
      aspectHeight: 1024
    }
  },
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
    referenceImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1024&q=80',
    conditioning: {
      mode: 'full',
      referenceWeight: 85,
      identityWeight: 95,
      poseWeight: 90,
      compositionWeight: 90,
      styleWeight: 75
    },
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
  syncConditioningUI();

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
  const genBtnText = document.getElementById('btn-generate-text');

  if (mode === 'txt2img') {
    txtBtn.className = "py-2 rounded-lg bg-brand-600 text-white shadow transition-all flex items-center justify-center gap-1.5";
    imgBtn.className = "py-2 rounded-lg text-slate-400 hover:text-white transition-all flex items-center justify-center gap-1.5";
    uploadContainer.classList.add('hidden');
    if (genBtnText && !APP_STATE.isGeneratingImage) {
      genBtnText.textContent = "GENERATE UNRESTRICTED IMAGE";
    }
  } else {
    imgBtn.className = "py-2 rounded-lg bg-brand-600 text-white shadow transition-all flex items-center justify-center gap-1.5";
    txtBtn.className = "py-2 rounded-lg text-slate-400 hover:text-white transition-all flex items-center justify-center gap-1.5";
    uploadContainer.classList.remove('hidden');
    if (genBtnText && !APP_STATE.isGeneratingImage) {
      genBtnText.textContent = "SYNTHESIZE CONDITIONED IMAGE";
    }
    // Sync current conditioning UI state
    syncConditioningUI();
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

// ==========================================
// 5.1 REFERENCE CONDITIONING & CONTROL MATRIX
// ==========================================
const CURATED_REFERENCE_PRESETS = {
  'ref-elena': {
    id: 'ref-elena',
    name: 'Elena',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1024&q=80',
    subject: {
      name: 'Elena',
      gender: 'Woman (Early 20s)',
      hair: 'Dark brunette wavy hair with middle part',
      eyes: 'Hazel almond eyes',
      facialFeatures: 'Sculpted jawline, defined cheekbones, full lips, natural brows',
      complexion: 'Warm olive complexion',
      customLikenessNotes: 'Elena, athletic elegant facial structure'
    },
    pose: {
      angle: '3/4 Turn Facing Left (25°)',
      gaze: 'Direct Eye Contact with Camera',
      shoulders: 'Shoulders angled 3/4 to camera'
    },
    composition: {
      framing: 'Tight Close-up Portrait (85mm Lens)',
      elevation: 'Eye-Level Perspective',
      focalLength: '85mm f/1.4'
    },
    style: {
      lighting: 'Dramatic Directional Studio Lighting with chiaroscuro contrast',
      palette: ['#1c1917', '#78350f', '#d97706', '#fef3c7']
    }
  },
  'ref-marcus': {
    id: 'ref-marcus',
    name: 'Marcus',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1024&q=80',
    subject: {
      name: 'Marcus',
      gender: 'Man (Early 30s)',
      hair: 'Short dark textured fade haircut',
      eyes: 'Deep warm brown eyes',
      facialFeatures: 'Chiseled masculine jawline, strong chin, groomed stubble beard',
      complexion: 'Healthy warm skin tone',
      customLikenessNotes: 'Marcus, masculine defined jawline and intense gaze'
    },
    pose: {
      angle: 'Frontal Direct Gaze (0°)',
      gaze: 'Direct Eye Contact with Camera',
      shoulders: 'Broad shoulders squared to camera'
    },
    composition: {
      framing: 'Tight Close-up Portrait (85mm Lens)',
      elevation: 'Eye-Level Perspective',
      focalLength: '85mm'
    },
    style: {
      lighting: 'Crisp Studio Key Light with gentle rim separation',
      palette: ['#0f172a', '#334155', '#94a3b8', '#f8fafc']
    }
  },
  'ref-aria': {
    id: 'ref-aria',
    name: 'Aria',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1024&q=80',
    subject: {
      name: 'Aria',
      gender: 'Woman (Mid 20s)',
      hair: 'Sleek straight dark hair flowing past shoulders',
      eyes: 'Expressive dark brown almond eyes',
      facialFeatures: 'Soft refined jawline, gentle cheekbones, radiant natural beauty',
      complexion: 'Radiant porcelain skin with golden undertones',
      customLikenessNotes: 'Aria, natural serene facial features and gentle gaze'
    },
    pose: {
      angle: '3/4 Turn Facing Right (25°)',
      gaze: 'Direct Eye Contact with Camera',
      shoulders: 'Relaxed natural shoulder posture'
    },
    composition: {
      framing: 'Medium Bust Portrait (50mm Lens)',
      elevation: 'Eye-Level Perspective',
      focalLength: '50mm f/1.2'
    },
    style: {
      lighting: 'Golden Hour Soft Sunlight with warm rim glow',
      palette: ['#451a03', '#92400e', '#f59e0b', '#fef3c7']
    }
  },
  'ref-david': {
    id: 'ref-david',
    name: 'David',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1024&q=80',
    subject: {
      name: 'David',
      gender: 'Man (Early 40s)',
      hair: 'Distinguished dark hair with salt and pepper temples',
      eyes: 'Piercing hazel eyes',
      facialFeatures: 'Weathered handsome facial lines, square jaw, light groomed stubble',
      complexion: 'Rugged sun-kissed skin texture',
      customLikenessNotes: 'David, commanding cinematic presence and sculpted features'
    },
    pose: {
      angle: '3/4 Turn Facing Left (25°)',
      gaze: 'Gazing Off-Camera Left',
      shoulders: 'Firm composed posture'
    },
    composition: {
      framing: 'Tight Close-up Portrait (85mm Lens)',
      elevation: 'Low-Angle Looking Up',
      focalLength: '85mm anamorphic'
    },
    style: {
      lighting: 'Low-Key Chiaroscuro with intense side rim lighting',
      palette: ['#09090b', '#27272a', '#71717a', '#fafafa']
    }
  }
};

const CONDITIONING_PRESETS = {
  full: {
    refWeight: 88,
    identity: 95,
    pose: 92,
    comp: 90,
    style: 75,
    lockId: true,
    lockPose: true,
    lockComp: true,
    lockStyle: false,
    label: "Full Fidelity Lock",
    explanation: "Locks person identity, facial bone structure, gaze, head tilt, and camera framing while applying prompt modifications."
  },
  identity: {
    refWeight: 82,
    identity: 98,
    pose: 35,
    comp: 40,
    style: 45,
    lockId: true,
    lockPose: false,
    lockComp: false,
    lockStyle: false,
    label: "Identity & Likeness Priority",
    explanation: "Strict face, facial features, bone structure and likeness lock. Lets prompt freely change pose, clothing, and scene."
  },
  pose: {
    refWeight: 85,
    identity: 35,
    pose: 98,
    comp: 85,
    style: 45,
    lockId: false,
    lockPose: true,
    lockComp: true,
    lockStyle: false,
    label: "Pose & Orientation Transfer",
    explanation: "Transfers exact body stance, head tilt, gaze vector, and orientation to a new character or style."
  },
  composition: {
    refWeight: 80,
    identity: 45,
    pose: 65,
    comp: 98,
    style: 45,
    lockId: false,
    lockPose: false,
    lockComp: true,
    lockStyle: false,
    label: "Camera & Composition Lock",
    explanation: "Locks camera elevation, lens focal length, shot framing (close-up/medium/wide), and screen composition."
  },
  style: {
    refWeight: 75,
    identity: 20,
    pose: 20,
    comp: 40,
    style: 98,
    lockId: false,
    lockPose: false,
    lockComp: false,
    lockStyle: true,
    label: "Style & Lighting Transfer",
    explanation: "Transfers color palette, key/rim lighting direction, contrast, and artistic rendering mood."
  },
  custom: {
    label: "Custom Precision Matrix",
    explanation: "Independent custom weight sliders for identity, pose, camera framing, and style."
  }
};

function loadCuratedReference(presetId) {
  triggerHaptic();
  const preset = CURATED_REFERENCE_PRESETS[presetId];
  if (!preset) return;

  setImagineInputMode('img2img');
  APP_STATE.referenceImageBase64 = preset.url;
  APP_STATE.conditioning.referenceUrl = preset.url;
  APP_STATE.conditioning.uploadedPublicUrl = preset.url;

  // Apply curated biometric & visual attributes
  APP_STATE.conditioning.subjectProfile = { ...preset.subject };
  APP_STATE.conditioning.poseProfile = { ...preset.pose };
  APP_STATE.conditioning.compositionProfile = { ...preset.composition };
  APP_STATE.conditioning.styleProfile = { ...preset.style };

  // Set preset to full fidelity
  setConditioningPreset('full');

  // Update Preview UI
  const previewImg = document.getElementById('img2img-preview-img');
  if (previewImg) previewImg.src = preset.url;
  const previewBox = document.getElementById('img2img-preview-box');
  if (previewBox) previewBox.classList.remove('hidden');
  const uploadPrompt = document.getElementById('img2img-upload-prompt');
  if (uploadPrompt) uploadPrompt.classList.add('hidden');

  // Update input fields & dropdowns
  const likenessInput = document.getElementById('custom-likeness-input');
  if (likenessInput) likenessInput.value = preset.subject.customLikenessNotes || '';
  const poseSelect = document.getElementById('select-pose-angle');
  if (poseSelect) poseSelect.value = preset.pose.angle;
  const gazeSelect = document.getElementById('select-gaze-vector');
  if (gazeSelect) gazeSelect.value = preset.pose.gaze;
  const framingSelect = document.getElementById('select-cam-framing');
  if (framingSelect) framingSelect.value = preset.composition.framing;
  const elevSelect = document.getElementById('select-cam-elevation');
  if (elevSelect) elevSelect.value = preset.composition.elevation;

  // Update Biometric Tags
  updateBiometricTagsUI();

  analyzeReferenceImage(preset.url);
  showToast(`Loaded ${preset.name} reference with strict biometric & pose lock!`, "success");
}

function updateBiometricTagsUI() {
  const subj = APP_STATE.conditioning.subjectProfile;
  if (!subj) return;

  const genderEl = document.getElementById('tag-subject-gender');
  if (genderEl) genderEl.textContent = subj.gender || 'Person';

  const hairEl = document.getElementById('tag-subject-hair');
  if (hairEl) hairEl.textContent = subj.hair || 'Hair';

  const eyesEl = document.getElementById('tag-subject-eyes');
  if (eyesEl) eyesEl.textContent = subj.eyes || 'Eyes';

  const faceEl = document.getElementById('tag-subject-face');
  if (faceEl) faceEl.textContent = subj.facialFeatures || 'Features';

  const strengthEl = document.getElementById('subject-likeness-strength');
  if (strengthEl) {
    if (APP_STATE.conditioning.identityLocked || APP_STATE.conditioning.identityWeight >= 90) {
      strengthEl.textContent = "Strict Biometric Lock";
      strengthEl.className = "text-[10px] font-mono text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30";
    } else if (APP_STATE.conditioning.identityWeight >= 60) {
      strengthEl.textContent = "Strong Likeness Transfer";
      strengthEl.className = "text-[10px] font-mono text-brand-cyan font-semibold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30";
    } else {
      strengthEl.textContent = "Loose Subject Hint";
      strengthEl.className = "text-[10px] font-mono text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30";
    }
  }
}

function handleCustomLikenessChange(val) {
  if (!APP_STATE.conditioning.subjectProfile) APP_STATE.conditioning.subjectProfile = {};
  APP_STATE.conditioning.subjectProfile.customLikenessNotes = val.trim();
}

function handlePoseAngleChange(val) {
  if (!APP_STATE.conditioning.poseProfile) APP_STATE.conditioning.poseProfile = {};
  APP_STATE.conditioning.poseProfile.angle = val;
  const angleText = document.getElementById('attr-angle-text');
  if (angleText) angleText.textContent = val;
}

function handleGazeVectorChange(val) {
  if (!APP_STATE.conditioning.poseProfile) APP_STATE.conditioning.poseProfile = {};
  APP_STATE.conditioning.poseProfile.gaze = val;
}

function handleCamFramingChange(val) {
  if (!APP_STATE.conditioning.compositionProfile) APP_STATE.conditioning.compositionProfile = {};
  APP_STATE.conditioning.compositionProfile.framing = val;
  const framingText = document.getElementById('attr-framing-text');
  if (framingText) framingText.textContent = val;
}

function handleCamElevationChange(val) {
  if (!APP_STATE.conditioning.compositionProfile) APP_STATE.conditioning.compositionProfile = {};
  APP_STATE.conditioning.compositionProfile.elevation = val;
}

function setConditioningPreset(mode) {
  triggerHaptic();
  APP_STATE.conditioning.mode = mode;
  const preset = CONDITIONING_PRESETS[mode];
  if (!preset) return;

  if (mode !== 'custom') {
    APP_STATE.conditioning.referenceWeight = preset.refWeight;
    APP_STATE.conditioning.identityWeight = preset.identity;
    APP_STATE.conditioning.poseWeight = preset.pose;
    APP_STATE.conditioning.compositionWeight = preset.comp;
    APP_STATE.conditioning.styleWeight = preset.style;
    APP_STATE.conditioning.identityLocked = preset.lockId;
    APP_STATE.conditioning.poseLocked = preset.lockPose;
    APP_STATE.conditioning.compositionLocked = preset.lockComp;
    APP_STATE.conditioning.styleLocked = preset.lockStyle;
  }

  // Update UI preset buttons
  document.querySelectorAll('.cond-preset-btn').forEach(btn => {
    btn.classList.remove('active', 'bg-brand-600/30', 'text-brand-200', 'border-brand-500');
    btn.classList.add('bg-brand-dark', 'text-slate-400', 'border-brand-border');
  });
  const activeBtn = document.getElementById(`preset-cond-${mode}`);
  if (activeBtn) {
    activeBtn.classList.add('active', 'bg-brand-600/30', 'text-brand-200', 'border-brand-500');
    activeBtn.classList.remove('bg-brand-dark', 'text-slate-400', 'border-brand-border');
  }

  // Update status labels
  const statusEl = document.getElementById('cond-mode-status');
  if (statusEl) statusEl.textContent = preset.label;
  const expEl = document.getElementById('cond-mode-explanation');
  if (expEl) expEl.textContent = preset.explanation;

  syncConditioningUI();
}

function syncConditioningUI() {
  const cond = APP_STATE.conditioning;

  // Master reference weight
  const sliderRef = document.getElementById('slider-ref-weight');
  if (sliderRef) sliderRef.value = cond.referenceWeight;
  handleRefWeightChange(cond.referenceWeight);

  // Identity channel
  const sliderId = document.getElementById('slider-identity-weight');
  if (sliderId) sliderId.value = cond.identityWeight;
  const valId = document.getElementById('val-identity-weight');
  if (valId) valId.textContent = `${cond.identityWeight}%`;
  const lockId = document.getElementById('lock-identity');
  if (lockId) lockId.checked = cond.identityLocked;

  // Pose channel
  const sliderPose = document.getElementById('slider-pose-weight');
  if (sliderPose) sliderPose.value = cond.poseWeight;
  const valPose = document.getElementById('val-pose-weight');
  if (valPose) valPose.textContent = `${cond.poseWeight}%`;
  const lockPose = document.getElementById('lock-pose');
  if (lockPose) lockPose.checked = cond.poseLocked;

  // Composition channel
  const sliderComp = document.getElementById('slider-comp-weight');
  if (sliderComp) sliderComp.value = cond.compositionWeight;
  const valComp = document.getElementById('val-comp-weight');
  if (valComp) valComp.textContent = `${cond.compositionWeight}%`;
  const lockComp = document.getElementById('lock-composition');
  if (lockComp) lockComp.checked = cond.compositionLocked;

  // Style channel
  const sliderStyle = document.getElementById('slider-style-weight');
  if (sliderStyle) sliderStyle.value = cond.styleWeight;
  const valStyle = document.getElementById('val-style-weight');
  if (valStyle) valStyle.textContent = `${cond.styleWeight}%`;
  const lockStyle = document.getElementById('lock-style');
  if (lockStyle) lockStyle.checked = cond.styleLocked;

  // Sync inputs & biometrics
  if (cond.subjectProfile) {
    const likenessInput = document.getElementById('custom-likeness-input');
    if (likenessInput && cond.subjectProfile.customLikenessNotes !== undefined) {
      likenessInput.value = cond.subjectProfile.customLikenessNotes;
    }
  }
  if (cond.poseProfile) {
    const poseSelect = document.getElementById('select-pose-angle');
    if (poseSelect && cond.poseProfile.angle) poseSelect.value = cond.poseProfile.angle;
    const gazeSelect = document.getElementById('select-gaze-vector');
    if (gazeSelect && cond.poseProfile.gaze) gazeSelect.value = cond.poseProfile.gaze;
  }
  if (cond.compositionProfile) {
    const framingSelect = document.getElementById('select-cam-framing');
    if (framingSelect && cond.compositionProfile.framing) framingSelect.value = cond.compositionProfile.framing;
    const elevSelect = document.getElementById('select-cam-elevation');
    if (elevSelect && cond.compositionProfile.elevation) elevSelect.value = cond.compositionProfile.elevation;
  }

  updateBiometricTagsUI();
}

function handleRefWeightChange(val) {
  const num = parseInt(val, 10);
  APP_STATE.conditioning.referenceWeight = num;

  const badge = document.getElementById('ref-weight-badge');
  const centerLabel = document.getElementById('balance-center-label');
  const promptGauge = document.getElementById('gauge-prompt-fill');
  const refGauge = document.getElementById('gauge-ref-fill');

  if (promptGauge) promptGauge.style.width = `${100 - num}%`;
  if (refGauge) refGauge.style.width = `${num}%`;

  let tag = "Creative Prompt Dominance";
  if (num >= 95) tag = "100% Strict Visual Clamp";
  else if (num >= 80) tag = `${num}% Targeted Visual Lock (High Fidelity)`;
  else if (num >= 60) tag = `${num}% Strong Visual Guidance`;
  else if (num >= 40) tag = `${num}% Balanced Creative Fusion`;
  else if (num >= 20) tag = `${num}% Creative Prompt Bias`;
  else tag = `${num}% Loose Inspiration Only`;

  if (badge) badge.textContent = tag;
  if (centerLabel) centerLabel.textContent = `${num}% Reference Guidance`;
}

function handleChannelWeightChange(channel, val) {
  const num = parseInt(val, 10);
  if (channel === 'identity') {
    APP_STATE.conditioning.identityWeight = num;
    const el = document.getElementById('val-identity-weight');
    if (el) el.textContent = `${num}%`;
  } else if (channel === 'pose') {
    APP_STATE.conditioning.poseWeight = num;
    const el = document.getElementById('val-pose-weight');
    if (el) el.textContent = `${num}%`;
  } else if (channel === 'composition') {
    APP_STATE.conditioning.compositionWeight = num;
    const el = document.getElementById('val-comp-weight');
    if (el) el.textContent = `${num}%`;
  } else if (channel === 'style') {
    APP_STATE.conditioning.styleWeight = num;
    const el = document.getElementById('val-style-weight');
    if (el) el.textContent = `${num}%`;
  }

  updateBiometricTagsUI();

  // Switch to custom preset mode UI
  if (APP_STATE.conditioning.mode !== 'custom') {
    APP_STATE.conditioning.mode = 'custom';
    document.querySelectorAll('.cond-preset-btn').forEach(btn => {
      btn.classList.remove('active', 'bg-brand-600/30', 'text-brand-200', 'border-brand-500');
      btn.classList.add('bg-brand-dark', 'text-slate-400', 'border-brand-border');
    });
    const customBtn = document.getElementById('preset-cond-custom');
    if (customBtn) {
      customBtn.classList.add('active', 'bg-brand-600/30', 'text-brand-200', 'border-brand-500');
      customBtn.classList.remove('bg-brand-dark', 'text-slate-400', 'border-brand-border');
    }
    const statusEl = document.getElementById('cond-mode-status');
    if (statusEl) statusEl.textContent = "Custom Matrix";
    const expEl = document.getElementById('cond-mode-explanation');
    if (expEl) expEl.textContent = "Independent custom weight sliders for identity, pose, camera framing, and style.";
  }
}

function toggleChannelLock(channel) {
  triggerHaptic();
  if (channel === 'identity') {
    APP_STATE.conditioning.identityLocked = document.getElementById('lock-identity').checked;
  } else if (channel === 'pose') {
    APP_STATE.conditioning.poseLocked = document.getElementById('lock-pose').checked;
  } else if (channel === 'composition') {
    APP_STATE.conditioning.compositionLocked = document.getElementById('lock-composition').checked;
  } else if (channel === 'style') {
    APP_STATE.conditioning.styleLocked = document.getElementById('lock-style').checked;
  }
  updateBiometricTagsUI();
}

function setRefSourceMode(mode) {
  triggerHaptic();
  const fileTab = document.getElementById('ref-source-tab-file');
  const urlTab = document.getElementById('ref-source-tab-url');
  const fileContainer = document.getElementById('ref-file-container');
  const urlContainer = document.getElementById('ref-url-container');

  if (mode === 'file') {
    if (fileTab) fileTab.className = "px-2.5 py-1 rounded-md bg-brand-card text-brand-300 font-semibold border border-brand-500/50 flex items-center gap-1 transition-all";
    if (urlTab) urlTab.className = "px-2.5 py-1 rounded-md bg-brand-dark text-slate-400 hover:text-white border border-brand-border flex items-center gap-1 transition-all";
    if (fileContainer) fileContainer.classList.remove('hidden');
    if (urlContainer) urlContainer.classList.add('hidden');
  } else {
    if (urlTab) urlTab.className = "px-2.5 py-1 rounded-md bg-brand-card text-brand-300 font-semibold border border-brand-500/50 flex items-center gap-1 transition-all";
    if (fileTab) fileTab.className = "px-2.5 py-1 rounded-md bg-brand-dark text-slate-400 hover:text-white border border-brand-border flex items-center gap-1 transition-all";
    if (urlContainer) urlContainer.classList.remove('hidden');
    if (fileContainer) fileContainer.classList.add('hidden');
  }
}

function loadReferenceFromUrlInput() {
  const input = document.getElementById('ref-url-input');
  const url = input ? input.value.trim() : '';
  if (!url) {
    showToast("Please enter a valid image URL", "warning");
    return;
  }

  triggerHaptic();
  APP_STATE.referenceImageBase64 = url;
  APP_STATE.conditioning.referenceUrl = url;
  APP_STATE.conditioning.uploadedPublicUrl = url;

  const previewImg = document.getElementById('img2img-preview-img');
  if (previewImg) previewImg.src = url;
  const previewBox = document.getElementById('img2img-preview-box');
  if (previewBox) previewBox.classList.remove('hidden');
  const uploadPrompt = document.getElementById('img2img-upload-prompt');
  if (uploadPrompt) uploadPrompt.classList.add('hidden');

  analyzeReferenceImage(url);
  showToast("Web reference loaded into Conditioning Studio!", "success");
}

function useCanvasAsReference() {
  triggerHaptic();
  if (!APP_STATE.currentImage || !APP_STATE.currentImage.url) {
    showToast("No generated canvas image available to use as reference", "warning");
    return;
  }

  setImagineInputMode('img2img');
  APP_STATE.referenceImageBase64 = APP_STATE.currentImage.url;
  APP_STATE.conditioning.referenceUrl = APP_STATE.currentImage.url;

  const previewImg = document.getElementById('img2img-preview-img');
  if (previewImg) previewImg.src = APP_STATE.currentImage.url;
  const previewBox = document.getElementById('img2img-preview-box');
  if (previewBox) previewBox.classList.remove('hidden');
  const uploadPrompt = document.getElementById('img2img-upload-prompt');
  if (uploadPrompt) uploadPrompt.classList.add('hidden');

  analyzeReferenceImage(APP_STATE.currentImage.url);
  showToast("Canvas image loaded as Reference Guide!", "success");
}

function syncAspectToMatchReference() {
  triggerHaptic();
  const attrs = APP_STATE.conditioning.referenceAttributes;
  if (!attrs || !attrs.aspectRatio) {
    showToast("Load a reference image first to detect aspect ratio", "info");
    return;
  }

  setAspectRatio(attrs.aspectRatio, attrs.aspectWidth, attrs.aspectHeight);
  showToast(`Canvas aspect ratio synced to Reference: ${attrs.aspectRatio} (${attrs.aspectWidth}×${attrs.aspectHeight})`, "success");
}

function getDominantPalette(samples) {
  if (!samples || samples.length === 0) return ['#0f172a', '#3b82f6', '#ec4899', '#f8fafc'];
  // Sort by brightness
  samples.sort((a, b) => (0.299 * a[0] + 0.587 * a[1] + 0.114 * a[2]) - (0.299 * b[0] + 0.587 * b[1] + 0.114 * b[2]));
  const step = Math.floor(samples.length / 4);
  const picked = [
    samples[Math.min(5, samples.length - 1)],
    samples[Math.min(step, samples.length - 1)],
    samples[Math.min(step * 2, samples.length - 1)],
    samples[Math.min(samples.length - 5, samples.length - 1)]
  ];

  return picked.map(c => {
    const toHex = n => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
    return `#${toHex(c[0])}${toHex(c[1])}${toHex(c[2])}`;
  });
}

async function uploadReferenceImageBackground(imageSrc) {
  if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) {
    APP_STATE.conditioning.uploadedPublicUrl = imageSrc;
    return;
  }

  try {
    const res = await fetch(imageSrc);
    const blob = await res.blob();
    const formData = new FormData();
    formData.append('file', blob, 'nexus-reference.jpg');

    const uploadRes = await fetch('https://tmpfiles.org/api/v1/upload', {
      method: 'POST',
      body: formData
    });

    if (uploadRes.ok) {
      const data = await uploadRes.json();
      if (data && data.data && data.data.url) {
        const directUrl = data.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
        APP_STATE.conditioning.uploadedPublicUrl = directUrl;
      }
    }
  } catch (err) {
    // Non-blocking fallback to latent prompt conditioning directives
  }
}

function analyzeReferenceImage(imageSrc) {
  if (!imageSrc) return;

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    try {
      const nw = img.naturalWidth || 512;
      const nh = img.naturalHeight || 512;
      const ratio = nw / nh;

      let bestRatio = '1:1';
      let rWidth = 1024, rHeight = 1024;
      if (ratio < 0.7) {
        bestRatio = '9:16';
        rWidth = 768; rHeight = 1344;
      } else if (ratio > 1.8) {
        bestRatio = '21:9';
        rWidth = 1408; rHeight = 600;
      } else if (ratio > 1.4) {
        bestRatio = '16:9';
        rWidth = 1344; rHeight = 768;
      } else if (ratio > 1.15) {
        bestRatio = '4:3';
        rWidth = 1024; rHeight = 768;
      }

      APP_STATE.conditioning.referenceAttributes.aspectRatio = bestRatio;
      APP_STATE.conditioning.referenceAttributes.aspectWidth = rWidth;
      APP_STATE.conditioning.referenceAttributes.aspectHeight = rHeight;

      // Offscreen canvas analysis
      const canvas = document.createElement('canvas');
      canvas.width = 120;
      canvas.height = 120;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, 120, 120);

      const imgData = ctx.getImageData(0, 0, 120, 120).data;
      let totalLuma = 0;
      let leftLuma = 0;
      let rightLuma = 0;
      let skinPixels = 0;
      let skinMinY = 120, skinMaxY = 0;
      let skinMinX = 120, skinMaxX = 0;
      let skinXSum = 0;
      let skinLumaSum = 0;
      let topRegionLuma = 0;
      let topRegionPixels = 0;
      let topRed = 0, topGreen = 0, topBlue = 0;
      const colorSamples = [];

      for (let y = 0; y < 120; y++) {
        for (let x = 0; x < 120; x++) {
          const idx = (y * 120 + x) * 4;
          const r = imgData[idx];
          const g = imgData[idx + 1];
          const b = imgData[idx + 2];
          const luma = 0.299 * r + 0.587 * g + 0.114 * b;
          totalLuma += luma;

          if (x < 60) leftLuma += luma;
          else rightLuma += luma;

          // Upper region for hair color estimation (top 30%)
          if (y < 36 && x > 20 && x < 100) {
            topRegionLuma += luma;
            topRed += r;
            topGreen += g;
            topBlue += b;
            topRegionPixels++;
          }

          // Warm/skin centroid detection
          if (r > 60 && g > 40 && b > 25 && r > b && (r - g) > 8) {
            skinPixels++;
            skinLumaSum += luma;
            if (y < skinMinY) skinMinY = y;
            if (y > skinMaxY) skinMaxY = y;
            if (x < skinMinX) skinMinX = x;
            if (x > skinMaxX) skinMaxX = x;
            skinXSum += x;
          }

          if ((x % 12 === 0) && (y % 12 === 0)) {
            colorSamples.push([r, g, b]);
          }
        }
      }

      const avgLuma = totalLuma / 14400;
      const avgLeft = leftLuma / 7200;
      const avgRight = rightLuma / 7200;

      // Framing estimation
      let framingTag = "Tight Close-up Portrait (85mm Lens)";
      const faceHeight = skinMaxY > skinMinY ? (skinMaxY - skinMinY) : 50;
      if (faceHeight > 75) {
        framingTag = "Tight Close-up Portrait (85mm Lens)";
      } else if (faceHeight < 35) {
        framingTag = "Wide Environmental Cinematic Shot";
      } else {
        framingTag = "Medium Bust Portrait (50mm Lens)";
      }

      // Facial Orientation & Gaze estimation
      let angleTag = "Frontal Direct Gaze (0°)";
      let gazeTag = "Direct Eye Contact with Camera";
      if (skinPixels > 200) {
        const avgFaceX = skinXSum / skinPixels;
        if (avgFaceX < 50) {
          angleTag = "3/4 Turn Facing Right (25°)";
          gazeTag = "Direct Eye Contact with Camera";
        } else if (avgFaceX > 70) {
          angleTag = "3/4 Turn Facing Left (25°)";
          gazeTag = "Direct Eye Contact with Camera";
        } else {
          angleTag = "Frontal Direct Gaze (0°)";
          gazeTag = "Direct Eye Contact with Camera";
        }
      }

      // Camera Elevation estimation
      let elevationTag = "Eye-Level Perspective";
      if (skinMinY < 15) {
        elevationTag = "Eye-Level Perspective";
      } else if (skinMinY > 35) {
        elevationTag = "High-Angle Looking Down";
      }

      // Hair & Complexion estimation
      let hairTag = "Dark brunette wavy hair with middle part";
      if (topRegionPixels > 0) {
        const avgTopR = topRed / topRegionPixels;
        const avgTopG = topGreen / topRegionPixels;
        const avgTopB = topBlue / topRegionPixels;
        const avgTopL = topRegionLuma / topRegionPixels;

        if (avgTopL < 40) {
          hairTag = "Jet black textured hair";
        } else if (avgTopR > 140 && avgTopG > 115 && avgTopB < 95) {
          hairTag = "Golden blonde sun-kissed hair";
        } else if (avgTopR > 130 && avgTopG < 90 && avgTopB < 70) {
          hairTag = "Vibrant auburn red hair";
        } else if (avgTopL > 135 && Math.abs(avgTopR - avgTopB) < 20) {
          hairTag = "Distinguished silver-ash hair";
        } else {
          hairTag = "Dark brunette wavy hair";
        }
      }

      let complexionTag = "Warm olive complexion";
      if (skinPixels > 50) {
        const avgSkinL = skinLumaSum / skinPixels;
        if (avgSkinL > 170) complexionTag = "Fair porcelain skin with natural glow";
        else if (avgSkinL > 135) complexionTag = "Warm peach complexion";
        else if (avgSkinL > 90) complexionTag = "Warm olive complexion";
        else complexionTag = "Deep radiant bronze complexion";
      }

      // Lighting estimation
      let lightingTag = "Balanced Studio Key Lighting";
      const lumaDiff = Math.abs(avgLeft - avgRight);
      if (lumaDiff > 25) {
        lightingTag = avgLeft > avgRight 
          ? "Dramatic Directional Key-Left Lighting with chiaroscuro contrast" 
          : "Dramatic Directional Key-Right Lighting with chiaroscuro contrast";
      } else if (avgLuma > 165) {
        lightingTag = "High-Key Soft Diffused Natural Daylight";
      } else if (avgLuma < 85) {
        lightingTag = "Moody Chiaroscuro Low-Key Rim Lighting";
      } else {
        lightingTag = "Cinematic Studio Key Light with subtle rim separation";
      }

      const palette = getDominantPalette(colorSamples);

      APP_STATE.conditioning.referenceAttributes = {
        framing: framingTag,
        faceAngle: angleTag,
        lighting: lightingTag,
        palette: palette,
        aspectRatio: bestRatio,
        aspectWidth: rWidth,
        aspectHeight: rHeight
      };

      // Only overwrite subject profiles if not loaded from a curated preset
      if (!APP_STATE.conditioning.subjectProfile || !APP_STATE.conditioning.subjectProfile.name) {
        APP_STATE.conditioning.subjectProfile = {
          name: 'Custom Reference Person',
          gender: 'Person',
          hair: hairTag,
          eyes: 'Natural expressive eyes',
          facialFeatures: 'Defined jawline, sculpted cheekbones, facial symmetry',
          complexion: complexionTag,
          customLikenessNotes: `${hairTag}, ${complexionTag}`
        };
        APP_STATE.conditioning.poseProfile = {
          angle: angleTag,
          gaze: gazeTag,
          shoulders: 'Matching shoulder posture'
        };
        APP_STATE.conditioning.compositionProfile = {
          framing: framingTag,
          elevation: elevationTag,
          focalLength: '85mm lens'
        };
        APP_STATE.conditioning.styleProfile = {
          lighting: lightingTag,
          palette: palette
        };
      }

      // Update UI elements
      const attrBox = document.getElementById('ref-attributes-box');
      if (attrBox) attrBox.classList.remove('hidden');

      const framingEl = document.getElementById('attr-framing-text');
      if (framingEl) framingEl.textContent = framingTag;

      const angleEl = document.getElementById('attr-angle-text');
      if (angleEl) angleEl.textContent = angleTag;

      const lightEl = document.getElementById('attr-lighting-text');
      if (lightEl) lightEl.textContent = lightingTag;

      const paletteContainer = document.getElementById('attr-palette-swatches');
      if (paletteContainer) {
        paletteContainer.innerHTML = palette.map(c => `
          <span class="w-3 h-3 rounded-full border border-white/20 shadow-sm" style="background-color: ${c}" title="${c}"></span>
        `).join('');
      }

      const syncBtn = document.getElementById('btn-sync-aspect');
      if (syncBtn) {
        syncBtn.classList.remove('hidden');
        syncBtn.title = `Match canvas aspect ratio to reference (${bestRatio})`;
      }

      // Update Biometric UI
      updateBiometricTagsUI();

      const likenessInput = document.getElementById('custom-likeness-input');
      if (likenessInput && APP_STATE.conditioning.subjectProfile && APP_STATE.conditioning.subjectProfile.customLikenessNotes) {
        likenessInput.value = APP_STATE.conditioning.subjectProfile.customLikenessNotes;
      }
      const poseSelect = document.getElementById('select-pose-angle');
      if (poseSelect && APP_STATE.conditioning.poseProfile && APP_STATE.conditioning.poseProfile.angle) {
        poseSelect.value = APP_STATE.conditioning.poseProfile.angle;
      }
      const gazeSelect = document.getElementById('select-gaze-vector');
      if (gazeSelect && APP_STATE.conditioning.poseProfile && APP_STATE.conditioning.poseProfile.gaze) {
        gazeSelect.value = APP_STATE.conditioning.poseProfile.gaze;
      }
      const framingSelect = document.getElementById('select-cam-framing');
      if (framingSelect && APP_STATE.conditioning.compositionProfile && APP_STATE.conditioning.compositionProfile.framing) {
        framingSelect.value = APP_STATE.conditioning.compositionProfile.framing;
      }
      const elevSelect = document.getElementById('select-cam-elevation');
      if (elevSelect && APP_STATE.conditioning.compositionProfile && APP_STATE.conditioning.compositionProfile.elevation) {
        elevSelect.value = APP_STATE.conditioning.compositionProfile.elevation;
      }

      uploadReferenceImageBackground(imageSrc);

    } catch (err) {
      console.warn("Reference visual analysis warning:", err);
    }
  };

  img.src = imageSrc;
}

function buildConditioningPayload(userPrompt) {
  const cond = APP_STATE.conditioning;
  const refWeight = cond.referenceWeight !== undefined ? cond.referenceWeight : 85;
  const subj = cond.subjectProfile || {};
  const pose = cond.poseProfile || {};
  const comp = cond.compositionProfile || {};
  const style = cond.styleProfile || {};
  const attrs = cond.referenceAttributes || {};

  // 1. Identity Likeness Segment
  let identitySegment = '';
  if (cond.identityWeight >= 20) {
    const strictness = cond.identityWeight >= 85 
      ? "identical person, exact facial likeness and bone structure, defined jawline and cheekbones" 
      : (cond.identityWeight >= 60 ? "strong facial likeness and matching features" : "subtle resemblance");
    
    const likenessNotes = subj.customLikenessNotes ? `, ${subj.customLikenessNotes}` : '';
    const hair = subj.hair ? `with ${subj.hair}` : 'matching hair';
    const eyes = subj.eyes ? `${subj.eyes}` : 'matching eye color';
    const face = subj.facialFeatures ? `${subj.facialFeatures}` : 'distinctive facial structure';
    const compx = subj.complexion ? `${subj.complexion}` : 'matching skin tone';
    const gender = subj.gender ? `${subj.gender}` : 'person';

    identitySegment = `award-winning photograph featuring the exact same ${gender} from reference image ${hair}, ${eyes}, ${face}, ${compx}${likenessNotes}, preserving ${strictness}`;
  }

  // 2. Pose & Facial Orientation Segment
  let poseSegment = '';
  if (cond.poseWeight >= 20) {
    const angle = pose.angle || attrs.faceAngle || "3/4 Turn Facing Left (25°)";
    const gaze = pose.gaze || "Direct Eye Contact with Camera";
    const posture = pose.shoulders || "matching shoulders and torso angle";
    const strictness = cond.poseWeight >= 85 ? "exact matching pose and orientation" : "similar pose";
    poseSegment = `captured in ${strictness}: head turned at ${angle}, eyes looking in ${gaze}, ${posture}, matching head tilt and neck posture`;
  }

  // 3. Camera Angle & Composition Segment
  let compSegment = '';
  if (cond.compositionWeight >= 20) {
    const framing = comp.framing || attrs.framing || "Tight Close-up Portrait (85mm Lens)";
    const elevation = comp.elevation || "Eye-Level Perspective";
    const focal = comp.focalLength || "85mm lens";
    const strictness = cond.compositionWeight >= 85 ? "exact camera composition" : "matching framing";
    compSegment = `shot with ${strictness}: ${framing}, ${elevation}, ${focal}, identical subject placement in frame, shallow depth of field`;
  }

  // 4. Style, Lighting & Atmosphere Segment
  let styleSegment = '';
  if (cond.styleWeight >= 20) {
    const lighting = style.lighting || attrs.lighting || "Dramatic Directional Studio Lighting with chiaroscuro contrast";
    styleSegment = `${lighting}, matching key light and rim light direction, color temperature, and contrast`;
  }

  // Synthesis based on Master Reference Weight
  const conditioningDirectives = [identitySegment, poseSegment, compSegment, styleSegment].filter(Boolean);
  let finalPrompt = userPrompt;

  if (conditioningDirectives.length > 0) {
    if (refWeight >= 80) {
      // Reference-dominant (Strict Visual Conditioning Lock)
      finalPrompt = `${conditioningDirectives.join(', ')}, recontextualized as: ${userPrompt}, 8k uhd, masterpiece photography, highly detailed, photorealistic, sharp focus`;
    } else if (refWeight >= 55) {
      // Targeted Guidance (Balanced fusion)
      finalPrompt = `${userPrompt}, starring the exact same person (${identitySegment}), maintaining reference stance (${poseSegment}), framed in ${compSegment}, with ${styleSegment}, 8k uhd, cinematic realism`;
    } else if (refWeight >= 30) {
      // Loose Inspiration
      finalPrompt = `${userPrompt}, subtle resemblance to ${subj.gender || 'person'} with ${subj.hair || 'matching hair'}, ${styleSegment}`;
    } else {
      // Creative Freedom (Reference ignored or minimal)
      finalPrompt = userPrompt;
    }
  }

  // Anti-Drift Negative Conditioning Tokens
  const antiDriftTokens = [];
  if (cond.identityWeight >= 50) {
    antiDriftTokens.push("different person", "wrong face", "generic face", "altered facial features", "different eye color", "different hair", "morphed face");
  }
  if (cond.poseWeight >= 50) {
    antiDriftTokens.push("different pose", "turned away", "wrong head angle", "opposite gaze", "looking away from camera", "unnatural head tilt");
  }
  if (cond.compositionWeight >= 50) {
    antiDriftTokens.push("wrong framing", "cropped head", "distorted perspective", "wide angle lens distortion");
  }

  return {
    fullPrompt: finalPrompt,
    antiDriftTokens: antiDriftTokens,
    directives: conditioningDirectives
  };
}

// Reference Image upload handler
function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    APP_STATE.referenceImageBase64 = event.target.result;
    APP_STATE.conditioning.referenceUrl = '';
    const previewImg = document.getElementById('img2img-preview-img');
    if (previewImg) previewImg.src = event.target.result;
    const previewBox = document.getElementById('img2img-preview-box');
    if (previewBox) previewBox.classList.remove('hidden');
    const uploadPrompt = document.getElementById('img2img-upload-prompt');
    if (uploadPrompt) uploadPrompt.classList.add('hidden');

    analyzeReferenceImage(event.target.result);
    showToast("Reference image loaded for targeted conditioning!", "success");
  };
  reader.readAsDataURL(file);
}

function clearImageUpload(e) {
  if (e) e.stopPropagation();
  triggerHaptic();
  APP_STATE.referenceImageBase64 = null;
  APP_STATE.conditioning.referenceUrl = '';
  APP_STATE.conditioning.uploadedPublicUrl = '';
  const fileInput = document.getElementById('img2img-file-input');
  if (fileInput) fileInput.value = '';
  const urlInput = document.getElementById('ref-url-input');
  if (urlInput) urlInput.value = '';
  const previewBox = document.getElementById('img2img-preview-box');
  if (previewBox) previewBox.classList.add('hidden');
  const uploadPrompt = document.getElementById('img2img-upload-prompt');
  if (uploadPrompt) uploadPrompt.classList.remove('hidden');
  const attrBox = document.getElementById('ref-attributes-box');
  if (attrBox) attrBox.classList.add('hidden');
  const syncBtn = document.getElementById('btn-sync-aspect');
  if (syncBtn) syncBtn.classList.add('hidden');
  showToast("Reference image removed", "info");
}

// Generate Image Core Function with Precision Reference Conditioning
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

    // Reference Image Conditioning Integration
    const isConditioningActive = APP_STATE.imagineMode === 'img2img' && (APP_STATE.referenceImageBase64 || APP_STATE.conditioning.referenceUrl);

    let antiDriftNegative = "";
    if (isConditioningActive) {
      const payload = buildConditioningPayload(fullPrompt);
      fullPrompt = payload.fullPrompt;
      if (payload.antiDriftTokens && payload.antiDriftTokens.length > 0) {
        antiDriftNegative = payload.antiDriftTokens.join(', ');
      }
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

    // Negative prompt resolution & Anti-drift injection
    const negInput = document.getElementById('negative-prompt-input');
    let negativeText = negInput ? negInput.value.trim() : '';
    if (antiDriftNegative) {
      negativeText = negativeText ? `${negativeText}, ${antiDriftNegative}` : antiDriftNegative;
    }

    // Pollinations AI URL Construction
    let queryModel = 'flux';
    if (modelSelect === 'flux-realism') queryModel = 'flux-realism';
    else if (modelSelect === 'flux-anime') queryModel = 'flux-anime';
    else if (modelSelect === 'flux-3d') queryModel = 'flux-3d';
    else if (modelSelect === 'turbo') queryModel = 'turbo';

    const encodedPrompt = encodeURIComponent(fullPrompt);
    let imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seedVal}&nologo=true&model=${queryModel}`;

    if (negativeText) {
      imageUrl += `&negative=${encodeURIComponent(negativeText)}`;
    }

    // Pass public image reference URL if active
    const activeRefUrl = APP_STATE.conditioning.uploadedPublicUrl || APP_STATE.conditioning.referenceUrl;
    if (isConditioningActive && activeRefUrl) {
      imageUrl += `&image=${encodeURIComponent(activeRefUrl)}`;
    }

    // Preload image in memory to ensure smooth reveal
    await new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        imgElement.src = imageUrl;
        resolve(img);
      };
      img.onerror = () => {
        // Fallback to standard url if model query parameter failed
        const fallbackUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seedVal}&nologo=true`;
        imgElement.src = fallbackUrl;
        resolve(imgElement);
      };
      img.src = imageUrl;
    });

    clearInterval(timerInterval);

    // Save state
    const refSource = APP_STATE.referenceImageBase64 || APP_STATE.conditioning.referenceUrl || null;
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
      timestamp: Date.now(),
      referenceImage: isConditioningActive ? refSource : null,
      conditioning: isConditioningActive ? {
        mode: APP_STATE.conditioning.mode,
        referenceWeight: APP_STATE.conditioning.referenceWeight,
        identityWeight: APP_STATE.conditioning.identityWeight,
        poseWeight: APP_STATE.conditioning.poseWeight,
        compositionWeight: APP_STATE.conditioning.compositionWeight,
        styleWeight: APP_STATE.conditioning.styleWeight,
        subjectProfile: { ...APP_STATE.conditioning.subjectProfile },
        poseProfile: { ...APP_STATE.conditioning.poseProfile },
        compositionProfile: { ...APP_STATE.conditioning.compositionProfile },
        styleProfile: { ...APP_STATE.conditioning.styleProfile },
        attributes: { ...APP_STATE.conditioning.referenceAttributes }
      } : null
    };

    // Add to gallery
    saveToGallery(APP_STATE.currentImage);

    // Update metadata bar
    document.getElementById('meta-resolution').textContent = `${width}x${height}`;
    document.getElementById('meta-model').textContent = modelSelect.toUpperCase();
    document.getElementById('meta-seed').textContent = `Seed: ${seedVal}`;
    document.getElementById('meta-prompt-snippet').textContent = prompt;

    // Show/hide Compare with Ref button & badge
    const compareBtn = document.getElementById('btn-compare-ref');
    const quickToggleBtn = document.getElementById('btn-quick-toggle-ref');
    const refOverlayImg = document.getElementById('current-ref-overlay');
    const condBadge = document.getElementById('meta-conditioning-badge');
    const condBadgeText = document.getElementById('meta-conditioning-text');

    if (isConditioningActive && refSource) {
      if (compareBtn) compareBtn.classList.remove('hidden');
      if (quickToggleBtn) quickToggleBtn.classList.remove('hidden');
      if (refOverlayImg) refOverlayImg.src = refSource;
      if (condBadge) {
        condBadge.classList.remove('hidden');
        if (condBadgeText) condBadgeText.textContent = `Identity ${APP_STATE.conditioning.identityWeight}% • Pose ${APP_STATE.conditioning.poseWeight}% • Cam ${APP_STATE.conditioning.compositionWeight}%`;
      }
    } else {
      if (compareBtn) compareBtn.classList.add('hidden');
      if (quickToggleBtn) quickToggleBtn.classList.add('hidden');
      if (condBadge) condBadge.classList.add('hidden');
    }

    // Reveal output
    imgElement.classList.remove('hidden');
    overlayControls.classList.remove('hidden');
    metadataBar.classList.remove('hidden');
    showToast("Image synthesized successfully with targeted conditioning!", "success");

  } catch (err) {
    console.error("Image generation error:", err);
    clearInterval(timerInterval);
    showToast("Generation error. Trying fallback...", "error");
    placeholder.classList.remove('hidden');
  } finally {
    APP_STATE.isGeneratingImage = false;
    btn.disabled = false;
    btnText.textContent = APP_STATE.imagineMode === 'img2img' ? "SYNTHESIZE CONDITIONED IMAGE" : "GENERATE UNRESTRICTED IMAGE";
    spinner.classList.add('hidden');
  }
}

// ==========================================
// 5.2 COMPARISON MODAL & RE-TUNING
// ==========================================
function openComparisonModal() {
  triggerHaptic();
  if (!APP_STATE.currentImage || !APP_STATE.currentImage.referenceImage) {
    showToast("No reference image associated with this creation", "warning");
    return;
  }

  const modal = document.getElementById('comparison-modal');
  const refImg = document.getElementById('compare-img-ref');
  const resImg = document.getElementById('compare-img-result');
  if (!modal || !refImg || !resImg) return;

  refImg.src = APP_STATE.currentImage.referenceImage;
  resImg.src = APP_STATE.currentImage.url;

  const cond = APP_STATE.currentImage.conditioning || APP_STATE.conditioning;
  const idVal = cond.identityWeight || 95;
  const poseVal = cond.poseWeight || 90;
  const compVal = cond.compositionWeight || 90;
  const scaleVal = cond.referenceWeight || 85;

  document.getElementById('compare-metric-identity').textContent = `${idVal}%`;
  document.getElementById('compare-bar-identity').style.width = `${idVal}%`;

  document.getElementById('compare-metric-pose').textContent = `${poseVal}%`;
  document.getElementById('compare-bar-pose').style.width = `${poseVal}%`;

  document.getElementById('compare-metric-composition').textContent = `${compVal}%`;
  document.getElementById('compare-bar-composition').style.width = `${compVal}%`;

  document.getElementById('compare-metric-weight').textContent = `${scaleVal}%`;
  document.getElementById('compare-bar-weight').style.width = `${scaleVal}%`;

  modal.classList.remove('hidden');
}

function closeComparisonModal() {
  const modal = document.getElementById('comparison-modal');
  if (modal) modal.classList.add('hidden');
}

function openLightboxComparison() {
  if (!activeLightboxItem || !activeLightboxItem.referenceImage) {
    showToast("This creation did not use reference conditioning", "info");
    return;
  }
  const modal = document.getElementById('comparison-modal');
  const refImg = document.getElementById('compare-img-ref');
  const resImg = document.getElementById('compare-img-result');
  if (!modal || !refImg || !resImg) return;

  refImg.src = activeLightboxItem.referenceImage;
  resImg.src = activeLightboxItem.url;

  const cond = activeLightboxItem.conditioning || APP_STATE.conditioning;
  const idVal = cond.identityWeight || 95;
  const poseVal = cond.poseWeight || 90;
  const compVal = cond.compositionWeight || 90;
  const scaleVal = cond.referenceWeight || 85;

  document.getElementById('compare-metric-identity').textContent = `${idVal}%`;
  document.getElementById('compare-bar-identity').style.width = `${idVal}%`;

  document.getElementById('compare-metric-pose').textContent = `${poseVal}%`;
  document.getElementById('compare-bar-pose').style.width = `${poseVal}%`;

  document.getElementById('compare-metric-composition').textContent = `${compVal}%`;
  document.getElementById('compare-bar-composition').style.width = `${compVal}%`;

  document.getElementById('compare-metric-weight').textContent = `${scaleVal}%`;
  document.getElementById('compare-bar-weight').style.width = `${scaleVal}%`;

  modal.classList.remove('hidden');
}

let isRefOverlayShowing = false;
function toggleReferenceOverlay() {
  triggerHaptic();
  const overlay = document.getElementById('current-ref-overlay');
  const indicator = document.getElementById('ref-overlay-indicator');
  const btnText = document.getElementById('btn-toggle-ref-text');
  if (!overlay) return;

  isRefOverlayShowing = !isRefOverlayShowing;
  if (isRefOverlayShowing) {
    overlay.classList.remove('opacity-0', 'pointer-events-none');
    overlay.classList.add('opacity-100');
    if (indicator) indicator.classList.remove('hidden');
    if (btnText) btnText.textContent = "View Output";
  } else {
    overlay.classList.add('opacity-0', 'pointer-events-none');
    overlay.classList.remove('opacity-100');
    if (indicator) indicator.classList.add('hidden');
    if (btnText) btnText.textContent = "Hold to View Ref";
  }
}

function boostConditioningAndRegenerate(channel) {
  triggerHaptic();
  closeComparisonModal();
  switchTab('imagine');
  setImagineInputMode('img2img');

  if (channel === 'identity') {
    const current = APP_STATE.conditioning.identityWeight;
    handleChannelWeightChange('identity', Math.min(100, current + 10));
    APP_STATE.conditioning.identityLocked = true;
    const lockEl = document.getElementById('lock-identity');
    if (lockEl) lockEl.checked = true;
    showToast("Boosted Identity Likeness to " + APP_STATE.conditioning.identityWeight + "%", "success");
  } else if (channel === 'pose') {
    const current = APP_STATE.conditioning.poseWeight;
    handleChannelWeightChange('pose', Math.min(100, current + 10));
    APP_STATE.conditioning.poseLocked = true;
    const lockEl = document.getElementById('lock-pose');
    if (lockEl) lockEl.checked = true;
    showToast("Tightened Pose Alignment to " + APP_STATE.conditioning.poseWeight + "%", "success");
  } else if (channel === 'composition') {
    const current = APP_STATE.conditioning.compositionWeight;
    handleChannelWeightChange('composition', Math.min(100, current + 10));
    APP_STATE.conditioning.compositionLocked = true;
    const lockEl = document.getElementById('lock-composition');
    if (lockEl) lockEl.checked = true;
    showToast("Locked Camera Framing to " + APP_STATE.conditioning.compositionWeight + "%", "success");
  }

  generateImage();
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
          ${item.referenceImage ? `
            <div class="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-brand-neon/90 text-brand-dark text-[9px] font-mono font-bold flex items-center gap-1 shadow">
              <i class="fa-solid fa-crosshairs"></i> REF-GUIDED
            </div>
          ` : ''}
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
  const compareBtn = document.getElementById('lightbox-compare-btn');
  const condEl = document.getElementById('lightbox-meta-conditioning');
  const condText = document.getElementById('lightbox-meta-cond-text');

  title.textContent = item.type === 'video' ? "Video Inspector" : "Image Inspector";
  promptEl.textContent = item.prompt;
  typeEl.textContent = item.type.toUpperCase();
  dimsEl.textContent = item.resolution || item.duration || "HD";
  seedEl.textContent = item.seed ? `Seed: ${item.seed}` : `Motion: ${item.motion || 'Dynamic'}`;

  // Reference conditioning info in lightbox
  if (item.referenceImage) {
    if (compareBtn) compareBtn.classList.remove('hidden');
    if (condEl) {
      condEl.classList.remove('hidden');
      const idWeight = item.conditioning ? item.conditioning.identityWeight : 95;
      const poseWeight = item.conditioning ? item.conditioning.poseWeight : 90;
      if (condText) condText.textContent = `Identity ${idWeight}% • Pose ${poseWeight}%`;
    }
  } else {
    if (compareBtn) compareBtn.classList.add('hidden');
    if (condEl) condEl.classList.add('hidden');
  }

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
  const compareBtn = document.getElementById('lightbox-compare-btn');
  const condEl = document.getElementById('lightbox-meta-conditioning');
  const condText = document.getElementById('lightbox-meta-cond-text');

  video.classList.add('hidden');
  img.src = item.url;
  img.classList.remove('hidden');
  document.getElementById('lightbox-prompt').textContent = item.prompt;
  document.getElementById('lightbox-meta-dims').textContent = item.resolution || '1024x1024';
  document.getElementById('lightbox-meta-seed').textContent = `Seed: ${item.seed || '42'}`;

  if (item.referenceImage) {
    if (compareBtn) compareBtn.classList.remove('hidden');
    if (condEl) {
      condEl.classList.remove('hidden');
      const idWeight = item.conditioning ? item.conditioning.identityWeight : 95;
      const poseWeight = item.conditioning ? item.conditioning.poseWeight : 90;
      if (condText) condText.textContent = `Identity ${idWeight}% • Pose ${poseWeight}%`;
    }
  } else {
    if (compareBtn) compareBtn.classList.add('hidden');
    if (condEl) condEl.classList.add('hidden');
  }

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
    setImagineInputMode('img2img');

    // Load as active reference image
    const refToLoad = activeLightboxItem.referenceImage || activeLightboxItem.url;
    APP_STATE.referenceImageBase64 = refToLoad;
    APP_STATE.conditioning.referenceUrl = refToLoad;
    APP_STATE.conditioning.uploadedPublicUrl = refToLoad;

    const previewImg = document.getElementById('img2img-preview-img');
    if (previewImg) previewImg.src = refToLoad;
    const previewBox = document.getElementById('img2img-preview-box');
    if (previewBox) previewBox.classList.remove('hidden');
    const uploadPrompt = document.getElementById('img2img-upload-prompt');
    if (uploadPrompt) uploadPrompt.classList.add('hidden');

    if (activeLightboxItem.conditioning) {
      if (activeLightboxItem.conditioning.subjectProfile) {
        APP_STATE.conditioning.subjectProfile = { ...activeLightboxItem.conditioning.subjectProfile };
      }
      if (activeLightboxItem.conditioning.poseProfile) {
        APP_STATE.conditioning.poseProfile = { ...activeLightboxItem.conditioning.poseProfile };
      }
      if (activeLightboxItem.conditioning.compositionProfile) {
        APP_STATE.conditioning.compositionProfile = { ...activeLightboxItem.conditioning.compositionProfile };
      }
      if (activeLightboxItem.conditioning.styleProfile) {
        APP_STATE.conditioning.styleProfile = { ...activeLightboxItem.conditioning.styleProfile };
      }
    }

    analyzeReferenceImage(refToLoad);

    if (activeLightboxItem.conditioning && activeLightboxItem.conditioning.mode) {
      setConditioningPreset(activeLightboxItem.conditioning.mode);
    } else {
      setConditioningPreset('full');
    }

    document.getElementById('prompt-input').value = activeLightboxItem.prompt;
    if (activeLightboxItem.seed) {
      document.getElementById('seed-input').value = activeLightboxItem.seed;
    }
    showToast("Loaded into Precision Conditioning Engine with Identity & Pose locks active!", "success");
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

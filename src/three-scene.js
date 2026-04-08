// ══════════════════════════════════════════════════════════
// ZENTYPE — 3D Dojo Scene (Three.js)
// A real 3D dojo hallway — pillars, walls, floor depth,
// torii gate, hanging lanterns, sakura petals, 3D keyboard
// ══════════════════════════════════════════════════════════

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';
import { Text } from 'troika-three-text';

// GLTF model loader — for loading real 3D models
const gltfLoader = new GLTFLoader();

// ── Core state ────────────────────────────────────────────────────
let renderer, scene, camera, composer, bloomPass;
let animId = null;
let isRunning = false;
let currentWPM = 0;
let clock;

// Petals
let PETAL_COUNT = 250;
let petalMesh = null;
let petalData = [];
const dummy = new THREE.Object3D();
const _tmpColor = new THREE.Color();

// Keypress light
let keypressLight = null;
let keypressFlash = 0;
// Flash colors now in COLOR_THEMES

// Lantern lights (for flicker animation)
let lanternLights = [];
let time = 0;

// Scene type
let sceneType = 'dojo'; // 'dojo' | 'forge'

// Forge-specific state
let emberMesh = null;
let emberData = [];
let EMBER_COUNT = 300;
let brazierLights = [];

// Camera presets per scene
const CAM_PRESETS = {
    dojo: [
        { label: 'Corridor',   pos: [0, 2.2, 10],  look: [0, 1.5, -10], sway: [0.05, 0.25, 0.08, 0.08, 0.035, 0.1] },
        { label: 'Low Walk',   pos: [0, 1.2, 10],   look: [0, 1.0, -10], sway: [0.04, 0.2, 0.06, 0.06, 0.03, 0.08] },
        { label: 'High View',  pos: [0, 4.0, 10],   look: [0, 1.0, -10], sway: [0.03, 0.15, 0.05, 0.05, 0.025, 0.06] },
    ],
    forge: [
        { label: 'Forge Hall', pos: [0, 1.8, 10],   look: [0, 1.4, -10], sway: [0.04, 0.2, 0.07, 0.06, 0.03, 0.08] },
        { label: 'Anvil View', pos: [0, 1.4, 10],   look: [0, 1.0, -10], sway: [0.035, 0.18, 0.06, 0.05, 0.025, 0.06] },
        { label: 'Overhead',   pos: [0, 3.5, 10],   look: [0, 0.8, -10], sway: [0.03, 0.12, 0.04, 0.04, 0.02, 0.05] },
    ],
    zen: [
        { label: 'Garden Path', pos: [0, 1.6, 8],   look: [0, 0.6, -4],  sway: [0.02, 0.12, 0.035, 0.04, 0.015, 0.04] },
        { label: 'Pond Side',   pos: [-2, 1.2, 0],  look: [0, 0.3, -4],  sway: [0.018, 0.08, 0.03, 0.03, 0.012, 0.03] },
        { label: 'Overview',    pos: [0, 3.0, 10],  look: [0, 0.5, -5],  sway: [0.025, 0.15, 0.04, 0.04, 0.018, 0.05] },
        { label: 'Bamboo Edge', pos: [-3.5, 1.4, 2], look: [0, 0.5, -4], sway: [0.015, 0.06, 0.025, 0.03, 0.01, 0.02] },
    ],
};
let currentCamPreset = 0;

// Zen Garden state
let fireflyMesh = null;
let fireflyData = [];
let FIREFLY_COUNT = 150;
let zenLanternLights = [];
let reflectorMesh = null;
let zenGroundMesh = null;
let zenGroundType = 'obsidian'; // 'obsidian' | 'stone'

// 3D Keyboard
const KEYBOARD_ROWS = [
    { keys: ['q','w','e','r','t','y','u','i','o','p'], offset: 0 },
    { keys: ['a','s','d','f','g','h','j','k','l'],     offset: 0.32 },
    { keys: ['z','x','c','v','b','n','m'],              offset: 0.72 },
];

// Sculpted profile — dramatic enough to be visible from camera angle
const ROW_PROFILE = [
    { dy:  0.16, rx:  0.26, ky: 1.32 },  // Row 0 (QWERTY) — tallest, leans back
    { dy:  0.08, rx:  0.10, ky: 1.14 },  // Row 1 (ASDF)   — home row
    { dy:  0.00, rx: -0.13, ky: 1.00 },  // Row 2 (ZXCV)   — front row, leans forward
];
const SPACE_PROFILE = { dy: -0.035, rx: 0, ky: 0.80 }; // spacebar — lowest, flat
const KEY_W = 0.55;
const KEY_D = 0.55;
const KEY_H = 0.20;
const KEY_GAP = 0.06;
const KEY_PRESS_DEPTH = 0.13;
const SPACE_W = 3.6;
let keys3D = {};
let keyboardGroup = null;
let queueScrollSpeed = 2.2;
let exitAnimMode = 'slash'; // 'slash' | 'drip' | 'vortex' | 'glitch' | 'ignite' | 'ink-burst' | 'ghost-dissolve' | 'ember-ash' | 'katana-cut' | 'kanji-morph'

// ── Exit particle pool (ink-burst, ember-ash, blood-rain, crystal-freeze, lava-burst, poison-drip, gilded-cascade) ────────────
const EXIT_PARTICLE_MAX = 1200;
let exitParticleMax = EXIT_PARTICLE_MAX; // runtime cap — lowered by quality slider
let exitParticleMesh = null;
let exitParticleData = []; // { x,y,z, vx,vy,vz, life, decay, r,g,b }

// ── Cached key array (avoids Object.values() alloc every frame) ──
let keys3DArray = [];
const _epDummy = new THREE.Object3D();
const _epColor  = new THREE.Color();

// ── Katana slash mesh ─────────────────────────────────────
let slashMesh = null;
let slashAnim = null; // { elapsed, duration, posY, posZ }

// ── Ghost dissolve planes ─────────────────────────────────
let ghostPlanes = []; // { mesh, elapsed, duration }

// ── Lightning arc ─────────────────────────────────────────
let lightningLine = null;
let lightningAnim = null; // { elapsed, duration, posY, posZ, width }
const LIGHTNING_SEGS = 16;

// 3D Text (troika-three-text)
// 3D Word Queue
const QUEUE_SLOTS = [
    { y: 2.5, z: 5.5, size: 0.62, opacity: 1.0 },  // slot 0: CURRENT — big, bright
    { y: 1.2, z: 3.8, size: 0.36, opacity: 0.50 },  // slot 1: next
    { y: 0.3, z: 2.5, size: 0.26, opacity: 0.30 },  // slot 2
    { y: -0.3, z: 1.5, size: 0.20, opacity: 0.18 },  // slot 3
    { y: -0.7, z: 0.8, size: 0.15, opacity: 0.10 },  // slot 4: far
];
// Color themes
const COLOR_THEMES = {
    default:   { correct: 0x44ffff, flash: [0x00d4ff, 0xff6bca, 0xffd700, 0x44ffaa, 0xff4444], mode: 'single' },
    sakura:    { correct: 0xff88cc, flash: [0xff6bca, 0xff99dd, 0xffaaee, 0xff44aa, 0xff77bb], mode: 'single' },
    crimson:   { correct: 0xff4422, flash: [0xff4400, 0xff6622, 0xff8844, 0xffaa33, 0xff3311], mode: 'single' },
    emerald:   { correct: 0x44ff88, flash: [0x22ff66, 0x44ffaa, 0x00dd55, 0x66ffbb, 0x33ff77], mode: 'single' },
    amber:     { correct: 0xffcc44, flash: [0xffaa00, 0xffcc33, 0xffdd55, 0xff8800, 0xffbb22], mode: 'single' },
    phantom:   { correct: 0xeeeeff, flash: [0xaaaaff, 0x8888cc, 0xccccff, 0x6666aa, 0xddddff], mode: 'single' },
    // Rainbow — each key row is a different color
    rainbow:   { correct: 0xffffff, flash: [0xff0000, 0xff8800, 0xffff00, 0x00ff44, 0x0088ff, 0xaa00ff], mode: 'rainbow',
                 rows: [0xff2244, 0xff8800, 0xffdd00, 0x00cc66] },
    // Synthwave — pink/purple/cyan vaporwave
    synthwave: { correct: 0xff44ff, flash: [0xff00ff, 0xcc00ff, 0xff44cc, 0x8800ff, 0xff0088], mode: 'gradient',
                 gradient: [0xff0088, 0xff00ff, 0x8800ff] },
    // Lava — red/orange/yellow heat map
    lava:      { correct: 0xff6600, flash: [0xff0000, 0xff3300, 0xff6600, 0xff9900, 0xffcc00], mode: 'gradient',
                 gradient: [0xff0000, 0xff6600, 0xffcc00] },
    // Ice — white/blue frozen
    ice:       { correct: 0x88ddff, flash: [0xaaeeff, 0x66ccff, 0x44bbff, 0xccf0ff, 0x88ddff], mode: 'gradient',
                 gradient: [0xffffff, 0x88ddff, 0x4488ff] },
    // Toxic — neon green/yellow
    toxic:     { correct: 0x88ff00, flash: [0x88ff00, 0xaaff22, 0xccff44, 0x66dd00, 0xbbff33], mode: 'gradient',
                 gradient: [0xccff00, 0x88ff00, 0x44cc00] },
};

let currentTheme = COLOR_THEMES.default;
const C_UNTYPED  = 0x8899aa;
const C_ACTIVE   = 0xccddff;
const C_CORRECT  = 0x44ffff;
const C_WRONG    = 0xff5555;

let textGroup = null;
let queueEntries = [];   // { mesh, charMeshes, word, slot, posY, posZ, opacity, dying }
let dyingEntries = [];   // completed words flying away

// ══════════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════════
export function initThreeScene(canvas) {
    if (isRunning) return;
    clock = new THREE.Clock();

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 100);

    if (sceneType === 'forge') {
        scene.background = new THREE.Color(0x0a0402);
        scene.fog = new THREE.FogExp2(0x0a0402, 0.038);
        const fCam = CAM_PRESETS.forge[currentCamPreset] || CAM_PRESETS.forge[0];
        camera.position.set(...fCam.pos);
        camera.lookAt(...fCam.look);

        buildForgeLighting();
        buildForgeFloor();
        buildStoneColumns();
        buildCaveWalls();
        buildRockCeiling();
        buildGreatAnvil();
        buildForgeBraziers();
        buildChains();
        buildEmbers();
    } else if (sceneType === 'zen') {
        scene.background = new THREE.Color(0x030320);
        scene.fog = new THREE.FogExp2(0x030320, 0.02);
        const zCam = CAM_PRESETS.zen[currentCamPreset] || CAM_PRESETS.zen[0];
        camera.position.set(...zCam.pos);
        camera.lookAt(...zCam.look);

        // HDRI sky — real 360° night sky as background + environment map
        new EXRLoader().load('models/zen/NightSkyHDRI008_1K_HDR.exr', (exr) => {
            const pmrem = new THREE.PMREMGenerator(renderer);
            const envMap = pmrem.fromEquirectangular(exr).texture;
            scene.environment = envMap;    // lights PBR models
            scene.background = envMap;     // real night sky as background
            scene.environmentIntensity = 0.2;
            exr.dispose();
            pmrem.dispose();
        });

        buildZenLighting();
        buildZenSky();
        buildZenGround();
        buildKoiPond();
        buildStoneLanterns();
        buildToriiGateZen();
        buildGuardianLions();
        buildGardenRocks();
        buildSteppingStones();
        buildWoodenBridge();
        buildMossPatches();
        buildGroundMist();
    } else {
        scene.background = new THREE.Color(0x020208);
        scene.fog = new THREE.FogExp2(0x020208, 0.045);
        const dCam = CAM_PRESETS.dojo[currentCamPreset] || CAM_PRESETS.dojo[0];
        camera.position.set(...dCam.pos);
        camera.lookAt(...dCam.look);

        buildLighting();
        buildFloor();
        buildPillars();
        buildWalls();
        buildCeilingBeams();
        buildToriiGate();
        buildHangingLanterns();
        buildSakuraPetals();
    }

    buildKeyboard();
    buildExitParticles();
    buildSlashMesh();
    buildLightningMesh();
    buildPostProcessing();

    window.addEventListener('resize', handleResize);
    document.addEventListener('keydown', onDocKeyDown);
    document.addEventListener('keyup', onDocKeyUp);
    isRunning = true;
    animate();
}

// ══════════════════════════════════════════════════════════
// LIGHTING
// ══════════════════════════════════════════════════════════
function buildLighting() {
    // Ambient — very dim blue
    scene.add(new THREE.AmbientLight(0x0a0a1a, 1.0));

    // Moonlight from above-right — gives depth to all surfaces
    const moon = new THREE.DirectionalLight(0x1a2255, 1.2);
    moon.position.set(5, 15, 8);
    moon.castShadow = true;
    moon.shadow.mapSize.set(1024, 1024);
    moon.shadow.camera.near = 0.5;
    moon.shadow.camera.far = 60;
    moon.shadow.camera.left = -15;
    moon.shadow.camera.right = 15;
    moon.shadow.camera.top = 15;
    moon.shadow.camera.bottom = -15;
    scene.add(moon);

    // Floor uplight — violet rim
    const floorRim = new THREE.PointLight(0x4400aa, 1.2, 12);
    floorRim.position.set(0, 0.1, 5);
    scene.add(floorRim);

    // Keypress reactive light
    keypressLight = new THREE.PointLight(0x00d4ff, 0, 15);
    keypressLight.position.set(0, 3, 6);
    scene.add(keypressLight);
}

// ══════════════════════════════════════════════════════════
// FLOOR — visible grid receding into the distance
// ══════════════════════════════════════════════════════════
function buildFloor() {
    // Dark floor surface
    const floorGeo = new THREE.PlaneGeometry(12, 50);
    const floorMat = new THREE.MeshStandardMaterial({
        color: 0x0a0510,
        roughness: 0.6,
        metalness: 0.15,
        emissive: 0x060312,
        emissiveIntensity: 0.4,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, -10);
    floor.receiveShadow = true;
    scene.add(floor);

    // Bright glowing grid — THIS is what sells the 3D perspective
    const grid = new THREE.GridHelper(50, 50, 0x5522cc, 0x2a1166);
    grid.position.set(0, 0.02, -10);
    grid.material.opacity = 0.6;
    grid.material.transparent = true;
    scene.add(grid);

    // Mirror reflection plane
    const reflGeo = new THREE.PlaneGeometry(10, 40);
    const reflMat = new THREE.MeshStandardMaterial({
        color: 0x000000,
        roughness: 0.0,
        metalness: 1.0,
        opacity: 0.18,
        transparent: true,
    });
    const refl = new THREE.Mesh(reflGeo, reflMat);
    refl.rotation.x = -Math.PI / 2;
    refl.position.set(0, 0.03, -8);
    scene.add(refl);
}

// ══════════════════════════════════════════════════════════
// PILLARS — colonnade on both sides, receding into distance
// This is the #1 thing that makes it feel 3D
// ══════════════════════════════════════════════════════════
function buildPillars() {
    const pillarMat = new THREE.MeshStandardMaterial({
        color: 0x5a1212,
        roughness: 0.55,
        metalness: 0.1,
        emissive: 0x2a0808,
        emissiveIntensity: 0.8,
    });

    const pillarBaseMat = new THREE.MeshStandardMaterial({
        color: 0x1a0808,
        roughness: 0.9,
        emissive: 0x0a0303,
        emissiveIntensity: 0.4,
    });

    // 7 pairs of pillars going into the distance
    for (let i = 0; i < 7; i++) {
        const z = 4 - i * 4.5; // from z=4 (near camera) to z=-27 (deep)

        for (const side of [-1, 1]) {
            const x = side * 5;

            // Main pillar shaft
            const shaft = new THREE.Mesh(
                new THREE.CylinderGeometry(0.22, 0.26, 7, 10),
                pillarMat
            );
            shaft.position.set(x, 3.5, z);
            shaft.castShadow = true;
            shaft.receiveShadow = true;
            scene.add(shaft);

            // Pillar base
            const base = new THREE.Mesh(
                new THREE.CylinderGeometry(0.35, 0.4, 0.3, 10),
                pillarBaseMat
            );
            base.position.set(x, 0.15, z);
            scene.add(base);

            // Pillar cap
            const cap = new THREE.Mesh(
                new THREE.CylinderGeometry(0.35, 0.22, 0.25, 10),
                pillarBaseMat
            );
            cap.position.set(x, 7.1, z);
            scene.add(cap);
        }
    }
}

// ══════════════════════════════════════════════════════════
// WALLS — shoji screen panels between pillars
// ══════════════════════════════════════════════════════════
function buildWalls() {
    const shojiMat = new THREE.MeshStandardMaterial({
        color: 0xccbbaa,
        roughness: 0.95,
        transparent: true,
        opacity: 0.06,
        emissive: 0x443322,
        emissiveIntensity: 0.25,
        side: THREE.DoubleSide,
    });

    // Grid frame material for shoji
    const frameMat = new THREE.MeshStandardMaterial({
        color: 0x2a0a08,
        roughness: 0.8,
        emissive: 0x120404,
        emissiveIntensity: 0.5,
    });

    for (let i = 0; i < 6; i++) {
        const z = 4 - i * 4.5 - 2.25; // between pillars

        for (const side of [-1, 1]) {
            const x = side * 5;

            // Shoji paper panel
            const panel = new THREE.Mesh(
                new THREE.PlaneGeometry(0.1, 6.5),
                shojiMat
            );
            panel.position.set(x, 3.5, z);
            panel.rotation.y = Math.PI / 2;
            panel.scale.x = 40; // stretch the thin plane
            scene.add(panel);

            // Horizontal frame bars
            for (let h = 1; h < 7; h++) {
                const bar = new THREE.Mesh(
                    new THREE.BoxGeometry(0.05, 0.03, 4),
                    frameMat
                );
                bar.position.set(x, h, z);
                bar.rotation.y = Math.PI / 2;
                scene.add(bar);
            }

            // Vertical frame bar (center)
            const vbar = new THREE.Mesh(
                new THREE.BoxGeometry(0.05, 6.5, 0.03),
                frameMat
            );
            vbar.position.set(x, 3.5, z);
            scene.add(vbar);
        }
    }
}

// ══════════════════════════════════════════════════════════
// CEILING BEAMS — cross beams overhead for depth
// ══════════════════════════════════════════════════════════
function buildCeilingBeams() {
    const beamMat = new THREE.MeshStandardMaterial({
        color: 0x1a0808,
        roughness: 0.85,
        emissive: 0x0a0404,
        emissiveIntensity: 0.4,
    });

    for (let i = 0; i < 7; i++) {
        const z = 4 - i * 4.5;

        // Cross beam
        const beam = new THREE.Mesh(
            new THREE.BoxGeometry(10.5, 0.25, 0.3),
            beamMat
        );
        beam.position.set(0, 7.2, z);
        beam.castShadow = true;
        scene.add(beam);
    }

    // Longitudinal side beams (running along the corridor)
    for (const side of [-1, 1]) {
        const sideBeam = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.2, 35),
            beamMat
        );
        sideBeam.position.set(side * 5, 7.25, -10);
        scene.add(sideBeam);
    }
}

// ══════════════════════════════════════════════════════════
// TORII GATE — massive, at the end of the hallway
// ══════════════════════════════════════════════════════════
function buildToriiGate() {
    const mat = new THREE.MeshStandardMaterial({
        color: 0x8b1515,
        roughness: 0.5,
        metalness: 0.12,
        emissive: 0x4a0808,
        emissiveIntensity: 1.2,
    });

    const Z = -22;

    const add = (geo, x, y, z) => {
        const m = new THREE.Mesh(geo, mat);
        m.position.set(x, y, z);
        m.castShadow = true;
        scene.add(m);
        return m;
    };

    // Massive pillars
    add(new THREE.CylinderGeometry(0.3, 0.35, 10, 12), -3.5, 5, Z);
    add(new THREE.CylinderGeometry(0.3, 0.35, 10, 12), 3.5, 5, Z);

    // Top kasagi beam
    add(new THREE.BoxGeometry(9.5, 0.6, 0.65), 0, 10.5, Z);

    // Shimagi
    add(new THREE.BoxGeometry(8.5, 0.3, 0.5), 0, 9.8, Z);

    // Nuki (lower beam)
    add(new THREE.BoxGeometry(7.5, 0.35, 0.45), 0, 8.5, Z);

    // End knobs on kasagi
    const knob = new THREE.CylinderGeometry(0.35, 0.35, 0.75, 8);
    add(knob, -4.8, 10.5, Z);
    add(knob, 4.8, 10.5, Z);

    // Central hanging lantern
    const lanternGeo = new THREE.SphereGeometry(0.3, 10, 10);
    const lanternMat = new THREE.MeshStandardMaterial({
        color: 0xff4400,
        emissive: 0xff3300,
        emissiveIntensity: 4,
        roughness: 0,
    });
    const lantern = new THREE.Mesh(lanternGeo, lanternMat);
    lantern.position.set(0, 8.5, Z + 0.4);
    scene.add(lantern);

    // Torii deep red glow
    const glow = new THREE.PointLight(0xff2200, 4, 15);
    glow.position.set(0, 6, Z + 2);
    scene.add(glow);

    // Ground fire pots on each side of gate
    for (const side of [-1, 1]) {
        const potGeo = new THREE.CylinderGeometry(0.2, 0.3, 0.5, 8);
        const pot = new THREE.Mesh(potGeo, new THREE.MeshStandardMaterial({
            color: 0x222222,
            roughness: 0.8,
        }));
        pot.position.set(side * 2.5, 0.25, Z + 1);
        scene.add(pot);

        // Fire glow
        const fireGeo = new THREE.SphereGeometry(0.15, 6, 6);
        const fireMat = new THREE.MeshStandardMaterial({
            color: 0xff6600,
            emissive: 0xff4400,
            emissiveIntensity: 3,
        });
        const fire = new THREE.Mesh(fireGeo, fireMat);
        fire.position.set(side * 2.5, 0.6, Z + 1);
        scene.add(fire);

        const fireLight = new THREE.PointLight(0xff5500, 2, 6);
        fireLight.position.set(side * 2.5, 0.8, Z + 1);
        lanternLights.push(fireLight);
        scene.add(fireLight);
    }
}

// ══════════════════════════════════════════════════════════
// HANGING LANTERNS — actual 3D geometry with warm light
// ══════════════════════════════════════════════════════════
function buildHangingLanterns() {
    const bodyMat = new THREE.MeshStandardMaterial({
        color: 0xff6633,
        emissive: 0xff4411,
        emissiveIntensity: 2.5,
        roughness: 0.3,
        transparent: true,
        opacity: 0.9,
    });
    const frameMat = new THREE.MeshStandardMaterial({
        color: 0x1a0a05,
        roughness: 0.8,
    });

    const positions = [
        // Near
        [-2.5, 5.5, 2],
        [2.5, 5.5, 2],
        // Mid
        [-2.5, 5.5, -7],
        [2.5, 5.5, -7],
        // Far
        [-2.5, 5.5, -16],
        [2.5, 5.5, -16],
        // Center
        [0, 5.8, -2.5],
        [0, 5.8, -11.5],
    ];

    for (const [x, y, z] of positions) {
        // Lantern body — cylindrical with glow
        const body = new THREE.Mesh(
            new THREE.CylinderGeometry(0.18, 0.18, 0.45, 8),
            bodyMat
        );
        body.position.set(x, y, z);
        scene.add(body);

        // Top/bottom caps
        for (const dy of [-0.25, 0.25]) {
            const cap = new THREE.Mesh(
                new THREE.CylinderGeometry(0.22, 0.22, 0.05, 8),
                frameMat
            );
            cap.position.set(x, y + dy, z);
            scene.add(cap);
        }

        // Hanging chain
        const chain = new THREE.Mesh(
            new THREE.CylinderGeometry(0.015, 0.015, 1.4, 4),
            frameMat
        );
        chain.position.set(x, y + 0.95, z);
        scene.add(chain);

        // Light
        const light = new THREE.PointLight(0xff7733, 2.5, 9);
        light.position.set(x, y, z);
        lanternLights.push(light);
        scene.add(light);
    }
}

// ══════════════════════════════════════════════════════════
// SAKURA PETALS — instanced mesh floating through the dojo
// ══════════════════════════════════════════════════════════
function buildSakuraPetals() {
    const geo = new THREE.PlaneGeometry(0.15, 0.11);
    const mat = new THREE.MeshStandardMaterial({
        color: 0xffccdd,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
        emissive: 0xff6688,
        emissiveIntensity: 0.5,
        roughness: 0.8,
    });

    petalMesh = new THREE.InstancedMesh(geo, mat, PETAL_COUNT);
    petalMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    petalData = [];
    for (let i = 0; i < PETAL_COUNT; i++) {
        petalData.push(randomPetal());
        const p = petalData[i];
        dummy.position.set(p.x, p.y, p.z);
        dummy.rotation.set(p.rx, p.ry, p.rz);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        petalMesh.setMatrixAt(i, dummy.matrix);
    }
    petalMesh.instanceMatrix.needsUpdate = true;
    scene.add(petalMesh);
}

function randomPetal(fromRight = false) {
    return {
        x: fromRight ? 8 + Math.random() * 4 : (Math.random() - 0.5) * 12,
        y: Math.random() * 7 + 0.5,
        z: Math.random() * 35 - 25,  // spread along the dojo corridor
        rx: Math.random() * Math.PI * 2,
        ry: Math.random() * Math.PI * 2,
        rz: Math.random() * Math.PI * 2,
        vx: -(Math.random() * 0.015 + 0.005),
        vy: -(Math.random() * 0.006 + 0.002),
        vz: (Math.random() - 0.5) * 0.004,
        vrx: (Math.random() - 0.5) * 0.035,
        vry: (Math.random() - 0.5) * 0.03,
        vrz: (Math.random() - 0.5) * 0.035,
        phase: Math.random() * Math.PI * 2,
        wobble: 0.001 + Math.random() * 0.002,
    };
}

// ══════════════════════════════════════════════════════════
// NORDIC FORGE — Scene builders
// ══════════════════════════════════════════════════════════

function buildForgeLighting() {
    // Warm dim ambient
    scene.add(new THREE.AmbientLight(0x1a0a04, 0.8));

    // Overhead — fire-lit from above
    const overhead = new THREE.DirectionalLight(0x331808, 1.0);
    overhead.position.set(3, 12, -5);
    overhead.castShadow = true;
    overhead.shadow.mapSize.set(1024, 1024);
    overhead.shadow.camera.near = 0.5;
    overhead.shadow.camera.far = 60;
    overhead.shadow.camera.left = -15;
    overhead.shadow.camera.right = 15;
    overhead.shadow.camera.top = 15;
    overhead.shadow.camera.bottom = -15;
    scene.add(overhead);

    // Lava underglow
    const lavaGlow1 = new THREE.PointLight(0xff4400, 2.5, 15);
    lavaGlow1.position.set(0, 0.3, -5);
    scene.add(lavaGlow1);
    const lavaGlow2 = new THREE.PointLight(0xff4400, 2.0, 15);
    lavaGlow2.position.set(0, 0.3, -15);
    scene.add(lavaGlow2);

    // Keypress reactive light — orange for forge
    keypressLight = new THREE.PointLight(0xff6600, 0, 15);
    keypressLight.position.set(0, 3, 6);
    scene.add(keypressLight);
}

function buildForgeFloor() {
    // Dark stone floor
    const stoneGeo = new THREE.PlaneGeometry(14, 50);
    const stoneMat = new THREE.MeshStandardMaterial({
        color: 0x1a1210,
        roughness: 0.85,
        metalness: 0.05,
        emissive: 0x0a0604,
        emissiveIntensity: 0.3,
    });
    const stone = new THREE.Mesh(stoneGeo, stoneMat);
    stone.rotation.x = -Math.PI / 2;
    stone.position.set(0, 0, -10);
    stone.receiveShadow = true;
    scene.add(stone);

    // Lava channels — two glowing strips
    const lavaMat = new THREE.MeshStandardMaterial({
        color: 0xff4400,
        emissive: 0xff3300,
        emissiveIntensity: 3.0,
        roughness: 0.2,
    });
    for (const side of [-1, 1]) {
        const lava = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 40), lavaMat);
        lava.rotation.x = -Math.PI / 2;
        lava.position.set(side * 2.8, 0.02, -10);
        scene.add(lava);

        // Lava channel light
        const light = new THREE.PointLight(0xff5500, 1.5, 4);
        light.position.set(side * 2.8, 0.2, 0);
        brazierLights.push(light);
        scene.add(light);
    }

    // Subtle reflection plane
    const reflMat = new THREE.MeshStandardMaterial({
        color: 0x000000, roughness: 0.0, metalness: 1.0,
        opacity: 0.1, transparent: true,
    });
    const refl = new THREE.Mesh(new THREE.PlaneGeometry(10, 40), reflMat);
    refl.rotation.x = -Math.PI / 2;
    refl.position.set(0, 0.03, -8);
    scene.add(refl);
}

function buildStoneColumns() {
    const stoneMat = new THREE.MeshStandardMaterial({
        color: 0x2a2420,
        roughness: 0.9,
        metalness: 0.0,
        emissive: 0x0a0806,
        emissiveIntensity: 0.3,
    });
    const baseMat = new THREE.MeshStandardMaterial({
        color: 0x1a1410, roughness: 0.95,
        emissive: 0x060504, emissiveIntensity: 0.3,
    });
    const runeMat = new THREE.MeshStandardMaterial({
        color: 0x2244aa,
        emissive: 0x1133ff,
        emissiveIntensity: 2.5,
        roughness: 0.3,
    });

    for (let i = 0; i < 6; i++) {
        const z = 4 - i * 5;
        for (const side of [-1, 1]) {
            const x = side * 5;

            // Thick stone column
            const col = new THREE.Mesh(
                new THREE.CylinderGeometry(0.35, 0.40, 7, 8),
                stoneMat
            );
            col.position.set(x, 3.5, z);
            col.castShadow = true;
            col.receiveShadow = true;
            scene.add(col);

            // Base
            const base = new THREE.Mesh(
                new THREE.CylinderGeometry(0.5, 0.55, 0.4, 8),
                baseMat
            );
            base.position.set(x, 0.2, z);
            scene.add(base);

            // Rune ring — glowing blue torus
            const runeY = 3.5 + (i % 3) * 0.6 - 0.6;
            const rune = new THREE.Mesh(
                new THREE.TorusGeometry(0.38, 0.03, 6, 16),
                runeMat
            );
            rune.position.set(x, runeY, z);
            rune.rotation.x = Math.PI / 2;
            scene.add(rune);

            // Second rune ring offset
            const rune2 = new THREE.Mesh(
                new THREE.TorusGeometry(0.38, 0.025, 6, 16),
                runeMat
            );
            rune2.position.set(x, runeY - 1.2, z);
            rune2.rotation.x = Math.PI / 2;
            scene.add(rune2);

            // Rune glow
            const runeLight = new THREE.PointLight(0x2244ff, 0.8, 3);
            runeLight.position.set(x, runeY, z);
            brazierLights.push(runeLight);
            scene.add(runeLight);
        }
    }
}

function buildCaveWalls() {
    const wallMat = new THREE.MeshStandardMaterial({
        color: 0x1a1614,
        roughness: 0.95,
        metalness: 0,
        emissive: 0x080604,
        emissiveIntensity: 0.3,
        side: THREE.DoubleSide,
    });

    for (let i = 0; i < 6; i++) {
        const z = 4 - i * 5 - 2.5;
        for (const side of [-1, 1]) {
            const x = side * 5.5;
            const panel = new THREE.Mesh(
                new THREE.PlaneGeometry(0.1, 7),
                wallMat
            );
            panel.position.set(x, 3.5, z);
            panel.rotation.y = Math.PI / 2;
            panel.scale.x = 40;
            scene.add(panel);
        }
    }
}

function buildRockCeiling() {
    const ceilMat = new THREE.MeshStandardMaterial({
        color: 0x141210,
        roughness: 0.95,
        emissive: 0x060504,
        emissiveIntensity: 0.2,
    });
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(14, 45), ceilMat);
    ceil.rotation.x = Math.PI / 2;
    ceil.position.set(0, 7.5, -10);
    scene.add(ceil);

    // Cross beams — heavy stone
    const beamMat = new THREE.MeshStandardMaterial({
        color: 0x1a1614, roughness: 0.9,
        emissive: 0x0a0806, emissiveIntensity: 0.3,
    });
    for (let i = 0; i < 6; i++) {
        const beam = new THREE.Mesh(
            new THREE.BoxGeometry(11, 0.35, 0.5), beamMat
        );
        beam.position.set(0, 7.3, 4 - i * 5);
        beam.castShadow = true;
        scene.add(beam);
    }

    // Aurora crack — green glow through the rock
    const auroraMat = new THREE.MeshStandardMaterial({
        color: 0x22ff66,
        emissive: 0x11ff44,
        emissiveIntensity: 3.0,
        transparent: true,
        opacity: 0.35,
    });
    const aurora = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 35), auroraMat);
    aurora.rotation.x = Math.PI / 2;
    aurora.position.set(0.3, 7.48, -10);
    scene.add(aurora);

    // Aurora light
    const auroraLight = new THREE.PointLight(0x22ff88, 1.5, 14);
    auroraLight.position.set(0, 7, -8);
    scene.add(auroraLight);
}

function buildGreatAnvil() {
    const anvilMat = new THREE.MeshStandardMaterial({
        color: 0x333333, roughness: 0.4, metalness: 0.8,
        emissive: 0x111111, emissiveIntensity: 0.5,
    });
    const Z = -22;

    // Stone pedestal
    const pedestal = new THREE.Mesh(
        new THREE.CylinderGeometry(1.2, 1.5, 1.5, 10),
        new THREE.MeshStandardMaterial({ color: 0x1a1612, roughness: 0.95 })
    );
    pedestal.position.set(0, 0.75, Z);
    scene.add(pedestal);

    // Anvil body
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.0, 1.2), anvilMat);
    body.position.set(0, 2.0, Z);
    body.castShadow = true;
    scene.add(body);

    // Wider top plate
    const top = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.25, 1.4), anvilMat);
    top.position.set(0, 2.65, Z);
    scene.add(top);

    // Horn
    const horn = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.8, 6), anvilMat);
    horn.position.set(1.4, 2.55, Z);
    horn.rotation.z = -Math.PI / 2;
    scene.add(horn);

    // Forge fire behind anvil
    const fireMat = new THREE.MeshStandardMaterial({
        color: 0xff6600, emissive: 0xff4400, emissiveIntensity: 4, roughness: 0,
    });
    const fire = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), fireMat);
    fire.position.set(0, 1.0, Z - 1);
    scene.add(fire);

    // Hero forge glow
    const forgeGlow = new THREE.PointLight(0xff5500, 5, 15);
    forgeGlow.position.set(0, 3, Z + 1);
    scene.add(forgeGlow);

    // Side fire pots
    for (const side of [-1, 1]) {
        const pot = new THREE.Mesh(
            new THREE.CylinderGeometry(0.25, 0.35, 0.6, 8),
            new THREE.MeshStandardMaterial({ color: 0x1a1612, roughness: 0.9 })
        );
        pot.position.set(side * 3, 0.3, Z + 1);
        scene.add(pot);

        const flame = new THREE.Mesh(new THREE.SphereGeometry(0.2, 6, 6), fireMat);
        flame.position.set(side * 3, 0.7, Z + 1);
        scene.add(flame);

        const fLight = new THREE.PointLight(0xff5500, 2, 6);
        fLight.position.set(side * 3, 0.9, Z + 1);
        brazierLights.push(fLight);
        scene.add(fLight);
    }
}

function buildForgeBraziers() {
    const brassMat = new THREE.MeshStandardMaterial({
        color: 0x2a2420, roughness: 0.8, metalness: 0.2,
    });
    const fireMat = new THREE.MeshStandardMaterial({
        color: 0xff6633, emissive: 0xff4411, emissiveIntensity: 3.0, roughness: 0,
    });

    const positions = [
        [-2.5, 0, 2],  [2.5, 0, 2],
        [-2.5, 0, -7], [2.5, 0, -7],
        [-2.5, 0, -16],[2.5, 0, -16],
        [0, 0, -2.5],  [0, 0, -12],
    ];

    for (const [x, , z] of positions) {
        // Stone base
        const base = new THREE.Mesh(
            new THREE.CylinderGeometry(0.25, 0.35, 0.8, 8), brassMat
        );
        base.position.set(x, 0.4, z);
        scene.add(base);

        // Bowl
        const bowl = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.22, 0.22, 8, 1, true), brassMat
        );
        bowl.position.set(x, 0.92, z);
        scene.add(bowl);

        // Flame
        const flame = new THREE.Mesh(
            new THREE.SphereGeometry(0.18, 6, 6), fireMat
        );
        flame.position.set(x, 1.15, z);
        scene.add(flame);

        // Light
        const light = new THREE.PointLight(0xff7733, 2.0, 8);
        light.position.set(x, 1.3, z);
        brazierLights.push(light);
        scene.add(light);
    }
}

function buildChains() {
    const chainMat = new THREE.MeshStandardMaterial({
        color: 0x555555, roughness: 0.3, metalness: 0.8,
        emissive: 0x151515, emissiveIntensity: 0.3,
    });

    const chainPos = [
        [-3, 5.5, 1],   [3, 5.5, 1],
        [-1.5, 5, -4],  [1.5, 5, -4],
        [-3, 6, -9],    [3, 6, -9],
        [0, 5.2, -14],
        [-2, 5.8, -19], [2, 5.8, -19],
    ];

    for (const [x, endY, z] of chainPos) {
        const startY = 7.5;
        const length = startY - endY;

        const chain = new THREE.Mesh(
            new THREE.CylinderGeometry(0.02, 0.02, length, 4),
            chainMat
        );
        chain.position.set(x, endY + length / 2, z);
        scene.add(chain);

        // Hook at bottom
        const hook = new THREE.Mesh(
            new THREE.TorusGeometry(0.07, 0.018, 4, 8, Math.PI),
            chainMat
        );
        hook.position.set(x, endY, z);
        scene.add(hook);
    }
}

function buildEmbers() {
    const geo = new THREE.PlaneGeometry(0.06, 0.06);
    const mat = new THREE.MeshStandardMaterial({
        color: 0xff8844,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
        emissive: 0xff4400,
        emissiveIntensity: 2.0,
        roughness: 0,
    });

    emberMesh = new THREE.InstancedMesh(geo, mat, EMBER_COUNT);
    emberMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    emberData = [];
    for (let i = 0; i < EMBER_COUNT; i++) {
        emberData.push(randomEmber());
        const e = emberData[i];
        dummy.position.set(e.x, e.y, e.z);
        dummy.rotation.set(e.rx, e.ry, e.rz);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        emberMesh.setMatrixAt(i, dummy.matrix);
    }
    emberMesh.instanceMatrix.needsUpdate = true;
    scene.add(emberMesh);
}

function randomEmber(fromBelow = false) {
    return {
        x: (Math.random() - 0.5) * 10,
        y: fromBelow ? -0.5 - Math.random() * 1 : Math.random() * 7,
        z: Math.random() * 35 - 25,
        rx: Math.random() * Math.PI * 2,
        ry: Math.random() * Math.PI * 2,
        rz: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.008,
        vy: 0.008 + Math.random() * 0.012,
        vz: (Math.random() - 0.5) * 0.004,
        vrx: (Math.random() - 0.5) * 0.05,
        vry: (Math.random() - 0.5) * 0.04,
        vrz: (Math.random() - 0.5) * 0.05,
        phase: Math.random() * Math.PI * 2,
        wobble: 0.001 + Math.random() * 0.003,
    };
}

// ══════════════════════════════════════════════════════════
// ZEN GARDEN — Scene builders (v2 — textured + atmospheric)
// ══════════════════════════════════════════════════════════

function buildZenLighting() {
    // Ambient
    scene.add(new THREE.AmbientLight(0x1a1a30, 1.4));

    // Moonlight from above-right
    const moon = new THREE.DirectionalLight(0x5566bb, 1.6);
    moon.position.set(5, 15, 8);
    moon.castShadow = true;
    moon.shadow.mapSize.set(1024, 1024);
    moon.shadow.camera.near = 0.5;
    moon.shadow.camera.far = 60;
    moon.shadow.camera.left = -15;
    moon.shadow.camera.right = 15;
    moon.shadow.camera.top = 15;
    moon.shadow.camera.bottom = -15;
    scene.add(moon);

    // Ground bounce fill
    const fill = new THREE.PointLight(0x222244, 0.4, 12);
    fill.position.set(0, 0.1, -2);
    scene.add(fill);

    // Keypress light — soft blue-white
    keypressLight = new THREE.PointLight(0x88aaff, 0, 12);
    keypressLight.position.set(0, 3, 6);
    scene.add(keypressLight);
}

// ── Seeded RNG — same seed = same stars/cracks every reload ──
function makeRng(seed) {
    let s = seed >>> 0;
    return function() {
        s = Math.imul(1664525, s) + 1013904223 >>> 0;
        return s / 0x100000000;
    };
}

// ── Stars + Moon ──
let zenSkySphere = null;
let zenSkyYOff = 0.50; // locked at horizon level

function buildZenSky(yOff = zenSkyYOff) {
    zenSkyYOff = yOff;
    if (zenSkySphere) { scene.remove(zenSkySphere); zenSkySphere.geometry.dispose(); zenSkySphere.material.dispose(); }
    const W = 4096, H = 2048;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const ctx = c.getContext('2d');
    const _sr = makeRng(0x5A7E5EED);
    const rng = (a, b) => a + _sr() * (b - a);

    // ── 1. Deep night sky gradient — darker/moodier ──
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0,    '#010010');
    bg.addColorStop(0.2,  '#04031a');
    bg.addColorStop(0.45, '#080628');
    bg.addColorStop(0.65, '#0e0838');
    bg.addColorStop(0.8,  '#120a42');
    bg.addColorStop(1,    '#07041a');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // ── 2. Horizon purple glow ──
    const hg = ctx.createLinearGradient(0, H * 0.6, 0, H);
    hg.addColorStop(0,   'rgba(80, 40, 140, 0)');
    hg.addColorStop(0.4, 'rgba(80, 40, 140, 0.18)');
    hg.addColorStop(1,   'rgba(20, 10, 50, 0)');
    ctx.fillStyle = hg;
    ctx.fillRect(0, H * 0.6, W, H * 0.4);

    // ── 3. Milky Way band (diagonal) ──
    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.rotate(-0.25);
    const mw = ctx.createLinearGradient(0, -H * 0.5, 0, H * 0.5);
    mw.addColorStop(0,    'rgba(100, 120, 200, 0)');
    mw.addColorStop(0.35, 'rgba(100, 120, 200, 0)');
    mw.addColorStop(0.45, 'rgba(110, 130, 210, 0.07)');
    mw.addColorStop(0.5,  'rgba(130, 150, 225, 0.14)');
    mw.addColorStop(0.55, 'rgba(110, 130, 210, 0.07)');
    mw.addColorStop(0.65, 'rgba(100, 120, 200, 0)');
    mw.addColorStop(1,    'rgba(100, 120, 200, 0)');
    ctx.fillStyle = mw;
    ctx.fillRect(-W, -H, W * 2, H * 2);
    for (let i = 0; i < 200; i++) {
        const nx = rng(-W * 0.4, W * 0.4);
        const ny = rng(-H * 0.15, H * 0.15);
        ctx.beginPath();
        ctx.arc(nx, ny, rng(0.3, 1.0), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 200, 255, ${rng(0.05, 0.2)})`;
        ctx.fill();
    }
    ctx.restore();

    // ── 4. Small background stars — pure single pixels ──
    for (let i = 0; i < 1800; i++) {
        const x = Math.floor(rng(0, W));
        const y = Math.floor(rng(0, H * 0.88));
        const b = rng(0.3, 1.0);
        ctx.fillStyle = `rgba(${Math.floor(210 + b * 45)}, ${Math.floor(215 + b * 40)}, ${Math.floor(240 + b * 15)}, ${b})`;
        ctx.fillRect(x, y, 1, 1);
    }

    // ── 5. Genshin sparkle stars (4-pointed cross) ──
    const sparkle = (x, y, size, alpha) => {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(x, y);
        // Outer glow
        const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 4);
        glow.addColorStop(0,   'rgba(200, 220, 255, 0.45)');
        glow.addColorStop(0.4, 'rgba(180, 205, 255, 0.12)');
        glow.addColorStop(1,   'rgba(160, 190, 255, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath(); ctx.arc(0, 0, size * 4, 0, Math.PI * 2); ctx.fill();
        // Cross arms
        const arm = (len, w) => {
            const g = ctx.createLinearGradient(-len, 0, len, 0);
            g.addColorStop(0,   'rgba(255,255,255,0)');
            g.addColorStop(0.4, 'rgba(220,235,255,0.6)');
            g.addColorStop(0.5, 'rgba(255,255,255,1)');
            g.addColorStop(0.6, 'rgba(220,235,255,0.6)');
            g.addColorStop(1,   'rgba(255,255,255,0)');
            ctx.fillStyle = g;
            ctx.fillRect(-len, -w / 2, len * 2, w);
        };
        arm(size * 3.5, size * 0.18);
        ctx.rotate(Math.PI / 2); arm(size * 3.5, size * 0.18);
        ctx.rotate(-Math.PI / 2 + Math.PI / 4); arm(size * 1.8, size * 0.1);
        ctx.rotate(Math.PI / 2); arm(size * 1.8, size * 0.1);
        // Center dot
        ctx.rotate(-3 * Math.PI / 4);
        ctx.beginPath(); ctx.arc(0, 0, size * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = 'white'; ctx.fill();
        ctx.restore();
    };
    for (let i = 0; i < 55; i++) {
        sparkle(rng(0, W), rng(H * 0.09, H * 0.43), rng(1.5, 5), rng(0.35, 0.95));
    }
    // Extra stars on left side
    for (let i = 0; i < 12; i++) {
        sparkle(rng(0, W * 0.22), rng(H * 0.09, H * 0.46), rng(1.5, 4), rng(0.30, 0.85));
    }
    // Extra stars on right side
    for (let i = 0; i < 12; i++) {
        sparkle(rng(W * 0.78, W), rng(H * 0.09, H * 0.46), rng(1.5, 4), rng(0.30, 0.85));
    }

    // ── 6. Moon ──
    const mx = W * 0.72, my = H * 0.16, mr = W * 0.042;
    for (let l = 6; l >= 1; l--) {
        const gr = ctx.createRadialGradient(mx, my, mr * 0.5, mx, my, mr * (1 + l * 0.7));
        gr.addColorStop(0, `rgba(170, 195, 255, ${0.035 * l})`);
        gr.addColorStop(1, 'rgba(170, 195, 255, 0)');
        ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(mx, my, mr * (1 + l * 0.7), 0, Math.PI * 2); ctx.fill();
    }
    const mb = ctx.createRadialGradient(mx - mr * 0.28, my - mr * 0.28, mr * 0.05, mx, my, mr);
    mb.addColorStop(0, '#f0f4ff'); mb.addColorStop(0.5, '#d5dfff'); mb.addColorStop(1, '#b0c4f0');
    ctx.fillStyle = mb; ctx.beginPath(); ctx.arc(mx, my, mr, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 0.07;
    for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.arc(mx + rng(-mr * 0.5, mr * 0.5), my + rng(-mr * 0.5, mr * 0.5), rng(mr * 0.06, mr * 0.18), 0, Math.PI * 2);
        ctx.fillStyle = '#7080b0'; ctx.fill();
    }
    ctx.globalAlpha = 1;

    // ── 7. Anime wispy clouds ──
    const cloud = (cx, cy, rx, ry, alpha) => {
        const g = ctx.createRadialGradient(cx, cy - ry * 0.3, 0, cx, cy, Math.max(rx, ry));
        g.addColorStop(0,   `rgba(50, 35, 90, ${alpha * 0.7})`);
        g.addColorStop(0.5, `rgba(40, 28, 75, ${alpha * 0.4})`);
        g.addColorStop(1,   'rgba(30, 20, 60, 0)');
        ctx.fillStyle = g;
        ctx.save(); ctx.scale(1, ry / rx);
        ctx.beginPath(); ctx.arc(cx, cy * rx / ry, rx, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    };
    cloud(W*0.08, H*0.74, 200, 45, 0.5);  cloud(W*0.22, H*0.77, 280, 40, 0.45);
    cloud(W*0.42, H*0.75, 230, 38, 0.4);  cloud(W*0.62, H*0.73, 320, 50, 0.5);
    cloud(W*0.82, H*0.75, 250, 42, 0.45); cloud(W*0.97, H*0.74, 180, 36, 0.4);
    cloud(W*0.12, H*0.48, 160, 28, 0.18); cloud(W*0.50, H*0.44, 200, 25, 0.15);
    cloud(W*0.78, H*0.50, 175, 30, 0.16);

    // ── 8. Nebula wisps — subtle purple/blue color clouds in upper sky ──
    const nebula = (cx, cy, rx, ry, r, g, b, alpha) => {
        const ng = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry));
        ng.addColorStop(0,   `rgba(${r}, ${g}, ${b}, ${alpha})`);
        ng.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${alpha * 0.4})`);
        ng.addColorStop(1,   `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.fillStyle = ng;
        ctx.save(); ctx.scale(rx / ry, 1);
        ctx.beginPath(); ctx.arc(cx * ry / rx, cy, ry, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    };
    // Nebulas — clearly visible color clouds
    nebula(W*0.78, H*yOff,        600, 280, 200, 50,  180, 0.45);
    nebula(W*0.85, H*(yOff-0.05), 450, 200, 180, 30,  160, 0.35);
    nebula(W*0.18, H*(yOff+0.02), 550, 250, 50,  90,  230, 0.42);
    nebula(W*0.10, H*(yOff-0.04), 400, 180, 30,  70,  210, 0.32);
    nebula(W*0.50, H*(yOff-0.06), 700, 200, 30,  150, 210, 0.35);


    // ── 10. Horizon atmospheric scatter — subtle teal glow at bottom ──
    const atmos = ctx.createLinearGradient(0, H * 0.78, 0, H);
    atmos.addColorStop(0,   'rgba(20, 60, 90, 0)');
    atmos.addColorStop(0.35, 'rgba(25, 70, 100, 0.28)');
    atmos.addColorStop(0.65, 'rgba(15, 50, 80, 0.18)');
    atmos.addColorStop(1,   'rgba(10, 30, 50, 0)');
    ctx.fillStyle = atmos;
    ctx.fillRect(0, H * 0.82, W, H * 0.18);

    // ── Apply to sky sphere ──
    const skyTex = new THREE.CanvasTexture(c);
    skyTex.mapping = THREE.EquirectangularReflectionMapping;
    skyTex.generateMipmaps = false;
    skyTex.minFilter = THREE.LinearFilter;
    skyTex.magFilter = THREE.LinearFilter;
    zenSkySphere = new THREE.Mesh(
        new THREE.SphereGeometry(80, 32, 16),
        new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, depthWrite: false, fog: false })
    );
    scene.add(zenSkySphere);

    // Moon glow light
    const moonLight = new THREE.PointLight(0x8899dd, 0.8, 60);
    moonLight.position.set(30, 25, -50);
    scene.add(moonLight);
}

function buildZenGround() {
    const texW = 1024, texH = 1024;
    const gr = makeRng(98765); // fixed seed — cracks never change

    // ── Obsidian base texture ──
    const c = document.createElement('canvas');
    c.width = texW; c.height = texH;
    const ctx = c.getContext('2d');

    // Near-black obsidian base with faint blue-black tint
    ctx.fillStyle = '#07080f';
    ctx.fillRect(0, 0, texW, texH);

    // Glassy surface variation — subtle lighter patches like real obsidian
    for (let i = 0; i < 35000; i++) {
        const nx = gr() * texW;
        const ny = gr() * texH;
        const v = Math.floor(8 + gr() * 18);
        ctx.fillStyle = `rgba(${v}, ${v + 2}, ${v + 10}, 0.25)`;
        ctx.fillRect(nx, ny, 2, 2);
    }

    // Dark crack shadows on base (depth, not glow)
    function drawCrackShadow(x, y, angle, length, depth) {
        if (depth > 3 || length < 15) return;
        const endX = x + Math.cos(angle) * length;
        const endY = y + Math.sin(angle) * length;
        const midX = (x + endX) / 2 + (gr() - 0.5) * 25;
        const midY = (y + endY) / 2 + (gr() - 0.5) * 25;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(midX, midY, endX, endY);
        ctx.strokeStyle = `rgba(0, 0, 5, ${0.6 - depth * 0.12})`;
        ctx.lineWidth = Math.max(0.5, 1.5 - depth * 0.3);
        ctx.stroke();
        if (gr() > 0.45) {
            drawCrackShadow(endX, endY, angle + (gr() - 0.5) * 1.1,
                length * (0.45 + gr() * 0.3), depth + 1);
        }
        if (gr() > 0.55) {
            const forkAt = 0.35 + gr() * 0.4;
            drawCrackShadow(
                x + Math.cos(angle) * length * forkAt,
                y + Math.sin(angle) * length * forkAt,
                angle + (gr() - 0.5) * 1.4,
                length * (0.3 + gr() * 0.25), depth + 1);
        }
    }
    ctx.save();
    for (let i = 0; i < 12; i++) {
        drawCrackShadow(
            gr() * texW, gr() * texH,
            gr() * Math.PI * 2,
            70 + gr() * 110, 0);
    }
    ctx.restore();

    const obsidianTex = new THREE.CanvasTexture(c);
    obsidianTex.wrapS = THREE.RepeatWrapping;
    obsidianTex.wrapT = THREE.RepeatWrapping;
    obsidianTex.repeat.set(2, 3);

    // ── Emissive crack map — same crack network but glowing blue ──
    const ec = document.createElement('canvas');
    ec.width = texW; ec.height = texH;
    const ectx = ec.getContext('2d');
    ectx.fillStyle = '#000000';
    ectx.fillRect(0, 0, texW, texH);

    // Reset seed so glow cracks match shadow cracks exactly
    const gr2 = makeRng(98765);
    // burn through surface variation calls to sync state
    for (let i = 0; i < 35000 * 3; i++) gr2();
    // burn through shadow crack seed state (approximate — glow uses fresh seed)
    const gr3 = makeRng(11111);

    function drawCrackGlow(x, y, angle, length, depth) {
        if (depth > 3 || length < 15) return;
        const endX = x + Math.cos(angle) * length;
        const endY = y + Math.sin(angle) * length;
        const midX = (x + endX) / 2 + (gr3() - 0.5) * 25;
        const midY = (y + endY) / 2 + (gr3() - 0.5) * 25;

        // Outer soft halo
        ectx.beginPath();
        ectx.moveTo(x, y);
        ectx.quadraticCurveTo(midX, midY, endX, endY);
        ectx.strokeStyle = `rgba(80, 120, 255, ${0.18 - depth * 0.03})`;
        ectx.lineWidth = Math.max(2, 7 - depth * 1.5);
        ectx.stroke();

        // Bright core
        ectx.beginPath();
        ectx.moveTo(x, y);
        ectx.quadraticCurveTo(midX, midY, endX, endY);
        ectx.strokeStyle = `rgba(170, 200, 255, ${0.9 - depth * 0.15})`;
        ectx.lineWidth = Math.max(0.4, 1.2 - depth * 0.25);
        ectx.stroke();

        if (gr3() > 0.45) {
            drawCrackGlow(endX, endY, angle + (gr3() - 0.5) * 1.1,
                length * (0.45 + gr3() * 0.3), depth + 1);
        }
        if (gr3() > 0.55) {
            const forkAt = 0.35 + gr3() * 0.4;
            drawCrackGlow(
                x + Math.cos(angle) * length * forkAt,
                y + Math.sin(angle) * length * forkAt,
                angle + (gr3() - 0.5) * 1.4,
                length * (0.3 + gr3() * 0.25), depth + 1);
        }
    }

    const gr4 = makeRng(22222);
    for (let i = 0; i < 12; i++) {
        drawCrackGlow(
            gr4() * texW, gr4() * texH,
            gr4() * Math.PI * 2,
            70 + gr4() * 110, 0);
    }

    const crackTex = new THREE.CanvasTexture(ec);
    crackTex.wrapS = THREE.RepeatWrapping;
    crackTex.wrapT = THREE.RepeatWrapping;
    crackTex.repeat.set(2, 3);

    // ── Ground mesh — glassy obsidian with glowing cracks ──
    const groundGeo = new THREE.PlaneGeometry(22, 42);
    const groundMat = new THREE.MeshStandardMaterial({
        map: obsidianTex,
        emissiveMap: crackTex,
        emissive: new THREE.Color(0x3355ee),
        emissiveIntensity: 1.6,
        roughness: 0.12,
        metalness: 0.55,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, 0, -5);
    ground.receiveShadow = true;
    scene.add(ground);
    zenGroundMesh = ground;
}

function buildZenGroundStone() {
    const texW = 1024, texH = 1024;
    const c = document.createElement('canvas');
    c.width = texW; c.height = texH;
    const ctx = c.getContext('2d');

    ctx.fillStyle = '#07080f';
    ctx.fillRect(0, 0, texW, texH);
    const slabW = 128, slabH = 96;
    ctx.strokeStyle = 'rgba(40, 55, 90, 0.6)';
    ctx.lineWidth = 2;
    for (let row = 0; row < texH / slabH + 1; row++) {
        const yy = row * slabH;
        const rowOff = (row % 2) * (slabW * 0.4);
        for (let col = -1; col < texW / slabW + 1; col++) {
            const xx = col * slabW + rowOff;
            const v = Math.floor(22 + Math.random() * 18);
            ctx.fillStyle = `rgb(${v}, ${v + 3}, ${v + 12})`;
            ctx.fillRect(xx + 2, yy + 2, slabW - 4, slabH - 4);
            ctx.strokeRect(xx, yy, slabW, slabH);
        }
    }
    for (let i = 0; i < 50000; i++) {
        const nx = Math.random() * texW, ny = Math.random() * texH;
        const v = Math.floor(20 + Math.random() * 30);
        ctx.fillStyle = `rgba(${v}, ${v + 5}, ${v + 20}, 0.12)`;
        ctx.fillRect(nx, ny, 1, 1);
    }
    ctx.lineWidth = 0.8;
    for (let i = 0; i < 40; i++) {
        let px = Math.random() * texW, py = Math.random() * texH;
        ctx.beginPath(); ctx.moveTo(px, py);
        for (let s = 0; s < 5 + Math.floor(Math.random() * 4); s++) {
            px += (Math.random() - 0.5) * 60; py += (Math.random() - 0.5) * 40;
            ctx.lineTo(px, py);
        }
        const b = Math.floor(120 + Math.random() * 60);
        ctx.strokeStyle = `rgba(${b - 40}, ${b - 20}, ${b + 30}, 0.15)`;
        ctx.stroke();
    }
    const stoneTex = new THREE.CanvasTexture(c);
    stoneTex.wrapS = stoneTex.wrapT = THREE.RepeatWrapping;
    stoneTex.repeat.set(3, 5);

    const nc = document.createElement('canvas');
    nc.width = 512; nc.height = 512;
    const nCtx = nc.getContext('2d');
    nCtx.fillStyle = '#8080ff'; nCtx.fillRect(0, 0, 512, 512);
    const ns = 512 / (texW / slabW), nsH = 512 / (texH / slabH);
    for (let row = 0; row < 512 / nsH + 1; row++) {
        for (let col = 0; col < 512 / ns + 1; col++) {
            const ex = col * ns, ey = row * nsH;
            nCtx.fillStyle = '#6868ff'; nCtx.fillRect(ex, ey, ns, 2); nCtx.fillRect(ex, ey, 2, nsH);
            nCtx.fillStyle = '#9898ff'; nCtx.fillRect(ex, ey + nsH - 2, ns, 2); nCtx.fillRect(ex + ns - 2, ey, 2, nsH);
        }
    }
    const normalTex = new THREE.CanvasTexture(nc);
    normalTex.wrapS = normalTex.wrapT = THREE.RepeatWrapping;
    normalTex.repeat.set(3, 5);

    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(22, 42),
        new THREE.MeshStandardMaterial({
            map: stoneTex, normalMap: normalTex,
            normalScale: new THREE.Vector2(0.4, 0.4),
            roughness: 0.82, metalness: 0.08,
            emissive: 0x060a18, emissiveIntensity: 0.3,
        })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, 0, -5);
    ground.receiveShadow = true;
    scene.add(ground);
    zenGroundMesh = ground;
}

export function setZenGroundType(type) {
    if (sceneType !== 'zen' || !scene) return;
    zenGroundType = type;
    // Remove current ground
    if (zenGroundMesh) { scene.remove(zenGroundMesh); zenGroundMesh = null; }
    if (type === 'obsidian') buildZenGround();
    else buildZenGroundStone();
}

function buildKoiPond() {
    // Deep night pond floor
    const floorMat = new THREE.MeshStandardMaterial({
        color: 0x050a1a, roughness: 0.9, metalness: 0,
    });
    const floor = new THREE.Mesh(new THREE.CircleGeometry(2.9, 32), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -0.04, -4);
    scene.add(floor);

    // Reflector water surface — indigo-tinted to mirror the nebula sky
    reflectorMesh = new Reflector(new THREE.CircleGeometry(3, 64), {
        color: 0x3a4488,
        textureWidth: 1024,
        textureHeight: 1024,
        clipBias: 0.003,
    });
    reflectorMesh.rotation.x = -Math.PI / 2;
    reflectorMesh.position.set(0, -0.01, -4);
    scene.add(reflectorMesh);

    // Stone border ring — moonlit stone
    const borderMat = new THREE.MeshStandardMaterial({
        color: 0x2e3442, roughness: 0.85, metalness: 0.05,
        emissive: 0x060810, emissiveIntensity: 0.2,
    });
    const border = new THREE.Mesh(
        new THREE.TorusGeometry(3.05, 0.12, 8, 64),
        borderMat
    );
    border.rotation.x = -Math.PI / 2;
    border.position.set(0, 0.0, -4);
    scene.add(border);

    // Inner accent ring
    const inner = new THREE.Mesh(
        new THREE.TorusGeometry(2.95, 0.06, 6, 64),
        borderMat
    );
    inner.rotation.x = -Math.PI / 2;
    inner.position.set(0, 0.01, -4);
    scene.add(inner);
}


function buildStoneLanterns() {
    const positions = [
        { x: -3.5, z: -2, scale: 0.8, rotY: 0 },
        { x: 3.5,  z: -6, scale: 0.8, rotY: Math.PI * 0.3 },
        { x: -2,   z: -8, scale: 0.7, rotY: Math.PI * 0.6 },
        { x: 2.5,  z: 1,  scale: 0.8, rotY: Math.PI * 0.9 },
    ];

    // Add warm lights at each position immediately (model loads async)
    for (const p of positions) {
        const light = new THREE.PointLight(0xffcc66, 1.5, 6);
        light.position.set(p.x, 1.35, p.z);
        zenLanternLights.push(light);
        scene.add(light);
    }

    // Load GLTF model
    gltfLoader.load('models/zen/japanese_stone_lantern.glb', (gltf) => {
        const template = gltf.scene;

        // Figure out model bounds to normalize scale
        const box = new THREE.Box3().setFromObject(template);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const baseScale = 1.8 / maxDim; // normalize to ~1.8 units tall

        for (const p of positions) {
            const lantern = template.clone();
            lantern.scale.setScalar(baseScale * p.scale);

            // Center the model at ground level
            const cloneBox = new THREE.Box3().setFromObject(lantern);
            const minY = cloneBox.min.y;
            lantern.position.set(p.x, -minY, p.z);
            lantern.rotation.y = p.rotY;

            // Enable shadows on all meshes
            lantern.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            scene.add(lantern);
        }
    }, undefined, (err) => {
        console.warn('Lantern model not found, using fallback primitives', err);
        buildStoneLanternsFallback();
    });
}

// Fallback if model fails to load
function buildStoneLanternsFallback() {
    const stoneMat = new THREE.MeshStandardMaterial({
        color: 0x444444, roughness: 0.85, metalness: 0.05,
        emissive: 0x111111, emissiveIntensity: 0.2,
    });
    const glowMat = new THREE.MeshStandardMaterial({
        color: 0xffcc66, emissive: 0xffaa33, emissiveIntensity: 2.5,
        transparent: true, opacity: 0.85, roughness: 0.3,
    });
    const positions = [[-3.5, 0, -2], [3.5, 0, -6], [-2, 0, -8], [2.5, 0, 1]];
    for (const [x, , z] of positions) {
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 0.2, 8), stoneMat);
        base.position.set(x, 0.1, z);
        scene.add(base);
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.0, 6), stoneMat);
        shaft.position.set(x, 0.7, z);
        scene.add(shaft);
        const chamber = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.3, 0.35), glowMat);
        chamber.position.set(x, 1.35, z);
        scene.add(chamber);
        const roof = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.2, 4), stoneMat);
        roof.position.set(x, 1.6, z);
        scene.add(roof);
    }
}


function makeRockGeometry(radius, detail) {
    // Vertex-displaced icosahedron — looks like natural stone
    const geo = new THREE.IcosahedronGeometry(radius, detail);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
        const len = Math.sqrt(x * x + y * y + z * z);
        // Pseudo-noise displacement
        const noise = Math.sin(x * 5.1 + y * 3.7) * Math.cos(z * 4.3 + x * 2.1) * 0.15
                    + Math.sin(x * 11 + z * 7) * 0.06
                    + Math.sin(y * 8.5 + x * 6) * 0.04;
        const newLen = len + noise * radius;
        const scale = newLen / len;
        pos.setXYZ(i, x * scale, y * scale, z * scale);
    }
    geo.computeVertexNormals();
    return geo;
}

function buildGardenRocks() {
    // Canvas-generated rock texture
    const rc = document.createElement('canvas');
    rc.width = 256; rc.height = 256;
    const rctx = rc.getContext('2d');
    rctx.fillStyle = '#4a4a4a';
    rctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 5000; i++) {
        const v = Math.floor(50 + Math.random() * 40);
        rctx.fillStyle = `rgba(${v}, ${v}, ${v + 5}, 0.3)`;
        rctx.fillRect(Math.random() * 256, Math.random() * 256, 2 + Math.random() * 3, 1 + Math.random() * 2);
    }
    const rockTex = new THREE.CanvasTexture(rc);

    const rockMat = new THREE.MeshStandardMaterial({
        map: rockTex,
        roughness: 0.85,
        metalness: 0.05,
        emissive: 0x111111,
        emissiveIntensity: 0.2,
    });

    const rockDefs = [
        { x: 2, y: 0.35, z: -2, r: 0.6, sx: 1.0, sy: 0.7, sz: 0.85 },
        { x: 2.5, y: 0.2, z: -1.7, r: 0.35, sx: 0.9, sy: 0.8, sz: 1.1 },
        { x: 1.7, y: 0.12, z: -1.6, r: 0.2, sx: 1.1, sy: 0.75, sz: 0.9 },
        { x: -1, y: 0.22, z: -7, r: 0.4, sx: 1.0, sy: 0.75, sz: 1.05 },
        { x: -0.5, y: 0.13, z: -6.7, r: 0.22, sx: 0.95, sy: 0.8, sz: 1.0 },
    ];

    for (const def of rockDefs) {
        const rock = new THREE.Mesh(makeRockGeometry(def.r, 2), rockMat);
        rock.position.set(def.x, def.y, def.z);
        rock.scale.set(def.sx, def.sy, def.sz);
        rock.rotation.y = Math.random() * Math.PI;
        rock.castShadow = true;
        scene.add(rock);
    }
}

function buildToriiGateZen() {
    gltfLoader.load('models/zen/torii_gate.glb', (gltf) => {
        const torii = gltf.scene;

        const box = new THREE.Box3().setFromObject(torii);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const baseScale = 3.5 / maxDim;

        torii.scale.setScalar(baseScale);

        const cloneBox = new THREE.Box3().setFromObject(torii);
        const gz = -1.5;
        torii.position.set(0, -cloneBox.min.y, gz);

        torii.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        scene.add(torii);

        // Torch lights — positioned at the hanging lanterns on each side of the crossbeam
        const torchY = 2.8;
        const torchX = 1.3;
        const torchMat = new THREE.MeshStandardMaterial({
            color: 0xff8800, emissive: 0xff6600, emissiveIntensity: 5, roughness: 0,
        });
        for (const side of [-1, 1]) {
            // Glowing ember sphere at torch position
            const flame = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), torchMat);
            flame.position.set(side * torchX, torchY, gz);
            scene.add(flame);

            // Warm point light
            const light = new THREE.PointLight(0xff8833, 2.5, 5);
            light.position.set(side * torchX, torchY, gz);
            zenLanternLights.push(light);
            scene.add(light);
        }

    }, undefined, (err) => {
        console.warn('Torii gate model not found', err);
    });
}

function buildGuardianLions() {
    // Two lions flanking the koi pond entrance, facing the camera
    const placements = [
        { x: -1.8, z: -1.2, rotY: Math.PI * 0.15 },   // left lion, slightly angled inward
        { x:  1.8, z: -1.2, rotY: -Math.PI * 0.15 },  // right lion, mirrored
    ];

    gltfLoader.load('models/zen/stone_lion.glb', (gltf) => {
        const template = gltf.scene;

        const box = new THREE.Box3().setFromObject(template);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const baseScale = 0.9 / maxDim; // normalize to ~0.9 units tall

        for (const p of placements) {
            const lion = template.clone();
            lion.scale.setScalar(baseScale);

            const cloneBox = new THREE.Box3().setFromObject(lion);
            lion.position.set(p.x, -cloneBox.min.y, p.z);
            lion.rotation.y = p.rotY;

            lion.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            scene.add(lion);
        }
    }, undefined, (err) => {
        console.warn('Guardian lion model not found', err);
    });
}

function buildSteppingStones() {
    const stoneMat = new THREE.MeshStandardMaterial({
        color: 0x2a3040, roughness: 0.85, metalness: 0.04,
        emissive: 0x1a2040, emissiveIntensity: 0.4,
        transparent: true, opacity: 0.55, depthWrite: false,
    });

    const positions = [
        { x: -0.5, z: 5, r: 0.30 },
        { x: -0.2, z: 3.8, r: 0.28 },
        { x: 0.1, z: 2.5, r: 0.32 },
        { x: 0.4, z: 1.3, r: 0.26 },
        { x: 0.3, z: 0.0, r: 0.30 },
        { x: 0.0, z: -1.2, r: 0.35 },
        { x: -0.3, z: -2.3, r: 0.28 },
    ];

    for (const s of positions) {
        const stone = new THREE.Mesh(
            new THREE.CylinderGeometry(s.r, s.r, 0.05, 8),
            stoneMat
        );
        stone.position.set(s.x, 0.025, s.z);
        stone.rotation.y = Math.random() * Math.PI;
        stone.receiveShadow = true;
        scene.add(stone);
    }
}

function buildWoodenBridge() {
    // Canvas wood texture
    const wc = document.createElement('canvas');
    wc.width = 128; wc.height = 128;
    const wctx = wc.getContext('2d');
    wctx.fillStyle = '#2a2830';
    wctx.fillRect(0, 0, 128, 128);
    // Wood grain lines — cool moonlit
    wctx.strokeStyle = 'rgba(15, 12, 25, 0.35)';
    wctx.lineWidth = 1;
    for (let y = 0; y < 128; y += 4 + Math.random() * 3) {
        wctx.beginPath();
        wctx.moveTo(0, y);
        wctx.lineTo(128, y + (Math.random() - 0.5) * 2);
        wctx.stroke();
    }
    const woodTex = new THREE.CanvasTexture(wc);

    const woodMat = new THREE.MeshStandardMaterial({
        map: woodTex,
        roughness: 0.75, metalness: 0.05,
        emissive: 0x06080e, emissiveIntensity: 0.18,
    });

    const bx = 2.2, bz = -2.2;

    // Main plank
    const plank = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.06, 0.6), woodMat);
    plank.position.set(bx, 0.18, bz);
    plank.rotation.y = 0.5;
    scene.add(plank);

    // Rail posts
    const postGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 4);
    const offsets = [[-0.6, -0.25], [-0.6, 0.25], [0.6, -0.25], [0.6, 0.25]];
    for (const [dx, dz] of offsets) {
        const post = new THREE.Mesh(postGeo, woodMat);
        const rx = bx + dx * Math.cos(0.5) - dz * Math.sin(0.5);
        const rz = bz + dx * Math.sin(0.5) + dz * Math.cos(0.5);
        post.position.set(rx, 0.38, rz);
        scene.add(post);
    }

    // Rail beams
    for (const side of [-0.25, 0.25]) {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.02, 0.02), woodMat);
        const rx = bx + side * Math.sin(0.5);
        const rz = bz + side * Math.cos(0.5);
        rail.position.set(rx, 0.55, rz);
        rail.rotation.y = 0.5;
        scene.add(rail);
    }
}

function buildMossPatches() {
    const mossMat = new THREE.MeshStandardMaterial({
        color: 0x162e20, emissive: 0x0a1810, emissiveIntensity: 0.35,
        roughness: 1.0, metalness: 0, transparent: true, opacity: 0.6,
    });

    const patches = [
        { x: -3.5, z: -2.3, r: 0.2 }, { x: 3.6, z: -6.3, r: 0.18 },
        { x: -2.1, z: -8.3, r: 0.15 }, { x: 2.3, z: 0.8, r: 0.22 },
        { x: 1.6, z: -1.3, r: 0.25 }, { x: -0.8, z: -6.5, r: 0.18 },
        { x: 2.8, z: -2.2, r: 0.15 }, { x: -3.8, z: -5, r: 0.2 },
    ];

    for (const p of patches) {
        const moss = new THREE.Mesh(new THREE.CircleGeometry(p.r, 8), mossMat);
        moss.rotation.x = -Math.PI / 2;
        moss.position.set(p.x, 0.003, p.z);
        scene.add(moss);
    }
}

function buildGroundMist() {
    // Low-lying atmospheric mist — canvas radial gradient that fades at edges
    const mc = document.createElement('canvas');
    mc.width = 512; mc.height = 512;
    const mctx = mc.getContext('2d');
    const grad = mctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    grad.addColorStop(0.0, 'rgba(100, 120, 180, 0.12)');
    grad.addColorStop(0.4, 'rgba(80, 100, 160, 0.08)');
    grad.addColorStop(0.7, 'rgba(60, 80, 140, 0.04)');
    grad.addColorStop(1.0, 'rgba(40, 60, 120, 0.0)');
    mctx.fillStyle = grad;
    mctx.fillRect(0, 0, 512, 512);

    const mistTex = new THREE.CanvasTexture(mc);
    const mistMat = new THREE.MeshBasicMaterial({
        map: mistTex,
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
        fog: false,
        side: THREE.DoubleSide,
    });

    // Main wide mist layer
    const mist1 = new THREE.Mesh(new THREE.PlaneGeometry(22, 30), mistMat);
    mist1.rotation.x = -Math.PI / 2;
    mist1.position.set(0, 0.08, -5);
    scene.add(mist1);

    // Second layer slightly higher + offset for depth
    const mist2 = new THREE.Mesh(new THREE.PlaneGeometry(18, 24), mistMat.clone());
    mist2.material.opacity = 0.35;
    mist2.rotation.x = -Math.PI / 2;
    mist2.position.set(1, 0.18, -3);
    scene.add(mist2);

    // Third wisp near pond
    const mist3 = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), mistMat.clone());
    mist3.material.opacity = 0.5;
    mist3.rotation.x = -Math.PI / 2;
    mist3.position.set(0, 0.12, -4);
    scene.add(mist3);
}

function buildFireflies() {
    const geo = new THREE.PlaneGeometry(0.04, 0.04);
    const mat = new THREE.MeshStandardMaterial({
        color: 0xccff66,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
        emissive: 0xaaee44,
        emissiveIntensity: 3.0,
        roughness: 0,
        depthWrite: false,
    });

    fireflyMesh = new THREE.InstancedMesh(geo, mat, FIREFLY_COUNT);
    fireflyMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    fireflyData = [];
    for (let i = 0; i < FIREFLY_COUNT; i++) {
        fireflyData.push(randomFirefly());
        const f = fireflyData[i];
        dummy.position.set(f.x, f.y, f.z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        fireflyMesh.setMatrixAt(i, dummy.matrix);
    }
    fireflyMesh.instanceMatrix.needsUpdate = true;
    scene.add(fireflyMesh);
}

function randomFirefly() {
    return {
        x: (Math.random() - 0.5) * 14,
        y: 0.3 + Math.random() * 4,
        z: Math.random() * 20 - 12,
        vx: (Math.random() - 0.5) * 0.003,
        vy: (Math.random() - 0.5) * 0.003,
        vz: (Math.random() - 0.5) * 0.002,
        pulsePhase: Math.random() * Math.PI * 2,
        wobblePhase: Math.random() * Math.PI * 2,
    };
}

// ══════════════════════════════════════════════════════════
// 3D KEYBOARD
// ══════════════════════════════════════════════════════════

let kbTheme = 'default';

const KB_THEMES = {
    default: {
        sideColor:   0x1a1a30, sideEmissive:   0x0d0d22,
        bottomColor: 0x0a0a18, bottomEmissive: 0x060612,
        topEmissive: 0x151530,
        plateColor:  0x08080f, plateEmissive:  0x030308,
        idleEmissive: 0x0a0a20,
        pressColor:  null,  // null = use global color theme
        underglow: 0x3344cc,  overheadColor: 0x6677cc,
        texBg0: '#222240', texBg1: '#141428',
        texBorder: 'rgba(120, 150, 220, 0.35)',
        texLabel:  'rgba(210, 225, 255, 0.95)',
    },
    jade: {
        sideColor:   0x0c1e0e, sideEmissive:   0x061408,
        bottomColor: 0x080f08, bottomEmissive: 0x040804,
        topEmissive: 0x0a1e0c,
        plateColor:  0x060e06, plateEmissive:  0x030703,
        idleEmissive: 0x082010,
        pressColor:  0x44ff88,
        underglow: 0x00bb44,  overheadColor: 0x44cc66,
        texBg0: '#0d2010', texBg1: '#071208',
        texBorder: 'rgba(60, 200, 100, 0.50)',
        texLabel:  'rgba(210, 255, 215, 0.95)',
    },
    forge: {
        sideColor:    0x1c1008, sideEmissive:   0x5a2200,
        bottomColor:  0x100a04, bottomEmissive: 0x280f00,
        topEmissive:  0x2a1000,
        plateColor:   0x140c04, plateEmissive:  0x3a1400,
        idleEmissive: 0x2a1200,
        pressColor:   0xff5500,
        rippleEnabled: true,
        cracks: true,
        underglow: 0xff2200, underglowIntensity: 6,
        overheadColor: 0xff5500,
        texBg0: '#1c1008', texBg1: '#0e0804',
        texBorder: 'rgba(255, 100, 20, 0.80)',
        texLabel:  'rgba(255, 235, 210, 0.95)',
    },
};

function createKeyTexture(char, wide = false, theme = null) {
    const t = theme || KB_THEMES[kbTheme] || KB_THEMES.default;
    const w = wide ? 256 : 128;
    const h = 128;
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const ctx = c.getContext('2d');

    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.6);
    g.addColorStop(0, t.texBg0);
    g.addColorStop(1, t.texBg1);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = t.texBorder;
    ctx.lineWidth = 2;
    ctx.strokeRect(6, 6, w - 12, h - 12);

    // Forge: crack lines + bottom heat glow
    if (t.cracks) {
        ctx.strokeStyle = 'rgba(255, 130, 0, 0.50)';
        ctx.lineWidth = 0.9;
        ctx.beginPath(); ctx.moveTo(8, 9); ctx.lineTo(20, 22); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(w - 9, h - 9); ctx.lineTo(w - 21, h - 23); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(w - 10, h * 0.32); ctx.lineTo(w - 20, h * 0.52); ctx.stroke();
        // Bottom heat glow
        const heat = ctx.createLinearGradient(0, h - 24, 0, h);
        heat.addColorStop(0, 'rgba(255, 70, 0, 0)');
        heat.addColorStop(1, 'rgba(255, 70, 0, 0.28)');
        ctx.fillStyle = heat;
        ctx.fillRect(0, 0, w, h);
    }

    const label = char === ' ' ? '___' : char.toUpperCase();
    ctx.fillStyle = t.texLabel;
    ctx.font = `bold ${h * 0.38}px "JetBrains Mono", "Consolas", monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, w / 2, h / 2);

    const tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
}

const KB_POSITIONS = [
    { y: 0.05, z: 5.5, rx: -0.05, s: 1.0 },   // 1: Floor flat (current)
    { y: 0.15, z: 5.5, rx: -0.25, s: 0.85 },  // 2: Desk tilt
    { y: 0.25, z: 3.2, rx: 0.20, s: 0.65 },   // 3: Laptop angle (tilted toward user)
    { y: 0.05, z: 7.0, rx: -0.05, s: 1.3 },   // 4: Floor close-up
    { y: 0.3,  z: 4.0, rx: -0.15, s: 0.6 },   // 5: Far away
];
let currentKBPos = 0;

export function setKeyboardPosition(index) {
    if (!keyboardGroup || index < 0 || index >= KB_POSITIONS.length) return;
    currentKBPos = index;
    const p = KB_POSITIONS[index];
    keyboardGroup.position.set(0, p.y, p.z);
    keyboardGroup.rotation.x = p.rx;
    keyboardGroup.scale.setScalar(p.s);
}

export function setKeyboardTheme(theme) {
    if (!KB_THEMES[theme] || kbTheme === theme) return;
    kbTheme = theme;
    if (!scene) return;
    if (keyboardGroup) { scene.remove(keyboardGroup); keyboardGroup = null; }
    keys3D = {};
    keys3DArray = [];
    buildKeyboard();
}

function buildKeyboard() {
    keyboardGroup = new THREE.Group();
    const p = KB_POSITIONS[currentKBPos];
    keyboardGroup.position.set(0, p.y, p.z);
    keyboardGroup.rotation.x = p.rx;
    keyboardGroup.scale.setScalar(p.s);

    const t = KB_THEMES[kbTheme] || KB_THEMES.default;

    const sideMat = new THREE.MeshStandardMaterial({
        color: t.sideColor, roughness: 0.5, metalness: 0.3,
        emissive: t.sideEmissive, emissiveIntensity: 1.5,
        transparent: true, opacity: 0.95,
    });
    const bottomMat = new THREE.MeshStandardMaterial({
        color: t.bottomColor, roughness: 0.8, metalness: 0.1,
        emissive: t.bottomEmissive, emissiveIntensity: 0.8,
    });

    for (let r = 0; r < KEYBOARD_ROWS.length; r++) {
        const { keys, offset } = KEYBOARD_ROWS[r];
        const rowW = keys.length * (KEY_W + KEY_GAP) - KEY_GAP;
        const startX = -rowW / 2 + offset;

        for (let c = 0; c < keys.length; c++) {
            const ch = keys[c];
            const x = startX + c * (KEY_W + KEY_GAP);
            const z = r * (KEY_D + KEY_GAP);

            const topTex = createKeyTexture(ch);
            const topMat = new THREE.MeshStandardMaterial({
                map: topTex, roughness: 0.35, metalness: 0.25,
                emissive: new THREE.Color(t.topEmissive), emissiveIntensity: 2.0,
            });

            const profile = ROW_PROFILE[r] || { dy: 0, rx: 0, ky: 1 };
            const geo = new THREE.BoxGeometry(KEY_W, KEY_H, KEY_D);
            const mesh = new THREE.Mesh(geo, [sideMat, sideMat, topMat, bottomMat, sideMat, sideMat]);
            mesh.position.set(x, profile.dy, z);
            mesh.rotation.x = profile.rx;
            mesh.scale.y = profile.ky;
            mesh.castShadow = true;
            keyboardGroup.add(mesh);
            keys3D[ch] = { mesh, topMat, pressAnim: 0, glowAnim: 0, baseY: profile.dy, row: r, col: c, idleEmissive: t.idleEmissive, pressColor: t.pressColor || null, worldX: x, worldZ: z };
        }
    }

    // Space bar
    const spaceZ = KEYBOARD_ROWS.length * (KEY_D + KEY_GAP) + 0.05;
    const spaceTopMat = new THREE.MeshStandardMaterial({
        map: createKeyTexture(' ', true), roughness: 0.35, metalness: 0.25,
        emissive: new THREE.Color(t.topEmissive), emissiveIntensity: 2.0,
    });
    const spaceMesh = new THREE.Mesh(
        new THREE.BoxGeometry(SPACE_W, KEY_H * 0.8, KEY_D * 0.75),
        [sideMat, sideMat, spaceTopMat, bottomMat, sideMat, sideMat]
    );
    spaceMesh.position.set(0.4, SPACE_PROFILE.dy, spaceZ);
    spaceMesh.rotation.x = SPACE_PROFILE.rx;
    spaceMesh.scale.y = SPACE_PROFILE.ky;
    keyboardGroup.add(spaceMesh);
    keys3D[' '] = { mesh: spaceMesh, topMat: spaceTopMat, pressAnim: 0, glowAnim: 0, baseY: SPACE_PROFILE.dy, idleEmissive: t.idleEmissive, pressColor: t.pressColor || null, worldX: 0.4, worldZ: spaceZ };

    // Base plate — hidden in zen scene (obsidian ground handles the look)
    if (sceneType !== 'zen') {
        const plateD = (KEYBOARD_ROWS.length + 1) * (KEY_D + KEY_GAP) + 0.6;
        const plate = new THREE.Mesh(
            new THREE.BoxGeometry(8, 0.05, plateD),
            new THREE.MeshStandardMaterial({
                color: t.plateColor, roughness: 0.9, metalness: 0.1,
                emissive: t.plateEmissive, emissiveIntensity: 0.3,
                transparent: true, opacity: 0.8,
            })
        );
        plate.position.set(0.2, -KEY_H / 2 - 0.03, plateD / 2 - 0.3);
        keyboardGroup.add(plate);
    }

    // Underglow
    const glow = new THREE.PointLight(t.underglow, t.underglowIntensity || 4, 8);
    glow.position.set(0, -0.4, 1);
    keyboardGroup.add(glow);

    // Overhead light on keyboard
    const topLight = new THREE.PointLight(t.overheadColor, 3, 6);
    topLight.position.set(0, 2, 1);
    keyboardGroup.add(topLight);

    scene.add(keyboardGroup);

    // Cache once — avoids Object.values(keys3D) allocation every frame
    keys3DArray = Object.values(keys3D);
}

function _unused_buildCrystalKeyboard() { /* removed */ return; // dead code below
    keyboardGroup = new THREE.Group();
    const p = KB_POSITIONS[currentKBPos];
    keyboardGroup.position.set(0, p.y, p.z);
    keyboardGroup.rotation.x = p.rx;
    keyboardGroup.scale.setScalar(p.s);

    const plateD = (KEYBOARD_ROWS.length + 1) * (KEY_D + KEY_GAP) + 0.85;
    const plateW = 8.4;

    // ── Obsidian slab — perfect mirror black ─────────────
    const slabMat = new THREE.MeshStandardMaterial({
        color: 0x000000, roughness: 0.0, metalness: 1.0,
    });
    const slab = new THREE.Mesh(new THREE.BoxGeometry(plateW, 0.06, plateD), slabMat);
    slab.position.set(0.2, -0.04, plateD / 2 - 0.42);
    slab.receiveShadow = true;
    keyboardGroup.add(slab);

    // ── Slab edge glow — ice-blue emissive strips ─────────
    const edgeMat = new THREE.MeshStandardMaterial({
        color: 0x002244, emissive: 0x0077bb, emissiveIntensity: 4.0, roughness: 0.3,
    });
    const eH = new THREE.BoxGeometry(plateW + 0.06, 0.022, 0.022);
    const eV = new THREE.BoxGeometry(0.022, 0.022, plateD + 0.06);
    const edgePos = [
        [eH, [0.2, -0.025,  plateD - 0.42]],
        [eH, [0.2, -0.025, -0.42]],
        [eV, [0.2 - plateW / 2, -0.025, plateD / 2 - 0.42]],
        [eV, [0.2 + plateW / 2, -0.025, plateD / 2 - 0.42]],
    ];
    for (const [geo, pos] of edgePos) {
        const m = new THREE.Mesh(geo, edgeMat);
        m.position.set(...pos);
        keyboardGroup.add(m);
    }

    // ── Crystal keys ──────────────────────────────────────
    const crystalGeo = new THREE.OctahedronGeometry(0.30, 0); // shared geometry

    for (let r = 0; r < KEYBOARD_ROWS.length; r++) {
        const { keys, offset } = KEYBOARD_ROWS[r];
        const rowW = keys.length * (KEY_W + KEY_GAP) - KEY_GAP;
        const startX = -rowW / 2 + offset;

        for (let c = 0; c < keys.length; c++) {
            const ch = keys[c];
            const x = startX + c * (KEY_W + KEY_GAP);
            const z = r * (KEY_D + KEY_GAP);

            const mat = new THREE.MeshStandardMaterial({
                color: 0x99ddff,
                emissive: new THREE.Color(0.03, 0.14, 0.55),
                emissiveIntensity: 0.9,
                transparent: true, opacity: 0.72,
                roughness: 0.04, metalness: 0.08,
                side: THREE.DoubleSide, depthWrite: false,
            });

            const mesh = new THREE.Mesh(crystalGeo, mat);
            mesh.scale.set(CRYSTAL_SCX, CRYSTAL_SCY, CRYSTAL_SCZ);
            mesh.position.set(x, CRYSTAL_BASE_Y, z);
            keyboardGroup.add(mesh);

            // Emissive energy core — tiny bright sphere inside each crystal
            const core = new THREE.Mesh(
                new THREE.SphereGeometry(0.042, 4, 4),
                new THREE.MeshStandardMaterial({
                    color: 0x000000,
                    emissive: 0x55ccff, emissiveIntensity: 18,
                })
            );
            core.position.set(x, CRYSTAL_BASE_Y + 0.04, z);
            keyboardGroup.add(core);

            keys3D[ch] = {
                mesh, topMat: mat,
                pressAnim: 0, glowAnim: 0,
                baseY: CRYSTAL_BASE_Y,
                row: r, col: c,
                crystal: true,
                scaleX: CRYSTAL_SCX, scaleY: CRYSTAL_SCY, scaleZ: CRYSTAL_SCZ,
                phase: Math.random() * Math.PI * 2,
                core,
            };
        }
    }

    // ── Spacebar — wide flat crystal ─────────────────────
    const spaceZ = KEYBOARD_ROWS.length * (KEY_D + KEY_GAP) + 0.05;
    const SPACE_SCX = CRYSTAL_SCX * (SPACE_W / KEY_W) * 0.46;
    const SPACE_SCY = CRYSTAL_SCY * 0.55;
    const spaceMat = new THREE.MeshStandardMaterial({
        color: 0x99ddff,
        emissive: new THREE.Color(0.03, 0.14, 0.55),
        emissiveIntensity: 0.9,
        transparent: true, opacity: 0.72,
        roughness: 0.04, metalness: 0.08,
        side: THREE.DoubleSide, depthWrite: false,
    });
    const spaceBaseY = CRYSTAL_BASE_Y * 0.60;
    const spaceMesh = new THREE.Mesh(crystalGeo, spaceMat);
    spaceMesh.scale.set(SPACE_SCX, SPACE_SCY, CRYSTAL_SCZ);
    spaceMesh.position.set(0.4, spaceBaseY, spaceZ);
    keyboardGroup.add(spaceMesh);

    const spaceCore = new THREE.Mesh(
        new THREE.SphereGeometry(0.042, 4, 4),
        new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x55ccff, emissiveIntensity: 18 })
    );
    spaceCore.position.set(0.4, spaceBaseY, spaceZ);
    keyboardGroup.add(spaceCore);

    keys3D[' '] = {
        mesh: spaceMesh, topMat: spaceMat,
        pressAnim: 0, glowAnim: 0,
        baseY: spaceBaseY,
        crystal: true,
        scaleX: SPACE_SCX, scaleY: SPACE_SCY, scaleZ: CRYSTAL_SCZ,
        phase: Math.random() * Math.PI * 2,
        core: spaceCore,
    };

    // ── Lighting ──────────────────────────────────────────
    // Ice-blue underglow
    const underGlow = new THREE.PointLight(0x33aaff, 7, 10);
    underGlow.position.set(0, -0.3, 1.5);
    keyboardGroup.add(underGlow);

    // Teal side-fill
    const sideGlow = new THREE.PointLight(0x00ffdd, 2.5, 8);
    sideGlow.position.set(-3.5, 0.6, 1.5);
    keyboardGroup.add(sideGlow);

    // Cold overhead
    const topLight = new THREE.PointLight(0xaaddff, 2.5, 7);
    topLight.position.set(0, 2.8, 1.5);
    keyboardGroup.add(topLight);

    scene.add(keyboardGroup);
    keys3DArray = Object.values(keys3D);
}

// Keyboard input handlers
function onDocKeyDown(e) {
    if (!isRunning) return;
    const k = e.key.toLowerCase();
    if (k === 'backspace') return;
    if (k === ' ') { triggerKey(' '); return; }
    if (k.length === 1 && keys3D[k]) triggerKey(k);
}
function onDocKeyUp() {}
const _keyWorldPos = new THREE.Vector3();

function triggerKey(ch) {
    const kd = keys3D[ch];
    if (!kd) return;
    kd.pressAnim = 1;
    kd.glowAnim = 1;
    if (KB_THEMES[kbTheme]?.rippleEnabled) {
        kd.mesh.getWorldPosition(_keyWorldPos);
        spawnForgeParticles(_keyWorldPos);
    }
}

function spawnForgeParticles(pos) {
    for (let i = 0; i < 7; i++) {
        if (exitParticleData.length >= exitParticleMax) break;
        const angle = (Math.random() - 0.5) * Math.PI * 0.85;
        const speed = 2.8 + Math.random() * 4.2;
        const heat  = Math.random();
        exitParticleData.push({
            x: pos.x + (Math.random() - 0.5) * 0.08,
            y: pos.y + 0.14,
            z: pos.z + (Math.random() - 0.5) * 0.08,
            vx: Math.sin(angle) * speed * 0.55,
            vy: Math.cos(angle) * speed,
            vz: (Math.random() - 0.5) * 0.7,
            gravity: -6.5,
            life: 1.0,
            decay: 1.8 + Math.random() * 1.2,
            scale: 0.11 + Math.random() * 0.20,
            r: 1.0,
            g: heat < 0.3 ? 0.92 : heat < 0.65 ? 0.42 + Math.random() * 0.3 : 0.16,
            b: heat < 0.15 ? 0.55 : 0.0,
        });
    }
}


// ══════════════════════════════════════════════════════════
// EXIT PARTICLE POOL — shared InstancedMesh for ink-burst & ember-ash
// ══════════════════════════════════════════════════════════
function buildExitParticles() {
    const geo = new THREE.SphereGeometry(0.045, 4, 4);
    const mat = new THREE.MeshStandardMaterial({
        roughness: 0.6, metalness: 0.0,
        emissive: new THREE.Color(1, 1, 1), emissiveIntensity: 1.2,
        transparent: true, opacity: 1.0,
    });
    exitParticleMesh = new THREE.InstancedMesh(geo, mat, EXIT_PARTICLE_MAX);
    exitParticleMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    exitParticleMesh.count = 0;
    // Hide all instances off-screen initially
    for (let i = 0; i < EXIT_PARTICLE_MAX; i++) {
        _epDummy.position.set(0, -999, 0);
        _epDummy.scale.setScalar(0);
        _epDummy.updateMatrix();
        exitParticleMesh.setMatrixAt(i, _epDummy.matrix);
    }
    exitParticleMesh.instanceMatrix.needsUpdate = true;
    scene.add(exitParticleMesh);
}

function spawnExitParticles(originChars, mode) {
    const isInk    = mode === 'ink-burst';
    const isEmber  = mode === 'ember-ash';
    const isBlood  = mode === 'blood-rain';
    const isCrystal = mode === 'crystal-freeze';
    const isLava   = mode === 'lava-burst';
    const isPoison = mode === 'poison-drip';
    const isGold   = mode === 'gilded-cascade';

    for (const cm of originChars) {
        const cx = cm.position.x;
        const cy = cm.position.y;
        const cz = cm.position.z;
        const count = isInk ? 7 : isBlood ? 10 : isCrystal ? 8 : isLava ? 12 : isPoison ? 8 : isGold ? 12 : 4;

        for (let p = 0; p < count; p++) {
            if (exitParticleData.length >= exitParticleMax) break;
            const angle = Math.random() * Math.PI * 2;
            const tilt  = (Math.random() - 0.5) * Math.PI;

            let vx, vy, vz, gravity, life, decay, scale, r, g, b;

            if (isInk) {
                const speed = 2.5 + Math.random() * 3.5;
                vx = Math.cos(angle) * Math.cos(tilt) * speed;
                vy = (Math.random() - 0.3) * speed;
                vz = Math.sin(angle) * Math.cos(tilt) * speed * 0.35;
                gravity = -4.5; decay = 1.4 + Math.random(); scale = 0.4 + Math.random() * 0.6;
                r = Math.random() < 0.3 ? 0.55 : 0.05; g = 0; b = 0;

            } else if (isEmber) {
                const speed = 0.8 + Math.random() * 1.4;
                vx = Math.cos(angle) * speed * 0.5;
                vy = 1.2 + Math.random() * 2.0;
                vz = Math.sin(angle) * speed * 0.2;
                gravity = -0.3; decay = 0.6 + Math.random() * 0.5; scale = 0.25 + Math.random() * 0.45;
                r = 1.0; g = 0.3 + Math.random() * 0.4; b = 0;

            } else if (isBlood) {
                // Arc up then rain down — high initial vy, strong gravity
                const spread = (Math.random() - 0.5) * 3.0;
                vx = spread;
                vy = 3.5 + Math.random() * 3.0;   // strong upward launch
                vz = (Math.random() - 0.5) * 0.5;
                gravity = -9.0;                    // heavy gravity → arc
                decay = 0.5 + Math.random() * 0.4;
                scale = 0.3 + Math.random() * 0.5;
                // Crimson to dark red
                r = 0.6 + Math.random() * 0.4; g = 0; b = 0;

            } else if (isCrystal) {
                // Fast all-direction scatter — tiny ice shards
                const speed = 3.0 + Math.random() * 4.0;
                vx = Math.cos(angle) * Math.cos(tilt) * speed;
                vy = Math.sin(tilt) * speed + 0.5;
                vz = Math.sin(angle) * Math.cos(tilt) * speed * 0.4;
                gravity = -2.5; decay = 1.8 + Math.random();
                scale = 0.15 + Math.random() * 0.3;
                r = 0.5 + Math.random() * 0.5; g = 0.8 + Math.random() * 0.2; b = 1.0;

            } else if (isLava) {
                // Full radial explosion — every direction, orange/yellow/white-hot
                const speed = 3.5 + Math.random() * 4.5;
                vx = Math.cos(angle) * Math.cos(tilt) * speed;
                vy = Math.sin(tilt) * speed;  // true radial — goes all directions including down
                vz = Math.sin(angle) * Math.cos(tilt) * speed * 0.5;
                gravity = -5.0; decay = 1.0 + Math.random() * 0.8;
                scale = 0.2 + Math.random() * 0.45;
                // White-hot core → orange → dark
                const heat = Math.random();
                r = 1.0;
                g = heat < 0.3 ? 1.0 : heat < 0.6 ? 0.5 + Math.random() * 0.3 : 0.2 + Math.random() * 0.2;
                b = heat < 0.15 ? 0.8 : 0;

            } else if (isPoison) {
                // Arc up then drip — toxic green/purple, elongated, sinusoidal wobble
                const spread = (Math.random() - 0.5) * 3.2;
                vx = spread;
                vy = 3.0 + Math.random() * 2.5;
                vz = (Math.random() - 0.5) * 0.4;
                gravity = -8.5; decay = 0.55 + Math.random() * 0.4;
                scale = 0.2 + Math.random() * 0.35;
                // Elongated drip shape
                Object.assign({ scaleY: 2.0 + Math.random() * 1.5 }, {});
                // Wobble params
                const wobbleAmp = 0.03 + Math.random() * 0.06;
                const wobbleSpeed = 8 + Math.random() * 6;
                // Toxic green / acid purple
                const isPurple = Math.random() < 0.35;
                r = isPurple ? 0.6 : 0.1;
                g = isPurple ? 0.0 : 0.85 + Math.random() * 0.15;
                b = isPurple ? 0.9 : 0.1;

                exitParticleData.push({
                    x: cx, y: cy, z: cz, vx, vy, vz, gravity, life: 1.0, decay, scale,
                    scaleY: 2.0 + Math.random() * 1.5,
                    wobbleAmp, wobbleSpeed, wobblePhase: Math.random() * Math.PI * 2,
                    r, g, b,
                });
                continue; // already pushed

            } else if (isGold) {
                // Triumphant wide arc — gold/amber, floaty, generous spread
                const spread = (Math.random() - 0.5) * 5.0;  // wider than blood rain
                vx = spread;
                vy = 2.5 + Math.random() * 3.5;
                vz = (Math.random() - 0.5) * 0.6;
                gravity = -5.5;  // lighter than blood — floatier arc
                decay = 0.4 + Math.random() * 0.35;
                scale = 0.25 + Math.random() * 0.55;
                // Gold: bright yellow → orange → deep amber
                const shade = Math.random();
                r = 1.0;
                g = shade < 0.4 ? 0.85 + Math.random() * 0.15 : shade < 0.7 ? 0.55 + Math.random() * 0.2 : 0.3 + Math.random() * 0.2;
                b = 0;
            }

            exitParticleData.push({ x: cx, y: cy, z: cz, vx, vy, vz, gravity, life: 1.0, decay, scale, r, g, b });
        }
    }
}

function tickExitParticles(delta) {
    let n = exitParticleData.length;
    if (n === 0) return;

    let i = n - 1;
    while (i >= 0) {
        const p = exitParticleData[i];
        p.life -= p.decay * delta;

        if (p.life <= 0) {
            // Swap-and-pop — O(1) removal instead of O(n) splice
            n--;
            if (i < n) exitParticleData[i] = exitParticleData[n];
            exitParticleData.length = n;
            i--;
            continue;
        }

        p.vy += p.gravity * delta;
        p.x  += p.vx * delta;
        p.y  += p.vy * delta;
        p.z  += p.vz * delta;
        p.vx *= (1 - delta * 2.5);

        if (p.wobbleAmp) {
            p.wobblePhase = (p.wobblePhase || 0) + delta * p.wobbleSpeed;
            p.x += Math.sin(p.wobblePhase) * p.wobbleAmp * delta;
        }

        const s  = p.scale * p.life;
        const sy = s * (p.scaleY || 1);
        _epDummy.position.set(p.x, p.y, p.z);
        _epDummy.scale.set(s, sy, s);
        _epDummy.updateMatrix();
        exitParticleMesh.setMatrixAt(i, _epDummy.matrix);
        _epColor.setRGB(p.r, p.g, p.b);
        exitParticleMesh.setColorAt(i, _epColor);
        i--;
    }

    exitParticleMesh.count = n;
    // Only upload to GPU when there's something to update
    exitParticleMesh.instanceMatrix.needsUpdate = n > 0;
    if (exitParticleMesh.instanceColor) exitParticleMesh.instanceColor.needsUpdate = n > 0;
}

// ══════════════════════════════════════════════════════════
// KATANA SLASH MESH — a thin bright plane that sweeps across
// ══════════════════════════════════════════════════════════
function buildSlashMesh() {
    const geo = new THREE.PlaneGeometry(7.0, 0.06);
    const mat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: new THREE.Color(1, 1, 1),
        emissiveIntensity: 0,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        side: THREE.DoubleSide,
    });
    slashMesh = new THREE.Mesh(geo, mat);
    slashMesh.renderOrder = 10;
    scene.add(slashMesh);
}

function triggerSlash(posY, posZ) {
    slashAnim = { elapsed: 0, duration: 0.22, posY, posZ };
    slashMesh.position.set(0, posY, posZ);
    slashMesh.rotation.z = (Math.random() - 0.5) * 0.18; // slight angle
    slashMesh.material.emissiveIntensity = 6;
    slashMesh.material.opacity = 1.0;
}

function tickSlash(delta) {
    if (!slashAnim) return;
    slashAnim.elapsed += delta;
    const t = slashAnim.elapsed / slashAnim.duration;
    if (t >= 1) {
        slashMesh.material.opacity = 0;
        slashMesh.material.emissiveIntensity = 0;
        slashAnim = null;
        return;
    }
    // Fast in, slow fade out — easeOutQuart
    const fade = 1 - Math.pow(t, 2);
    slashMesh.material.opacity = fade * 0.92;
    slashMesh.material.emissiveIntensity = fade * 8;
    // Scale from thin to wide as it "expands"
    slashMesh.scale.y = 1 + t * 3.5;
}

// ══════════════════════════════════════════════════════════
// GHOST DISSOLVE PLANES — canvas→texture + GLSL noise dissolve
// ══════════════════════════════════════════════════════════

const GHOST_DISSOLVE_VERT = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const GHOST_DISSOLVE_FRAG = `
uniform sampler2D uTex;
uniform float uProgress;   // 0 → 1 (dissolve front)
uniform vec3 uEdgeColor;
varying vec2 vUv;

// Quick hash noise
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
float fbm(vec2 p) {
    float v = 0.0;
    v += 0.5000 * noise(p);
    v += 0.2500 * noise(p * 2.0);
    v += 0.1250 * noise(p * 4.0);
    v += 0.0625 * noise(p * 8.0);
    return v;
}

void main() {
    vec4 texel = texture2D(uTex, vUv);
    if (texel.a < 0.05) discard;

    float n = fbm(vUv * 5.5);
    float dissolve = n - uProgress * 1.3;

    if (dissolve < 0.0) discard;

    // Glowing edge band
    float edge = smoothstep(0.0, 0.18, dissolve);
    vec3 col = mix(uEdgeColor, texel.rgb, edge);
    float alpha = texel.a * edge;

    gl_FragColor = vec4(col, alpha);
}
`;

function renderWordToTexture(word, color) {
    const W = 512, H = 96;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, W, H);
    const hex = '#' + color.toString(16).padStart(6, '0');
    ctx.fillStyle = hex;
    ctx.font = `bold 64px "JetBrains Mono", monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(word, W / 2, H / 2);
    const tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
}

function spawnGhostDissolve(word, posY, posZ, correct) {
    const edgeColor = correct
        ? new THREE.Color(0x00ffcc)
        : new THREE.Color(0xff3333);
    const wordColor = correct ? 0x44ffff : 0xff5555;

    const tex = renderWordToTexture(word, wordColor);
    const aspect = 512 / 96;
    const height = QUEUE_SLOTS[0].size * 1.5;
    const geo = new THREE.PlaneGeometry(height * aspect, height);
    const mat = new THREE.ShaderMaterial({
        vertexShader:   GHOST_DISSOLVE_VERT,
        fragmentShader: GHOST_DISSOLVE_FRAG,
        uniforms: {
            uTex:       { value: tex },
            uProgress:  { value: 0.0 },
            uEdgeColor: { value: edgeColor },
        },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(0, posY, posZ);
    scene.add(mesh);
    ghostPlanes.push({ mesh, mat, tex, elapsed: 0, duration: 0.65 });
}

function tickGhostPlanes(delta) {
    for (let i = ghostPlanes.length - 1; i >= 0; i--) {
        const g = ghostPlanes[i];
        g.elapsed += delta;
        const t = Math.min(1, g.elapsed / g.duration);
        g.mat.uniforms.uProgress.value = t;
        if (t >= 1) {
            scene.remove(g.mesh);
            g.mesh.geometry.dispose();
            g.mat.dispose();
            g.tex.dispose();
            ghostPlanes.splice(i, 1);
        }
    }
}

// ══════════════════════════════════════════════════════════
// LIGHTNING ARC — crackling jagged line that sweeps the word
// ══════════════════════════════════════════════════════════
function buildLightningMesh() {
    const positions = new Float32Array(LIGHTNING_SEGS * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
    const mat = new THREE.LineBasicMaterial({ color: 0x88ddff, transparent: true, opacity: 0 });
    lightningLine = new THREE.Line(geo, mat);
    lightningLine.renderOrder = 11;
    scene.add(lightningLine);
}

function triggerLightning(posY, posZ, width) {
    lightningAnim = { elapsed: 0, duration: 0.20, posY, posZ, width: width || 4.5 };
}

function tickLightning(delta) {
    if (!lightningAnim || !lightningLine) return;
    lightningAnim.elapsed += delta;
    const t = lightningAnim.elapsed / lightningAnim.duration;
    if (t >= 1) {
        lightningLine.material.opacity = 0;
        lightningAnim = null;
        return;
    }
    // Regenerate jagged points every frame → crackle effect
    const pos = lightningLine.geometry.attributes.position;
    const hw = lightningAnim.width * 0.5;
    const py = lightningAnim.posY;
    const pz = lightningAnim.posZ;
    for (let i = 0; i < LIGHTNING_SEGS; i++) {
        const x = -hw + (i / (LIGHTNING_SEGS - 1)) * lightningAnim.width;
        const yOff = (i === 0 || i === LIGHTNING_SEGS - 1) ? 0 : (Math.random() - 0.5) * 0.55;
        pos.setXYZ(i, x, py + yOff, pz);
    }
    pos.needsUpdate = true;
    lightningLine.geometry.computeBoundingSphere();
    // Flicker: random frame blackouts for spark look
    const flicker = Math.random() > 0.25 ? 1 : 0.15;
    const fade = t < 0.65 ? 1 : 1 - (t - 0.65) / 0.35;
    lightningLine.material.opacity = fade * flicker * 0.95;
    lightningLine.material.color.setHex(Math.random() > 0.4 ? 0xaaddff : 0xffffff);
}

// ══════════════════════════════════════════════════════════
// POST-PROCESSING
// ══════════════════════════════════════════════════════════
function buildPostProcessing() {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    // Zen gets softer, dreamier bloom
    const strength  = sceneType === 'zen' ? 0.6 : 1.1;
    const radius    = sceneType === 'zen' ? 0.8 : 0.6;
    const threshold = sceneType === 'zen' ? 0.85 : 0.7;

    bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        strength, radius, threshold
    );
    composer.addPass(bloomPass);
}

// ══════════════════════════════════════════════════════════
// ANIMATION LOOP
// ══════════════════════════════════════════════════════════
function animate() {
    if (!isRunning) return;
    animId = requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), 0.05);
    time += delta;

    // Keypress flash fade
    if (keypressFlash > 0) {
        keypressFlash = Math.max(0, keypressFlash - delta * 4.5);
        keypressLight.intensity = keypressFlash * 10 * keyFlashMultiplier;
    }

    // Light flicker — lanterns (dojo) or braziers (forge)
    const flickerLights = sceneType === 'dojo' ? lanternLights
                       : sceneType === 'zen'  ? zenLanternLights
                       : brazierLights;
    for (let i = 0; i < flickerLights.length; i++) {
        const base = flickerLights[i]._baseIntensity || flickerLights[i].intensity;
        if (!flickerLights[i]._baseIntensity) flickerLights[i]._baseIntensity = base;
        const flick = 1 + Math.sin(time * (3.5 + i * 0.7)) * 0.1 + Math.sin(time * (7 + i * 1.3)) * 0.05;
        flickerLights[i].intensity = base * flick;
    }

    // Wind from WPM
    const wind = 1 + Math.min(currentWPM / 60, 2.8);

    // Particles — petals (dojo) or embers (forge)
    if (sceneType === 'dojo' && petalMesh) {
        for (let i = 0; i < PETAL_COUNT; i++) {
            const p = petalData[i];
            p.x += p.vx * wind;
            p.y += p.vy + Math.sin(time * 0.7 + p.phase) * p.wobble;
            p.z += p.vz;
            p.rx += p.vrx;
            p.ry += p.vry * wind;
            p.rz += p.vrz;

            if (p.x < -8 || p.y < -0.5) {
                Object.assign(p, randomPetal(true));
            }

            dummy.position.set(p.x, p.y, p.z);
            dummy.rotation.set(p.rx, p.ry, p.rz);
            dummy.scale.set(1, 1, 1);
            dummy.updateMatrix();
            petalMesh.setMatrixAt(i, dummy.matrix);
        }
        petalMesh.instanceMatrix.needsUpdate = true;
    } else if (sceneType === 'forge' && emberMesh) {
        for (let i = 0; i < EMBER_COUNT; i++) {
            const e = emberData[i];
            e.x += e.vx + Math.sin(time * 0.5 + e.phase) * e.wobble;
            e.y += e.vy * wind;
            e.z += e.vz;
            e.rx += e.vrx;
            e.ry += e.vry;
            e.rz += e.vrz;

            if (e.y > 8) {
                Object.assign(e, randomEmber(true));
            }

            dummy.position.set(e.x, e.y, e.z);
            dummy.rotation.set(e.rx, e.ry, e.rz);
            dummy.scale.set(1, 1, 1);
            dummy.updateMatrix();
            emberMesh.setMatrixAt(i, dummy.matrix);
        }
        emberMesh.instanceMatrix.needsUpdate = true;
    } else if (sceneType === 'zen' && fireflyMesh) {
        for (let i = 0; i < FIREFLY_COUNT; i++) {
            const f = fireflyData[i];

            // Lazy drift
            f.wobblePhase += 0.3 * delta;
            f.x += f.vx + Math.sin(f.wobblePhase) * 0.001;
            f.y += f.vy + Math.sin(f.wobblePhase * 0.7 + f.pulsePhase) * 0.0005;
            f.z += f.vz;

            // Recycle out of bounds
            if (f.x < -8 || f.x > 8 || f.y < 0 || f.y > 5 || f.z < -15 || f.z > 8) {
                Object.assign(f, randomFirefly());
            }

            // Pulsing scale — breathing glow
            const pulse = 0.2 + Math.sin(time * 1.5 + f.pulsePhase) * 0.5;
            const scale = 0.5 + pulse * 1.0;

            dummy.position.set(f.x, f.y, f.z);
            dummy.rotation.set(0, 0, 0);
            dummy.scale.setScalar(scale);
            dummy.updateMatrix();
            fireflyMesh.setMatrixAt(i, dummy.matrix);
        }
        fireflyMesh.instanceMatrix.needsUpdate = true;
    }

    // Keyboard animation
    for (const kd of keys3DArray) {
        if (kd.pressAnim > 0) kd.pressAnim = Math.max(0, kd.pressAnim - delta * 7);
        kd.mesh.position.y = kd.baseY - kd.pressAnim * KEY_PRESS_DEPTH;

        if (kd.glowAnim > 0) kd.glowAnim = Math.max(0, kd.glowAnim - delta * 3.5);
        const g = kd.glowAnim;
        if (g > 0.01) {
            let hex = kd.pressColor || currentTheme.correct;
            if (!kd.pressColor && currentTheme.mode === 'rainbow' && currentTheme.rows) {
                hex = currentTheme.rows[kd.row !== undefined ? kd.row % currentTheme.rows.length : 0];
            } else if (!kd.pressColor && currentTheme.mode === 'gradient' && currentTheme.gradient) {
                hex = currentTheme.gradient[kd.col !== undefined ? kd.col % currentTheme.gradient.length : 0];
            }
            _tmpColor.set(hex);
            kd.topMat.emissive.setRGB(_tmpColor.r * g, _tmpColor.g * g, _tmpColor.b * g);
            kd.topMat.emissiveIntensity = 0.5 + g * 3.5 * keyFlashMultiplier;
        } else if (currentTheme.mode === 'rainbow' && currentTheme.rows && kd.row !== undefined) {
            _tmpColor.set(currentTheme.rows[kd.row % currentTheme.rows.length]);
            kd.topMat.emissive.setRGB(_tmpColor.r * 0.12, _tmpColor.g * 0.12, _tmpColor.b * 0.12);
            kd.topMat.emissiveIntensity = 1.0;
        } else if (currentTheme.mode === 'gradient' && currentTheme.gradient && kd.col !== undefined) {
            _tmpColor.set(currentTheme.gradient[kd.col % currentTheme.gradient.length]);
            kd.topMat.emissive.setRGB(_tmpColor.r * 0.12, _tmpColor.g * 0.12, _tmpColor.b * 0.12);
            kd.topMat.emissiveIntensity = 1.0;
        } else {
            kd.topMat.emissive.setHex(kd.idleEmissive || 0x0a0a20);
            kd.topMat.emissiveIntensity = 0.5;
        }
    }

    // Word queue animation
    animateQueue(delta);

    // Exit particle system (ink-burst, ember-ash)
    tickExitParticles(delta);

    // Katana slash sweep
    tickSlash(delta);

    // Lightning arc crackle
    tickLightning(delta);

    // Ghost dissolve planes
    tickGhostPlanes(delta);

    // Camera — gentle breathing sway driven by preset
    {
        const presets = CAM_PRESETS[sceneType] || CAM_PRESETS.dojo;
        const cam = presets[currentCamPreset] || presets[0];
        const [freqX, ampX, freqY, ampY, freqLook, ampLook] = cam.sway;
        camera.position.x = cam.pos[0] + Math.sin(time * freqX) * ampX;
        camera.position.y = cam.pos[1] + Math.sin(time * freqY) * ampY;
        camera.lookAt(
            cam.look[0] + Math.sin(time * freqLook) * ampLook,
            cam.look[1],
            cam.look[2]
        );
    }

    composer.render();
}

// ══════════════════════════════════════════════════════════
// 3D TEXT RENDERING
// ══════════════════════════════════════════════════════════
// 3D WORD QUEUE — one word at a time, flowing up toward you
// ══════════════════════════════════════════════════════════

function clearThreeText() {
    if (textGroup) {
        textGroup.traverse(c => { if (c.dispose) c.dispose(); });
        scene.remove(textGroup);
        textGroup = null;
    }
    queueEntries = [];
    dyingEntries = [];
}

function makeWordMesh(word, slot) {
    const s = QUEUE_SLOTS[slot];
    const mesh = new Text();
    mesh.text = word;
    mesh.fontSize = s.size;
    mesh.color = C_UNTYPED;
    mesh.anchorX = 'center';
    mesh.anchorY = 'middle';
    mesh.fillOpacity = s.opacity;
    mesh.position.set(0, s.y, s.z);
    mesh.sync();
    return mesh;
}

function makeCharMeshes(word) {
    const s = QUEUE_SLOTS[0];
    const charW = s.size * 0.55;
    const totalW = word.length * charW;
    const startX = -totalW / 2;
    const meshes = [];

    for (let i = 0; i < word.length; i++) {
        const cm = new Text();
        cm.text = word[i];
        cm.fontSize = s.size;
        cm.color = C_ACTIVE;
        cm.anchorX = 'center';
        cm.anchorY = 'middle';
        cm.fillOpacity = 1.0;
        cm.position.set(startX + i * charW + charW / 2, s.y, s.z);
        cm.sync();
        meshes.push(cm);
    }
    return meshes;
}

/** Initialize the word queue with 5 words */
export function initThreeQueue(words, startIndex) {
    if (!scene) return;
    clearThreeText();

    textGroup = new THREE.Group();
    textGroup.position.set(0, 0, 0);
    scene.add(textGroup);

    for (let i = 0; i < QUEUE_SLOTS.length; i++) {
        const wi = startIndex + i;
        if (wi >= words.length) break;
        const word = words[wi];

        if (i === 0) {
            // Current word — per-character meshes
            const charMeshes = makeCharMeshes(word);
            charMeshes.forEach(cm => textGroup.add(cm));
            queueEntries.push({
                mesh: null, charMeshes, word, slot: 0,
                posY: QUEUE_SLOTS[0].y, posZ: QUEUE_SLOTS[0].z, opacity: 1.0,
            });
        } else {
            // Queue words — single mesh
            const mesh = makeWordMesh(word, i);
            textGroup.add(mesh);
            queueEntries.push({
                mesh, charMeshes: null, word, slot: i,
                posY: QUEUE_SLOTS[i].y, posZ: QUEUE_SLOTS[i].z, opacity: QUEUE_SLOTS[i].opacity,
            });
        }
    }
}

/** Update per-character coloring on the current word (slot 0) */
export function updateThreeTyping(typedInput, targetWord) {
    const entry = queueEntries[0];
    if (!entry || !entry.charMeshes) return;

    for (let i = 0; i < entry.charMeshes.length; i++) {
        const cm = entry.charMeshes[i];
        if (i < typedInput.length) {
            cm.color = typedInput[i] === targetWord[i] ? C_CORRECT : C_WRONG;
        } else {
            cm.color = C_ACTIVE;
        }
        cm.sync();
    }
}

/** Complete current word → fly it away, slide queue up, add new word at back */
export function advanceThreeQueue(wasCorrect, words, nextBackIndex) {
    if (!textGroup || queueEntries.length === 0) return;

    // 1. Current word → dying (fly up and fade)
    const completed = queueEntries.shift();
    if (completed.charMeshes) {
        const hitColor = wasCorrect ? 0x00ffaa : 0xff4444;

        // Flash color on all chars first
        completed.charMeshes.forEach(cm => { cm.color = hitColor; cm.sync(); });

        // Build per-char velocity data
        const velocities = completed.charMeshes.map((cm, idx) => {
            const alt = idx % 2 === 0 ? 1 : -1;

            if (exitAnimMode === 'slash') {
                return {
                    vx: alt * (1.5 + Math.random() * 1.8),
                    vy: 1.0 + Math.random() * 1.2,
                    vz: (Math.random() - 0.5) * 0.4,
                    vrz: alt * (0.5 + Math.random() * 0.35),
                };
            }
            if (exitAnimMode === 'drip') {
                return {
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: -(0.1 + Math.random() * 0.15),
                    gravity: -(4.5 + Math.random() * 3.0),
                };
            }
            if (exitAnimMode === 'vortex') {
                const cx = cm.position.x;
                return {
                    angle: cx >= 0 ? 0.15 : Math.PI - 0.15,
                    radius: Math.abs(cx) + 0.3,
                    angVel: 8 + Math.random() * 4,
                    centerY: cm.position.y,
                    posZ: cm.position.z,
                };
            }
            if (exitAnimMode === 'glitch') {
                return {
                    baseX: cm.position.x,
                    baseY: cm.position.y,
                    jitterTimer: Math.random() * 0.04,
                    jitterInterval: 0.03 + Math.random() * 0.035,
                    jitterX: 0, jitterY: 0,
                    amp: 0.18 + Math.random() * 0.22,
                };
            }
            if (exitAnimMode === 'ignite') {
                return {
                    vx: (Math.random() - 0.5) * 0.7,
                    vy: 2.2 + Math.random() * 2.0,
                    delay: idx * 0.022,
                };
            }

            // ── NEW ANIMATIONS ──────────────────────────────────
            if (exitAnimMode === 'ink-burst') {
                // Characters implode to center then ink drips downward
                return {
                    // Phase 1: implode toward center (0 → 0.12s)
                    toX: 0, toY: cm.position.y - 0.15, toZ: cm.position.z,
                    // Phase 2: gravity drip (after implosion)
                    vx: (Math.random() - 0.5) * 0.6,
                    vy: -(0.2 + Math.random() * 0.3),
                    gravity: -(6 + Math.random() * 4),
                    implosionDone: false,
                };
            }
            if (exitAnimMode === 'ember-ash') {
                // Characters drift upward slowly, shrinking, fading like ash
                return {
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: 0.8 + Math.random() * 1.2,
                    vz: (Math.random() - 0.5) * 0.1,
                    wobble: (Math.random() - 0.5) * 4.0,
                    delay: idx * 0.018,
                };
            }
            if (exitAnimMode === 'katana-cut') {
                // Pause briefly then explode outward with strong elastic separation
                const side = idx % 2 === 0 ? 1 : -1;
                const dist = Math.abs(cm.position.x) + 0.5;
                return {
                    vx: side * (3.5 + dist * 1.2 + Math.random() * 1.5),
                    vy: 1.8 + Math.random() * 2.2,
                    vz: (Math.random() - 0.5) * 0.8,
                    vrz: side * (1.0 + Math.random() * 0.8),
                    delay: 0.06, // wait for slash to hit
                };
            }
            if (exitAnimMode === 'kanji-morph') {
                // Jitter through kanji symbols, then implode
                const KANJI = ['斬','刃','忍','気','武','道','霊','鬼','禅','刀','侍','魂'];
                return {
                    baseX: cm.position.x,
                    baseY: cm.position.y,
                    morphTimer: 0,
                    morphInterval: 0.045,
                    morphCount: 0,
                    maxMorphs: 5 + Math.floor(Math.random() * 4),
                    kanjiPool: KANJI,
                    done: false,
                };
            }
            if (exitAnimMode === 'ghost-dissolve') {
                // Handled specially below — chars hidden immediately
                return { skip: true };
            }

            if (exitAnimMode === 'blood-rain') {
                // Chars arc up then rain down — same trajectory as particles
                const spread = (Math.random() - 0.5) * 2.5;
                return {
                    vx: spread,
                    vy: 2.5 + Math.random() * 2.0,
                    vz: (Math.random() - 0.5) * 0.3,
                    gravity: -8.0,
                };
            }
            if (exitAnimMode === 'lightning-arc') {
                // Freeze in place during arc, then vaporize outward
                return {
                    baseX: cm.position.x,
                    baseY: cm.position.y,
                    vx: (Math.random() - 0.5) * 1.5,
                    vy: 0.4 + Math.random() * 0.8,
                };
            }
            if (exitAnimMode === 'crystal-freeze') {
                // Phase 1: scale up (crystallize). Phase 2: shatter outward
                const angle = Math.random() * Math.PI * 2;
                const speed = 3.0 + Math.random() * 3.5;
                return {
                    vx: Math.cos(angle) * speed,
                    vy: 1.0 + Math.random() * 3.0,
                    vz: (Math.random() - 0.5) * 0.6,
                    vrx: (Math.random() - 0.5) * 3.0,
                    vrz: (Math.random() - 0.5) * 3.0,
                };
            }
            if (exitAnimMode === 'void-pull') {
                // Spaghettification — chars stretch toward center then vanish
                return {
                    targetX: 0,
                    pullSpeed: 4.5 + Math.random() * 2.0,
                };
            }
            if (exitAnimMode === 'neon-zip') {
                // Short pause then explosive zip in random direction
                const angle = Math.random() * Math.PI * 2;
                const speed = 9.0 + Math.random() * 6.0;
                return {
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    vz: (Math.random() - 0.5) * 2.0,
                    delay: 0.055,
                    neonColor: currentTheme.flash[Math.floor(Math.random() * currentTheme.flash.length)],
                };
            }
            if (exitAnimMode === 'ripple-cascade') {
                // Sequential wave — each char exits with a staggered delay
                return {
                    vx: (Math.random() - 0.5) * 1.2,
                    vy: 1.2 + Math.random() * 1.0,
                    gravity: -6.0,
                    delay: idx * 0.048,
                    bounced: false,
                    floorY: 0.5,
                };
            }
            if (exitAnimMode === 'oni-slam') {
                // Slam downward with extreme force, bounce once
                return {
                    vx: (Math.random() - 0.5) * 0.8,
                    vy: -(9.0 + Math.random() * 4.0),
                    bounced: false,
                    floorY: 0.4,
                };
            }
            if (exitAnimMode === 'lava-burst') {
                // Radial explosion — all directions, then fall
                const angle2 = Math.random() * Math.PI * 2;
                const speed  = 3.0 + Math.random() * 3.5;
                return {
                    vx: Math.cos(angle2) * speed,
                    vy: Math.sin(angle2) * speed * 0.8 + 0.5,
                    vz: (Math.random() - 0.5) * 0.7,
                };
            }
            if (exitAnimMode === 'poison-drip') {
                // Same arc as blood-rain but with wobble
                return {
                    vx: (Math.random() - 0.5) * 2.0,
                    vy: 2.5 + Math.random() * 2.0,
                    gravity: -8.5,
                    wobbleAmp: 0.25 + Math.random() * 0.3,
                    wobbleSpeed: 7 + Math.random() * 5,
                    wobblePhase: Math.random() * Math.PI * 2,
                };
            }
            if (exitAnimMode === 'gilded-cascade') {
                // Wide triumphant arc — floaty gravity
                const spread = (Math.random() - 0.5) * 3.5;
                return {
                    vx: spread,
                    vy: 2.8 + Math.random() * 2.5,
                    vz: (Math.random() - 0.5) * 0.4,
                    gravity: -5.0,
                };
            }

            // --- classic modes ---
            if (exitAnimMode === 'evaporate') {
                return {
                    vx: (Math.random() - 0.5) * 0.8,
                    vy: 0.6 + Math.random() * 0.6,
                    vz: (Math.random() - 0.5) * 0.2,
                };
            }
            if (exitAnimMode === 'implode') {
                return { vx: 0, vy: 0, vz: 0 };
            }
            // shatter / scatter / flyup
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.8 + Math.random() * 2.0;
            return {
                vx: Math.cos(angle) * speed,
                vy: exitAnimMode === 'shatter' ? (0.5 + Math.random() * 2.5) : Math.sin(angle) * speed,
                vz: (Math.random() - 0.5) * speed * 0.4,
            };
        });

        // Override flash color for special modes
        if (exitAnimMode === 'slash') {
            const fc = wasCorrect ? 0xffffff : 0xff8888;
            completed.charMeshes.forEach(cm => { cm.color = fc; cm.sync(); });
        } else if (exitAnimMode === 'ignite') {
            completed.charMeshes.forEach(cm => { cm.color = 0xffee88; cm.sync(); });
        } else if (exitAnimMode === 'glitch') {
            completed.charMeshes.forEach(cm => { cm.color = 0x00ffff; cm.sync(); });
        } else if (exitAnimMode === 'evaporate') {
            const flashColor = wasCorrect ? 0xaaffee : 0xff9999;
            completed.charMeshes.forEach(cm => { cm.color = flashColor; cm.sync(); });
        } else if (exitAnimMode === 'ink-burst') {
            // Flash to white then dark ink
            completed.charMeshes.forEach(cm => { cm.color = 0xffffff; cm.sync(); });
            setTimeout(() => {
                completed.charMeshes.forEach(cm => { if (cm) { cm.color = wasCorrect ? 0x112233 : 0x440000; cm.sync(); } });
            }, 80);
            spawnExitParticles(completed.charMeshes, 'ink-burst');
        } else if (exitAnimMode === 'ember-ash') {
            completed.charMeshes.forEach(cm => { cm.color = wasCorrect ? 0xff8800 : 0xff3300; cm.sync(); });
            spawnExitParticles(completed.charMeshes, 'ember-ash');
        } else if (exitAnimMode === 'katana-cut') {
            // Flash bright white, then trigger the slash line
            completed.charMeshes.forEach(cm => { cm.color = wasCorrect ? 0xffffff : 0xff4444; cm.sync(); });
            triggerSlash(completed.posY, completed.posZ);
        } else if (exitAnimMode === 'kanji-morph') {
            completed.charMeshes.forEach(cm => { cm.color = 0xff00ff; cm.sync(); });
        } else if (exitAnimMode === 'ghost-dissolve') {
            // Hide troika chars immediately, spawn shader plane
            completed.charMeshes.forEach(cm => { cm.fillOpacity = 0; });
            spawnGhostDissolve(completed.word, completed.posY, completed.posZ, wasCorrect);
        } else if (exitAnimMode === 'blood-rain') {
            completed.charMeshes.forEach(cm => { cm.color = wasCorrect ? 0xff1111 : 0x880000; cm.sync(); });
            spawnExitParticles(completed.charMeshes, 'blood-rain');
        } else if (exitAnimMode === 'lightning-arc') {
            completed.charMeshes.forEach(cm => { cm.color = 0xffffff; cm.sync(); });
            // Measure word width for the arc
            const s = QUEUE_SLOTS[0];
            const wordW = completed.word.length * s.size * 0.55;
            triggerLightning(completed.posY, completed.posZ, wordW + 1.2);
        } else if (exitAnimMode === 'crystal-freeze') {
            // Flash to ice blue
            completed.charMeshes.forEach(cm => { cm.color = 0x88eeff; cm.sync(); });
            // Scale up slightly (freeze crystallization) — deferred via CSS-like trick
            setTimeout(() => {
                completed.charMeshes.forEach(cm => { if (cm) { cm.scale.setScalar(1.25); } });
            }, 80);
            setTimeout(() => {
                spawnExitParticles(completed.charMeshes, 'crystal-freeze');
            }, 160);
        } else if (exitAnimMode === 'void-pull') {
            completed.charMeshes.forEach(cm => { cm.color = 0xcc44ff; cm.sync(); });
        } else if (exitAnimMode === 'neon-zip') {
            // Apply pre-assigned neon colors per char, flash white first
            completed.charMeshes.forEach(cm => { cm.color = 0xffffff; cm.sync(); });
            setTimeout(() => {
                completed.charMeshes.forEach((cm, j) => {
                    if (cm) { cm.color = velocities[j]?.neonColor || 0x00ffff; cm.sync(); }
                });
            }, 30);
        } else if (exitAnimMode === 'ripple-cascade') {
            completed.charMeshes.forEach(cm => { cm.color = wasCorrect ? 0x00ffcc : 0xff4444; cm.sync(); });
        } else if (exitAnimMode === 'oni-slam') {
            completed.charMeshes.forEach(cm => { cm.color = 0xff6600; cm.sync(); });
        } else if (exitAnimMode === 'lava-burst') {
            // Flash white-hot first
            completed.charMeshes.forEach(cm => { cm.color = 0xffffff; cm.sync(); });
            setTimeout(() => {
                completed.charMeshes.forEach(cm => { if (cm) { cm.color = 0xff6600; cm.sync(); } });
            }, 60);
            spawnExitParticles(completed.charMeshes, 'lava-burst');
        } else if (exitAnimMode === 'poison-drip') {
            completed.charMeshes.forEach(cm => { cm.color = 0x44ff22; cm.sync(); });
            spawnExitParticles(completed.charMeshes, 'poison-drip');
        } else if (exitAnimMode === 'gilded-cascade') {
            completed.charMeshes.forEach(cm => { cm.color = 0xffd700; cm.sync(); });
            spawnExitParticles(completed.charMeshes, 'gilded-cascade');
        }

        dyingEntries.push({
            meshes: completed.charMeshes,
            posY: completed.posY,
            opacity: exitAnimMode === 'ghost-dissolve' ? 0 : 1.0,
            scale: 1.0,
            type: exitAnimMode,
            velocities,
            elapsed: 0,
            word: completed.word,
            wasCorrect,
        });
    }

    // 2. Slot 1 becomes slot 0 — need to create char meshes
    if (queueEntries.length > 0) {
        const newCurrent = queueEntries[0];
        newCurrent.slot = 0;

        // Remove the single word mesh, replace with char meshes
        if (newCurrent.mesh) {
            textGroup.remove(newCurrent.mesh);
            newCurrent.mesh.dispose();
            newCurrent.mesh = null;
        }

        const charMeshes = makeCharMeshes(newCurrent.word);
        // Start char meshes at the current animated position (not slot 0 yet)
        charMeshes.forEach(cm => {
            cm.position.y = newCurrent.posY;
            cm.position.z = newCurrent.posZ;
            cm.fillOpacity = newCurrent.opacity;
            textGroup.add(cm);
        });
        newCurrent.charMeshes = charMeshes;
    }

    // 3. Shift remaining entries up one slot
    for (let i = 1; i < queueEntries.length; i++) {
        queueEntries[i].slot = i;
    }

    // 4. Add new word at the back if available
    if (nextBackIndex < words.length) {
        const lastSlot = Math.min(queueEntries.length, QUEUE_SLOTS.length - 1);
        if (queueEntries.length < QUEUE_SLOTS.length) {
            const word = words[nextBackIndex];
            const mesh = makeWordMesh(word, lastSlot);
            // Start from below the last slot
            mesh.position.y = QUEUE_SLOTS[lastSlot].y - 1.5;
            mesh.fillOpacity = 0;
            textGroup.add(mesh);
            queueEntries.push({
                mesh, charMeshes: null, word, slot: lastSlot,
                posY: QUEUE_SLOTS[lastSlot].y - 1.5,
                posZ: QUEUE_SLOTS[lastSlot].z,
                opacity: 0,
            });
        }
    }
}

/** Animate the queue in the render loop — call every frame */
function animateQueue(delta) {
    if (!textGroup) return;

    // Animate live entries toward their target slot — smooth ease
    for (const entry of queueEntries) {
        const target = QUEUE_SLOTS[entry.slot];
        const spd = queueScrollSpeed;
        entry.posY = THREE.MathUtils.lerp(entry.posY, target.y, delta * spd);
        entry.posZ = THREE.MathUtils.lerp(entry.posZ, target.z, delta * spd);
        entry.opacity = THREE.MathUtils.lerp(entry.opacity, target.opacity, delta * (spd + 1));

        if (entry.charMeshes) {
            const s = QUEUE_SLOTS[0];
            const charW = s.size * 0.55;
            const totalW = entry.word.length * charW;
            const startX = -totalW / 2;
            for (let i = 0; i < entry.charMeshes.length; i++) {
                entry.charMeshes[i].position.y = entry.posY;
                entry.charMeshes[i].position.z = entry.posZ;
                entry.charMeshes[i].position.x = startX + i * charW + charW / 2;
                entry.charMeshes[i].fillOpacity = entry.opacity;
            }
        } else if (entry.mesh) {
            entry.mesh.position.y = entry.posY;
            entry.mesh.position.z = entry.posZ;
            entry.mesh.fillOpacity = entry.opacity;
        }
    }

    // Animate dying entries
    for (let i = dyingEntries.length - 1; i >= 0; i--) {
        const d = dyingEntries[i];
        d.elapsed += delta;

        if (d.type === 'slash') {
            // Samurai cut — alternating letters fling left/right with rotation, instant fade
            d.opacity = Math.max(0, d.opacity - delta * 5.0);
            d.meshes.forEach((m, j) => {
                const v = d.velocities[j];
                m.position.x += v.vx * delta;
                m.position.y += v.vy * delta;
                m.position.z += v.vz * delta;
                m.rotation.z += v.vrz * delta;
                v.vx *= (1 - delta * 5);
                v.vy *= (1 - delta * 2.5);
                m.fillOpacity = d.opacity;
            });

        } else if (d.type === 'drip') {
            // Letters fall with gravity like ink drips
            d.opacity = Math.max(0, d.opacity - delta * 1.2);
            d.meshes.forEach((m, j) => {
                const v = d.velocities[j];
                v.vy += v.gravity * delta;
                m.position.x += v.vx * delta;
                m.position.y += v.vy * delta;
                m.fillOpacity = d.opacity;
            });

        } else if (d.type === 'vortex') {
            // Letters spiral inward to center, converging like water down a drain
            d.opacity = Math.max(0, d.opacity - delta * 2.5);
            d.meshes.forEach((m, j) => {
                const v = d.velocities[j];
                v.angle += v.angVel * delta;
                v.radius = Math.max(0, v.radius - delta * (2.5 + v.radius * 1.5));
                m.position.x = Math.cos(v.angle) * v.radius;
                m.position.y = v.centerY + Math.sin(v.angle) * v.radius * 0.35;
                m.position.z = v.posZ;
                m.fillOpacity = d.opacity;
            });

        } else if (d.type === 'glitch') {
            // Rapid position/opacity jitter then snap-vanish
            if (d.elapsed < 0.26) {
                d.meshes.forEach((m, j) => {
                    const v = d.velocities[j];
                    v.jitterTimer += delta;
                    if (v.jitterTimer >= v.jitterInterval) {
                        v.jitterTimer = 0;
                        v.jitterX = (Math.random() - 0.5) * v.amp * 2;
                        v.jitterY = (Math.random() - 0.5) * v.amp;
                    }
                    m.position.x = v.baseX + v.jitterX;
                    m.position.y = v.baseY + v.jitterY;
                    m.fillOpacity = 0.4 + Math.random() * 0.6;
                });
            } else {
                // Snap burst — disappear instantly
                d.opacity = Math.max(0, d.opacity - delta * 12);
                d.meshes.forEach((m, j) => {
                    const v = d.velocities[j];
                    m.position.x = v.baseX + (Math.random() - 0.5) * 0.5;
                    m.position.y = v.baseY + (Math.random() - 0.5) * 0.3;
                    m.fillOpacity = d.opacity;
                });
            }

        } else if (d.type === 'ignite') {
            // Letters flash bright yellow then rocket upward and burn out
            d.opacity = d.elapsed > 0.1 ? Math.max(0, d.opacity - delta * 2.8) : 1.0;
            d.meshes.forEach((m, j) => {
                const v = d.velocities[j];
                if (d.elapsed < v.delay) return;
                m.position.x += v.vx * delta;
                m.position.y += v.vy * delta;
                v.vy *= (1 - delta * 0.6);
                m.fillOpacity = d.opacity;
            });

        } else if (d.type === 'evaporate') {
            d.opacity = Math.max(0, d.opacity - delta * 1.2);
            d.meshes.forEach((m, j) => {
                const v = d.velocities[j];
                m.position.x += v.vx * delta;
                m.position.y += v.vy * delta;
                m.position.z += v.vz * delta;
                v.vx *= 0.96;
                m.fillOpacity = d.opacity;
            });

        } else if (d.type === 'shatter') {
            const t = queueScrollSpeed / 12;
            d.opacity = Math.max(0, d.opacity - delta * (1.5 + t * 2));
            d.meshes.forEach((m, j) => {
                const v = d.velocities[j];
                m.position.x += v.vx * delta;
                m.position.y += v.vy * delta;
                m.position.z += v.vz * delta;
                m.fillOpacity = d.opacity;
                m.scale.setScalar(Math.max(0.01, d.opacity));
            });

        } else if (d.type === 'implode') {
            const t = queueScrollSpeed / 12;
            d.scale = Math.max(0, d.scale - delta * (4 + t * 4));
            d.opacity = Math.max(0, d.opacity - delta * (2 + t * 2));
            d.meshes.forEach(m => {
                m.scale.set(d.scale, d.scale, d.scale);
                m.fillOpacity = d.opacity;
            });

        } else if (d.type === 'scatter') {
            const t = queueScrollSpeed / 12;
            d.opacity = Math.max(0, d.opacity - delta * (1.2 + t * 2));
            d.meshes.forEach((m, j) => {
                const v = d.velocities[j];
                m.position.x += v.vx * delta * 0.6;
                m.position.y += v.vy * delta * 0.4;
                m.position.z += v.vz * delta;
                m.fillOpacity = d.opacity;
            });

        } else if (d.type === 'ink-burst') {
            // Phase 1 (0–0.10s): chars implode toward center
            // Phase 2 (0.10s+): drip down with gravity; particles handle the splatter
            if (d.elapsed < 0.10) {
                const t = d.elapsed / 0.10;
                // easeInQuad
                const ease = t * t;
                d.meshes.forEach((m, j) => {
                    const v = d.velocities[j];
                    m.position.x = THREE.MathUtils.lerp(m.position.x, v.toX, ease * 0.35);
                    m.position.y = THREE.MathUtils.lerp(m.position.y, v.toY, ease * 0.2);
                    m.fillOpacity = 1.0 - ease * 0.3;
                });
            } else {
                d.opacity = Math.max(0, d.opacity - delta * 3.5);
                d.meshes.forEach((m, j) => {
                    const v = d.velocities[j];
                    if (!v.implosionDone) {
                        v.implosionDone = true;
                    }
                    v.vy += v.gravity * delta;
                    m.position.x += v.vx * delta;
                    m.position.y += v.vy * delta;
                    m.fillOpacity = d.opacity;
                });
            }

        } else if (d.type === 'ember-ash') {
            // Chars rise, wobble, shrink and fade like burning paper
            // Color shifts: orange → red → transparent
            const phase = Math.min(1, d.elapsed / 0.9);
            d.opacity = Math.max(0, 1 - Math.pow(phase, 1.6));
            const emberColor = phase < 0.4
                ? 0xff8800
                : phase < 0.7
                    ? 0xff3300
                    : 0x440000;
            d.meshes.forEach((m, j) => {
                const v = d.velocities[j];
                if (d.elapsed < v.delay) return;
                m.position.x += (v.vx + Math.sin(d.elapsed * v.wobble) * 0.015) * delta;
                m.position.y += v.vy * delta;
                m.position.z += v.vz * delta;
                v.vy *= (1 - delta * 0.4);  // decelerate rise
                m.scale.setScalar(Math.max(0.01, d.opacity * 0.85));
                m.color = emberColor;
                m.fillOpacity = d.opacity;
                m.sync();
            });

        } else if (d.type === 'katana-cut') {
            // Wait for slash delay, then explode with elastic deceleration
            d.meshes.forEach((m, j) => {
                const v = d.velocities[j];
                if (d.elapsed < v.delay) return;
                const active = d.elapsed - v.delay;
                // easeOutBack deceleration
                const friction = 1 - delta * (3.5 + active * 2.5);
                v.vx *= Math.max(0, friction);
                v.vy *= Math.max(0, 1 - delta * 1.8);
                v.vy -= 4.5 * delta; // gravity
                m.position.x += v.vx * delta;
                m.position.y += v.vy * delta;
                m.position.z += v.vz * delta;
                m.rotation.z += v.vrz * delta;
                v.vrz *= (1 - delta * 3);
            });
            // Delayed fast fade after chars are fully launched
            if (d.elapsed > 0.12) {
                d.opacity = Math.max(0, d.opacity - delta * 4.5);
                d.meshes.forEach(m => { m.fillOpacity = d.opacity; });
            }

        } else if (d.type === 'kanji-morph') {
            // Cycle through kanji, then flash and implode
            let allDone = true;
            d.meshes.forEach((m, j) => {
                const v = d.velocities[j];
                if (v.skip) return;
                if (v.done) return;
                allDone = false;
                v.morphTimer += delta;
                if (v.morphTimer >= v.morphInterval) {
                    v.morphTimer = 0;
                    v.morphCount++;
                    if (v.morphCount >= v.maxMorphs) {
                        v.done = true;
                        m.color = 0xffffff;
                        m.sync();
                    } else {
                        m.text = v.kanjiPool[Math.floor(Math.random() * v.kanjiPool.length)];
                        // Pulse brighter each morph
                        const brightness = 0xaa00ff + Math.floor(v.morphCount / v.maxMorphs * 0x5500ff);
                        m.color = brightness;
                        m.sync();
                    }
                }
            });
            // Once all chars have morphed: implode and vanish
            if (d.elapsed > 0.3) {
                d.opacity = Math.max(0, d.opacity - delta * 5.5);
                d.scale = Math.max(0.01, d.scale - delta * 4.0);
                d.meshes.forEach(m => {
                    m.scale.set(d.scale, d.scale, d.scale);
                    m.fillOpacity = d.opacity;
                });
            }

        } else if (d.type === 'ghost-dissolve') {
            // Troika chars are hidden; shader plane handles visuals
            d.opacity = 0;

        } else if (d.type === 'blood-rain') {
            // Arc: chars launch up then rain down driven by gravity
            d.meshes.forEach((m, j) => {
                const v = d.velocities[j];
                v.vy += v.gravity * delta;
                m.position.x += v.vx * delta;
                m.position.y += v.vy * delta;
                m.position.z += v.vz * delta;
            });
            // Start fading once chars are descending
            if (d.elapsed > 0.18) {
                d.opacity = Math.max(0, d.opacity - delta * 2.5);
                d.meshes.forEach(m => { m.fillOpacity = d.opacity; });
            }

        } else if (d.type === 'lightning-arc') {
            // Hold still while lightning crackles (0–0.16s), then vaporize
            if (d.elapsed < 0.15) {
                // Micro-jitter during arc
                d.meshes.forEach((m, j) => {
                    const v = d.velocities[j];
                    m.position.x = v.baseX + (Math.random() - 0.5) * 0.04;
                    m.position.y = v.baseY + (Math.random() - 0.5) * 0.04;
                    m.fillOpacity = 0.6 + Math.random() * 0.4; // flicker
                });
            } else {
                // Vaporize — rapid expand then instant fade
                d.opacity = Math.max(0, d.opacity - delta * 8.0);
                d.meshes.forEach((m, j) => {
                    const v = d.velocities[j];
                    m.position.x += v.vx * delta;
                    m.position.y += v.vy * delta;
                    m.fillOpacity = d.opacity;
                    m.color = d.elapsed > 0.22 ? 0x88ccff : 0xffffff;
                    m.sync();
                });
            }

        } else if (d.type === 'crystal-freeze') {
            // Phase 1 (0–0.18s): frozen — just show the scaled-up ice-blue chars
            // Phase 2 (0.18s+): shatter outward with fast fade
            if (d.elapsed < 0.18) {
                // Pulsing ice glow during freeze
                const pulse = 0.85 + Math.sin(d.elapsed * 40) * 0.15;
                d.meshes.forEach(m => { m.fillOpacity = pulse; });
            } else {
                d.opacity = Math.max(0, d.opacity - delta * 4.5);
                d.meshes.forEach((m, j) => {
                    const v = d.velocities[j];
                    m.position.x += v.vx * delta;
                    m.position.y += v.vy * delta;
                    m.position.z += v.vz * delta;
                    v.vy -= 3.5 * delta; // slight gravity
                    m.rotation.x += (v.vrx || 0) * delta;
                    m.rotation.z += (v.vrz || 0) * delta;
                    m.scale.setScalar(Math.max(0.01, d.opacity * 1.25));
                    m.fillOpacity = d.opacity;
                });
            }

        } else if (d.type === 'void-pull') {
            // Spaghettification: chars pulled to x=0, scale.x shrinks, scale.y grows
            const allGone = d.meshes.every((m, j) => {
                const v = d.velocities[j];
                const dx = 0 - m.position.x;
                v.pullSpeed = Math.min(20, v.pullSpeed + delta * 8);
                m.position.x += dx * delta * v.pullSpeed;
                // Stretch effect: narrow X, tall Y
                const progress = 1 - Math.abs(m.position.x) / (Math.abs(v.targetX - m.position.x) + 0.01);
                const stretchX = Math.max(0.02, 1 - d.elapsed * 2.5);
                const stretchY = 1 + d.elapsed * 1.8;
                m.scale.set(stretchX, stretchY, 1);
                m.fillOpacity = Math.max(0, 1 - d.elapsed * 2.2);
                return Math.abs(m.position.x) < 0.05;
            });
            d.opacity = Math.max(0, 1 - d.elapsed * 2.2);

        } else if (d.type === 'neon-zip') {
            // Wait for delay then zip off at ludicrous speed
            d.meshes.forEach((m, j) => {
                const v = d.velocities[j];
                if (d.elapsed < v.delay) return;
                const active = d.elapsed - v.delay;
                m.position.x += v.vx * delta;
                m.position.y += v.vy * delta;
                m.position.z += v.vz * delta;
                // Rapid deceleration after launch (friction)
                v.vx *= Math.max(0, 1 - delta * 5.5);
                v.vy *= Math.max(0, 1 - delta * 5.5);
            });
            d.opacity = d.elapsed < 0.055
                ? 1.0
                : Math.max(0, d.opacity - delta * 7.0);
            d.meshes.forEach(m => { m.fillOpacity = d.opacity; });

        } else if (d.type === 'ripple-cascade') {
            // Sequential: each char bounces up then falls, staggered by delay
            d.meshes.forEach((m, j) => {
                const v = d.velocities[j];
                if (d.elapsed < v.delay) return;
                v.vy += v.gravity * delta;
                m.position.x += v.vx * delta;
                m.position.y += v.vy * delta;
                // Bounce when hitting floor
                if (!v.bounced && m.position.y < v.floorY) {
                    v.bounced = true;
                    v.vy = Math.abs(v.vy) * 0.38; // damped bounce
                    v.vx *= 0.5;
                }
                // Fade after bounce
                if (v.bounced) {
                    m.fillOpacity = Math.max(0, m.fillOpacity - delta * 4.5);
                }
            });
            // Overall done check
            const lastDelay = (d.meshes.length - 1) * 0.048;
            if (d.elapsed > lastDelay + 0.4) {
                d.opacity = Math.max(0, d.opacity - delta * 8.0);
            }

        } else if (d.type === 'oni-slam') {
            d.meshes.forEach((m, j) => {
                const v = d.velocities[j];
                v.vy -= 14 * delta;
                m.position.x += v.vx * delta;
                m.position.y += v.vy * delta;
                if (!v.bounced && m.position.y < v.floorY) {
                    v.bounced = true;
                    v.vy = Math.abs(v.vy) * 0.28;
                    v.vx *= 1.4;
                    m.color = 0xff2200; m.sync();
                }
            });
            if (d.elapsed > 0.2) {
                d.opacity = Math.max(0, d.opacity - delta * 5.0);
                d.meshes.forEach(m => { m.scale.setScalar(Math.max(0.01, d.opacity)); m.fillOpacity = d.opacity; });
            }

        } else if (d.type === 'lava-burst') {
            // Radial explosion then gravity fall, char cools from white → orange → dark
            d.meshes.forEach((m, j) => {
                const v = d.velocities[j];
                v.vy -= 7.0 * delta;
                m.position.x += v.vx * delta;
                m.position.y += v.vy * delta;
                m.position.z += v.vz * delta;
                v.vx *= (1 - delta * 3.0);
                // Color: white → orange → dark as time passes
                m.color = d.elapsed < 0.08 ? 0xffffff
                    : d.elapsed < 0.2  ? 0xff8800
                    : d.elapsed < 0.4  ? 0xff3300
                    : 0x220800;
                m.sync();
            });
            if (d.elapsed > 0.15) {
                d.opacity = Math.max(0, d.opacity - delta * 3.2);
                d.meshes.forEach(m => { m.fillOpacity = d.opacity; });
            }

        } else if (d.type === 'poison-drip') {
            // Same arc as blood-rain but with sinusoidal wobble and green color shift
            d.meshes.forEach((m, j) => {
                const v = d.velocities[j];
                v.vy += v.gravity * delta;
                v.wobblePhase += v.wobbleSpeed * delta;
                m.position.x += (v.vx + Math.sin(v.wobblePhase) * v.wobbleAmp) * delta;
                m.position.y += v.vy * delta;
                m.position.z += v.vz * delta;
                // Shift from bright green → purple as it falls
                m.color = v.vy > 0 ? 0x44ff22 : 0x8800cc;
                m.sync();
            });
            if (d.elapsed > 0.22) {
                d.opacity = Math.max(0, d.opacity - delta * 2.8);
                d.meshes.forEach(m => { m.fillOpacity = d.opacity; });
            }

        } else if (d.type === 'gilded-cascade') {
            // Triumphant wide gold arc — floaty, graceful
            d.meshes.forEach((m, j) => {
                const v = d.velocities[j];
                v.vy += v.gravity * delta;
                m.position.x += v.vx * delta;
                m.position.y += v.vy * delta;
                m.position.z += v.vz * delta;
                v.vx *= (1 - delta * 1.2); // gentle air resistance
                // Gold → amber → dark gold
                m.color = d.elapsed < 0.3 ? 0xffd700
                    : d.elapsed < 0.6 ? 0xff9900
                    : 0xcc6600;
                m.sync();
            });
            if (d.elapsed > 0.25) {
                d.opacity = Math.max(0, d.opacity - delta * 2.0); // slow, graceful fade
                d.meshes.forEach(m => { m.fillOpacity = d.opacity; });
            }

        } else {
            // flyup (default)
            const t = queueScrollSpeed / 12;
            const dyingSpeed = 0.3 + t * 2.7;
            const fadeSpeed  = 0.4 + t * 3.0;
            d.posY += delta * dyingSpeed;
            d.opacity = Math.max(0, d.opacity - delta * fadeSpeed);
            d.meshes.forEach(m => {
                m.position.y = d.posY;
                m.fillOpacity = d.opacity;
            });
        }

        if (d.opacity <= 0) {
            d.meshes.forEach(m => { textGroup.remove(m); m.dispose(); });
            dyingEntries.splice(i, 1);
        }
    }
}

// ══════════════════════════════════════════════════════════
// PUBLIC API
// ══════════════════════════════════════════════════════════
/** Set word exit animation mode */
export function setThreeExitAnim(mode) { exitAnimMode = mode; }

/** Set/get the active scene type */
/** Rebuild zen sky with new Y offset (0=top, 0.5=horizon, 1=bottom) */
export function setZenSkyOffset(val) {
    if (!scene || sceneType !== 'zen') return;
    buildZenSky(val);
}
export function getZenSkyOffset() { return zenSkyYOff; }

export function setSceneType(type) {
    if (type === 'dojo' || type === 'forge' || type === 'zen') sceneType = type;
}
export function getSceneType() { return sceneType; }

/** Set camera angle preset index for the current scene */
export function setCameraPreset(index) {
    const presets = CAM_PRESETS[sceneType] || CAM_PRESETS.dojo;
    if (index < 0 || index >= presets.length) return;
    currentCamPreset = index;
}
export function getCameraPresets() {
    return (CAM_PRESETS[sceneType] || CAM_PRESETS.dojo).map((p, i) => ({ label: p.label, index: i }));
}

/** Set word scroll speed 0-1 (0=dreamy slow, 1=clean-mode snappy) */
export function setThreeWordSpeed(val) {
    // Range: 0.8 (very slow) to 12 (clean-mode-like snappy)
    queueScrollSpeed = 0.8 + val * 11.2;
}

/** Set quality 0-1 — controls every expensive system without touching visuals at full quality */
export function setThreeQuality(val) {
    if (!renderer) return;
    const maxPR = window.devicePixelRatio;

    // ── Pixel ratio (GPU fill cost) ──────────────────────────
    renderer.setPixelRatio(0.65 + val * (Math.min(maxPR, 2) - 0.65));

    // ── Shadows ──────────────────────────────────────────────
    renderer.shadowMap.enabled = val > 0.25;

    // ── Bloom (most expensive postprocess pass) ───────────────
    // Formulas hit exact original hardcoded values at val=1.0: strength=1.1, radius=0.6, threshold=0.7
    if (bloomPass) {
        bloomPass.strength  = 0.25 + val * 0.85;  // val=0: 0.25   val=1: 1.10 ✓
        bloomPass.radius    = 0.20 + val * 0.40;  // val=0: 0.20   val=1: 0.60 ✓
        bloomPass.threshold = 0.95 - val * 0.25;  // val=0: 0.95   val=1: 0.70 ✓
    }

    // ── Particle counts ──────────────────────────────────────
    PETAL_COUNT = Math.round(30 + val * 220);
    if (petalMesh) petalMesh.count = PETAL_COUNT;
    EMBER_COUNT = Math.round(40 + val * 260);
    if (emberMesh) emberMesh.count = EMBER_COUNT;
    FIREFLY_COUNT = Math.round(40 + val * 110);
    if (fireflyMesh) fireflyMesh.count = FIREFLY_COUNT;

    // ── Exit particle budget (capped at quality level) ────────
    exitParticleMax = Math.round(EXIT_PARTICLE_MAX * (0.25 + val * 0.75));

    // ── Fog density (fewer fog calculations at low quality) ───
    if (scene && scene.fog) {
        scene.fog.density = 0.025 + val * 0.022;
    }

    // ── Lantern count — disable distant ones at low quality ───
    if (lanternLights.length > 0) {
        const keepCount = val < 0.3 ? 4 : val < 0.6 ? 8 : lanternLights.length;
        lanternLights.forEach((l, i) => { l.visible = i < keepCount; });
    }
}

/** Switch color theme (keyboard lights only) */
export function setThreeColorTheme(name) {
    const theme = COLOR_THEMES[name];
    if (!theme) return;
    currentTheme = theme;
}

/** Set scene brightness 0-1 */
export function setThreeBrightness(val) {
    if (!renderer) return;
    renderer.toneMappingExposure = 0.4 + val * 2.0;
}

let keyFlashMultiplier = 1.0;
/** Set key flash intensity 0-1 */
export function setThreeKeyFlash(val) {
    keyFlashMultiplier = val * 2.0; // range 0 to 2
}

export function onThreeKeyPress() {
    if (!isRunning) return;
    keypressFlash = 1;
    const colors = currentTheme.flash;
    keypressLight.color.setHex(colors[Math.floor(Math.random() * colors.length)]);
}

export function updateThreeWPM(wpm) {
    currentWPM = wpm;
}

export function destroyThreeScene() {
    isRunning = false;
    if (animId !== null) { cancelAnimationFrame(animId); animId = null; }
    window.removeEventListener('resize', handleResize);
    document.removeEventListener('keydown', onDocKeyDown);
    document.removeEventListener('keyup', onDocKeyUp);

    clearThreeText();
    keys3D = {};
    keyboardGroup = null;
    petalData = [];
    petalMesh = null;
    lanternLights = [];
    emberData = [];
    emberMesh = null;
    brazierLights = [];
    fireflyData = [];
    fireflyMesh = null;
    zenLanternLights = [];
    reflectorMesh = null;
    zenGroundMesh = null;
    if (scene && scene.environment) { scene.environment.dispose(); }
    keypressFlash = 0;
    keypressLight = null;
    currentWPM = 0;
    time = 0;

    // Exit particle pool cleanup
    exitParticleData = [];
    exitParticleMesh = null;

    // Slash mesh cleanup
    slashMesh = null;
    slashAnim = null;

    // Lightning cleanup
    lightningLine = null;
    lightningAnim = null;

    // Ghost dissolve planes cleanup
    ghostPlanes.forEach(g => {
        if (g.mesh) { g.mesh.geometry.dispose(); }
        if (g.mat)  { g.mat.dispose(); }
        if (g.tex)  { g.tex.dispose(); }
    });
    ghostPlanes = [];

    if (composer) { composer.dispose(); composer = null; }
    if (renderer) { renderer.dispose(); renderer = null; }
    scene = null;
    camera = null;
    clock = null;
}

export function isThreeSceneRunning() {
    return isRunning;
}

// ── Resize ────────────────────────────────────────────────
function handleResize() {
    if (!camera || !renderer || !composer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

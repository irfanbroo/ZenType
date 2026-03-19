const isTauri = !!window.__TAURI_INTERNALS__;
const VIDEO_CDN = !isTauri ? 'https://zen-type-brown.vercel.app/' : '';

export function resolveVideoUrl(url) {
    if (!url || url.startsWith('http')) return url;
    if (url.startsWith('videos/') && VIDEO_CDN) return VIDEO_CDN + url;
    return url;
}

export const wallpaperCategories = [
    { id: 'relax', label: 'Relax', icon: 'ri-cup-line' },
    { id: 'nature', label: 'Nature', icon: 'ri-leaf-line' },
    { id: 'aesthetic-videos', label: 'Aesthetic Videos', icon: 'ri-film-line' },
    { id: 'aesthetic', label: 'Aesthetic', icon: 'ri-palette-line' },
    { id: 'cars', label: 'Cars', icon: 'ri-roadster-line' },
    { id: 'styles', label: 'Styles', icon: 'ri-magic-line' }
];

export let currentCategory = 'relax';

export function setCurrentCategory(cat) {
    currentCategory = cat;
}

export const wallpapers = [

    // ═══ AESTHETIC VIDEOS ═══
    {
        id: 'aesthetic_clouds',
        isVideo: true,
        category: 'aesthetic-videos',
        url: 'videos/aesthetic clouds_updated (2).mp4',
        thumb: 'videos/thumbs/aesthetic clouds_updated (2).png',
        tint: 'dark',
        opacity: 15
    },
    {
        id: 'bat',
        isVideo: true,
        category: 'aesthetic-videos',
        url: 'videos/bat.mp4',
        thumb: 'videos/thumbs/bat-thumb.png',
        tint: 'dark',
        opacity: 15
    },
    {
        id: 'tanjiro',
        isVideo: true,
        category: 'aesthetic-videos',
        url: 'videos/tanjiro.mp4',
        thumb: 'videos/thumbs/tanjiro-thumb.png',
        tint: 'dark',
        opacity: 15
    },

    // ═══ RELAX ═══
    {
        id: 'gura_yuri',
        isVideo: true,
        hasAudio: true,
        category: 'relax',
        url: 'videos/Gura Yuri Camp.mp4',
        thumb: 'videos/thumbs/Gura Yuri Camp.png',
        tint: 'dark',
        opacity: 0
    },
    { id: 'relax2', isVideo: false, category: 'relax', url: 'images/relax2.jpg', thumb: 'images/relax2.jpg', tint: 'dark', opacity: 15 },
    { id: 'relax3', isVideo: false, category: 'relax', url: 'images/relax3.jpg', thumb: 'images/relax3.jpg', tint: 'dark', opacity: 15 },
    { id: 'relax5', isVideo: false, category: 'relax', url: 'images/relax5.jpg', thumb: 'images/relax5.jpg', tint: 'dark', opacity: 15 },
    { id: 'relax6', isVideo: false, category: 'relax', url: 'images/relax6.jpg', thumb: 'images/relax6.jpg', tint: 'dark', opacity: 15 },
    { id: 'girl-2', isVideo: false, category: 'relax', url: 'images/girl-2.png', thumb: 'images/girl-2.png', tint: 'dark', opacity: 15 },
    { id: 'relax7', isVideo: false, category: 'relax', url: 'images/relax7.png', thumb: 'images/relax7.png', tint: 'dark', opacity: 15 },
    { id: 'relax8', isVideo: false, category: 'relax', url: 'images/relax8.png', thumb: 'images/relax8.png', tint: 'dark', opacity: 15 },
    { id: 'relax9', isVideo: false, category: 'relax', url: 'images/relax9.png', thumb: 'images/relax9.png', tint: 'dark', opacity: 15 },
    { id: 'relax10', isVideo: false, category: 'relax', url: 'images/relax10.png', thumb: 'images/relax10.png', tint: 'dark', opacity: 15 },

    // ═══ AESTHETIC ═══
    { id: 'gal1', isVideo: false, category: 'aesthetic', url: 'images/gal1.png', thumb: 'images/gal1.png', tint: 'dark', opacity: 15 },
    { id: 'gal2', isVideo: false, category: 'aesthetic', url: 'images/gal2.png', thumb: 'images/gal2.png', tint: 'dark', opacity: 15 },
    { id: 'neon-1', isVideo: false, category: 'aesthetic', tint: 'dark', opacity: 15, url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=3840', thumb: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=400' },
    { id: 'japan-night', isVideo: false, category: 'aesthetic', tint: 'dark', opacity: 15, url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=3840', thumb: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=400' },
    { id: 'minimal-dark', isVideo: false, category: 'aesthetic', tint: 'dark', opacity: 15, url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=3840', thumb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400' },

    { id: 'girl-1', isVideo: false, category: 'aesthetic', url: 'images/girl-1.png', thumb: 'images/girl-1.png', tint: 'dark', opacity: 15 },
    { id: 'boy-1', isVideo: false, category: 'aesthetic', url: 'images/boy-1.png', thumb: 'images/boy-1.png', tint: 'dark', opacity: 15 },
    { id: 'girl-3', isVideo: false, category: 'aesthetic', url: 'images/girl-3.png', thumb: 'images/girl-3.png', tint: 'dark', opacity: 15 },

    // ═══ CARS ═══
    {
        id: 'f1',
        isVideo: true,
        category: 'cars',
        url: 'videos/f1.mp4',
        thumb: 'videos/thumbs/f1-thumb.png',
        tint: 'dark',
        opacity: 15
    },
    {
        id: 'i_dowt_it',
        isVideo: true,
        hasAudio: true,
        category: 'cars',
        url: 'videos/I Dowt it.mp4',
        thumb: 'videos/thumbs/I Dowt it.png',
        tint: 'dark',
        opacity: 15
    },
    { id: 'skyline-2', isVideo: false, category: 'cars', url: 'images/skyline-2.png', thumb: 'images/skyline-2.png', tint: 'dark', opacity: 15 },

    { id: 'porshe', isVideo: false, category: 'cars', url: 'images/porshe.jpg', thumb: 'images/porshe.jpg', tint: 'dark', opacity: 15 },
    { id: 'porshe_2', isVideo: false, category: 'cars', url: 'images/porshe 2.jpg', thumb: 'images/porshe 2.jpg', tint: 'dark', opacity: 15 },
    { id: 'porshe_3', isVideo: false, category: 'cars', url: 'images/porshe 3.jpg', thumb: 'images/porshe 3.jpg', tint: 'dark', opacity: 15 },
    { id: 'porshe_4', isVideo: false, category: 'cars', url: 'images/porshe 4.jpg', thumb: 'images/porshe 4.jpg', tint: 'dark', opacity: 15 },

    // ═══ NATURE ═══
    { id: 'greenary', isVideo: false, category: 'nature', url: 'images/greenary.jpg', thumb: 'images/greenary.jpg', tint: 'dark', opacity: 15 },
    { id: 'pink', isVideo: false, category: 'nature', url: 'images/pink.jpg', thumb: 'images/pink.jpg', tint: 'dark', opacity: 15 },
    { id: 'night', isVideo: false, category: 'nature', url: 'images/NIGHT.jpg', thumb: 'images/NIGHT.jpg', tint: 'dark', opacity: 15 },
    { id: 'yosemite', isVideo: false, category: 'nature', url: 'images/yosemite.jpg', thumb: 'images/yosemite.jpg', tint: 'dark', opacity: 15 },
    { id: 'slovakia', isVideo: false, category: 'nature', url: 'images/Slovakia.jpg', thumb: 'images/Slovakia.jpg', tint: 'dark', opacity: 15 },
    { id: 'iceland', isVideo: false, category: 'nature', url: 'images/Iceland.jpg', thumb: 'images/Iceland.jpg', tint: 'dark', opacity: 15 },
    { id: 'mountain_reflection', isVideo: false, category: 'nature', url: 'images/Beautiful mountain reflection.jpg', thumb: 'images/Beautiful mountain reflection.jpg', tint: 'dark', opacity: 15 },
    { id: 'el_capitan', isVideo: false, category: 'nature', url: 'images/El Capitan.jpg', thumb: 'images/El Capitan.jpg', tint: 'dark', opacity: 15 },
    { id: 'streets', isVideo: false, category: 'nature', url: 'images/streets.jpg', thumb: 'images/streets.jpg', tint: 'dark', opacity: 15 },
    { id: 'tokyo_tower', isVideo: false, category: 'nature', url: 'images/Tokyo Tower.jpg', thumb: 'images/Tokyo Tower.jpg', tint: 'dark', opacity: 15 },
    { id: 'mt_rainier', isVideo: false, category: 'nature', url: 'images/Mt Rainier National Park.jpg', thumb: 'images/Mt Rainier National Park.jpg', tint: 'dark', opacity: 15 }
];

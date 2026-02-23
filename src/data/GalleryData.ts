// ============================================
// GALLERY DATA STRUCTURE
// ============================================
// TO ADD NEW IMAGES: Add a new entry to GALLERY_METADATA and IMAGE_MAP below.
// Categories: 'TECH', 'CULTURAL', 'VIBES', 'BTS' or any custom tag you want.
//
// Assets are resolved LAZILY — require() only fires when getGalleryImage()
// is called, not when this module is imported.  This avoids registering all
// 25 image assets at startup.

export interface GalleryItem {
    id: string;
    title: string;
    tag: string;
    titleFont?: string;
}

// FILTER BUTTON CONFIGURATION
export const GALLERY_FILTERS = [
    { label: 'ALL', font: 'Gilton' },
    { label: 'TECH', font: 'Gilton' },
    { label: 'CULTURAL', font: 'Gilton' },
    { label: 'VIBES', font: 'Gilton' },
    { label: 'BTS', font: 'Gilton' },
];

// ── Lazy image resolver ────────────────────────────────────────────────────────
// Each require() is statically analysable by Metro but only executed on first
// call thanks to the function wrapper.  Subsequent calls return the cached
// module-id integer (Metro's default behaviour for require).
const IMAGE_MAP: Readonly<Record<string, () => number>> = {
    '1':  () => require('../../assets/Gallery/gall1.webp'),
    '2':  () => require('../../assets/Gallery/gall2.webp'),
    '3':  () => require('../../assets/Gallery/gall3.webp'),
    '4':  () => require('../../assets/Gallery/gall4.webp'),
    '5':  () => require('../../assets/Gallery/gall5.webp'),
    '6':  () => require('../../assets/Gallery/gall6.webp'),
    '7':  () => require('../../assets/Gallery/gall7.webp'),
    '8':  () => require('../../assets/Gallery/gall8.webp'),
    '9':  () => require('../../assets/Gallery/gall9.webp'),
    '10': () => require('../../assets/Gallery/gall10.webp'),
    '11': () => require('../../assets/Gallery/gall11.webp'),
    '12': () => require('../../assets/Gallery/gall12.webp'),
    '13': () => require('../../assets/Gallery/gall13.webp'),
    '14': () => require('../../assets/Gallery/gall14.webp'),
    '15': () => require('../../assets/Gallery/gall15.webp'),
    '16': () => require('../../assets/Gallery/gall16.webp'),
    '17': () => require('../../assets/Gallery/gall17.webp'),
    '18': () => require('../../assets/Gallery/gall18.webp'),
    '19': () => require('../../assets/Gallery/gall19.webp'),
    '20': () => require('../../assets/Gallery/gall20.webp'),
    '21': () => require('../../assets/Gallery/gall21.webp'),
    '22': () => require('../../assets/Gallery/gall22.webp'),
    '23': () => require('../../assets/Gallery/gall23.webp'),
    '24': () => require('../../assets/Gallery/gall24.webp'),
    '25': () => require('../../assets/Gallery/gall25.webp'),
};

/** Resolve an image asset on demand.  Call inside a component's useMemo. */
export function getGalleryImage(id: string): number {
    const resolver = IMAGE_MAP[id];
    if (__DEV__ && !resolver) {
        console.warn(`[GalleryData] No image mapped for id "${id}"`);
    }
    return resolver ? resolver() : 0;
}

// ── Metadata only — no require() calls at import time ──────────────────────────
export const GALLERY_ITEMS: GalleryItem[] = [
    { id: '1',  title: 'THE OPENING CEREMONY', tag: 'CULTURAL', titleFont: 'Gilton' },
    { id: '2',  title: 'HACKATHON GRIND',      tag: 'TECH',     titleFont: 'Gilton' },
    { id: '3',  title: 'ROBO WARS ARENA',      tag: 'TECH',     titleFont: 'Gilton' },
    { id: '4',  title: 'VIBES UNLIMITED',       tag: 'VIBES',    titleFont: 'Gilton' },
    { id: '5',  title: 'BEHIND THE SCENES',    tag: 'BTS',      titleFont: 'Gilton' },
    { id: '6',  title: 'CULTURAL NIGHT',       tag: 'CULTURAL', titleFont: 'Gilton' },
    { id: '7',  title: 'TECH EXHIBITION',      tag: 'TECH',     titleFont: 'Gilton' },
    { id: '8',  title: 'FESTIVAL VIBES',       tag: 'VIBES',    titleFont: 'Gilton' },
    { id: '9',  title: 'TEAM MOMENTS',         tag: 'BTS',      titleFont: 'Gilton' },
    { id: '10', title: 'INNOVATION HUB',       tag: 'TECH',     titleFont: 'Gilton' },
    { id: '11', title: 'GRAND PERFORMANCE',    tag: 'CULTURAL', titleFont: 'Gilton' },
    { id: '12', title: 'EVENT HIGHLIGHTS',     tag: 'VIBES',    titleFont: 'Gilton' },
    { id: '13', title: 'THE PREPARATION',      tag: 'BTS',      titleFont: 'Gilton' },
    { id: '14', title: 'STAGE READINESS',      tag: 'BTS',      titleFont: 'Gilton' },
    { id: '15', title: 'CELEBRATIONS',         tag: 'VIBES',    titleFont: 'Gilton' },
    { id: '16', title: 'CODING BATTLE',        tag: 'TECH',     titleFont: 'Gilton' },
    { id: '17', title: 'BACKSTAGE CHAOS',      tag: 'BTS',      titleFont: 'Gilton' },
    { id: '18', title: 'ARTISTIC EXPRESSION',  tag: 'CULTURAL', titleFont: 'Gilton' },
    { id: '19', title: 'CROWD ENERGY',         tag: 'VIBES',    titleFont: 'Gilton' },
    { id: '20', title: 'FINAL TOUCHES',        tag: 'BTS',      titleFont: 'Gilton' },
    { id: '21', title: 'PROJECT DEMO',         tag: 'TECH',     titleFont: 'Gilton' },
    { id: '22', title: 'MUSICAL NIGHT',        tag: 'CULTURAL', titleFont: 'Gilton' },
    { id: '23', title: 'FESTIVE MOOD',         tag: 'VIBES',    titleFont: 'Gilton' },
    { id: '24', title: 'ORGANIZING TEAM',      tag: 'BTS',      titleFont: 'Gilton' },
    { id: '25', title: 'CLOSING MOMENTS',      tag: 'VIBES',    titleFont: 'Gilton' },
];

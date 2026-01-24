// ============================================
// GALLERY DATA STRUCTURE
// ============================================
// TO ADD NEW IMAGES: Add a new object to the array below.
// Categories: 'TECH', 'CULTURAL', 'VIBES', 'BTS' or any custom tag you want.

export interface GalleryItem {
    id: string;
    title: string;
    image: string;
    tag: string;
    filename: string;
    desc?: string; // Optional description if needed later
    titleFont?: string; // CUSTOM FONT FOR THIS ITEM'S TITLE
}

// FILTER BUTTON CONFIGURATION
export const GALLERY_FILTERS = [
    { label: 'ALL', font: 'Gilton' },
    { label: 'TECH', font: 'Gilton' },
    { label: 'CULTURAL', font: 'Gilton' },
    { label: 'VIBES', font: 'Gilton' },
    { label: 'BTS', font: 'Gilton' },
];

export const GALLERY_ITEMS: GalleryItem[] = [
    {
        id: '1',
        title: 'THE OPENING CEREMONY',
        image: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/4e39142d-227f-4b50-bbf1-5bbbfb0d0d5b.jpg',
        tag: 'CULTURAL',
        filename: 'IMG_1_2026.png',
        desc: 'Signifiya 26 Inauguration',
        titleFont: 'Gilton'
    },
    {
        id: '2',
        title: 'HACKATHON GRIND',
        image: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/df3cf166-3366-45c3-907f-218183b63d3e.jpg',
        tag: 'TECH',
        filename: 'IMG_2_2026.png',
        desc: '36 Hours Hackathon',
        titleFont: 'Gilton'
    },
    {
        id: '3',
        title: 'ROBO WARS ARENA',
        image: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/df3cf166-3366-45c3-907f-218183b63d3e.jpg',
        tag: 'TECH',
        filename: 'IMG_3_2026.png',
        desc: 'Battle of the bots',
        titleFont: 'Gilton'
    },
    {
        id: '4',
        title: 'DJ NIGHT MADNESS',
        image: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/df3cf166-3366-45c3-907f-218183b63d3e.jpg',
        tag: 'VIBES',
        filename: 'IMG_4_2026.png',
        desc: 'Pure energy on the floor',
        titleFont: 'Gilton'
    },
    {
        id: '5',
        title: 'BEHIND THE SCENES',
        image: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/4e39142d-227f-4b50-bbf1-5bbbfb0d0d5b.jpg',
        tag: 'BTS',
        filename: 'IMG_5_2026.png',
        desc: 'Magic in the making',
        titleFont: 'Gilton'
    },
    {
        id: '6',
        title: 'PRIZE DISTRIBUTION',
        image: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/df3cf166-3366-45c3-907f-218183b63d3e.jpg',
        tag: 'CULTURAL',
        filename: 'IMG_6_2026.png',
        desc: 'Celebrating success',
        titleFont: 'Gilton'
    }
];

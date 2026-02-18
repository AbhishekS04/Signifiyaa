// ============================================
// GALLERY DATA STRUCTURE
// ============================================
// TO ADD NEW IMAGES: Add a new object to the array below.
// Categories: 'TECH', 'CULTURAL', 'VIBES', 'BTS' or any custom tag you want.

export interface GalleryItem {
    id: string;
    title: string;
    image: any;
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
        image: require('../../assets/Gallery/gall1.webp'),
        tag: 'CULTURAL',
        filename: 'gall1.webp',
        titleFont: 'Gilton'
    },
    {
        id: '2',
        title: 'HACKATHON GRIND',
        image: require('../../assets/Gallery/gall2.webp'),
        tag: 'TECH',
        filename: 'gall2.webp',
        titleFont: 'Gilton'
    },
    {
        id: '3',
        title: 'ROBO WARS ARENA',
        image: require('../../assets/Gallery/gall3.webp'),
        tag: 'TECH',
        filename: 'gall3.webp',
        titleFont: 'Gilton'
    },
    {
        id: '4',
        title: 'VIBES UNLIMITED',
        image: require('../../assets/Gallery/gall4.webp'),
        tag: 'VIBES',
        filename: 'gall4.webp',
        titleFont: 'Gilton'
    },
    {
        id: '5',
        title: 'BEHIND THE SCENES',
        image: require('../../assets/Gallery/gall5.webp'),
        tag: 'BTS',
        filename: 'gall5.webp',
        titleFont: 'Gilton'
    },
    {
        id: '6',
        title: 'CULTURAL NIGHT',
        image: require('../../assets/Gallery/gall6.webp'),
        tag: 'CULTURAL',
        filename: 'gall6.webp',
        titleFont: 'Gilton'
    },
    {
        id: '7',
        title: 'TECH EXHIBITION',
        image: require('../../assets/Gallery/gall7.webp'),
        tag: 'TECH',
        filename: 'gall7.webp',
        titleFont: 'Gilton'
    },
    {
        id: '8',
        title: 'FESTIVAL VIBES',
        image: require('../../assets/Gallery/gall8.webp'),
        tag: 'VIBES',
        filename: 'gall8.webp',
        titleFont: 'Gilton'
    },
    {
        id: '9',
        title: 'TEAM MOMENTS',
        image: require('../../assets/Gallery/gall9.webp'),
        tag: 'BTS',
        filename: 'gall9.webp',
        titleFont: 'Gilton'
    },
    {
        id: '10',
        title: 'INNOVATION HUB',
        image: require('../../assets/Gallery/gall10.webp'),
        tag: 'TECH',
        filename: 'gall10.webp',
        titleFont: 'Gilton'
    },
    {
        id: '11',
        title: 'GRAND PERFORMANCE',
        image: require('../../assets/Gallery/gall11.webp'),
        tag: 'CULTURAL',
        filename: 'gall11.webp',
        titleFont: 'Gilton'
    },
    {
        id: '12',
        title: 'EVENT HIGHLIGHTS',
        image: require('../../assets/Gallery/gall12.webp'),
        tag: 'VIBES',
        filename: 'gall12.webp',
        titleFont: 'Gilton'
    },
    {
        id: '13',
        title: 'THE PREPARATION',
        image: require('../../assets/Gallery/gall13.webp'),
        tag: 'BTS',
        filename: 'gall13.webp',
        titleFont: 'Gilton'
    },
    {
        id: '14',
        title: 'STAGE READINESS',
        image: require('../../assets/Gallery/gall14.webp'),
        tag: 'BTS',
        filename: 'gall14.webp',
        titleFont: 'Gilton'
    },
    {
        id: '15',
        title: 'CELEBRATIONS',
        image: require('../../assets/Gallery/gall15.webp'),
        tag: 'VIBES',
        filename: 'gall15.webp',
        titleFont: 'Gilton'
    },
    {
        id: '16',
        title: 'CODING BATTLE',
        image: require('../../assets/Gallery/gall16.webp'),
        tag: 'TECH',
        filename: 'gall16.webp',
        titleFont: 'Gilton'
    },
    {
        id: '17',
        title: 'BACKSTAGE CHAOS',
        image: require('../../assets/Gallery/gall17.webp'),
        tag: 'BTS',
        filename: 'gall17.webp',
        titleFont: 'Gilton'
    },
    {
        id: '18',
        title: 'ARTISTIC EXPRESSION',
        image: require('../../assets/Gallery/gall18.webp'),
        tag: 'CULTURAL',
        filename: 'gall18.webp',
        titleFont: 'Gilton'
    },
    {
        id: '19',
        title: 'CROWD ENERGY',
        image: require('../../assets/Gallery/gall19.webp'),
        tag: 'VIBES',
        filename: 'gall19.webp',
        titleFont: 'Gilton'
    },
    {
        id: '20',
        title: 'FINAL TOUCHES',
        image: require('../../assets/Gallery/gall20.webp'),
        tag: 'BTS',
        filename: 'gall20.webp',
        titleFont: 'Gilton'
    },
    {
        id: '21',
        title: 'PROJECT DEMO',
        image: require('../../assets/Gallery/gall21.webp'),
        tag: 'TECH',
        filename: 'gall21.webp',
        titleFont: 'Gilton'
    },
    {
        id: '22',
        title: 'MUSICAL NIGHT',
        image: require('../../assets/Gallery/gall22.webp'),
        tag: 'CULTURAL',
        filename: 'gall22.webp',
        titleFont: 'Gilton'
    },
    {
        id: '23',
        title: 'FESTIVE MOOD',
        image: require('../../assets/Gallery/gall23.webp'),
        tag: 'VIBES',
        filename: 'gall23.webp',
        titleFont: 'Gilton'
    },
    {
        id: '24',
        title: 'ORGANIZING TEAM',
        image: require('../../assets/Gallery/gall24.webp'),
        tag: 'BTS',
        filename: 'gall24.webp',
        titleFont: 'Gilton'
    },
    {
        id: '25',
        title: 'CLOSING MOMENTS',
        image: require('../../assets/Gallery/gall25.webp'),
        tag: 'VIBES',
        filename: 'gall25.webp',
        titleFont: 'Gilton'
    }
];

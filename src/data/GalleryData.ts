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
        image: require('../../assets/Gallery/gall1.jpg'),
        tag: 'CULTURAL',
        filename: 'gall1.jpg',
        titleFont: 'Gilton'
    },
    {
        id: '2',
        title: 'HACKATHON GRIND',
        image: require('../../assets/Gallery/gall2.jpg'),
        tag: 'TECH',
        filename: 'gall2.jpg',
        titleFont: 'Gilton'
    },
    {
        id: '3',
        title: 'ROBO WARS ARENA',
        image: require('../../assets/Gallery/gall3.jpg'),
        tag: 'TECH',
        filename: 'gall3.jpg',
        titleFont: 'Gilton'
    },
    {
        id: '4',
        title: 'VIBES UNLIMITED',
        image: require('../../assets/Gallery/gall4.jpg'),
        tag: 'VIBES',
        filename: 'gall4.jpg',
        titleFont: 'Gilton'
    },
    {
        id: '5',
        title: 'BEHIND THE SCENES',
        image: require('../../assets/Gallery/gall5.jpg'),
        tag: 'BTS',
        filename: 'gall5.jpg',
        titleFont: 'Gilton'
    },
    {
        id: '6',
        title: 'CULTURAL NIGHT',
        image: require('../../assets/Gallery/gall6.jpg'),
        tag: 'CULTURAL',
        filename: 'gall6.jpg',
        titleFont: 'Gilton'
    },
    {
        id: '7',
        title: 'TECH EXHIBITION',
        image: require('../../assets/Gallery/gall7.jpg'),
        tag: 'TECH',
        filename: 'gall7.jpg',
        titleFont: 'Gilton'
    },
    {
        id: '8',
        title: 'FESTIVAL VIBES',
        image: require('../../assets/Gallery/gall8.jpg'),
        tag: 'VIBES',
        filename: 'gall8.jpg',
        titleFont: 'Gilton'
    },
    {
        id: '9',
        title: 'TEAM MOMENTS',
        image: require('../../assets/Gallery/gall9.jpg'),
        tag: 'BTS',
        filename: 'gall9.jpg',
        titleFont: 'Gilton'
    },
    {
        id: '10',
        title: 'INNOVATION HUB',
        image: require('../../assets/Gallery/gall10.jpg'),
        tag: 'TECH',
        filename: 'gall10.jpg',
        titleFont: 'Gilton'
    },
    {
        id: '11',
        title: 'GRAND PERFORMANCE',
        image: require('../../assets/Gallery/gall11.jpg'),
        tag: 'CULTURAL',
        filename: 'gall11.jpg',
        titleFont: 'Gilton'
    },
    {
        id: '12',
        title: 'EVENT HIGHLIGHTS',
        image: require('../../assets/Gallery/gall12.jpg'),
        tag: 'VIBES',
        filename: 'gall12.jpg',
        titleFont: 'Gilton'
    },
    {
        id: '13',
        title: 'THE PREPARATION',
        image: require('../../assets/Gallery/gall13.jpg'),
        tag: 'BTS',
        filename: 'gall13.jpg',
        titleFont: 'Gilton'
    },
    {
        id: '14',
        title: 'STAGE READINESS',
        image: require('../../assets/Gallery/gall14.jpg'),
        tag: 'BTS',
        filename: 'gall14.jpg',
        titleFont: 'Gilton'
    },
    {
        id: '15',
        title: 'CELEBRATIONS',
        image: require('../../assets/Gallery/gall15.jpg'),
        tag: 'VIBES',
        filename: 'gall15.jpg',
        titleFont: 'Gilton'
    },
    {
        id: '16',
        title: 'CODING BATTLE',
        image: require('../../assets/Gallery/gall16.jpg'),
        tag: 'TECH',
        filename: 'gall16.jpg',
        titleFont: 'Gilton'
    },
    {
        id: '17',
        title: 'BACKSTAGE CHAOS',
        image: require('../../assets/Gallery/gall17.jpg'),
        tag: 'BTS',
        filename: 'gall17.jpg',
        titleFont: 'Gilton'
    },
    {
        id: '18',
        title: 'ARTISTIC EXPRESSION',
        image: require('../../assets/Gallery/gall18.jpg'),
        tag: 'CULTURAL',
        filename: 'gall18.jpg',
        titleFont: 'Gilton'
    },
    {
        id: '19',
        title: 'CROWD ENERGY',
        image: require('../../assets/Gallery/gall19.jpg'),
        tag: 'VIBES',
        filename: 'gall19.jpg',
        titleFont: 'Gilton'
    },
    {
        id: '20',
        title: 'FINAL TOUCHES',
        image: require('../../assets/Gallery/gall20.jpg'),
        tag: 'BTS',
        filename: 'gall20.jpg',
        titleFont: 'Gilton'
    },
    {
        id: '21',
        title: 'PROJECT DEMO',
        image: require('../../assets/Gallery/gall21.jpg'),
        tag: 'TECH',
        filename: 'gall21.jpg',
        titleFont: 'Gilton'
    },
    {
        id: '22',
        title: 'MUSICAL NIGHT',
        image: require('../../assets/Gallery/gall22.jpg'),
        tag: 'CULTURAL',
        filename: 'gall22.jpg',
        titleFont: 'Gilton'
    },
    {
        id: '23',
        title: 'FESTIVE MOOD',
        image: require('../../assets/Gallery/gall23.jpg'),
        tag: 'VIBES',
        filename: 'gall23.jpg',
        titleFont: 'Gilton'
    },
    {
        id: '24',
        title: 'ORGANIZING TEAM',
        image: require('../../assets/Gallery/gall24.jpg'),
        tag: 'BTS',
        filename: 'gall24.jpg',
        titleFont: 'Gilton'
    },
    {
        id: '25',
        title: 'CLOSING MOMENTS',
        image: require('../../assets/Gallery/gall25.jpg'),
        tag: 'VIBES',
        filename: 'gall25.jpg',
        titleFont: 'Gilton'
    }
];

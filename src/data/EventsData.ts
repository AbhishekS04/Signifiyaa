
// ============================================
// EVENT DATA STRUCTURE
// ============================================
// TO ADD NEW EVENTS: Simply add a new object to the array below
// Categories: 'ESPORTS', 'CSE', 'CIVIL', 'MECHANICAL', 'EEE', 'ROBOTICS', 'NON-TECH'
// Every event now supports both imageUrl and videoUrl. Video takes priority if provided.

export interface EventData {
    title: string;
    date: string;
    category: string;
    description: string;
    prizePool: string;
    imageColor: string;
    buttonColor: string;
    imageUrl?: string;
    videoUrl?: string;
}

export const EVENTS_DATA: EventData[] = [
    // --- ESPORTS EVENTS ---
    {
        title: 'VALORANT',
        date: 'MARCH 13TH - 14TH',
        category: 'ESPORTS',
        description: 'Join the ultimate tactical FPS showdown. Form your squad and compete for glory!',
        prizePool: 'TBA',
        imageColor: '#ccff00',
        buttonColor: '#D194FF',
        imageUrl: '',
        videoUrl: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/videos/original/44fe63af-47e0-4df6-8fc3-0a984c7337da.mp4' // Valorant Agent Gekko
    },
    {
        title: 'BGMI',
        date: 'MARCH 13TH - 14TH',
        category: 'ESPORTS',
        description: 'Battle it out in the most popular mobile battle royale championship.',
        prizePool: '10K',
        imageColor: '#ff9966',
        buttonColor: '#D194FF',
        imageUrl: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/5628f912-994d-4054-9ec7-bbb1310fe6c9.png',
        // videoUrl: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/videos/original/465c6e8d-1d24-4084-b576-5f613dd1829b.mp4'
    },
    {
        title: 'RDR2',
        date: 'MARCH 13TH - 14TH',
        category: 'ESPORTS',
        description: 'Battle it out in the most popular mobile battle royale championship.',
        prizePool: '10K',
        imageColor: '#ff9966',
        buttonColor: '#D194FF',
        // imageUrl: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/5628f912-994d-4054-9ec7-bbb1310fe6c9.png',
        videoUrl: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/videos/original/465c6e8d-1d24-4084-b576-5f613dd1829b.mp4'
    },

    // --- CSE EVENTS ---
    {
        title: 'HACKATHON',
        date: 'MARCH 15TH - 16TH',
        category: 'CSE',
        description: 'Build innovative solutions in 24 hours. Code, create, and conquer!',
        prizePool: '50K',
        imageColor: '#66ccff',
        buttonColor: '#FFD700',
        // imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', // Coding/Tech
        videoUrl: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/videos/original/1359c8e8-57aa-482e-8af0-31d92af491e5.mp4'
    },
    {
        title: 'CODE RELAY',
        date: 'MARCH 15TH',
        category: 'CSE',
        description: 'Team-based coding challenge. Pass the code, solve the problem!',
        prizePool: 'TBA',
        imageColor: '#9933ff',
        buttonColor: '#FFD700',
        imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        videoUrl: ''
    },
    {
        title: 'CODE RELAY',
        date: 'MARCH 15TH',
        category: 'CSE',
        description: 'Team-based coding challenge. Pass the code, solve the problem!',
        prizePool: 'TBA',
        imageColor: '#9933ff',
        buttonColor: '#FFD700',
        imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        videoUrl: ''
    },

    // --- CIVIL EVENTS ---
    {
        title: 'BRIDGE BUILDING',
        date: 'MARCH 16TH',
        category: 'CIVIL',
        description: 'Design and build the strongest bridge using limited materials.',
        prizePool: '15K',
        imageColor: '#ff6666',
        buttonColor: '#90EE90',
        imageUrl: 'https://images.unsplash.com/photo-1545139224-7eb9c2acc995?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', // Bridge
        videoUrl: ''
    },
    {
        title: 'CAD MASTER',
        date: 'MARCH 17TH',
        category: 'CIVIL',
        description: 'Showcase your AutoCAD and design skills in this technical challenge.',
        prizePool: 'TBA',
        imageColor: '#ffaa66',
        buttonColor: '#90EE90',
        imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', // Engineering
        videoUrl: ''
    },

    // --- MECHANICAL EVENTS ---
    {
        title: 'ROBO RACE',
        date: 'MARCH 16TH - 17TH',
        category: 'MECHANICAL',
        description: 'Build autonomous robots and race them through challenging obstacle courses.',
        prizePool: '25K',
        imageColor: '#66ff66',
        buttonColor: '#FFB6C1',
        imageUrl: 'https://images.unsplash.com/photo-1531746790731-6c087fecd05a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', // Robotics
        videoUrl: ''
    },
    {
        title: 'MECHANISM DESIGN',
        date: 'MARCH 17TH',
        category: 'MECHANICAL',
        description: 'Create innovative mechanical solutions for real-world problems.',
        prizePool: 'TBA',
        imageColor: '#66ffcc',
        buttonColor: '#FFB6C1',
        imageUrl: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', // Gears/Mech
        videoUrl: ''
    },

    // --- EEE EVENTS ---
    {
        title: 'CIRCUIT DEBUG',
        date: 'MARCH 18TH',
        category: 'EEE',
        description: 'Find and fix errors in complex electrical circuits under time pressure.',
        prizePool: '20K',
        imageColor: '#ff99cc',
        buttonColor: '#87CEEB',
        imageUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', // Electronics
        videoUrl: ''
    },
    {
        title: 'SMART HOME',
        date: 'MARCH 18TH',
        category: 'EEE',
        description: 'Design an IoT-based smart home automation system.',
        prizePool: 'TBA',
        imageColor: '#cc99ff',
        buttonColor: '#87CEEB',
        imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', // Smart home
        videoUrl: ''
    },

    // --- ROBOTICS EVENTS ---
    {
        title: 'LINE FOLLOWER',
        date: 'MARCH 19TH',
        category: 'ROBOTICS',
        description: 'Program robots to follow complex line patterns at maximum speed.',
        prizePool: '30K',
        imageColor: '#ffcc66',
        buttonColor: '#DDA0DD',
        imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        videoUrl: ''
    },
    {
        title: 'DRONE RACING',
        date: 'MARCH 19TH - 20TH',
        category: 'ROBOTICS',
        description: 'Pilot your drone through challenging aerial obstacles and courses.',
        prizePool: '35K',
        imageColor: '#66cccc',
        buttonColor: '#DDA0DD',
        imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', // Drones
        videoUrl: ''
    },

    // --- NON-TECH EVENTS ---
    {
        title: 'TREASURE HUNT',
        date: 'MARCH 20TH',
        category: 'NON-TECH',
        description: 'Solve clues and puzzles to find hidden treasures across the campus.',
        prizePool: '10K',
        imageColor: '#ffff99',
        buttonColor: '#98FB98',
        // imageUrl: 'https://images.unsplash.com/photo-1519074063912-ad2fe3f5113c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', // Map/Adventure
        videoUrl: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/videos/original/4ebcf404-4545-45bd-817e-5e6cc8b6c361.mp4'
    },
    {
        title: 'TALENT SHOW',
        date: 'MARCH 21ST',
        category: 'NON-TECH',
        description: 'Showcase your unique talents - singing, dancing, comedy, and more!',
        prizePool: 'TBA',
        imageColor: '#ffccff',
        buttonColor: '#98FB98',
        imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', // Stage/Performance
        videoUrl: ''
    },
];

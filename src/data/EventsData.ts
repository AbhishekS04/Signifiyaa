// ============================================
// EVENT DATA STRUCTURE - Synced with Web Admin
// ============================================
// This data is kept in sync with the web admin panel
// Images are hardcoded here, other data comes from this master list

export interface EventData {
    id: number;
    title: string;
    date: string;
    category: string;
    description: string;
    prizePool: string;
    imageColor: string;
    buttonColor: string;
    imageUrl?: string;
    videoUrl?: string;
    venue: string;
    time?: string;
    studentCoordinators?: string[];
    facultyCoordinators?: string[];
    day?: 1 | 2; // For schedule filtering
}

// =====================================================================
// MASTER EVENT LIST
// All events from the web admin, with hardcoded image URLs
// =====================================================================

export const EVENTS_DATA: EventData[] = [
    // ─── DAY 1 EVENTS ────────────────────────────────────────
    {
        id: 1,
        title: 'Coding Premier League',
        date: '25th March',
        category: 'CSE',
        description: 'Teams battle through algorithmic challenges to prove their speed, logic, and coding mastery.',
        prizePool: '₹25,000',
        imageColor: '#FFEB3B',
        buttonColor: '#FFFFFF',
        imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        venue: 'Computer Lab A',
        time: '10:00 AM - 1:00 PM',
        studentCoordinators: ['Aviroop Pal', 'Sourish Samanta'],
        facultyCoordinators: [],
        day: 1
    },
    {
        id: 2,
        title: 'Electrifying Circuit',
        date: '25th March',
        category: 'EEE',
        description: 'Students race against the clock to design, build, and troubleshoot complex circuits.',
        prizePool: 'TBA',
        imageColor: '#80DEEA',
        buttonColor: '#FFFFFF',
        imageUrl: 'https://plus.unsplash.com/premium_photo-1679917152960-b9e645638575?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZWxlY3RyaWMlMjBjaXJjdWl0fGVufDB8fDB8fHww',
        venue: 'Electrical Workshop',
        time: '11:00 AM - 2:00 PM',
        studentCoordinators: [],
        facultyCoordinators: [],
        day: 1
    },
    {
        id: 3,
        title: 'Tower Making',
        date: '25th March',
        category: 'CIVIL',
        description: 'Build the tallest, strongest tower using creativity, strategy, and skill.',
        prizePool: 'TBA',
        imageColor: '#FFCCBC',
        buttonColor: '#FFFFFF',
        imageUrl: 'https://images.unsplash.com/photo-1590579491624-f98f36d4c763?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        venue: 'Civil Block Lawn',
        time: '2:00 PM - 4:00 PM',
        studentCoordinators: ['Ashish Yadav'],
        facultyCoordinators: [],
        day: 1
    },
    {
        id: 4,
        title: 'Waste to Wealth',
        date: '25th March',
        category: 'MECHANICAL',
        description: 'Participants transform scrap materials into innovative, functional prototypes with suitable design.',
        prizePool: 'TBA',
        imageColor: '#C8E6C9',
        buttonColor: '#FFFFFF',
        imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        venue: 'Workshop Hall',
        time: '10:00 AM - 12:00 PM',
        studentCoordinators: ['Aritro Chakrabarty'],
        facultyCoordinators: [],
        day: 1
    },
    {
        id: 5,
        title: 'Path Follower',
        date: '25th March',
        category: 'ROBOTICS',
        description: 'Autonomous bots must navigate a complex, winding track with speed and pinpoint accuracy.',
        prizePool: 'TBA',
        imageColor: '#D1C4E9',
        buttonColor: '#FFFFFF',
        imageUrl: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        venue: 'Main Audi',
        time: '3:00 PM - 5:00 PM',
        studentCoordinators: ['Sumanto'],
        facultyCoordinators: [],
        day: 1
    },

    // ─── DAY 2 EVENTS ────────────────────────────────────────
    {
        id: 6,
        title: 'Dil Se Design',
        date: 'Day 2',
        category: 'CSE',
        description: 'A UI/UX challenge to craft intuitive, beautiful, and user-centered digital experiences.',
        prizePool: 'TBA',
        imageColor: '#F8BBD0',
        buttonColor: '#FFFFFF',
        imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        venue: 'Mac Lab',
        time: '10:00 AM - 1:00 PM',
        studentCoordinators: ['Baibhab Adhikary'],
        facultyCoordinators: [],
        day: 2
    },
    {
        id: 7,
        title: 'Bridge Making',
        date: 'Day 2',
        category: 'CIVIL',
        description: 'Bridge the gap between theory and reality. Build a truss bridge that can withstand maximum load.',
        prizePool: 'TBA',
        imageColor: '#FFE0B2',
        buttonColor: '#FFFFFF',
        imageUrl: 'https://images.unsplash.com/photo-1513475303621-c8bf20660388?q=80&w=2672&auto=format&fit=crop',
        venue: 'Civil Courtyard',
        time: '11:00 AM - 1:00 PM',
        studentCoordinators: ['Aniruddha Biswas'],
        facultyCoordinators: [],
        day: 2
    },
    {
        id: 8,
        title: 'Lathe War',
        date: 'Day 2',
        category: 'MECHANICAL',
        description: 'Participants face off to machine raw materials into perfect components with speed and surgical accuracy.',
        prizePool: 'TBA',
        imageColor: '#C5CAE9',
        buttonColor: '#FFFFFF',
        imageUrl: 'https://images.unsplash.com/photo-1565344447275-c90e8c5cf2f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        venue: 'Machine Shop',
        time: '12:00 PM - 2:00 PM',
        studentCoordinators: ['Suman Jana', 'Soumen Samanta'],
        facultyCoordinators: [],
        day: 2
    },
    {
        id: 9,
        title: 'Robo Terrain',
        date: 'Day 2',
        category: 'ROBOTICS',
        description: 'Custom built bots must navigate a grueling obstacle course of mud, sand, and steep inclines.',
        prizePool: 'TBA',
        imageColor: '#B2DFDB',
        buttonColor: '#FFFFFF',
        imageUrl: 'https://images.unsplash.com/photo-1561569762-b9b596287c80?q=80&w=2670&auto=format&fit=crop',
        venue: 'Open Ground',
        time: '2:00 PM - 5:00 PM',
        studentCoordinators: ['Student Coordinators'],
        facultyCoordinators: [],
        day: 2
    },
    {
        id: 10,
        title: 'Dance Battle',
        date: 'Day 2',
        category: 'NON-TECH',
        description: 'Rhythm, style, and attitude collide, bring your best moves, own the stage, and outshine the competition.',
        prizePool: 'TBA',
        imageColor: '#F5E6FA',
        buttonColor: '#FFFFFF',
        imageUrl: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        venue: 'Main Stage',
        time: '5:00 PM Onwards',
        studentCoordinators: ['Saheb Sir'],
        facultyCoordinators: [],
        day: 2
    },
    {
        id: 11,
        title: 'Rap Battle',
        date: 'Day 2',
        category: 'NON-TECH',
        description: 'Rhythm & wordplay collide, drop sharp bars, own the mic, and outflow your opponent.',
        prizePool: 'TBA',
        imageColor: '#F5E6FA',
        buttonColor: '#FFFFFF',
        imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        venue: 'Main Stage',
        time: '5:00 PM Onwards',
        studentCoordinators: ['Saheb Sir'],
        facultyCoordinators: [],
        day: 2
    },

    // ─── EVENTS-ONLY (not in schedule) ───────────────────────
    {
        id: 12,
        title: 'Valorant Tournament',
        date: '25th March',
        category: 'ESPORTS',
        description: 'Precise gunplay with agent abilities with smart strategy and perfect coordination to secure victory.',
        prizePool: 'TBA',
        imageColor: '#FF5252',
        buttonColor: '#FFFFFF',
        imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        venue: 'Gaming Arena',
        time: 'TBA',
        studentCoordinators: [],
        facultyCoordinators: []
    },
    {
        id: 13,
        title: 'BGMI',
        date: '25th March',
        category: 'ESPORTS',
        description: 'Drop in, gear up, and fight through intense combat zones to be the last team standing.',
        prizePool: 'TBA',
        imageColor: '#FF9800',
        buttonColor: '#FFFFFF',
        imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        venue: 'Gaming Arena',
        time: 'TBA',
        studentCoordinators: [],
        facultyCoordinators: []
    },
    {
        id: 14,
        title: 'Treasure Hunt',
        date: '25th March',
        category: 'NON-TECH',
        description: 'Solve puzzles, race against time, and uncover the hidden prize.',
        prizePool: 'TBA',
        imageColor: '#FFEB3B',
        buttonColor: '#FFFFFF',
        imageUrl: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        venue: 'Campus Wide',
        time: 'TBA',
        studentCoordinators: [],
        facultyCoordinators: []
    },
    {
        id: 15,
        title: 'Arm Wrestling',
        date: '25th March',
        category: 'NON-TECH',
        description: 'Lock hands, hold your ground, and power through to pin your opponent down.',
        prizePool: 'TBA',
        imageColor: '#795548',
        buttonColor: '#FFFFFF',
        imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        venue: 'Open Ground',
        time: 'TBA',
        studentCoordinators: [],
        facultyCoordinators: []
    }
];

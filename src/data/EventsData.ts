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
    imageUrl?: any;
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
        date: 'MARCH 27TH - 28TH',
        category: 'CSE',
        description: 'Teams battle through algorithmic challenges to prove their speed, logic, and coding mastery.',
        prizePool: '₹25,000',
        imageColor: '#FFEB3B',
        buttonColor: '#FFFFFF',
        imageUrl: require('../../assets/Event_Images/cse2.jpg'),
        venue: 'Computer Lab A',
        time: '10:00 AM - 1:00 PM',
        studentCoordinators: ['Aviroop Pal', 'Sourish Samanta'],
        facultyCoordinators: [],
        day: 1
    },
    {
        id: 2,
        title: 'Electrifying Circuit',
        date: 'MARCH 27TH - 28TH',
        category: 'EEE',
        description: 'Students race against the clock to design, build, and troubleshoot complex circuits.',
        prizePool: 'TBA',
        imageColor: '#80DEEA',
        buttonColor: '#FFFFFF',
        imageUrl: require('../../assets/Event_Images/eee.jpg'),
        venue: 'Electrical Workshop',
        time: '11:00 AM - 2:00 PM',
        studentCoordinators: [],
        facultyCoordinators: [],
        day: 1
    },
    {
        id: 3,
        title: 'Tower Making',
        date: 'MARCH 27TH - 28TH',
        category: 'CIVIL',
        description: 'Build the tallest, strongest tower using creativity, strategy, and skill.',
        prizePool: 'TBA',
        imageColor: '#FFCCBC',
        buttonColor: '#FFFFFF',
        imageUrl: require('../../assets/Event_Images/civil1.jpg'),
        venue: 'Civil Block Lawn',
        time: '2:00 PM - 4:00 PM',
        studentCoordinators: ['Ashish Yadav'],
        facultyCoordinators: [],
        day: 1
    },
    {
        id: 4,
        title: 'Waste to Wealth',
        date: 'MARCH 27TH - 28TH',
        category: 'MECHANICAL',
        description: 'Participants transform scrap materials into innovative, functional prototypes with suitable design.',
        prizePool: 'TBA',
        imageColor: '#C8E6C9',
        buttonColor: '#FFFFFF',
        imageUrl: require('../../assets/Event_Images/mechanical1.jpg'),
        venue: 'Workshop Hall',
        time: '10:00 AM - 12:00 PM',
        studentCoordinators: ['Aritro Chakrabarty'],
        facultyCoordinators: [],
        day: 1
    },
    {
        id: 5,
        title: 'Path Follower',
        date: 'MARCH 27TH - 28TH',
        category: 'ROBOTICS',
        description: 'Autonomous bots must navigate a complex, winding track with speed and pinpoint accuracy.',
        prizePool: 'TBA',
        imageColor: '#D1C4E9',
        buttonColor: '#FFFFFF',
        imageUrl: require('../../assets/Event_Images/robotics2.jpg'),
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
        date: 'MARCH 27TH - 28TH',
        category: 'CSE',
        description: 'A UI/UX challenge to craft intuitive, beautiful, and user-centered digital experiences.',
        prizePool: 'TBA',
        imageColor: '#F8BBD0',
        buttonColor: '#FFFFFF',
        imageUrl: require('../../assets/Event_Images/cse1.jpg'),
        venue: 'Mac Lab',
        time: '10:00 AM - 1:00 PM',
        studentCoordinators: ['Baibhab Adhikary'],
        facultyCoordinators: [],
        day: 2
    },
    {
        id: 7,
        title: 'Bridge Making',
        date: 'MARCH 27TH - 28TH',
        category: 'CIVIL',
        description: 'Bridge the gap between theory and reality. Build a truss bridge that can withstand maximum load.',
        prizePool: 'TBA',
        imageColor: '#FFE0B2',
        buttonColor: '#FFFFFF',
        imageUrl: require('../../assets/Event_Images/civil2.jpg'),
        venue: 'Civil Courtyard',
        time: '11:00 AM - 1:00 PM',
        studentCoordinators: ['Aniruddha Biswas'],
        facultyCoordinators: [],
        day: 2
    },
    {
        id: 8,
        title: 'Lathe War',
        date: 'MARCH 27TH - 28TH',
        category: 'MECHANICAL',
        description: 'Participants face off to machine raw materials into perfect components with speed and surgical accuracy.',
        prizePool: 'TBA',
        imageColor: '#C5CAE9',
        buttonColor: '#FFFFFF',
        imageUrl: require('../../assets/Event_Images/lathe-war.jpg'),
        venue: 'Machine Shop',
        time: '12:00 PM - 2:00 PM',
        studentCoordinators: ['Suman Jana', 'Soumen Samanta'],
        facultyCoordinators: [],
        day: 2
    },
    {
        id: 9,
        title: 'Robo Terrain',
        date: 'MARCH 27TH - 28TH',
        category: 'ROBOTICS',
        description: 'Custom built bots must navigate a grueling obstacle course of mud, sand, and steep inclines.',
        prizePool: 'TBA',
        imageColor: '#B2DFDB',
        buttonColor: '#FFFFFF',
        imageUrl: require('../../assets/Event_Images/robotics1.jpg'),
        venue: 'Open Ground',
        time: '2:00 PM - 5:00 PM',
        studentCoordinators: ['Student Coordinators'],
        facultyCoordinators: [],
        day: 2
    },
    {
        id: 10,
        title: 'Dance Battle',
        date: 'MARCH 27TH - 28TH',
        category: 'NON-TECH',
        description: 'Rhythm, style, and attitude collide, bring your best moves, own the stage, and outshine the competition.',
        prizePool: 'TBA',
        imageColor: '#F5E6FA',
        buttonColor: '#FFFFFF',
        imageUrl: require('../../assets/Event_Images/dance-battle.jpg'),
        venue: 'Main Stage',
        time: '5:00 PM Onwards',
        studentCoordinators: ['Saheb Sir'],
        facultyCoordinators: [],
        day: 2
    },
    {
        id: 11,
        title: 'Rap Battle',
        date: 'MARCH 27TH - 28TH',
        category: 'NON-TECH',
        description: 'Rhythm & wordplay collide, drop sharp bars, own the mic, and outflow your opponent.',
        prizePool: 'TBA',
        imageColor: '#F5E6FA',
        buttonColor: '#FFFFFF',
        imageUrl: require('../../assets/Event_Images/rap-battle.jpg'),
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
        date: 'MARCH 27TH - 28TH',
        category: 'ESPORTS',
        description: 'Precise gunplay with agent abilities with smart strategy and perfect coordination to secure victory.',
        prizePool: 'TBA',
        imageColor: '#FF5252',
        buttonColor: '#FFFFFF',
        imageUrl: require('../../assets/Event_Images/valorant.jpg'),
        venue: 'Gaming Arena',
        time: 'TBA',
        studentCoordinators: [],
        facultyCoordinators: []
    },
    {
        id: 13,
        title: 'BGMI',
        date: 'MARCH 27TH - 28TH',
        category: 'ESPORTS',
        description: 'Drop in, gear up, and fight through intense combat zones to be the last team standing.',
        prizePool: 'TBA',
        imageColor: '#FF9800',
        buttonColor: '#FFFFFF',
        imageUrl: require('../../assets/Event_Images/bgmi.jpg'),
        venue: 'Gaming Arena',
        time: 'TBA',
        studentCoordinators: [],
        facultyCoordinators: []
    },
    {
        id: 14,
        title: 'Treasure Hunt',
        date: 'MARCH 27TH - 28TH',
        category: 'NON-TECH',
        description: 'Solve puzzles, race against time, and uncover the hidden prize.',
        prizePool: 'TBA',
        imageColor: '#FFEB3B',
        buttonColor: '#FFFFFF',
        imageUrl: require('../../assets/Event_Images/treasure-hunt.jpg'),
        venue: 'Campus Wide',
        time: 'TBA',
        studentCoordinators: [],
        facultyCoordinators: []
    },
    {
        id: 15,
        title: 'Arm Wrestling',
        date: 'MARCH 27TH - 28TH',
        category: 'NON-TECH',
        description: 'Lock hands, hold your ground, and power through to pin your opponent down.',
        prizePool: 'TBA',
        imageColor: '#795548',
        buttonColor: '#FFFFFF',
        imageUrl: require('../../assets/Event_Images/non-tech1.jpg'),
        venue: 'Open Ground',
        time: 'TBA',
        studentCoordinators: [],
        facultyCoordinators: []
    }
];

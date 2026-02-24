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
    hideFromHome?: boolean;
    registrationFee?: string;
    teamSize?: string;
}

// =====================================================================
// MASTER EVENT LIST
// All events from the web admin, with hardcoded image URLs
// =====================================================================

export const EVENTS_DATA: EventData[] = [
    // ─── DAY 1 EVENTS (MARCH 27TH) ────────────────────────────────
    {
        id: 1,
        title: 'Inauguration',
        date: 'MARCH 27TH',
        category: 'NON-TECH',
        description: 'The official opening ceremony of Signifiya\' 26.',
        prizePool: '-',
        imageColor: '#FFFFFF',
        buttonColor: '#CCCCCC',
        imageUrl: require('../../assets/Event_Images/Inauguration.webp'),
        venue: 'Convention Hall',
        time: '12:00 PM - 12:30 PM',
        day: 1,
        hideFromHome: true
    },
    {
        id: 2,
        title: 'Valorant Tournament',
        date: 'MARCH 27TH',
        category: 'ESPORTS',
        description: 'Precise gunplay with agent abilities with smart strategy and perfect coordination to secure victory.',
        prizePool: '₹30,000',
        imageColor: '#FF5252',
        buttonColor: '#FFFFFF',
        imageUrl: require('../../assets/Event_Images/valorant.webp'),
        venue: 'SV Hall',
        time: '12:00 PM - 7:00 PM',
        registrationFee: '499',
        teamSize: '5',
        day: 1,
        facultyCoordinators: ['Ayushman Bilash Thakur'],
        studentCoordinators: ['Hrittima Sen']
    },
    {
        id: 3,
        title: 'Free Fire',
        date: 'MARCH 27TH',
        category: 'ESPORTS',
        description: 'Survive till the end in this action-packed battle royale tournament.',
        prizePool: '₹20,000',
        imageColor: '#795548',
        buttonColor: '#FFFFFF',
        imageUrl: require('../../assets/Event_Images/freefire.webp'),
        venue: 'Convention Hall',
        time: '1:30 PM - 7:00 PM',
        registrationFee: '399',
        teamSize: '4',
        day: 1,
        facultyCoordinators: ['Ayushman Bilash Thakur'],
        studentCoordinators: ['Anis Imtahan Nayan']
    },
    {
        id: 4,
        title: 'Coding Premier League',
        date: 'MARCH 27TH',
        category: 'CSE',
        description: 'Teams battle through algorithmic challenges to prove their speed, logic, and coding mastery.',
        prizePool: '₹6,000',
        imageColor: '#FFEB3B',
        buttonColor: '#FFFFFF',
        imageUrl: require('../../assets/Event_Images/cse2.webp'),
        venue: 'Lab 2102 & 2103',
        time: '1:00 PM - 4:00 PM',
        registrationFee: '280',
        teamSize: '4',
        day: 1,
        facultyCoordinators: ['Bodhi Chakraborty', 'Debdutta Pal'],
        studentCoordinators: ['Aviroop Pal', 'Sourish Samanta', 'MD Samiul Islam']
    },
    {
        id: 5,
        title: 'Re-Fab',
        date: 'MARCH 27TH',
        category: 'MECHANICAL',
        description: 'Participants transform scrap materials into innovative, functional prototypes with suitable design.',
        prizePool: '₹5,000',
        imageColor: '#C8E6C9',
        buttonColor: '#FFFFFF',
        imageUrl: require('../../assets/Event_Images/mechanical1.webp'),
        venue: 'SOET 3304',
        time: '1:00 PM - 3:00 PM',
        registrationFee: '280',
        teamSize: '4',
        day: 1,
        facultyCoordinators: ['Tirupataiah Kasani', 'Ashish Khaira'],
        studentCoordinators: ['Barun Jana']
    },
    {
        id: 6,
        title: 'Path Follower',
        date: 'MARCH 27TH',
        category: 'ROBOTICS',
        description: 'Autonomous bots must navigate a complex, winding track with speed and pinpoint accuracy.',
        prizePool: '₹5,000',
        imageColor: '#D1C4E9',
        buttonColor: '#FFFFFF',
        imageUrl: require('../../assets/Event_Images/robotics2.webp'),
        venue: 'SOET 3103',
        time: '1:00 PM - 4:00 PM',
        registrationFee: '219',
        teamSize: '3',
        day: 1,
        facultyCoordinators: ['Rupanwita Das Mahapatra'],
        studentCoordinators: ['Sumanto Roy']
    },
    {
        id: 7,
        title: 'Bridge Building',
        date: 'MARCH 27TH',
        category: 'CIVIL',
        description: 'Bridge the gap between theory and reality. Build a truss bridge that can withstand maximum load.',
        prizePool: '₹3,000',
        imageColor: '#FFE0B2',
        buttonColor: '#FFFFFF',
        imageUrl: require('../../assets/Event_Images/civil2.webp'),
        venue: 'SOET 5003',
        time: '1:00 PM - 4:00 PM',
        registrationFee: '280',
        teamSize: '4',
        day: 1,
        facultyCoordinators: ['Dr. Hasim Ali Khan', 'Dr. Apurba Paul'],
        studentCoordinators: ['Toufik Islam']
    },
    {
        id: 8,
        title: 'Circuitronix ',
        date: 'MARCH 27TH',
        category: 'EEE',
        description: 'Students race against the clock to design, build, and troubleshoot complex circuits.',
        prizePool: '₹6,000',
        imageColor: '#80DEEA',
        buttonColor: '#FFFFFF',
        imageUrl: require('../../assets/Event_Images/eee.webp'),
        venue: 'SOET 5204',
        time: '1:00 PM - 7:00 PM',
        registrationFee: '299',
        teamSize: '4',
        day: 1,
        facultyCoordinators: ['Nihar karmakar', 'Jeet Banerjee'],
        studentCoordinators: ['Suraj Rana','Chandril Bijoy Bhattacharyya','Sagar Talukdar']
        
    },
    {
        id: 9,
        title: 'Dance Battle',
        date: 'MARCH 27TH',
        category: 'NON-TECH',
        description: 'Rhythm, style, and attitude collide, bring your best moves, own the stage, and outshine the competition.',
        prizePool: '₹7,000',
        imageColor: '#F5E6FA',
        buttonColor: '#FFFFFF',
        imageUrl: require('../../assets/Event_Images/dance-battle.webp'),
        venue: 'Basketball Court',
        time: '3:00 PM - 7:00 PM',
        registrationFee: '200/500',
        teamSize: '1/2/3/4/5/6/7',
        day: 1,
        facultyCoordinators: ['Anusuya Bera'],
        studentCoordinators: ['Asmita Ghosh', 'Adityavardhan Singh']
    },
    {
        id: 10,
        title: 'Arm Wrestling',
        date: 'MARCH 27TH',
        category: 'NON-TECH',
        description: 'Lock hands, hold your ground, and power through to pin your opponent down.',
        prizePool: '₹3,000',
        imageColor: '#795548',
        buttonColor: '#FFFFFF',
        imageUrl: require('../../assets/Event_Images/non-tech1.webp'),
        venue: 'Canopy Area',
        time: '12:30 PM - 3:00 PM',
        registrationFee: '100',
        teamSize: '1',
        day: 1,
        facultyCoordinators: ['Bishal Mondal'],
        studentCoordinators: ['Digant Mishra', 'Subhangkar Barui']
    },

    // ─── DAY 2 EVENTS (MARCH 28TH) ────────────────────────────────
    {
        id: 11,
        title: 'Power Deal',
        date: 'MARCH 28TH',
        category: 'NON-TECH',
        description: 'Test your negotiating skills and business acumen in this exciting challenge.',
        prizePool: '₹3,000',
        imageColor: '#FFF176',
        buttonColor: '#FFFFFF',
        imageUrl: require('../../assets/Event_Images/powerdeal.webp'),
        venue: 'AU Auditorium',
        time: '9:30 AM - 1:00 PM',
        registrationFee: '149',
        teamSize: '3',
        day: 2,
        facultyCoordinators: ['Soodipa chakraborty'],
        studentCoordinators: ['Preyashee Saha','Archita Khan']
    },
    {
        id: 12,
        title: 'Lathe War',
        date: 'MARCH 28TH',
        category: 'MECHANICAL',
        description: 'Participants face off to machine raw materials into perfect components with speed and surgical accuracy.',
        prizePool: '₹5,000',
        imageColor: '#C5CAE9',
        buttonColor: '#FFFFFF',
        imageUrl: require('../../assets/Event_Images/lathe-war.webp'),
        venue: 'Workshop',
        time: '10:00 AM - 3:00 PM',
        registrationFee: '219',
        teamSize: '3',
        day: 2,
        facultyCoordinators: ['Dr. Nataraj Mishra', 'Dr. Nitesh kumar'],
        studentCoordinators: ['Soumen Samanta']
    },
    {
        id: 13,
        title: 'Dil Se Design',
        date: 'MARCH 28TH',
        category: 'CSE',
        description: 'A UI/UX challenge to craft intuitive, beautiful, and user-centered digital experiences.',
        prizePool: '₹3,000',
        imageColor: '#F8BBD0',
        buttonColor: '#FFFFFF',
        imageUrl: require('../../assets/Event_Images/cse1.webp'),
        venue: 'SOET 2103',
        time: '10:00 AM - 2:00 PM',
        registrationFee: '219',
        teamSize: '3',
        day: 2,
        facultyCoordinators: ['Toufique Ahammad Gazi'],
        studentCoordinators: ['Baibhab Adhikari']
    },
    {
        id: 14,
        title: 'Tower Making',
        date: 'MARCH 28TH',
        category: 'CIVIL',
        description: 'Build the tallest, strongest tower using creativity, strategy, and skill.',
        prizePool: '₹3,000',
        imageColor: '#FFCCBC',
        buttonColor: '#FFFFFF',
        imageUrl: require('../../assets/Event_Images/civil1.webp'),
        venue: 'SOET 5003',
        time: '10:00 AM - 1:00 PM',
        registrationFee: '280',
        teamSize: '4',
        day: 2,
        facultyCoordinators: ['Shantanu Haldar', 'Dr. Argha kamal Guha '],
        studentCoordinators: ['Arka Gain']
    },
    {
        id: 15,
        title: 'Robo Terrain (Robo Soccer)',
        date: 'MARCH 28TH',
        category: 'ROBOTICS',
        description: 'Custom built bots must navigate a grueling obstacle course of mud, sand, and steep inclines.',
        prizePool: '₹5,000',
        imageColor: '#B2DFDB',
        buttonColor: '#FFFFFF',
        imageUrl: require('../../assets/Event_Images/robotics1.webp'),
        venue: 'SOET 3101',
        time: '10:00 AM - 1:00 PM',
        registrationFee: '219',
        teamSize: '3',
        day: 2,
        facultyCoordinators: ['Rupanwita Das Mahapatra'],
        studentCoordinators: ['Anurag Biswas']
    },
    {
        id: 16,
        title: 'BGMI',
        date: 'MARCH 28TH',
        category: 'ESPORTS',
        description: 'Drop in, gear up, and fight through intense combat zones to be the last team standing.',
        prizePool: '₹40,000',
        imageColor: '#FF9800',
        buttonColor: '#FFFFFF',
        imageUrl: require('../../assets/Event_Images/bgmi.webp'),
        venue: 'Convention Hall',
        time: '10:00 AM - 4:00 PM',
        registrationFee: '399',
        teamSize: '4',
        day: 2,
        facultyCoordinators: ['Ayushman Bilash Thakur'],
        studentCoordinators: ['Anubrata Sadukhan']
    },
    {
        id: 17,
        title: 'E-Football',
        date: 'MARCH 28TH',
        category: 'ESPORTS',
        description: 'Compete in the ultimate virtual football tournament.',
        prizePool: '₹15,000',
        imageColor: '#4CAF50',
        buttonColor: '#FFFFFF',
        imageUrl: require('../../assets/Event_Images/efootbal.webp'),
        venue: 'Seminar Hall',
        time: '10:00 AM - 4:00 PM',
        registrationFee: '149',
        teamSize: '1',
        day: 2,
        facultyCoordinators: ['Ayushman Bilash Thakur'],
        studentCoordinators: ['Reyansh Dalui']
    },
    {
        id: 18,
        title: 'Treasure Hunt',
        date: 'MARCH 28TH',
        category: 'NON-TECH',
        description: 'Solve puzzles, race against time, and uncover the hidden prize.',
        prizePool: '₹5,555',
        imageColor: '#FFEB3B',
        buttonColor: '#FFFFFF',
        imageUrl: require('../../assets/Event_Images/treasure-hunt.webp'),
        venue: 'Adamas Campus',
        time: '2:00 PM - 5:00 PM',
        registrationFee: '300',
        teamSize: '3',
        day: 2,
        facultyCoordinators: ['Koushik Mukhopadhyay'],
        studentCoordinators: ['Arijit De', 'Garima Roy']
    },
    {
        id: 19,
        title: 'Rap Battle',
        date: 'MARCH 28TH',
        category: 'NON-TECH',
        description: 'Rhythm & wordplay collide, drop sharp bars, own the mic, and outflow your opponent.',
        prizePool: '₹3,000',
        imageColor: '#F5E6FA',
        buttonColor: '#FFFFFF',
        imageUrl: require('../../assets/Event_Images/rap-battle.webp'),
        venue: 'Canopy Area',
        time: '3:00 PM - 5:00 PM',
        registrationFee: '149',
        teamSize: '1/2/3/4',
        day: 2,
        facultyCoordinators: ['Saheb Adhikary'],
        studentCoordinators: ['Mrinal sahoo', 'Arnab Mondal']
    },
    {
        id: 20,
        title: 'Prize Distribution',
        date: 'MARCH 28TH',
        category: 'NON-TECH',
        description: 'The closing ceremony and prize distribution of Signifiya\' 26.',
        prizePool: '-',
        imageColor: '#FFFFFF',
        buttonColor: '#CCCCCC',
        imageUrl: require('../../assets/Event_Images/Prize-Distribution.webp'),
        venue: 'AU Auditorium',
        time: '5:00 PM - 7:00 PM',
        day: 2,
        hideFromHome: true
    }
];


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
    venue: string;
    time?: string; // [NEW]
    studentCoordinators?: string[]; // [NEW] 
    facultyCoordinators?: string[]; // [NEW]
}

// =====================================================================
// ⚡ HOW TO ADD A NEW EVENT:
// 1. Copy one of the objects inside [] below.
// 2. Paste it at the end of the list (before the last `]`).
// 3. Change the details (title, date, venue, etc.).
// 4. This event will AUTOMATICALLY appear in:
//    - Home Screen Carousel
//    - Events Schedule Screen (Day 1 / Day 2 based on date)
// =====================================================================

export const EVENTS_DATA: EventData[] = [
    // --- DAY 1 (25th March) ---
    {
        title: 'Coding Premier League',
        date: '25th March',
        category: 'CSE',
        description: 'An exhilarating coding competition where participants showcase their programming skills, problem-solving abilities, and creativity.',
        prizePool: '15K',
        imageColor: '#FFEB3B', // Retro Yellow
        buttonColor: '#FFFFFF',
        imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', // Computer/Retro
        videoUrl: '',

        venue: 'Computer Lab A',
        time: '10:00 AM - 1:00 PM',
        studentCoordinators: ['Aviroop Pal', 'Sourish Samanta'],
        facultyCoordinators: ['TBA']
    },
    {
        title: 'Electrifying Circuit',
        date: '25th March',
        category: 'EEE',
        description: 'Analysis and handling of circuits and electronics in this electrifying showdown designed for the brightest minds in EEE.',
        prizePool: '10K',
        imageColor: '#80DEEA', // Cyan
        buttonColor: '#FFFFFF',
        imageUrl: 'https://plus.unsplash.com/premium_photo-1679917152960-b9e645638575?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZWxlY3RyaWMlMjBjaXJjdWl0fGVufDB8fDB8fHww', // Sparks
        videoUrl: '',

        venue: 'Lab 204',
        time: '11:00 AM - 2:00 PM',
        studentCoordinators: ['Rahul K.', 'Sneha M.'],
        facultyCoordinators: ['Prof. X']
    },
    {
        title: 'Tower Making',
        date: '25th March',
        category: 'CIVIL',
        description: 'Construct the tallest and most stable tower using limited resources. A test of structural engineering and patience.',
        prizePool: '8K',
        imageColor: '#FFCCBC', // Light Orange
        buttonColor: '#FFFFFF',
        imageUrl: 'https://images.unsplash.com/photo-1590579491624-f98f36d4c763?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', // Construction
        videoUrl: '',

        venue: 'Civil Block A',
        time: '09:00 AM - 12:00 PM',
        studentCoordinators: ['Amit S.', 'Riya D.'],
        facultyCoordinators: ['Dr. Civil']
    },
    {
        title: 'Waste to Wealth',
        date: '25th March',
        category: 'NON-TECH',
        description: 'Innovate and create useful products from waste materials. Show how master engineering can drive sustainability.',
        prizePool: '5K',
        imageColor: '#C8E6C9', // Green
        buttonColor: '#FFFFFF',
        imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', // Recycle creative
        videoUrl: '',

        venue: 'Open Ground',
        time: '02:00 PM - 5:00 PM',
        studentCoordinators: ['Eco Club'],
        facultyCoordinators: ['Green Admin']
    },
    {
        title: 'Path Follower',
        date: '25th March',
        category: 'ROBOTICS',
        description: 'Design an autonomous bot capable of following a complex black line path in the shortest time possible.',
        prizePool: '20K',
        imageColor: '#D1C4E9', // Purple
        buttonColor: '#FFFFFF',
        imageUrl: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', // Robot
        venue: 'Robotics Hall',
        time: '12:00 PM - 4:00 PM',
        studentCoordinators: ['Robo Team'],
        facultyCoordinators: ['Tech Head']
    },
    // --- DAY 2 (26th March) ---
    {
        title: 'Robo Wars',
        date: 'Day 2',
        category: 'ROBOTICS',
        description: 'The ultimate clash of metal and code. Witness bots battle it out for supremacy in the arena.',
        prizePool: '25K',
        imageColor: '#FF5722',
        buttonColor: '#FFFFFF',
        imageUrl: 'https://images.unsplash.com/photo-1561569762-b9b596287c80?q=80&w=2670&auto=format&fit=crop',
        videoUrl: '',

        venue: 'Arena Stage',
        time: '10:00 AM - 4:00 PM',
        studentCoordinators: ['War Lords'],
        facultyCoordinators: ['Battle Master']
    },
    {
        title: 'Bridge Builder',
        date: 'Day 2',
        category: 'CIVIL',
        description: 'Design and construct a bridge that can withstand heavy loads using limited materials.',
        prizePool: '12K',
        imageColor: '#795548',
        buttonColor: '#FFFFFF',
        imageUrl: 'https://images.unsplash.com/photo-1513475303621-c8bf20660388?q=80&w=2672&auto=format&fit=crop',
        videoUrl: '',

        venue: 'Civil Block B',
        time: '09:30 AM - 1:30 PM',
        studentCoordinators: ['Builder Bob'],
        facultyCoordinators: ['Site Eng.']
    }
];

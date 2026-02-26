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
    imageColor?: string;
    buttonColor?: string;
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
    department?: string;
    teamMember?: string;
    eventTitle?: string;
    scheduleDescription?: string;
    image?: string;
    coordinators?: string;
    lottie?: string;
    color?: string;
    excludeFromListing?: boolean;
    scheduleImage?: string;
}

// =====================================================================
// MASTER EVENT LIST
// All events from the web admin, with hardcoded image URLs
// =====================================================================

export const EVENTS_DATA: EventData[] = [
    // ─── DAY 1 EVENTS (MARCH 27TH) ────────────────────────────────
    {
    id: 0,
    title: "Inauguration",
    category: "OFFICIAL",
    department: "Official",
    description: "Official inauguration ceremony for the event.",
    scheduleDescription: "Opening ceremony for Signifiya 2026.",
    date: "March 27th",
    imageUrl: require('../../assets/Event_Images/Inauguration.webp'),
    prizePool: "—",
    day: 1,
    time: "12:30 PM - 1:30 PM",
    venue: "APJ Abdul Kalam Convention Hall",
    lottie: "",
    excludeFromListing: true,
    color: "bg-yellow-50",
  },

  {
    id: 1,
    title: "Valorant",
    category: "ESPORTS",
    department: "E-Sports",
    teamMember: "Team Size: 5 (+1 substitute)",
    description:
      "Precise gunplay with agent abilities with smart strategy and perfect coordination to secure victory.",
    scheduleDescription:
      "Assemble your squad and compete in the ultimate tactical FPS showdown.",
    date: "March 27th",
    imageUrl: require('../../assets/Event_Images/valorant.webp'),
    prizePool: "₹30,000",
    day: 1,
    time: "12:30 PM - 7:00 PM",
    venue: "Swami Vivekananda Hall",
    studentCoordinators: ["Hrittima Sen", "Diptadip Roy"],
    facultyCoordinators: ["Mr. Ayushman Bilash Thakur"],
    
  },
  {
    id: 2,
    title: "Free Fire",
    teamMember: "Team Size: 4 (+1 substitute)",
    category: "ESPORTS",
    department: "E-Sports",
    description:
      "Survive till the end in this action-packed battle royale tournament.",
    scheduleDescription:
      "Survive the shrinking battlefield, outsmart opponents, and be the last squad standing.",
    date: "March 27th",
     imageUrl: require('../../assets/Event_Images/freefire.webp'),
    prizePool: "₹25,000",
    day: 1,
    time: "1:30 PM - 7:00 PM",
    venue: "APJ Abdul Kalam Convention Hall",
    studentCoordinators: ["Anis Imtahan Nayan"],
    facultyCoordinators: ["Mr. Ayushman Bilash Thakur"],
    
  },
  {
    id: 3,
    title: "Coding Premier League",
    eventTitle: "CODING PREMIER LEAGUE",
    category: "CSE",
    department: "CSE (Tech)",
    // Spreadsheet: CPL total = 4 (including leader)
    teamMember: "Team Size: 4 (+1 substitute)",
    description:
      "Teams battle through algorithmic challenges to prove their speed, logic, and coding mastery.",
    scheduleDescription:
      "An exhilarating coding competition where participants showcase their programming skills, problem-solving abilities, and creativity.",
    date: "March 27th",
    imageUrl: require('../../assets/Event_Images/cse2.webp'),
    prizePool: "₹10,000",
    day: 1,
    time: "1:30 PM - 4:30 PM",
    venue: "Lab 2102 & 2103",
    studentCoordinators: ["Aviroop Pal", "Sourish Samanta", "MD Samiul Islam"],
    facultyCoordinators: ["Ms. Bodhi Chakraborty", "Dr. Debdutta Pal"],
  
  },
  {
    id: 4,
    title: "Refab",
    eventTitle: "RE-FAB (Waste to Wealth)",
    category: "MECHANICAL",
    department: "Mechanical (Tech)",
    teamMember: "Team Size: 4 (+1 substitute)",
    description:
      "Participants transform scrap materials into innovative, functional prototypes with suitable design.",
    scheduleDescription:
      "Innovate and create useful products from waste materials. Show how mechanical engineering can drive sustainability.",
    date: "March 27th",
    imageUrl: require('../../assets/Event_Images/mechanical1.webp'),
    prizePool: "₹5,000",
    day: 1,
    time: "1:30 PM - 3:30 PM",
    venue: "SOET 3304",
    studentCoordinators: ["Barun Jana"],
    facultyCoordinators: ["Dr. Tirupataiah Kasani", "Dr. Ashish Khaira"],
    
  },
  {
    id: 5,
    title: "Path Follower",
    teamMember: "Team Size: 3 (+1 substitute)",
    category: "ROBOTICS",
    department: "Robotics (Tech)",
    description:
      "Autonomous bots must navigate a complex, winding track with speed and pinpoint accuracy.",
    scheduleDescription:
      "Design an autonomous bot capable of following a complex black line path in the shortest time possible.",
    date: "March 27th",
    imageUrl: require('../../assets/Event_Images/robotics2.webp'),
    prizePool: "₹5,000",
    day: 1,
    time: "1:30 PM - 4:30 PM",
    venue: "SOET 3103",
    studentCoordinators: ["Sumanto Roy"],
    facultyCoordinators: ["Mrs. Rupanwita Das Mahapatra"],
    
  },
  {
    id: 6,
    title: "Bridge Building",
    eventTitle: "BRIDGE BUILDING",
    category: "CIVIL",
    department: "Civil (Tech)",
    teamMember: "Team Size: 4 (+1 substitute)",
    description:
      "Bridge the gap between theory and reality. Build a truss bridge that can withstand maximum load.",
    scheduleDescription:
      "Bridge the gap between theory and reality. Build a truss bridge that can withstand maximum load.",
    date: "March 27th",
    imageUrl: require('../../assets/Event_Images/civil2.webp'),
    prizePool: "₹3,000",
    day: 1,
    time: "1:00 PM - 4:00 PM",
    venue: "SOET 5003",
    studentCoordinators: ["Toufik Islam"],
    facultyCoordinators: ["Dr. Hasim Ali Khan", "Dr. Apurba Paul"],
    lottie: "",
    color: "bg-orange-100",
  },
  {
    id: 7,
    title: "Circuitronix",
    eventTitle: "CIRCUITRONIX",
    category: "EEE",
    department: "EEE (Tech)",
    teamMember: "Team Size: 4 (+1 substitute)",
    description:
      "Students race against the clock to design, build, and troubleshoot complex circuits.",
    scheduleDescription:
      "Test your knowledge of circuits and electronics in this electrifying showdown designed for the brightest minds in EEE.",
    date: "March 28th",
    imageUrl: require('../../assets/Event_Images/eee.webp'),
    prizePool: "₹6,000",
    day: 2,
    time: "10:00 AM - 7:00 PM",
    venue: "SOET 5204",
    studentCoordinators: ["Suraj Rana", "Chandril Bijoy Bhattacharyya", "Sagar Talukdar"],
    facultyCoordinators: ["Dr. Nihar Karmakar", "Dr. Jeet Banerjee"],
    
  },
  {
    id: 8,
    title: "Dance Battle",
    category: "NON-TECH",
    department: "Non-Tech",
    teamMember: "Team Size: 1/2/3/4/5/6/7",
    description:
      "Rhythm, style, and attitude collide, bring your best moves, own the stage, and outshine the competition.",
    scheduleDescription:
      "Bring your best moves and own the stage in this electrifying dance battle!",
    date: "March 27th",
    imageUrl: require('../../assets/Event_Images/dance-battle.webp'),
    prizePool: "₹10,000",
    day: 1,
    time: "4:30 PM - 6:30 PM",
    venue: "Basketball Court",
    studentCoordinators: ["Asmita Ghosh", "Adityavardhan Singh"],
    facultyCoordinators: ["Ms. Anusuya Bera"],
   
  },
  {
    id: 9,
    title: "Arm Wrestling",
    category: "NON-TECH",
    department: "Non-Tech",
    teamMember: "Team Size: 1",
    description:
      "Lock hands, hold your ground, and power through to pin your opponent down.",
    scheduleDescription:
      "Lock hands, hold your ground, and power through to pin your opponent down. Weight categories will lie between: 60kgs - 90kgs+.",
    date: "March 27th",
    imageUrl: require('../../assets/Event_Images/non-tech1.webp'),
    prizePool: "₹3,000",
    day: 1,
    time: "4:00 PM - 5:00 PM",
    venue: "Canopy Area",
    studentCoordinators: ["Digant Mishra", "Subhangkar Barui"],
    facultyCoordinators: ["Mr. Bishal Mondal"],
    
  },

  // ─── DAY 2 EVENTS (MARCH 28TH) ──────────────────────────

  {
    id: 10,
    title: "Power Deal",
    category: "NON-TECH",
    department: "Non-Tech",
    teamMember: "Team Size: 3 (+1 substitute)",
    description:
      "Test your negotiating skills and business acumen in this exciting challenge.",
    scheduleDescription:
      "Negotiate, strategize, and close the best deals in this high-energy business simulation challenge.",
    date: "March 27th",
    imageUrl: require('../../assets/Event_Images/powerdeal.webp'),
    prizePool: "₹3,000",
    day: 1,
    time: "2:30 PM - 4:30 PM",
    venue: "AU1 International Lounge",
    studentCoordinators: ["Agniva Chatterjee", "Archita Khan"],
    facultyCoordinators: ["Mrs. Soodipa chakraborty"],
    lottie: "",
    color: "bg-cyan-100",
  },
  {
    id: 11,
    title: "Lathe War",
    category: "MECHANICAL",
    department: "Mechanical (Tech)",
    teamMember: "Team Size: 3 (+1 substitute)",
    description:
      "Participants face off to machine raw materials into perfect components with speed and surgical accuracy.",
    scheduleDescription:
      "A battle of precision turning. Machine the perfect component on the lathe within the given tolerance.",
    date: "March 28th",
    imageUrl: require('../../assets/Event_Images/lathe-war.webp'),
    prizePool: "₹5,000",
    day: 2,
    time: "10:00 AM - 3:00 PM",
    venue: "Workshop",
    studentCoordinators: ["Soumen Samanta", "Suman Jana"],
    facultyCoordinators: ["Dr. Nataraj Mishra", "Dr. Nitesh kumar"],
    
  },
  {
    id: 12,
    title: "Dil Se Design",
    category: "CSE",
    department: "CSE (Tech)",
    teamMember: "Team Size: 3 (+1 substitute)",
    description:
      "A UI/UX challenge to craft intuitive, beautiful, and user-centered digital experiences.",
    scheduleDescription:
      "Unleash your UI/UX creativity. Design interfaces that speak to the user's heart.",
    date: "March 28th",
    imageUrl: require('../../assets/Event_Images/cse1.webp'),
    prizePool: "₹3,000",
    day: 2,
    time: "10:00 AM - 2:00 PM",
    venue: "SOET 2103",
    studentCoordinators: ["Baibhab Adhikari", "Prabhat Dey", "Prithvi Prasad"],
    facultyCoordinators: ["Mr. Toufique Ahammad Gazi"],
    
  },
  {
    id: 13,
    title: "Tower Making",
    category: "CIVIL",
    department: "Civil (Tech)",
    teamMember: "Team Size: 4 (+1 substitute)",
    description:
      "Build the tallest, strongest tower using creativity, strategy, and skill.",
    scheduleDescription:
      "Construct the tallest and most stable tower using limited resources. A test of structural engineering and patience.",
    date: "March 27th",
    imageUrl: require('../../assets/Event_Images/civil1.webp'),
    prizePool: "₹3,000",
    day: 1,
    time: "1:30 PM - 4:30 PM",
    venue: "SOET 5003",
    studentCoordinators: ["Arka Gain"],
    facultyCoordinators: ["Mr. Shantanu Haldar", "Dr. Argha Kamal Guha"],
    
  },
  {
    id: 14,
    title: "Robo Soccer",
    eventTitle: "ROBO SOCCER",
    category: "ROBOTICS",
    department: "Robotics (Tech)",
    teamMember: "Team Size: 3 (+1 substitute)",
    description:
      "Custom built bots must navigate a grueling obstacle course of mud, sand, and steep inclines.",
    scheduleDescription:
      "Navigate your bot through rough and uneven terrains without getting stuck or toppling over.",
    date: "March 28th",
    imageUrl: require('../../assets/Event_Images/robotics1.webp'),
    prizePool: "₹5,000",
    day: 2,
    time: "10:00 AM - 1:00 PM",
    venue: "SOET 3101",
    studentCoordinators: ["Anurag Biswas"],
    facultyCoordinators: ["Mrs. Rupanwita Das Mahapatra"],
    
  },
  {
    id: 15,
    title: "BGMI",
    category: "ESPORTS",
    department: "E-Sports",
    teamMember: "Team Size: 4 (+1 substitute)",
    description:
      "Drop in, gear up, and fight through intense combat zones to be the last team standing.",
    scheduleDescription:
      "Drop in, gear up, and fight through intense combat zones to be the last team standing.",
    date: "March 28th",
    imageUrl: require('../../assets/Event_Images/bgmi.webp'),
    prizePool: "₹40,000",
    day: 2,
    time: "10:00 AM - 4:00 PM",
    venue: "APJ Abdul Kalam Convention Hall",
    studentCoordinators: ["Anubrata Sadukhan"],
    facultyCoordinators: ["Mr. Ayushman Bilash Thakur"],
    
  },
  {
    id: 16,
    title: "E-Football",
    teamMember: "Team Size: 1",
    eventTitle: "E-FOOTBALL",
    category: "ESPORTS",
    department: "E-Sports",
    description: "Compete in the ultimate virtual football tournament.",
    scheduleDescription:
      "Master the pitch, command your squad, and score your way to glory.",
    date: "March 28th",
    imageUrl: require('../../assets/Event_Images/efootbal.webp'),
    prizePool: "₹20,000",
    day: 2,
    time: "10:00 AM - 4:00 PM",
    venue: "Seminar Hall",
    studentCoordinators: ["Reyansh Dalui"],
    facultyCoordinators: ["Mr. Ayushman Bilash Thakur"],
    
  },
  {
    id: 17,
    title: "Treasure Hunt",
    category: "NON-TECH",
    teamMember: "Team Size: 3 (+1 substitute)",
    department: "Non-Tech",
    description:
      "Solve puzzles, race against time, and uncover the hidden prize.",
    scheduleDescription:
      "Solve puzzles, race against time, and uncover the hidden prize across Adamas Campus.",
    date: "March 28th",
    imageUrl: require('../../assets/Event_Images/treasure-hunt.webp'),
    prizePool: "₹5,555",
    day: 2,
    time: "2:00 PM - 5:00 PM",
    venue: "Adamas Campus",
    studentCoordinators: ["Arijit De", "Garima Roy"],
    facultyCoordinators: ["Mr. Koushik Mukhopadhyay"],
    
  },
  {
    id: 18,
    title: "Rap Battle",
    category: "NON-TECH",
    department: "Non-Tech",
    teamMember: "Team Size: 3 (+1 substitute)",
    description:
      "Rhythm & wordplay collide, drop sharp bars, own the mic, and outflow your opponent.",
    scheduleDescription:
      "Rhythm & wordplay collide in this electrifying rap battle. Drop sharp bars, own the mic, and outflow your opponent with clever lyrics and flow.",
    date: "March 28th",
    imageUrl: require('../../assets/Event_Images/rap-battle.webp'),
    prizePool: "₹3,000",
    day: 2,
    time: "3:00 PM - 4:00 PM",
    venue: "Canopy Area",
    studentCoordinators: ["Mrinal sahoo", "Arnab Mondal"],
    facultyCoordinators: ["Mr. Saheb Adhikary"],
    
  },
  {
    id: 19,
    title: "Tech Monopoly",
    category: "NON-TECH",
    department: "Non-Tech",
    description:
      "Test your negotiation, strategy, and business acumen in this live startup-investment simulation.",
    teamMember: "Team Size: 3 (+1 substitute)",
    scheduleDescription:
      "Tech Monopoly is a live startup-investment simulation where teams act as Venture Capital Firms ",
    date: "March 28th",
    imageUrl: require('../../assets/Event_Images/techmonopoly.webp'),
    scheduleImage: require('../../assets/Event_Images/techmonopoly.webp'),
    prizePool: "₹3,000",
    day: 2,
    time: "10:00 AM - 1:00 PM",
    venue: "AU1 International Lounge",
    studentCoordinators: ["Dimple Sharma", "Debopriya Dey"],
    facultyCoordinators: ["Mrs. Soodipa chakraborty"],
  },
  {
    id: 20,
    title: "Prize Distribution",
    category: "OFFICIAL",
    department: "Official",
    description: "Prize distribution and closing remarks for Signifiya 2026.",
    scheduleDescription:
      "Prize distribution ceremony and closing of Signifiya 2026.",
    date: "March 28th",
    imageUrl: require('../../assets/Event_Images/Prize-Distribution.webp'),
    prizePool: "—",
    day: 2,
    time: "4:30 PM - 5:30 PM",
    venue: "APJ Abdul Kalam Convention Hall",
    color: "bg-yellow-50",
    excludeFromListing: true,
  },
];
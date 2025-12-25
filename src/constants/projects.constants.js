/**
 * Project Snapshots Gallery - Constants
 * 
 * Single source of truth for all project data.
 * Used by: Gallery, ProjectDetail, AI Assistant
 * To add/update a project, edit ONLY this file.
 */

// Gallery sidebar categories
export const galleryCategories = [
    { id: 1, icon: "/icons/gicon1.svg", title: "Library", description: "All projects" },
    { id: 2, icon: "/icons/gicon2.svg", title: "Memories", description: "Archived projects" },
    { id: 3, icon: "/icons/file.svg", title: "Places", description: "Location-based projects" },
    { id: 4, icon: "/icons/gicon4.svg", title: "People", description: "Collaborative projects" },
    { id: 5, icon: "/icons/gicon5.svg", title: "Favorites", description: "Featured projects" },
];

// Project snapshots data with detailed metadata for AI responses
export const projectSnapshots = [
    {
        id: 1,
        title: "DSA Visualizer",
        slug: "dsa",
        keywords: ["dsa", "data structures", "algorithms", "visualizer", "interactive", "learning"],
        images: ["/images/dsa/dsaimage1.png", "/images/dsa/dsaimage2.png", "/images/dsa/dsaimage3.png", "/images/dsa/dsaimage4.png"],
        thumbnail: "/images/dsa/dsaimage1.png",
        description: "Interactive platform to visualize data structures and algorithms step-by-step.",

        // Detailed metadata for AI responses
        problem: "Learning data structures and algorithms can be abstract and difficult to grasp without visual representation of how they work step-by-step.",
        objective: "Create an interactive educational platform that visualizes DSA concepts in real-time, helping students understand complex algorithms through visual learning.",
        features: [
            "Step-by-step algorithm visualization",
            "Interactive data structure manipulation",
            "Multiple sorting and searching algorithms",
            "Custom input support for testing",
            "Speed control for animation playback",
        ],
        architecture: "Built with modern web technologies for a responsive and interactive experience. Component-based architecture for modular algorithm implementations.",
        challenges: "Creating smooth animations that accurately represent algorithm steps while maintaining performance and educational clarity.",
        learnings: "Deepened understanding of algorithm complexity, animation optimization, and building educational tools that make learning engaging.",

        techStack: ["React", "JavaScript", "CSS"],
        demoUrl: "https://dsa-visualizer-suharshit-singh.vercel.app/",
        githubUrl: null,
        categories: ["Library", "Favorites"],
    },
    {
        id: 2,
        title: "PeerLink",
        slug: "peerlink",
        keywords: ["peerlink", "desktop", "networking", "collaboration", "peer", "application"],
        images: ["/images/peerlink/peerlinkimage1.png", "/images/peerlink/peerlinkimage2.png", "/images/peerlink/peerlinkimage3.png"],
        thumbnail: "/images/peerlink/peerlinkimage1.png",
        description: "Desktop-based peer networking and collaboration application.",

        problem: "Collaborative work often requires complex setups for peer-to-peer communication and file sharing between team members.",
        objective: "Build a streamlined desktop application that enables seamless peer networking and real-time collaboration without complicated infrastructure.",
        features: [
            "Peer-to-peer connection establishment",
            "Real-time collaboration features",
            "File sharing capabilities",
            "Secure communication channels",
            "Intuitive desktop interface",
        ],
        architecture: "Desktop application built with modern frameworks for cross-platform compatibility. Peer-to-peer networking protocol for direct communication.",
        challenges: "Implementing reliable peer discovery and maintaining stable connections across different network configurations.",
        learnings: "Gained experience in desktop application development, networking protocols, and building robust peer-to-peer communication systems.",

        techStack: ["Python", "Networking", "Desktop"],
        demoUrl: null,
        githubUrl: null,
        categories: ["Library", "People"],
    },
    {
        id: 3,
        title: "NYC Equity Dashboard",
        slug: "nyc-equity",
        keywords: ["power bi", "dashboard", "nyc", "equity", "analytics", "data visualization", "civic"],
        images: ["/images/nyc equity/nycimage1.png", "/images/nyc equity/nycimage2.png", "/images/nyc equity/nycimage3.png", "/images/nyc equity/nycimage4.png"],
        thumbnail: "/images/nyc equity/nycimage1.png",
        description: "Power BI dashboard analyzing service equity and civic efficiency in New York City.",

        problem: "Civic data is often scattered and difficult to analyze, making it challenging to identify service equity gaps across different communities.",
        objective: "Create a comprehensive Power BI dashboard that visualizes NYC civic data to identify equity patterns and inform better policy decisions.",
        features: [
            "Interactive data visualizations",
            "Multi-dimensional equity analysis",
            "Geographic mapping of services",
            "Trend analysis over time",
            "Comparative community metrics",
        ],
        architecture: "Built with Microsoft Power BI for advanced data visualization. Connected to civic data sources with real-time refresh capabilities.",
        challenges: "Integrating diverse data sources and creating meaningful visualizations that reveal equity patterns without oversimplifying complex issues.",
        learnings: "Enhanced skills in data visualization, Power BI development, and translating complex civic data into actionable insights.",

        techStack: ["Power BI", "Data Analytics", "SQL"],
        demoUrl: null,
        githubUrl: null,
        categories: ["Library", "Memories"],
    },
    {
        id: 4,
        title: "Student Behavioral Drift Detection",
        slug: "student-drift",
        keywords: ["ml", "machine learning", "python", "analytics", "behavioral", "prediction", "student"],
        images: ["/images/student behavioural drift/studentimage1.png", "/images/student behavioural drift/studentimage2.png", "/images/student behavioural drift/studentimage3.png"],
        thumbnail: "/images/student behavioural drift/studentimage1.png",
        description: "Predictive analytics project to detect behavioral drift in students using Python and ML.",

        problem: "Educational institutions struggle to identify students who may be experiencing behavioral changes that affect their academic performance early enough to intervene.",
        objective: "Develop a machine learning system that detects behavioral drift patterns in student data, enabling early intervention and support.",
        features: [
            "Behavioral pattern analysis",
            "Drift detection algorithms",
            "Predictive modeling for interventions",
            "Visual analytics dashboard",
            "Early warning system",
        ],
        architecture: "Python-based ML pipeline with data preprocessing, feature engineering, and model training. Web interface for result visualization.",
        challenges: "Balancing model accuracy with interpretability, and handling imbalanced datasets while maintaining ethical considerations in educational analytics.",
        learnings: "Developed expertise in ML model development, drift detection techniques, and building analytics systems for educational contexts.",

        techStack: ["Python", "Machine Learning", "Analytics"],
        demoUrl: "https://student-behavioral-drift-detection.onrender.com/",
        githubUrl: null,
        categories: ["Library", "Favorites"],
    },
];

// Helper: Get project by slug or partial name match
export const findProjectByName = (query) => {
    const q = query.toLowerCase();
    return projectSnapshots.find(p =>
        p.slug === q ||
        p.title.toLowerCase().includes(q) ||
        p.keywords.some(kw => q.includes(kw))
    );
};

// Helper: Filter projects by category
export const getProjectsByCategory = (category) => {
    if (category === "Library") return projectSnapshots;
    return projectSnapshots.filter(p => p.categories.includes(category));
};

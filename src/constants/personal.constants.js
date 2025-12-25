/**
 * Personal Knowledge Base - AI Data Source
 * 
 * All personal/portfolio data for AI responses lives here.
 * The AI assistant uses ONLY this data to answer questions.
 */

import { socialLinks } from './social.constants';
import { projectSnapshots, findProjectByName } from './projects.constants';

// ============================================================
// PERSONAL INFORMATION
// ============================================================
export const personalInfo = {
    name: 'Suharshit Singh',
    title: 'Full Stack Developer',
    location: 'India',
    email: 'suharshit123@gmail.com',

    // Professional summary for detailed responses
    professionalSummary: `I'm Suharshit Singh, a Full Stack Developer with a passion for building modern, user-centric web and mobile applications. I specialize in the React ecosystem—including Next.js and React Native—paired with Node.js backends. My focus is on creating products that are not just functional, but delightful to use: clean interfaces, smooth interactions, and solid architecture under the hood.`,

    bio: [
        "I'm Suharshit Singh, a passionate Full Stack Developer who loves building sleek, interactive web applications.",
        "I specialize in React, Next.js, and Node.js—creating fast, responsive, and user-friendly experiences.",
        "I'm big on clean UI, good UX, and writing code that's maintainable and scalable.",
    ],

    skills: {
        frontend: ['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'GSAP'],
        mobile: ['React Native', 'Expo'],
        backend: ['Node.js', 'Express', 'NestJS', 'Hono'],
        database: ['MongoDB', 'PostgreSQL'],
        devTools: ['Git', 'GitHub', 'Docker'],
    },

    experience: [
        {
            role: 'Full Stack Developer',
            type: 'Freelance / Personal Projects',
            description: 'Building modern web and mobile applications with React, Next.js, and Node.js. Focused on creating polished user experiences with attention to performance and accessibility.',
            highlights: [
                'Developed multiple production-ready web applications',
                'Built cross-platform mobile apps with React Native',
                'Implemented AI-powered features using OpenAI APIs',
            ],
        },
    ],

    interests: [
        'Web Development',
        'UI/UX Design',
        'Open Source',
        'Learning New Technologies',
    ],

    careerGoals: [
        'Continue building impactful products that solve real problems',
        'Deepen expertise in full-stack architecture and system design',
        'Contribute to open-source projects and the developer community',
        'Explore opportunities in AI-powered application development',
    ],
};

// ============================================================
// INTENT DETECTION
// ============================================================
export const AI_INTENTS = {
    PROJECT_SPECIFIC: 'project_specific',
    PROJECTS_GENERAL: 'projects_general',
    PROFILE: 'profile',
    SKILLS: 'skills',
    CONTACT: 'contact',
    GREETING: 'greeting',
    OUT_OF_SCOPE: 'out_of_scope',
};

// Keywords for intent classification
export const aiKeywords = {
    greeting: ['hi', 'hello', 'hey', 'howdy', 'greetings', 'good morning', 'good afternoon', 'good evening'],
    skills: ['skill', 'technology', 'tech', 'stack', 'know', 'use', 'work with', 'proficient', 'tools', 'languages'],
    projects: ['project', 'built', 'made', 'created', 'work', 'portfolio', 'app', 'website', 'application', 'show me'],
    contact: ['contact', 'reach', 'email', 'linkedin', 'github', 'social', 'connect', 'hire', 'message', 'talk'],
    about: ['about', 'who', 'tell me about yourself', 'introduction', 'bio', 'yourself', 'background', 'experience', 'career'],
    // Project name triggers for specific queries
    projectNames: projectSnapshots.flatMap(p => [p.slug, ...p.keywords, p.title.toLowerCase()]),
};

/**
 * Detect user intent from question
 */
export const detectIntent = (question) => {
    const q = question.toLowerCase().trim();

    // Check for greetings first
    if (aiKeywords.greeting.some(kw => q.startsWith(kw) || q === kw)) {
        return { intent: AI_INTENTS.GREETING, data: null };
    }

    // Check for specific project mention
    const matchedProject = findProjectByName(q);
    if (matchedProject) {
        return { intent: AI_INTENTS.PROJECT_SPECIFIC, data: matchedProject };
    }

    // Check for general projects query
    if (aiKeywords.projects.some(kw => q.includes(kw))) {
        // But not if asking about a specific one
        return { intent: AI_INTENTS.PROJECTS_GENERAL, data: null };
    }

    // Check for skills
    if (aiKeywords.skills.some(kw => q.includes(kw))) {
        return { intent: AI_INTENTS.SKILLS, data: null };
    }

    // Check for contact
    if (aiKeywords.contact.some(kw => q.includes(kw))) {
        return { intent: AI_INTENTS.CONTACT, data: null };
    }

    // Check for about/profile
    if (aiKeywords.about.some(kw => q.includes(kw))) {
        return { intent: AI_INTENTS.PROFILE, data: null };
    }

    // Out of scope
    return { intent: AI_INTENTS.OUT_OF_SCOPE, data: null };
};

// ============================================================
// RESPONSE GENERATORS
// ============================================================

/**
 * Generate detailed response for a specific project
 */
const generateProjectResponse = (project) => {
    const lines = [
        `## ${project.title}`,
        '',
        `**Problem:** ${project.problem}`,
        '',
        `**Objective:** ${project.objective}`,
        '',
        '**Key Features:**',
        ...project.features.map(f => `• ${f}`),
        '',
        `**Tech Stack:** ${project.techStack.join(', ')}`,
        '',
        `**Architecture:** ${project.architecture}`,
        '',
        `**Challenges:** ${project.challenges}`,
        '',
        `**Learnings:** ${project.learnings}`,
    ];

    // Add links if available
    if (project.demoUrl || project.githubUrl) {
        lines.push('', '**Links:**');
        if (project.demoUrl) lines.push(`• [Live Demo](${project.demoUrl})`);
        if (project.githubUrl) lines.push(`• [GitHub](${project.githubUrl})`);
    }

    return lines.join('\n');
};

/**
 * Generate project list for general queries
 */
const generateProjectListResponse = () => {
    const list = projectSnapshots.map(p =>
        `• **${p.title}** — ${p.description.slice(0, 60)}... (${p.techStack.slice(0, 2).join(', ')})`
    ).join('\n');

    return `Here are the projects I've built:\n\n${list}\n\n*Would you like a detailed overview of any specific project? Just ask!*`;
};

/**
 * Generate professional profile response
 */
const generateProfileResponse = () => {
    const { skills, careerGoals } = personalInfo;

    return `## About ${personalInfo.name}

${personalInfo.professionalSummary}

**Technical Skills:**
• **Frontend:** ${skills.frontend.join(', ')}
• **Mobile:** ${skills.mobile.join(', ')}
• **Backend:** ${skills.backend.join(', ')}
• **Database:** ${skills.database.join(', ')}
• **Dev Tools:** ${skills.devTools.join(', ')}

**Notable Projects:** I've built eCommerce platforms, AI-powered tools, and mobile apps. Check out the Gallery or ask me about specific projects!

**Career Focus:**
${careerGoals.map(g => `• ${g}`).join('\n')}

Feel free to reach out—I'm always interested in exciting opportunities and collaborations.`;
};

/**
 * Generate skills response
 */
const generateSkillsResponse = () => {
    const { skills } = personalInfo;
    return `## Technical Skills

**Frontend Development:**
${skills.frontend.map(s => `• ${s}`).join('\n')}

**Mobile Development:**
${skills.mobile.map(s => `• ${s}`).join('\n')}

**Backend Development:**
${skills.backend.map(s => `• ${s}`).join('\n')}

**Database:**
${skills.database.map(s => `• ${s}`).join('\n')}

**Dev Tools:**
${skills.devTools.map(s => `• ${s}`).join('\n')}

I'm constantly learning and adding to my toolkit. Currently exploring AI/ML integrations and advanced system design patterns.`;
};

/**
 * Generate contact response
 */
const generateContactResponse = () => {
    const links = socialLinks
        .map(s => `• **${s.label}:** ${s.type === 'mail' ? s.url.replace('mailto:', '') : s.url}`)
        .join('\n');
    return `## Let's Connect!\n\nYou can reach me through:\n\n${links}\n\nI'm open to freelance projects, full-time opportunities, and interesting collaborations. Looking forward to hearing from you!`;
};

// ============================================================
// MAIN AI RESPONSE FUNCTION
// ============================================================
export const aiResponses = {
    greetings: [
        `Hello! I'm ${personalInfo.name}'s portfolio assistant. I can tell you about his projects, skills, and experience. What would you like to know?`,
        `Hi there! Ask me anything about ${personalInfo.name}'s work—projects, tech stack, or how to get in touch.`,
    ],

    outOfScope: [
        "I can help with questions about the portfolio owner's projects, skills, and background. Try asking about a specific project or technical skills!",
        "That's outside my scope, but I'd love to help with portfolio-related questions. Ask about projects, experience, or how to connect!",
    ],

    // Response generators by intent
    generateResponse: (intent, data) => {
        switch (intent) {
            case AI_INTENTS.PROJECT_SPECIFIC:
                return generateProjectResponse(data);
            case AI_INTENTS.PROJECTS_GENERAL:
                return generateProjectListResponse();
            case AI_INTENTS.PROFILE:
                return generateProfileResponse();
            case AI_INTENTS.SKILLS:
                return generateSkillsResponse();
            case AI_INTENTS.CONTACT:
                return generateContactResponse();
            case AI_INTENTS.GREETING:
                return aiResponses.greetings[Math.floor(Math.random() * aiResponses.greetings.length)];
            case AI_INTENTS.OUT_OF_SCOPE:
            default:
                return aiResponses.outOfScope[Math.floor(Math.random() * aiResponses.outOfScope.length)];
        }
    },
};

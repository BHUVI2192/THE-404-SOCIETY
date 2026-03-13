import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    updateDoc
} from "firebase/firestore";
import { db } from "./firebase";

export interface BlogPostData {
    author?: any;
    id?: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    image?: string;
    date: string;
    colSpan?: number;
    rowSpan?: number;
    createdAt?: number;
    authorName?: string;
    readTime?: string;
}

const BLOG_COLLECTION = "nexus_blog_posts";
const LEGACY_MIGRATION_FLAG = "nexus_blog_posts_migrated_to_firestore";

const getLegacyLocalPosts = (): BlogPostData[] => {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const data = localStorage.getItem(BLOG_COLLECTION);
        if (!data) {
            return [];
        }

        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error("[blog] Failed to parse legacy local posts:", error);
        return [];
    }
};

const migrateLegacyPostsIfNeeded = async () => {
    if (typeof window === "undefined") {
        return;
    }

    if (localStorage.getItem(LEGACY_MIGRATION_FLAG) === "true") {
        return;
    }

    try {
        const postsRef = collection(db, BLOG_COLLECTION);
        const existingSnapshot = await getDocs(postsRef);

        // Migrate local posts only when Firestore does not already have blog data.
        if (!existingSnapshot.empty) {
            localStorage.setItem(LEGACY_MIGRATION_FLAG, "true");
            return;
        }

        const legacyPosts = getLegacyLocalPosts();
        if (!legacyPosts.length) {
            localStorage.setItem(LEGACY_MIGRATION_FLAG, "true");
            return;
        }

        for (const post of legacyPosts) {
            const { id, ...data } = post;
            await addDoc(postsRef, {
                ...data,
                createdAt: data.createdAt || Date.now(),
            });
        }

        localStorage.setItem(LEGACY_MIGRATION_FLAG, "true");
    } catch (error) {
        console.error("[blog] Legacy migration failed:", error);
    }
};

export const HARDCODED_POSTS: BlogPostData[] = [
    {
        id: "hc-ai-trends-2026",
        title: "7 AI Trends in 2026 Every Tech Student Should Know",
        excerpt: "Major 2026 AI shifts every student should track to build better projects, tools, and careers.",
        content: `Why AI Trends Matter for You

2026 is not just another AI year. Major shifts are happening in how AI is built, deployed, and used in real products. If you are in a community like The 404 Society, understanding these trends helps you pick better project ideas, tools, and career paths.

From Single Chatbots to AI Agent Teams

The biggest shift: AI is moving from single assistants to teams of AI agents that can plan, coordinate, and act.

- Call tools, APIs, and services, not just chat
- Orchestrate workflows: research -> summarize -> draft -> send
- Be assembled by everyday users with minimal code

Agentic AI in Production, Not Just Demos

Enterprises are now deploying AI agents in production, not just in labs.

- A growing share of enterprise apps now embed task-specific AI agents
- Agents handle cloud optimization, security response, finance monitoring, and more

Smaller, Smarter, Domain-Specific Models

In 2026, focus is shifting from biggest-model competition to practical, specialized intelligence.

- Smaller, domain-specific models are tuned for particular industries
- Open-source models power many customized solutions
- Teams focus on efficient reasoning instead of just raw size

AI as a Core Part of Products, Not an Add-On

Companies are now building AI into the core of their platforms.

- Agentic capabilities are becoming default in many SaaS tools
- Marketing, analytics, operations, and support workflows are AI-native

From Insight to Autonomous Execution

Earlier AI recommended. Now AI also executes.

- Security agents isolate devices, rotate keys, and block traffic
- Cloud agents optimize costs and configurations automatically
- Business agents reconcile transactions continuously

AI Literacy Becomes a Must-Have Skill

Organizations and universities now treat AI literacy as fundamental.

- Students are expected to prompt, verify, and integrate AI into workflows
- Communities can build literacy through events, bootcamps, and mentorship

Ethics, Governance, and Trust Take Center Stage

As AI autonomy grows, governance is essential.

- Transparency, explainability, and data privacy are top concerns
- Teams need guardrails and monitoring around AI systems

What This Means for The 404 Society

The future belongs to people who can build with AI, not just use AI tools.

- Design projects that use agents, not just chat completion
- Explore open-source models and small, specialized AI
- Include ethics and governance in events and hackathons

Make The 404 Society a place where students learn to lead the next wave of AI.`,
        category: "AI",
        image: "/github.jpg",
        date: "MAR 13, 2026",
        colSpan: 2,
        rowSpan: 1,
        createdAt: 1773390600000,
        authorName: "THE 404 SOCIETY",
        readTime: "8 MIN"
    },
    {
        id: "hc-ai-tools-2026",
        title: "AI Tools Every Student Creator Should Use in 2026",
        excerpt: "A practical AI toolkit for coding, design, content, research, and community operations.",
        content: `Why AI Tools Matter for Communities Like The 404 Society

AI is no longer a nice-to-have for tech students. It is part of how we learn, build, and ship projects in 2026. For The 404 Society, AI tools can speed up coding, design, content, events, and career preparation.

AI Coding Assistants (ChatGPT, Claude, Cursor)

AI coding assistants are now standard in developer workflows.

What they are great at:
- Explaining complex concepts in simple language
- Generating boilerplate code and fixing bugs
- Reviewing code and suggesting optimizations
- Helping refactor or document legacy code

How to use them in The 404 Society:
- Build event web apps faster with AI-assisted React or Next.js workflows
- Generate starter templates for hackathons and internal projects
- Use AI to review pull requests and improve documentation

AI Design and UI/UX Tools

Visual identity matters for community brands.

- Generate moodboards, logo variations, and brand concepts
- Create hero images, mockups, and illustrations
- Turn rough wireframes into high-fidelity layouts

AI Content and Documentation Assistants

Every project needs clear writing.

- Turn bullet points into structured docs
- Rewrite technical text to match brand tone
- Generate FAQs, rules, and event guidelines quickly

AI Research and Learning Helpers

- Summarize long articles and papers
- Break down concepts step by step
- Create revision notes and flashcards from your own material

AI Tools for Events and Community Management

- Generate event ideas, titles, and descriptions
- Draft emails, announcements, and social captions
- Automate answers for common event questions

How To Get Started Without Getting Overwhelmed

Start with:
1. One AI coding assistant
2. One AI writing tool
3. One AI research helper

Final Thoughts

AI does not replace creativity. It amplifies it. Students who combine their skills with AI will ship more, lead better events, and stand out in internships and jobs.

Do not just use AI. Learn to work with AI as a teammate.`,
        category: "AI TOOLS",
        image: "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?q=80&w=1200&auto=format&fit=crop",
        date: "MAR 13, 2026",
        colSpan: 1,
        rowSpan: 1,
        createdAt: 1773387000000,
        authorName: "THE 404 SOCIETY",
        readTime: "7 MIN"
    },
    {
        id: "hc-404-ai-action-plan",
        title: "How The 404 Society Can Lead the Next AI Wave",
        excerpt: "A practical action plan for projects, events, and mentorship built around modern AI skills.",
        content: `What This Means for The 404 Society

Current AI trends point to one clear message: communities that build with AI will lead.

A practical action plan:

1. Build agent-first projects
- Move beyond basic chatbots
- Create systems that can plan, call tools, and complete multi-step tasks

2. Use specialized and open models
- Explore small, domain-specific models for campus and event use cases
- Focus on reliability and efficiency, not just model size

3. Make AI literacy a core community skill
- Teach prompting, verification, and real workflow integration
- Run peer-learning sessions and implementation labs

4. Include governance from day one
- Add transparency and data privacy checks in every project
- Document responsible-use guardrails in hackathons and showcases

5. Convert learning into visible output
- Publish case studies and project demos
- Build a portfolio of AI-native products from the community

Final Note

The strongest student communities in 2026 will not be the ones who talk most about AI. They will be the ones who build responsibly, ship consistently, and help others learn faster.

The 404 Society can be that community.`,
        category: "COMMUNITY",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
        date: "MAR 13, 2026",
        colSpan: 1,
        rowSpan: 1,
        createdAt: 1773383400000,
        authorName: "THE 404 SOCIETY",
        readTime: "5 MIN"
    }
];

const mergeWithHardcodedPosts = (posts: BlogPostData[]): BlogPostData[] => {
    const filteredCloudPosts = posts.filter((post) => {
        const title = (post.title || "").trim().toLowerCase();
        const content = (post.content || "").trim().toLowerCase();

        // Hide old placeholder data that was used during initial local demo setup.
        if (title === "the future of open source") {
            return false;
        }

        if (title === "this is a new society") {
            return false;
        }

        if (content === "open source is the backbone of modern technology...") {
            return false;
        }

        return true;
    });

    const merged = [...filteredCloudPosts, ...HARDCODED_POSTS];
    const seen = new Set<string>();

    return merged
        .filter((post) => {
            const dedupeKey = `${post.id || ""}::${post.title.toLowerCase()}`;
            if (seen.has(dedupeKey)) {
                return false;
            }
            seen.add(dedupeKey);
            return true;
        })
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
};

export const getBlogPosts = async (): Promise<BlogPostData[]> => {
    try {
        await migrateLegacyPostsIfNeeded();
        const postsRef = collection(db, BLOG_COLLECTION);
        const q = query(postsRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const cloudPosts = snapshot.docs
            .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as BlogPostData));
        return mergeWithHardcodedPosts(cloudPosts);
    } catch (error) {
        console.error("[blog] Failed to fetch posts:", error);
        return HARDCODED_POSTS;
    }
};

export const subscribeToBlogPosts = (callback: (posts: BlogPostData[]) => void) => {
    void migrateLegacyPostsIfNeeded();

    const postsRef = collection(db, BLOG_COLLECTION);
    const q = query(postsRef, orderBy("createdAt", "desc"));

    return onSnapshot(
        q,
        (snapshot) => {
            const cloudPosts = snapshot.docs
                .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as BlogPostData));
            const posts = mergeWithHardcodedPosts(cloudPosts);
            callback(posts);
        },
        (error) => {
            console.error("[blog] Realtime subscription failed:", error);
            callback(HARDCODED_POSTS);
        }
    );
};

export const addBlogPost = async (post: Omit<BlogPostData, 'id'>) => {
    const postsRef = collection(db, BLOG_COLLECTION);
    const newPost = {
        ...post,
        createdAt: Date.now(),
    };
    const docRef = await addDoc(postsRef, newPost);
    return { id: docRef.id };
};

export const updateBlogPost = async (id: string, data: Partial<BlogPostData>) => {
    const docRef = doc(db, BLOG_COLLECTION, id);
    await updateDoc(docRef, data);
};

export const deleteBlogPost = async (id: string) => {
    const docRef = doc(db, BLOG_COLLECTION, id);
    await deleteDoc(docRef);
};

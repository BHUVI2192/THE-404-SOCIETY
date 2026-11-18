import fs from 'node:fs';
import path from 'node:path';

const ROADMAPS_ROOT = './builderportal/developer-roadmap/roadmaps';
const OUTPUT_DIR = './public/curricula';

function getYouTubeEmbed(url) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|(?:embed|v)\/))([a-zA-Z0-9_-]{11})/);
  if (match) return `https://www.youtube-nocookie.com/embed/${match[1]}`;
  const listMatch = url.match(/list=([a-zA-Z0-9_-]+)/);
  if (listMatch) return `https://www.youtube-nocookie.com/embed/videoseries?list=${listMatch[1]}`;
  return null;
}

function sanitizeText(str) {
  if (!str) return '';
  return str
    .replace(/https?:\/\/roadmap\.sh[^\s)\]]*/gi, '')
    .replace(/roadmap\.sh/gi, '404 Society')
    .replace(/@currentYear@/g, '2026')
    .trim();
}

function parseMarkdownTopic(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const lines = raw.split('\n');
  let title = '';
  const descLines = [];
  const resources = [];
  let inResources = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!title && trimmed.startsWith('# ')) {
      title = trimmed.replace(/^#\s+/, '');
      continue;
    }
    if (trimmed.toLowerCase().includes('visit the following resources to learn more:')) {
      inResources = true;
      continue;
    }
    if (inResources) {
      const match = trimmed.match(/^-\s*\[@([a-zA-Z0-9_-]+)@(.*?)\]\((.*?)\)/);
      if (match) {
        const type = match[1];
        const resTitle = match[2];
        const url = match[3];
        if (url.includes('roadmap.sh')) continue; // Skip roadmap.sh self-links
        resources.push({
          type,
          title: sanitizeText(resTitle),
          url,
          embedUrl: type === 'video' ? getYouTubeEmbed(url) : null
        });
      }
    } else {
      if (trimmed) descLines.push(trimmed);
    }
  }

  return {
    title: sanitizeText(title),
    description: sanitizeText(descLines.join('\n\n')),
    resources
  };
}

// Find local topic by query
function findLocalTopic(slug, queries) {
  const contentDir = path.join(ROADMAPS_ROOT, slug, 'content');
  if (!fs.existsSync(contentDir)) return null;
  const files = fs.readdirSync(contentDir);
  for (const q of queries) {
    const match = files.find(f => f.toLowerCase().includes(q.toLowerCase()));
    if (match) {
      return parseMarkdownTopic(path.join(contentDir, match));
    }
  }
  return null;
}

// Define the 10 core tracks with structured phases and color schemes
const TRACK_DEFINITIONS = [
  {
    id: 'frontend',
    slug: 'frontend',
    title: 'Frontend Engineering',
    category: 'Web Development',
    badge: 'Most Popular',
    description: 'Master modern client-side engineering from web core and TypeScript to component architectures, Next.js, and AI-enabled interfaces.',
    stages: [
      {
        id: 'fe-p1',
        phaseNumber: 1,
        title: 'Web Core & Foundations',
        subtitle: 'The foundational triad of the modern internet',
        color: 'amber',
        topics: [
          { id: 'fe-internet', title: 'Internet Protocols & HTTP/3', queries: ['internet', 'http'], tags: ['Networking', 'Web Core'] },
          { id: 'fe-html', title: 'Semantic HTML5 & Accessibility (a11y)', queries: ['accessibility', 'html'], tags: ['Standards', 'DOM'] },
          { id: 'fe-css', title: 'Modern CSS, Grid & Flexbox', queries: ['css', 'responsive'], tags: ['Styling', 'Layout'] },
          { id: 'fe-js', title: 'JavaScript (ES6+, DOM & Async)', queries: ['javascript', 'async'], tags: ['Core Language'] },
          { id: 'fe-git', title: 'Git & GitHub Collaboration', queries: ['git', 'github'], tags: ['Version Control'] }
        ]
      },
      {
        id: 'fe-p2',
        phaseNumber: 2,
        title: 'TypeScript & React UI Architecture',
        subtitle: 'Enterprise-grade component design and type safety',
        color: 'blue',
        topics: [
          { id: 'fe-ts', title: 'TypeScript Fundamentals & Generics', queries: ['typescript', 'types'], tags: ['Type Safety'] },
          { id: 'fe-react', title: 'React Core, Hooks & Virtual DOM', queries: ['react', 'hooks'], tags: ['UI Library'] },
          { id: 'fe-state', title: 'State Management (Zustand & Redux)', queries: ['state-management', 'redux'], tags: ['Data Flow'] },
          { id: 'fe-tailwind', title: 'Utility CSS & Tailwind CSS', queries: ['tailwind', 'css-frameworks'], tags: ['Design System'] },
          { id: 'fe-routing', title: 'Client Routing & Navigation', queries: ['router', 'routing'], tags: ['SPAs'] }
        ]
      },
      {
        id: 'fe-p3',
        phaseNumber: 3,
        title: 'Build Systems & APIs',
        subtitle: 'Modern bundling, network protocols and client caching',
        color: 'emerald',
        topics: [
          { id: 'fe-vite', title: 'Build Tooling (Vite, Rollup & Turbopack)', queries: ['vite', 'webpack', 'bundlers'], tags: ['Dev Tools'] },
          { id: 'fe-api', title: 'API Integration (REST, TanStack Query & GraphQL)', queries: ['api', 'graphql', 'fetch'], tags: ['Data Fetching'] },
          { id: 'fe-testing', title: 'Testing (Vitest, Jest & Playwright)', queries: ['testing', 'unit-testing'], tags: ['Quality'] },
          { id: 'fe-pwa', title: 'Progressive Web Apps & Service Workers', queries: ['pwa', 'service-workers'], tags: ['Offline First'] }
        ]
      },
      {
        id: 'fe-p4',
        phaseNumber: 4,
        title: 'Performance & Fullstack Web',
        subtitle: 'Server rendering, streaming and Core Web Vitals',
        color: 'purple',
        topics: [
          { id: 'fe-nextjs', title: 'Next.js & React Server Components (RSC)', queries: ['nextjs', 'ssr', 'server-side'], tags: ['SSR/SSG'] },
          { id: 'fe-perf', title: 'Core Web Vitals & Web Performance', queries: ['performance', 'optimization'], tags: ['LCP / CLS'] },
          { id: 'fe-sec', title: 'Frontend Security (CORS, CSP & JWT)', queries: ['cors', 'security', 'auth'], tags: ['Security'] },
          { id: 'fe-deploy', title: 'Edge Deployment & CDN Caching', queries: ['cloudflare', 'deployment', 'cdn'], tags: ['Cloud Edge'] }
        ]
      },
      {
        id: 'fe-p5',
        phaseNumber: 5,
        title: 'Modern AI-Integrated Frontend',
        subtitle: 'Streaming LLMs, generative UI and intelligent applications',
        color: 'rose',
        topics: [
          { id: 'fe-ai-sdk', title: 'Vercel AI SDK & Model Interfaces', queries: ['ai-assisted-coding', 'ai-agents'], tags: ['AI Frontend'] },
          { id: 'fe-streaming', title: 'Server-Sent Events & Streaming UIs', queries: ['websockets', 'streaming'], tags: ['Real-time'] },
          { id: 'fe-vector', title: 'Client-Side Semantic Search & Embeddings', queries: ['search', 'embeddings'], tags: ['AI Retrieval'] },
          { id: 'fe-collab', title: 'Real-time Collaboration & WebSockets', queries: ['websockets', 'realtime'], tags: ['Multiplayer'] }
        ]
      }
    ]
  },
  {
    id: 'backend',
    slug: 'backend',
    title: 'Backend Engineering',
    category: 'System Architecture',
    badge: 'Core Track',
    description: 'Build robust, scalable distributed backends with SQL/NoSQL databases, microservices, auth, and cloud deployments.',
    stages: [
      {
        id: 'be-p1',
        phaseNumber: 1,
        title: 'Programming Core & Architecture',
        subtitle: 'Language fundamentals, OS concepts, and concurrency',
        color: 'amber',
        topics: [
          { id: 'be-os', title: 'Operating Systems, Threads & I/O', queries: ['operating-system', 'linux'], tags: ['Systems'] },
          { id: 'be-lang', title: 'Core Backend Language (Node.js/Go/Python)', queries: ['nodejs', 'python', 'golang'], tags: ['Runtimes'] },
          { id: 'be-dsa', title: 'Data Structures & Algorithms in Practice', queries: ['datastructures', 'algorithms'], tags: ['Efficiency'] },
          { id: 'be-git', title: 'Git & Version Control Workflows', queries: ['git', 'github'], tags: ['Tooling'] }
        ]
      },
      {
        id: 'be-p2',
        phaseNumber: 2,
        title: 'Databases & Data Modeling',
        subtitle: 'ACID transactions, relational schema and document stores',
        color: 'emerald',
        topics: [
          { id: 'be-pg', title: 'PostgreSQL & Relational Schema Design', queries: ['postgresql', 'sql', 'relational-database'], tags: ['RDBMS'] },
          { id: 'be-indexing', title: 'Database Indexing, B-Trees & Query Plans', queries: ['indexing', 'database'], tags: ['Performance'] },
          { id: 'be-nosql', title: 'NoSQL & Document Stores (MongoDB, DynamoDB)', queries: ['mongodb', 'nosql'], tags: ['Document DB'] },
          { id: 'be-redis', title: 'Redis In-Memory Caching & Pub/Sub', queries: ['redis', 'caching'], tags: ['Cache'] }
        ]
      },
      {
        id: 'be-p3',
        phaseNumber: 3,
        title: 'APIs, Authentication & Protocols',
        subtitle: 'Robust interface contracts, session management and JWTs',
        color: 'blue',
        topics: [
          { id: 'be-rest', title: 'RESTful API Design & OpenAPI/Swagger', queries: ['api-design', 'rest'], tags: ['APIs'] },
          { id: 'be-auth', title: 'Authentication, OAuth 2.0 & JWT Security', queries: ['authentication', 'auth-strategies'], tags: ['Identity'] },
          { id: 'be-graphql', title: 'GraphQL Schemas, Resolvers & Federation', queries: ['graphql'], tags: ['Query API'] },
          { id: 'be-grpc', title: 'gRPC & Protocol Buffers (Protobuf)', queries: ['grpc', 'protocols'], tags: ['RPC'] }
        ]
      },
      {
        id: 'be-p4',
        phaseNumber: 4,
        title: 'Microservices & Message Queues',
        subtitle: 'Asynchronous event streaming and decoupled architectures',
        color: 'purple',
        topics: [
          { id: 'be-kafka', title: 'Message Brokers (RabbitMQ & Apache Kafka)', queries: ['kafka', 'message-brokers'], tags: ['Event-Driven'] },
          { id: 'be-microservices', title: 'Microservices Patterns & Service Mesh', queries: ['microservices', 'architectural-patterns'], tags: ['Distributed'] },
          { id: 'be-testing', title: 'Unit, Integration & Contract Testing', queries: ['testing', 'integration-testing'], tags: ['Testing'] },
          { id: 'be-docker', title: 'Containerization with Docker', queries: ['docker', 'containers'], tags: ['Containers'] }
        ]
      },
      {
        id: 'be-p5',
        phaseNumber: 5,
        title: 'Scalability, Cloud & Resiliency',
        subtitle: 'Load balancing, rate limiting, and zero-downtime deploys',
        color: 'rose',
        topics: [
          { id: 'be-system-design', title: 'High-Availability System Design', queries: ['system-design', 'high-availability'], tags: ['Architecture'] },
          { id: 'be-load-balancer', title: 'Load Balancing & Reverse Proxies (NGINX/Envoy)', queries: ['load-balancing', 'nginx'], tags: ['Networking'] },
          { id: 'be-monitoring', title: 'Observability, OpenTelemetry & APM', queries: ['monitoring', 'logging'], tags: ['Metrics'] },
          { id: 'be-cloud', title: 'Cloud Deployments (AWS/GCP/Supabase)', queries: ['aws', 'cloud-computing'], tags: ['Cloud'] }
        ]
      }
    ]
  },
  {
    id: 'ai-engineer',
    slug: 'ai-engineer',
    title: 'AI & LLM Engineering',
    category: 'Artificial Intelligence',
    badge: 'Trending',
    description: 'Master foundation models, prompt engineering, RAG architectures, vector search, and autonomous multi-agent pipelines.',
    stages: [
      {
        id: 'ai-p1',
        phaseNumber: 1,
        title: 'Python, Math & AI Foundations',
        subtitle: 'Vectors, tensors, and the computational building blocks',
        color: 'amber',
        topics: [
          { id: 'ai-python', title: 'Python for AI, NumPy & Pandas', queries: ['python', 'numpy'], tags: ['Python'] },
          { id: 'ai-math', title: 'Linear Algebra, Probability & Calculus', queries: ['math', 'machine-learning'], tags: ['Mathematics'] },
          { id: 'ai-ml-basics', title: 'Supervised vs. Unsupervised Learning', queries: ['machine-learning', 'supervised'], tags: ['ML Core'] },
          { id: 'ai-nn', title: 'Neural Networks & PyTorch Fundamentals', queries: ['neural-networks', 'pytorch'], tags: ['Deep Learning'] }
        ]
      },
      {
        id: 'ai-p2',
        phaseNumber: 2,
        title: 'Transformers & Foundation Models',
        subtitle: 'Attention mechanisms, embeddings and modern LLM architecture',
        color: 'blue',
        topics: [
          { id: 'ai-transformer', title: 'The Transformer Architecture & Self-Attention', queries: ['transformers', 'attention'], tags: ['Deep Learning'] },
          { id: 'ai-hf', title: 'Hugging Face Transformers & Datasets', queries: ['hugging-face', 'models'], tags: ['Model Hub'] },
          { id: 'ai-embeddings', title: 'Text Embeddings & Semantic Similarity', queries: ['embeddings', 'vector'], tags: ['Vector Math'] },
          { id: 'ai-tokenization', title: 'Tokenization, BPE & Context Windows', queries: ['tokenization', 'context-window'], tags: ['LLM Core'] }
        ]
      },
      {
        id: 'ai-p3',
        phaseNumber: 3,
        title: 'LLM APIs & Prompt Engineering',
        subtitle: 'Structured outputs, function calling and multi-modal models',
        color: 'emerald',
        topics: [
          { id: 'ai-apis', title: 'OpenAI & Gemini API Integration', queries: ['gemini', 'anthropic', 'openai'], tags: ['API Integration'] },
          { id: 'ai-prompting', title: 'Advanced Prompting (CoT, ReAct, Few-Shot)', queries: ['prompt', 'chain-of-thought'], tags: ['Prompting'] },
          { id: 'ai-functions', title: 'Tool Use & Function Calling', queries: ['function-calling', 'tools'], tags: ['Capabilities'] },
          { id: 'ai-structured', title: 'Structured Outputs & Pydantic Validation', queries: ['structured-outputs', 'json-mode'], tags: ['Validation'] }
        ]
      },
      {
        id: 'ai-p4',
        phaseNumber: 4,
        title: 'RAG & Vector Databases',
        subtitle: 'Augmenting model knowledge with custom enterprise data',
        color: 'purple',
        topics: [
          { id: 'ai-vector-db', title: 'Vector Databases (Pinecone, pgvector & Qdrant)', queries: ['vector-databases', 'pinecone'], tags: ['Vector DB'] },
          { id: 'ai-chunking', title: 'Document Ingestion & Chunking Strategies', queries: ['chunking', 'rag'], tags: ['Ingestion'] },
          { id: 'ai-hybrid', title: 'Hybrid Search (Keyword + Dense Vector)', queries: ['hybrid-search', 'reranking'], tags: ['Information Retrieval'] },
          { id: 'ai-rag-eval', title: 'RAG Evaluation (Ragas, TruLens & Precision)', queries: ['evaluation', 'metrics'], tags: ['Evals'] }
        ]
      },
      {
        id: 'ai-p5',
        phaseNumber: 5,
        title: 'Autonomous Agents & Production AI',
        subtitle: 'Agent loops, memory, safety guardrails and deployment',
        color: 'rose',
        topics: [
          { id: 'ai-agents-arch', title: 'Agentic Architectures (LangGraph & LlamaIndex)', queries: ['ai-agents', 'agents'], tags: ['Agentic'] },
          { id: 'ai-memory', title: 'Agent Memory, State Management & Sessions', queries: ['memory', 'state'], tags: ['Persistence'] },
          { id: 'ai-guardrails', title: 'AI Safety, Guardrails & Red-Teaming', queries: ['security', 'guardrails'], tags: ['Safety'] },
          { id: 'ai-production', title: 'LLMOps, Tracing (LangSmith) & Latency Optimization', queries: ['mlops', 'production'], tags: ['LLMOps'] }
        ]
      }
    ]
  },
  {
    id: 'full-stack',
    slug: 'full-stack',
    title: 'Full-Stack Engineering',
    category: 'Full Stack',
    badge: 'Comprehensive',
    description: 'The end-to-end journey of shipping complete modern applications from UI and state to API endpoints, databases, and automated clouds.',
    stages: [
      {
        id: 'fs-p1',
        phaseNumber: 1,
        title: 'Web & Client Foundations',
        subtitle: 'HTML5, Modern CSS, and Core JavaScript',
        color: 'amber',
        topics: [
          { id: 'fs-web', title: 'Web Architecture & DNS/HTTP', queries: ['internet', 'http'], tags: ['Fundamentals'] },
          { id: 'fs-html-css', title: 'Semantic HTML & Modern Responsive CSS', queries: ['html', 'css'], tags: ['Markup'] },
          { id: 'fs-js-ts', title: 'TypeScript & JavaScript ES6+', queries: ['javascript', 'typescript'], tags: ['Scripting'] },
          { id: 'fs-git', title: 'Git & Modern Branching Workflows', queries: ['git', 'github'], tags: ['VCS'] }
        ]
      },
      {
        id: 'fs-p2',
        phaseNumber: 2,
        title: 'Frontend Framework & State',
        subtitle: 'React, Tailwind CSS and Component Hierarchies',
        color: 'blue',
        topics: [
          { id: 'fs-react', title: 'React Core & Functional Components', queries: ['react'], tags: ['Components'] },
          { id: 'fs-tailwind', title: 'Tailwind CSS & Modern Design Systems', queries: ['tailwind'], tags: ['Styling'] },
          { id: 'fs-state', title: 'Global State Management & Data Fetching', queries: ['state-management'], tags: ['State'] },
          { id: 'fs-forms', title: 'Forms, Validation & User Feedback', queries: ['forms', 'validation'], tags: ['UX'] }
        ]
      },
      {
        id: 'fs-p3',
        phaseNumber: 3,
        title: 'Backend Server & Database',
        subtitle: 'Node.js/Express, PostgreSQL, and Query Optimization',
        color: 'emerald',
        topics: [
          { id: 'fs-node', title: 'Node.js & Express REST Endpoints', queries: ['nodejs', 'express'], tags: ['Server'] },
          { id: 'fs-sql', title: 'PostgreSQL & Relational Data Modeling', queries: ['postgresql', 'sql'], tags: ['Database'] },
          { id: 'fs-orm', title: 'ORMs (Prisma / Drizzle) & Migrations', queries: ['orm', 'prisma'], tags: ['Data Access'] },
          { id: 'fs-auth', title: 'Authentication, Sessions & JWT Security', queries: ['authentication', 'auth'], tags: ['Auth'] }
        ]
      },
      {
        id: 'fs-p4',
        phaseNumber: 4,
        title: 'Full-Stack Frameworks',
        subtitle: 'Unified SSR, Server Actions, and BaaS Platforms',
        color: 'purple',
        topics: [
          { id: 'fs-next', title: 'Next.js App Router & Server Actions', queries: ['nextjs', 'ssr'], tags: ['SSR/SSG'] },
          { id: 'fs-supabase', title: 'Supabase (Auth, Storage & Row Level Security)', queries: ['supabase', 'database'], tags: ['BaaS'] },
          { id: 'fs-test', title: 'End-to-End Testing & Integration Tests', queries: ['testing'], tags: ['Quality'] },
          { id: 'fs-api-sec', title: 'Rate Limiting, CORS & Input Sanitization', queries: ['security'], tags: ['Security'] }
        ]
      },
      {
        id: 'fs-p5',
        phaseNumber: 5,
        title: 'Deployment & Production Scale',
        subtitle: 'Docker, Vercel/Cloudflare, and Monitoring',
        color: 'rose',
        topics: [
          { id: 'fs-docker', title: 'Containerization with Docker', queries: ['docker'], tags: ['DevOps'] },
          { id: 'fs-ci-cd', title: 'CI/CD Pipelines (GitHub Actions)', queries: ['ci-cd', 'github-actions'], tags: ['Automation'] },
          { id: 'fs-cloud', title: 'Cloud Hosting & Edge Functions', queries: ['cloud-computing', 'deployment'], tags: ['Infrastructure'] },
          { id: 'fs-perf', title: 'Application Caching, CDN & Analytics', queries: ['caching', 'monitoring'], tags: ['Observability'] }
        ]
      }
    ]
  },
  {
    id: 'devops',
    slug: 'devops',
    title: 'DevOps & Cloud Architecture',
    category: 'Infrastructure',
    badge: 'Operations',
    description: 'Learn modern infrastructure as code, container orchestration with Kubernetes, CI/CD pipelines, and cloud reliability engineering.',
    stages: [
      {
        id: 'do-p1',
        phaseNumber: 1,
        title: 'Linux, Networking & Shell',
        subtitle: 'The foundational sysadmin and networking toolkit',
        color: 'amber',
        topics: [
          { id: 'do-linux', title: 'Linux System Administration & Permissions', queries: ['linux', 'operating-system'], tags: ['Linux'] },
          { id: 'do-bash', title: 'Bash Scripting & Automation', queries: ['shell-bash', 'bash'], tags: ['Shell'] },
          { id: 'do-net', title: 'Networking Fundamentals (TCP/IP, DNS, SSL/TLS)', queries: ['network-engineer', 'networking'], tags: ['Protocols'] },
          { id: 'do-git', title: 'Git for Infrastructure Workflows', queries: ['git', 'github'], tags: ['VCS'] }
        ]
      },
      {
        id: 'do-p2',
        phaseNumber: 2,
        title: 'Containers & Docker Mastery',
        subtitle: 'Immutable environments and multi-stage container builds',
        color: 'blue',
        topics: [
          { id: 'do-docker', title: 'Docker Architecture, Images & Containers', queries: ['docker', 'containers'], tags: ['Containers'] },
          { id: 'do-compose', title: 'Docker Compose for Multi-Container Apps', queries: ['docker', 'containers'], tags: ['Local Dev'] },
          { id: 'do-registry', title: 'Container Registries & Image Security Scanning', queries: ['docker', 'security'], tags: ['Security'] },
          { id: 'do-networking', title: 'Container Networking & Volume Persistence', queries: ['docker', 'networking'], tags: ['Storage'] }
        ]
      },
      {
        id: 'do-p3',
        phaseNumber: 3,
        title: 'Kubernetes & Container Orchestration',
        subtitle: 'Pods, Deployments, Services, Ingress, and Helm',
        color: 'emerald',
        topics: [
          { id: 'do-k8s', title: 'Kubernetes Architecture & Core Concepts', queries: ['kubernetes'], tags: ['Orchestration'] },
          { id: 'do-deployments', title: 'Pods, Deployments & StatefulSets', queries: ['kubernetes'], tags: ['Workloads'] },
          { id: 'do-ingress', title: 'Services, Ingress Controllers & Cert-Manager', queries: ['kubernetes', 'networking'], tags: ['Traffic'] },
          { id: 'do-helm', title: 'Helm Charts & Package Management', queries: ['helm', 'kubernetes'], tags: ['Packaging'] }
        ]
      },
      {
        id: 'do-p4',
        phaseNumber: 4,
        title: 'CI/CD & Infrastructure as Code',
        subtitle: 'Terraform, GitHub Actions, and GitOps workflows',
        color: 'purple',
        topics: [
          { id: 'do-terraform', title: 'Terraform & Infrastructure as Code (IaC)', queries: ['terraform'], tags: ['IaC'] },
          { id: 'do-actions', title: 'CI/CD Pipelines (GitHub Actions & GitLab)', queries: ['ci-cd', 'github-actions'], tags: ['Pipelines'] },
          { id: 'do-gitops', title: 'GitOps (ArgoCD & Flux)', queries: ['gitops', 'argocd'], tags: ['Continuous Deploy'] },
          { id: 'do-ansible', title: 'Configuration Management (Ansible)', queries: ['ansible'], tags: ['Automation'] }
        ]
      },
      {
        id: 'do-p5',
        phaseNumber: 5,
        title: 'Observability & Cloud Scale',
        subtitle: 'Prometheus, Grafana, logging, and disaster recovery',
        color: 'rose',
        topics: [
          { id: 'do-prometheus', title: 'Monitoring & Alerting (Prometheus & Grafana)', queries: ['monitoring', 'prometheus'], tags: ['Metrics'] },
          { id: 'do-logging', title: 'Centralized Logging (ELK / Loki)', queries: ['elasticsearch', 'logging'], tags: ['Logs'] },
          { id: 'do-security', title: 'DevSecOps, Secrets Management (Vault) & Zero Trust', queries: ['devsecops', 'security'], tags: ['Security'] },
          { id: 'do-cloud', title: 'AWS / Cloud Architecture & Cost Governance', queries: ['aws', 'cloud-computing'], tags: ['Cloud'] }
        ]
      }
    ]
  },
  {
    id: 'android',
    slug: 'android',
    title: 'Android & Mobile Engineering',
    category: 'Mobile Development',
    badge: 'Mobile',
    description: 'Build high-performance, modern Android applications using Kotlin, Jetpack Compose, Coroutines, and clean MVVM/MVI architectures.',
    stages: [
      {
        id: 'an-p1',
        phaseNumber: 1,
        title: 'Kotlin & Android Core',
        subtitle: 'Modern syntax, Activity lifecycle, and Android fundamentals',
        color: 'amber',
        topics: [
          { id: 'an-kotlin', title: 'Kotlin Language Mastery (Null Safety, Lambdas)', queries: ['kotlin'], tags: ['Language'] },
          { id: 'an-activity', title: 'Activity Lifecycle & Intent Navigation', queries: ['activity-lifecycle', 'activity'], tags: ['Android Core'] },
          { id: 'an-manifest', title: 'Android Manifest, Permissions & App Sandbox', queries: ['manifest', 'permissions'], tags: ['Security'] },
          { id: 'an-git', title: 'Git & Mobile Version Control', queries: ['git', 'github'], tags: ['VCS'] }
        ]
      },
      {
        id: 'an-p2',
        phaseNumber: 2,
        title: 'Jetpack Compose & Modern UI',
        subtitle: 'Declarative UI, State hoisting, and Material Design 3',
        color: 'blue',
        topics: [
          { id: 'an-compose', title: 'Jetpack Compose Fundamentals & Layouts', queries: ['compose', 'ui'], tags: ['Declarative UI'] },
          { id: 'an-state', title: 'State Hoisting & Recomposition Optimization', queries: ['state', 'compose'], tags: ['State'] },
          { id: 'an-material', title: 'Material Design 3 & Dynamic Theming', queries: ['material-design', 'theme'], tags: ['Design'] },
          { id: 'an-nav', title: 'Navigation Compose & Deep Links', queries: ['navigation', 'compose'], tags: ['Navigation'] }
        ]
      },
      {
        id: 'an-p3',
        phaseNumber: 3,
        title: 'Architecture, Coroutines & Flow',
        subtitle: 'Asynchronous streams and scalable layered architecture',
        color: 'emerald',
        topics: [
          { id: 'an-coroutines', title: 'Kotlin Coroutines & Structured Concurrency', queries: ['coroutines', 'asynchrony'], tags: ['Concurrency'] },
          { id: 'an-flow', title: 'Kotlin Flow (StateFlow & SharedFlow)', queries: ['flow', 'coroutines'], tags: ['Reactive'] },
          { id: 'an-mvvm', title: 'Clean Architecture & MVVM / MVI', queries: ['architecture', 'mvvm'], tags: ['Patterns'] },
          { id: 'an-di', title: 'Dependency Injection with Hilt / Koin', queries: ['dependency-injection', 'hilt'], tags: ['DI'] }
        ]
      },
      {
        id: 'an-p4',
        phaseNumber: 4,
        title: 'Networking & Local Persistence',
        subtitle: 'Retrofit, Room SQLite database, and offline-first syncing',
        color: 'purple',
        topics: [
          { id: 'an-room', title: 'Room Database & SQLite Migrations', queries: ['room', 'database'], tags: ['Storage'] },
          { id: 'an-retrofit', title: 'Retrofit, OkHttp & JSON Serialization', queries: ['retrofit', 'networking'], tags: ['Network'] },
          { id: 'an-datastore', title: 'DataStore Preferences & Key-Value Storage', queries: ['datastore', 'preferences'], tags: ['Preferences'] },
          { id: 'an-workmanager', title: 'Background Tasks with WorkManager', queries: ['workmanager', 'services'], tags: ['Background'] }
        ]
      },
      {
        id: 'an-p5',
        phaseNumber: 5,
        title: 'Testing, Performance & Play Store',
        subtitle: 'Unit tests, Compose preview, profiling and publishing',
        color: 'rose',
        topics: [
          { id: 'an-testing', title: 'Unit Testing & Compose UI Tests', queries: ['testing', 'unit-testing'], tags: ['Testing'] },
          { id: 'an-perf', title: 'Memory Leaks & Android Studio Profiler', queries: ['performance', 'optimization'], tags: ['Profiling'] },
          { id: 'an-security', title: 'Android Keystore & ProGuard/R8 Obfuscation', queries: ['security', 'keystore'], tags: ['Hardening'] },
          { id: 'an-release', title: 'App Bundles (AAB) & Google Play Console', queries: ['deployment', 'release'], tags: ['Publishing'] }
        ]
      }
    ]
  },
  {
    id: 'system-design',
    slug: 'system-design',
    title: 'System Design & Architecture',
    category: 'Architecture',
    badge: 'Advanced',
    description: 'Architect planetary-scale distributed systems, master caching layers, database partitioning, event-driven architectures, and high availability.',
    stages: [
      {
        id: 'sd-p1',
        phaseNumber: 1,
        title: 'Distributed System Fundamentals',
        subtitle: 'CAP theorem, PACELC, network latency and throughput',
        color: 'amber',
        topics: [
          { id: 'sd-cap', title: 'CAP Theorem & PACELC Trade-offs', queries: ['cap-theorem', 'system-design'], tags: ['Theory'] },
          { id: 'sd-latency', title: 'Latency vs. Throughput & Bottleneck Analysis', queries: ['latency', 'performance'], tags: ['Metrics'] },
          { id: 'sd-lb', title: 'Load Balancing Algorithms (L4 vs. L7)', queries: ['load-balancing', 'load-balancer'], tags: ['Routing'] },
          { id: 'sd-dns', title: 'DNS Resolution, Anycast & Global Server Load Balancing', queries: ['dns', 'networking'], tags: ['DNS'] }
        ]
      },
      {
        id: 'sd-p2',
        phaseNumber: 2,
        title: 'Database Scaling & Partitioning',
        subtitle: 'Sharding, replication, read replicas and consistency',
        color: 'emerald',
        topics: [
          { id: 'sd-sharding', title: 'Database Sharding & Consistent Hashing', queries: ['sharding', 'database'], tags: ['Scaling'] },
          { id: 'sd-replication', title: 'Leader-Follower Replication & Quorums', queries: ['replication', 'database'], tags: ['Consistency'] },
          { id: 'sd-rdbms-nosql', title: 'RDBMS vs. NoSQL (Key-Value, Wide-Column, Graph)', queries: ['nosql', 'sql'], tags: ['Storage'] },
          { id: 'sd-indexes', title: 'B-Trees, LSM-Trees & Inverted Indexes', queries: ['indexing', 'database'], tags: ['Storage Engines'] }
        ]
      },
      {
        id: 'sd-p3',
        phaseNumber: 3,
        title: 'Caching Strategies & Content Delivery',
        subtitle: 'Eviction policies, Redis clusters, and edge caching',
        color: 'blue',
        topics: [
          { id: 'sd-cache-strat', title: 'Cache Strategies (Write-Through, Write-Back, Cache-Aside)', queries: ['caching', 'application-caching'], tags: ['Caching'] },
          { id: 'sd-redis-cluster', title: 'Redis Clustering & In-Memory Architectures', queries: ['redis', 'caching'], tags: ['In-Memory'] },
          { id: 'sd-cdn', title: 'CDN Edge Caching & Cache Invalidation', queries: ['cdn', 'caching'], tags: ['Edge'] },
          { id: 'sd-stampede', title: 'Thundering Herd & Cache Stampede Mitigation', queries: ['caching', 'performance'], tags: ['Resiliency'] }
        ]
      },
      {
        id: 'sd-p4',
        phaseNumber: 4,
        title: 'Asynchronous & Event-Driven Systems',
        subtitle: 'Message queues, pub/sub, Saga pattern and idempotency',
        color: 'purple',
        topics: [
          { id: 'sd-queues', title: 'Message Queues (Kafka vs. RabbitMQ vs. SQS)', queries: ['kafka', 'message-brokers'], tags: ['Messaging'] },
          { id: 'sd-idempotency', title: 'Idempotency & Exactly-Once Semantics', queries: ['idempotency', 'api-design'], tags: ['Reliability'] },
          { id: 'sd-saga', title: 'Distributed Transactions & Saga Pattern', queries: ['architectural-patterns', 'microservices'], tags: ['Transactions'] },
          { id: 'sd-rate-limit', title: 'Rate Limiting Algorithms (Token Bucket, Leaky Bucket)', queries: ['rate-limiting', 'security'], tags: ['Traffic Control'] }
        ]
      },
      {
        id: 'sd-p5',
        phaseNumber: 5,
        title: 'Resiliency, Security & Real-World Case Studies',
        subtitle: 'Circuit breakers, chaos engineering, and planetary architectures',
        color: 'rose',
        topics: [
          { id: 'sd-circuit-breaker', title: 'Circuit Breaker Pattern & Graceful Degradation', queries: ['circuit-breaker', 'resiliency'], tags: ['Resiliency'] },
          { id: 'sd-disaster', title: 'Multi-Region Failover & Disaster Recovery', queries: ['high-availability', 'disaster-recovery'], tags: ['Availability'] },
          { id: 'sd-case-url', title: 'Case Study: Designing TinyURL & Pastebin', queries: ['system-design', 'api-design'], tags: ['Case Study'] },
          { id: 'sd-case-chat', title: 'Case Study: Designing Real-Time Chat & Feed Systems', queries: ['system-design', 'websockets'], tags: ['Case Study'] }
        ]
      }
    ]
  },
  {
    id: 'python',
    slug: 'python',
    title: 'Python Developer',
    category: 'Software Engineering',
    badge: 'Versatile',
    description: 'From syntax fundamentals, OOP, and async IO to building high-throughput FastAPI microservices and data pipelines.',
    stages: [
      {
        id: 'py-p1',
        phaseNumber: 1,
        title: 'Python Core & Syntax',
        subtitle: 'Data types, control flow, functions, and list comprehensions',
        color: 'amber',
        topics: [
          { id: 'py-basics', title: 'Syntax, Variables, Types & Memory Model', queries: ['basic-syntax', 'python'], tags: ['Basics'] },
          { id: 'py-datastruct', title: 'Lists, Tuples, Dictionaries & Sets', queries: ['arrays-and-linked-lists', 'data-structures'], tags: ['Data Structures'] },
          { id: 'py-functions', title: 'Functions, Decorators, *args & **kwargs', queries: ['functions', 'decorators'], tags: ['Functions'] },
          { id: 'py-git', title: 'Git & Virtual Environments (uv, poetry, venv)', queries: ['git', 'package-management'], tags: ['Environment'] }
        ]
      },
      {
        id: 'py-p2',
        phaseNumber: 2,
        title: 'OOP, Functional & Async IO',
        subtitle: 'Classes, dunder methods, generators and asyncio event loops',
        color: 'blue',
        topics: [
          { id: 'py-oop', title: 'Object-Oriented Python (Inheritance, Dunder Methods)', queries: ['oop', 'classes'], tags: ['OOP'] },
          { id: 'py-generators', title: 'Iterators, Generators & Context Managers', queries: ['generators', 'iterators'], tags: ['Memory'] },
          { id: 'py-async', title: 'Asyncio, Coroutines & Event Loops', queries: ['asynchrony', 'asyncio'], tags: ['Concurrency'] },
          { id: 'py-typing', title: 'Type Hints & Pydantic Data Validation', queries: ['types', 'pydantic'], tags: ['Types'] }
        ]
      },
      {
        id: 'py-p3',
        phaseNumber: 3,
        title: 'Web Frameworks & APIs',
        subtitle: 'FastAPI, Django ORM, REST, and WebSockets',
        color: 'emerald',
        topics: [
          { id: 'py-fastapi', title: 'FastAPI, OpenAPI & Dependency Injection', queries: ['fastapi', 'rest'], tags: ['Web API'] },
          { id: 'py-django', title: 'Django, MTV Pattern & Admin Console', queries: ['django'], tags: ['Framework'] },
          { id: 'py-sql', title: 'SQLAlchemy ORM & Database Migrations (Alembic)', queries: ['sql', 'database'], tags: ['Database'] },
          { id: 'py-auth', title: 'JWT Authentication & OAuth2 in Python', queries: ['authentication', 'auth'], tags: ['Security'] }
        ]
      },
      {
        id: 'py-p4',
        phaseNumber: 4,
        title: 'Testing, Quality & Tooling',
        subtitle: 'Pytest, mocking, linting (Ruff), and CI workflows',
        color: 'purple',
        topics: [
          { id: 'py-pytest', title: 'Unit Testing with Pytest & Fixtures', queries: ['testing', 'pytest'], tags: ['Testing'] },
          { id: 'py-ruff', title: 'Formatting & Linting with Ruff & Black', queries: ['linting', 'formatting'], tags: ['Code Quality'] },
          { id: 'py-docker', title: 'Dockerizing Python Apps & Multi-stage Builds', queries: ['docker', 'containers'], tags: ['Containers'] },
          { id: 'py-celery', title: 'Background Tasks with Celery & Redis', queries: ['redis', 'caching'], tags: ['Background Jobs'] }
        ]
      },
      {
        id: 'py-p5',
        phaseNumber: 5,
        title: 'Production Deployment & Data',
        subtitle: 'Gunicorn, Uvicorn workers, cloud hosting, and data stacks',
        color: 'rose',
        topics: [
          { id: 'py-production', title: 'Production Deployments (Uvicorn + Gunicorn)', queries: ['deployment', 'production'], tags: ['Deployment'] },
          { id: 'py-data', title: 'Data Processing with Polars & Pandas', queries: ['pandas', 'data-analysis'], tags: ['Data Engineering'] },
          { id: 'py-cloud', title: 'Serverless Python (AWS Lambda, Cloud Run)', queries: ['aws', 'cloud-computing'], tags: ['Serverless'] },
          { id: 'py-security', title: 'Security Best Practices & Vulnerability Audits', queries: ['security'], tags: ['Security'] }
        ]
      }
    ]
  },
  {
    id: 'cyber-security',
    slug: 'cyber-security',
    title: 'Cyber Security & Defense',
    category: 'Security',
    badge: 'Crucial',
    description: 'Learn modern security principles, web application security (OWASP Top 10), network defense, cryptography, and cloud hardening.',
    stages: [
      {
        id: 'sec-p1',
        phaseNumber: 1,
        title: 'Security Foundations & Networking',
        subtitle: 'CIA triad, OSI model, packet analysis and Wireshark',
        color: 'amber',
        topics: [
          { id: 'sec-cia', title: 'Confidentiality, Integrity & Availability (CIA Triad)', queries: ['security', 'cyber-security'], tags: ['Foundations'] },
          { id: 'sec-net', title: 'Network Protocols & Packet Sniffing (Wireshark)', queries: ['network-engineer', 'networking'], tags: ['Networking'] },
          { id: 'sec-crypto', title: 'Cryptography: Hashing, Symmetric vs. Asymmetric Encryption', queries: ['security', 'cryptography'], tags: ['Cryptography'] },
          { id: 'sec-linux', title: 'Linux Hardening, File Permissions & Sudoers', queries: ['linux', 'permissions'], tags: ['OS Hardening'] }
        ]
      },
      {
        id: 'sec-p2',
        phaseNumber: 2,
        title: 'Web Application Security & OWASP',
        subtitle: 'SQL injection, XSS, CSRF, SSRF and broken auth',
        color: 'blue',
        topics: [
          { id: 'sec-owasp', title: 'OWASP Top 10 Web Vulnerabilities Overview', queries: ['security', 'owasp'], tags: ['OWASP'] },
          { id: 'sec-sqli', title: 'SQL Injection (SQLi) & Parameterized Queries', queries: ['sql', 'security'], tags: ['Injection'] },
          { id: 'sec-xss', title: 'Cross-Site Scripting (XSS) & Content Security Policy (CSP)', queries: ['security', 'cors'], tags: ['Client Security'] },
          { id: 'sec-auth-vuln', title: 'Broken Authentication, Session Fixation & JWT Attacks', queries: ['authentication', 'auth'], tags: ['Identity'] }
        ]
      },
      {
        id: 'sec-p3',
        phaseNumber: 3,
        title: 'Penetration Testing & Tools',
        subtitle: 'Port scanning, Burp Suite, Nmap and vulnerability scanning',
        color: 'emerald',
        topics: [
          { id: 'sec-nmap', title: 'Network Reconnaissance & Port Scanning (Nmap)', queries: ['networking', 'security'], tags: ['Recon'] },
          { id: 'sec-burp', title: 'Web Proxy & Interception (Burp Suite)', queries: ['security', 'testing'], tags: ['Proxy'] },
          { id: 'sec-apisec', title: 'API Security Testing & BOLA/BFLA Flaws', queries: ['api-design', 'security'], tags: ['API Security'] },
          { id: 'sec-metasploit', title: 'Exploit Frameworks & Proof-of-Concept Testing', queries: ['security'], tags: ['Exploits'] }
        ]
      },
      {
        id: 'sec-p4',
        phaseNumber: 4,
        title: 'Cloud Security & DevSecOps',
        subtitle: 'IAM least privilege, container scanning, and secret management',
        color: 'purple',
        topics: [
          { id: 'sec-iam', title: 'Cloud IAM & Least Privilege Policies', queries: ['aws', 'security'], tags: ['Cloud IAM'] },
          { id: 'sec-secrets', title: 'Secrets Management (HashiCorp Vault, AWS Secrets Manager)', queries: ['devsecops', 'security'], tags: ['Secrets'] },
          { id: 'sec-containers', title: 'Container Security & Image Vulnerability Scanning', queries: ['docker', 'security'], tags: ['Containers'] },
          { id: 'sec-sast', title: 'SAST / DAST Code Scanners in CI/CD', queries: ['devsecops', 'testing'], tags: ['CI/CD Security'] }
        ]
      },
      {
        id: 'sec-p5',
        phaseNumber: 5,
        title: 'Incident Response & Threat Intelligence',
        subtitle: 'SIEM, log analysis, threat modeling, and red/blue teaming',
        color: 'rose',
        topics: [
          { id: 'sec-threat-modeling', title: 'Threat Modeling (STRIDE & DREAD frameworks)', queries: ['security'], tags: ['Threat Modeling'] },
          { id: 'sec-siem', title: 'SIEM & Security Log Analysis', queries: ['logging', 'monitoring'], tags: ['SIEM'] },
          { id: 'sec-incident', title: 'Incident Response & Forensics Fundamentals', queries: ['security'], tags: ['Incident Response'] },
          { id: 'sec-zero-trust', title: 'Zero Trust Architecture Principles', queries: ['security', 'network-engineer'], tags: ['Zero Trust'] }
        ]
      }
    ]
  }
];

function buildCurricula() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('Building clean curricula with local topics...');
  const manifest = [];

  for (const trackDef of TRACK_DEFINITIONS) {
    console.log(`Processing track: ${trackDef.title}...`);

    let totalTrackTopics = 0;
    const enrichedStages = [];

    for (const stage of trackDef.stages) {
      const enrichedTopics = [];

      for (let i = 0; i < stage.topics.length; i++) {
        const topicDef = stage.topics[i];
        totalTrackTopics++;

        // Attempt to find matching markdown file locally
        const localData = findLocalTopic(trackDef.slug, topicDef.queries) || 
                          findLocalTopic('frontend', topicDef.queries) ||
                          findLocalTopic('backend', topicDef.queries);

        const title = topicDef.title;
        const description = localData?.description || 
          `Comprehensive technical guide and engineering practices for mastering ${title}. Explore the curated video tutorials, official documentation, and deep-dive references below to build production competency.`;
        
        const resources = localData?.resources || [
          {
            type: 'article',
            title: `Engineering Guide: ${title}`,
            url: `https://developer.mozilla.org/`
          }
        ];

        enrichedTopics.push({
          id: topicDef.id,
          title,
          slug: topicDef.id,
          description,
          stageId: stage.id,
          stageName: stage.title,
          stageColor: stage.color,
          order: i + 1,
          tags: topicDef.tags,
          resources
        });
      }

      enrichedStages.push({
        id: stage.id,
        phaseNumber: stage.phaseNumber,
        title: stage.title,
        subtitle: stage.subtitle,
        color: stage.color,
        topics: enrichedTopics
      });
    }

    const trackData = {
      id: trackDef.id,
      slug: trackDef.slug,
      title: trackDef.title,
      category: trackDef.category,
      badge: trackDef.badge,
      description: trackDef.description,
      totalTopics: totalTrackTopics,
      stages: enrichedStages
    };

    fs.writeFileSync(
      path.join(OUTPUT_DIR, `${trackDef.slug}.json`),
      JSON.stringify(trackData, null, 2)
    );

    manifest.push({
      slug: trackDef.slug,
      title: trackDef.title,
      category: trackDef.category,
      badge: trackDef.badge,
      description: trackDef.description,
      totalTopics: totalTrackTopics,
      stageCount: trackDef.stages.length
    });
  }

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  console.log(`Successfully compiled ${manifest.length} clean curricula into ${OUTPUT_DIR}/!`);
}

buildCurricula();

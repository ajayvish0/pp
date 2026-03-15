import {
  
  Cpu,
  
  Palette,
   
  Globe,
  
  Activity,
  
  FileCode2,
   
  Bell,
  ShieldCheck,
  
  Building2,
  type LucideIcon,
} from "lucide-react";

import { type Project } from "@/types";

// ─── Categories ───────────────────────────────────────────────────────────────

export const CATEGORIES = [
  "All",
  "Full Stack",
  "Backend Systems",
  "AI Systems",
] as const;

// ─── Project Data ─────────────────────────────────────────────────────────────

export const PROJECTS: Project[] = [
  // ── Featured (homepage) ─────────────────────────────────────────────────────
  {
    slug: "team-sketch",
    title: "TeamSketch",
    category: "Full Stack",
    tag: "Real-time Collaboration",
    description:
      "High-performance collaborative whiteboard application with real-time multi-user interaction, advanced drawing tools, and WebSocket communication.",
    tech: ["React.js", "Socket.io", "Node.js", "Tailwind CSS"],
    year: "2024",
    annotation: "Aug 2024",
    href: "/projects/team-sketch",
    image: "/projects/teamsketch.png",
    githubUrl: "https://github.com/ajayvish0/teamsketch", // Derived/Placeholder if not exact in resume, but I'll use what's available
    liveUrl: "https://collaoboard.netlify.app/",
    icon: Palette,
    stat: { label: "Productivity boost", value: "35%" },
    featured: true,
  },
  {
    slug: "paytm-clone",
    title: "Paytm Clone",
    category: "Backend Systems",
    tag: "Fintech Application",
    description:
      "Secure fintech application featuring user authentication via NextAuth and onramp transaction functionality. Implements real-time balance updates and transaction history.",
    tech: ["Next.js", "Express.js", "PostgreSQL", "Turborepo", "Tailwind CSS", "NextAuth"],
    year: "2024",
    annotation: "Jun 2024",
    href: "/projects/paytm-clone",
    image: "/projects/paytm.png",
    githubUrl: "https://github.com/ajayvish0/PaytmV2",
    icon: Activity,
    stat: { label: "Security increase", value: "95%" },
    featured: true,
  },
  {
    slug: "pdf-chat",
    title: "PDF-Chat Application",
    category: "AI Systems",
    tag: "NLP Parsing",
    description:
      "Full-stack PDF chat application using FastAPI, React.js, and PostgreSQL. Integrated LangChain for NLP processing and Google Drive API for secure storage (50MB+).",
    tech: ["FastAPI", "React.js", "PostgreSQL", "LangChain", "Google Drive API"],
    year: "2024",
    annotation: "May 2024",
    href: "/projects/pdf-chat",
    image: "/projects/pdfchat.png",
    liveUrl: "https://pachat.netlify.app/",
    icon: FileCode2,
    stat: { label: "Query time reduced", value: "40%" },
    featured: true,
  },
  {
    slug: "medium-clone",
    title: "Medium Blog Clone",
    category: "Full Stack",
    tag: "Content Platform",
    description:
      "Responsive blog platform with secure authentication and optimized API. Achieved significant load time reductions and cross-device consistency using Tailwind CSS.",
    tech: ["React.js", "Node.js", "PostgreSQL", "Tailwind CSS", "Workers"],
    year: "2024",
    annotation: "Mar 2024",
    href: "/projects/medium-clone",
    image: "/projects/medium.png",
    liveUrl: "https://medium20-m79mgvdui-ajay-vishwakarmas-projects.vercel.app/",
    icon: Globe,
    stat: { label: "Load time boost", value: "35%" },
    featured: true,
  },
  {
    slug: "twilio-notifier",
    title: "Twilio Notifier",
    category: "Full Stack",
    tag: "Comm-Systems",
    description:
      "Automated voice notification system with real-time call state tracking (completed, busy, failed). Features a React dashboard for managing outbound communications via Twilio API.",
    tech: ["Node.js", "Express", "MongoDB", "Twilio API", "React"],
    year: "2025",
    annotation: "Jan 2025",
    href: "https://github.com/ajayvish0/twilio-notifier-fullstack",
    image: "/projects/twilio.png",
    githubUrl: "https://github.com/ajayvish0/twilio-notifier-fullstack",
    icon: Bell,
    stat: { label: "Call states tracked", value: "5+" },
    featured: false,
  },
  {
    slug: "nagraj-associates",
    title: "Nagraj Associates",
    category: "Full Stack",
    tag: "Business Systems",
    description:
      "Professional corporate platform for an architectural firm. Express-based contact handling and high-fidelity service showcases.",
    tech: ["Node.js", "Express", "Bootstrap", "JavaScript"],
    year: "2025",
    annotation: "Feb 2025",
    href: "https://nagarajassociates.onrender.com",
    image: "/projects/nagraj.png",
    githubUrl: "https://github.com/ajayvish0/nagraj",
    liveUrl: "https://nagarajassociates.onrender.com",
    icon: Building2,
    stat: { label: "Manual processing", value: "-70%" },
    featured: false,
  },
  {
    slug: "leadlly-api",
    title: "Leadlly API Infrastructure",
    category: "Backend Systems",
    tag: "API Architecture",
    description:
      "Robust backend infrastructure featuring secure JWT authentication and rigorous schema validation with Zod. Modular architecture designed for high-performance and scalability.",
    tech: ["Node.js", "Express", "MongoDB", "JWT", "Zod"],
    year: "2024",
    annotation: "Dec 2024",
    href: "https://github.com/ajayvish0/Leadlly-Assignment",
    image: "/projects/leadlly.png",
    githubUrl: "https://github.com/ajayvish0/Leadlly-Assignment",
    icon: ShieldCheck,
    stat: { label: "Security reliability", value: "+50%" },
    featured: false,
  },
  {
    slug: "systemic-clone",
    title: "Systemic App Clone",
    category: "Full Stack",
    tag: "Social Connect",
    description:
      "Modern full-stack application featuring advanced server-state management with TanStack Query and Appwrite integration. Radix UI components.",
    tech: ["React", "Appwrite", "TanStack Query", "Radix UI", "shadcn/ui"],
    year: "2024",
    annotation: "Nov 2024",
    href: "https://github.com/ajayvish0/CloneApp",
    image: "/projects/social_app.png",
    githubUrl: "https://github.com/ajayvish0/CloneApp",
    icon: Cpu,
    stat: { label: "CI/CD Workflows", value: "Active" },
    featured: false,
  },
];

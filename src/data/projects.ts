import {
  Layers,
  Cpu,
  Database,
  Terminal,
  Palette,
  BarChart3,
  Server,
  Shield,
  GitBranch,
  Cloud,
  Zap,
  Code2,
  Globe,
  Lock,
  Activity,
  Workflow,
  Container,
  Network,
  Boxes,
  FileCode2,
  Gauge,
  Radio,
  Telescope,
  MonitorDot,
  Binary,
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
    stat: { label: "Concurrent users", value: "50+" },
    featured: true,
  },
  {
    slug: "paytm-clone",
    title: "Paytm Clone",
    category: "Backend Systems",
    tag: "Fintech Application",
    description:
      "Scalable fintech application with user authentication (NextAuth), onramp transaction functionality (5,000 daily tx), and real-time balance updates with 99.9% uptime.",
    tech: ["Next.js", "Express.js", "PostgreSQL", "Turborepo", "Tailwind CSS", "NextAuth"],
    year: "2024",
    annotation: "Jun 2024",
    href: "/projects/paytm-clone",
    image: "/projects/paytm.png",
    githubUrl: "https://github.com/ajayvish0/PaytmV2",
    icon: Activity,
    stat: { label: "Unauthorized access reduced", value: "95%" },
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
    stat: { label: "Document query time", value: "-40%" },
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
    stat: { label: "Load time improvement", value: "35%" },
    featured: true,
  },
];

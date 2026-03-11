import {
  Server, Zap, Layers, Terminal, Code2, Cpu, Database, Layout, BarChart2, Flame, Edit3, Clock, Cloud, Container, RotateCcw, Shield, GitBranch, RefreshCw, Triangle, Box, Wind, FileType, Play, Activity, Palette, Radio, FileCode2, Binary
} from "lucide-react";

export const DOMAINS = [
  {
    index: "01",
    title: "Backend Systems",
    descriptor: "Server Architecture & API Design",
    depth: "Production-grade distributed systems with sub-100ms response targets",
    techs: [
      { label: "Node.js", Icon: Server },
      { label: "Express", Icon: Zap },
      { label: "NestJS", Icon: Layers },
      { label: "FastAPI", Icon: Terminal },
      { label: "Python", Icon: Code2 },
    ],
  },
  {
    index: "02",
    title: "Front-end Systems",
    descriptor: "Interface Systems & Interaction Layer",
    depth: "User-centric architectures with Redux, Recoil and Tailwind CSS",
    techs: [
      { label: "React.js", Icon: RefreshCw },
      { label: "Next.js", Icon: Triangle },
      { label: "Redux", Icon: Box },
      { label: "Recoil", Icon: Activity },
      { label: "Tailwind CSS", Icon: Wind },
      { label: "TypeScript", Icon: FileType },
    ],
  },
  {
    index: "03",
    title: "Languages & Matrix",
    descriptor: "Programming Foundations",
    depth: "Core engineering logic in high-level and system languages",
    techs: [
      { label: "TypeScript", Icon: FileCode2 },
      { label: "JavaScript", Icon: Binary },
      { label: "C/C++", Icon: Cpu },
      { label: "SQL", Icon: Database },
      { label: "HTML/CSS", Icon: Layout },
    ],
  },
  {
    index: "04",
    title: "Data & Storage",
    descriptor: "Caching & Query Optimization",
    depth: "Schema design and transactional synchronization at scale",
    techs: [
      { label: "MongoDB", Icon: Database },
      { label: "PostgreSQL", Icon: Layout },
      { label: "MySQL", Icon: BarChart2 },
      { label: "Firebase", Icon: Flame },
      { label: "Prisma ORM", Icon: Edit3 },
      { label: "Redis", Icon: Clock },
    ],
  },
  {
    index: "05",
    title: "DevOps & Tools",
    descriptor: "Deployment, Orchestration & Security",
    depth: "CI/CD pipelines with Git, Docker, and AWS infrastructure",
    techs: [
      { label: "AWS", Icon: Cloud },
      { label: "Docker", Icon: Container },
      { label: "Git", Icon: GitBranch },
      { label: "Cloudflare", Icon: Shield },
      { label: "Postman", Icon: Radio },
      { label: "Figma", Icon: Palette },
    ],
  },
] as const;

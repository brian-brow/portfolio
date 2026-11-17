// All of the site's copy lives here.

export type PageId = 'home' | 'projects' | 'experience' | 'playground' | 'writing' | 'post'
export const NAV: Exclude<PageId, 'post'>[] = ['home', 'projects', 'experience', 'playground']

export const EMAIL = 'brianbrown.bjb@gmail.com'

export const SOCIALS = {
  x: 'https://x.com/BrianBrown78',
  github: 'https://github.com/brian-brow',
  linkedin: 'https://www.linkedin.com/in/brian-brown-5a7aa2298/',
  youtube: 'https://www.youtube.com/@Brian-dm2wy',
}

export interface Entry { name: string; href?: string; desc: string; meta: string }

export const PROJECTS: Entry[] = [
  {
    name: 'Archive Vision',
    desc: 'Senior design project at UF: an archival document platform with handwritten text recognition and a RAG chatbot with ChromaDB vector search.',
    meta: 'FastAPI · Celery · Redis · ChromaDB · 2026',
  },
  {
    name: 'neural-net',
    href: 'https://github.com/brian-brow/neural-net',
    desc: 'A neural network in C++ with no ML or math libraries: custom tensor operations, ReLU and softmax layers, and mini-batch SGD backpropagation. 97.96% test accuracy on MNIST.',
    meta: 'C++ · 2026',
  },
  {
    name: 'bluer-bubbles',
    href: 'https://github.com/brian-brow/bluer-bubbles',
    desc: 'A Linux iMessage client. A Swift companion API on macOS reads and sends messages, and a Linux service syncs them over Tailscale into SQLite for a Tauri desktop app.',
    meta: 'Tauri · React · Swift · 2026',
  },
]

export const OPEN_SOURCE: Entry[] = [
  {
    name: 'Waybar',
    href: 'https://github.com/Alexays/Waybar/pull/5232',
    desc: "Diagnosed and fixed a bug where custom scroll actions silently overrode the user's enable-bar-scroll setting. Patch merged upstream.",
    meta: 'merged · C++ · 2026',
  },
]

export interface Job { org: string; roles: string[]; lines: string[] }

export const EXPERIENCE: Job[] = [
  {
    org: 'Loxahatchee River District',
    roles: ['Software Engineer · Jun 2026 – present', 'IT Intern · May 2025 – Jun 2026'],
    lines: [
      'React inventory platform that cut a 3,500-item count from a week of overtime to two days.',
      'PostgreSQL schema and Django backend for a replacement customer billing system.',
      'Took over two contractor-built AI vision apps and moved them to Azure Container Apps with CI/CD.',
      'Python ETL service syncing four third-party APIs into SQL Server daily.',
      'Raspberry Pi Pico firmware for remote monitoring of isolated pump stations.',
    ],
  },
  {
    org: 'Kratos Defense & Security Solutions',
    roles: ['Digital Engineering Intern · May – Aug 2023'],
    lines: ['Performance calculations in a C++ steady-state engine model, and Cameo models to find optimal inputs for a candidate turbojet engine.'],
  },
]

export const EDUCATION: Job[] = [
  { org: 'University of Florida', roles: ['B.S. Computer Science · May 2026'], lines: ['GPA 3.66'] },
]

export interface Post { slug: string; date: string; title: string; summary: string; body: string[] }

// Newest first. body is a list of paragraphs.
export const POSTS: Post[] = [
  {
    slug: 'new-website',
    date: 'Sep 30, 2026',
    title: 'New website',
    summary: "Websites are fun..",
    body: [
      "Websites are fun. I think this skeleton is quite beautiful.",
    ],
  },
]

// What the skull might say when a tab opens (one picked at random, half the time).
export const SAY_CHANCE = 0.5
export const SAYINGS: Partial<Record<PageId, string[]>> = {
  projects: ['wow!'],
  playground: ['This was more impressive before ai', 'I love sand'],
}

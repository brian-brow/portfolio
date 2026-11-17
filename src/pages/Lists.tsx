import { EDUCATION, EXPERIENCE, OPEN_SOURCE, POSTS, PROJECTS, type Entry, type Job } from '../content'

function EntryItem({ e }: { e: Entry }) {
  return (
    <li className="item">
      {e.href ? <a className="item-title" href={e.href}>{e.name}</a> : <span className="item-title">{e.name}</span>}
      <span className="item-desc">{e.desc}</span>
      <span className="item-meta">{e.meta}</span>
    </li>
  )
}

function JobItem({ j }: { j: Job }) {
  return (
    <li className="item">
      <span className="item-title">{j.org}</span>
      {j.roles.map((r) => <span key={r} className="item-meta">{r}</span>)}
      {j.lines.map((l) => <span key={l} className="item-desc">{l}</span>)}
    </li>
  )
}

export function Projects() {
  return (
    <div className="stack">
      <h1 className="heading">projects</h1>
      <div className="fade-scroll">
        <ul className="list">{PROJECTS.map((e) => <EntryItem key={e.name} e={e} />)}</ul>
        <h2 className="subheading">open source</h2>
        <ul className="list">{OPEN_SOURCE.map((e) => <EntryItem key={e.name} e={e} />)}</ul>
      </div>
    </div>
  )
}

export function Experience() {
  return (
    <div className="stack">
      <h1 className="heading">experience</h1>
      <div className="fade-scroll">
        <ul className="list">{EXPERIENCE.map((j) => <JobItem key={j.org} j={j} />)}</ul>
        <h2 className="subheading">education</h2>
        <ul className="list">{EDUCATION.map((j) => <JobItem key={j.org} j={j} />)}</ul>
      </div>
    </div>
  )
}

export function Writing({ onOpen }: { onOpen: (i: number) => void }) {
  return (
    <div className="stack">
      <h1 className="heading">writing</h1>
      <div className="fade-scroll">
        <ul className="list">
          {POSTS.map((p, i) => (
            <li key={p.slug} className="item">
              <span className="item-meta">{p.date}</span>
              <button type="button" className="item-title postlink" onClick={() => onOpen(i)}>{p.title}</button>
              <span className="item-desc">{p.summary}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function Post({ index, onBack }: { index: number; onBack: () => void }) {
  const p = POSTS[index] ?? POSTS[0]
  return (
    <div className="stack post">
      <button type="button" className="navlink back" onClick={onBack}>← writing</button>
      <span className="item-meta">{p.date}</span>
      <h1 className="heading">{p.title}</h1>
      <div className="fade-scroll post-body">
        {p.body.map((t, i) => <p key={i}>{t}</p>)}
      </div>
    </div>
  )
}

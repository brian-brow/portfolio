import { NAV, type PageId } from '../content'

interface Props {
  page: PageId
  light: boolean
  onPick: (id: PageId) => void
  onToggle: (e: React.MouseEvent<HTMLButtonElement>) => void
}

// Odd count: the middle section sits dead center on screen. Even count: the
// gap between the two middle sections does. The rest fan out either way.
const half = Math.floor(NAV.length / 2)
const middle = NAV.length % 2 ? NAV[half] : null
const before = NAV.slice(0, half)
const after = NAV.slice(middle ? half + 1 : half)

export function Nav({ page, light, onPick, onToggle }: Props) {
  const link = (id: (typeof NAV)[number]) => {
    const active = id === page || (id === 'writing' && page === 'post')
    return (
      <button key={id} type="button" className={active ? 'navlink active' : 'navlink'} aria-current={active ? 'page' : undefined} onClick={() => onPick(id)}>
        {id}
      </button>
    )
  }

  return (
    <>
      <nav className="nav" aria-label="Sections">
        <div className="nav-side left">{before.map(link)}</div>
        {middle && link(middle)}
        <div className="nav-side right">{after.map(link)}</div>
      </nav>
      <button type="button" className="theme" onClick={onToggle} aria-label={light ? 'Switch to dark mode' : 'Switch to light mode'}>
        {light ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
        )}
      </button>
    </>
  )
}

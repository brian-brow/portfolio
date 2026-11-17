import { useEffect, useRef } from 'react'
import type { Theme } from '../theme'

// Falling sand, ported from resume-website/src/play/sandsim.
// Cells are stored bottom-up (y = 0 is the floor). 0 = empty, 1 and 2 = the two sand colors.
const SCALE = 4 // px per grain
const BRUSH = 0.18 // brush diameter as a share of the zone's width
const SLIDE = 0.8 // chance a blocked grain slides diagonally

interface Grid { cols: number; rows: number; cells: Uint8Array }

function step(g: Grid) {
  const { cols: c, cells } = g
  for (let y = 1; y < g.rows; y++) {
    const rtl = Math.random() < 0.5 // creates some jank artifacts that look cool
    for (let xi = 0; xi < c; xi++) {
      const x = rtl ? c - 1 - xi : xi, i = y * c + x, v = cells[i]
      if (!v) continue
      const below = i - c
      if (!cells[below]) { cells[i] = 0; cells[below] = v; continue }
      const lf = x - 1 >= 0 && !cells[below - 1], rf = x + 1 < c && !cells[below + 1]
      if (lf && rf) { if (Math.random() < SLIDE) { cells[i] = 0; cells[Math.random() < 0.5 ? below - 1 : below + 1] = v } }
      else if (rf) { if (Math.random() < SLIDE) { cells[i] = 0; cells[below + 1] = v } }
      else if (lf) { if (Math.random() < SLIDE) { cells[i] = 0; cells[below - 1] = v } }
    }
  }
}

function spray(g: Grid, gx: number, gy: number, radius: number, n: number, add: boolean) {
  for (let k = 0; k < n; k++) {
    const a = Math.random() * Math.PI * 2, m = Math.random() * radius
    const x = Math.round(gx + Math.cos(a) * m), y = Math.round(gy + Math.sin(a) * m)
    if (x < 0 || x >= g.cols || y < 0 || y >= g.rows) continue
    const i = y * g.cols + x
    if (add && !g.cells[i]) g.cells[i] = 1 + Math.floor(Math.random() * 2)
    else if (!add && g.cells[i]) g.cells[i] = 0
  }
}

export function SandZone({ theme, active }: { theme: Theme; active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const grid = useRef<Grid | null>(null)
  const mouse = useRef<{ x: number; y: number } | null>(null)
  const pressed = useRef<0 | 2 | null>(null)
  const themeRef = useRef(theme)
  themeRef.current = theme

  useEffect(() => {
    if (!active) return
    let raf = 0
    const frame = () => {
      raf = requestAnimationFrame(frame)
      const cv = canvasRef.current
      if (!cv) return
      const W = cv.clientWidth, H = cv.clientHeight
      if (!W || !H) return
      if (cv.width !== W || cv.height !== H || !grid.current) {
        cv.width = W; cv.height = H
        const cols = Math.floor(W / SCALE), rows = Math.floor(H / SCALE), old = grid.current
        const cells = new Uint8Array(cols * rows)
        if (old) for (let y = 0; y < Math.min(rows, old.rows); y++) for (let x = 0; x < Math.min(cols, old.cols); x++) cells[y * cols + x] = old.cells[y * old.cols + x]
        grid.current = { cols, rows, cells }
      }
      const g = grid.current, ctx = cv.getContext('2d')!
      if (pressed.current !== null && mouse.current) {
        const gx = Math.floor(mouse.current.x / SCALE), gy = g.rows - 1 - Math.floor(mouse.current.y / SCALE)
        const radius = Math.floor(W * BRUSH / SCALE / 2)
        const f = (5 / SCALE) ** 2 // same pour volume as the original 5px grains
        spray(g, gx, gy, radius, Math.round((pressed.current === 0 ? 25 : 100) * f), pressed.current === 0)
      }
      step(g)
      const T = themeRef.current, colors = ['', T.name, T.muted]
      ctx.clearRect(0, 0, W, H)
      for (let y = 0; y < g.rows; y++) for (let x = 0; x < g.cols; x++) {
        const v = g.cells[y * g.cols + x]
        if (!v) continue
        ctx.fillStyle = colors[v]
        ctx.fillRect(x * SCALE, (g.rows - 1 - y) * SCALE, SCALE, SCALE)
      }
      if (mouse.current) {
        ctx.strokeStyle = T.name
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(mouse.current.x, mouse.current.y, Math.floor(W * BRUSH / SCALE) * SCALE / 2, 0, Math.PI * 2)
        ctx.stroke()
      }
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [active])

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  return (
    <div className="sand-zone" style={{ background: theme.zone }}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Falling sand: click and drag to pour, right-click to erase"
        onPointerDown={(e) => { pos(e); pressed.current = e.button === 2 ? 2 : 0; e.currentTarget.setPointerCapture?.(e.pointerId) }}
        onPointerMove={pos}
        onPointerUp={(e) => { pressed.current = null; if (e.pointerType === 'touch') mouse.current = null }}
        onPointerLeave={() => { mouse.current = null; pressed.current = null }}
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  )
}

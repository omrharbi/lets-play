import { useNavigate, useRouteError, isRouteErrorResponse } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import './ErrorPage.css'

const ERROR_MAP = {
  401: { code: '401', title: 'Unauthorized',   sub: 'You need to be logged in to access this page.',         icon: 'lock' },
  403: { code: '403', title: 'Forbidden',       sub: "You don't have permission to view this resource.",      icon: 'shield' },
  404: { code: '404', title: 'Not Found',       sub: "The page you're looking for doesn't exist.",            icon: 'search' },
  500: { code: '500', title: 'Server Error',    sub: 'Something went wrong on our end. Try again later.',     icon: 'warn' },
  503: { code: '503', title: 'Unavailable',     sub: 'The service is temporarily unavailable. Hold tight.',   icon: 'warn' },
}

/* ─── 3D-style icons ────────────────────────────────────────────────── */
function IconWarn() {
  return (
    <div className="ep-icon-wrap">
      <div className="ep-icon-shadow"/>
      <div className="ep-icon ep-icon-warn">
        <div className="ep-icon-face">
          <div className="ep-icon-inner">
            <div className="ep-exclaim">!</div>
          </div>
        </div>
        <div className="ep-icon-side-l"/>
        <div className="ep-icon-side-r"/>
        <div className="ep-icon-bottom"/>
        {/* decorative rings */}
        <div className="ep-ring ep-ring1"/>
        <div className="ep-ring ep-ring2"/>
      </div>
    </div>
  )
}

function IconLock() {
  return (
    <div className="ep-icon-wrap">
      <div className="ep-icon-shadow"/>
      <div className="ep-icon ep-icon-lock">
        <div className="ep-lock-body">
          <div className="ep-lock-hole"/>
        </div>
        <div className="ep-lock-shackle"/>
        <div className="ep-ring ep-ring1"/>
        <div className="ep-ring ep-ring2"/>
      </div>
    </div>
  )
}

function IconSearch() {
  return (
    <div className="ep-icon-wrap">
      <div className="ep-icon-shadow"/>
      <div className="ep-icon ep-icon-search">
        <div className="ep-search-circle"/>
        <div className="ep-search-handle"/>
        <div className="ep-search-x">?</div>
        <div className="ep-ring ep-ring1"/>
        <div className="ep-ring ep-ring2"/>
      </div>
    </div>
  )
}

function IconShield() {
  return (
    <div className="ep-icon-wrap">
      <div className="ep-icon-shadow"/>
      <div className="ep-icon ep-icon-shield">
        <div className="ep-shield-body">
          <div className="ep-shield-x">✕</div>
        </div>
        <div className="ep-ring ep-ring1"/>
        <div className="ep-ring ep-ring2"/>
      </div>
    </div>
  )
}

const ICONS = { warn: IconWarn, lock: IconLock, search: IconSearch, shield: IconShield }

export default function ErrorPage({ code: propCode, message: propMessage }) {
  const navigate   = useNavigate()
  const routeError = (() => { try { return useRouteError() } catch { return null } })()
  const canvasRef  = useRef(null)

  let status = propCode || 404
  if (isRouteErrorResponse?.(routeError)) status = routeError.status
  else if (routeError?.response?.status)  status = routeError.response.status

  const info = ERROR_MAP[status] || {
    code: String(status), title: 'Something went wrong',
    sub: propMessage || routeError?.message || 'An unexpected error occurred.', icon: 'warn',
  }

  const Icon = ICONS[info.icon] || IconWarn

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W = canvas.width  = canvas.offsetWidth
    let H = canvas.height = canvas.offsetHeight
    let raf

    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.5 + .4,
      dx: (Math.random() - .5) * .35,
      dy: (Math.random() - .5) * .35,
      o: Math.random() * .4 + .08,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(249,115,22,${p.o})`
        ctx.fill()
        p.x += p.dx; p.y += p.dy
        if (p.x < 0 || p.x > W) p.dx *= -1
        if (p.y < 0 || p.y > H) p.dy *= -1
      })
      raf = requestAnimationFrame(draw)
    }
    draw()

    const onResize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [])

  const handleBack = () => {
    if (status === 401 || status === 403) navigate('/login')
    else navigate(-1)
  }

  return (
    <div className="ep-root">
      <canvas ref={canvasRef} className="ep-canvas"/>
      <div className="ep-orb ep-orb1"/>
      <div className="ep-orb ep-orb2"/>
      <div className="ep-orb ep-orb3"/>
      <div className="ep-grid"/>

      <div className="ep-wrap">
        <Icon />

        <div className="ep-content">
          <div className="ep-badge">{info.code} Error</div>
          <h1 className="ep-title">{info.title}</h1>
          <p className="ep-sub">{info.sub}</p>

          <div className="ep-actions">
            <button className="ep-btn-primary" onClick={() => navigate('/')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Go home
            </button>
            <button className="ep-btn-ghost" onClick={handleBack}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Go back
            </button>
          </div>

          <div className="ep-meta">
            <span className="ep-meta-dot"/>
            Error code: <strong>{info.code}</strong>
            <span className="ep-meta-sep"/>
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
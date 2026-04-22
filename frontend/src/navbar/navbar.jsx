import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../CartContext'
import { isAdmin } from '../jwt/jwt'

const S = {
  nav: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', height:56, background:'#1a1a1a', borderBottom:'1px solid #2e2e2e', position:'sticky', top:0, zIndex:100 },
  logo: { fontSize:17, fontWeight:500, color:'#f97316', letterSpacing:'-.3px', textDecoration:'none' },
  links: { display:'flex', alignItems:'center', gap:4 },
  link: { padding:'6px 13px', borderRadius:7, fontSize:13, color:'#888780', cursor:'pointer', border:'none', background:'transparent', textDecoration:'none', transition:'all .15s' },
  linkActive: { color:'#f97316', background:'rgba(249,115,22,.08)' },
  right: { display:'flex', alignItems:'center', gap:10 },
  cartBtn: { position:'relative', width:36, height:36, borderRadius:8, background:'#222', border:'1px solid #2e2e2e', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'border-color .15s' },
  cartBadge: { position:'absolute', top:-6, right:-6, background:'#f97316', color:'#fff', fontSize:10, fontWeight:700, minWidth:18, height:18, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 4px', border:'2px solid #0f0f0f' },
  avatarBtn: { display:'flex', alignItems:'center', gap:8, padding:'5px 10px 5px 5px', borderRadius:8, background:'#222', border:'1px solid #2e2e2e', cursor:'pointer', position:'relative', transition:'border-color .15s' },
  avatar: { width:28, height:28, borderRadius:'50%', background:'#f97316', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:500, color:'#fff' },
  avatarName: { fontSize:12, color:'#f1f0e8' },
  dropdown: { position:'absolute', top:'calc(100% + 8px)', right:0, width:210, background:'#1a1a1a', border:'1px solid #2e2e2e', borderRadius:10, overflow:'hidden', zIndex:200 },
  ddHeader: { padding:'12px 14px', borderBottom:'1px solid #2e2e2e' },
  ddName: { fontSize:13, fontWeight:500, color:'#f1f0e8' },
  ddEmail: { fontSize:12, color:'#888780', marginTop:2 },
  ddItem: { display:'flex', alignItems:'center', gap:9, padding:'9px 14px', fontSize:13, color:'#888780', cursor:'pointer', textDecoration:'none' },
  ddSep: { height:1, background:'#2e2e2e', margin:'3px 0' },
  ddLogout: { display:'flex', alignItems:'center', gap:9, padding:'9px 14px', fontSize:13, color:'#E24B4A', cursor:'pointer' },
  authRow: { display:'flex', gap:8 },
  btnLogin: { padding:'7px 16px', borderRadius:8, background:'transparent', border:'1px solid #2e2e2e', color:'#888780', fontSize:13, cursor:'pointer', textDecoration:'none', display:'flex', alignItems:'center' },
  btnRegister: { padding:'7px 16px', borderRadius:8, background:'#f97316', color:'#fff', border:'none', fontSize:13, fontWeight:500, cursor:'pointer', textDecoration:'none', display:'flex', alignItems:'center' },
}

export default function Navbar() {
  const [ddOpen, setDdOpen] = useState(false)
  const navigate  = useNavigate()
  const location  = useLocation()
  const { totalCount } = useCart()

  const token    = localStorage.getItem('token')
  const user     = JSON.parse(localStorage.getItem('user') || '{}')
  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'
  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setDdOpen(false)
    navigate('/login')
  }

  const navLinks = [
    { label:'Home',        path:'/' },
    { label:'Products',    path:'/products' },
    { label:'My listings', path:'/my-listings' },
  ]
console.log(isAdmin(),"--------------");

  return (
    <nav style={S.nav}>
      <Link to="/" style={S.logo}>ShopPlay</Link>

      <div style={S.links}>
        {navLinks.map(l => (
          <Link key={l.path} to={l.path}
            style={{ ...S.link, ...(isActive(l.path) ? S.linkActive : {}) }}>
            {l.label}
          </Link>
        ))}
      </div>

      <div style={S.right}>

        {/* ─── cart ───────────────────────────────────────────────── */}
        <div style={S.cartBtn}
          onClick={() => navigate('/cart')}
          onMouseEnter={e => e.currentTarget.style.borderColor='#f97316'}
          onMouseLeave={e => e.currentTarget.style.borderColor='#2e2e2e'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="#888780" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          {totalCount > 0 && (
            <div style={S.cartBadge}>{totalCount > 99 ? '99+' : totalCount}</div>
          )}
        </div>

        {/* ─── guest ──────────────────────────────────────────────── */}
        {!token ? (
          <div style={S.authRow}>
            <Link to="/login"    style={S.btnLogin}>Login</Link>
            <Link to="/register" style={S.btnRegister}>Register</Link>
          </div>
        ) : (
          /* ─── logged in ─────────────────────────────────────────── */
          <div style={S.avatarBtn}
            onClick={() => setDdOpen(!ddOpen)}
            onMouseEnter={e => e.currentTarget.style.borderColor='#f97316'}
            onMouseLeave={e => { if (!ddOpen) e.currentTarget.style.borderColor='#2e2e2e' }}
          >
            <div style={S.avatar}>{initials}</div>
            <div style={S.avatarName}>{user.name?.split(' ')[0] || 'User'}</div>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="#888780" strokeWidth="2" strokeLinecap="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>

            {ddOpen && (
              <div style={S.dropdown} onClick={e => e.stopPropagation()}>
                <div style={S.ddHeader}>
                  <div style={S.ddName}>{user.name}</div>
                  <div style={S.ddEmail}>{user.email}</div>
                </div>

                <Link to="/profile"     style={S.ddItem} onClick={() => setDdOpen(false)}>👤 Profile</Link>
                <Link to="/my-products" style={S.ddItem} onClick={() => setDdOpen(false)}>📦 My products</Link>
                <Link to="/add-product" style={S.ddItem} onClick={() => setDdOpen(false)}>➕ Add product</Link>
                <Link to="/settings"    style={S.ddItem} onClick={() => setDdOpen(false)}>⚙️ Settings</Link>

                {isAdmin() && (
                  <Link to="/admin" style={{ ...S.ddItem, color:'#f97316' }} onClick={() => setDdOpen(false)}>
                    🛡 Admin panel
                  </Link>
                )}

                <div style={S.ddSep}/>
                <div style={S.ddLogout} onClick={handleLogout}>🚪 Logout</div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
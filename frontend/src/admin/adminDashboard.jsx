import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'
import { isAdmin } from '../jwt/jwt'

const S = {
  page: { minHeight:'100vh', background:'#0f0f0f', color:'#f1f0e8', display:'flex', flexDirection:'column' },
  topbar: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'13px 20px', background:'#1a1a1a', borderBottom:'1px solid #2e2e2e' },
  logo: { fontSize:16, fontWeight:500, color:'#f97316' },
  badge: { fontSize:11, background:'#f97316', color:'#fff', padding:'2px 7px', borderRadius:4, marginLeft:8 },
  layout: { display:'flex', flex:1 },
  sidebar: { width:180, background:'#1a1a1a', borderRight:'1px solid #2e2e2e', padding:'12px 0', flexShrink:0 },
  si: { display:'flex', alignItems:'center', gap:9, padding:'9px 16px', fontSize:13, color:'#888780', cursor:'pointer', borderLeft:'2px solid transparent', transition:'all .15s' },
  siActive: { color:'#f97316', background:'rgba(249,115,22,.07)', borderLeftColor:'#f97316' },
  dot: { width:6, height:6, borderRadius:'50%', background:'currentColor', flexShrink:0 },
  main: { flex:1, padding:20, overflowX:'auto' },
  secTitle: { fontSize:15, fontWeight:500, marginBottom:14, display:'flex', alignItems:'center', justifyContent:'space-between' },
  statRow: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:18 },
  sc: { background:'#222', borderRadius:9, padding:13 },
  scL: { fontSize:11, color:'#888780', marginBottom:5 },
  scV: { fontSize:21, fontWeight:500 },
  searchRow: { display:'flex', gap:8, marginBottom:14 },
  sinput: { flex:1, background:'#222', border:'1px solid #2e2e2e', borderRadius:7, padding:'8px 12px', color:'#f1f0e8', fontSize:13, outline:'none' },
  select: { background:'#222', border:'1px solid #2e2e2e', borderRadius:7, padding:'8px 12px', color:'#888780', fontSize:13, outline:'none' },
  tbl: { background:'#1e1e1e', border:'1px solid #2e2e2e', borderRadius:10, overflow:'hidden', width:'100%' },
  th: { display:'grid', padding:'9px 14px', fontSize:11, color:'#888780', borderBottom:'1px solid #2e2e2e', textTransform:'uppercase', letterSpacing:'.04em' },
  tr: { display:'grid', padding:'10px 14px', fontSize:13, borderBottom:'1px solid #2e2e2e', alignItems:'center' },
  chip: { display:'inline-block', padding:'2px 8px', borderRadius:8, fontSize:11, fontWeight:500 },
  ab: { fontSize:11, padding:'3px 8px', borderRadius:5, cursor:'pointer', border:'1px solid #2e2e2e', background:'transparent', color:'#888780' },
  abDel: { fontSize:11, padding:'3px 8px', borderRadius:5, cursor:'pointer', border:'1px solid #E24B4A', background:'transparent', color:'#E24B4A' },
  btnO: { padding:'7px 14px', borderRadius:7, fontSize:12, cursor:'pointer', fontWeight:500, border:'none', background:'#f97316', color:'#fff' },
  loading: { color:'#888780', padding:20 },
  empty: { color:'#888780', padding:20, textAlign:'center' },
}

const chip = (type) => {
  const map = {
    admin: { background:'rgba(55,138,221,.13)', color:'#378ADD' },
    user:  { background:'rgba(249,115,22,.13)', color:'#f97316' },
    active: { background:'rgba(29,158,117,.13)', color:'#1D9E75' },
    draft:  { background:'rgba(249,115,22,.13)', color:'#f97316' },
  }
  return { ...S.chip, ...(map[type?.toLowerCase()] || map.user) }
}

export default function AdminDashboard() {
  
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {    
    if (isAdmin()) navigate('/admin')
  }, [])

  useEffect(() => {
    if (tab === 'users') fetchUsers()
    if (tab === 'products') fetchProducts()
    if (tab === 'overview') { fetchUsers(); fetchProducts() }
  }, [tab])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/admin/users')
      if (res.data.success) setUsers(res.data.data)
    } catch {} finally { setLoading(false) }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/admin/products')
      if (res.data.success) setProducts(res.data.data)
    } catch {} finally { setLoading(false) }
  }

  const deleteUser = async (id) => {
    if (!confirm('Delete this user and all their products?')) return
    try {
      await api.delete(`/api/admin/users/${id}`)
      setUsers(users.filter(u => u.id !== id))
    } catch {}
  }

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await api.delete(`/api/admin/products/${id}`)
      setProducts(products.filter(p => p.id !== id))
    } catch {}
  }

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )
  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  )

  const navItems = [
    { key:'overview', label:'Dashboard' },
    { key:'users', label:'Users' },
    { key:'products', label:'Products' },
    { key:'settings', label:'Settings' },
  ]

  return (
    <div style={S.page}>
      <div style={S.topbar}>
        <div style={S.logo}>ShopPlay<span style={S.badge}>Admin</span></div>
        <div style={{ fontSize:12, color:'#888780' }}>
          {/* {JSON.parse(localStorage.getItem('user') || '{}').email} */}
        </div>
      </div>

      <div style={S.layout}>
        <div style={S.sidebar}>
          {navItems.map(item => (
            <div key={item.key}
              style={{ ...S.si, ...(tab === item.key ? S.siActive : {}) }}
              onClick={() => { setTab(item.key); setSearch('') }}
            >
              <div style={S.dot}/>
              {item.label}
            </div>
          ))}
        </div>

        <div style={S.main}>

          {tab === 'overview' && (
            <>
              <div style={S.secTitle}>Overview</div>
              <div style={S.statRow}>
                <div style={S.sc}><div style={S.scL}>Total users</div><div style={{ ...S.scV, color:'#f97316' }}>{users.length}</div></div>
                <div style={S.sc}><div style={S.scL}>Products</div><div style={S.scV}>{products.length}</div></div>
                <div style={S.sc}><div style={S.scL}>Admins</div><div style={{ ...S.scV, color:'#f97316' }}>{users.filter(u => u.role === 'ROLE_ADMIN').length}</div></div>
              </div>
              <div style={{ fontSize:14, fontWeight:500, marginBottom:10 }}>Recent users</div>
              <div style={S.tbl}>
                <div style={{ ...S.th, gridTemplateColumns:'2fr 2fr 1fr' }}><span>Name</span><span>Email</span><span>Role</span></div>
                {users.slice(0,5).map(u => (
                  <div key={u.id} style={{ ...S.tr, gridTemplateColumns:'2fr 2fr 1fr' }}>
                    <span>{u.name}</span>
                    <span style={{ color:'#888780' }}>{u.email}</span>
                    <span style={chip(u.role === 'ROLE_ADMIN' ? 'admin' : 'user')}>
                      {u.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'users' && (
            <>
              <div style={S.secTitle}>
                All users
                <button style={S.btnO}>+ Add user</button>
              </div>
              <div style={S.searchRow}>
                <input style={S.sinput} placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}/>
                <select style={S.select}>
                  <option>All roles</option><option>Admin</option><option>User</option>
                </select>
              </div>
              {loading ? <div style={S.loading}>Loading...</div> : (
                <div style={S.tbl}>
                  <div style={{ ...S.th, gridTemplateColumns:'2fr 2fr 1fr 1fr auto' }}>
                    <span>Name</span><span>Email</span><span>Role</span><span>Status</span><span>Actions</span>
                  </div>
                  {filteredUsers.length === 0
                    ? <div style={S.empty}>No users found</div>
                    : filteredUsers.map(u => (
                    <div key={u.id} style={{ ...S.tr, gridTemplateColumns:'2fr 2fr 1fr 1fr auto' }}>
                      <span>{u.name}</span>
                      <span style={{ color:'#888780' }}>{u.email}</span>
                      <span style={chip(u.role === 'ROLE_ADMIN' ? 'admin' : 'user')}>
                        {u.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                      </span>
                      <span style={chip('active')}>Active</span>
                      <span style={{ display:'flex', gap:5 }}>
                        <button style={S.ab}>Edit</button>
                        <button style={S.abDel} onClick={() => deleteUser(u.id)}>Del</button>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'products' && (
            <>
              <div style={S.secTitle}>
                All products
                <button style={S.btnO}>+ Add product</button>
              </div>
              <div style={S.searchRow}>
                <input style={S.sinput} placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}/>
                <select style={S.select}>
                  <option>All</option><option>Active</option><option>Draft</option>
                </select>
              </div>
              {loading ? <div style={S.loading}>Loading...</div> : (
                <div style={S.tbl}>
                  <div style={{ ...S.th, gridTemplateColumns:'2fr 1fr 1fr auto' }}>
                    <span>Product</span><span>Price</span><span>Status</span><span>Actions</span>
                  </div>
                  {filteredProducts.length === 0
                    ? <div style={S.empty}>No products found</div>
                    : filteredProducts.map(p => (
                    <div key={p.id} style={{ ...S.tr, gridTemplateColumns:'2fr 1fr 1fr auto' }}>
                      <span>{p.name}</span>
                      <span style={{ color:'#f97316' }}>${p.price}</span>
                      <span style={chip('active')}>Active</span>
                      <span style={{ display:'flex', gap:5 }}>
                        <button style={S.ab} onClick={() => navigate(`/products/${p.id}`)}>View</button>
                        <button style={S.abDel} onClick={() => deleteProduct(p.id)}>Del</button>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'settings' && (
            <>
              <div style={S.secTitle}>Settings</div>
              <div style={{ background:'#1e1e1e', border:'1px solid #2e2e2e', borderRadius:10, padding:16, marginBottom:12 }}>
                <div style={{ fontSize:13, fontWeight:500, marginBottom:12, color:'#888780' }}>General</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
                  {[['Site name','ShopPlay'],['Support email','support@shopplay.com']].map(([l,v]) => (
                    <div key={l} style={{ display:'flex', flexDirection:'column', gap:5 }}>
                      <label style={{ fontSize:12, color:'#888780' }}>{l}</label>
                      <input defaultValue={v} style={{ background:'#222', border:'1px solid #2e2e2e', borderRadius:7, padding:'9px 11px', color:'#f1f0e8', fontSize:13, outline:'none' }}/>
                    </div>
                  ))}
                </div>
                <button style={S.btnO}>Save changes</button>
              </div>
              <div style={{ background:'#1e1e1e', border:'1px solid #2e2e2e', borderRadius:10, padding:16 }}>
                <div style={{ fontSize:13, fontWeight:500, marginBottom:12, color:'#888780' }}>Platform controls</div>
                {[
                  ['Allow new registrations', true],
                  ['Require email verification', true],
                  ['Product review before publish', false],
                  ['Maintenance mode', false],
                ].map(([label, on]) => (
                  <ToggleRow key={label} label={label} defaultOn={on}/>
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}

function ToggleRow({ label, defaultOn }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 0', borderBottom:'1px solid #2e2e2e', fontSize:13 }}>
      <span>{label}</span>
      <div
        onClick={() => setOn(!on)}
        style={{ width:36, height:20, borderRadius:10, background: on ? '#f97316' : '#2e2e2e', position:'relative', cursor:'pointer', transition:'background .2s' }}
      >
        <div style={{ position:'absolute', top:3, left: on ? 19 : 3, width:14, height:14, borderRadius:'50%', background:'#fff', transition:'left .2s' }}/>
      </div>
    </div>
  )
}
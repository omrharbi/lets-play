import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
 import api from '../api/api'
import Navbar from '../navbar/navbar'
import { getUserId } from '../jwt/jwt'

const S = {
  page: { minHeight:'100vh', background:'#0f0f0f', color:'#f1f0e8' },
  wrap: { maxWidth:800, margin:'0 auto', padding:'32px 24px' },
  header: { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 },
  title: { fontSize:18, fontWeight:500 },
  btnAdd: { padding:'9px 18px', borderRadius:8, background:'#f97316', color:'#fff', fontSize:13, fontWeight:500, cursor:'pointer', border:'none' },
  searchRow: { display:'flex', gap:8, marginBottom:20 },
  sinput: { flex:1, background:'#1e1e1e', border:'1px solid #2e2e2e', borderRadius:8, padding:'9px 13px', color:'#f1f0e8', fontSize:13, outline:'none' },
  tbl: { background:'#1e1e1e', border:'1px solid #2e2e2e', borderRadius:12, overflow:'hidden' },
  th: { display:'grid', gridTemplateColumns:'2fr 1fr 1fr auto', padding:'10px 16px', fontSize:11, color:'#888780', borderBottom:'1px solid #2e2e2e', textTransform:'uppercase', letterSpacing:'.04em' },
  tr: { display:'grid', gridTemplateColumns:'2fr 1fr 1fr auto', padding:'12px 16px', fontSize:13, borderBottom:'1px solid #2e2e2e', alignItems:'center', transition:'background .12s' },
  trHover: { background:'rgba(255,255,255,.02)' },
  name: { fontWeight:500 },
  desc: { fontSize:12, color:'#888780', marginTop:2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:240 },
  price: { color:'#f97316', fontWeight:500 },
  chip: { display:'inline-block', padding:'2px 9px', borderRadius:8, fontSize:11, fontWeight:500 },
  actions: { display:'flex', gap:6 },
  btnEdit: { fontSize:11, padding:'4px 10px', borderRadius:6, cursor:'pointer', border:'1px solid #2e2e2e', background:'transparent', color:'#888780' },
  btnDel: { fontSize:11, padding:'4px 10px', borderRadius:6, cursor:'pointer', border:'1px solid #E24B4A', background:'transparent', color:'#E24B4A' },
  empty: { textAlign:'center', padding:'60px 24px', color:'#888780' },
  emptyIcon: { fontSize:32, marginBottom:12 },
  emptyText: { fontSize:14, marginBottom:16 },
  loading: { textAlign:'center', padding:'60px 24px', color:'#888780' },
  modal: { position:'fixed', inset:0, background:'rgba(0,0,0,.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:300 },
  modalCard: { background:'#1e1e1e', border:'1px solid #2e2e2e', borderRadius:14, padding:28, width:'100%', maxWidth:440 },
  modalTitle: { fontSize:16, fontWeight:500, marginBottom:20 },
  field: { marginBottom:16 },
  label: { display:'block', fontSize:12, color:'#888780', marginBottom:6, fontWeight:500 },
  input: { width:'100%', background:'#222', border:'1px solid #2e2e2e', borderRadius:8, padding:'10px 12px', color:'#f1f0e8', fontSize:13, outline:'none', boxSizing:'border-box' },
  textarea: { width:'100%', background:'#222', border:'1px solid #2e2e2e', borderRadius:8, padding:'10px 12px', color:'#f1f0e8', fontSize:13, outline:'none', boxSizing:'border-box', resize:'vertical', minHeight:80, fontFamily:'inherit' },
  mActions: { display:'flex', gap:10, marginTop:20 },
  btnSave: { flex:1, padding:11, borderRadius:8, background:'#f97316', color:'#fff', fontSize:13, fontWeight:500, cursor:'pointer', border:'none' },
  btnClose: { padding:'11px 18px', borderRadius:8, background:'transparent', color:'#888780', fontSize:13, cursor:'pointer', border:'1px solid #2e2e2e' },
  error: { background:'rgba(226,75,74,.1)', border:'1px solid rgba(226,75,74,.25)', borderRadius:7, padding:'9px 12px', fontSize:13, color:'#E24B4A', marginBottom:14 },
  success: { background:'rgba(29,158,117,.1)', border:'1px solid rgba(29,158,117,.25)', borderRadius:7, padding:'9px 12px', fontSize:13, color:'#1D9E75', marginBottom:14 },
  stats: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:20 },
  sc: { background:'#1e1e1e', border:'1px solid #2e2e2e', borderRadius:9, padding:14 },
  scL: { fontSize:11, color:'#888780', marginBottom:5 },
  scV: { fontSize:20, fontWeight:500 },
}

export default function MyProducts() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [editForm, setEditForm] = useState({ name:'', description:'', price:'' })
  const [editErr, setEditErr] = useState('')
  const [editMsg, setEditMsg] = useState('')
  const [hoverId, setHoverId] = useState(null)

  useEffect(() => { fetchMyProducts() }, [])

  const fetchMyProducts = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/product/get-all-products') 
      
      if (res.data.success) {
        const user = getUserId();
        
        setProducts(res.data.data.filter(p => p.userId === user))

        
      }
    } catch {} finally { setLoading(false) }
  }

  const openEdit = (p) => {
    setEditing(p)
    setEditForm({ name: p.name, description: p.description, price: p.price })
    setEditErr(''); setEditMsg('')
  }

  const handleEdit = async e => {
    e.preventDefault()
    if (!editForm.name.trim())        { setEditErr('Name is required'); return }
    if (!editForm.description.trim()) { setEditErr('Description is required'); return }
    if (!editForm.price || Number(editForm.price) <= 0) { setEditErr('Price must be > 0'); return }

    try {
      const res = await api.put(`/api/product/edit?productId=${editing.id}`, {
        name: editForm.name,
        description: editForm.description,
        price: Number(editForm.price),
      })
      if (res.data.success) {
        setProducts(products.map(p => p.id === editing.id ? res.data.data : p))
        setEditMsg('Product updated!')
        setTimeout(() => setEditing(null), 1000)
      } else {
        setEditErr(res.data.message)
      }
    } catch {
      setEditErr('Failed to update product')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      const res = await api.delete(`/api/product/delete-by-user?productId=${id}`)
      if (res.data.success) setProducts(products.filter(p => p.id !== id))
    } catch {}
  }

  const chipStyle = { ...S.chip, background:'rgba(29,158,117,.13)', color:'#1D9E75' }

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  )

  const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0)

  return (
    <div style={S.page}>
      <Navbar />
      <div style={S.wrap}>

        <div style={S.header}>
          <div style={S.title}>My products</div>
          <button style={S.btnAdd} onClick={() => navigate('/add-product')}>+ Add product</button>
        </div>

        <div style={S.stats}>
          <div style={S.sc}><div style={S.scL}>Total products</div><div style={{ ...S.scV, color:'#f97316' }}>{products.length}</div></div>
          <div style={S.sc}><div style={S.scL}>Total value</div><div style={S.scV}>${totalValue.toFixed(2)}</div></div>
          <div style={S.sc}><div style={S.scL}>Active</div><div style={{ ...S.scV, color:'#1D9E75' }}>{products.length}</div></div>
        </div>

        <div style={S.searchRow}>
          <input style={S.sinput} placeholder="Search my products..." value={search}
            onChange={e => setSearch(e.target.value)}/>
        </div>

        {loading && <div style={S.loading}>Loading your products...</div>}

        {!loading && filtered.length === 0 && (
          <div style={S.empty}>
            <div style={S.emptyIcon}>📦</div>
            <div style={S.emptyText}>No products yet</div>
            <button style={S.btnAdd} onClick={() => navigate('/add-product')}>
              Add your first product
            </button>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div style={S.tbl}>
            <div style={S.th}>
              <span>Product</span><span>Price</span><span>Status</span><span>Actions</span>
            </div>
            {filtered.map(p => (
              <div key={p.id}
                style={{ ...S.tr, ...(hoverId === p.id ? S.trHover : {}) }}
                onMouseEnter={() => setHoverId(p.id)}
                onMouseLeave={() => setHoverId(null)}
              >
                <div>
                  <div style={S.name}>{p.name}</div>
                  <div style={S.desc}>{p.description}</div>
                </div>
                <div style={S.price}>${p.price}</div>
                <div><span style={chipStyle}>Active</span></div>
                <div style={S.actions}>
                  <button style={S.btnEdit} onClick={() => openEdit(p)}>Edit</button>
                  <button style={S.btnDel} onClick={() => handleDelete(p.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <div style={S.modal} onClick={e => e.target === e.currentTarget && setEditing(null)}>
          <div style={S.modalCard}>
            <div style={S.modalTitle}>Edit product</div>
            {editErr && <div style={S.error}>{editErr}</div>}
            {editMsg && <div style={S.success}>{editMsg}</div>}
            <form onSubmit={handleEdit}>
              <div style={S.field}>
                <label style={S.label}>Name</label>
                <input style={S.input} value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}/>
              </div>
              <div style={S.field}>
                <label style={S.label}>Description</label>
                <textarea style={S.textarea} value={editForm.description}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}/>
              </div>
              <div style={S.field}>
                <label style={S.label}>Price ($)</label>
                <input style={S.input} type="number" min="0" step="0.01" value={editForm.price}
                  onChange={e => setEditForm({ ...editForm, price: e.target.value })}/>
              </div>
              <div style={S.mActions}>
                <button type="button" style={S.btnClose} onClick={() => setEditing(null)}>Cancel</button>
                <button type="submit" style={S.btnSave}>Save changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
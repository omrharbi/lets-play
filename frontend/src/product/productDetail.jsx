import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/api'
import Navbar from '../navbar/navbar'


const S = {
  page: { minHeight:'100vh', background:'#0f0f0f', color:'#f1f0e8' },
  wrap: { maxWidth:700, margin:'0 auto', padding:'32px 24px' },
  back: { display:'flex', alignItems:'center', gap:6, fontSize:13, color:'#888780', cursor:'pointer', marginBottom:24, width:'fit-content', border:'none', background:'none' },
  card: { background:'#1e1e1e', border:'1px solid #2e2e2e', borderRadius:14, overflow:'hidden' },
  imgBox: { height:260, background:'#222', display:'flex', alignItems:'center', justifyContent:'center' },
  imgInner: { width:100, height:100, borderRadius:16, background:'#2e2e2e', border:'1px solid #333' },
  body: { padding:24 },
  top: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 },
  name: { fontSize:22, fontWeight:500 },
  price: { fontSize:24, color:'#f97316', fontWeight:500 },
  desc: { fontSize:14, color:'#888780', lineHeight:1.7, marginBottom:24 },
  meta: { background:'#222', borderRadius:10, padding:16, marginBottom:24 },
  metaRow: { display:'flex', justifyContent:'space-between', fontSize:13, padding:'6px 0', borderBottom:'1px solid #2e2e2e' },
  metaRowLast: { display:'flex', justifyContent:'space-between', fontSize:13, padding:'6px 0' },
  metaLabel: { color:'#888780' },
  actions: { display:'flex', gap:10 },
  btnBuy: { flex:1, padding:13, borderRadius:9, background:'#f97316', color:'#fff', fontSize:14, fontWeight:500, cursor:'pointer', border:'none' },
  btnCart: { flex:1, padding:13, borderRadius:9, background:'transparent', color:'#f97316', fontSize:14, fontWeight:500, cursor:'pointer', border:'1px solid #f97316' },
  loading: { textAlign:'center', padding:'60px 24px', color:'#888780' },
  error: { textAlign:'center', padding:'60px 24px', color:'#E24B4A' },
  badge: { display:'inline-block', padding:'3px 10px', borderRadius:8, fontSize:12, fontWeight:500, background:'rgba(29,158,117,.13)', color:'#1D9E75', marginBottom:10 },
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/api/product/get-product?productId=${id}`)
        if (res.data.success) setProduct(res.data.data)
        else setError(res.data.message)
      } catch {
        setError('Product not found')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return <div style={S.page}><Navbar /><div style={S.loading}>Loading...</div></div>
  if (error) return <div style={S.page}><Navbar /><div style={S.error}>{error}</div></div>

  return (
    <div style={S.page}>
      <Navbar />
      <div style={S.wrap}>
        <button style={S.back} onClick={() => navigate(-1)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to products
        </button>

        <div style={S.card}>
          <div style={S.imgBox}>
            <div style={S.imgInner}/>
          </div>
          <div style={S.body}>
            <div style={S.badge}>In stock</div>
            <div style={S.top}>
              <div style={S.name}>{product.name}</div>
              <div style={S.price}>${product.price}</div>
            </div>
            <p style={S.desc}>{product.description}</p>

            <div style={S.meta}>
              <div style={S.metaRow}>
                <span style={S.metaLabel}>Product ID</span>
                <span style={{ fontFamily:'monospace', fontSize:12, color:'#888780' }}>{product.id}</span>
              </div>
              <div style={S.metaRow}>
                <span style={S.metaLabel}>Price</span>
                <span style={{ color:'#f97316', fontWeight:500 }}>${product.price}</span>
              </div>
              <div style={S.metaRowLast}>
                <span style={S.metaLabel}>Seller</span>
                <span>Verified seller</span>
              </div>
            </div>

            <div style={S.actions}>
              <button style={S.btnBuy}>Buy now</button>
              <button
                style={{ ...S.btnCart, ...(added ? { background:'rgba(29,158,117,.1)', borderColor:'#1D9E75', color:'#1D9E75' } : {}) }}
                onClick={handleAddToCart}
              >
                {added ? 'Added!' : 'Add to cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
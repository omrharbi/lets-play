import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'
import Navbar from '../navbar/navbar'
import { isTokenExpired } from '../jwt/jwt'

const S = {
  page: { minHeight:'100vh', background:'#0f0f0f', color:'#f1f0e8' },

  // hero
  hero: { background:'#1a1a1a', padding:'64px 24px', textAlign:'center', borderBottom:'1px solid #2e2e2e', position:'relative', overflow:'hidden' },
  heroAccent: { position:'absolute', top:-60, left:'50%', transform:'translateX(-50%)', width:400, height:400, borderRadius:'50%', background:'rgba(249,115,22,.06)', pointerEvents:'none' },
  heroTag: { display:'inline-block', padding:'4px 14px', borderRadius:20, background:'rgba(249,115,22,.12)', color:'#f97316', fontSize:12, fontWeight:500, marginBottom:18, border:'1px solid rgba(249,115,22,.2)' },
  heroTitle: { fontSize:38, fontWeight:500, lineHeight:1.2, marginBottom:14, maxWidth:520, margin:'0 auto 14px' },
  heroSpan: { color:'#f97316' },
  heroSub: { fontSize:15, color:'#888780', marginBottom:32, maxWidth:400, margin:'0 auto 32px' },
  searchWrap: { display:'flex', maxWidth:480, margin:'0 auto 24px', gap:0, background:'#222', border:'1px solid #2e2e2e', borderRadius:12, overflow:'hidden', padding:4 },
  searchInput: { flex:1, background:'transparent', border:'none', padding:'10px 14px', color:'#f1f0e8', fontSize:14, outline:'none' },
  searchBtn: { padding:'10px 22px', borderRadius:9, background:'#f97316', color:'#fff', border:'none', fontSize:13, fontWeight:500, cursor:'pointer' },
  heroStats: { display:'flex', justifyContent:'center', gap:40, marginTop:32 },
  heroStat: { textAlign:'center' },
  heroStatNum: { fontSize:22, fontWeight:500, color:'#f97316' },
  heroStatLabel: { fontSize:12, color:'#888780', marginTop:2 },

  // categories
  catSection: { padding:'36px 24px 20px' },
  sectionHead: { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 },
  sectionTitle: { fontSize:16, fontWeight:500 },
  seeAll: { fontSize:13, color:'#f97316', cursor:'pointer', border:'none', background:'none' },
  catGrid: { display:'flex', gap:10, overflowX:'auto', paddingBottom:8 },
  catCard: { flexShrink:0, padding:'10px 20px', borderRadius:10, background:'#1e1e1e', border:'1px solid #2e2e2e', fontSize:13, cursor:'pointer', transition:'all .15s', whiteSpace:'nowrap' },
  catCardActive: { background:'rgba(249,115,22,.1)', borderColor:'#f97316', color:'#f97316' },

  // featured
  featSection: { padding:'4px 24px 32px' },
  prodGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))', gap:14 },
  prodCard: { background:'#1e1e1e', border:'1px solid #2e2e2e', borderRadius:12, overflow:'hidden', cursor:'pointer', transition:'border-color .15s, transform .15s' },
  prodImg: { height:130, background:'#222', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' },
  prodImgInner: { width:60, height:60, borderRadius:12, background:'#2e2e2e', border:'1px solid #333' },
  prodBadge: { position:'absolute', top:10, left:10, padding:'2px 8px', borderRadius:6, background:'rgba(249,115,22,.9)', color:'#fff', fontSize:10, fontWeight:500 },
  prodBody: { padding:14 },
  prodName: { fontSize:13, fontWeight:500, marginBottom:4, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' },
  prodDesc: { fontSize:12, color:'#888780', marginBottom:10, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' },
  prodFooter: { display:'flex', alignItems:'center', justifyContent:'space-between' },
  prodPrice: { fontSize:15, color:'#f97316', fontWeight:500 },
  addBtn: { width:30, height:30, borderRadius:8, background:'#f97316', color:'#fff', border:'none', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', lineHeight:1 },

  // banner
  banner: { margin:'0 24px 32px', background:'linear-gradient(135deg,#1a1a1a 0%,#222 100%)', border:'1px solid #2e2e2e', borderRadius:14, padding:'28px 32px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:20 },
  bannerLeft: {},
  bannerTag: { fontSize:11, color:'#f97316', fontWeight:500, marginBottom:6, textTransform:'uppercase', letterSpacing:'.06em' },
  bannerTitle: { fontSize:20, fontWeight:500, marginBottom:8 },
  bannerSub: { fontSize:13, color:'#888780' },
  bannerBtn: { padding:'11px 24px', borderRadius:9, background:'#f97316', color:'#fff', border:'none', fontSize:13, fontWeight:500, cursor:'pointer', flexShrink:0 },

  // recent
  recentSection: { padding:'0 24px 48px' },
  recentGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14 },
  recentCard: { background:'#1e1e1e', border:'1px solid #2e2e2e', borderRadius:12, padding:16, display:'flex', gap:14, cursor:'pointer', transition:'border-color .15s' },
  recentImg: { width:64, height:64, borderRadius:10, background:'#222', border:'1px solid #2e2e2e', flexShrink:0 },
  recentBody: { flex:1, minWidth:0 },
  recentName: { fontSize:13, fontWeight:500, marginBottom:4, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' },
  recentDesc: { fontSize:12, color:'#888780', marginBottom:8, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' },
  recentPrice: { fontSize:14, color:'#f97316', fontWeight:500 },

  loading: { textAlign:'center', padding:'60px 24px', color:'#888780' },
}

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home', 'Sports', 'Books', 'Gaming']

export default function Home({ onAddToCart }) {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activecat, setActiveCat] = useState('All')
  const [hoverId, setHoverId] = useState(null)
  const [addedId, setAddedId] = useState(null)

  useEffect(() => {
    api.get('/api/product/get-all-products')
      .then(res => { if (res.data.success) setProducts(res.data.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = (e, product) => {
    e.stopPropagation()
    onAddToCart?.(product)
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1000)
  }

  const handleSearch = () => {
    if (search.trim()) navigate(`/products?q=${search}`)
  }

  const featured  = products.slice(0, 6)
  const recent    = products.slice(0, 4)

  return (
    <div style={S.page}>
      <Navbar />
      <div style={S.hero}>
        <div style={S.heroAccent}/>
        <div style={S.heroTag}>New arrivals every day</div>
        <h1 style={S.heroTitle}>
          Discover products you'll <span style={S.heroSpan}>love</span>
        </h1>
        <p style={S.heroSub}>
          Thousands of verified sellers, millions of products — all in one place.
        </p>
        <div style={S.searchWrap}>
          <input style={S.searchInput} placeholder="Search for anything..."
            value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}/>
          <button style={S.searchBtn} onClick={handleSearch}>Search</button>
        </div>
        <div style={S.heroStats}>
          <div style={S.heroStat}>
            <div style={S.heroStatNum}>{products.length}+</div>
            <div style={S.heroStatLabel}>Products</div>
          </div>
          <div style={S.heroStat}>
            <div style={S.heroStatNum}>100%</div>
            <div style={S.heroStatLabel}>Verified sellers</div>
          </div>
          <div style={S.heroStat}>
            <div style={S.heroStatNum}>24/7</div>
            <div style={S.heroStatLabel}>Support</div>
          </div>
        </div>
      </div>

      {/* ─── categories ───────────────────────────────────────────────── */}
      <div style={S.catSection}>
        <div style={S.sectionHead}>
          <div style={S.sectionTitle}>Browse categories</div>
        </div>
        <div style={S.catGrid}>
          {CATEGORIES.map(cat => (
            <div key={cat}
              style={{ ...S.catCard, ...(activecat === cat ? S.catCardActive : {}) }}
              onClick={() => setActiveCat(cat)}
            >
              {cat}
            </div>
          ))}
        </div>
      </div>

      {/* ─── featured products ────────────────────────────────────────── */}
      <div style={S.featSection}>
        <div style={S.sectionHead}>
          <div style={S.sectionTitle}>Featured products</div>
          <button style={S.seeAll} onClick={() => navigate('/products')}>See all →</button>
        </div>

        {loading && <div style={S.loading}>Loading products...</div>}

        {!loading && (
          <div style={S.prodGrid}>
            {featured.map((p, i) => (
              <div key={p.id}
                style={{
                  ...S.prodCard,
                  ...(hoverId === p.id ? { borderColor:'#f97316', transform:'translateY(-2px)' } : {}),
                }}
                onMouseEnter={() => setHoverId(p.id)}
                onMouseLeave={() => setHoverId(null)}
                onClick={() => navigate(`/products/${p.id}`)}
              >
                <div style={S.prodImg}>
                  
                  
                   {/* <div style={S.imgBox}> */}
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  ) : (
                    <div style={S.imgInner} />
                  )}
              {/* </div> */}
                  
                                    {i < 2 && <div style={S.prodBadge}>New</div>}
                </div>
                <div style={S.prodBody}>
                  <div style={S.prodName}>{p.name}</div>
                  <div style={S.prodDesc}>{p.description}</div>
                  <div style={S.prodFooter}>
                    <div style={S.prodPrice}>${p.price}</div>
                    <button
                      style={{
                        ...S.addBtn,
                        background: addedId === p.id ? '#1D9E75' : '#f97316',
                      }}
                      onClick={e => handleAdd(e, p)}
                    >
                      {addedId === p.id ? '✓' : '+'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── promo banner ─────────────────────────────────────────────── */}
      <div style={S.banner}>
        <div style={S.bannerLeft}>
          <div style={S.bannerTag}>Limited time</div>
          <div style={S.bannerTitle}>Sell your products today</div>
          <div style={S.bannerSub}>Join thousands of sellers — list your first product for free</div>
        </div>
        <button style={S.bannerBtn} onClick={() => navigate('/add-product')}>
          Start selling
        </button>
      </div>

      {/* ─── recently added ───────────────────────────────────────────── */}
      {!loading && recent.length > 0 && (
        <div style={S.recentSection}>
          <div style={S.sectionHead}>
            <div style={S.sectionTitle}>Recently added</div>
            <button style={S.seeAll} onClick={() => navigate('/products')}>View all →</button>
          </div>
          <div style={S.recentGrid}>
            {recent.map(p => (
              <div key={p.id}
                style={S.recentCard}
                onMouseEnter={e => e.currentTarget.style.borderColor='#f97316'}
                onMouseLeave={e => e.currentTarget.style.borderColor='#2e2e2e'}
                onClick={() => navigate(`/products/${p.id}`)}
              >
                <div style={S.recentImg}> 
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      
                    }}
                  />
                ) : (
                  <div style={S.imgInner} />
                )} 
                </div>
                <div style={S.recentBody}>
                  <div style={S.recentName}>{p.name}</div>
                  <div style={S.recentDesc}>{p.description}</div>
                  <div style={S.recentPrice}>${p.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'
import Navbar from '../navbar/navbar'

const S = {
  page: { minHeight: '100vh', background: '#0f0f0f', color: '#f1f0e8' },
  hero: { background: '#1a1a1a', padding: '40px 24px', textAlign: 'center', borderBottom: '1px solid #2e2e2e' },
  h1: { fontSize: 26, fontWeight: 500, marginBottom: 8 },
  span: { color: '#f97316' },
  sub: { color: '#888780', fontSize: 14, marginBottom: 20 },
  searchRow: { display: 'flex', maxWidth: 420, margin: '0 auto', gap: 8 },
  searchInput: { flex: 1, background: '#222', border: '1px solid #2e2e2e', borderRadius: 8, padding: '10px 14px', color: '#f1f0e8', fontSize: 13, outline: 'none' },
  searchBtn: { padding: '10px 18px', borderRadius: 8, background: '#f97316', color: '#fff', border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer' },
  sectionTitle: { padding: '20px 24px 12px', fontSize: 15, fontWeight: 500 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 14, padding: '0 24px 32px' },
  card: { background: '#1e1e1e', border: '1px solid #2e2e2e', borderRadius: 10, overflow: 'hidden', cursor: 'pointer', transition: 'border-color .15s' },
  imgBox: { height: 120, background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  imgInner: { width: 56, height: 56, borderRadius: 10, background: '#2e2e2e', border: '1px solid #333' },
  body: { padding: 12 },
  name: { fontSize: 13, fontWeight: 500, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  desc: { fontSize: 12, color: '#888780', marginBottom: 8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  price: { fontSize: 15, color: '#f97316', fontWeight: 500 },
  addBtn: { marginTop: 10, width: '100%', padding: 7, borderRadius: 6, background: '#f97316', color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer', border: 'none' },
  empty: { textAlign: 'center', padding: '60px 24px', color: '#888780' },
  loading: { textAlign: 'center', padding: '60px 24px', color: '#888780' },
  error: { textAlign: 'center', padding: '60px 24px', color: '#E24B4A' },
}

export default function Products() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/product/get-all-products')
      console.log(res.data.data, "--------------------");

      if (res.data.success) setProducts(res.data.data)

      else setError(res.data.message)
    } catch {
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={S.page}>
      <Navbar />

      <div style={S.hero}>
        <h1 style={S.h1}>Find what you <span style={S.span}>love</span></h1>
        <p style={S.sub}>Thousands of products from verified sellers</p>
        <div style={S.searchRow}>
          <input
            style={S.searchInput}
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button style={S.searchBtn}>Search</button>
        </div>
      </div>

      <div style={S.sectionTitle}>
        {search ? `Results for "${search}"` : 'All products'}
      </div>

      {loading && <div style={S.loading}>Loading products...</div>}
      {error && <div style={S.error}>{error}</div>}

      {!loading && !error && filtered.length === 0 && (
        <div style={S.empty}>No products found</div>
      )}

      {!loading && !error && (
        <div style={S.grid}>
          {filtered.map(p => (
            <div
              key={p.id}
              style={S.card}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#f97316'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#2e2e2e'}
              onClick={() => navigate(`/products/${p.id}`)}
            >
              <div style={S.imgBox}>
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
              </div>
              <div style={S.body}>
                <div style={S.name}>{p.name}</div>
                <div style={S.desc}>{p.description}</div>
                <div style={S.price}>${p.price}</div>
                <button
                  style={S.addBtn}
                  onClick={e => { e.stopPropagation(); alert('Added to cart!') }}
                >
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
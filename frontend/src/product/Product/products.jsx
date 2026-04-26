import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api'; 
import './products.css';
import Navbar from '../../navbar/navbar';

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/product/get-all-products');
      console.log(res.data.data, "--------------------");

      if (res.data.success) setProducts(res.data.data);
      else setError(res.data.message);
    } catch {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <Navbar />

      <div className="hero">
        <h1 className="h1">
          Find what you <span className="span">love</span>
        </h1>
        <p className="sub">Thousands of products from verified sellers</p>
        <div className="searchRow">
          <input
            className="searchInput"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="searchBtn">Search</button>
        </div>
      </div>

      <div className="sectionTitle">
        {search ? `Results for "${search}"` : 'All products'}
      </div>

      {loading && <div className="loading">Loading products...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && filtered.length === 0 && (
        <div className="empty">No products found</div>
      )}

      {!loading && !error && (
        <div className="grid">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="card"
              onClick={() => navigate(`/products/${p.id}`)}
            >
              <div className="imgBox">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} />
                ) : (
                  <div className="imgInner" />
                )}
              </div>
              <div className="body">
                <div className="name">{p.name}</div>
                <div className="desc">{p.description}</div>
                <div className="price">${p.price}</div>
                <button
                  className="addBtn"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert('Added to cart!');
                  }}
                >
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
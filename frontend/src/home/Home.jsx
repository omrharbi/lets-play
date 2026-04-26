import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import Navbar from '../navbar/navbar';
import './home.css';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home', 'Sports', 'Books', 'Gaming'];

export default function Home({ onAddToCart }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activecat, setActiveCat] = useState('All');
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    api
      .get('/api/product/get-all-products')
      .then((res) => {
        if (res.data.success) setProducts(res.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = (e, product) => {
    e.stopPropagation();
    onAddToCart?.(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1000);
  };

  const handleSearch = () => {
    if (search.trim()) navigate(`/products?q=${search}`);
  };

  const featured = products.slice(0, 6);
  const recent = products.slice(0, 4);

  return (
    <div className="page">
      <Navbar />
      <div className="hero">
        <div className="heroAccent" />
        <div className="heroTag">New arrivals every day</div>
        <h1 className="heroTitle">
          Discover products you'll <span className="heroSpan">love</span>
        </h1>
        <p className="heroSub">
          Thousands of verified sellers, millions of products — all in one place.
        </p>
        <div className="searchWrap">
          <input
            className="searchInput"
            placeholder="Search for anything..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="searchBtn" onClick={handleSearch}>
            Search
          </button>
        </div>
        <div className="heroStats">
          <div className="heroStat">
            <div className="heroStatNum">{products.length}+</div>
            <div className="heroStatLabel">Products</div>
          </div>
          <div className="heroStat">
            <div className="heroStatNum">100%</div>
            <div className="heroStatLabel">Verified sellers</div>
          </div>
          <div className="heroStat">
            <div className="heroStatNum">24/7</div>
            <div className="heroStatLabel">Support</div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="catSection">
        <div className="sectionHead">
          <div className="sectionTitle">Browse categories</div>
        </div>
        <div className="catGrid">
          {CATEGORIES.map((cat) => (
            <div
              key={cat}
              className={`catCard ${activecat === cat ? 'active' : ''}`}
              onClick={() => setActiveCat(cat)}
            >
              {cat}
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="featSection">
        <div className="sectionHead">
          <div className="sectionTitle">Featured products</div>
          <button className="seeAll" onClick={() => navigate('/products')}>
            See all →
          </button>
        </div>

        {loading && <div className="loading">Loading products...</div>}

        {!loading && (
          <div className="prodGrid">
            {featured.map((p, i) => (
              <div
                key={p.id}
                className="prodCard"
                onClick={() => navigate(`/products/${p.id}`)}
              >
                <div className="prodImg">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} />
                  ) : (
                    <div className="prodImgInner" />
                  )}
                  {i < 2 && <div className="prodBadge">New</div>}
                </div>
                <div className="prodBody">
                  <div className="prodName">{p.name}</div>
                  <div className="prodDesc">{p.description}</div>
                  <div className="prodFooter">
                    <div className="prodPrice">${p.price}</div>
                    <button
                      className={`addBtn ${addedId === p.id ? 'added' : ''}`}
                      onClick={(e) => handleAdd(e, p)}
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

      {/* Promo Banner */}
      <div className="banner">
        <div className="bannerLeft">
          <div className="bannerTag">Limited time</div>
          <div className="bannerTitle">Sell your products today</div>
          <div className="bannerSub">
            Join thousands of sellers — list your first product for free
          </div>
        </div>
        <button className="bannerBtn" onClick={() => navigate('/add-product')}>
          Start selling
        </button>
      </div>

      {/* Recently Added */}
      {!loading && recent.length > 0 && (
        <div className="recentSection">
          <div className="sectionHead">
            <div className="sectionTitle">Recently added</div>
            <button className="seeAll" onClick={() => navigate('/products')}>
              View all →
            </button>
          </div>
          <div className="recentGrid">
            {recent.map((p) => (
              <div
                key={p.id}
                className="recentCard"
                onClick={() => navigate(`/products/${p.id}`)}
              >
                <div className="recentImg">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} />
                  ) : (
                    <div className="prodImgInner" /> /* Reusing style for placeholder */
                  )}
                </div>
                <div className="recentBody">
                  <div className="recentName">{p.name}</div>
                  <div className="recentDesc">{p.description}</div>
                  <div className="recentPrice">${p.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
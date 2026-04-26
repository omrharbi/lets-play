import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
  import './product-detail.css';
import Navbar from '../../navbar/navbar';
import api from '../../api/api';
import ErrorPage from '../../error/ErrorPage';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/api/product/get-product?productId=${id}`);
        if (res.data.success) setProduct(res.data.data);
        else setError(res.data.message);
      } catch {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading)
    return (
      <div className="page">
        <Navbar />
        <div className="loading">Loading...</div>
      </div>
    );
    
 if (error) return <ErrorPage code={error} />

  return (
    <div className="page">
      <Navbar />
      <div className="wrap">
        <button className="back" onClick={() => navigate(-1)}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to products
        </button>

        <div className="card">
          <div className="imgBox">
            <div className="prodImg">
              {/* Nested structure preserved from original code */}
              <div className="imgBox">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} />
                ) : (
                  <div className="imgInner" />
                )}
              </div>
            </div>
          </div>

          <div className="body">
            <div className="badge">In stock</div>
            <div className="top">
              <div className="name">{product.name}</div>
              <div className="price">${product.price}</div>
            </div>
            <p className="desc">{product.description}</p>

            <div className="meta">
              <div className="metaRow">
                <span className="metaLabel">Product ID</span>
                <span className="metaMono">{product.id}</span>
              </div>
              <div className="metaRow">
                <span className="metaLabel">Price</span>
                <span className="metaPrice">${product.price}</span>
              </div>
              <div className="metaRowLast">
                <span className="metaLabel">Seller</span>
                <span>Verified seller</span>
              </div>
            </div>

            <div className="actions">
              <button className="btnBuy">Buy now</button>
              <button
                className={`btnCart ${added ? 'added' : ''}`}
                onClick={handleAddToCart}
              >
                {added ? 'Added!' : 'Add to cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
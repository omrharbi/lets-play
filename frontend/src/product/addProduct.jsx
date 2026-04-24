import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import Navbar from '../navbar/navbar';
import './add-product.css';

export default function AddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', description: '', price: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Product name is required');
      return;
    }
    if (!form.description.trim()) {
      setError('Description is required');
      return;
    }
    if (!form.price || Number(form.price) <= 0) {
      setError('Price must be greater than 0');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price);
      if (imageFile) formData.append('image', imageFile);

      const res = await api.post('/api/product/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setSuccess('Product created successfully!');
        setForm({ name: '', description: '', price: '' });
        setTimeout(() => navigate('/my-products'), 1500);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Navbar />
      <div className="wrap">
        <button className="back" onClick={() => navigate('/my-products')}>
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
          Back to my products
        </button>

        <div className="title">Add new product</div>

        <div className="card">
          {success && <div className="success">{success}</div>}
          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Product image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id="img-input"
              />

              <label htmlFor="img-input">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="previewImage"
                  />
                ) : (
                  <div className="imgUpload">
                    <div className="imgLabel">Click to upload image</div>
                    <div className="imgSub">PNG, JPG up to 5MB</div>
                  </div>
                )}
              </label>
            </div>

            <div className="field">
              <label className="label">Product name</label>
              <input
                className="input"
                name="name"
                placeholder="e.g. Wireless Headphones"
                value={form.name}
                onChange={handleChange}
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent-orange)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')}
              />
            </div>

            <div className="field">
              <label className="label">Description</label>
              <textarea
                className="textarea"
                name="description"
                placeholder="Describe your product in detail..."
                value={form.description}
                onChange={handleChange}
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent-orange)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')}
              />
              <div className="hint">{form.description.length} / 500 characters</div>
            </div>

            <div className="field">
              <label className="label">Price</label>
              <div className="priceWrap">
                <span className="pricePre">$</span>
                <input
                  className="input"
                  style={{ paddingLeft: 26 }}
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.price}
                  onChange={handleChange}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--accent-orange)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')}
                />
              </div>
            </div>

            <div className="actions">
              <button
                type="button"
                className="btnCancel"
                onClick={() => navigate('/my-products')}
              >
                Cancel
              </button>
              <button type="submit" className="btnSubmit" disabled={loading}>
                {loading ? 'Creating...' : 'Create product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
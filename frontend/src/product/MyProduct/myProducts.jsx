import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
 import { getUserId } from '../../jwt/jwt';
import './my-products.css';
import Navbar from '../../navbar/navbar';

export default function MyProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', price: '' });
  const [editErr, setEditErr] = useState('');
  const [editMsg, setEditMsg] = useState('');
  const [hoverId, setHoverId] = useState(null);

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/product/get-all-products');
      if (res.data.success) {
        const user = getUserId();
        setProducts(res.data.data.filter((p) => p.userId === user));
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (p) => {
    setEditing(p);
    setEditForm({ name: p.name, description: p.description, price: p.price });
    setEditErr('');
    setEditMsg('');
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      setEditErr('Name is required');
      return;
    }
    if (!editForm.description.trim()) {
      setEditErr('Description is required');
      return;
    }
    if (!editForm.price || Number(editForm.price) <= 0) {
      setEditErr('Price must be > 0');
      return;
    }

    try {
      const res = await api.put(`/api/product/edit?productId=${editing.id}`, {
        name: editForm.name,
        description: editForm.description,
        price: Number(editForm.price),
      });
      if (res.data.success) {
        setProducts(
          products.map((p) => (p.id === editing.id ? res.data.data : p))
        );
        setEditMsg('Product updated!');
        setTimeout(() => setEditing(null), 1000);
      } else {
        setEditErr(res.data.message);
      }
    } catch {
      setEditErr('Failed to update product');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      const res = await api.delete(`/api/product/delete-by-user?productId=${id}`);
      if (res.data.success) setProducts(products.filter((p) => p.id !== id));
    } catch {}
  };

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0);

  return (
    <div className="page">
      <Navbar />
      <div className="wrap">
        <div className="header">
          <div className="title">My products</div>
          <button className="btnAdd" onClick={() => navigate('/add-product')}>
            + Add product
          </button>
        </div>

        <div className="stats">
          <div className="sc">
            <div className="scL">Total products</div>
            <div className="scV textOrange">{products.length}</div>
          </div>
          <div className="sc">
            <div className="scL">Total value</div>
            <div className="scV">${totalValue.toFixed(2)}</div>
          </div>
          <div className="sc">
            <div className="scL">Active</div>
            <div className="scV textGreen">{products.length}</div>
          </div>
        </div>

        <div className="searchRow">
          <input
            className="sinput"
            placeholder="Search my products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading && <div className="loading">Loading your products...</div>}

        {!loading && filtered.length === 0 && (
          <div className="empty">
            <div className="emptyIcon">📦</div>
            <div className="emptyText">No products yet</div>
            <button className="btnAdd" onClick={() => navigate('/add-product')}>
              Add your first product
            </button>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="tbl">
            <div className="th">
              <span>Product</span>
              <span>Price</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            {filtered.map((p) => (
              <div
                key={p.id}
                className={`tr ${hoverId === p.id ? 'tr-hover' : ''}`}
                onMouseEnter={() => setHoverId(p.id)}
                onMouseLeave={() => setHoverId(null)}
              >
                <div>
                  <div className="name">{p.name}</div>
                  <div className="desc">{p.description}</div>
                </div>
                <div className="price">${p.price}</div>
                <div>
                  <span className="chip">Active</span>
                </div>
                <div className="actions">
                  <button className="btnEdit" onClick={() => openEdit(p)}>
                    Edit
                  </button>
                  <button className="btnDel" onClick={() => handleDelete(p.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <div
          className="modal"
          onClick={(e) => e.target === e.currentTarget && setEditing(null)}
        >
          <div className="modalCard">
            <div className="modalTitle">Edit product</div>
            {editErr && <div className="error">{editErr}</div>}
            {editMsg && <div className="success">{editMsg}</div>}
            <form onSubmit={handleEdit}>
              <div className="field">
                <label className="label">Name</label>
                <input
                  className="input"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
              </div>
              <div className="field">
                <label className="label">Description</label>
                <textarea
                  className="textarea"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                />
              </div>
              <div className="field">
                <label className="label">Price ($)</label>
                <input
                  className="input"
                  type="number"
                  min="0"
                  step="0.01"
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm({ ...editForm, price: e.target.value })
                  }
                />
              </div>
              <div className="mActions">
                <button
                  type="button"
                  className="btnClose"
                  onClick={() => setEditing(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btnSave">
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
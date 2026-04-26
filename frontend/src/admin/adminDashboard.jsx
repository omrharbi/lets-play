import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { isAdmin } from '../jwt/jwt';
import './admin.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAdmin()) navigate('/'); // Redirect if not admin, adjust logic as needed
  }, [navigate]);

  useEffect(() => {
    if (tab === 'users') fetchUsers();
    if (tab === 'products') fetchProducts();
    if (tab === 'overview') {
      fetchUsers();
      fetchProducts();
    }
  }, [tab]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/users');
      if (res.data.success) setUsers(res.data.data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/products');
      if (res.data.success) setProducts(res.data.data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user and all their products?')) return;
    try {
      await api.delete(`/api/admin/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
    } catch {}
  };

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/api/admin/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
    } catch {}
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );
  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const navItems = [
    { key: 'overview', label: 'Dashboard' },
    { key: 'users', label: 'Users' },
    { key: 'products', label: 'Products' },
    { key: 'settings', label: 'Settings' },
  ];

  const getRoleChipClass = (role) => {
    return role === 'ROLE_ADMIN' ? 'chipAdmin' : 'chipUser';
  };

  return (
    <div className="page">
      <div className="topbar">
        <div className="logo">
          ShopPlay<span className="badge">Admin</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          {/* {JSON.parse(localStorage.getItem('user') || '{}').email} */}
        </div>
      </div>

      <div className="layout">
        <div className="sidebar">
          {navItems.map((item) => (
            <div
              key={item.key}
              className={`sidebarItem ${tab === item.key ? 'active' : ''}`}
              onClick={() => {
                setTab(item.key);
                setSearch('');
              }}
            >
              <div className="dot" />
              {item.label}
            </div>
          ))}
        </div>

        <div className="main">
          {tab === 'overview' && (
            <>
              <div className="secTitle">Overview</div>
              <div className="statRow">
                <div className="statCard">
                  <div className="statLabel">Total users</div>
                  <div className="statValue textOrange">{users.length}</div>
                </div>
                <div className="statCard">
                  <div className="statLabel">Products</div>
                  <div className="statValue">{products.length}</div>
                </div>
                <div className="statCard">
                  <div className="statLabel">Admins</div>
                  <div className="statValue textOrange">
                    {users.filter((u) => u.role === 'ROLE_ADMIN').length}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 10 }}>
                Recent users
              </div>
              <div className="tbl">
                <div className="th" style={{ gridTemplateColumns: '2fr 2fr 1fr' }}>
                  <span>Name</span>
                  <span>Email</span>
                  <span>Role</span>
                </div>
                {users.slice(0, 5).map((u) => (
                  <div key={u.id} className="tr" style={{ gridTemplateColumns: '2fr 2fr 1fr' }}>
                    <span>{u.name}</span>
                    <span className="textSec">{u.email}</span>
                    <span className={`chip ${getRoleChipClass(u.role)}`}>
                      {u.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'users' && (
            <>
              <div className="secTitle">
                All users
                <button className="btn btnPrimary">+ Add user</button>
              </div>
              <div className="searchRow">
                <input
                  className="input"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select className="select">
                  <option>All roles</option>
                  <option>Admin</option>
                  <option>User</option>
                </select>
              </div>
              {loading ? (
                <div className="loading">Loading...</div>
              ) : (
                <div className="tbl">
                  <div
                    className="th"
                    style={{ gridTemplateColumns: '2fr 2fr 1fr 1fr auto' }}
                  >
                    <span>Name</span>
                    <span>Email</span>
                    <span>Role</span>
                    <span>Status</span>
                    <span>Actions</span>
                  </div>
                  {filteredUsers.length === 0 ? (
                    <div className="empty">No users found</div>
                  ) : (
                    filteredUsers.map((u) => (
                      <div
                        key={u.id}
                        className="tr"
                        style={{ gridTemplateColumns: '2fr 2fr 1fr 1fr auto' }}
                      >
                        <span>{u.name}</span>
                        <span className="textSec">{u.email}</span>
                        <span className={`chip ${getRoleChipClass(u.role)}`}>
                          {u.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                        </span>
                        <span className="chip chipActive">Active</span>
                        <span className="flexGap5">
                          <button className="btnGhost">Edit</button>
                          <button className="btnDanger" onClick={() => deleteUser(u.id)}>
                            Del
                          </button>
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}

          {tab === 'products' && (
            <>
              <div className="secTitle">
                All products
                <button className="btn btnPrimary">+ Add product</button>
              </div>
              <div className="searchRow">
                <input
                  className="input"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select className="select">
                  <option>All</option>
                  <option>Active</option>
                  <option>Draft</option>
                </select>
              </div>
              {loading ? (
                <div className="loading">Loading...</div>
              ) : (
                <div className="tbl">
                  <div
                    className="th"
                    style={{ gridTemplateColumns: '2fr 1fr 1fr auto' }}
                  >
                    <span>Product</span>
                    <span>Price</span>
                    <span>Status</span>
                    <span>Actions</span>
                  </div>
                  {filteredProducts.length === 0 ? (
                    <div className="empty">No products found</div>
                  ) : (
                    filteredProducts.map((p) => (
                      <div
                        key={p.id}
                        className="tr"
                        style={{ gridTemplateColumns: '2fr 1fr 1fr auto' }}
                      >
                        <span>{p.name}</span>
                        <span className="textOrange">${p.price}</span>
                        <span className="chip chipActive">Active</span>
                        <span className="flexGap5">
                          <button className="btnGhost" onClick={() => navigate(`/products/${p.id}`)}>
                            View
                          </button>
                          <button className="btnDanger" onClick={() => deleteProduct(p.id)}>
                            Del
                          </button>
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}

          {tab === 'settings' && (
            <>
              <div className="secTitle">Settings</div>
              <div className="settingsSection">
                <div className="settingsTitle">General</div>
                <div className="grid2">
                  {[
                    ['Site name', 'ShopPlay'],
                    ['Support email', 'support@shopplay.com'],
                  ].map(([l, v]) => (
                    <div key={l} className="fieldCol">
                      <label className="labelSm">{l}</label>
                      <input defaultValue={v} className="inputSm" />
                    </div>
                  ))}
                </div>
                <button className="btn btnPrimary">Save changes</button>
              </div>
              <div className="settingsSection">
                <div className="settingsTitle">Platform controls</div>
                {[
                  ['Allow new registrations', true],
                  ['Require email verification', true],
                  ['Product review before publish', false],
                  ['Maintenance mode', false],
                ].map(([label, on]) => (
                  <ToggleRow key={label} label={label} defaultOn={on} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, defaultOn }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="toggleRow">
      <span>{label}</span>
      <div
        onClick={() => setOn(!on)}
        className="toggleSwitch"
        style={{ background: on ? 'var(--accent-orange)' : 'var(--border-color)' }}
      >
        <div className="toggleKnob" style={{ left: on ? 19 : 3 }} />
      </div>
    </div>
  );
}
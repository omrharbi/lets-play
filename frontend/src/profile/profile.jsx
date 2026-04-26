import { useState, useEffect } from 'react';
import api from '../api/api';
import Navbar from '../navbar/navbar';
import './profile.css';

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '' });
  const [user, setUser] = useState({});
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [passMsg, setPassMsg] = useState('');
  const [passErr, setPassErr] = useState('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(stored);
    setForm({ name: stored.name || '', email: stored.email || '' });
  }, []);

  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U';

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMsg('');
    setErr('');
    try {
      const res = await api.put('/api/user/profile', form);
      if (res.data.success) {
        const updated = { ...user, ...form };
        localStorage.setItem('user', JSON.stringify(updated));
        setUser(updated);
        setMsg('Profile updated successfully');
        setEditing(false);
      } else {
        setErr(res.data.message);
      }
    } catch {
      setErr('Failed to update profile');
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setPassMsg('');
    setPassErr('');
    if (!passForm.currentPassword || !passForm.newPassword) {
      setPassErr('Please fill in all fields');
      return;
    }
    try {
      const res = await api.put('/api/user/password', passForm);
      if (res.data.success) {
        setPassMsg('Password updated successfully');
        setPassForm({ currentPassword: '', newPassword: '' });
      } else {
        setPassErr(res.data.message);
      }
    } catch {
      setPassErr('Failed to update password');
    }
  };

  return (
    <div className="page">
      <Navbar />
      <div className="wrap">
        <div className="title">My profile</div>

        <div className="avatarRow">
          <div className="avatar">{initials}</div>
          <div>
            <div className="userName">{user.name}</div>
            <div className="userRole">Member</div>
          </div>
          <button className="editBtn" onClick={() => setEditing(!editing)}>
            {editing ? 'Cancel' : 'Edit profile'}
          </button>
        </div>

        {!editing ? (
          <div className="section">
            <div className="row">
              <span className="rowLabel">Full name</span>
              <span>{user.name}</span>
            </div>
            <div className="row">
              <span className="rowLabel">Email</span>
              <span>{user.email}</span>
            </div>
            <div className="rowLast">
              <span className="rowLabel">Role</span>
              <span className="chip">User</span>
            </div>
          </div>
        ) : (
          <form className="section" onSubmit={handleUpdate}>
            <div className="secTitle">Edit personal info</div>
            {msg && <div className="success">{msg}</div>}
            {err && <div className="error">{err}</div>}
            <div className="field">
              <label className="label">Full name</label>
              <input
                className="input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="field">
              <label className="label">Email address</label>
              <input
                className="input"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <button type="submit" className="btn">
              Save changes
            </button>
          </form>
        )}

        <form className="section" onSubmit={handlePassword}>
          <div className="secTitle">Change password</div>
          {passMsg && <div className="success">{passMsg}</div>}
          {passErr && <div className="error">{passErr}</div>}
          <div className="field">
            <label className="label">Current password</label>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              value={passForm.currentPassword}
              onChange={(e) =>
                setPassForm({ ...passForm, currentPassword: e.target.value })
              }
            />
          </div>
          <div className="field">
            <label className="label">New password</label>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              value={passForm.newPassword}
              onChange={(e) =>
                setPassForm({ ...passForm, newPassword: e.target.value })
              }
            />
          </div>
          <button type="submit" className="btn">
            Update password
          </button>
        </form>

        <div className="section">
          <div className="secTitle">Account actions</div>
          <button className="btnGhost">Download my data</button>
          <div className="danger">
            <div className="dangerTitle">Danger zone</div>
            <div className="dangerRow">
              <div>
                <div>Delete account</div>
                <div className="dangerSub">
                  Permanently removes your account and all products
                </div>
              </div>
              <button
                className="btnDanger btnDangerInline"
                onClick={() => {
                  if (confirm('Are you sure?')) alert('Account deleted');
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
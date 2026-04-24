import { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/navbar';
import './settings.css'; 
function Toggle({ defaultOn, onChange }) {
  const [on, setOn] = useState(defaultOn);

  const toggle = () => {
    const v = !on;
    setOn(v);
    onChange?.(v);
  };

  return (
    <div
      className="toggle-switch"
      style={{ background: on ? 'var(--accent-orange)' : 'var(--border-color)' }}
      onClick={toggle}
    >
      <div className="toggle-knob" style={{ left: on ? 19 : 3 }} />
    </div>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState('');
  const [notifs, setNotifs] = useState({ messages: true, activity: true, weekly: false });
  const [privacy, setPrivacy] = useState({ publicProfile: true, showProducts: true });
  const [theme, setTheme] = useState('dark');
  const [lang, setLang] = useState('en');

  const handleSave = () => {
    setSaved('Settings saved successfully');
    setTimeout(() => setSaved(''), 3000);
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure? This cannot be undone.')) return;
    try {
      await api.delete('/api/user/profile');
      localStorage.clear();
      navigate('/login');
    } catch {
      alert('Failed to delete account');
    }
  };

  const handleLogoutAll = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="settings-page">
      <Navbar />
      <div className="settings-wrap">
        <div className="settings-title">Settings</div>

        {saved && <div className="success-msg">{saved}</div>}

        {/* Notifications Section */}
        <div className="settings-section">
          <div className="section-title">Notifications</div>
          {[
            { key: 'messages', label: 'Email on new message', sub: 'Get notified when someone messages you' },
            { key: 'activity', label: 'Product activity alerts', sub: 'When someone views or saves your product' },
            { key: 'weekly', label: 'Weekly summary', sub: 'A digest of your account activity', last: true },
          ].map((item) => (
            <div key={item.key} className={item.last ? 'toggle-row-last' : 'toggle-row'}>
              <div className="toggle-info">
                <div className="toggle-label">{item.label}</div>
                <div className="toggle-sub">{item.sub}</div>
              </div>
              <Toggle
                defaultOn={notifs[item.key]}
                onChange={(v) => setNotifs({ ...notifs, [item.key]: v })}
              />
            </div>
          ))}
        </div>

        {/* Privacy Section */}
        <div className="settings-section">
          <div className="section-title">Privacy</div>
          {[
            { key: 'publicProfile', label: 'Show profile publicly', sub: 'Others can view your seller profile' },
            { key: 'showProducts', label: 'Show products on homepage', sub: 'Your listings appear in public search', last: true },
          ].map((item) => (
            <div key={item.key} className={item.last ? 'toggle-row-last' : 'toggle-row'}>
              <div className="toggle-info">
                <div className="toggle-label">{item.label}</div>
                <div className="toggle-sub">{item.sub}</div>
              </div>
              <Toggle
                defaultOn={privacy[item.key]}
                onChange={(v) => setPrivacy({ ...privacy, [item.key]: v })}
              />
            </div>
          ))}
        </div>

        {/* Preferences Section */}
        <div className="settings-section">
          <div className="section-title">Preferences</div>
          <div className="field">
            <label className="label">Theme</label>
            <select className="select" value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System default</option>
            </select>
          </div>
          <div className="field">
            <label className="label">Language</label>
            <select className="select" value={lang} onChange={(e) => setLang(e.target.value)}>
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="ar">Arabic</option>
              <option value="es">Spanish</option>
            </select>
          </div>
          <button className="btn" onClick={handleSave}>Save preferences</button>
        </div>

        {/* Sessions Section */}
        <div className="settings-section">
          <div className="section-title">Sessions</div>
          <div className="toggle-row">
            <div>
              <div className="toggle-label">Current session</div>
              <div className="toggle-sub">This browser — active now</div>
            </div>
            <span className="badge-active">Active</span>
          </div>
          <div className="toggle-row-last">
            <div>
              <div className="toggle-label">Sign out everywhere</div>
              <div className="toggle-sub">Logs you out of all devices</div>
            </div>
            <button className="btn-ghost" onClick={handleLogoutAll}>Sign out all</button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="danger-zone">
          <div className="danger-title">Danger zone</div>
          <div className="danger-row">
            <div>
              <div>Export my data</div>
              <div className="danger-sub">Download all your account data</div>
            </div>
            <button className="btn-danger">Export</button>
          </div>
          <div className="danger-row-last">
            <div>
              <div>Delete account</div>
              <div className="danger-sub">Permanently removes your account and all products</div>
            </div>
            <button className="btn-danger" onClick={handleDeleteAccount}>Delete</button>
          </div>
        </div>

      </div>
    </div>
  );
}
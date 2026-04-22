import { useState } from 'react'
 import api from '../api/api'
import { useNavigate } from 'react-router-dom'
import Navbar from '../navbar/navbar'

const S = {
  page: { minHeight:'100vh', background:'#0f0f0f', color:'#f1f0e8' },
  wrap: { maxWidth:560, margin:'0 auto', padding:'32px 24px' },
  title: { fontSize:18, fontWeight:500, marginBottom:24 },
  section: { background:'#1e1e1e', border:'1px solid #2e2e2e', borderRadius:12, padding:20, marginBottom:14 },
  secTitle: { fontSize:13, fontWeight:500, marginBottom:14, color:'#888780', paddingBottom:10, borderBottom:'1px solid #2e2e2e' },
  toggleRow: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #2e2e2e', fontSize:13 },
  toggleRowLast: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', fontSize:13 },
  toggleInfo: {},
  toggleLabel: { fontSize:13, color:'#f1f0e8' },
  toggleSub: { fontSize:12, color:'#888780', marginTop:2 },
  toggle: { width:36, height:20, borderRadius:10, position:'relative', cursor:'pointer', transition:'background .2s', flexShrink:0 },
  knob: { position:'absolute', top:3, width:14, height:14, borderRadius:'50%', background:'#fff', transition:'left .2s' },
  field: { marginBottom:16 },
  label: { display:'block', fontSize:12, color:'#888780', marginBottom:6, fontWeight:500 },
  input: { width:'100%', background:'#222', border:'1px solid #2e2e2e', borderRadius:8, padding:'10px 12px', color:'#f1f0e8', fontSize:13, outline:'none', boxSizing:'border-box' },
  select: { width:'100%', background:'#222', border:'1px solid #2e2e2e', borderRadius:8, padding:'10px 12px', color:'#f1f0e8', fontSize:13, outline:'none', boxSizing:'border-box' },
  btn: { padding:'9px 20px', borderRadius:8, background:'#f97316', color:'#fff', fontSize:13, fontWeight:500, cursor:'pointer', border:'none' },
  btnGhost: { padding:'9px 20px', borderRadius:8, background:'transparent', color:'#888780', fontSize:13, cursor:'pointer', border:'1px solid #2e2e2e' },
  danger: { background:'rgba(226,75,74,.06)', border:'1px solid rgba(226,75,74,.2)', borderRadius:12, padding:20, marginBottom:14 },
  dangerTitle: { fontSize:13, fontWeight:500, color:'#E24B4A', marginBottom:14, paddingBottom:10, borderBottom:'1px solid rgba(226,75,74,.15)' },
  dangerRow: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid rgba(226,75,74,.1)', fontSize:13 },
  dangerRowLast: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', fontSize:13 },
  dangerSub: { fontSize:12, color:'#888780', marginTop:2 },
  btnDanger: { padding:'7px 14px', borderRadius:7, background:'transparent', border:'1px solid #E24B4A', color:'#E24B4A', fontSize:12, cursor:'pointer', flexShrink:0, marginLeft:12 },
  success: { background:'rgba(29,158,117,.1)', border:'1px solid rgba(29,158,117,.25)', borderRadius:7, padding:'9px 12px', fontSize:13, color:'#1D9E75', marginBottom:14 },
}

function Toggle({ defaultOn, onChange }) {
  const [on, setOn] = useState(defaultOn)
  const toggle = () => { const v = !on; setOn(v); onChange?.(v) }
  return (
    <div style={{ ...S.toggle, background: on ? '#f97316' : '#2e2e2e' }} onClick={toggle}>
      <div style={{ ...S.knob, left: on ? 19 : 3 }}/>
    </div>
  )
}

export default function Settings() {
  const navigate = useNavigate()
  const [saved, setSaved] = useState('')
  const [notifs, setNotifs] = useState({ messages: true, activity: true, weekly: false })
  const [privacy, setPrivacy] = useState({ publicProfile: true, showProducts: true })
  const [theme, setTheme] = useState('dark')
  const [lang, setLang] = useState('en')

  const handleSave = () => {
    setSaved('Settings saved successfully')
    setTimeout(() => setSaved(''), 3000)
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure? This cannot be undone.')) return
    try {
      await api.delete('/api/user/profile')
      localStorage.clear()
      navigate('/login')
    } catch {
      alert('Failed to delete account')
    }
  }

  const handleLogoutAll = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div style={S.page}>
      <Navbar />
      <div style={S.wrap}>
        <div style={S.title}>Settings</div>

        {saved && <div style={S.success}>{saved}</div>}

        <div style={S.section}>
          <div style={S.secTitle}>Notifications</div>
          {[
            { key:'messages', label:'Email on new message', sub:'Get notified when someone messages you' },
            { key:'activity', label:'Product activity alerts', sub:'When someone views or saves your product' },
            { key:'weekly',   label:'Weekly summary',        sub:'A digest of your account activity', last:true },
          ].map(item => (
            <div key={item.key} style={item.last ? S.toggleRowLast : S.toggleRow}>
              <div style={S.toggleInfo}>
                <div style={S.toggleLabel}>{item.label}</div>
                <div style={S.toggleSub}>{item.sub}</div>
              </div>
              <Toggle defaultOn={notifs[item.key]}
                onChange={v => setNotifs({ ...notifs, [item.key]: v })}/>
            </div>
          ))}
        </div>

        <div style={S.section}>
          <div style={S.secTitle}>Privacy</div>
          {[
            { key:'publicProfile', label:'Show profile publicly', sub:'Others can view your seller profile', last:false },
            { key:'showProducts',  label:'Show products on homepage', sub:'Your listings appear in public search', last:true },
          ].map(item => (
            <div key={item.key} style={item.last ? S.toggleRowLast : S.toggleRow}>
              <div style={S.toggleInfo}>
                <div style={S.toggleLabel}>{item.label}</div>
                <div style={S.toggleSub}>{item.sub}</div>
              </div>
              <Toggle defaultOn={privacy[item.key]}
                onChange={v => setPrivacy({ ...privacy, [item.key]: v })}/>
            </div>
          ))}
        </div>

        <div style={S.section}>
          <div style={S.secTitle}>Preferences</div>
          <div style={S.field}>
            <label style={S.label}>Theme</label>
            <select style={S.select} value={theme} onChange={e => setTheme(e.target.value)}>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System default</option>
            </select>
          </div>
          <div style={S.field}>
            <label style={S.label}>Language</label>
            <select style={S.select} value={lang} onChange={e => setLang(e.target.value)}>
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="ar">Arabic</option>
              <option value="es">Spanish</option>
            </select>
          </div>
          <button style={S.btn} onClick={handleSave}>Save preferences</button>
        </div>

        <div style={S.section}>
          <div style={S.secTitle}>Sessions</div>
          <div style={S.toggleRow}>
            <div>
              <div style={S.toggleLabel}>Current session</div>
              <div style={S.toggleSub}>This browser — active now</div>
            </div>
            <span style={{ fontSize:11, padding:'2px 9px', borderRadius:8, background:'rgba(29,158,117,.13)', color:'#1D9E75', fontWeight:500 }}>Active</span>
          </div>
          <div style={S.toggleRowLast}>
            <div>
              <div style={S.toggleLabel}>Sign out everywhere</div>
              <div style={S.toggleSub}>Logs you out of all devices</div>
            </div>
            <button style={S.btnGhost} onClick={handleLogoutAll}>Sign out all</button>
          </div>
        </div>

        <div style={S.danger}>
          <div style={S.dangerTitle}>Danger zone</div>
          <div style={S.dangerRow}>
            <div>
              <div>Export my data</div>
              <div style={S.dangerSub}>Download all your account data</div>
            </div>
            <button style={S.btnDanger}>Export</button>
          </div>
          <div style={S.dangerRowLast}>
            <div>
              <div>Delete account</div>
              <div style={S.dangerSub}>Permanently removes your account and all products</div>
            </div>
            <button style={S.btnDanger} onClick={handleDeleteAccount}>Delete</button>
          </div>
        </div>

      </div>
    </div>
  )
}
import { useState, useEffect } from 'react'
import api from '../api/api'
import Navbar from '../navbar/navbar'
 
const S = {
  page: { minHeight:'100vh', background:'#0f0f0f', color:'#f1f0e8' },
  wrap: { maxWidth:520, margin:'0 auto', padding:'32px 24px' },
  title: { fontSize:18, fontWeight:500, marginBottom:24 },
  avatarRow: { display:'flex', alignItems:'center', gap:16, marginBottom:28 },
  avatar: { width:64, height:64, borderRadius:'50%', background:'#f97316', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:500, color:'#fff', flexShrink:0 },
  userName: { fontSize:17, fontWeight:500 },
  userRole: { fontSize:13, color:'#888780', marginTop:3 },
  editBtn: { marginLeft:'auto', fontSize:12, color:'#f97316', cursor:'pointer', background:'transparent', border:'1px solid rgba(249,115,22,.3)', padding:'5px 12px', borderRadius:6 },
  section: { background:'#1e1e1e', border:'1px solid #2e2e2e', borderRadius:10, padding:16, marginBottom:14 },
  secTitle: { fontSize:13, fontWeight:500, marginBottom:12, color:'#888780' },
  row: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid #2e2e2e', fontSize:13 },
  rowLast: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', fontSize:13 },
  rowLabel: { color:'#888780' },
  chip: { display:'inline-block', padding:'2px 9px', borderRadius:8, fontSize:11, fontWeight:500, background:'rgba(249,115,22,.13)', color:'#f97316' },
  field: { marginBottom:14 },
  label: { display:'block', fontSize:12, color:'#888780', marginBottom:6, fontWeight:500 },
  input: { width:'100%', background:'#222', border:'1px solid #2e2e2e', borderRadius:8, padding:'10px 12px', color:'#f1f0e8', fontSize:13, outline:'none', boxSizing:'border-box' },
  btn: { padding:'9px 20px', borderRadius:8, background:'#f97316', color:'#fff', fontSize:13, fontWeight:500, cursor:'pointer', border:'none' },
  btnGhost: { width:'100%', padding:10, borderRadius:8, background:'transparent', border:'1px solid #2e2e2e', color:'#888780', fontSize:13, cursor:'pointer', marginBottom:8 },
  btnDanger: { width:'100%', padding:10, borderRadius:8, background:'transparent', border:'1px solid #E24B4A', color:'#E24B4A', fontSize:13, cursor:'pointer' },
  danger: { background:'rgba(226,75,74,.06)', border:'1px solid rgba(226,75,74,.25)', borderRadius:10, padding:16 },
  dangerTitle: { fontSize:13, fontWeight:500, color:'#E24B4A', marginBottom:10 },
  dangerRow: { display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:13 },
  dangerSub: { fontSize:12, color:'#888780', marginTop:2 },
  success: { background:'rgba(29,158,117,.1)', border:'1px solid rgba(29,158,117,.25)', borderRadius:7, padding:'9px 12px', fontSize:13, color:'#1D9E75', marginBottom:14 },
  error: { background:'rgba(226,75,74,.1)', border:'1px solid rgba(226,75,74,.25)', borderRadius:7, padding:'9px 12px', fontSize:13, color:'#E24B4A', marginBottom:14 },
}

export default function Profile() {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', email: '' })
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '' })
  const [user, setUser] = useState({})
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [passMsg, setPassMsg] = useState('')
  const [passErr, setPassErr] = useState('')

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user') || '{}')
    setUser(stored)
    setForm({ name: stored.name || '', email: stored.email || '' })
  }, [])

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'U'

  const handleUpdate = async (e) => {
    e.preventDefault()
    setMsg(''); setErr('')
    try {
      const res = await api.put('/api/user/profile', form)
      if (res.data.success) {
        const updated = { ...user, ...form }
        localStorage.setItem('user', JSON.stringify(updated))
        setUser(updated)
        setMsg('Profile updated successfully')
        setEditing(false)
      } else {
        setErr(res.data.message)
      }
    } catch {
      setErr('Failed to update profile')
    }
  }

  const handlePassword = async (e) => {
    e.preventDefault()
    setPassMsg(''); setPassErr('')
    if (!passForm.currentPassword || !passForm.newPassword) {
      setPassErr('Please fill in all fields'); return
    }
    try {
      const res = await api.put('/api/user/password', passForm)
      if (res.data.success) {
        setPassMsg('Password updated successfully')
        setPassForm({ currentPassword: '', newPassword: '' })
      } else {
        setPassErr(res.data.message)
      }
    } catch {
      setPassErr('Failed to update password')
    }
  }

  return (
    <div style={S.page}>
      <Navbar />
      <div style={S.wrap}>
        <div style={S.title}>My profile</div>

        <div style={S.avatarRow}>
          <div style={S.avatar}>{initials}</div>
          <div>
            <div style={S.userName}>{user.name}</div>
            <div style={S.userRole}>Member</div>
          </div>
          <button style={S.editBtn} onClick={() => setEditing(!editing)}>
            {editing ? 'Cancel' : 'Edit profile'}
          </button>
        </div>

        {!editing ? (
          <div style={S.section}>
            <div style={S.row}><span style={S.rowLabel}>Full name</span><span>{user.name}</span></div>
            <div style={S.row}><span style={S.rowLabel}>Email</span><span>{user.email}</span></div>
            <div style={S.rowLast}><span style={S.rowLabel}>Role</span><span style={S.chip}>User</span></div>
          </div>
        ) : (
          <form style={S.section} onSubmit={handleUpdate}>
            <div style={S.secTitle}>Edit personal info</div>
            {msg && <div style={S.success}>{msg}</div>}
            {err && <div style={S.error}>{err}</div>}
            <div style={S.field}>
              <label style={S.label}>Full name</label>
              <input style={S.input} value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}/>
            </div>
            <div style={S.field}>
              <label style={S.label}>Email address</label>
              <input style={S.input} type="email" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}/>
            </div>
            <button type="submit" style={S.btn}>Save changes</button>
          </form>
        )}

        <form style={S.section} onSubmit={handlePassword}>
          <div style={S.secTitle}>Change password</div>
          {passMsg && <div style={S.success}>{passMsg}</div>}
          {passErr && <div style={S.error}>{passErr}</div>}
          <div style={S.field}>
            <label style={S.label}>Current password</label>
            <input style={S.input} type="password" placeholder="••••••••"
              value={passForm.currentPassword}
              onChange={e => setPassForm({ ...passForm, currentPassword: e.target.value })}/>
          </div>
          <div style={S.field}>
            <label style={S.label}>New password</label>
            <input style={S.input} type="password" placeholder="••••••••"
              value={passForm.newPassword}
              onChange={e => setPassForm({ ...passForm, newPassword: e.target.value })}/>
          </div>
          <button type="submit" style={S.btn}>Update password</button>
        </form>

        <div style={S.section}>
          <div style={S.secTitle}>Account actions</div>
          <button style={S.btnGhost}>Download my data</button>
          <div style={S.danger}>
            <div style={S.dangerTitle}>Danger zone</div>
            <div style={S.dangerRow}>
              <div>
                <div>Delete account</div>
                <div style={S.dangerSub}>Permanently removes your account and all products</div>
              </div>
              <button
                style={{ ...S.btnDanger, width:'auto', padding:'6px 14px', marginLeft:12 }}
                onClick={() => { if(confirm('Are you sure?')) alert('Account deleted') }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
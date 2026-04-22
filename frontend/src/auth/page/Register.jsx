import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../api/auth'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [strength, setStrength] = useState(0)
  const [terms, setTerms] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    setError('')
    if (name === 'password') calcStrength(value)
  }

  const calcStrength = (val) => {
    let score = 0
    if (val.length >= 8) score++
    if (/[A-Z]/.test(val)) score++
    if (/[0-9]/.test(val)) score++
    if (/[^A-Za-z0-9]/.test(val)) score++
    setStrength(score)
  }

  const strengthColor = ['#E24B4A', '#f97316', '#EF9F27', '#1D9E75'][strength - 1] || '#2e2e2e'
  const strengthLabel = ['Weak', 'Fair', 'Good', 'Strong'][strength - 1] || ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError('Please fill in all fields.'); return
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.'); return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.'); return
    }
    if (!terms) {
      setError('Please accept the terms to continue.'); return
    }
    setLoading(true)
    try {
      const res = await register({ name: form.name, email: form.email, password: form.password })
      const { data } = res
      if (!data.success) {
        setError(data.message); return
      }
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.bg}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <div style={styles.brand}>
          <div style={styles.logo}>ShopPlay</div>
          <div style={styles.sub}>Create your account — it's free</div>
        </div>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.successMsg}>Account created! Redirecting to login...</div>}

        <div style={styles.field}>
          <label style={styles.label}>Full name</label>
          <input style={styles.input} name="name" placeholder="John Doe" value={form.name} onChange={handleChange}/>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Email address</label>
          <input style={styles.input} type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange}/>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <div style={styles.inputWrap}>
            <input
              style={{ ...styles.input, paddingRight: 40 }}
              type={showPass ? 'text' : 'password'}
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />
            <span style={styles.eye} onClick={() => setShowPass(!showPass)}>
              {showPass ? '🙈' : '👁'}
            </span>
          </div>
          {form.password && (
            <div style={{ marginTop: 6 }}>
              <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength ? strengthColor : '#2e2e2e', transition: 'background .2s' }}/>
                ))}
              </div>
              <div style={{ fontSize: 11, color: strengthColor }}>{strengthLabel}</div>
            </div>
          )}
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Confirm password</label>
          <input style={styles.input} type="password" name="confirm" placeholder="••••••••" value={form.confirm} onChange={handleChange}/>
        </div>

        <div style={styles.checkRow}>
          <input type="checkbox" id="terms" checked={terms} onChange={e => setTerms(e.target.checked)} style={{ accentColor: '#f97316', marginTop: 2 }}/>
          <label htmlFor="terms" style={{ fontSize: 12, color: '#888780', lineHeight: 1.5 }}>
            I agree to the <span style={{ color: '#f97316', cursor: 'pointer' }}>Terms of Service</span> and <span style={{ color: '#f97316', cursor: 'pointer' }}>Privacy Policy</span>
          </label>
        </div>

        <button style={styles.btn} type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </button>

        <div style={styles.linkRow}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Sign in</Link>
        </div>
      </form>
    </div>
  )
}

const styles = {
  bg: { minHeight: '100vh', background: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 },
  card: { background: '#1e1e1e', border: '1px solid #2e2e2e', borderRadius: 14, padding: 32, width: '100%', maxWidth: 380 },
  brand: { textAlign: 'center', marginBottom: 28 },
  logo: { fontSize: 22, fontWeight: 500, color: '#f97316', marginBottom: 6 },
  sub: { fontSize: 13, color: '#888780' },
  error: { background: 'rgba(226,75,74,.1)', border: '1px solid rgba(226,75,74,.25)', borderRadius: 7, padding: '9px 12px', fontSize: 13, color: '#E24B4A', marginBottom: 14 },
  successMsg: { background: 'rgba(29,158,117,.1)', border: '1px solid rgba(29,158,117,.25)', borderRadius: 7, padding: '9px 12px', fontSize: 13, color: '#1D9E75', marginBottom: 14 },
  field: { marginBottom: 16 },
  label: { display: 'block', fontSize: 12, color: '#888780', marginBottom: 6, fontWeight: 500 },
  input: { width: '100%', background: '#222', border: '1px solid #2e2e2e', borderRadius: 8, padding: '11px 13px', color: '#f1f0e8', fontSize: 14, outline: 'none', boxSizing: 'border-box' },
  inputWrap: { position: 'relative' },
  eye: { position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: 14 },
  btn: { width: '100%', padding: 12, borderRadius: 8, background: '#f97316', color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer', border: 'none', marginTop: 4 },
  link: { color: '#f97316', cursor: 'pointer', textDecoration: 'none', fontWeight: 500 },
  linkRow: { textAlign: 'center', fontSize: 13, color: '#888780', marginTop: 18 },
  checkRow: { display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 14 },
}
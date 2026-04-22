import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api/auth'
 
export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    try {
      const res = await login(form)
      const { data } = res
      if (!data.success) {
        setError(data.message)
        return
      }
      localStorage.setItem('token', data.data.token)
      navigate('/dashboard')
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
          <div style={styles.sub}>Welcome back — sign in to continue</div>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.field}>
          <label style={styles.label}>Email address</label>
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
          />
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
        </div>

        <div style={styles.forgot}>
          <span style={styles.link}>Forgot password?</span>
        </div>

        <button style={styles.btn} type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        <div style={styles.linkRow}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>Create one</Link>
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
  field: { marginBottom: 16 },
  label: { display: 'block', fontSize: 12, color: '#888780', marginBottom: 6, fontWeight: 500 },
  input: { width: '100%', background: '#222', border: '1px solid #2e2e2e', borderRadius: 8, padding: '11px 13px', color: '#f1f0e8', fontSize: 14, outline: 'none', boxSizing: 'border-box' },
  inputWrap: { position: 'relative' },
  eye: { position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: 14 },
  forgot: { textAlign: 'right', marginTop: -8, marginBottom: 16 },
  btn: { width: '100%', padding: 12, borderRadius: 8, background: '#f97316', color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer', border: 'none', marginTop: 4 },
  link: { color: '#f97316', cursor: 'pointer', textDecoration: 'none', fontWeight: 500 },
  linkRow: { textAlign: 'center', fontSize: 13, color: '#888780', marginTop: 18 },
}
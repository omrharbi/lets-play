import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'
import Navbar from '../navbar/navbar'

const S = {
  page: { minHeight: '100vh', background: '#0f0f0f', color: '#f1f0e8' },
  wrap: { maxWidth: 560, margin: '0 auto', padding: '32px 24px' },
  back: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#888780', cursor: 'pointer', marginBottom: 24, background: 'none', border: 'none', padding: 0 },
  title: { fontSize: 18, fontWeight: 500, marginBottom: 24 },
  card: { background: '#1e1e1e', border: '1px solid #2e2e2e', borderRadius: 12, padding: 24 },
  field: { marginBottom: 18 },
  label: { display: 'block', fontSize: 12, color: '#888780', marginBottom: 7, fontWeight: 500 },
  input: { width: '100%', background: '#222', border: '1px solid #2e2e2e', borderRadius: 8, padding: '11px 13px', color: '#f1f0e8', fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color .15s' },
  textarea: { width: '100%', background: '#222', border: '1px solid #2e2e2e', borderRadius: 8, padding: '11px 13px', color: '#f1f0e8', fontSize: 14, outline: 'none', boxSizing: 'border-box', resize: 'vertical', minHeight: 100, fontFamily: 'inherit' },
  imgUpload: { width: '100%', height: 140, background: '#222', border: '2px dashed #2e2e2e', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', transition: 'border-color .15s' },
  imgLabel: { fontSize: 13, color: '#888780' },
  imgSub: { fontSize: 12, color: '#444441' },
  actions: { display: 'flex', gap: 10, marginTop: 24 },
  btnSubmit: { flex: 1, padding: 12, borderRadius: 8, background: '#f97316', color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer', border: 'none' },
  btnCancel: { padding: '12px 20px', borderRadius: 8, background: 'transparent', color: '#888780', fontSize: 14, cursor: 'pointer', border: '1px solid #2e2e2e' },
  success: { background: 'rgba(29,158,117,.1)', border: '1px solid rgba(29,158,117,.25)', borderRadius: 7, padding: '9px 12px', fontSize: 13, color: '#1D9E75', marginBottom: 16 },
  error: { background: 'rgba(226,75,74,.1)', border: '1px solid rgba(226,75,74,.25)', borderRadius: 7, padding: '9px 12px', fontSize: 13, color: '#E24B4A', marginBottom: 16 },
  hint: { fontSize: 11, color: '#888780', marginTop: 5 },
  priceWrap: { position: 'relative' },
  pricePre: { position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#888780', fontSize: 14 },
}

export default function AddProduct() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', description: '', price: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }


  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Product name is required'); return }
    if (!form.description.trim()) { setError('Description is required'); return }
    if (!form.price || Number(form.price) <= 0) { setError('Price must be greater than 0'); return }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('description', form.description)
      formData.append('price', form.price)
      if (imageFile) formData.append('image', imageFile)
      const res = await api.post('/api/product/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
      )
      if (res.data.success) {
        setSuccess('Product created successfully!')
        setForm({ name: '', description: '', price: '' })
        setTimeout(() => navigate('/my-products'), 1500)
      } else {
        setError(res.data.message)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={S.page}>
      <Navbar />
      <div style={S.wrap}>
        <button style={S.back} onClick={() => navigate('/my-products')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to my products
        </button>

        <div style={S.title}>Add new product</div>

        <div style={S.card}>
          {success && <div style={S.success}>{success}</div>}
          {error && <div style={S.error}>{error}</div>}

          <form onSubmit={handleSubmit}>

            <div style={S.field}>
              <label style={S.label}>Product image</label>
              <input type="file" accept="image/*" onChange={handleImageChange}
                style={{ display: 'none' }} id="img-input" />

              <label htmlFor="img-input">
                {imagePreview ? (
                  <img src={imagePreview} alt="preview"
                    style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 10, cursor: 'pointer' }} />
                ) : (
                  <div style={S.imgUpload}>
                    <div style={S.imgLabel}>Click to upload image</div>
                    <div style={S.imgSub}>PNG, JPG up to 5MB</div>
                  </div>
                )}
              </label>
            </div>

            <div style={S.field}>
              <label style={S.label}>Product name</label>
              <input
                style={S.input}
                name="name"
                placeholder="e.g. Wireless Headphones"
                value={form.name}
                onChange={handleChange}
                onFocus={e => e.target.style.borderColor = '#f97316'}
                onBlur={e => e.target.style.borderColor = '#2e2e2e'}
              />
            </div>

            <div style={S.field}>
              <label style={S.label}>Description</label>
              <textarea
                style={S.textarea}
                name="description"
                placeholder="Describe your product in detail..."
                value={form.description}
                onChange={handleChange}
                onFocus={e => e.target.style.borderColor = '#f97316'}
                onBlur={e => e.target.style.borderColor = '#2e2e2e'}
              />
              <div style={S.hint}>{form.description.length} / 500 characters</div>
            </div>

            <div style={S.field}>
              <label style={S.label}>Price</label>
              <div style={S.priceWrap}>
                <span style={S.pricePre}>$</span>
                <input
                  style={{ ...S.input, paddingLeft: 26 }}
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.price}
                  onChange={handleChange}
                  onFocus={e => e.target.style.borderColor = '#f97316'}
                  onBlur={e => e.target.style.borderColor = '#2e2e2e'}
                />
              </div>
            </div>

            <div style={S.actions}>
              <button type="button" style={S.btnCancel} onClick={() => navigate('/my-products')}>
                Cancel
              </button>
              <button type="submit" style={S.btnSubmit} disabled={loading}>
                {loading ? 'Creating...' : 'Create product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
import React, { useState, useEffect, useRef } from 'react'
import flatpickr from 'flatpickr'
import { Indonesian } from 'flatpickr/dist/l10n/id.js'
import { parseActivityDateTime } from '../utils/datetime'

const initialForm = {
  title: '',
  description: '',
  datetime: '',
  maps_url: '',
}

const CalendarIcon = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M16 3v4M8 3v4M3 10h18" />
  </svg>
)

const MapPinIcon = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
)

export default function ActivityForm({ activity, onSubmit, onClose, loading, darkMode }) {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const dateTimeInputRef = useRef(null)

  const formatDateTimeForApi = (date) => {
    const pad = (n) => String(n).padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:00`
  }

  useEffect(() => {
    if (activity) {
      const dt = parseActivityDateTime(activity.datetime)
      setForm({
        title: activity.title || '',
        description: activity.description || '',
        datetime: dt ? formatDateTimeForApi(dt) : '',
        maps_url: activity.maps_url || '',
      })
    } else {
      setForm(initialForm)
    }
    setErrors({})
  }, [activity])

  useEffect(() => {
    if (!dateTimeInputRef.current) return

    const picker = flatpickr(dateTimeInputRef.current, {
      locale: Indonesian,
      enableTime: true,
      time_24hr: true,
      dateFormat: 'Y-m-d H:i:S',
      altInput: true,
      altFormat: 'j F Y, H:i',
      allowInput: false,
      defaultDate: form.datetime || null,
      onChange: (selectedDates) => {
        const selected = selectedDates[0]
        setForm((prev) => ({ ...prev, datetime: selected ? formatDateTimeForApi(selected) : '' }))
        setErrors((prev) => (prev.datetime ? { ...prev, datetime: '' } : prev))
      },
      onReady: (_, __, instance) => {
        instance.altInput?.setAttribute('placeholder', 'Pilih tanggal & waktu')
      },
    })

    return () => picker.destroy()
  }, [])

  useEffect(() => {
    const input = dateTimeInputRef.current
    if (!input || !input._flatpickr) return
    input._flatpickr.setDate(form.datetime || null, false, 'Y-m-d H:i:S')
  }, [form.datetime])

  const isValidUrl = (url) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!form.title.trim()) newErrors.title = 'Nama lokasi wajib diisi'
    if (!form.datetime) newErrors.datetime = 'Tanggal & waktu wajib diisi'
    if (form.maps_url && !isValidUrl(form.maps_url)) newErrors.maps_url = 'URL Google Maps tidak valid'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit(form)
  }

  const inputClass = (field) => `
    w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 outline-none
    ${darkMode
      ? 'bg-[#3b2a21] border border-[#6b4d39] text-[#f3e3d2] placeholder-[#c2a58c] focus:border-[#e0c1a1] focus:ring-2 focus:ring-[#e0c1a1]/30'
      : 'bg-[#fffaf3] border border-[#cfaa83]/55 text-[#3f2b1e] placeholder-[#8f755f] focus:border-[#9c6a46] focus:ring-2 focus:ring-[#af8a68]/20'
    }
    ${errors[field] ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}
  `

  const labelClass = `block text-sm font-semibold mb-1.5 ${darkMode ? 'text-[#e2c8ae]' : 'text-[#6a4a35]'}`

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 modal-backdrop animate-fade-in"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-modal-slide-up ${darkMode ? 'bg-[#2a1f19]' : 'bg-[#fffaf3]'} max-h-[90vh] flex flex-col`}>
        <div className={`flex items-center justify-between px-6 py-5 border-b flex-shrink-0 ${darkMode ? 'border-[#6b4d39]' : 'border-[#cfaa83]/45'}`}>
          <div>
            <p className={`text-xs font-medium uppercase tracking-widest mb-1 ${darkMode ? 'text-[#e0c1a1]' : 'text-[#8a5f41]'}`}>
              {activity ? 'Edit Kegiatan' : 'Tambah Kegiatan'}
            </p>
            <h2 className={`font-display text-xl font-semibold ${darkMode ? 'text-[#eadfce]' : 'text-[#3f2b1e]'}`}>
              {activity ? 'Perbarui Detail' : 'Destinasi Baru'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all duration-200 hover:scale-105 active:scale-95 ${darkMode ? 'bg-[#5b402f] border border-[#7b5a43] text-[#f4e6d6] hover:bg-[#6a4a35]' : 'bg-[#eadfce] text-[#7d6049] hover:text-[#3f2b1e]'}`}
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className={`${labelClass} flex items-center gap-2`}>
                <MapPinIcon className="w-4 h-4" />
                <span>Nama Lokasi <span className="text-red-400">*</span></span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="contoh: Candi Borobudur"
                className={inputClass('title')}
              />
              {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title}</p>}
            </div>

            <div>
              <label className={`${labelClass} flex items-center gap-2`}>
                <CalendarIcon className="w-4 h-4" />
                <span>Tanggal & Waktu <span className="text-red-400">*</span></span>
              </label>
              <input
                ref={dateTimeInputRef}
                type="text"
                name="datetime"
                className={inputClass('datetime')}
              />
              {errors.datetime && <p className="mt-1 text-xs text-red-400">{errors.datetime}</p>}
            </div>

            <div>
              <label className={labelClass}>Deskripsi Kegiatan</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Ceritakan pengalaman atau rencana kegiatanmu di sini..."
                rows={3}
                className={`${inputClass('description')} resize-none`}
              />
            </div>

            <div>
              <label className={labelClass}>Link Google Maps</label>
              <input
                type="url"
                name="maps_url"
                value={form.maps_url}
                onChange={handleChange}
                placeholder="https://maps.google.com/?q=..."
                className={inputClass('maps_url')}
              />
              {errors.maps_url && <p className="mt-1 text-xs text-red-400">{errors.maps_url}</p>}
              <p className={`mt-1 text-xs ${darkMode ? 'text-[#c2a58c]' : 'text-[#8f755f]'}`}>
                Tip: Buka Google Maps, klik lokasi, lalu salin link dari address bar.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all duration-200 active:scale-95 ${darkMode ? 'bg-[#5b402f] border border-[#7b5a43] text-[#f4e6d6] hover:bg-[#6a4a35]' : 'bg-[#eadfce] text-[#6a4a35] hover:bg-[#d2bca2]'}`}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#8a5f41] to-[#9c6a46] text-white transition-all duration-200 hover:brightness-105 hover:shadow-lg hover:shadow-[#8a5f41]/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <span>{activity ? 'Simpan Perubahan' : 'Tambah Kegiatan'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

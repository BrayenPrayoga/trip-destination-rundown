import React, { useState, useEffect, useCallback, useRef } from 'react'
import flatpickr from 'flatpickr'
import { Indonesian } from 'flatpickr/dist/l10n/id.js'
import { activityApi } from './api'
import Timeline from './components/Timeline'
import ActivityForm from './components/ActivityForm'
import { parseActivityDateTime } from './utils/datetime'

const Icon = {
  plane: ({ className = 'w-5 h-5' }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 14 20 4" />
      <path d="M21 3 14 21l-4-7-7-4 18-7Z" />
    </svg>
  ),
  moon: ({ className = 'w-4 h-4' }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />
    </svg>
  ),
  sun: ({ className = 'w-4 h-4' }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  ),
  mapPin: ({ className = 'w-5 h-5' }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  calendar: ({ className = 'w-5 h-5' }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </svg>
  ),
  bolt: ({ className = 'w-5 h-5' }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m13 2-8 12h6l-1 8 9-13h-6l1-7Z" />
    </svg>
  ),
  search: ({ className = 'w-4 h-4' }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  ),
  trash: ({ className = 'w-6 h-6' }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
    </svg>
  ),
}

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={`
        fixed bottom-5 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-6 sm:bottom-6 z-[100]
        flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl max-w-sm
        ${type === 'success' ? 'bg-[#8a5f41] text-white' : 'bg-[#7a2f2f] text-white'}
      `}
    >
      <span className="text-lg">{type === 'success' ? '✓' : '!'}</span>
      <span className="font-medium text-sm">{message}</span>
      <button onClick={onClose} className="ml-auto text-white/70 hover:text-white">×</button>
    </div>
  )
}

export default function App() {
  const [activities, setActivities] = useState([])
  const [filteredActivities, setFilteredActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingActivity, setEditingActivity] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [filterDate, setFilterDate] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [toast, setToast] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const filterDateInputRef = useRef(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    if (!filterDateInputRef.current) return

    const picker = flatpickr(filterDateInputRef.current, {
      locale: Indonesian,
      dateFormat: 'Y-m-d',
      altInput: true,
      altFormat: 'j F Y',
      allowInput: false,
      defaultDate: filterDate || null,
      onChange: (_, dateStr) => {
        setFilterDate(dateStr || '')
      },
      onReady: (_, __, instance) => {
        instance.altInput?.setAttribute('placeholder', 'Pilih tanggal')
      },
    })

    return () => picker.destroy()
  }, [])

  useEffect(() => {
    const input = filterDateInputRef.current
    if (!input || !input._flatpickr) return
    input._flatpickr.setDate(filterDate || null, false)
  }, [filterDate])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true)
      const params = {}
      if (filterDate) params.date = filterDate
      const res = await activityApi.getAll(params)
      const data = res.data?.data
      setActivities(Array.isArray(data) ? data : [])
    } catch {
      showToast('Gagal memuat data kegiatan', 'error')
    } finally {
      setLoading(false)
    }
  }, [filterDate])

  useEffect(() => {
    fetchActivities()
  }, [fetchActivities])

  useEffect(() => {
    const safe = Array.isArray(activities) ? activities : []
    if (!searchQuery.trim()) {
      setFilteredActivities(safe)
      return
    }
    const q = searchQuery.toLowerCase()
    setFilteredActivities(
      safe.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          (a.description && a.description.toLowerCase().includes(q))
      )
    )
  }, [activities, searchQuery])

  const handleCreate = async (formData) => {
    try {
      setFormLoading(true)
      await activityApi.create(formData)
      showToast('Kegiatan berhasil ditambahkan', 'success')
      setShowForm(false)
      fetchActivities()
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal menambahkan kegiatan'
      showToast(msg, 'error')
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdate = async (formData) => {
    try {
      setFormLoading(true)
      await activityApi.update(editingActivity.id, formData)
      showToast('Kegiatan berhasil diperbarui', 'success')
      setEditingActivity(null)
      setShowForm(false)
      fetchActivities()
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal memperbarui kegiatan'
      showToast(msg, 'error')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await activityApi.delete(id)
      showToast('Kegiatan berhasil dihapus')
      setDeleteConfirm(null)
      fetchActivities()
    } catch {
      showToast('Gagal menghapus kegiatan', 'error')
    }
  }

  const openEdit = (activity) => {
    setEditingActivity(activity)
    setShowForm(true)
  }

  const openCreate = () => {
    setEditingActivity(null)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingActivity(null)
  }

  const safeActivities = Array.isArray(activities) ? activities : []
  const totalDays = [
    ...new Set(
      safeActivities
        .map((a) => parseActivityDateTime(a.datetime))
        .filter(Boolean)
        .map((d) => d.toDateString())
    ),
  ].length

  const stats = [
    { label: 'Total Destinasi', value: safeActivities.length, icon: Icon.mapPin },
    { label: 'Hari Perjalanan', value: totalDays, icon: Icon.calendar },
    {
      label: 'Kegiatan Hari Ini',
      value: safeActivities.filter((a) => {
        const d = parseActivityDateTime(a.datetime)
        if (!d) return false
        const now = new Date()
        return d.toDateString() === now.toDateString()
      }).length,
      icon: Icon.bolt,
    },
  ]

  const totalPriceAllCards = filteredActivities.reduce((total, activity) => {
    let items = []
    if (Array.isArray(activity.price_items)) {
      items = activity.price_items
    } else if (typeof activity.price_items === 'string') {
      try {
        const parsed = JSON.parse(activity.price_items)
        if (Array.isArray(parsed)) items = parsed
      } catch {
        items = []
      }
    }

    const cardTotal = items.reduce((sum, item) => sum + Number(item?.amount || 0), 0)
    return total + (Number.isNaN(cardTotal) ? 0 : cardTotal)
  }, 0)

  const totalPriceLabel = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(totalPriceAllCards)

  return (
    <div className={`min-h-screen bg-pattern transition-colors duration-300 ${darkMode ? 'bg-[#1f1611] text-[#eadfce]' : 'text-[#3f2b1e]'}`}>
      <header
        className={`
          sticky top-0 z-40 transition-all duration-300
          ${darkMode ? 'bg-[#2b1f18]/95 border-b border-[#4a3527]' : 'bg-[#f7f1e8]/95 border-b border-[#cfaa83]/45'}
          backdrop-blur-md
        `}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#8a5f41] to-[#9c6a46] flex items-center justify-center shadow-md text-[#f4eadf]">
                <Icon.plane className="w-5 h-5" />
              </div>
              <div>
                <h1 className={`font-display text-lg sm:text-xl font-bold leading-none ${darkMode ? 'text-[#eadfce]' : 'text-[#3f2b1e]'}`}>
                  Brayen & Fitri
                </h1>
                <p className={`${darkMode ? 'text-[#bda58f]' : 'text-[#7d6049]'} text-xs mt-0.5`}>
                  Trip Destination Rundown
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 ${darkMode ? 'bg-[#5b402f] text-[#f4e6d6] border border-[#7b5a43] hover:bg-[#6a4a35]' : 'bg-[#eadfce] text-[#6a4a35]'}`}
                title={darkMode ? 'Mode Terang' : 'Mode Gelap'}
              >
                {darkMode ? <Icon.sun /> : <Icon.moon />}
              </button>

              <button
                onClick={openCreate}
                className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#8a5f41] to-[#9c6a46] text-white transition-all duration-200 hover:brightness-105 active:scale-95"
              >
                <span>+</span>
                <span className="hidden sm:inline">Tambah</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-3xl mx-auto px-4 sm:px-6 pb-24 sm:pb-16">
        <div className="py-4 sm:py-8">
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5 sm:mb-6">
            {stats.map((stat, i) => {
              const StatIcon = stat.icon
              return (
                <div
                  key={i}
                  className={`rounded-2xl p-3 sm:p-4 text-center transition-all duration-300 ${darkMode ? 'bg-[#372820]/95 border border-[#5d4332]' : 'bg-[#f7f1e8]/85 border border-[#cfaa83]/55'} shadow-sm hover:shadow-md`}
                >
                  <div className={`flex justify-center mb-1 ${darkMode ? 'text-[#d2bca2]' : 'text-[#8a5f41]'}`}>
                    <StatIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className={`font-display text-xl sm:text-2xl font-bold ${darkMode ? 'text-[#d2bca2]' : 'text-[#8a5f41]'}`}>
                    {stat.value}
                  </div>
                  <div className={`${darkMode ? 'text-[#d4b9a0]' : 'text-[#7d6049]'} text-[11px] sm:text-xs mt-0.5 leading-tight`}>
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>

          <div className={`mb-4 sm:mb-5 rounded-xl px-4 py-2.5 border text-center ${darkMode ? 'bg-[#33251e] border-[#5d4332]' : 'bg-[#f6ede3] border-[#cfaa83]/55'}`}>
            <p className={`${darkMode ? 'text-white' : 'text-[#3f2b1e]'} text-sm sm:text-base font-bold`}>
              {totalPriceLabel}
            </p>
          </div>

          <div className={`rounded-2xl p-3 sm:p-0 ${darkMode ? 'bg-[#2a1f19]/85 sm:bg-transparent border border-[#5d4332] sm:border-0' : 'bg-[#f7f1e8]/80 sm:bg-transparent border border-[#cfaa83]/45 sm:border-0'}`}>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${darkMode ? 'text-[#d9bda4]' : 'text-[#8a5f41]'}`}><Icon.search /></span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari destinasi..."
                  className={`w-full pl-10 pr-4 py-3 sm:py-2.5 rounded-xl text-sm outline-none transition-all duration-200 ${darkMode ? 'bg-[#3b2a21] border border-[#6b4d39] text-[#f3e3d2] placeholder-[#c2a58c] focus:border-[#e0c1a1]' : 'bg-[#fffdf9] border border-[#cfaa83]/55 text-[#3f2b1e] placeholder-[#8f755f] focus:border-[#9c6a46]'} focus:ring-2 ${darkMode ? 'focus:ring-[#e0c1a1]/30' : 'focus:ring-[#af8a68]/25'}`}
                />
              </div>

              <div className="relative">
                <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${darkMode ? 'text-[#d9bda4]' : 'text-[#8a5f41]'}`}><Icon.calendar className="w-4 h-4" /></span>
                <input
                  ref={filterDateInputRef}
                  type="text"
                  className={`pl-10 pr-4 py-3 sm:py-2.5 rounded-xl text-sm outline-none transition-all duration-200 w-full sm:w-auto ${darkMode ? 'bg-[#3b2a21] border border-[#6b4d39] text-[#f3e3d2] focus:border-[#e0c1a1]' : 'bg-[#fffdf9] border border-[#cfaa83]/55 text-[#3f2b1e] focus:border-[#9c6a46]'} focus:ring-2 ${darkMode ? 'focus:ring-[#e0c1a1]/30' : 'focus:ring-[#af8a68]/25'}`}
                />
              </div>

              {(filterDate || searchQuery) && (
                <button
                  onClick={() => {
                    setFilterDate('')
                    setSearchQuery('')
                  }}
                  className={`px-4 py-3 sm:py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${darkMode ? 'bg-[#5b402f] text-[#f4e6d6] hover:bg-[#6a4a35] border border-[#7b5a43]' : 'bg-[#eadfce] text-[#6a4a35] hover:bg-[#d2bca2] border border-[#cfaa83]/55'}`}
                >
                  Reset Filter
                </button>
              )}
            </div>
          </div>
        </div>

        <Timeline
          activities={filteredActivities}
          loading={loading}
          onEdit={openEdit}
          onDelete={(id) => setDeleteConfirm(id)}
          onAdd={openCreate}
          darkMode={darkMode}
        />
      </main>

      {showForm && (
        <ActivityForm
          activity={editingActivity}
          onSubmit={editingActivity ? handleUpdate : handleCreate}
          onClose={closeForm}
          loading={formLoading}
          darkMode={darkMode}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in modal-backdrop" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-modal-slide-up ${darkMode ? 'bg-[#2f221b]' : 'bg-[#fffaf3]'}`}>
            <div className="text-center mb-5">
              <div className={`mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-3 ${darkMode ? 'bg-[#5b402f] text-[#f4e6d6] border border-[#7b5a43]' : 'bg-[#eadfce] text-[#6a4a35]'}`}>
                <Icon.trash />
              </div>
              <h3 className={`font-display text-xl font-semibold mb-2 ${darkMode ? 'text-[#eadfce]' : 'text-[#3f2b1e]'}`}>
                Hapus Kegiatan?
              </h3>
              <p className={`text-sm ${darkMode ? 'text-[#bda58f]' : 'text-[#7d6049]'}`}>
                Tindakan ini tidak dapat dibatalkan. Kegiatan akan dihapus secara permanen.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${darkMode ? 'bg-[#5b402f] text-[#f4e6d6] hover:bg-[#6a4a35] border border-[#7b5a43]' : 'bg-[#eadfce] text-[#6a4a35] hover:bg-[#d2bca2]'}`}
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-3 rounded-xl font-semibold text-sm bg-[#7a2f2f] text-white hover:bg-[#612525] transition-all duration-200 active:scale-95"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {!showForm && (
        <button
          onClick={openCreate}
          className="sm:hidden fixed z-40 right-5 bottom-6 w-14 h-14 rounded-2xl text-2xl font-bold text-white bg-gradient-to-r from-[#8a5f41] to-[#9c6a46] shadow-xl shadow-[#8a5f41]/35 active:scale-95"
          aria-label="Tambah kegiatan"
        >
          +
        </button>
      )}
    </div>
  )
}

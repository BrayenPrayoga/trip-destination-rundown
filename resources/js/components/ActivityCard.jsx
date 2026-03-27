import React from 'react'
import { parseActivityDateTime } from '../utils/datetime'

const Icon = {
  mapPin: ({ className = 'w-5 h-5' }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  landmark: ({ className = 'w-5 h-5' }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 21h16M6 18h12M8 18V9m8 9V9M12 5l8 4H4l8-4Z" />
    </svg>
  ),
  mountain: ({ className = 'w-5 h-5' }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 20 7-12 3 5 2-3 6 10H3Z" />
    </svg>
  ),
  utensils: ({ className = 'w-5 h-5' }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 3v8M7 3v8M4 7h3M6 11v10M13 3v7a3 3 0 0 0 3 3h0v8" />
    </svg>
  ),
  shop: ({ className = 'w-5 h-5' }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9h18l-1 11H4L3 9Z" />
      <path d="M7 9V6a5 5 0 0 1 10 0v3" />
    </svg>
  ),
  tree: ({ className = 'w-5 h-5' }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21v-5M5 11a7 7 0 0 1 14 0c0 2.8-2.2 5-5 5H10c-2.8 0-5-2.2-5-5Z" />
    </svg>
  ),
  clock: ({ className = 'w-4 h-4' }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6l4 2" />
    </svg>
  ),
  edit: ({ className = 'w-4 h-4' }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m4 20 4.5-1 9-9-3.5-3.5-9 9L4 20Z" />
    </svg>
  ),
  trash: ({ className = 'w-4 h-4' }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
    </svg>
  ),
  route: ({ className = 'w-4 h-4' }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="6" r="2" />
      <path d="M8 18c6 0 2-8 8-8" />
    </svg>
  ),
  tiktok: ({ className = 'w-4 h-4' }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M14.5 4h2.6c.4 1.6 1.4 2.7 2.9 3.1V9c-1.5-.1-2.8-.6-3.8-1.5v6.2a5.2 5.2 0 1 1-5.2-5.2c.4 0 .8 0 1.2.1v2.2a3 3 0 1 0 1.9 2.9V4Z" />
    </svg>
  ),
}

const getIcon = (title) => {
  const lower = (title || '').toLowerCase()
  if (lower.includes('candi') || lower.includes('temple') || lower.includes('borobudur') || lower.includes('prambanan')) return Icon.landmark
  if (lower.includes('gunung') || lower.includes('mountain') || lower.includes('bukit')) return Icon.mountain
  if (lower.includes('kuliner') || lower.includes('makan') || lower.includes('food') || lower.includes('warung')) return Icon.utensils
  if (lower.includes('pasar') || lower.includes('market') || lower.includes('malioboro') || lower.includes('belanja')) return Icon.shop
  if (lower.includes('hutan') || lower.includes('forest') || lower.includes('pinus')) return Icon.tree
  return Icon.mapPin
}

const formatDate = (datetime) => {
  const date = parseActivityDateTime(datetime)
  if (!date) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

const formatTime = (datetime) => {
  const date = parseActivityDateTime(datetime)
  if (!date) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}

const isUpcoming = (datetime) => {
  const now = new Date()
  const activityTime = parseActivityDateTime(datetime)
  if (!activityTime) return false
  const diffMs = activityTime - now
  return diffMs > 0 && diffMs < 24 * 60 * 60 * 1000
}

const isToday = (datetime) => {
  const now = new Date()
  const activityDate = parseActivityDateTime(datetime)
  if (!activityDate) return false
  return (
    activityDate.getDate() === now.getDate() &&
    activityDate.getMonth() === now.getMonth() &&
    activityDate.getFullYear() === now.getFullYear()
  )
}

export default function ActivityCard({ activity, index, onEdit, onDelete, darkMode }) {
  const PlaceIcon = getIcon(activity.title)
  const upcoming = isUpcoming(activity.datetime)
  const today = isToday(activity.datetime)

  return (
    <div className={`group relative opacity-0 animate-fade-in-up stagger-${Math.min(index + 1, 5)}`}>
      <div className="flex gap-3 sm:gap-6">
        <div className="flex flex-col items-center flex-shrink-0">
          <div
            className={`
              relative z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center
              shadow-lg transition-all duration-300 group-hover:scale-105
              ${upcoming
                ? 'bg-gradient-to-br from-[#8a5f41] to-[#9c6a46] ring-4 ring-[#cfaa83]/45'
                : today
                  ? 'bg-gradient-to-br from-[#af8a68] to-[#8a5f41] ring-4 ring-[#d2bca2]/45'
                  : darkMode
                    ? 'bg-gradient-to-br from-[#5b402f] to-[#4a3527]'
                    : 'bg-gradient-to-br from-[#eadfce] to-[#d2bca2]'
              }
            `}
          >
            <PlaceIcon className={`w-6 h-6 ${darkMode ? 'text-[#f5e9da]' : 'text-[#3f2b1e]'}`} />
          </div>
          <div className={`w-0.5 flex-1 mt-2 rounded-full ${darkMode ? 'bg-gradient-to-b from-[#4a3527] to-[#2c2019]' : 'bg-gradient-to-b from-[#cfaa83] to-[#d2bca2]'}`} />
        </div>

        <div className="flex-1 pb-5 sm:pb-8">
          <div className="flex flex-wrap gap-2 mb-2">
            {upcoming && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#cfaa83] text-[#4a3527] ring-1 ring-[#af8a68]/40">
                Segera
              </span>
            )}
            {today && !upcoming && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eadfce] text-[#6a4a35]">
                Hari Ini
              </span>
            )}
          </div>

          <div
            className={`
              relative rounded-2xl sm:rounded-3xl p-4 sm:p-6 overflow-hidden
              transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 shadow-md
              ${darkMode
                ? 'bg-[#372820]/95 border border-[#5d4332] group-hover:border-[#8a5f41]'
                : 'bg-[#fffaf3]/85 border border-[#cfaa83]/55 group-hover:border-[#af8a68]'
              }
            `}
          >
            <div className={`absolute top-0 right-0 w-20 h-20 rounded-bl-[40px] rounded-tr-3xl opacity-30 ${darkMode ? 'bg-gradient-to-bl from-[#5f432f]/45' : 'bg-gradient-to-bl from-[#eadfce]'}`} />

            <div className="flex items-start justify-between mb-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className={`inline-flex flex-wrap items-center gap-1.5 px-3 py-1 rounded-xl text-sm font-medium ${darkMode ? 'bg-[#5b402f] text-[#f4e6d6] border border-[#7b5a43]' : 'bg-[#eadfce] text-[#6a4a35]'}`}>
                  <Icon.clock className="w-4 h-4" />
                  <span className="text-xs font-semibold">Mulai</span>
                  <span>{formatTime(activity.datetime)}</span>
                  <span className={`mx-1 ${darkMode ? 'text-[#d0b49a]' : 'text-[#af8a68]'}`}>•</span>
                  <span className="text-xs">{formatDate(activity.datetime)}</span>
                </div>

                {activity.end_datetime && (
                  <div className={`inline-flex flex-wrap items-center gap-1.5 px-3 py-1 rounded-xl text-sm font-medium ${darkMode ? 'bg-[#4a3527] text-[#eadfce] border border-[#6b4f3b]' : 'bg-[#f1e6d8] text-[#6a4a35] border border-[#cfaa83]/60'}`}>
                    <Icon.clock className="w-4 h-4" />
                    <span className="text-xs font-semibold">Selesai</span>
                    <span>{formatTime(activity.end_datetime)}</span>
                    <span className={`mx-1 ${darkMode ? 'text-[#d0b49a]' : 'text-[#af8a68]'}`}>•</span>
                    <span className="text-xs">{formatDate(activity.end_datetime)}</span>
                  </div>
                )}
              </div>
            </div>

            <h3 className={`font-display text-xl sm:text-2xl font-semibold mb-2 leading-tight tracking-tight ${darkMode ? 'text-[#eadfce]' : 'text-[#3f2b1e]'}`}>
              {activity.title}
            </h3>

            {activity.description && (
              <p className={`text-sm sm:text-base leading-relaxed mb-4 ${darkMode ? 'text-[#d7c0ab]' : 'text-[#7d6049]'}`}>
                {activity.description}
              </p>
            )}

            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 mt-4 pt-4 border-t border-dashed border-[#cfaa83]/45">
              {(activity.maps_url || activity.tiktok_url) && (
                <div className="inline-flex items-center gap-2">
                  {activity.maps_url && (
                    <a
                      href={activity.maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Buka Maps"
                      aria-label="Buka Maps"
                      className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-r from-[#8a5f41] to-[#9c6a46] text-white transition-all duration-200 hover:brightness-105 hover:shadow-lg hover:shadow-[#8a5f41]/20 active:scale-95"
                    >
                      <Icon.route className="w-4 h-4" />
                    </a>
                  )}

                  {activity.tiktok_url && (
                    <a
                      href={activity.tiktok_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Buka TikTok"
                      aria-label="Buka TikTok"
                      className={`inline-flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200 active:scale-95 ${darkMode ? 'bg-[#5b402f] text-[#f4e6d6] border border-[#7b5a43] hover:bg-[#6a4a35]' : 'bg-[#eadfce] text-[#3f2b1e] hover:bg-[#d2bca2]'}`}
                    >
                      <Icon.tiktok className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}

              <div className="sm:ml-auto grid grid-cols-2 sm:flex items-center gap-2">
                <button
                  onClick={() => onEdit(activity)}
                  className={`inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 ${darkMode ? 'bg-[#5b402f] text-[#f4e6d6] border border-[#7b5a43] hover:bg-[#6a4a35]' : 'bg-[#eadfce] text-[#6a4a35] hover:bg-[#d2bca2]'}`}
                >
                  <Icon.edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => onDelete(activity.id)}
                  className={`inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 ${darkMode ? 'bg-[#5d2727]/50 text-[#f0c4c4] hover:bg-[#5d2727]' : 'bg-[#f3dede] text-[#7a2f2f] hover:bg-[#e7c2c2]'}`}
                >
                  <Icon.trash className="w-4 h-4" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import React from 'react'
import ActivityCard from './ActivityCard'
import { parseActivityDateTime } from '../utils/datetime'

const CalendarIcon = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M16 3v4M8 3v4M3 10h18" />
  </svg>
)

const EmptyState = ({ darkMode, onAdd }) => (
  <div className="flex flex-col items-center justify-center py-14 px-4 text-center animate-fade-in">
    <div className={`w-16 h-16 rounded-2xl mb-4 flex items-center justify-center ${darkMode ? 'bg-[#3b2a21] text-[#d2bca2]' : 'bg-[#eadfce] text-[#6a4a35]'}`}>
      <CalendarIcon className="w-7 h-7" />
    </div>
    <h3 className={`font-display text-2xl font-semibold mb-2 ${darkMode ? 'text-[#eadfce]' : 'text-[#3f2b1e]'}`}>
      Belum Ada Kegiatan
    </h3>
    <p className={`text-sm max-w-xs mb-6 ${darkMode ? 'text-[#bda58f]' : 'text-[#7d6049]'}`}>
      Mulai rencanakan perjalananmu. Tambahkan destinasi pertamamu.
    </p>
    <button
      onClick={onAdd}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm bg-gradient-to-r from-[#8a5f41] to-[#9c6a46] text-white transition-all duration-200 hover:brightness-105 hover:shadow-lg hover:shadow-[#8a5f41]/25 active:scale-95"
    >
      Tambah Destinasi
    </button>
  </div>
)

const groupByDate = (activities) => {
  const groups = {}
  activities.forEach((act) => {
    const date = parseActivityDateTime(act.datetime)
    if (!date) return
    const dateKey = date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    if (!groups[dateKey]) groups[dateKey] = []
    groups[dateKey].push(act)
  })
  return groups
}

export default function Timeline({ activities, loading, onEdit, onDelete, onAdd, darkMode }) {
  if (loading) {
    return (
      <div className="space-y-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`h-36 rounded-3xl animate-shimmer ${darkMode ? 'bg-[#3b2a21]' : 'bg-[#eadfce]'}`} />
        ))}
      </div>
    )
  }

  if (activities.length === 0) return <EmptyState darkMode={darkMode} onAdd={onAdd} />

  const grouped = groupByDate(activities)

  return (
    <div>
      {Object.entries(grouped).map(([dateLabel, items], groupIdx) => (
        <div key={dateLabel} className="mb-3">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div
              className={`
                inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-wide
                ${darkMode
                  ? 'bg-[#3b2a21] text-[#e6d2b9] border border-[#5e4534] shadow-lg shadow-black/20'
                  : 'bg-[#cfaa83] text-[#4a3527] border border-[#af8a68]/50 shadow-sm'
                }
              `}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>{dateLabel}</span>
            </div>
            <div className={`flex-1 h-px ${darkMode ? 'bg-gradient-to-r from-[#5e4534] to-transparent' : 'bg-gradient-to-r from-[#af8a68] to-transparent'}`} />
          </div>

          {items.map((activity, idx) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              index={groupIdx * 5 + idx}
              onEdit={onEdit}
              onDelete={onDelete}
              darkMode={darkMode}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

'use client'

// A local record of what actually rang, so a counter has a day's tally.

const KEY = 'lb.takings'
const CAP = 200

export interface Taking {
  hash: string
  value: number
  memo: string
  at: number
  addr: string
}

export function loadTakings(): Taking[] {
  try {
    const raw = localStorage.getItem(KEY)
    const list = raw ? (JSON.parse(raw) as Taking[]) : []
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

export function addTaking(entry: Taking): Taking[] {
  const list = loadTakings()
  if (list.some((t) => t.hash === entry.hash)) return list
  const next = [entry, ...list].slice(0, CAP)
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* storage full or blocked, the tally is a convenience */
  }
  return next
}

export function clearTakings(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* nothing to do */
  }
}

export function takingsToday(list: Taking[]): Taking[] {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  return list.filter((t) => t.at >= start.getTime())
}

export function sumLuna(list: Taking[]): number {
  return list.reduce((total, t) => total + t.value, 0)
}

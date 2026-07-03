export function fmtDate(ts){
  if(!ts) return ''
  const d = ts?.toDate ? ts.toDate() : new Date(ts)
  if(Number.isNaN(d.getTime())) return ''
  return d.toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

export function matchTitles(a,b){
  if(!a||!b) return false
  const sanitize = s => (s || '').toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(Boolean)
  const A = sanitize(a)
  const B = sanitize(b)
  const common = A.filter(x => B.includes(x))
  return common.length >= Math.min(2, Math.max(1, Math.floor(Math.min(A.length, B.length) / 2)))
}

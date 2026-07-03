export function fmtDate(ts){
  if(!ts) return ''
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleString()
}

export function matchTitles(a,b){
  if(!a||!b) return false
  const sanitize = s=>s.toLowerCase().replace(/[^a-z0-9 ]/g,'')
  const A = sanitize(a).split(' ')
  const B = sanitize(b).split(' ')
  const common = A.filter(x=>B.includes(x))
  return common.length >= Math.min(2, Math.max(1, Math.floor(Math.min(A.length,B.length)/2)))
}

import React from 'react'
import StatusBadge from '../StatusBadge/StatusBadge'

export default function SimpleTable({columns,rows,actions}){
  return (
    <div className="table-responsive card card-custom p-3">
      <table className="table table-hover align-middle">
        <thead>
          <tr>
            {columns.map(c=><th key={c.key}>{c.label}</th>)}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.length===0 && (
            <tr><td colSpan={columns.length+1} className="text-center py-4 text-muted">No records found</td></tr>
          )}
          {rows.map(r=> (
            <tr key={r.id}>
              {columns.map(c=> (
                <td key={c.key}>{c.key==='status'? <StatusBadge status={r[c.key]} /> : (r[c.key]||'')}</td>
              ))}
              <td className="text-end">
                {actions && actions.map((A,idx)=>(<button key={idx} className="btn btn-sm btn-outline-primary ms-1" onClick={()=>A.onClick(r)}>{A.label}</button>))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
